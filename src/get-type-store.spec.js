import { mapValues, pick } from '@dword-design/functions'

import self from './get-type-store'
import normalizeType from './normalize-type'

const runGetUpdatesTest = config => () => {
  config = {
    changes: [],
    persisted: false,
    result: {},
    ...config,
    type: config.type |> normalizeType,
  }

  const result = ({ name: 'Foo', ...config.type } |> self()).getters.getUpdates(
    {
      value: config.value,
    }
  )(config |> pick(['changes', 'persisted']))
  expect(result).toEqual(config.result)
}

export default {
  get: () =>
    expect(({} |> self()).getters.get({ value: 'foo' })).toEqual('foo'),
  update:
    {
      'computed: deleted': {
        changes: [{ _deleted: true, id: 1, typeName: 'Foo' }],
        result: {
          changes: [{ _deleted: true, id: 1, typeName: 'Foo' }],
          value: {},
        },
        type: {
          computed: { bar: { calculate: () => 1 } },
        },
      },
      'computed: local': {
        changes: [{ foo: 1, id: 1, typeName: 'Foo' }],
        result: {
          changes: [{ bar: 2, foo: 1, id: 1, typeName: 'Foo' }],
          value: { 1: { bar: 2, foo: 1, id: 1, typeName: 'Foo' } },
        },
        type: {
          computed: { bar: entity => entity.foo + 1 },
        },
      },
      'computed: none': {
        changes: [{ id: 1, typeName: 'Foo' }],
        result: {
          changes: [{ id: 1, typeName: 'Foo' }],
          value: { 1: { id: 1, typeName: 'Foo' } },
        },
      },
      'computed: propagated': {
        changes: [{ foo: 1, id: 1, typeName: 'Foo' }],
        result: {
          changes: [{ computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' }],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: 'foo' },
        },
      },
      'computed: propagated [child, parent]': {
        changes: [
          { id: 2, parentId: 1, typeName: 'Foo' },
          { foo: 1, id: 1, typeName: 'Foo' },
        ],
        result: {
          changes: [
            { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          ],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            2: { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: { calculate: 'foo' } },
        },
      },
      'computed: propagated [existing, child]': {
        changes: [{ id: 2, parentId: 1, typeName: 'Foo' }],
        result: {
          changes: [{ computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' }],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            2: { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: { calculate: 'foo' } },
        },
        value: { 1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' } },
      },
      'computed: propagated [existing, parent]': {
        changes: [{ computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' }],
        result: {
          changes: [
            { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            { computedFoo: 1, id: 2, typeName: 'Foo' },
          ],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            2: { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: { calculate: 'foo' } },
        },
        value: { 2: { id: 2, parentId: 1, typeName: 'Foo' } },
      },
      'computed: propagated [parent, child deleted]': {
        changes: [
          { foo: 1, id: 1, typeName: 'Foo' },
          { _deleted: true, id: 2, parentId: 1, typeName: 'Foo' },
        ],
        result: {
          changes: [
            { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            { _deleted: true, id: 2, parentId: 1, typeName: 'Foo' },
          ],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: { calculate: 'foo' } },
        },
      },
      'computed: propagated [parent, child]': {
        changes: [
          { foo: 1, id: 1, typeName: 'Foo' },
          { id: 2, parentId: 1, typeName: 'Foo' },
        ],
        result: {
          changes: [
            { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          ],
          value: {
            1: { computedFoo: 1, foo: 1, id: 1, typeName: 'Foo' },
            2: { computedFoo: 1, id: 2, parentId: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: { calculate: 'foo' } },
        },
      },
      'computed: propagated: not set': {
        changes: [{ id: 1, typeName: 'Foo' }],
        result: {
          changes: [{ id: 1, typeName: 'Foo' }],
          value: {
            1: { id: 1, typeName: 'Foo' },
          },
        },
        type: {
          computed: { computedFoo: 'foo' },
        },
      },
    } |> mapValues(runGetUpdatesTest),
}
