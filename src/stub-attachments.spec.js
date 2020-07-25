import { mapValues } from '@dword-design/functions'

import self from './stub-attachments'

const runTest = config => () => {
  const oldUrl = global.URL
  global.URL = { createObjectURL: data => `${data}1` }
  self(config.entity)
  expect(config.entity).toEqual(config.result)
  global.URL = oldUrl
}

export default {
  data: {
    entity: { _attachments: { 1: { data: 'foo' } } },
    result: { _attachments: { 1: { id: '1', stub: true, url: 'foo1' } } },
  },
  empty: {
    entity: {},
    result: {},
  },
  stub: {
    entity: { _attachments: { 1: { stub: true } } },
    result: { _attachments: { 1: { stub: true } } },
  },
} |> mapValues(runTest)
