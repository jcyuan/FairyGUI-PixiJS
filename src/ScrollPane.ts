namespace fgui {

    /**@final */
    export class ScrollPane extends PIXI.utils.EventEmitter {
        private $owner: GComponent;
        private $maskContainer: UIContainer;
        private $container: PIXI.Container;

        private $viewWidth: number = 0;
        private $viewHeight: number = 0;
        private $contentWidth: number = 0;
        private $contentHeight: number = 0;

        private $scrollType: number = 0;
        private $scrollSpeed: number = 0;
        private $mouseWheelSpeed: number = 0;
        private $scrollBarMargin: utils.Margin;
        private $bouncebackEffect: boolean;
        private $touchEffect: boolean;
        private $scrollBarDisplayAuto: boolean;
        private $vScrollNone: boolean;
        private $hScrollNone: boolean;

        private $displayOnLeft: boolean;
        private $snapToItem: boolean;
        private $displayOnDemand: boolean;
        private $mouseWheelEnabled: boolean;
        private $pageMode: boolean;
        private $pageSizeH: number;
        private $pageSizeV: number;
        private $inertiaDisabled: boolean;

        private $yPerc: number;
        private $xPerc: number;
        private $xPos: number;
        private $yPos: number;
        private $xOverlap: number;
        private $yOverlap: number;

        private static $easeTypeFunc: (t: number) => number;

        private $throwTween: ThrowTween;
        private $tweening: number;
        private $tweener: createjs.Tween;

        private $time1: number;
        private $time2: number;
        private $y1: number;
        private $y2: number;
        private $xOffset: number;
        private $yOffset: number;
        private $x1: number;
        private $x2: number;

        private $needRefresh: boolean;
        private $holdAreaPoint: PIXI.Point;
        private $isHoldAreaDone: boolean;
        private $aniFlag: number;
        private $scrollBarVisible: boolean;

        private $hzScrollBar: GScrollBar;
        private $vtScrollBar: GScrollBar;

        private $onStage:boolean = false;

        /**@internal */
        $isDragged: boolean;

        public static draggingPane: ScrollPane;
        private static $gestureFlag: number = 0;

        private static sHelperRect: PIXI.Rectangle = new PIXI.Rectangle();

        public constructor(owner: GComponent,
            scrollType: number,
            scrollBarMargin: utils.Margin,
            scrollBarDisplay: number,
            flags: number,
            vtScrollBarRes: string,
            hzScrollBarRes: string) {
            super();
            if (ScrollPane.$easeTypeFunc == null)
                ScrollPane.$easeTypeFunc = ParseEaseType("cubeOut");

            this.$throwTween = new ThrowTween();

            this.$owner = owner;

            this.$maskContainer = new UIContainer(null);
            this.$owner.$rootContainer.addChild(this.$maskContainer);

            this.$container = this.$owner.$container;
            this.$container.x = 0;
            this.$container.y = 0;
            this.$maskContainer.addChild(this.$container);

            this.$scrollType = scrollType;
            this.$scrollBarMargin = scrollBarMargin;
            this.$bouncebackEffect = UIConfig.defaultScrollBounceEffect;
            this.$touchEffect = UIConfig.defaultScrollTouchEffect;
            this.$scrollSpeed = UIConfig.defaultScrollSpeed;
            this.$mouseWheelSpeed = this.$scrollSpeed * 2;
            this.$displayOnLeft = (flags & ScrollPaneFlags.DisplayOnLeft) != 0;
            this.$snapToItem = (flags & ScrollPaneFlags.SnapToItem) != 0;
            this.$displayOnDemand = (flags & ScrollPaneFlags.DisplayOnDemand) != 0;
            this.$pageMode = (flags & ScrollPaneFlags.PageMode) != 0;
            if (flags & ScrollPaneFlags.TouchEffect)
                this.$touchEffect = true;
            else if (flags & ScrollPaneFlags.DisableTouchEffect)
                this.$touchEffect = false;
            else
                this.$touchEffect = UIConfig.defaultScrollTouchEffect;
            if (flags & ScrollPaneFlags.BounceEffect)
                this.$bouncebackEffect = true;
            else if (flags & ScrollPaneFlags.DisableBounceEffect)
                this.$bouncebackEffect = false;
            else
                this.$bouncebackEffect = UIConfig.defaultScrollBounceEffect;
            this.$inertiaDisabled = (flags & ScrollPaneFlags.DisableInertia) != 0;
            if ((flags & ScrollPaneFlags.DisableScissorRect) == 0)
                this.$maskContainer.scrollRect = new PIXI.Rectangle();

            this.$xPerc = 0;
            this.$yPerc = 0;
            this.$xPos = 0;
            this.$yPos = 0;
            this.$xOverlap = 0;
            this.$yOverlap = 0;
            this.$aniFlag = 0;
            this.$scrollBarVisible = true;
            this.$mouseWheelEnabled = false;
            this.$holdAreaPoint = new PIXI.Point();

            if (scrollBarDisplay == ScrollBarDisplayType.Default)
                scrollBarDisplay = UIConfig.defaultScrollBarDisplay;

            if (scrollBarDisplay != ScrollBarDisplayType.Hidden) {
                if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Vertical) {
                    let res: string = vtScrollBarRes ? vtScrollBarRes : UIConfig.verticalScrollBar;
                    if (res) {
                        this.$vtScrollBar = UIPackage.createObjectFromURL(res) as GScrollBar;
                        if (!this.$vtScrollBar)
                            throw new Error(`Cannot create scrollbar from ${res}`);
                        this.$vtScrollBar.setScrollPane(this, true);
                        this.$owner.$rootContainer.addChild(this.$vtScrollBar.displayObject);
                    }
                }
                if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Horizontal) {
                    let res: string = hzScrollBarRes ? hzScrollBarRes : UIConfig.horizontalScrollBar;
                    if (res) {
                        this.$hzScrollBar = UIPackage.createObjectFromURL(res) as GScrollBar;
                        if (!this.$hzScrollBar)
                            throw new Error(`Cannot create scrollbar from ${res}`);
                        this.$hzScrollBar.setScrollPane(this, false);
                        this.$owner.$rootContainer.addChild(this.$hzScrollBar.displayObject);
                    }
                }

                this.$scrollBarDisplayAuto = scrollBarDisplay == ScrollBarDisplayType.Auto;
                if (this.$scrollBarDisplayAuto) {
                    this.$scrollBarVisible = false;
                    if (this.$vtScrollBar)
                        this.$vtScrollBar.displayObject.visible = false;
                    if (this.$hzScrollBar)
                        this.$hzScrollBar.displayObject.visible = false;
                }
            }

            this.$contentWidth = 0;
            this.$contentHeight = 0;
            this.setSize(owner.width, owner.height);

            this.$owner.on(InteractiveEvents.Over, this.$rollOver, this);
            this.$owner.on(InteractiveEvents.Out, this.$rollOut, this);
            this.$owner.on(InteractiveEvents.Down, this.$mouseDown, this);

            this.$owner.$rootContainer.on("added", this.$ownerAdded, this);
            this.$owner.$rootContainer.on("removed", this.$ownerRemoved, this);
        }

        private $ownerAdded(e:PIXI.interaction.InteractionEvent):void {
            this.$onStage = true;
        }

        private $ownerRemoved(e:PIXI.interaction.InteractionEvent):void {
            this.$onStage = false;
        }

        public get owner(): GComponent {
            return this.$owner;
        }

        public get bouncebackEffect(): boolean {
            return this.$bouncebackEffect;
        }

        public set bouncebackEffect(sc: boolean) {
            this.$bouncebackEffect = sc;
        }

        public get touchEffect(): boolean {
            return this.$touchEffect;
        }

        public set touchEffect(sc: boolean) {
            this.$touchEffect = sc;
        }

        public set scrollSpeed(val: number) {
            this.$scrollSpeed = this.scrollSpeed;
            if (this.$scrollSpeed == 0)
                this.$scrollSpeed = UIConfig.defaultScrollSpeed;
            this.$mouseWheelSpeed = this.$scrollSpeed * 2;
        }

        public get scrollSpeed(): number {
            return this.$scrollSpeed;
        }

        public get snapToItem(): boolean {
            return this.$snapToItem;
        }

        public set snapToItem(value: boolean) {
            this.$snapToItem = value;
        }

        public get percX(): number {
            return this.$xPerc;
        }

        public set percX(value: number) {
            this.setPercX(value, false);
        }

        public setPercX(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();

            value = utils.NumberUtil.clamp01(value);
            if (value != this.$xPerc) {
                this.$xPerc = value;
                this.$xPos = this.$xPerc * this.$xOverlap;
                this.posChanged(ani);
            }
        }

        public get percY(): number {
            return this.$yPerc;
        }

        public set percY(value: number) {
            this.setPercY(value, false);
        }

        public setPercY(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();

            value = utils.NumberUtil.clamp01(value);
            if (value != this.$yPerc) {
                this.$yPerc = value;
                this.$yPos = this.$yPerc * this.$yOverlap;
                this.posChanged(ani);
            }
        }

        public get posX(): number {
            return this.$xPos;
        }

        public set posX(value: number) {
            this.setPosX(value, false);
        }

        public setPosX(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();

            value = utils.NumberUtil.clamp(value, 0, this.$xOverlap);
            if (value != this.$xPos) {
                this.$xPos = value;
                this.$xPerc = this.$xOverlap == 0 ? 0 : this.$xPos / this.$xOverlap;

                this.posChanged(ani);
            }
        }

        public get posY(): number {
            return this.$yPos;
        }

        public set posY(value: number) {
            this.setPosY(value, false);
        }

        public setPosY(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();

            value = utils.NumberUtil.clamp(value, 0, this.$yOverlap);
            if (value != this.$yPos) {
                this.$yPos = value;
                this.$yPerc = this.$yOverlap == 0 ? 0 : this.$yPos / this.$yOverlap;

                this.posChanged(ani);
            }
        }

        public get isBottomMost(): boolean {
            return this.$yPerc == 1 || this.$yOverlap == 0;
        }

        public get isRightMost(): boolean {
            return this.$xPerc == 1 || this.$xOverlap == 0;
        }

        public get currentPageX(): number {
            return this.$pageMode ? Math.floor(this.posX / this.$pageSizeH) : 0;
        }

        public set currentPageX(value: number) {
            if (this.$pageMode && this.$xOverlap > 0)
                this.setPosX(value * this.$pageSizeH, false);
        }

        public get currentPageY(): number {
            return this.$pageMode ? Math.floor(this.posY / this.$pageSizeV) : 0;
        }

        public set currentPageY(value: number) {
            if (this.$pageMode && this.$yOverlap > 0)
                this.setPosY(value * this.$pageSizeV, false);
        }

        public get scrollingPosX(): number {
            return utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap);
        }

        public get scrollingPosY(): number {
            return utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap);
        }

        public get contentWidth(): number {
            return this.$contentWidth;
        }

        public get contentHeight(): number {
            return this.$contentHeight;
        }

        public get viewWidth(): number {
            return this.$viewWidth;
        }

        public set viewWidth(value: number) {
            value = value + this.$owner.margin.left + this.$owner.margin.right;
            if (this.$vtScrollBar != null)
                value += this.$vtScrollBar.width;
            this.$owner.width = value;
        }

        public get viewHeight(): number {
            return this.$viewHeight;
        }

        public set viewHeight(value: number) {
            value = value + this.$owner.margin.top + this.$owner.margin.bottom;
            if (this.$hzScrollBar != null)
                value += this.$hzScrollBar.height;
            this.$owner.height = value;
        }

        private getDeltaX(move: number): number {
            return move / (this.$contentWidth - this.$viewWidth);
        }

        private getDeltaY(move: number): number {
            return move / (this.$contentHeight - this.$viewHeight);
        }

        public scrollTop(ani: boolean = false): void {
            this.setPercY(0, ani);
        }

        public scrollBottom(ani: boolean = false): void {
            this.setPercY(1, ani);
        }

        public scrollUp(speed: number = 1, ani: boolean = false): void {
            this.setPercY(this.$yPerc - this.getDeltaY(this.$scrollSpeed * speed), ani);
        }

        public scrollDown(speed: number = 1, ani: boolean = false): void {
            this.setPercY(this.$yPerc + this.getDeltaY(this.$scrollSpeed * speed), ani);
        }

        public scrollLeft(speed: number = 1, ani: boolean = false): void {
            this.setPercX(this.$xPerc - this.getDeltaX(this.$scrollSpeed * speed), ani);
        }

        public scrollRight(speed: number = 1, ani: boolean = false): void {
            this.setPercX(this.$xPerc + this.getDeltaX(this.$scrollSpeed * speed), ani);
        }

        public scrollToView(target: GObject | PIXI.Rectangle, ani: boolean = false, setFirst: boolean = false): void {
            this.$owner.ensureBoundsCorrect();
            if (this.$needRefresh)
                this.refresh();

            let rect: PIXI.Rectangle;
            if (target instanceof GObject) {
                if (target.parent != this.$owner) {
                    target.parent.localToGlobalRect(target.x, target.y,
                        target.width, target.height, ScrollPane.sHelperRect);
                    rect = this.$owner.globalToLocalRect(ScrollPane.sHelperRect.x, ScrollPane.sHelperRect.y,
                        ScrollPane.sHelperRect.width, ScrollPane.sHelperRect.height, ScrollPane.sHelperRect);
                }
                else {
                    rect = ScrollPane.sHelperRect;
                    rect.x = target.x;
                    rect.y = target.y;
                    rect.width = target.width;
                    rect.height = target.height;
                }
            }
            else
                rect = target;

            if (this.$yOverlap > 0) {
                let top: number = this.posY;
                let bottom: number = top + this.$viewHeight;
                if (setFirst || rect.y < top || rect.height >= this.$viewHeight) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSizeV) * this.$pageSizeV, ani);
                    else
                        this.setPosY(rect.y, ani);
                }
                else if (rect.y + rect.height > bottom) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSizeV) * this.$pageSizeV, ani);
                    else if (rect.height <= this.$viewHeight / 2)
                        this.setPosY(rect.y + rect.height * 2 - this.$viewHeight, ani);
                    else
                        this.setPosY(rect.y + rect.height - this.$viewHeight, ani);
                }
            }
            if (this.$xOverlap > 0) {
                let left: number = this.posX;
                let right: number = left + this.$viewWidth;
                if (setFirst || rect.x < left || rect.width >= this.$viewWidth) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSizeH) * this.$pageSizeH, ani);
                    else
                        this.setPosX(rect.x, ani);
                }
                else if (rect.x + rect.width > right) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSizeH) * this.$pageSizeH, ani);
                    else if (rect.width <= this.$viewWidth / 2)
                        this.setPosX(rect.x + rect.width * 2 - this.$viewWidth, ani);
                    else
                        this.setPosX(rect.x + rect.width - this.$viewWidth, ani);
                }
            }

            if (!ani && this.$needRefresh)
                this.refresh();
        }

        public isChildInView(obj: GObject): boolean {
            let dist: number;
            if (this.$yOverlap > 0) {
                dist = obj.y + this.$container.y;
                if (dist < -obj.height - 20 || dist > this.$viewHeight + 20)
                    return false;
            }

            if (this.$xOverlap > 0) {
                dist = obj.x + this.$container.x;
                if (dist < -obj.width - 20 || dist > this.$viewWidth + 20)
                    return false;
            }

            return true;
        }

        public cancelDragging(): void {
            let g = GRoot.inst.nativeStage;
            g.off(InteractiveEvents.Move, this.$touchMove, this);
            g.off(InteractiveEvents.Up, this.$touchEnd, this);
            g.off(InteractiveEvents.Click, this.$touchTap, this);

            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;

            ScrollPane.$gestureFlag = 0;
            this.$isDragged = false;
            this.$maskContainer.interactiveChildren = true;
        }

        public onOwnerSizeChanged(): void {
            this.setSize(this.$owner.width, this.$owner.height);
            this.posChanged(false);
        }

        public adjustMaskContainer(): void {
            let mx: number, my: number;
            if (this.$displayOnLeft && this.$vtScrollBar != null)
                mx = Math.floor(this.$owner.margin.left + this.$vtScrollBar.width);
            else
                mx = Math.floor(this.$owner.margin.left);
            my = Math.floor(this.$owner.margin.top);
            mx += this.$owner.$alignOffset.x;
            my += this.$owner.$alignOffset.y;

            this.$maskContainer.x = mx;
            this.$maskContainer.y = my;
        }

        public setSize(aWidth: number, aHeight: number): void {
            this.adjustMaskContainer();

            if (this.$hzScrollBar) {
                this.$hzScrollBar.y = aHeight - this.$hzScrollBar.height;
                if (this.$vtScrollBar && !this.$vScrollNone) {
                    this.$hzScrollBar.width = aWidth - this.$vtScrollBar.width - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    if (this.$displayOnLeft)
                        this.$hzScrollBar.x = this.$scrollBarMargin.left + this.$vtScrollBar.width;
                    else
                        this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
                else {
                    this.$hzScrollBar.width = aWidth - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
            }
            if (this.$vtScrollBar) {
                if (!this.$displayOnLeft)
                    this.$vtScrollBar.x = aWidth - this.$vtScrollBar.width;
                if (this.$hzScrollBar)
                    this.$vtScrollBar.height = aHeight - this.$hzScrollBar.height - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                else
                    this.$vtScrollBar.height = aHeight - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                this.$vtScrollBar.y = this.$scrollBarMargin.top;
            }

            this.$viewWidth = aWidth;
            this.$viewHeight = aHeight;
            if (this.$hzScrollBar && !this.$hScrollNone)
                this.$viewHeight -= this.$hzScrollBar.height;
            if (this.$vtScrollBar && !this.$vScrollNone)
                this.$viewWidth -= this.$vtScrollBar.width;
            this.$viewWidth -= (this.$owner.margin.left + this.$owner.margin.right);
            this.$viewHeight -= (this.$owner.margin.top + this.$owner.margin.bottom);

            this.$viewWidth = Math.max(1, this.$viewWidth);
            this.$viewHeight = Math.max(1, this.$viewHeight);
            this.$pageSizeH = this.$viewWidth;
            this.$pageSizeV = this.$viewHeight;

            this.handleSizeChanged();
        }

        public setContentSize(aWidth: number, aHeight: number): void {
            if (this.$contentWidth == aWidth && this.$contentHeight == aHeight)
                return;

            this.$contentWidth = aWidth;
            this.$contentHeight = aHeight;
            this.handleSizeChanged();
        }

        public changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number,
            deltaPosX: number, deltaPosY: number): void {
            this.$contentWidth += deltaWidth;
            this.$contentHeight += deltaHeight;

            if (this.$isDragged) {
                if (deltaPosX != 0)
                    this.$container.x -= deltaPosX;
                if (deltaPosY != 0)
                    this.$container.y -= deltaPosY;

                this.validateHolderPos();

                this.$xOffset += deltaPosX;
                this.$yOffset += deltaPosY;

                let tmp: number = this.$y2 - this.$y1;
                this.$y1 = this.$container.y;
                this.$y2 = this.$y1 + tmp;

                tmp = this.$x2 - this.$x1;
                this.$x1 = this.$container.x;
                this.$x2 = this.$x1 + tmp;

                this.$yPos = -this.$container.y;
                this.$xPos = -this.$container.x;
            }
            else if (this.$tweening == 2) {
                if (deltaPosX != 0) {
                    this.$container.x -= deltaPosX;
                    this.$throwTween.start.x -= deltaPosX;
                }
                if (deltaPosY != 0) {
                    this.$container.y -= deltaPosY;
                    this.$throwTween.start.y -= deltaPosY;
                }
            }

            this.handleSizeChanged(true);
        }

        private handleSizeChanged(onScrolling: boolean = false): void {
            if (this.$displayOnDemand) {
                if (this.$vtScrollBar) {
                    if (this.$contentHeight <= this.$viewHeight) {
                        if (!this.$vScrollNone) {
                            this.$vScrollNone = true;
                            this.$viewWidth += this.$vtScrollBar.width;
                        }
                    }
                    else {
                        if (this.$vScrollNone) {
                            this.$vScrollNone = false;
                            this.$viewWidth -= this.$vtScrollBar.width;
                        }
                    }
                }
                if (this.$hzScrollBar) {
                    if (this.$contentWidth <= this.$viewWidth) {
                        if (!this.$hScrollNone) {
                            this.$hScrollNone = true;
                            this.$viewHeight += this.$hzScrollBar.height;
                        }
                    }
                    else {
                        if (this.$hScrollNone) {
                            this.$hScrollNone = false;
                            this.$viewHeight -= this.$hzScrollBar.height;
                        }
                    }
                }
            }

            if (this.$vtScrollBar) {
                if (this.$viewHeight < this.$vtScrollBar.minSize)
                    this.$vtScrollBar.displayObject.visible = false;
                else {
                    this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
                    if (this.$contentHeight == 0)
                        this.$vtScrollBar.displayPerc = 0;
                    else
                        this.$vtScrollBar.displayPerc = Math.min(1, this.$viewHeight / this.$contentHeight);
                }
            }
            if (this.$hzScrollBar) {
                if (this.$viewWidth < this.$hzScrollBar.minSize)
                    this.$hzScrollBar.displayObject.visible = false;
                else {
                    this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
                    if (this.$contentWidth == 0)
                        this.$hzScrollBar.displayPerc = 0;
                    else
                        this.$hzScrollBar.displayPerc = Math.min(1, this.$viewWidth / this.$contentWidth);
                }
            }

            let rect: PIXI.Rectangle = this.$maskContainer.scrollRect;
            if (rect != null) {
                rect.x = rect.y = 0;
                rect.width = this.$viewWidth;
                rect.height = this.$viewHeight;
                this.$maskContainer.scrollRect = rect;
            }

            if (this.$scrollType == ScrollType.Horizontal || this.$scrollType == ScrollType.Both)
                this.$xOverlap = Math.ceil(Math.max(0, this.$contentWidth - this.$viewWidth));
            else
                this.$xOverlap = 0;
            if (this.$scrollType == ScrollType.Vertical || this.$scrollType == ScrollType.Both)
                this.$yOverlap = Math.ceil(Math.max(0, this.$contentHeight - this.$viewHeight));
            else
                this.$yOverlap = 0;

            //TODO: need to handle if it's in tweening status and try to always stick at the edge
            if (this.$tweening == 0 && onScrolling) {
                if (this.$xPerc == 0 || this.$xPerc == 1) {
                    this.$xPos = this.$xPerc * this.$xOverlap;
                    this.$container.x = - this.$xPos;
                }
                if (this.$yPerc == 0 || this.$yPerc == 1) {
                    this.$yPos = this.$yPerc * this.$yOverlap;
                    this.$container.y = - this.$yPos;
                }
            }
            else {
                this.$xPos = utils.NumberUtil.clamp(this.$xPos, 0, this.$xOverlap);
                this.$xPerc = this.$xOverlap > 0 ? this.$xPos / this.$xOverlap : 0;

                this.$yPos = utils.NumberUtil.clamp(this.$yPos, 0, this.$yOverlap);
                this.$yPerc = this.$yOverlap > 0 ? this.$yPos / this.$yOverlap : 0;
            }

            this.validateHolderPos();

            if (this.$vtScrollBar != null)
                this.$vtScrollBar.scrollPerc = this.$yPerc;
            if (this.$hzScrollBar != null)
                this.$hzScrollBar.scrollPerc = this.$xPerc;
        }

        private validateHolderPos(): void {
            this.$container.x = utils.NumberUtil.clamp(this.$container.x, -this.$xOverlap, 0);
            this.$container.y = utils.NumberUtil.clamp(this.$container.y, -this.$yOverlap, 0);
        }

        private posChanged(ani: boolean): void {
            if (this.$aniFlag == 0)
                this.$aniFlag = ani ? 1 : -1;
            else if (this.$aniFlag == 1 && !ani)
                this.$aniFlag = -1;

            this.$needRefresh = true;
            GTimer.inst.callLater(this.refresh, this);

            //kill the tweening and reset the pos if user set a new pos through API and currently the scrolling is not stopped yet
            if (this.$tweening == 2)
                this.killTween();
        }

        private killTween(): void {
            if (this.$tweening == 1) {
                this.$tweener.setPaused(true);
                this.$tweening = 0;
                this.$tweener = null;

                this.syncScrollBar(true);
            }
            else if (this.$tweening == 2) {
                this.$tweener.setPaused(true);
                this.$tweener = null;
                this.$tweening = 0;

                this.validateHolderPos();
                this.syncScrollBar(true);

                this.emit(ScrollEvent.SCROLL_END, this);
            }
        }

        private refresh(): void {
            this.$needRefresh = false;
            GTimer.inst.remove(this.refresh, this);

            if (this.$pageMode) {
                let page: number;
                let delta: number;
                if (this.$yOverlap > 0 && this.$yPerc != 1 && this.$yPerc != 0) {
                    page = Math.floor(this.$yPos / this.$pageSizeV);
                    delta = this.$yPos - page * this.$pageSizeV;
                    if (delta > this.$pageSizeV / 2)
                        page++;
                    this.$yPos = page * this.$pageSizeV;
                    if (this.$yPos > this.$yOverlap) {
                        this.$yPos = this.$yOverlap;
                        this.$yPerc = 1;
                    }
                    else
                        this.$yPerc = this.$yPos / this.$yOverlap;
                }

                if (this.$xOverlap > 0 && this.$xPerc != 1 && this.$xPerc != 0) {
                    page = Math.floor(this.$xPos / this.$pageSizeH);
                    delta = this.$xPos - page * this.$pageSizeH;
                    if (delta > this.$pageSizeH / 2)
                        page++;
                    this.$xPos = page * this.$pageSizeH;
                    if (this.$xPos > this.$xOverlap) {
                        this.$xPos = this.$xOverlap;
                        this.$xPerc = 1;
                    }
                    else
                        this.$xPerc = this.$xPos / this.$xOverlap;
                }
            }
            else if (this.$snapToItem) {
                let pt: PIXI.Point = this.$owner.getSnappingPosition(this.$xPerc == 1 ? 0 : this.$xPos, this.$yPerc == 1 ? 0 : this.$yPos, ScrollPane.sHelperPoint);
                if (this.$xPerc != 1 && pt.x != this.$xPos) {
                    this.$xPos = pt.x;
                    this.$xPerc = this.$xPos / this.$xOverlap;
                    if (this.$xPerc > 1) {
                        this.$xPerc = 1;
                        this.$xPos = this.$xOverlap;
                    }
                }
                if (this.$yPerc != 1 && pt.y != this.$yPos) {
                    this.$yPos = pt.y;
                    this.$yPerc = this.$yPos / this.$yOverlap;
                    if (this.$yPerc > 1) {
                        this.$yPerc = 1;
                        this.$yPos = this.$yOverlap;
                    }
                }
            }

            this.refresh2();
            this.emit(ScrollEvent.SCROLL, this);
            if (this.$needRefresh) //user changed the scroll pos
            {
                this.$needRefresh = false;
                GTimer.inst.remove(this.refresh, this);

                this.refresh2();
            }

            this.$aniFlag = 0;
        }

        private refresh2() {
            let contentXLoc: number = Math.floor(this.$xPos);
            let contentYLoc: number = Math.floor(this.$yPos);

            if (this.$aniFlag == 1 && !this.$isDragged) {
                let toX: number = this.$container.x;
                let toY: number = this.$container.y;
                if (this.$yOverlap > 0)
                    toY = -contentYLoc;
                else {
                    if (this.$container.y != 0)
                        this.$container.y = 0;
                }
                if (this.$xOverlap > 0)
                    toX = -contentXLoc;
                else {
                    if (this.$container.x != 0)
                        this.$container.x = 0;
                }

                if (toX != this.$container.x || toY != this.$container.y) {
                    if (this.$tweener != null)
                        this.killTween();

                    this.$tweening = 1;
                    this.$maskContainer.interactiveChildren = false;

                    this.$tweener = createjs.Tween.get(this.$container, { onChange: utils.Binder.create(this.$tweenUpdate, this) })
                        .to({ x: toX, y: toY, }, 500, ScrollPane.$easeTypeFunc)
                        .call(this.$tweenComplete, null, this);
                }
            }
            else {
                if (this.$tweener != null)
                    this.killTween();

                //here we need to handle if user call refresh while the list is being dragged to ensure the dragging can go ahead continuously.
                if (this.$isDragged) {
                    this.$xOffset += this.$container.x - (-contentXLoc);
                    this.$yOffset += this.$container.y - (-contentYLoc);
                }

                this.$container.y = -contentYLoc;
                this.$container.x = -contentXLoc;

                //make sure the scrolling can go ahead as expected when user's finger leaves from the device's screen.
                if (this.$isDragged) {
                    this.$y1 = this.$y2 = this.$container.y;
                    this.$x1 = this.$x2 = this.$container.x;
                }

                if (this.$vtScrollBar)
                    this.$vtScrollBar.scrollPerc = this.$yPerc;
                if (this.$hzScrollBar)
                    this.$hzScrollBar.scrollPerc = this.$xPerc;
            }
        }

        private syncPos(): void {
            if (this.$xOverlap > 0) {
                this.$xPos = utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap);
                this.$xPerc = this.$xPos / this.$xOverlap;
            }

            if (this.$yOverlap > 0) {
                this.$yPos = utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap);
                this.$yPerc = this.$yPos / this.$yOverlap;
            }
        }

        private syncScrollBar(end: boolean = false): void {
            if (end) {
                if (this.$vtScrollBar) {
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(false);
                }
                if (this.$hzScrollBar) {
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(false);
                }

                this.$maskContainer.interactiveChildren = true;
            }
            else {
                if (this.$vtScrollBar) {
                    this.$vtScrollBar.scrollPerc = this.$yOverlap == 0 ? 0 : utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap) / this.$yOverlap;
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(true);
                }
                if (this.$hzScrollBar) {
                    this.$hzScrollBar.scrollPerc = this.$xOverlap == 0 ? 0 : utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap) / this.$xOverlap;
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(true);
                }
            }
        }

        private static sHelperPoint: PIXI.Point = new PIXI.Point();
        private $mouseDown(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$touchEffect)
                return;

            if (this.$tweener != null)
                this.killTween();

            ScrollPane.sHelperPoint = evt.data.getLocalPosition(this.$maskContainer, ScrollPane.sHelperPoint);

            this.$x1 = this.$x2 = this.$container.x;
            this.$y1 = this.$y2 = this.$container.y;

            this.$xOffset = ScrollPane.sHelperPoint.x - this.$container.x;
            this.$yOffset = ScrollPane.sHelperPoint.y - this.$container.y;

            this.$time1 = this.$time2 = Date.now();
            this.$holdAreaPoint.x = ScrollPane.sHelperPoint.x;
            this.$holdAreaPoint.y = ScrollPane.sHelperPoint.y;
            this.$isHoldAreaDone = false;
            this.$isDragged = false;

            let g: PIXI.Container = GRoot.inst.nativeStage;
            g.on(InteractiveEvents.Move, this.$touchMove, this);
            g.on(InteractiveEvents.Up, this.$touchEnd, this);
            g.on(InteractiveEvents.Click, this.$touchTap, this);
        }

        private $touchMove(evt: PIXI.interaction.InteractionEvent): void {
            if (!this.$onStage || !this.$owner.finalVisible)
                return;

            if (!this.$touchEffect)
                return;

            if (ScrollPane.draggingPane != null && ScrollPane.draggingPane != this || GObject.draggingObject != null)  //another object is being dragged already
                return;

            let sensitivity: number = UIConfig.touchScrollSensitivity;

            let diff: number, diff2: number;
            let sv: boolean, sh: boolean, st: boolean;

            let pt: PIXI.Point = evt.data.getLocalPosition(this.$maskContainer, ScrollPane.sHelperPoint);

            if (this.$scrollType == ScrollType.Vertical) {
                if (!this.$isHoldAreaDone) {
                    //this means the gesture on vertical direction is being observed
                    ScrollPane.$gestureFlag |= 1;

                    diff = Math.abs(this.$holdAreaPoint.y - pt.y);
                    if (diff < sensitivity)
                        return;
                    
                    //observe the gesture on the vertical direction, so we need to detect strictly whether the scrolling moves according to the vertical direction to avoid conflict.
                    if ((ScrollPane.$gestureFlag & 2) != 0) {
                        diff2 = Math.abs(this.$holdAreaPoint.x - pt.x);
                        if (diff < diff2)
                            return;
                    }
                }

                sv = true;
            }
            else if (this.$scrollType == ScrollType.Horizontal) {
                if (!this.$isHoldAreaDone) {
                    ScrollPane.$gestureFlag |= 2;

                    diff = Math.abs(this.$holdAreaPoint.x - pt.x);
                    if (diff < sensitivity)
                        return;

                    if ((ScrollPane.$gestureFlag & 1) != 0) {
                        diff2 = Math.abs(this.$holdAreaPoint.y - pt.y);
                        if (diff < diff2)
                            return;
                    }
                }

                sh = true;
            }
            else {
                ScrollPane.$gestureFlag = 3;

                if (!this.$isHoldAreaDone) {
                    diff = Math.abs(this.$holdAreaPoint.y - pt.y);
                    if (diff < sensitivity) {
                        diff = Math.abs(this.$holdAreaPoint.x - pt.x);
                        if (diff < sensitivity)
                            return;
                    }
                }

                sv = sh = true;
            }

            let t: number = Date.now();
            if (t - this.$time2 > 50) {
                this.$time2 = this.$time1;
                this.$time1 = t;
                st = true;
            }

            if (sv) {
                let y: number = Math.floor(ScrollPane.sHelperPoint.y - this.$yOffset);
                if (y > 0) {
                    if (!this.$bouncebackEffect || this.$inertiaDisabled)
                        this.$container.y = 0;
                    else
                        this.$container.y = Math.floor(y * 0.5);
                }
                else if (y < -this.$yOverlap || this.$inertiaDisabled) {
                    if (!this.$bouncebackEffect)
                        this.$container.y = -Math.floor(this.$yOverlap);
                    else
                        this.$container.y = Math.floor((y - this.$yOverlap) * 0.5);
                }
                else {
                    this.$container.y = y;
                }

                if (st) {
                    this.$y2 = this.$y1;
                    this.$y1 = this.$container.y;
                }
            }

            if (sh) {
                let x: number = Math.floor(ScrollPane.sHelperPoint.x - this.$xOffset);
                if (x > 0) {
                    if (!this.$bouncebackEffect || this.$inertiaDisabled)
                        this.$container.x = 0;
                    else
                        this.$container.x = Math.floor(x * 0.5);
                }
                else if (x < 0 - this.$xOverlap || this.$inertiaDisabled) {
                    if (!this.$bouncebackEffect)
                        this.$container.x = -Math.floor(this.$xOverlap);
                    else
                        this.$container.x = Math.floor((x - this.$xOverlap) * 0.5);
                }
                else {
                    this.$container.x = x;
                }

                if (st) {
                    this.$x2 = this.$x1;
                    this.$x1 = this.$container.x;
                }
            }

            ScrollPane.draggingPane = this;
            this.$maskContainer.interactiveChildren = false;
            this.$isHoldAreaDone = true;
            this.$isDragged = true;
            this.syncPos();
            this.syncScrollBar();
            this.emit(ScrollEvent.SCROLL, this);
        }

        private $touchEnd(evt: PIXI.interaction.InteractionEvent): void {
            let g = GRoot.inst.nativeStage;
            g.off(InteractiveEvents.Move, this.$touchMove, this);
            g.off(InteractiveEvents.Up, this.$touchEnd, this);
            g.off(InteractiveEvents.Click, this.$touchTap, this);

            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;

            ScrollPane.$gestureFlag = 0;

            if (!this.$isDragged || !this.$touchEffect || this.$inertiaDisabled || !this.$owner.onStage)
                return;

            let time: number = (Date.now() - this.$time2) / 1000;
            if (time == 0)
                time = 0.001;
            let yVelocity: number = (this.$container.y - this.$y2) / time * 2 * UIConfig.defaultTouchScrollSpeedRatio;
            let xVelocity: number = (this.$container.x - this.$x2) / time * 2 * UIConfig.defaultTouchScrollSpeedRatio;
            let duration: number = 0.3;

            this.$throwTween.start.x = this.$container.x;
            this.$throwTween.start.y = this.$container.y;

            let change1: PIXI.Point = this.$throwTween.change1;
            let change2: PIXI.Point = this.$throwTween.change2;
            let endX: number = 0;
            let endY: number = 0;
            let page: number = 0;
            let delta: number = 0;
            let fireRelease: number = 0;
            let testPageSize: number;

            if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Horizontal) {
                if (this.$container.x > UIConfig.touchDragSensitivity)
                    fireRelease = 1;
                else if (this.$container.x < -this.$xOverlap - UIConfig.touchDragSensitivity)
                    fireRelease = 2;

                change1.x = ThrowTween.calculateChange(xVelocity, duration);
                change2.x = 0;
                endX = this.$container.x + change1.x;

                if (this.$pageMode && endX < 0 && endX > -this.$xOverlap) {
                    page = Math.floor(-endX / this.$pageSizeH);
                    testPageSize = Math.min(this.$pageSizeH, this.$contentWidth - (page + 1) * this.$pageSizeH);
                    delta = -endX - page * this.$pageSizeH;
                    //magnet magic
                    if (Math.abs(change1.x) > this.$pageSizeH) //if the scrolling distance larger than the whole page size, then to reach to the next more page we get more half page distance to move
                    {
                        if (delta > testPageSize * 0.5)
                            page++;
                    }
                    else //otherwise 1/3 page size distance is needed (need to consider about the movement on horizontal direction: left/right)
                    {
                        if (delta > testPageSize * (change1.x < 0 ? 0.3 : 0.7))
                            page++;
                    }

                    //re-calculate the destination point
                    endX = -page * this.$pageSizeH;
                    if (endX < -this.$xOverlap)
                        endX = -this.$xOverlap;

                    change1.x = endX - this.$container.x;
                }
            }
            else
                change1.x = change2.x = 0;

            if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Vertical) {
                if (this.$container.y > UIConfig.touchDragSensitivity)
                    fireRelease = 1;
                else if (this.$container.y < -this.$yOverlap - UIConfig.touchDragSensitivity)
                    fireRelease = 2;

                change1.y = ThrowTween.calculateChange(yVelocity, duration);
                change2.y = 0;
                endY = this.$container.y + change1.y;

                if (this.$pageMode && endY < 0 && endY > -this.$yOverlap) {
                    page = Math.floor(-endY / this.$pageSizeV);
                    testPageSize = Math.min(this.$pageSizeV, this.$contentHeight - (page + 1) * this.$pageSizeV);
                    delta = -endY - page * this.$pageSizeV;
                    if (Math.abs(change1.y) > this.$pageSizeV) {
                        if (delta > testPageSize * 0.5)
                            page++;
                    }
                    else {
                        if (delta > testPageSize * (change1.y < 0 ? 0.3 : 0.7))
                            page++;
                    }

                    endY = -page * this.$pageSizeV;
                    if (endY < -this.$yOverlap)
                        endY = -this.$yOverlap;

                    change1.y = endY - this.$container.y;
                }
            }
            else
                change1.y = change2.y = 0;

            if (this.$snapToItem && !this.$pageMode) {
                endX = -endX;
                endY = -endY;
                let pt: PIXI.Point = this.$owner.getSnappingPosition(endX, endY, ScrollPane.sHelperPoint);
                endX = -pt.x;
                endY = -pt.y;
                change1.x = endX - this.$container.x;
                change1.y = endY - this.$container.y;
            }

            if (this.$bouncebackEffect) {
                if (endX > 0)
                    change2.x = 0 - this.$container.x - change1.x;
                else if (endX < -this.$xOverlap)
                    change2.x = -this.$xOverlap - this.$container.x - change1.x;

                if (endY > 0)
                    change2.y = 0 - this.$container.y - change1.y;
                else if (endY < -this.$yOverlap)
                    change2.y = -this.$yOverlap - this.$container.y - change1.y;
            }
            else {
                if (endX > 0)
                    change1.x = 0 - this.$container.x;
                else if (endX < -this.$xOverlap)
                    change1.x = -this.$xOverlap - this.$container.x;

                if (endY > 0)
                    change1.y = 0 - this.$container.y;
                else if (endY < -this.$yOverlap)
                    change1.y = -this.$yOverlap - this.$container.y;
            }

            this.$throwTween.value = 0;
            this.$throwTween.change1 = change1;
            this.$throwTween.change2 = change2;

            if (this.$tweener != null)
                this.killTween();
            this.$tweening = 2;

            this.$tweener = createjs.Tween.get(this.$throwTween, { onChange: utils.Binder.create(this.$tweenUpdate2, this) })
                .to({ value: 1 }, duration * 1000, ScrollPane.$easeTypeFunc)
                .call(this.$tweenComplete2, null, this);

            if (fireRelease == 1)
                this.emit(ScrollEvent.PULL_DOWN_RELEASE, this);
            else if (fireRelease == 2)
                this.emit(ScrollEvent.PULL_UP_RELEASE, this);
        }

        private $touchTap(evt: PIXI.interaction.InteractionEvent): void {
            this.$isDragged = false;
        }
        
        private $rollOver(evt: PIXI.interaction.InteractionEvent): void {
            this.showScrollBar(true);
        }

        private $rollOut(evt: PIXI.interaction.InteractionEvent): void {
            this.showScrollBar(false);
        }

        public dispose():void {

            GTimer.inst.remove(this.refresh, this);
            GTimer.inst.remove(this.setScrollBarVisible, this);

            createjs.Tween.removeTweens(this.$throwTween);
            createjs.Tween.removeTweens(this.$container);
            if(this.$tweener)
            {
                this.$tweener.removeAllEventListeners();
                this.$tweener = null;
            }

            this.$owner.$rootContainer.off("added", this.$ownerAdded, this);
            this.$owner.$rootContainer.off("removed", this.$ownerRemoved, this);

            this.$owner.off(InteractiveEvents.Over, this.$rollOver, this);
            this.$owner.off(InteractiveEvents.Out, this.$rollOut, this);
            this.$owner.off(InteractiveEvents.Down, this.$mouseDown, this);
            
            let g = GRoot.inst.nativeStage;
            g.off(InteractiveEvents.Move, this.$touchMove, this);
            g.off(InteractiveEvents.Up, this.$touchEnd, this);
            g.off(InteractiveEvents.Click, this.$touchTap, this);
        }

        private showScrollBar(val: boolean): void {
            if (val) {
                this.setScrollBarVisible(true);
                GTimer.inst.remove(this.setScrollBarVisible, this);
            }
            else
                GTimer.inst.add(500, 1, this.setScrollBarVisible, this, val);
        }

        private setScrollBarVisible(val: boolean): void {
            this.$scrollBarVisible = val && this.$viewWidth > 0 && this.$viewHeight > 0;
            if (this.$vtScrollBar)
                this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
            if (this.$hzScrollBar)
                this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
        }

        private $tweenUpdate(): void {
            this.syncScrollBar();
            this.emit(ScrollEvent.SCROLL, this);
        }

        private $tweenComplete(): void {
            this.$tweening = 0;
            this.$tweener = null;

            this.validateHolderPos();
            this.syncScrollBar(true);
            this.emit(ScrollEvent.SCROLL, this);
        }

        private $tweenUpdate2(): void {
            this.$throwTween.update(this.$container);

            this.syncPos();
            this.syncScrollBar();
            this.emit(ScrollEvent.SCROLL, this);
        }

        private $tweenComplete2(): void {
            this.$tweening = 0;
            this.$tweener = null;

            this.validateHolderPos();
            this.syncPos();
            this.syncScrollBar(true);
            this.emit(ScrollEvent.SCROLL, this);
            this.emit(ScrollEvent.SCROLL_END, this);
        }
    }

    class ThrowTween {
        public value: number;
        public start: PIXI.Point;
        public change1: PIXI.Point;
        public change2: PIXI.Point;

        private static checkpoint: number = 0.05;

        public constructor() {
            this.start = new PIXI.Point();
            this.change1 = new PIXI.Point();
            this.change2 = new PIXI.Point();
        }

        public update(obj: PIXI.DisplayObject): void {
            obj.x = Math.floor(this.start.x + this.change1.x * this.value + this.change2.x * this.value * this.value);
            obj.y = Math.floor(this.start.y + this.change1.y * this.value + this.change2.y * this.value * this.value);
        }

        public static calculateChange(velocity: number, duration: number): number {
            return (duration * ThrowTween.checkpoint * velocity) / ThrowTween.easeOutCubic(ThrowTween.checkpoint, 0, 1, 1);
        }
        public static easeOutCubic(t: number, b: number, c: number, d: number): number {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    }
}