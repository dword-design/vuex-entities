import { mapValues } from '@dword-design/functions'

import self from './is-accepted'

const runTest = config => () => {
  config = { filter: () => true, ...config }
  expect(config.entity |> self({ filter: config.filter })).toEqual(
    config.result
  )
}

export default {
  deleted: {
    entity: { _deleted: true },
    result: false,
  },
  filtered: {
    entity: { done: true },
    filter: entity => !entity.done,
    result: false,
  },
  valid: {
    entity: {},
    result: true,
  },
} |> mapValues(runTest)
