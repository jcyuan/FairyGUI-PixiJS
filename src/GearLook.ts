namespace fgui {

    export class GearLook extends GearBase<GObject> {

        private $tweener: createjs.Tween;

        private $storage: { [key: string]: GearLookValue };
        private $default: GearLookValue;
        private $tweenValue: PIXI.Point;
        private $tweenTarget: GearLookValue;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.$default = new GearLookValue(this.$owner.alpha, this.$owner.rotation, this.$owner.grayed);
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (value == "-")
                return;

            let arr: string[] = value.split(",");
            let gv: GearLookValue;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearLookValue();
                this.$storage[pageId] = gv;
            }
            gv.alpha = parseFloat(arr[0]);
            gv.rotation = parseInt(arr[1]);
            gv.grayed = arr[2] == "1" ? true : false;
        }

        public apply(): void {
            let gv: GearLookValue = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;

            if (this.$tween && !UIPackage.$constructingObjects && !GearBase.disableAllTweenEffect) {
                this.$owner.$gearLocked = true;
                this.$owner.grayed = gv.grayed;
                this.$owner.$gearLocked = false;

                if (this.$tweener) {
                    if (this.$tweenTarget.alpha === gv.alpha && this.$tweenTarget.rotation === gv.rotation)
                        return;
                    this.$tweener.gotoAndStop(this.$tweener.duration);  //set to end
                    this.$tweener = null;
                }
                
                let a: boolean = gv.alpha != this.$owner.alpha;
                let b: boolean = gv.rotation != this.$owner.rotation;
                if (a || b) {
                    if(this.$owner.hasGearController(0, this.$controller))
                        this.$lockToken = this.$owner.lockGearDisplay();

                    this.$tweenTarget = gv;

                    let vars: any = {
                        onChange: () => {
                            this.$owner.$gearLocked = true;
                            if (a)
                                this.$owner.alpha = this.$tweenValue.x;
                            if (b)
                                this.$owner.rotation = this.$tweenValue.y;
                            this.$owner.$gearLocked = false;
                        }
                    };

                    if (this.$tweenValue == null)
                        this.$tweenValue = new PIXI.Point();
                    this.$tweenValue.x = this.$owner.alpha;
                    this.$tweenValue.y = this.$owner.rotation;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ x: gv.alpha, y: gv.rotation }, this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenComplete, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.grayed = gv.grayed;
                this.$owner.alpha = gv.alpha;
                this.$owner.rotation = gv.rotation;
                this.$owner.$gearLocked = false;
            }
        }

        private tweenComplete():void
        {
            if(this.$lockToken != 0) {
                this.$owner.releaseGearDisplay(this.$lockToken);
                this.$lockToken = 0;
            }
            this.$tweener = null;
            this.$owner.emit(GearEvent.GEAR_STOP, this);
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            let gv: GearLookValue = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearLookValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }

            gv.alpha = this.$owner.alpha;
            gv.rotation = this.$owner.rotation;
            gv.grayed = this.$owner.grayed;
        }
    }

    class GearLookValue {
        public alpha: number;
        public rotation: number;
        public grayed: boolean;

        public constructor(alpha: number = 0, rotation: number = 0, grayed: boolean = false) {
            this.alpha = alpha;
            this.rotation = rotation;
            this.grayed = grayed;
        }
    }
}
