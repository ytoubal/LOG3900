export class PathPoint {
    x : number;
    y : number;

    constructor (x:string, y: string, ratioX: number, ratioY: number) {
        this.x = parseFloat(x) * ratioX;
        this.y = parseFloat(y) * ratioY;
    }

    isEqual (compared: PathPoint): boolean {
        return (this.x == compared.x && this.y == compared.y)
    }

    isSamePath(compared : PathPoint, distance) : boolean {        // if points vary too greatly, assume it's another path.
        const x = Math.abs(this.x - compared.x) <= distance;
        const y = Math.abs(this.y - compared.y) <= distance;
        return (x && y);
    }
}

export interface IPathExtremes {
    PATH : number;
    MIN_X : number;
    MAX_X : number;
    MIN_Y : number;
    MAX_Y : number;
    MIN_DIST: number;
    MAX_DIST: number;
}

export interface IPathDetails {
    pathPoints : PathPoint[];
    color: string;
    size : number;
    depth : number;
}
