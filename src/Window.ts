namespace fgui {

    export class Window extends GComponent {
        private $contentPane: GComponent;
        private $modalWaitPane: GObject;
        private $closeButton: GObject;
        private $dragArea: GObject;
        private $contentArea: GObject;
        private $frame: GComponent;
        private $modal: boolean;

        private $uiSources: IUISource[];
        private $inited: boolean;
        private $loading: boolean;

        protected $requestingCmd: number = 0;

        public bringToFrontOnClick: boolean;

        public constructor() {
            super();
            this.focusable = true;
            this.$uiSources = [];
            this.bringToFrontOnClick = UIConfig.bringWindowToFrontOnClick;

            this.on("added", this.$onShown, this);
            this.on("removed", this.$onHidden, this);
            this.on(InteractiveEvents.Down, this.$mouseDown, this);
        }

        public addUISource(source: IUISource): void {
            this.$uiSources.push(source);
        }

        public set contentPane(val: GComponent) {
            if (this.$contentPane != val) {
                if (this.$contentPane != null)
                    this.removeChild(this.$contentPane);
                this.$contentPane = val;
                if (this.$contentPane != null) {
                    this.addChild(this.$contentPane);
                    this.setSize(this.$contentPane.width, this.$contentPane.height);
                    this.$contentPane.addRelation(this, RelationType.Size);
                    this.$frame = this.$contentPane.getChild("frame") as GComponent;
                    if (this.$frame != null) {
                        this.closeButton = this.$frame.getChild("closeButton");
                        this.dragArea = this.$frame.getChild("dragArea");
                        this.contentArea = this.$frame.getChild("contentArea");
                    }
                }
            }
        }

        public get contentPane(): GComponent {
            return this.$contentPane;
        }

        public get frame(): GComponent {
            return this.$frame;
        }

        public get closeButton(): GObject {
            return this.$closeButton;
        }

        public set closeButton(value: GObject) {
            if (this.$closeButton != null)
                this.$closeButton.removeClick(this.closeEventHandler, this);
            this.$closeButton = value;
            if (this.$closeButton != null)
                this.$closeButton.click(this.closeEventHandler, this);
        }

        public get dragArea(): GObject {
            return this.$dragArea;
        }

        public set dragArea(value: GObject) {
            if (this.$dragArea != value) {
                if (this.$dragArea != null) {
                    this.$dragArea.draggable = false;
                    this.$dragArea.off(DragEvent.START, this.$dragStart, this);
                }

                this.$dragArea = value;
                if (this.$dragArea != null) {
                    if (this.$dragArea instanceof GGraph)
                        this.$dragArea.drawRect(0, 0, 0, 0, 0);
                    this.$dragArea.draggable = true;
                    this.$dragArea.on(DragEvent.START, this.$dragStart, this);
                }
            }
        }

        public get contentArea(): GObject {
            return this.$contentArea;
        }

        public set contentArea(value: GObject) {
            this.$contentArea = value;
        }

        public show(): void {
            GRoot.inst.showWindow(this);
        }

        public showOn(root: GRoot): void {
            root.showWindow(this);
        }

        public hide(): void {
            if (this.isShowing)
                this.doHideAnimation();
        }

        public hideImmediately(): void {
            let r: GRoot = (this.parent && this.parent instanceof GRoot) ? this.parent : GRoot.inst;
            r.hideWindowImmediately(this);
        }

        public centerOn(r: GRoot, autoUpdate: boolean = false): void {
            this.setXY(Math.round((r.width - this.width) * .5), Math.round((r.height - this.height) * .5));
            if (autoUpdate) {
                this.addRelation(r, RelationType.Center_Center);
                this.addRelation(r, RelationType.Middle_Middle);
            }
        }

        public toggleVisible(): void {
            if (this.isTop)
                this.hide();
            else
                this.show();
        }

        public get isShowing(): boolean {
            return this.parent != null;
        }

        public get isTop(): boolean {
            return this.parent != null && this.parent.getChildIndex(this) == this.parent.numChildren - 1;
        }

        public get modal(): boolean {
            return this.$modal;
        }

        public set modal(val: boolean) {
            this.$modal = val;
        }

        public bringToFront(): void {
            this.root.bringToFront(this);
        }

        public showModalWait(msg?:string, cmd: number = 0): void {
            if (cmd != 0)
                this.$requestingCmd = cmd;

            if (UIConfig.windowModalWaiting) {
                if (!this.$modalWaitPane)
                    this.$modalWaitPane = UIPackage.createObjectFromURL(UIConfig.windowModalWaiting);

                this.layoutModalWaitPane(msg);

                this.addChild(this.$modalWaitPane);
            }
        }

        protected layoutModalWaitPane(msg?:string): void {
            if (this.$contentArea != null) {
                let pt: PIXI.Point = this.$frame.localToGlobal();
                pt = this.globalToLocal(pt.x, pt.y, pt);
                this.$modalWaitPane.setXY(pt.x + this.$contentArea.x, pt.y + this.$contentArea.y);
                this.$modalWaitPane.setSize(this.$contentArea.width, this.$contentArea.height);
                if(msg && msg.length)
                    this.$modalWaitPane.text = msg;
            }
            else
                this.$modalWaitPane.setSize(this.width, this.height);
        }

        public closeModalWait(cmd: number = 0): boolean {
            if (cmd != 0) {
                if (this.$requestingCmd != cmd)
                    return false;
            }
            this.$requestingCmd = 0;

            if (this.$modalWaitPane && this.$modalWaitPane.parent != null)
                this.removeChild(this.$modalWaitPane);

            return true;
        }

        public get modalWaiting(): boolean {
            return this.$modalWaitPane && this.$modalWaitPane.parent != null;
        }

        public init(): void {
            if (this.$inited || this.$loading)
                return;

            if (this.$uiSources.length > 0) {
                this.$loading = false;
                this.$uiSources.forEach(o => {
                    if (!o.loaded) {
                        o.load(this.$uiLoadComplete, this);
                        this.$loading = true;
                    }
                }, this);
                
                if (!this.$loading)
                    this.$init();
            }
            else
                this.$init();
        }

        protected onInit(): void {
        }

        protected onShown(): void {
        }

        protected onHide(): void {
        }

        protected doShowAnimation(): void {
            this.onShown();
        }

        protected doHideAnimation(): void {
            this.hideImmediately();
        }

        private $uiLoadComplete(): void {
            let cnt: number = this.$uiSources.length;
            for (let i: number = 0; i < cnt; i++) {
                if (!this.$uiSources[i].loaded)
                    return;
            }

            this.$loading = false;
            this.$init();
        }

        private $init(): void {
            this.$inited = true;
            this.onInit();

            if (this.isShowing)
                this.doShowAnimation();
        }

        public dispose(): void {
            this.off("added", this.$onShown, this);
            this.off("removed", this.$onHidden, this);
            this.off(InteractiveEvents.Down, this.$mouseDown, this);
            if(this.$dragArea)
                this.$dragArea.off(DragEvent.START, this.$dragStart, this);
            
            if (this.parent != null)
                this.hideImmediately();

            if(this.$modalWaitPane) this.$modalWaitPane.dispose();
            if(this.$contentPane) this.$contentPane.dispose();
            
            super.dispose();
        }

        protected closeEventHandler(evt: PIXI.interaction.InteractionEvent): void {
            this.hide();
        }

        private $onShown(target: PIXI.DisplayObject): void {
            if (!this.$inited)
                this.init();
            else
                this.doShowAnimation();
        }

        private $onHidden(target: PIXI.DisplayObject): void {
            this.closeModalWait();
            this.onHide();
        }

        private $mouseDown(evt: PIXI.interaction.InteractionEvent): void {
            if (this.isShowing && this.bringToFrontOnClick)
                this.bringToFront();
        }

        private $dragStart(evt: PIXI.interaction.InteractionEvent): void {
            GObject.castFromNativeObject(evt.currentTarget).stopDrag();
            this.startDrag(evt.data.pointerID);
        }
    }
}