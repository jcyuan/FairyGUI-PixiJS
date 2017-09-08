/// <reference path="./GComponent.ts" />

namespace fgui {

    export class GButton extends GComponent implements IColorableTitle {
        protected $titleObject: GObject;
        protected $iconObject: GObject;
        protected $relatedController: Controller;

        private $mode: ButtonMode;
        private $selected: boolean;
        private $title: string;
        private $selectedTitle: string;
        private $icon: string;
        private $selectedIcon: string;
        private $pageOption: ControllerPage;
        private $buttonController: Controller;
        private $changeStateOnClick: boolean;
        private $linkedPopup: GObject;
        private $downEffect: number;
        private $downEffectValue: number;

        private $down: boolean;
        private $over: boolean;

        public static UP: string = "up";
        public static DOWN: string = "down";
        public static OVER: string = "over";
        public static SELECTED_OVER: string = "selectedOver";
        public static DISABLED: string = "disabled";
        public static SELECTED_DISABLED: string = "selectedDisabled";

        public constructor() {
            super();

            this.$mode = ButtonMode.Common;
            this.$title = "";
            this.$icon = "";
            this.$pageOption = new ControllerPage();
            this.$changeStateOnClick = true;
            this.$downEffect = 0;
            this.$downEffectValue = 0.8;
        }

        protected setDisplayObject(value:PIXI.DisplayObject):void {
            super.setDisplayObject(value);
            this.$displayObject.buttonMode = true;
        }

        public get icon(): string {
            return this.$icon;
        }

        public set icon(value: string) {
            this.$icon = value;
            value = (this.$selected && this.$selectedIcon) ? this.$selectedIcon : this.$icon;
            if (this.$iconObject != null)
                this.$iconObject.icon = value;
            this.updateGear(GearType.Icon);
        }

        public get selectedIcon(): string {
            return this.$selectedIcon;
        }

        public set selectedIcon(value: string) {
            this.$selectedIcon = value;
            value = (this.$selected && this.$selectedIcon) ? this.$selectedIcon : this.$icon;
            if (this.$iconObject != null)
                this.$iconObject.icon = value;
        }

        public get title(): string {
            return this.$title;
        }

        public set title(value: string) {
            this.$title = value;
            if (this.$titleObject)
                this.$titleObject.text = (this.$selected && this.$selectedTitle) ? this.$selectedTitle : this.$title;
            this.updateGear(GearType.Text);
        }

        public get text(): string {
            return this.title;
        }

        public set text(value: string) {
            this.title = value;
        }

        public get selectedTitle(): string {
            return this.$selectedTitle;
        }

        public set selectedTitle(value: string) {
            this.$selectedTitle = value;
            if (this.$titleObject)
                this.$titleObject.text = (this.$selected && this.$selectedTitle) ? this.$selectedTitle : this.$title;
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

        public get fontSize():number
		{
            if(fgui.isColorableTitle(this.$titleObject))
                return this.$titleObject.fontSize;
            return 0;
		}
		
		public set fontSize(value:number)
		{
            if(fgui.isColorableTitle(this.$titleObject))
                this.$titleObject.fontSize = value;
		}

        public set selected(val: boolean) {
            if (this.$mode == ButtonMode.Common)
                return;

            if (this.$selected != val) {
                this.$selected = val;
                if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED)) {
                    if (this.$selected)
                        this.setState(GButton.SELECTED_DISABLED);
                    else
                        this.setState(GButton.DISABLED);
                }
                else {
                    if (this.$selected)
                        this.setState(this.$over ? GButton.SELECTED_OVER : GButton.DOWN);
                    else
                        this.setState(this.$over ? GButton.OVER : GButton.UP);
                }
                if (this.$selectedTitle && this.$titleObject)
                    this.$titleObject.text = this.$selected ? this.$selectedTitle : this.$title;
                if (this.$selectedIcon) {
                    let str: string = this.$selected ? this.$selectedIcon : this.$icon;
                    if (this.$iconObject != null)
                        this.$iconObject.icon = str;
                }
                if (this.$relatedController
                    && this.$parent
                    && !this.$parent.$buildingDisplayList) {
                    if (this.$selected) {
                        this.$relatedController.selectedPageId = this.$pageOption.id;
                        if (this.$relatedController.$autoRadioGroupDepth)
                            this.$parent.adjustRadioGroupDepth(this, this.$relatedController);
                    }
                    else if (this.$mode == ButtonMode.Check && this.$relatedController.selectedPageId == this.$pageOption.id)
                        this.$relatedController.oppositePageId = this.$pageOption.id;
                }
            }
        }

        public get selected(): boolean {
            return this.$selected;
        }

        public get mode(): ButtonMode {
            return this.$mode;
        }

        public set mode(value: ButtonMode) {
            if (this.$mode != value) {
                if (value == ButtonMode.Common)
                    this.selected = false;
                this.$mode = value;
            }
        }

        public get relatedController(): Controller {
            return this.$relatedController;
        }

        public set relatedController(val: Controller) {
            if (val != this.$relatedController) {
                this.$relatedController = val;
                this.$pageOption.controller = val;
                this.$pageOption.clear();
            }
        }

        public get pageOption(): ControllerPage {
            return this.$pageOption;
        }

        public get changeStateOnClick(): boolean {
            return this.$changeStateOnClick;
        }

        public set changeStateOnClick(value: boolean) {
            this.$changeStateOnClick = value;
        }

        public get linkedPopup(): GObject {
            return this.$linkedPopup;
        }

        public set linkedPopup(value: GObject) {
            this.$linkedPopup = value;
        }

        public addStateListener(listener: Function, thisObj?: any): void {
            this.on(StateChangeEvent.CHANGED, listener, thisObj);
        }

        public removeStateListener(listener: Function, thisObj?: any): void {
            this.off(StateChangeEvent.CHANGED, listener, thisObj);
        }

        public fireClick(downEffect: boolean = true): void {
            if (downEffect && this.$mode == ButtonMode.Common) {
                this.setState(GButton.OVER);
                GTimer.inst.add(100, 1, this.setState, this, GButton.DOWN);
                GTimer.inst.add(200, 1, this.setState, this, GButton.UP);
            }
            this.$click(null);
        }

        protected setState(val: string): void {
            if (this.$buttonController)
                this.$buttonController.selectedPage = val;

            if (this.$downEffect == 1) {
                if (val == GButton.DOWN || val == GButton.SELECTED_OVER || val == GButton.SELECTED_DISABLED) {
                    let r: number = this.$downEffectValue * 255;
                    let color: number = (r << 16) + (r << 8) + r;
                    this.$children.forEach(obj => {
                        if (fgui.isColorGear(obj))
                            obj.color = color;
                    });
                }
                else {
                    this.$children.forEach(obj => {
                        if (fgui.isColorGear(obj))
                            obj.color = 0xffffff;
                    });
                }
            }
            else if (this.$downEffect == 2) {
                if (val == GButton.DOWN || val == GButton.SELECTED_OVER || val == GButton.SELECTED_DISABLED)
                    this.setScale(this.$downEffectValue, this.$downEffectValue);
                else
                    this.setScale(1, 1);
            }
        }

        public handleControllerChanged(c: Controller): void {
            super.handleControllerChanged(c);

            if (this.$relatedController == c)
                this.selected = this.$pageOption.id == c.selectedPageId;
        }

        protected handleGrayedChanged(): void {
            if (this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED)) {
                if (this.grayed) {
                    if (this.$selected && this.$buttonController.hasPage(GButton.SELECTED_DISABLED))
                        this.setState(GButton.SELECTED_DISABLED);
                    else
                        this.setState(GButton.DISABLED);
                }
                else if (this.$selected)
                    this.setState(GButton.DOWN);
                else
                    this.setState(GButton.UP);
            }
            else
                super.handleGrayedChanged();
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            xml = utils.XmlParser.getChildNodes(xml, "Button")[0];

            let str: string;
            str = xml.attributes.mode;
            if (str)
                this.$mode = ParseButtonMode(str);

            str = xml.attributes.downEffect;
            if (str) {
                this.$downEffect = str == "dark" ? 1 : (str == "scale" ? 2 : 0);
                str = xml.attributes.downEffectValue;
                this.$downEffectValue = parseFloat(str);
                if(this.$downEffect == 2)
                    this.setPivot(0.5, 0.5);
            }

            this.$buttonController = this.getController("button");
            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");
            if (this.$titleObject != null)
                this.$title = this.$titleObject.text;
            if (this.$iconObject != null)
                this.$icon = this.$iconObject.icon;

            if (this.$mode == ButtonMode.Common)
                this.setState(GButton.UP);

            this.on(InteractiveEvents.Over, this.$rollover, this);
            this.on(InteractiveEvents.Out, this.$rollout, this);
            this.on(InteractiveEvents.Down, this.$mousedown, this);
            this.on(InteractiveEvents.Click, this.$click, this);
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            xml = utils.XmlParser.getChildNodes(xml, "Button")[0];
            if (xml) {
                let str: string;
                str = xml.attributes.title;
                if (str)
                    this.title = str;
                str = xml.attributes.icon;
                if (str)
                    this.icon = str;
                str = xml.attributes.selectedTitle;
                if (str)
                    this.selectedTitle = str;
                str = xml.attributes.selectedIcon;
                if (str)
                    this.selectedIcon = str;
                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = utils.StringUtil.convertFromHtmlColor(str);
                str = xml.attributes.titleFontSize;
				if(str)
					this.fontSize = parseInt(str);
                str = xml.attributes.controller;
                if (str)
                    this.$relatedController = this.$parent.getController(str);
                else
                    this.$relatedController = null;
                this.$pageOption.id = xml.attributes.page;
                this.selected = xml.attributes.checked == "true";
            }
        }

        private $rollover(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$buttonController || !this.$buttonController.hasPage(GButton.OVER))
                return;

            this.$over = true;
            if (this.$down)
                return;

            this.setState(this.$selected ? GButton.SELECTED_OVER : GButton.OVER);
        }

        private $rollout(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$buttonController || !this.$buttonController.hasPage(GButton.OVER))
                return;

            this.$over = false;
            if (this.$down)
                return;

            this.setState(this.$selected ? GButton.DOWN : GButton.UP);
        }

        private $mousedown(evt: PIXI.interaction.InteractionEvent): void {
            this.$down = true;
            GRoot.inst.on(InteractiveEvents.Up, this.$mouseup, this);

            if (this.$mode == ButtonMode.Common) {
                if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED))
                    this.setState(GButton.SELECTED_DISABLED);
                else
                    this.setState(GButton.DOWN);
            }

            if (this.$linkedPopup != null) {
                if (this.$linkedPopup instanceof Window)
                    this.$linkedPopup.toggleVisible();
                else
                    this.root.togglePopup(this.$linkedPopup, this);
            }
        }

        private $mouseup(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$down) {
                GRoot.inst.off(InteractiveEvents.Up, this.$mouseup, this);
                this.$down = false;

                if (this.$mode == ButtonMode.Common) {
                    if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED))
                        this.setState(GButton.DISABLED);
                    else if (this.$over)
                        this.setState(GButton.OVER);
                    else
                        this.setState(GButton.UP);
                }
            }
        }

        private $click(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$changeStateOnClick)
                return;

            if (this.$mode == ButtonMode.Check) {
                this.selected = !this.$selected;
                this.emit(StateChangeEvent.CHANGED, this);
            }
            else if (this.$mode == ButtonMode.Radio) {
                if (!this.$selected) {
                    this.selected = true;
                    this.emit(StateChangeEvent.CHANGED, this);
                }
            }
        }

        public dispose():void {
            GTimer.inst.remove(this.setState, this);
            GTimer.inst.remove(this.setState, this);
            GRoot.inst.off(InteractiveEvents.Up, this.$mouseup, this);
            super.dispose();
        }
    }
}