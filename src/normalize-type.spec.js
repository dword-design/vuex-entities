import { mapValues } from '@dword-design/functions'
import sortObjectKeys from 'sort-object-keys'

import self from './normalize-type'

const runTest = config => () =>
  expect(config.source |> self |> sortObjectKeys |> JSON.stringify).toEqual(
    config.result |> sortObjectKeys |> JSON.stringify
  )

export default {
  'computed: persisted': {
    result: {
      actions: {},
      computed: { foo: { calculate: 'bar', persisted: true } },
      datePaths: [],
      getters: {},
      mutations: {},
    },
    source: {
      computed: { foo: { calculate: 'bar', persisted: true } },
    },
  },
  'computed: simple': {
    result: {
      actions: {},
      computed: { foo: { calculate: 'bar', persisted: false } },
      datePaths: [],
      getters: {},
      mutations: {},
    },
    source: {
      computed: { foo: 'bar' },
    },
  },
  empty: {
    result: {
      actions: {},
      computed: {},
      datePaths: [],
      getters: {},
      mutations: {},
    },
    source: {},
  },
  populated: {
    result: {
      actions: { test: () => {} },
      computed: {},
      datePaths: ['foo'],
      getters: { bar: () => {} },
      mutations: { baz: () => {} },
    },
    source: {
      actions: { test: () => {} },
      datePaths: ['foo'],
      getters: { bar: () => {} },
      mutations: { baz: () => {} },
    },
  },
  undefined: {
    result: {
      actions: {},
      computed: {},
      datePaths: [],
      getters: {},
      mutations: {},
    },
    source: {},
  },
} |> mapValues(runTest)
