import { Renderer2 } from '@angular/core';
import { IPoint } from './point';

export class Tracing {
    attributs: {
        'color': string,
        'stroke-width': string,
        'stroke': string,
        'stroke-linecap': string,
        'size': number,
        'd': string,
        'offsetX': number,
        'offsetY': number
    };
    arraySaved: IPoint[];
    pathElem: Node | null;
    pathString: string;
    id: number;
    addClass: boolean;

    constructor(public renderer: Renderer2) {
        this.attributs = {
            'color': 'black',
            'stroke-width': '1',
            'stroke': 'black',
            'stroke-linecap': 'round',
            'size': 1,
            'd': '',
            'offsetX': 1,
            'offsetY': 1,
        };
        this.arraySaved = [];
        this.pathString = '';
        this.id = 0;
        this.addClass = false;
    }

    updatePositions(evt: MouseEvent, scrollableWindow: HTMLElement | null): void {
        if (scrollableWindow) {
            const clientRect = scrollableWindow.getBoundingClientRect();
            let pointX: number;
            let pointY: number;

            // if (this.isSpray) {
            //     pointX = this.attributs.offsetX + evt.clientX + scrollableWindow.scrollLeft - clientRect.left;
            //     pointY = this.attributs.offsetY + evt.clientY + scrollableWindow.scrollTop - clientRect.top;
            // } else {
                pointX = evt.clientX + scrollableWindow.scrollLeft - clientRect.left;
                pointY = evt.clientY + scrollableWindow.scrollTop - clientRect.top;
            // }
            this.arraySaved.push({x: +(pointX).toFixed(2), y: +(pointY).toFixed(2)});
        }
    }

    tracePath(depth: number): SVGElement {
        const path: SVGElement = this.renderer.createElement('path', 'svg');
        this.updatePathString();
        if (this.addClass) {
            path.setAttribute('id', (this.id++).toString());
        }
        path.setAttribute('colour-type', 'stroke');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', this.pathString);
        path.setAttribute('stroke', this.attributs.color);
        path.setAttribute('stroke-width', `${this.attributs.size}`);
        path.setAttribute('stroke-linejoin', "round");
        path.setAttribute('stroke-linecap', this.attributs['stroke-linecap']);
        path.setAttribute('depth', `${depth}`);
        this.pathElem = path;
        return path;
    }

    updatePathString(): string {
        if (this.arraySaved.length) {
            const lastPoint = this.arraySaved.length - 1;
            const pointTo: IPoint = this.arraySaved[lastPoint];
            const pointFrom: IPoint = this.arraySaved[this.arraySaved.length - 2];

            if (this.arraySaved.length - 2 >= 0) {
                this.pathString += 'L ' + pointTo.x + ' ' + pointTo.y;
            } else {  // si un point seul
                this.pathString += 'M ' + this.arraySaved[0].x + ' ' + this.arraySaved[0].y +
                ' L ' + this.arraySaved[0].x + ' ' + this.arraySaved[0].y;
            }
        }
        return this.pathString;
    }

    emptyArraySaved(): void {
        this.arraySaved.splice(0, this.arraySaved.length);
    }
}
