namespace fgui {

    export class GScrollBar extends GComponent {
        private $grip: GObject;
        private $arrowButton1: GObject;
        private $arrowButton2: GObject;
        private $bar: GObject;
        private $target: ScrollPane;

        private $vertical: boolean;
        private $scrollPerc: number;
        private $fixedGripSize: boolean;

        private $dragOffset: PIXI.Point;

        public constructor() {
            super();
            this.$dragOffset = new PIXI.Point();
            this.$scrollPerc = 0;
        }

        public setScrollPane(target: ScrollPane, vertical: boolean): void {
            this.$target = target;
            this.$vertical = vertical;
        }

        public set displayPerc(val: number) {
            if (this.$vertical) {
                if (!this.$fixedGripSize)
                    this.$grip.height = val * this.$bar.height;
                this.$grip.y = this.$bar.y + (this.$bar.height - this.$grip.height) * this.$scrollPerc;
            }
            else {
                if (!this.$fixedGripSize)
                    this.$grip.width = val * this.$bar.width;
                this.$grip.x = this.$bar.x + (this.$bar.width - this.$grip.width) * this.$scrollPerc;
            }
        }

        public get scrollPerc():number {
            return this.$scrollPerc;
        }

        public set scrollPerc(val: number) {
            this.$scrollPerc = val;
            if (this.$vertical)
                this.$grip.y = this.$bar.y + (this.$bar.height - this.$grip.height) * this.$scrollPerc;
            else
                this.$grip.x = this.$bar.x + (this.$bar.width - this.$grip.width) * this.$scrollPerc;
        }

        public get minSize(): number {
            if (this.$vertical)
                return (this.$arrowButton1 != null ? this.$arrowButton1.height : 0) + (this.$arrowButton2 != null ? this.$arrowButton2.height : 0);
            else
                return (this.$arrowButton1 != null ? this.$arrowButton1.width : 0) + (this.$arrowButton2 != null ? this.$arrowButton2.width : 0);
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            xml = utils.XmlParser.getChildNodes(xml, "ScrollBar")[0];
            if (xml != null)
                this.$fixedGripSize = xml.attributes.fixedGripSize == "true";

            this.$grip = this.getChild("grip");
            if (!this.$grip) {
                console.error("please create and define 'grip' in the Editor for the scrollbar");
                return;
            }

            this.$bar = this.getChild("bar");
            if (!this.$bar) {
                console.error("please create and define 'bar' in the Editor for the scrollbar");
                return;
            }

            this.$arrowButton1 = this.getChild("arrow1");
            this.$arrowButton2 = this.getChild("arrow2");

            this.$grip.on(InteractiveEvents.Down, this.$gripMouseDown, this);

            if (this.$arrowButton1)
                this.$arrowButton1.on(InteractiveEvents.Down, this.$arrowButton1Click, this);
            if (this.$arrowButton2)
                this.$arrowButton2.on(InteractiveEvents.Down, this.$arrowButton2Click, this);

            this.on(InteractiveEvents.Down, this.$barMouseDown, this);
        }

        private $gripMouseDown(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$bar)
                return;
            
            evt.stopPropagation();
            
            this.$dragOffset = evt.data.getLocalPosition(this.displayObject, this.$dragOffset);
            this.$dragOffset.x -= this.$grip.x;
            this.$dragOffset.y -= this.$grip.y;

            let g = GRoot.inst.nativeStage;
            g.on(InteractiveEvents.Move, this.$gripDragging, this);
            g.on(InteractiveEvents.Up, this.$gripDraggingEnd, this);
        }

        private static sScrollbarHelperPoint: PIXI.Point = new PIXI.Point();
        private $gripDragging(evt: PIXI.interaction.InteractionEvent): void {
            let pt: PIXI.Point = evt.data.getLocalPosition(this.displayObject, GScrollBar.sScrollbarHelperPoint);
            if (this.$vertical) {
                let curY: number = pt.y - this.$dragOffset.y;
                this.$target.setPercY((curY - this.$bar.y) / (this.$bar.height - this.$grip.height), false);
            }
            else {
                let curX: number = pt.x - this.$dragOffset.x;
                this.$target.setPercX((curX - this.$bar.x) / (this.$bar.width - this.$grip.width), false);
            }
        }

        private $gripDraggingEnd(evt: PIXI.interaction.InteractionEvent): void {
            let g = GRoot.inst.nativeStage;
            g.off(InteractiveEvents.Move, this.$gripDragging, this);
            g.off(InteractiveEvents.Up, this.$gripDraggingEnd, this);
        }

        private $arrowButton1Click(evt: PIXI.interaction.InteractionEvent): void {
            evt.stopPropagation();

            if (this.$vertical)
                this.$target.scrollUp();
            else
                this.$target.scrollLeft();
        }

        private $arrowButton2Click(evt: PIXI.interaction.InteractionEvent): void {
            evt.stopPropagation();
            
            if (this.$vertical)
                this.$target.scrollDown();
            else
                this.$target.scrollRight();
        }

        private $barMouseDown(evt: PIXI.interaction.InteractionEvent): void {
            let pt: PIXI.Point = evt.data.getLocalPosition(this.$grip.displayObject, GScrollBar.sScrollbarHelperPoint);
            if (this.$vertical) {
                if (pt.y < 0)
                    this.$target.scrollUp(4);
                else
                    this.$target.scrollDown(4);
            }
            else {
                if (pt.x < 0)
                    this.$target.scrollLeft(4);
                else
                    this.$target.scrollRight(4);
            }
        }

        public dispose():void {

            this.off(InteractiveEvents.Down, this.$barMouseDown, this);

            if (this.$arrowButton1)
                this.$arrowButton1.off(InteractiveEvents.Down, this.$arrowButton1Click, this);
            if (this.$arrowButton2)
                this.$arrowButton2.off(InteractiveEvents.Down, this.$arrowButton2Click, this);

            this.$grip.off(InteractiveEvents.Down, this.$gripMouseDown, this);
            this.$gripDraggingEnd(null);
            
            super.dispose();
        }
    }
}