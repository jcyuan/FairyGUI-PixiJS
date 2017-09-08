namespace fgui.utils {
    export class DragIndicator {

        protected $agent: GLoader;
        protected $sourceData: any;
        protected $sourceObject:GObject;

        public constructor() {
            this.$agent = new GLoader();
            this.$agent.draggable = true;
            this.$agent.touchable = false;
            this.$agent.setSize(100, 100);
            this.$agent.setPivot(0.5, 0.5, true);
            this.$agent.align = AlignType.Center;
            this.$agent.verticalAlign = VertAlignType.Middle;
            this.$agent.sortingOrder = 1000000;  //top most
            this.$agent.on(DragEvent.END, this.$dragEnd, this);
        }

        public get dragAgent(): GObject {
            return this.$agent;
        }

        public get isDragging(): boolean {
            return this.$agent.parent != null;
        }

        public get sourceObject():GObject {
            return this.$sourceObject;
        }

        public startDrag(source: GObject, icon: string, sourceData: any, touchPointID: number = -1): void {
            if (this.isDragging)
                return;

            this.$sourceObject = source;
            this.$sourceData = sourceData;
            this.$agent.url = icon;
            GRoot.inst.addChild(this.$agent);
            let pt: PIXI.Point = GRoot.inst.globalToLocal(GRoot.statusData.mouseX, GRoot.statusData.mouseY);
            this.$agent.setXY(pt.x, pt.y);
            this.$agent.startDrag(touchPointID);
        }

        public cancel(): void {
            if (this.$agent.parent != null) {
                this.$agent.stopDrag();
                GRoot.inst.removeChild(this.$agent);
                this.$sourceData = null;
            }
        }

        private $dragEnd(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.isDragging)
                return;

            GRoot.inst.removeChild(this.$agent);

            let sourceData: any = this.$sourceData;
            this.$sourceData = null;

            let obj: GObject = GRoot.inst.getObjectUnderPoint(evt.data.global.x, evt.data.global.y);
            while (obj != null) {
                if (obj.hasListener(DragEvent.DROP)) {
                    obj.requestFocus();
                    evt.currentTarget = obj.displayObject;
                    obj.emit(DragEvent.DROP, evt, sourceData);
                    return;
                }
                obj = obj.parent;
            }
        }
    }
}
