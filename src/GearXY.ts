namespace fgui {

    export class GearXY extends GearBase<GObject> {
        private $tweener: createjs.Tween;

        private $storage: { [key:string] : PIXI.Point };
        private $default: PIXI.Point;
        private $tweenValue: PIXI.Point;
        private $tweenTarget: PIXI.Point;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.$default = new PIXI.Point(this.$owner.x, this.$owner.y);
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (value == "-")
                return;

            let arr: string[] = value.split(",");
            let pt: PIXI.Point;
            if (pageId == null)
                pt = this.$default;
            else {
                pt = new PIXI.Point();
                this.$storage[pageId] = pt;
            }
            pt.x = parseInt(arr[0]);
            pt.y = parseInt(arr[1]);
        }

        public apply(): void {
            let pt: PIXI.Point = this.$storage[this.$controller.selectedPageId];
            if (!pt)
                pt = this.$default;

            if (this.$tween && !UIPackage.$constructingObjects && !GearBase.disableAllTweenEffect) {
                if (this.$tweener) {
                    if (this.$tweenTarget.x != pt.x || this.$tweenTarget.y != pt.y) {
                        this.$tweener.tick(100000000);  //set to end
                        this.$tweener = null;
                    }
                    else
                        return;
                }
                if (this.$owner.x != pt.x || this.$owner.y != pt.y) {
                    this.$owner.internalVisible++;
                    this.$tweenTarget = pt;

                    let vars: any = {
                        onChange: () => {
                            this.$owner.$gearLocked = true;
                            this.$owner.setXY(this.$tweenValue.x, this.$tweenValue.y);
                            this.$owner.$gearLocked = false;
                        }
                    };
                    if (this.$tweenValue == null)
                        this.$tweenValue = new PIXI.Point();
                    this.$tweenValue.x = this.$owner.x;
                    this.$tweenValue.y = this.$owner.y;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ x: pt.x, y: pt.y }, this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenEndCall, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.setXY(pt.x, pt.y);
                this.$owner.$gearLocked = false;
            }
        }

        private tweenEndCall():void
        {
            this.$owner.internalVisible--;
            this.$tweener = null;
            this.$owner.emit(GearEvent.GEAR_STOP, this);
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            let pt: PIXI.Point = this.$storage[this.$controller.selectedPageId];
            if (!pt) {
                pt = new PIXI.Point();
                this.$storage[this.$controller.selectedPageId] = pt;
            }

            pt.x = this.$owner.x;
            pt.y = this.$owner.y;
        }

        public updateFromRelations(dx: number, dy: number): void {
            if (this.$controller == null || this.$storage == null)
                return;

            for (let key in this.$storage) {
                let pt: PIXI.Point = this.$storage[key];
                pt.x += dx;
                pt.y += dy;
            }
            this.$default.x += dx;
            this.$default.y += dy;

            this.updateState();
        }
    }
}
