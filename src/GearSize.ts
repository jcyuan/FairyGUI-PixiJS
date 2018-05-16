namespace fgui {

    export class GearSize extends GearBase<GObject> {

        private $tweener: createjs.Tween;

        private $storage: { [key: string]: GearSizeValue };
        private $default: GearSizeValue;
        private $tweenValue: GearSizeValue;
        private $tweenTarget: GearSizeValue;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.$default = new GearSizeValue(this.$owner.width, this.$owner.height,
                this.$owner.scaleX, this.$owner.scaleY);
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (value == "-")
                return;

            let arr: string[] = value.split(",");
            let gv: GearSizeValue;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearSizeValue();
                this.$storage[pageId] = gv;
            }
            gv.width = parseInt(arr[0]);
            gv.height = parseInt(arr[1]);
            if (arr.length > 2) {
                gv.scaleX = parseFloat(arr[2]);
                gv.scaleY = parseFloat(arr[3]);
            }
        }

        public apply(): void {
            let gv: GearSizeValue = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;

            if (this.$tween && !UIPackage.$constructingObjects && !GearBase.disableAllTweenEffect) {
                if (this.$tweener) {
                    if (this.$tweenTarget.width != gv.width || this.$tweenTarget.height != gv.height
                        || this.$tweenTarget.scaleX != gv.scaleX || this.$tweenTarget.scaleY != gv.scaleY) {
                        this.$tweener.gotoAndStop(this.$tweener.duration);  //set to end
                        this.$tweener = null;
                    }
                    else
                        return;
                }

                let a: boolean = gv.width != this.$owner.width || gv.height != this.$owner.height;
                let b: boolean = gv.scaleX != this.$owner.scaleX || gv.scaleY != this.$owner.scaleY;
                if (a || b) {
                    if(this.$owner.hasGearController(0, this.$controller))
                        this.$lockToken = this.$owner.lockGearDisplay();

                    this.$tweenTarget = gv;

                    let vars: any = {
                        onChange: () => {
                            this.$owner.$gearLocked = true;
                            if (a)
                                this.$owner.setSize(this.$tweenValue.width, this.$tweenValue.height, this.$owner.gearXY.controller == this.$controller);
                            if (b)
                                this.$owner.setScale(this.$tweenValue.scaleX, this.$tweenValue.scaleY);
                            this.$owner.$gearLocked = false;
                        }
                    };
                    if (this.$tweenValue == null)
                        this.$tweenValue = new GearSizeValue();
                    this.$tweenValue.width = this.$owner.width;
                    this.$tweenValue.height = this.$owner.height;
                    this.$tweenValue.scaleX = this.$owner.scaleX;
                    this.$tweenValue.scaleY = this.$owner.scaleY;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ width: gv.width, height: gv.height, scaleX: gv.scaleX, scaleY: gv.scaleY },
                        this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenComplete, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.setSize(gv.width, gv.height, this.$owner.gearXY.controller == this.$controller);
                this.$owner.setScale(gv.scaleX, gv.scaleY);
                this.$owner.$gearLocked = false;
            }
        }

        private tweenComplete():void {
            if(this.$lockToken != 0)
			{
                this.$owner.releaseGearDisplay(this.$lockToken);
                this.$lockToken = 0;
			}
            this.$tweener = null;
            this.$owner.emit(GearEvent.GEAR_STOP, this);
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            let gv: GearSizeValue = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearSizeValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }

            gv.width = this.$owner.width;
            gv.height = this.$owner.height;
            gv.scaleX = this.$owner.scaleX;
            gv.scaleY = this.$owner.scaleY;
        }

        public updateFromRelations(dx: number, dy: number): void {
            if (this.$controller == null || this.$storage == null)
                return;

            for (let key in this.$storage) {
                let gv: GearSizeValue = this.$storage[key];
                gv.width += dx;
                gv.height += dy;
            }
            this.$default.width += dx;
            this.$default.height += dy;

            this.updateState();
        }
    }

    class GearSizeValue {
        public width: number;
        public height: number;
        public scaleX: number;
        public scaleY: number;

        public constructor(width: number = 0, height: number = 0, scaleX: number = 0, scaleY: number = 0) {
            this.width = width;
            this.height = height;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
    }
}