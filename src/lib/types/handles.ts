import type { Rect } from './dragger';

export type HandleType = 'target' | 'source';

export type DescriberType = Record<string, any>;

export type HandleProps = {
  type: HandleType;
  handleId: string;
  nodeId: string;
  selected?: boolean;
  disable?: boolean;
  /**
   * An object for user to descibe the specific handle
   * such desciber will alsow provided in those handle
   * related callbacks such as edge connect
   */
  describer?: DescriberType;
};

export type StartHandlePayload = {
  sourceNode: string;
  source: string;
};

export enum HandlePosition {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
}

export interface HandleElement extends Rect {
  id: string;
}
