namespace fgui {

    export class GComboBox extends GComponent {

        protected $dropdown: GComponent;

        protected $titleObject: GObject;
        protected $iconObject: GObject;
        protected $list: GList;

        private $items: string[];
        private $values: string[];
        private $icons: string[];

        private $visibleItemCount: number = 0;
        private $itemsUpdated: boolean;
        private $selectedIndex: number = 0;
        private $buttonController: controller.Controller;
        private $popupDir: PopupDirection = PopupDirection.Down;

        private $over: boolean;
        private $down: boolean;

        public constructor() {
            super();
            this.$visibleItemCount = UIConfig.defaultComboBoxVisibleItemCount;
            this.$itemsUpdated = true;
            this.$selectedIndex = -1;
            this.$items = [];
            this.$values = [];
        }

        public get text(): string {
            if (this.$titleObject)
                return this.$titleObject.text;
            else
                return null;
        }

        public set text(value: string) {
            if (this.$titleObject)
                this.$titleObject.text = value;
            this.updateGear(GearType.Text);
        }

        public get icon(): string {
            if (this.$iconObject)
                return this.$iconObject.icon;
            else
                return null;
        }

        public set icon(value: string) {
            if (this.$iconObject)
                this.$iconObject.icon = value;
            this.updateGear(GearType.Icon);
        }

        public get titleColor(): number {
            if(fgui.isColorableTitle(this.$titleObject))
                return this.$titleObject.titleColor;
            return 0;
        }

        public set titleColor(value: number) {
            if(fgui.isColorableTitle(this.$titleObject))
                this.$titleObject.titleColor = value;
        }

        public get visibleItemCount(): number {
            return this.$visibleItemCount;
        }

        public set visibleItemCount(value: number) {
            this.$visibleItemCount = value;
        }

        public get popupDirection(): PopupDirection {
            return this.$popupDir;
        }

        public set popupDirection(value: PopupDirection) {
            this.$popupDir = value;
        }

        public get items(): Array<string> {
            return this.$items;
        }

        public set items(value: string[]) {
            if (!value)
                this.$items.length = 0;
            else
                this.$items = value.concat();
            if (this.$items.length > 0) {
                if (this.$selectedIndex >= this.$items.length)
                    this.$selectedIndex = this.$items.length - 1;
                else if (this.$selectedIndex == -1)
                    this.$selectedIndex = 0;

                this.text = this.$items[this.$selectedIndex];
                if (this.$icons != null && this.$selectedIndex < this.$icons.length)
                    this.icon = this.$icons[this.$selectedIndex];
            }
            else {
                this.text = "";
                if (this.$icons != null)
                    this.icon = null;
                this.$selectedIndex = -1;
            }
            this.$itemsUpdated = true;
        }

        public get icons(): string[] {
            return this.$icons;
        }

        public set icons(value: string[]) {
            this.$icons = value;
            if (this.$icons != null && this.$selectedIndex != -1 && this.$selectedIndex < this.$icons.length)
                this.icon = this.$icons[this.$selectedIndex];
        }

        public get values(): string[] {
            return this.$values;
        }

        public set values(value: string[]) {
            if (!value)
                this.$values.length = 0;
            else
                this.$values = value.concat();
        }

        public get selectedIndex(): number {
            return this.$selectedIndex;
        }

        public set selectedIndex(val: number) {
            if (this.$selectedIndex == val)
                return;

            this.$selectedIndex = val;
            if (this.selectedIndex >= 0 && this.selectedIndex < this.$items.length) {
                this.text = this.$items[this.$selectedIndex];
                if (this.$icons != null && this.$selectedIndex < this.$icons.length)
                    this.icon = this.$icons[this.$selectedIndex];
            }
            else {
                this.text = "";
                if (this.$icons != null)
                    this.icon = null;
            }
        }

        public get value(): string {
            return this.$values[this.$selectedIndex];
        }

        public set value(val: string) {
            this.selectedIndex = this.$values.indexOf(val);
        }

        protected setState(val: string): void {
            if (this.$buttonController)
                this.$buttonController.selectedPage = val;
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            xml = utils.XmlParser.getChildNodes(xml, "ComboBox")[0];

            let str: string;

            this.$buttonController = this.getController("button");
            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");

            str = xml.attributes.dropdown;
            if (str) {
                this.$dropdown = UIPackage.createObjectFromURL(str) as GComponent;
                if (!this.$dropdown)
                    throw new Error("the 'dropdown' is not specified, it must be a component definied in the package pool");

                this.$dropdown.name = "this.dropdown";
                this.$list = this.$dropdown.getChild("list") as GList;
                if (this.$list == null)
                    throw new Error(`${this.resourceURL}: the dropdown component must have a GList child and named 'list'.`);

                this.$list.on(ListEvent.ItemClick, this.$clickItem, this);

                this.$list.addRelation(this.$dropdown, RelationType.Width);
                this.$list.removeRelation(this.$dropdown, RelationType.Height);

                this.$dropdown.addRelation(this.$list, RelationType.Height);
                this.$dropdown.removeRelation(this.$list, RelationType.Width);

                this.$dropdown.on("removed", this.$popupWinClosed, this);
            }
            
            if (!PIXI.utils.isMobile.any) {
                this.on(InteractiveEvents.Over, this.$rollover, this);
                this.on(InteractiveEvents.Out, this.$rollout, this);
            }

            this.on(InteractiveEvents.Down, this.$mousedown, this);
        }

        public dispose(): void {
            GTimer.inst.remove(this.delayedClickItem, this);
            this.$list.off(ListEvent.ItemClick, this.$clickItem, this);
            this.$dropdown.off("removed", this.$popupWinClosed, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$mouseup, this);
            this.$popupWinClosed(null);
            if (this.$dropdown) {
                this.$dropdown.dispose();
                this.$dropdown = null;
            }
            super.dispose();
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            xml = utils.XmlParser.getChildNodes(xml, "ComboBox")[0];
            if (xml) {
                let str: string;
                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = utils.StringUtil.convertFromHtmlColor(str);
                str = xml.attributes.visibleItemCount;
                if (str)
                    this.$visibleItemCount = parseInt(str);

                let col: utils.XmlNode[] = xml.children;
                if (col) {
                    col.forEach((x: utils.XmlNode, i: number) => {
                        if (x.nodeName == "item") {
                            this.$items.push(x.attributes.title);
                            this.$values.push(x.attributes.value);
                            str = x.attributes.icon;
                            if (str) {
                                if (!this.$icons)
                                    this.$icons = new Array<string>(length);
                                this.$icons[i] = str;
                            }
                        }
                    });
                }

                str = xml.attributes.title;
                if (str) {
                    this.text = str;
                    this.$selectedIndex = this.$items.indexOf(str);
                }
                else if (this.$items.length > 0) {
                    this.$selectedIndex = 0;
                    this.text = this.$items[0];
                }
                else
                    this.$selectedIndex = -1;

                str = xml.attributes.icon;
                if (str)
                    this.icon = str;

                str = xml.attributes.direction;
                if (str) {
                    if (str == "up")
                        this.$popupDir = PopupDirection.Up;
                    else if (str == "auto")
                        this.$popupDir = PopupDirection.Auto;
                }
            }
        }

        protected showDropdown(): void {
            if (this.$itemsUpdated) {
                this.$itemsUpdated = false;

                this.$list.removeChildrenToPool();
                this.$items.forEach((o, i) => {
                    let item: GObject = this.$list.addItemFromPool();
                    item.name = i < this.$values.length ? this.$values[i] : "";
                    item.text = this.$items[i];
                    item.icon = (this.$icons != null && i < this.$icons.length) ? this.$icons[i] : null;
                }, this);
                this.$list.resizeToFit(this.$visibleItemCount);
            }
            this.$list.selectedIndex = -1;
            this.$dropdown.width = this.width;

            this.root.togglePopup(this.$dropdown, this, this.$popupDir);
            if (this.$dropdown.parent)
                this.setState(GButton.DOWN);
        }

        private $popupWinClosed(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$over)
                this.setState(GButton.OVER);
            else
                this.setState(GButton.UP);
        }

        private $clickItem(evt:PIXI.interaction.InteractionEvent, item: GObject): void {
            GTimer.inst.add(100, 1, this.delayedClickItem, this, this.$list.getChildIndex(item))
        }

        private delayedClickItem(index: number): void {
            if (this.$dropdown.parent instanceof GRoot)
                this.$dropdown.parent.hidePopup();

            this.$selectedIndex = index;
            if (this.$selectedIndex >= 0)
                this.text = this.$items[this.$selectedIndex];
            else
                this.text = "";
            this.emit(StateChangeEvent.CHANGED, this);
        }

        private $rollover(evt: PIXI.interaction.InteractionEvent): void {
            this.$over = true;
            if (this.$down || this.$dropdown && this.$dropdown.parent)
                return;

            this.setState(GButton.OVER);
        }

        private $rollout(evt: PIXI.interaction.InteractionEvent): void {
            this.$over = false;
            if (this.$down || this.$dropdown && this.$dropdown.parent)
                return;

            this.setState(GButton.UP);
        }

        private $mousedown(evt: PIXI.interaction.InteractionEvent): void {
            evt.stopPropagation();

            //if(evt.currentTarget instanceof PIXI.TextInput)   //TODO: TextInput
            //    return;

            GRoot.inst.checkPopups(evt.target);

            this.$down = true;
            GRoot.inst.nativeStage.on(InteractiveEvents.Up, this.$mouseup, this);
            
            if (this.$dropdown)
                this.showDropdown();
        }

        private $mouseup(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$down) {
                this.$down = false;

                GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$mouseup, this);
                
                if (this.$dropdown && !this.$dropdown.parent) {
                    if (this.$over)
                        this.setState(GButton.OVER);
                    else
                        this.setState(GButton.UP);
                }
            }
        }
    }
}
