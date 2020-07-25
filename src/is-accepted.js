import { stubTrue } from '@dword-design/functions'

export default options => {
  options = { filter: stubTrue, ...options }
  return entity => (entity |> options.filter) && !entity._deleted
}
