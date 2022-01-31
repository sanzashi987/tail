type HandleType = 'target' | 'source'

export type HandlesProps = {
  type: HandleType
  id: string
}

export type StartHandlePayload = {
  sourceNode: string,
  source: string
}