import { mapValues } from '@dword-design/functions'
import sortKeys from 'sort-keys'

import self from './normalize-type'

const runTest = config => () =>
  expect(config.source |> self |> sortKeys |> JSON.stringify).toEqual(
    config.result |> sortKeys |> JSON.stringify
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
