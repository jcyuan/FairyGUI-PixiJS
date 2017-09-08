namespace fgui {

    export class GRootStatus {
        public touchDown: boolean = false;
        public mouseX: number = 0;
        public mouseY: number = 0;
    }

    export class GRoot extends GComponent {

        private $uiStage: UIStage;

        private $modalLayer: GGraph;
        private $popupStack: GObject[];
        private $justClosedPopups: GObject[];
        private $modalWaitPane: GObject;
        private $focusedObject: GObject;
        private $tooltipWin: GObject;
        private $defaultTooltipWin: GObject;
        private $checkingPopups:boolean;

        private static $inst: GRoot;

        private static $retStatus = new GRootStatus();

        public static get inst(): GRoot {
            if (GRoot.$inst == null)
                new GRoot();
            return GRoot.$inst;
        }

        public static get statusData(): GRootStatus {
            return GRoot.$retStatus;
        }

        public getObjectUnderPoint(globalX:number, globalY:number):GObject
        {
            let ret: PIXI.DisplayObject = this.$uiStage.applicationContext.renderer.plugins.interaction.hitTest(GRoot.sHelperPoint, this.nativeStage);
            return GObject.castFromNativeObject(ret);
        }

        /**The main entry */
        public attachTo(app: PIXI.Application, stageOptions?: UIStageOptions): void {

            let cjs:any = createjs;
            cjs.Ticker.timingMode = cjs.Ticker.RAF;   //force or just let user to decide?

            GTimer.inst.setTicker(app.ticker);
            
            if (this.$uiStage) {
                this.$uiStage.off(DisplayObjectEvent.SIZE_CHANGED, this.$winResize, this);
                this.$uiStage.nativeStage.off(InteractiveEvents.Down, this.$stageDown, this);
                this.$uiStage.nativeStage.off(InteractiveEvents.Up, this.$stageUp, this);
                this.$uiStage.nativeStage.off(InteractiveEvents.Move, this.$stageMove, this);
                this.$uiStage.nativeStage.removeChild(this.$displayObject);
                this.$uiStage.dispose();
            }

            this.$uiStage = new UIStage(app, stageOptions);
            this.$uiStage.on(DisplayObjectEvent.SIZE_CHANGED, this.$winResize, this);
            this.$uiStage.nativeStage.on(InteractiveEvents.Down, this.$stageDown, this);
            this.$uiStage.nativeStage.on(InteractiveEvents.Up, this.$stageUp, this);
            this.$uiStage.nativeStage.on(InteractiveEvents.Move, this.$stageMove, this);
            this.$uiStage.nativeStage.addChild(this.$displayObject);

            this.$winResize(this.$uiStage);

            if (!this.$modalLayer) {
                this.$modalLayer = new GGraph();
                this.$modalLayer.setSize(this.width, this.height);
                this.$modalLayer.drawRect(0, 0, 0, UIConfig.modalLayerColor, UIConfig.modalLayerAlpha);
                this.$modalLayer.addRelation(this, RelationType.Size);
            }
        }
        
        public constructor() {
            super();
            if (GRoot.$inst == null)
                GRoot.$inst = this;

            this.opaque = false;
            this.$popupStack = []
            this.$justClosedPopups = [];
        }

        public get stageWidth(): number {
            return this.$uiStage.stageWidth;
        }

        public get stageHeight(): number {
            return this.$uiStage.stageHeight;
        }

        public get contentScaleFactor(): number {
            return this.$uiStage.resolution;
        }

        public get applicationContext(): PIXI.Application {
            return this.$uiStage.applicationContext;
        }

        public get nativeStage(): PIXI.Container {
            return this.$uiStage.nativeStage;
        }

        public showWindow(win: Window): void {
            this.addChild(win);
            win.requestFocus();

            if (win.x > this.width)
                win.x = this.width - win.width;
            else if (win.x + win.width < 0)
                win.x = 0;

            if (win.y > this.height)
                win.y = this.height - win.height;
            else if (win.y + win.height < 0)
                win.y = 0;

            this.adjustModalLayer();
        }

        public hideWindow(win: Window): void {
            win.hide();
        }

        public hideWindowImmediately(win: Window): void {
            if (win.parent == this)
                this.removeChild(win);

            this.adjustModalLayer();
        }

        public bringToFront(win: Window): void {
            let i: number;
            if (this.$modalLayer.parent != null && !win.modal)
                i = this.getChildIndex(this.$modalLayer) - 1;
            else
                i = this.numChildren - 1;

            for (; i >= 0; i--) {
                let g: GObject = this.getChildAt(i);
                if (g == win)
                    return;
                if (g instanceof Window)
                    break;
            }

            if (i >= 0)
                this.setChildIndex(win, i);
        }

        public showModalWait(msg: string = null): void {
            if (UIConfig.globalModalWaiting != null) {
                if (this.$modalWaitPane == null) {
                    this.$modalWaitPane = UIPackage.createObjectFromURL(UIConfig.globalModalWaiting);
                    this.$modalWaitPane.addRelation(this, RelationType.Size);
                }
                this.$modalWaitPane.setSize(this.width, this.height);
                this.addChild(this.$modalWaitPane);
                this.$modalWaitPane.text = msg;
            }
        }

        public closeModalWait(): void {
            if (this.$modalWaitPane != null && this.$modalWaitPane.parent != null)
                this.removeChild(this.$modalWaitPane);
        }

        public closeAllExceptModals(): void {
            let arr: GObject[] = this.$children.slice();
            arr.forEach(g => {
                if ((g instanceof Window) && !(g as Window).modal)
                    g.hide();
            }, this);
        }

        public closeAllWindows(): void {
            let arr: GObject[] = this.$children.slice();
            arr.forEach(g => {
                if (g instanceof Window)
                    g.hide();
            }, this);
        }

        public getTopWindow(): Window {
            let cnt: number = this.numChildren;
            for (let i: number = cnt - 1; i >= 0; i--) {
                let g: GObject = this.getChildAt(i);
                if (g instanceof Window) {
                    return g as Window;
                }
            }

            return null;
        }

        public get hasModalWindow(): boolean {
            return this.$modalLayer.parent != null;
        }

        public get modalWaiting(): boolean {
            return this.$modalWaitPane && this.$modalWaitPane.inContainer;
        }

        public showPopup(popup: GObject, target: GObject = null, dir: PopupDirection = PopupDirection.Auto): void {
            if (this.$popupStack.length > 0) {
                let k: number = this.$popupStack.indexOf(popup);
                if (k != -1) {
                    for (let i: number = this.$popupStack.length - 1; i >= k; i--)
                        this.removeChild(this.$popupStack.pop());
                }
            }
            this.$popupStack.push(popup);

            this.addChild(popup);
            this.adjustModalLayer();

            let pos: PIXI.Point;
            let sizeW: number, sizeH: number = 0;
            if (target) {
                pos = target.localToRoot();
                sizeW = target.width;
                sizeH = target.height;
            }
            else
                pos = this.globalToLocal(GRoot.$retStatus.mouseX, GRoot.$retStatus.mouseY);

            let xx: number, yy: number;
            xx = pos.x;
            if (xx + popup.width > this.width)
                xx = xx + sizeW - popup.width;
            yy = pos.y + sizeH;
            if ((dir == PopupDirection.Auto && yy + popup.height > this.height)
                || dir == PopupDirection.Up) {
                yy = pos.y - popup.height - 1;
                if (yy < 0) {
                    yy = 0;
                    xx += sizeW * .5;
                }
            }

            popup.x = xx;
            popup.y = yy;
        }

        public togglePopup(popup: GObject, target: GObject = null, dir?: PopupDirection): void {
            if (this.$justClosedPopups.indexOf(popup) != -1)
                return;
            this.showPopup(popup, target, dir);
        }

        public hidePopup(popup: GObject = null): void {
            let i:number;
            if (popup != null) {
                let k: number = this.$popupStack.indexOf(popup);
                if (k != -1) {
                    for (i = this.$popupStack.length - 1; i >= k; i--)
                        this.closePopup(this.$popupStack.pop());
                }
            }
            else {
                let cnt: number = this.$popupStack.length;
                for (i = cnt - 1; i >= 0; i--)
                    this.closePopup(this.$popupStack[i]);
                this.$popupStack.length = 0;
            }
        }

        public get hasAnyPopup(): boolean {
            return this.$popupStack.length != 0;
        }

        private closePopup(target: GObject): void {
            if (target.parent != null) {
                if (target instanceof Window)
                    (target as Window).hide();
                else
                    this.removeChild(target);
            }
        }

        public showTooltips(msg: string): void {
            if (this.$defaultTooltipWin == null) {
                let resourceURL: string = UIConfig.tooltipsWin;
                if (!resourceURL) {
                    console.error("UIConfig.tooltipsWin not defined");
                    return;
                }

                this.$defaultTooltipWin = UIPackage.createObjectFromURL(resourceURL);
            }

            this.$defaultTooltipWin.text = msg;
            this.showTooltipsWin(this.$defaultTooltipWin);
        }

        public showTooltipsWin(tooltipWin: GObject, position: PIXI.Point = null): void {
            this.hideTooltips();

            this.$tooltipWin = tooltipWin;

            let xx: number = 0;
            let yy: number = 0;
            if (position == null) {
                xx = GRoot.$retStatus.mouseX + 10;
                yy = GRoot.$retStatus.mouseY + 20;
            }
            else {
                xx = position.x;
                yy = position.y;
            }
            let pt: PIXI.Point = this.globalToLocal(xx, yy);
            xx = pt.x;
            yy = pt.y;

            if (xx + this.$tooltipWin.width > this.width) {
                xx = xx - this.$tooltipWin.width - 1;
                if (xx < 0)
                    xx = 10;
            }
            if (yy + this.$tooltipWin.height > this.height) {
                yy = yy - this.$tooltipWin.height - 1;
                if (xx - this.$tooltipWin.width - 1 > 0)
                    xx = xx - this.$tooltipWin.width - 1;
                if (yy < 0)
                    yy = 10;
            }

            this.$tooltipWin.x = xx;
            this.$tooltipWin.y = yy;
            this.addChild(this.$tooltipWin);
        }

        public hideTooltips(): void {
            if (this.$tooltipWin != null) {
                if (this.$tooltipWin.parent)
                    this.removeChild(this.$tooltipWin);
                this.$tooltipWin = null;
            }
        }
        
        public get focus(): GObject {
            if (this.$focusedObject && !this.$focusedObject.onStage)
                this.$focusedObject = null;

            return this.$focusedObject;
        }

        public set focus(value: GObject) {
            if (value && (!value.focusable || !value.onStage))
                throw new Error("Invalid target to focus");

            this.setFocus(value);
        }

        private setFocus(value: GObject) {
            if (this.$focusedObject != value) {
                this.$focusedObject = value;
                this.emit(FocusEvent.CHANGED, this);
            }
        }

        private adjustModalLayer(): void {
            let cnt: number = this.numChildren;

            if (this.$modalWaitPane != null && this.$modalWaitPane.parent != null)
                this.setChildIndex(this.$modalWaitPane, cnt - 1);

            for (let i: number = cnt - 1; i >= 0; i--) {
                let g: GObject = this.getChildAt(i);
                if ((g instanceof Window) && g.modal) {
                    if (this.$modalLayer.parent == null)
                        this.addChildAt(this.$modalLayer, i);
                    else
                        this.setChildIndexBefore(this.$modalLayer, i);
                    return;
                }
            }

            if (this.$modalLayer.parent != null)
                this.removeChild(this.$modalLayer);
        }

        private $stageDown(evt: PIXI.interaction.InteractionEvent): void {
            GRoot.$retStatus.mouseX = evt.data.global.x;
            GRoot.$retStatus.mouseY = evt.data.global.y;
            GRoot.$retStatus.touchDown = true;

            //check focus
            let mc: PIXI.DisplayObject = evt.target;
            while (mc && mc != this.nativeStage) {
                if (fgui.isUIObject(mc)) {
                    let g = mc.UIOwner;
                    if (g.touchable && g.focusable) {
                        this.setFocus(g);
                        break;
                    }
                }
                mc = mc.parent;
            }
            
            if (this.$tooltipWin != null)
                this.hideTooltips();

            this.checkPopups(evt.target);
        }

        public checkPopups(target:PIXI.DisplayObject):void {
            if(this.$checkingPopups)
				return;
			
            this.$checkingPopups = true;
            
			this.$justClosedPopups.length = 0;
			if (this.$popupStack.length > 0) {
                let mc = target;
                while (mc && mc != this.nativeStage) {
					if (fgui.isUIObject(mc)) {
						let pindex = this.$popupStack.indexOf(mc.UIOwner);
						if (pindex != -1) {
                            let popup:GObject;
							for(let i = this.$popupStack.length - 1; i > pindex; i--) {
								popup = this.$popupStack.pop();
								this.closePopup(popup);
								this.$justClosedPopups.push(popup);
							}
							return;
						}
					}
					mc = mc.parent;
				}
				
                let cnt = this.$popupStack.length;
                let popup:GObject;
				for(let i = cnt - 1; i >= 0; i--) {
					popup = this.$popupStack[i];
					this.closePopup(popup);
					this.$justClosedPopups.push(popup);
				}
				this.$popupStack.length = 0;
            }
        }

        private $stageMove(evt: PIXI.interaction.InteractionEvent): void {
            GRoot.$retStatus.mouseX = evt.data.global.x;
            GRoot.$retStatus.mouseY = evt.data.global.y;
        }

        private $stageUp(evt: PIXI.interaction.InteractionEvent): void {
            GRoot.$retStatus.touchDown = false;
            this.$checkingPopups = false;
        }

        private $winResize(stage: UIStage): void {
            this.setSize(stage.stageWidth, stage.stageHeight);
        }
    }
}