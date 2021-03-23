import {
  flatten,
  forEach,
  groupBy,
  keys,
  map,
  mapKeys,
  mapValues,
  noop,
  omit,
  pickBy,
  stubTrue,
  values,
} from '@dword-design/functions'

import addId from './add-id'
import getTypeStore from './get-type-store'
import isAccepted from './is-accepted'
import normalizeType from './normalize-type'
import variableName from './variable-name'

export default (options = {}) => store => {
  options = { filter: stubTrue, plugins: [], types: {}, ...options }
  options.types =
    options.types
    |> mapValues((type, name) => ({ name, ...type }))
    |> mapValues(normalizeType)
  const unpersistedPropertyNamesByType =
    options.types
    |> mapValues(
      type => type.computed |> pickBy(computed => !computed.persisted) |> keys
    )
  const fireOnPersist = payload =>
    forEach(options.plugins, plugin => plugin.onPersist(payload))
  store.registerModule('entities', {
    actions: {
      inject: (context, changes) => context.dispatch('update', { changes }),
      put: (context, changes) =>
        context.dispatch('update', { changes, persisted: true }),
      reset: context =>
        options.types
        |> mapValues(type =>
          context.dispatch(`${variableName(type.name)}/reset`)
        )
        |> values
        |> Promise.all,
      update: (context, payload) => {
        const changes = [].concat(payload.changes)
        forEach(changes, addId)
        const previousValueByType = payload.persisted
          ? options.types
            |> mapValues(type => context.state[type.name |> variableName].value)
          : {}
        const updatesByType =
          changes
          |> groupBy('typeName')
          |> mapValues((changesOfType, typeName) =>
            context.getters[`${typeName |> variableName}/getUpdates`]({
              changes: changesOfType,
              persisted: payload.persisted,
            })
          )
        if (payload.persisted) {
          const persistedChanges =
            updatesByType
            |> mapValues(
              (update, typeName) =>
                update.changes
                |> map(omit(unpersistedPropertyNamesByType[typeName]))
            )
            |> values
            |> flatten
          console.log('Persisting changes:')
          forEach(persistedChanges, change => console.log(change))
          fireOnPersist({
            changes: persistedChanges,
            previousValueByType,
            valueByType: updatesByType |> mapValues('value'),
          })
        }
        forEach(updatesByType, (update, typeName) =>
          context.commit(
            `${typeName |> variableName}/set`,
            update.value |> pickBy(isAccepted(options))
          )
        )
        forEach(updatesByType, (update, typeName) =>
          forEach(update.changes, change =>
            context.commit(`${typeName |> variableName}/onChange`, {
              ...change,
              ...(!(change |> isAccepted(options)) && { _deleted: true }),
            })
          )
        )
      },
    },
    modules:
      options.types
      |> mapValues(getTypeStore(options))
      |> mapKeys((type, typeName) => typeName |> variableName),
    namespaced: true,
  })
  options.plugins =
    options.plugins
    |> map(plugin => ({
      onPersist: noop,
      ...plugin({ store, types: options.types }),
    }))
}
