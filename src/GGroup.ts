/// <reference path="./GObject.ts" />

namespace fgui {

    export class GGroup extends GObject {

        protected $empty: boolean;

        /**@internal */
        $updating: boolean;

        protected createDisplayObject():void {
            let c = new UIContainer(this);
            c.interactive = false;
            this.setDisplayObject(c);
        }

        public updateBounds(): void {
            if (this.$updating || !this.parent)
                return;

            let cnt: number = this.$parent.numChildren;
            let i: number = 0;
            let ax: number = Number.POSITIVE_INFINITY, ay: number = Number.POSITIVE_INFINITY;
            let ar: number = Number.NEGATIVE_INFINITY, ab: number = Number.NEGATIVE_INFINITY;
            this.$empty = true;
            let child: GObject;
            let tmp: number = 0;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this) {
                    tmp = child.x;
                    if (tmp < ax) ax = tmp;
                    tmp = child.y;
                    if (tmp < ay) ay = tmp;
                    tmp = child.x + child.width;
                    if (tmp > ar) ar = tmp;
                    tmp = child.y + child.height;
                    if (tmp > ab) ab = tmp;
                    this.$empty = false;
                }
            }

            this.$updating = true;
            if (!this.$empty) {
                this.setXY(ax, ay);
                this.setSize(ar - ax, ab - ay);
            }
            else
                this.setSize(0, 0);
            this.$updating = false;
        }

        public setXY(xv: number, yv: number): void {
            if (this.$x != xv || this.$y != yv) {
                let dx: number = xv - this.$x;
                let dy: number = yv - this.$y;
                super.setXY(xv, yv);
                this.moveChildren(dx, dy);
            }
        }

        public moveChildren(dx: number, dy: number): void {
            if (this.$updating || !this.$parent)
                return;

            this.$updating = true;
            let cnt: number = this.$parent.numChildren;
            let i: number = 0;
            let child: GObject;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this) {
                    child.setXY(child.x + dx, child.y + dy);
                }
            }
            this.$updating = false;
        }

        protected updateAlpha(): void {
            super.updateAlpha();

            if (this.$inProgressBuilding)
                return;

            let cnt: number = this.$parent.numChildren;
            let i: number;
            let child: GObject;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this)
                    child.alpha = this.alpha;
            }
        }
    }
}