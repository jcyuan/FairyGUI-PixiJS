/// <reference path="./GObject.ts" />

namespace fgui {

    export class GGraph extends GObject implements IColorGear {

        private $type: number = 0;
        private $lineSize: number = 0;
        private $lineColor: number = 0;
        private $lineAlpha: number;
        private $fillColor: number = 0;
        private $fillAlpha: number;
        private $corner: number[];

        public constructor() {
            super();

            this.$lineSize = 1;
            this.$lineAlpha = 1;
            this.$fillAlpha = 1;
            this.$fillColor = 0xFFFFFF;
        }
        
        public drawRect(lineSize: number, lineColor: number, lineAlpha: number,
            fillColor: number, fillAlpha: number, corner: number[] = null): void {
            this.$type = 1;
            this.$lineSize = lineSize;
            this.$lineColor = lineColor;
            this.$lineAlpha = lineAlpha;
            this.$fillColor = fillColor;
            this.$fillAlpha = fillAlpha;
            this.$corner = corner;
            this.drawGraph();
        }

        public drawEllipse(lineSize: number, lineColor: number, lineAlpha: number,
            fillColor: number, fillAlpha: number): void {
            this.$type = 2;
            this.$lineSize = lineSize;
            this.$lineColor = lineColor;
            this.$lineAlpha = lineAlpha;
            this.$fillColor = fillColor;
            this.$fillAlpha = fillAlpha;
            this.$corner = null;
            this.drawGraph();
        }

        public get color(): number {
            return this.$fillColor;
        }

        public set color(value: number) {
            this.$fillColor = value;
            if (this.$type != 0)
                this.drawGraph();
        }

        private drawGraph(): void {

            let g:PIXI.Graphics = this.$displayObject as PIXI.Graphics;
            g.interactive = this.touchable;
            g.clear();

            let w: number = this.width;
            let h: number = this.height;
            if (w == 0 || h == 0)
                return;

            if (this.$lineSize == 0)
                g.lineStyle(0, 0, 0);
            else
                g.lineStyle(this.$lineSize, this.$lineColor, this.$lineAlpha);
            g.beginFill(this.$fillColor, this.$fillAlpha);
            if (this.$type == 1) {
                if (this.$corner && this.$corner.length >= 1) {
                    //if (this.$corner.length == 1)
                        g.drawRoundedRect(0, 0, w, h, this.$corner[0]);   //PIXI does not support 4 corners with different radius, so only apply the first number in this array
                    //else
                    //    g.drawRoundedRect(0, 0, w, h, this.$corner[0], this.$corner[1], this.$corner[2], this.$corner[3]);
                }
                else
                    g.drawRect(0, 0, w, h);
            }
            else
            {
                let halfW:number = w * .5, halfH:number = h * .5;
                if(w == h)
                    g.drawCircle(halfW, halfW, halfW);
                else
                    g.drawEllipse(halfW, halfH, halfW, halfH);
            }
            g.endFill();
        }

        public replaceMe(target: GObject): void {
            if (!this.$parent)
                throw new Error("parent not set");

            target.name = this.name;
            target.alpha = this.alpha;
            target.rotation = this.rotation;
            target.visible = this.visible;
            target.touchable = this.touchable;
            target.grayed = this.grayed;
            target.setXY(this.x, this.y);
            target.setSize(this.width, this.height);

            let index: number = this.$parent.getChildIndex(this);
            this.$parent.addChildAt(target, index);
            target.relations.copyFrom(this.relations);

            this.$parent.removeChild(this, true);
        }

        public addBeforeMe(target: GObject): void {
            if (this.$parent == null)
                throw new Error("parent not set");

            let index: number = this.$parent.getChildIndex(this);
            this.$parent.addChildAt(target, index);
        }

        public addAfterMe(target: GObject): void {
            if (this.$parent == null)
                throw new Error("parent not set");

            let index: number = this.$parent.getChildIndex(this);
            index++;
            this.$parent.addChildAt(target, index);
        }

        public setNativeObject(obj: PIXI.DisplayObject): void {
            this.$type = 0;
            let g = this.$displayObject as PIXI.Graphics;
            g.interactive = this.touchable;
            g.clear();
            g.removeChildren();  //clear old
			g.addChild(obj);
        }

        protected createDisplayObject():void {
            this.$displayObject = new UISprite(this);
		}

        protected handleSizeChanged(): void {
            if (this.$type != 0)
                this.drawGraph();
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let type: string = xml.attributes.type;
            if (type && type != "empty")
            {
                let str: string;
                str = xml.attributes.lineSize;
                if (str)
                    this.$lineSize = parseInt(str);

                let c:number;
                str = xml.attributes.lineColor;
                if (str) {
                    c = utils.StringUtil.convertFromHtmlColor(str, true);
                    this.$lineColor = c & 0xFFFFFF;
                    this.$lineAlpha = ((c >> 24) & 0xFF) / 0xFF;
                }

                str = xml.attributes.fillColor;
                if (str) {
                    c = utils.StringUtil.convertFromHtmlColor(str, true);
                    this.$fillColor = c & 0xFFFFFF;
                    this.$fillAlpha = ((c >> 24) & 0xFF) / 0xFF;
                }

                let arr: string[];
                str = xml.attributes.corner;
                if (str) {
                    arr = str.split(",");
                    if (arr.length > 1)
                        this.$corner = [parseInt(arr[0]), parseInt(arr[1]),parseInt(arr[2]),parseInt(arr[3])];
                    else
                        this.$corner = [parseInt(arr[0])];
                }

                if (type == "rect")
                    this.$type = 1;
                else
                    this.$type = 2;

                this.drawGraph();
            }
        }
    }
}