namespace fgui {

    export class PopupMenu {

        protected $contentPane: GComponent;
        protected $list: GList;

        public constructor(resourceURL: string = null) {
            if (!resourceURL) {
                resourceURL = UIConfig.popupMenu;
                if (!resourceURL)
                    throw new Error("UIConfig.popupMenu not defined");
            }
            this.$contentPane = UIPackage.createObjectFromURL(resourceURL) as GComponent;
            this.$contentPane.on("added", this.$addedToStage, this);
            this.$list = this.$contentPane.getChild("list") as GList;
            this.$list.removeChildrenToPool();
            this.$list.addRelation(this.$contentPane, RelationType.Width);
            this.$list.removeRelation(this.$contentPane, RelationType.Height);
            this.$contentPane.addRelation(this.$list, RelationType.Height);
            this.$list.on(ListEvent.ItemClick, this.$clickItem, this);
        }

        public dispose(): void {
            GTimer.inst.remove(this.$delayClickItem, this);
            this.$list.off(ListEvent.ItemClick, this.$clickItem, this);
            this.$contentPane.off("added", this.$addedToStage, this);
            this.$contentPane.dispose();
        }

        public addItem(caption: string, handler?: Function): GButton {
            let item: GButton = this.$list.addItemFromPool() as GButton;
            item.title = caption;
            item.data = handler;
            item.grayed = false;
            let c: Controller = item.getController("checked");
            if (c != null)
                c.selectedIndex = 0;
            return item;
        }

        public addItemAt(caption: string, index: number, handler?: Function): GButton {
            let item: GButton = this.$list.getFromPool() as GButton;
            this.$list.addChildAt(item, index);
            item.title = caption;
            item.data = handler;
            item.grayed = false;
            let c: Controller = item.getController("checked");
            if (c != null)
                c.selectedIndex = 0;
            return item;
        }

        public addSeperator(): void {
            if (UIConfig.popupMenuSeperator == null)
                throw new Error("UIConfig.popupMenuSeperator not defined");
            this.$list.addItemFromPool(UIConfig.popupMenuSeperator);
        }

        public getItemName(index: number): string {
            let item: GObject = this.$list.getChildAt(index);
            return item.name;
        }

        public setItemText(name: string, caption: string): void {
            let item: GButton = this.$list.getChild(name) as GButton;
            item.title = caption;
        }

        public setItemVisible(name: string, visible: boolean): void {
            let item: GButton = this.$list.getChild(name) as GButton;
            if (item.visible != visible) {
                item.visible = visible;
                this.$list.setBoundsChangedFlag();
            }
        }

        public setItemGrayed(name: string, grayed: boolean): void {
            let item: GButton = this.$list.getChild(name) as GButton;
            item.grayed = grayed;
        }

        public setItemCheckable(name: string, checkable: boolean): void {
            let item: GButton = this.$list.getChild(name) as GButton;
            let c: Controller = item.getController("checked");
            if (c != null) {
                if (checkable) {
                    if (c.selectedIndex == 0)
                        c.selectedIndex = 1;
                }
                else
                    c.selectedIndex = 0;
            }
        }

        public setItemChecked(name: string, checked: boolean): void {
            let item: GButton = this.$list.getChild(name) as GButton;
            let c: Controller = item.getController("checked");
            if (c != null)
                c.selectedIndex = checked ? 2 : 1;
        }

        public isItemChecked(name: string): boolean {
            let item: GButton = this.$list.getChild(name) as GButton;
            let c: Controller = item.getController("checked");
            if (c != null)
                return c.selectedIndex == 2;
            else
                return false;
        }

        public removeItem(name: string): boolean {
            let item: GButton = this.$list.getChild(name) as GButton;
            if (item != null) {
                let index: number = this.$list.getChildIndex(item);
                this.$list.removeChildToPoolAt(index);
                return true;
            }
            else
                return false;
        }

        public clearItems(): void {
            this.$list.removeChildrenToPool();
        }

        public get itemCount(): Number {
            return this.$list.numChildren;
        }

        public get contentPane(): GComponent {
            return this.$contentPane;
        }

        public get list(): GList {
            return this.$list;
        }

        public show(target: GObject = null, dir?: PopupDirection): void {
            let r: GRoot = target != null ? target.root : GRoot.inst;
            r.showPopup(this.contentPane, (target instanceof GRoot) ? null : target, dir);
        }

        private $clickItem(evt:PIXI.interaction.InteractionEvent, itemObject: GObject): void {
            GTimer.inst.add(100, 1, this.$delayClickItem, this, itemObject);
        }

        private $delayClickItem(itemObject: GObject): void {
            if (!(itemObject instanceof GButton))
                return;
            if (itemObject.grayed) {
                this.$list.selectedIndex = -1;
                return;
            }
            let c: Controller = itemObject.getController("checked");
            if (c != null && c.selectedIndex != 0) {
                if (c.selectedIndex == 1)
                    c.selectedIndex = 2;
                else
                    c.selectedIndex = 1;
            }
            let r: GRoot = this.$contentPane.parent as GRoot;
            if(r)
                r.hidePopup(this.contentPane);
            if (itemObject.data != null)
                (itemObject.data as Function).call(null);
            
            GTimer.inst.remove(this.$delayClickItem, this);
        }

        private $addedToStage(): void {
            this.$list.selectedIndex = -1;
            this.$list.resizeToFit(100000, 10);
        }

    }
}
