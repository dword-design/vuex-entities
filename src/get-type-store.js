import {
  forEach,
  map,
  mapValues,
  pickBy,
  values,
} from '@dword-design/functions'

import addComputedChanges from './add-computed-changes'
import isAccepted from './is-accepted'

export default options => type => ({
  actions: {
    inject: (context, changes) => {
      changes = [].concat(changes)

      return context.dispatch(
        'entities/inject',
        changes |> map(change => ({ typeName: type.name, ...change })),
        { root: true }
      )
    },
    put: (context, changes) => {
      changes = [].concat(changes)

      return context.dispatch(
        'entities/put',
        changes |> map(change => ({ typeName: type.name, ...change })),
        { root: true }
      )
    },
    reset: context =>
      context.dispatch(
        'inject',
        context.getters.get
          |> mapValues(entity => ({ _deleted: true, id: entity.id }))
          |> values
      ),
    ...type.actions,
  },
  getters: {
    get: state => state.value,
    getUpdates: (state, getters, rootState, rootGetters) => payload => {
      const changesById = {}

      const value = { ...state.value }

      const addChange = change => {
        if (change._deleted) {
          delete value[change.id]
        } else {
          value[change.id] = { ...value[change.id], ...change }
        }
        changesById[change.id] = { ...changesById[change.id], ...change }
      }

      const computed =
        type.computed
        |> pickBy(property => payload.persisted || !property.persisted)
      for (const change of payload.changes) {
        addChange(change)
        if (change |> isAccepted(options)) {
          forEach(computed, (property, name) =>
            addComputedChanges(change, { addChange, name, property, value })
          )
          type.addChanges(change, {
            addChange,
            persisted: payload.persisted,
            rootGetters,
            value,
          })
        }
      }

      return {
        changes: changesById |> values,
        value,
      }
    },
    ...type.getters,
  },
  mutations: {
    onChange: () => {},
    set: (state, value) => (state.value = value),
    ...type.mutations,
  },
  namespaced: true,
  state: () => ({ value: {} }),
})
