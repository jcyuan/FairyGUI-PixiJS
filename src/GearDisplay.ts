namespace fgui {

    export class GearDisplay extends GearBase<GObject> {
        public pages: string[];

        public constructor(owner: GObject) {
            super(owner);
        }

        protected init(): void {
            this.pages = null;
        }

        public apply(): void {
            if (!this.$controller || this.pages == null || this.pages.length == 0
                || this.pages.indexOf(this.$controller.selectedPageId) != -1)
                this.$owner.internalVisible++;
            else
                this.$owner.internalVisible = 0;
        }
    }
}