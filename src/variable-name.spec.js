import { mapValues } from '@dword-design/functions'

import self from './variable-name'

const runTest = (dest, src) => () => expect(src |> self).toEqual(dest)

export default {
  Task: 'tasks',
  WhenState: 'whenStates',
} |> mapValues(runTest)
