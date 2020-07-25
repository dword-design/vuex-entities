import { v4 as uuid } from 'uuid'

export default change => {
  if (!change.id) {
    change.id = uuid()
  }
}
