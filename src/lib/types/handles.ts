type HandleType = 'target' | 'source'

export type HandleProps = {
  type: HandleType
  id: string
}

export type StartHandlePayload = {
  sourceNode: string,
  source: string
}

export enum HandlePosition {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
}

