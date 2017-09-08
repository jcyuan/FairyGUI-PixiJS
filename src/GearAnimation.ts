/// <reference path="./GearBase.ts" />

namespace fgui {

    export class GearAnimation extends GearBase<IAnimationGear> {
        private $storage: { [key: string]: GearAnimationValue };
        private $default: GearAnimationValue;

        public constructor(owner: GObject & IAnimationGear) {
            super(owner);
        }

        protected init(): void {
            this.$default = new GearAnimationValue(this.$owner.playing, this.$owner.frame);
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (value == "-")
                return;

            let gv: GearAnimationValue;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearAnimationValue();
                this.$storage[pageId] = gv;
            }
            let arr: string[] = value.split(",");
            gv.frame = parseInt(arr[0]);
            gv.playing = arr[1] == "p";
        }

        public apply(): void {
            this.$owner.$gearLocked = true;

            let gv: GearAnimationValue = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;

            this.$owner.frame = gv.frame;
            this.$owner.playing = gv.playing;

            this.$owner.$gearLocked = false;
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            let gv: GearAnimationValue = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearAnimationValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }

            gv.frame = this.$owner.frame;
            gv.playing = this.$owner.playing;
        }
    }

    class GearAnimationValue implements IAnimationGear {
        public playing: boolean;
        public frame: number;

        public constructor(playing: boolean = true, frame: number = 0) {
            this.playing = playing;
            this.frame = frame;
        }
    }
}