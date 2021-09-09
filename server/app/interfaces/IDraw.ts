export interface IDraw {
    tool : Tool;  // pencil vs. eraser
    type : EventType;
    pointX : number;
    pointY : number;
    color : string; // watch out
    size: number;
}

export enum Tool {
    PENCIL,
    ERASER,
}

export enum EventType {
    MOUSE_MOVE,
    MOUSE_CLICK,
    MOUSE_UP,
    MOUSE_DOWN,
    MOUSE_ENTER,
    MOUSE_OUT,
    MOUSE_LEAVE,
}
  