import { forIn, pickBy } from '@dword-design/functions'

export default change => {
  const unprocessed =
    change._attachments || {} |> pickBy(attachment => !attachment.stub)
  forIn((attachment, attachmentId) => {
    attachment.url = URL.createObjectURL(attachment.data)
    attachment.id = attachmentId
    attachment.stub = true
    delete attachment.data
  })(unprocessed)
}
