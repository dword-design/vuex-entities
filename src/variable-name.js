import { lowerCaseFirst } from 'lower-case-first'

export default typeName => `${typeName |> lowerCaseFirst}s`
