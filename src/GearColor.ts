namespace fgui {

    export class GearColor extends GearBase<IColorGear> {
        private $storage: { [key: string]: number };
        private $default: number = 0;

        public constructor(owner: GObject & IColorGear) {
            super(owner);
        }

        protected init(): void {
            this.$default = this.$owner.color;
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (value == "-")
                return;

            let col: number = utils.StringUtil.convertFromHtmlColor(value);
            if (pageId == null)
                this.$default = col;
            else
                this.$storage[pageId] = col;
        }

        public apply(): void {
            this.$owner.$gearLocked = true;

            let data: number = this.$storage[this.$controller.selectedPageId];
            if (data != undefined)
                this.$owner.color = Math.floor(data);
            else
                this.$owner.color = Math.floor(this.$default);

            this.$owner.$gearLocked = false;
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            this.$storage[this.$controller.selectedPageId] = this.$owner.color;
        }
    }
}