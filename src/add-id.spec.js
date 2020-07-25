import { mapValues } from '@dword-design/functions'
import { v4 as isUuid } from 'is-uuid'

import self from './add-id'

const runTest = config => () => {
  self(config.entity)
  config.test(config.entity)
}

export default {
  existing: {
    entity: { id: 'foo' },
    test: entity => expect(entity.id).toEqual('foo'),
  },
  'non-existing': {
    entity: {},
    test: entity => expect(entity.id |> isUuid).toBeTruthy(),
  },
} |> mapValues(runTest)
