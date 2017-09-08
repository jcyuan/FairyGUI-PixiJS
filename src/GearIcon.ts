namespace fgui {

    export class GearIcon extends GearBase<GObject> {
        private $storage: { [key: string]: string };
        private $default: string;

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.$default = this.$owner.icon;
            this.$storage = {};
        }

        protected addStatus(pageId: string, value: string): void {
            if (pageId == null)
                this.$default = value;
            else
                this.$storage[pageId] = value;
        }

        public apply(): void {
            this.$owner.$gearLocked = true;

            let data: string = this.$storage[this.$controller.selectedPageId];
            if (data != undefined)
                this.$owner.icon = data;
            else
                this.$owner.icon = this.$default;

            this.$owner.$gearLocked = false;
        }

        public updateState(): void {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;

            this.$storage[this.$controller.selectedPageId] = this.$owner.icon;
        }
    }
}