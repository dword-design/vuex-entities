import { forEach, pickBy } from '@dword-design/functions'

export default change => {
  const unprocessed =
    change._attachments || {} |> pickBy(attachment => !attachment.stub)
  forEach(unprocessed, (attachment, attachmentId) => {
    attachment.url = URL.createObjectURL(attachment.data)
    attachment.id = attachmentId
    attachment.stub = true
    delete attachment.data
  })
}
