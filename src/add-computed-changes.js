import { forEach, isEqual } from '@dword-design/functions'

export default (change, context) => {
  const entity = context.value[change.id]
  if (!entity) {
    return
  }
  if (typeof context.property.calculate === 'string') {
    const parent = context.value[entity.parentId]

    const newValue =
      entity[context.property.calculate] || parent?.[context.name]
    if (newValue !== undefined) {
      context.addChange({
        id: change.id,
        typeName: change.typeName,
        [context.name]: newValue,
      })
    }
    if (change[context.property.calculate] !== undefined) {
      const rec = currentValue => currentEntity => {
        if (
          currentEntity.id === entity.id ||
          currentEntity[context.property.calculate] === undefined
        ) {
          const computedValue =
            currentEntity[context.property.calculate] || currentValue
          if (currentEntity.id !== entity.id) {
            if (!isEqual(computedValue, currentEntity[context.name])) {
              context.addChange({
                id: currentEntity.id,
                typeName: change.typeName,
                [context.name]: computedValue,
              })
            }
          }
          forEach(context.value, child => {
            if (child.parentId === currentEntity.id) {
              rec(computedValue)(child)
            }
          })
        }
      }
      rec(newValue)(entity)
    }
  } else {
    context.addChange({
      id: change.id,
      typeName: change.typeName,
      [context.name]: context.property.calculate(entity),
    })
  }
}
