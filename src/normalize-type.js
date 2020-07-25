import { mapValues, noop } from '@dword-design/functions'

export default type => ({
  actions: {},
  addChanges: noop,
  datePaths: [],
  getters: {},
  mutations: {},
  ...type,
  computed:
    type?.computed || {}
    |> mapValues(computed =>
      typeof computed === 'object'
        ? computed
        : { calculate: computed, persisted: false }
    ),
})
