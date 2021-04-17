import Vue from 'vue'
import Vuex from 'vuex'

import self from '.'

Vue.use(Vuex)

export default {
  plugins: () => {
    const store = new Vuex.Store({
      plugins: [
        self({
          plugins: [
            context => ({
              init: () =>
                context.store.dispatch('entities/inject', [
                  { id: 'foo', title: 'Foo', typeName: 'Task' },
                ]),
            }),
            context => ({
              init: () =>
                context.store.dispatch('entities/inject', [
                  { id: 'bar', title: 'Bar', typeName: 'Task' },
                ]),
            }),
          ],
          types: {
            Task: {},
          },
        }),
      ],
    })
    expect({ ...store.state.entities.tasks.value }).toEqual({
      bar: { id: 'bar', title: 'Bar', typeName: 'Task' },
      foo: { id: 'foo', title: 'Foo', typeName: 'Task' },
    })
  },
  reset: async () => {
    const store = new Vuex.Store({
      plugins: [
        self({
          types: {
            Task: {},
          },
        }),
      ],
    })
    store.dispatch('entities/inject', [
      { id: 'foo', title: 'Foo', typeName: 'Task' },
    ])
    expect({ ...store.state.entities.tasks.value }).toEqual({
      foo: { id: 'foo', title: 'Foo', typeName: 'Task' },
    })
    await store.dispatch('entities/reset')
    expect({ ...store.state.entities.tasks.value }).toEqual({})
  },
  'reset with plugin': async () => {
    const store = new Vuex.Store({
      plugins: [
        self({
          plugins: [
            context => ({
              init: () =>
                context.store.dispatch('entities/inject', [
                  { id: 'foo', title: 'Foo', typeName: 'Task' },
                ]),
            }),
          ],
          types: {
            Task: {},
          },
        }),
      ],
    })
    expect({ ...store.state.entities.tasks.value }).toEqual({
      foo: { id: 'foo', title: 'Foo', typeName: 'Task' },
    })
    await store.dispatch('entities/reset')
    expect({ ...store.state.entities.tasks.value }).toEqual({
      foo: { id: 'foo', title: 'Foo', typeName: 'Task' },
    })
  },
  works: async () => {
    const store = new Vuex.Store({
      plugins: [
        self({
          types: {
            Task: {},
          },
        }),
      ],
    })
    await store.dispatch('entities/inject', [
      { id: 'foo', title: 'Foo', typeName: 'Task' },
    ])
    expect({ ...store.state.entities.tasks.value }).toEqual({
      foo: { id: 'foo', title: 'Foo', typeName: 'Task' },
    })
  },
}
