export type DraggerIterState = {
  x: number,
  y: number,
  lastX: number,
  lastY: number
}

export type coordinates = {
  x: number;
  y: number;
};

export type rect = {
  width: number
  height: number
}

export type DraggerCoreBasic = {
  disable?: boolean;
  nodeRef?: React.RefObject<HTMLDivElement>;
  getScale?: () => number;
};

export type DraggerCoreProps<T> = {
  onStart: T;
  onDrag: T;
  onStop: T;
  children?: any;
} & DraggerCoreBasic;

export type BasicPosture = {
  x: number;
  y: number;
  w: number;
  h: number;
  deg?: number;
} & { [key: string]: any };

type PostureSetterTrigger = 'drag' | 'resize' | 'rotate';
type PostureSetterType = (
  e: Partial<BasicPosture>,
  trigger: PostureSetterTrigger,
  end: boolean,
) => void;
type DraggerStarter = (e: React.MouseEvent) => boolean;

export type ReactDraggerProps = {
  posture: BasicPosture;
  shouldDragStart?: DraggerStarter;
  setPosture: PostureSetterType;
  children: any;
} & DraggerCoreBasic;

export type ReactResizerProps = {
  className?: string;
  posture: BasicPosture;
  disable?: boolean;
  shouldResizeStart?: DraggerStarter;
  shouldRotateStart?: DraggerStarter;
  setPosture: PostureSetterType;
  handles?: ResizerHandleType[];
  lockAspectRatio?: (() => boolean) | boolean;
} & DraggerCoreBasic;

export type ResizerHandleCallback = (
  e: React.MouseEvent,
  c: coordinates,
  v: StandardVector,
) => false | void;
export type ResizerHandleCallbackNative = (
  e: MouseEvent,
  c: coordinates,
  v: StandardVector,
) => false | void;

export type ResizerHandleType = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';
export type ResizerHandleProps = {
  heading: ResizerHandleType;
  onResizeStart?: ResizerHandleCallback;
  onResizing?: ResizerHandleCallbackNative;
  onResizeEnd?: ResizerHandleCallbackNative;
  onRotateStart?: ResizerHandleCallback;
  onRotating?: ResizerHandleCallbackNative;
  onRotateEnd?: ResizerHandleCallbackNative;
} & DraggerCoreBasic;

export type CursorStyle = 'nwse' | 'ns' | 'nesw' | 'ew';
export type Directions = 'n' | 's' | 'e' | 'w';
export type DegToCursorType = { start: number; end: number; cursor: CursorStyle }[];

export type StandardNumber = -1 | 0 | 1;
export type StandardVector = [StandardNumber, StandardNumber];

export type ReactActivatorProps = {
  // id: string;
  active: boolean;
  x: number;
  y: number;
  style?: any;
  className?: any;
  onMouseDown?: any;
  nodeRef: React.RefObject<HTMLDivElement>;
  hide?: boolean;
  semi?: boolean;
  hover?: boolean;
  lock?: boolean;
  relOffsetX?: number;
  relOffsetY?: number;
  setStatus(...e: any[]): void;
  getParent: any;
};

export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void | false;
export type ResizerEventHandler = (
  e: MouseEvent,
  data: DraggableData,
  v: StandardVector,
) => false | void;

export type ReszierHandleCore<T = ResizerEventHandler> = {
  heading: ResizerHandleType;
  onRotateStart: T;
  onRotateDrag: T;
  onRotateStop: T;
} & DraggerCoreProps<T>;

export type DraggableData = {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
};

export type PositionOffsetControlPosition = { x: number | string; y: number | string };
export type EventHandler<T> = (e: T) => void | false;

export interface TouchEvent2 extends TouchEvent {
  changedTouches: TouchList;
  targetTouches: TouchList;
}

export type MouseTouchEvent = MouseEvent & TouchEvent2;
