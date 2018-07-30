namespace fgui {

    export class ScrollPane extends PIXI.utils.EventEmitter {
        private static $easeTypeFunc:Function = (t:number, d:number):number => { return (t = t / d - 1) * t * t + 1; }; //cubic out

        private $owner: GComponent;
        private $maskContainer: UIContainer;
        private $container: PIXI.Container;

        private $alignContainer: PIXI.Container;

        private $scrollType: number;
        private $scrollSpeed: number;
        private $mouseWheelSpeed: number;
        private $decelerationRate: number;
        private $scrollBarMargin: utils.Margin;
        private $bouncebackEffect: boolean;
        private $touchEffect: boolean;
        private $scrollBarDisplayAuto: boolean;
        private $vScrollNone: boolean;
        private $hScrollNone: boolean;
        private $needRefresh: boolean;
        private $refreshBarAxis: string;

        private $displayOnLeft: boolean;
        private $snapToItem: boolean;
        private $displayOnDemand: boolean;
        private $mouseWheelEnabled: boolean;
        private $pageMode: boolean;
        private $inertiaDisabled: boolean;

        private $xPos: number;
        private $yPos: number;

        private $viewSize: PIXI.Point;
        private $contentSize: PIXI.Point;
        private $overlapSize: PIXI.Point;
        private $pageSize: PIXI.Point;
        private $containerPos: PIXI.Point;
        private $beginTouchPos: PIXI.Point;
        private $lastTouchPos: PIXI.Point;
        private $lastTouchGlobalPos: PIXI.Point;
        private $velocity: PIXI.Point;
        private $velocityScale: number;
        private $lastMoveTime: number;
        private $isHoldAreaDone: boolean;
        private $aniFlag: number;
        private $scrollBarVisible: boolean;
        private $headerLockedSize: number;
        private $footerLockedSize: number;
        private $refreshEventDispatching: boolean;

        private $tweening: number;
        private $tweenTime: PIXI.Point;
        private $tweenDuration: PIXI.Point;
        private $tweenStart: PIXI.Point;
        private $tweenChange: PIXI.Point;

        private $pageController: controller.Controller;

        private $hzScrollBar: GScrollBar;
        private $vtScrollBar: GScrollBar;
        private $header: GComponent;
        private $footer: GComponent;

        private $isDragging: boolean = false;
        public static draggingPane: ScrollPane;
        private static $gestureFlag: number = 0;

        private static sHelperPoint: PIXI.Point = new PIXI.Point();
        private static sHelperRect: PIXI.Rectangle = new PIXI.Rectangle();
        private static sEndPos: PIXI.Point = new PIXI.Point();
        private static sOldChange: PIXI.Point = new PIXI.Point();

        public static TWEEN_DEFAULT_DURATION: number = .4;
        public static TWEEN_MANUALLY_SET_DURATION: number = 0.5; //tween duration used when call setPos(useAni=true)
        public static PULL_DIST_RATIO: number = 0.5;             //pulldown / pullup distance ratio of the whole viewport

        /**@internal */
        $loop: number;

        public constructor(owner: GComponent,
            scrollType: number,
            scrollBarMargin: utils.Margin,
            scrollBarDisplay: number,
            flags: number,
            vtScrollBarRes: string,
            hzScrollBarRes: string,
            headerRes: string,
            footerRes: string) {

            super();

            this.$owner = owner;

            this.$maskContainer = new UIContainer(null);
            this.$owner.$rootContainer.addChild(this.$maskContainer);

            this.$container = this.$owner.$container;
            this.$container.x = 0;
            this.$container.y = 0;
            this.$maskContainer.addChild(this.$container);

            this.$scrollBarMargin = scrollBarMargin;
            this.$scrollType = scrollType;
            this.$scrollSpeed = UIConfig.defaultScrollSpeed;
            this.$mouseWheelSpeed = this.$scrollSpeed * 2;
            this.$decelerationRate = UIConfig.defaultScrollDecelerationRate;

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

            this.$scrollBarVisible = true;
            this.$mouseWheelEnabled = true;
            this.$xPos = 0;
            this.$yPos = 0;
            this.$aniFlag = 0;
            this.$footerLockedSize = 0;
            this.$headerLockedSize = 0;

            if (scrollBarDisplay == ScrollBarDisplayType.Default)
                scrollBarDisplay = UIConfig.defaultScrollBarDisplay;

            this.$viewSize = new PIXI.Point();
            this.$contentSize = new PIXI.Point();
            this.$pageSize = new PIXI.Point(1, 1);
            this.$overlapSize = new PIXI.Point();
            this.$tweening = 0;
            this.$tweenTime = new PIXI.Point();
            this.$tweenStart = new PIXI.Point();
            this.$tweenDuration = new PIXI.Point();
            this.$tweenChange = new PIXI.Point();
            this.$velocity = new PIXI.Point();
            this.$containerPos = new PIXI.Point();
            this.$beginTouchPos = new PIXI.Point();
            this.$lastTouchPos = new PIXI.Point();
            this.$lastTouchGlobalPos = new PIXI.Point();

            let res: string;
            if (scrollBarDisplay != ScrollBarDisplayType.Hidden) {
                if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Vertical) {
                    const res: string = vtScrollBarRes ? vtScrollBarRes : UIConfig.verticalScrollBar;
                    if (res) {
                        this.$vtScrollBar = UIPackage.createObjectFromURL(res) as GScrollBar;
                        if (!this.$vtScrollBar)
                            throw new Error(`Cannot create scrollbar from ${res}`);
                        this.$vtScrollBar.setScrollPane(this, true);

                        this.$owner.$rootContainer.addChild(this.$vtScrollBar.displayObject);
                    }
                }
                if (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Horizontal) {
                    res = hzScrollBarRes ? hzScrollBarRes : UIConfig.horizontalScrollBar;
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
            else
                this.$mouseWheelEnabled = false;

            if (headerRes) {
                this.$header = UIPackage.createObjectFromURL(headerRes) as GComponent;
                if (this.$header == null)
                    throw new Error(`Cannot create scrollPane.header from ${res}`);
            }

            if (footerRes) {
                this.$footer = UIPackage.createObjectFromURL(footerRes) as GComponent;
                if (this.$footer == null)
                    throw new Error(`Cannot create scrollPane.footer from ${res}`);
            }

            if (this.$header != null || this.$footer != null)
                this.$refreshBarAxis = (this.$scrollType == ScrollType.Both || this.$scrollType == ScrollType.Vertical) ? "y" : "x";

            this.setSize(owner.width, owner.height);

            this.$owner.on(InteractiveEvents.Over, this.$rollOver, this);
            this.$owner.on(InteractiveEvents.Out, this.$rollOut, this);
            this.$owner.on(InteractiveEvents.Down, this.$mouseDown, this);
            this.$owner.on(DisplayObjectEvent.MOUSE_WHEEL, this.$mouseWheel, this);
        }

        public dispose(): void {
            if (this.$tweening != 0)
                GTimer.inst.remove(this.tweenUpdate, this);

            this.$pageController = null;

            if (this.$hzScrollBar != null)
                this.$hzScrollBar.dispose();
            if (this.$vtScrollBar != null)
                this.$vtScrollBar.dispose();
            if (this.$header != null)
                this.$header.dispose();
            if (this.$footer != null)
                this.$footer.dispose();
                
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$mouseMove, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$mouseUp, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Click, this.$click, this);

            this.$owner.off(InteractiveEvents.Over, this.$rollOver, this);
            this.$owner.off(InteractiveEvents.Out, this.$rollOut, this);
            this.$owner.off(InteractiveEvents.Down, this.$mouseDown, this);
            this.$owner.off(DisplayObjectEvent.MOUSE_WHEEL, this.$mouseWheel, this);
        }

        public get owner(): GComponent {
            return this.$owner;
        }

        public get horzScrollBar(): GScrollBar {
            return this.$hzScrollBar;
        }

        public get vertScrollBar(): GScrollBar {
            return this.$vtScrollBar;
        }

        public get header(): GComponent {
            return this.$header;
        }

        public get footer(): GComponent {
            return this.$footer;
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
            this.$scrollSpeed = val;
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

        public get mouseWheelEnabled(): boolean {
            return this.$mouseWheelEnabled;
        }

        public set mouseWheelEnabled(value: boolean) {
            this.$mouseWheelEnabled = value;
        }

        public get decelerationRate(): number {
            return this.$decelerationRate;
        }

        public set decelerationRate(value: number) {
            this.$decelerationRate = value;
        }

        public get percX(): number {
            return this.$overlapSize.x == 0 ? 0 : this.$xPos / this.$overlapSize.x;
        }

        public set percX(value: number) {
            this.setPercX(value, false);
        }

        public setPercX(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();
            this.setPosX(this.$overlapSize.x * utils.NumberUtil.clamp01(value), ani);
        }

        public get percY(): number {
            return this.$overlapSize.y == 0 ? 0 : this.$yPos / this.$overlapSize.y;
        }

        public set percY(value: number) {
            this.setPercY(value, false);
        }

        public setPercY(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();
            this.setPosY(this.$overlapSize.y * utils.NumberUtil.clamp01(value), ani);
        }

        public get posX(): number {
            return this.$xPos;
        }

        public set posX(value: number) {
            this.setPosX(value, false);
        }

        public setPosX(value: number, ani: boolean = false): void {
            this.$owner.ensureBoundsCorrect();

            if (this.$loop == 1)
                value = this.loopCheckingNewPos(value, "x");

            value = utils.NumberUtil.clamp(value, 0, this.$overlapSize.x);
            if (value != this.$xPos) {
                this.$xPos = value;
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

            if (this.$loop == 1)
                value = this.loopCheckingNewPos(value, "y");

            value = utils.NumberUtil.clamp(value, 0, this.$overlapSize.y);
            if (value != this.$yPos) {
                this.$yPos = value;
                this.posChanged(ani);
            }
        }

        public get contentWidth(): number {
            return this.$contentSize.x;
        }

        public get contentHeight(): number {
            return this.$contentSize.y;
        }

        public get viewWidth(): number {
            return this.$viewSize.x;
        }

        public set viewWidth(value: number) {
            value = value + this.$owner.margin.left + this.$owner.margin.right;
            if (this.$vtScrollBar != null)
                value += this.$vtScrollBar.width;
            this.$owner.width = value;
        }

        public get viewHeight(): number {
            return this.$viewSize.y;
        }

        public set viewHeight(value: number) {
            value = value + this.$owner.margin.top + this.$owner.margin.bottom;
            if (this.$hzScrollBar != null)
                value += this.$hzScrollBar.height;
            this.$owner.height = value;
        }

        public get currentPageX(): number {
            if (!this.$pageMode)
                return 0;

            var page: number = Math.floor(this.$xPos / this.$pageSize.x);
            if (this.$xPos - page * this.$pageSize.x > this.$pageSize.x * 0.5)
                page++;

            return page;
        }

        public set currentPageX(value: number) {
            if (this.$pageMode && this.$overlapSize.x > 0)
                this.setPosX(value * this.$pageSize.x, false);
        }

        public get currentPageY(): number {
            if (!this.$pageMode)
                return 0;

            let page: number = Math.floor(this.$yPos / this.$pageSize.y);
            if (this.$yPos - page * this.$pageSize.y > this.$pageSize.y * 0.5)
                page++;

            return page;
        }

        public set currentPageY(value: number) {
            if (this.$pageMode && this.$overlapSize.y > 0)
                this.setPosY(value * this.$pageSize.y, false);
        }

        public get isBottomMost(): boolean {
            return this.$yPos == this.$overlapSize.y || this.$overlapSize.y == 0;
        }

        public get isRightMost(): boolean {
            return this.$xPos == this.$overlapSize.x || this.$overlapSize.x == 0;
        }

        public get pageController(): controller.Controller {
            return this.$pageController;
        }

        public set pageController(value: controller.Controller) {
            this.$pageController = value;
        }

        public get scrollingPosX(): number {
            return utils.NumberUtil.clamp(-this.$container.x, 0, this.$overlapSize.x);
        }

        public get scrollingPosY(): number {
            return utils.NumberUtil.clamp(-this.$container.y, 0, this.$overlapSize.y);
        }

        public scrollTop(ani: boolean = false): void {
            this.setPercY(0, ani);
        }

        public scrollBottom(ani: boolean = false): void {
            this.setPercY(1, ani);
        }

        public scrollUp(ratio: number = 1, ani: boolean = false): void {
            if (this.$pageMode)
                this.setPosY(this.$yPos - this.$pageSize.y * ratio, ani);
            else
                this.setPosY(this.$yPos - this.$scrollSpeed * ratio, ani);;
        }

        public scrollDown(ratio: number = 1, ani: boolean = false): void {
            if (this.$pageMode)
                this.setPosY(this.$yPos + this.$pageSize.y * ratio, ani);
            else
                this.setPosY(this.$yPos + this.$scrollSpeed * ratio, ani);
        }

        public scrollLeft(ratio: number = 1, ani: boolean = false): void {
            if (this.$pageMode)
                this.setPosX(this.$xPos - this.$pageSize.x * ratio, ani);
            else
                this.setPosX(this.$xPos - this.$scrollSpeed * ratio, ani);
        }

        public scrollRight(ratio: number = 1, ani: boolean = false): void {
            if (this.$pageMode)
                this.setPosX(this.$xPos + this.$pageSize.x * ratio, ani);
            else
                this.setPosX(this.$xPos + this.$scrollSpeed * ratio, ani);
        }

        public scrollToView(target: Object, ani: boolean = false, snapToFirst: boolean = false): void {
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
                rect = target as PIXI.Rectangle;

            if (this.$overlapSize.y > 0) {
                const bottom: number = this.$yPos + this.$viewSize.y;
                if (snapToFirst || rect.y <= this.$yPos || rect.height >= this.$viewSize.y) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSize.y) * this.$pageSize.y, ani);
                    else
                        this.setPosY(rect.y, ani);
                }
                else if (rect.y + rect.height > bottom) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSize.y) * this.$pageSize.y, ani);
                    else if (rect.height <= this.$viewSize.y / 2)
                        this.setPosY(rect.y + rect.height * 2 - this.$viewSize.y, ani);
                    else
                        this.setPosY(rect.y + rect.height - this.$viewSize.y, ani);
                }
            }
            if (this.$overlapSize.x > 0) {
                let right: number = this.$xPos + this.$viewSize.x;
                if (snapToFirst || rect.x <= this.$xPos || rect.width >= this.$viewSize.x) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSize.x) * this.$pageSize.x, ani);
                    else
                        this.setPosX(rect.x, ani);
                }
                else if (rect.x + rect.width > right) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSize.x) * this.$pageSize.x, ani);
                    else if (rect.width <= this.$viewSize.x / 2)
                        this.setPosX(rect.x + rect.width * 2 - this.$viewSize.x, ani);
                    else
                        this.setPosX(rect.x + rect.width - this.$viewSize.x, ani);
                }
            }

            if (!ani && this.$needRefresh)
                this.refresh();
        }

        public isChildInView(obj: GObject): boolean {
            if (this.$overlapSize.y > 0) {
                var dist: number = obj.y + this.$container.y;
                if (dist < -obj.height || dist > this.$viewSize.y)
                    return false;
            }

            if (this.$overlapSize.x > 0) {
                dist = obj.x + this.$container.x;
                if (dist < -obj.width || dist > this.$viewSize.x)
                    return false;
            }

            return true;
        }

        public cancelDragging(): void {
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$mouseMove, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$mouseUp, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Click, this.$click, this);

            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;

            ScrollPane.$gestureFlag = 0;
            this.$isDragging = false;
            this.$maskContainer.interactive = true;
        }

        public get isDragging():boolean {
            return this.$isDragging;
        }

        public lockHeader(size: number): void {
            if (this.$headerLockedSize == size)
                return;

            this.$headerLockedSize = size;

            if (!this.$refreshEventDispatching && (<IndexedObject>this.$container)[this.$refreshBarAxis] >= 0) {
                this.$tweenStart.set(this.$container.x, this.$container.y);
                this.$tweenChange.set(0, 0);
                (<IndexedObject>this.$tweenChange)[this.$refreshBarAxis] = this.$headerLockedSize - (<IndexedObject>this.$tweenStart)[this.$refreshBarAxis];
                this.$tweenDuration.set(ScrollPane.TWEEN_DEFAULT_DURATION, ScrollPane.TWEEN_DEFAULT_DURATION);
                this.$tweenTime.set(0, 0);
                this.$tweening = 2;
                GTimer.inst.addLoop(1, this.tweenUpdate, this);
            }
        }

        public lockFooter(size: number): void {
            if (this.$footerLockedSize == size)
                return;

            this.$footerLockedSize = size;

            if (!this.$refreshEventDispatching && (<IndexedObject>this.$container)[this.$refreshBarAxis] <= -(<IndexedObject>this.$overlapSize)[this.$refreshBarAxis]) {
                this.$tweenStart.set(this.$container.x, this.$container.y);
                this.$tweenChange.set(0, 0);
                let max: number = (<IndexedObject>this.$overlapSize)[this.$refreshBarAxis];
                if (max == 0)
                    max = Math.max((<IndexedObject>this.$contentSize)[this.$refreshBarAxis] + this.$footerLockedSize - (<IndexedObject>this.$viewSize)[this.$refreshBarAxis], 0);
                else
                    max += this.$footerLockedSize;
                (<IndexedObject>this.$tweenChange)[this.$refreshBarAxis] = -max - (<IndexedObject>this.$tweenStart)[this.$refreshBarAxis];
                this.$tweenDuration.set(ScrollPane.TWEEN_DEFAULT_DURATION, ScrollPane.TWEEN_DEFAULT_DURATION);
                this.$tweenTime.set(0, 0);
                this.$tweening = 2;
                GTimer.inst.addLoop(1, this.tweenUpdate, this);
            }
        }

        /**
         * @internal
         */
        onOwnerSizeChanged(): void {
            this.setSize(this.$owner.width, this.$owner.height);
            this.posChanged(false);
        }

        /**
         * @internal
         */
        handleControllerChanged(c: controller.Controller): void {
            if (this.$pageController == c) {
                if (this.$scrollType == ScrollType.Horizontal)
                    this.currentPageX = c.selectedIndex;
                else
                    this.currentPageY = c.selectedIndex;
            }
        }

        private updatePageController(): void {
            if (this.$pageController != null && !this.$pageController.$updating) {
                let index: number;
                if (this.$scrollType == ScrollType.Horizontal)
                    index = this.currentPageX;
                else
                    index = this.currentPageY;
                if (index < this.$pageController.pageCount) {
                    const c: controller.Controller = this.$pageController;
                    this.$pageController = null; //prevent from handleControllerChanged calling
                    c.selectedIndex = index;
                    this.$pageController = c;
                }
            }
        }

        /**
         * @internal
         */
        adjustMaskContainer(): void {
            let mx: number, my: number;
            if (this.$displayOnLeft && this.$vtScrollBar != null)
                mx = Math.floor(this.$owner.margin.left + this.$vtScrollBar.width);
            else
                mx = Math.floor(this.$owner.margin.left);
            my = Math.floor(this.$owner.margin.top);

            this.$maskContainer.position.set(mx, my);

            if (this.$owner.$alignOffset.x != 0 || this.$owner.$alignOffset.y != 0) {
                if (this.$alignContainer == null) {
                    this.$alignContainer = new PIXI.Container();
                    this.$maskContainer.addChild(this.$alignContainer);
                    this.$alignContainer.addChild(this.$container);
                }

                this.$alignContainer.position.set(this.$owner.$alignOffset.x, this.$owner.$alignOffset.y);
            }
            else if (this.$alignContainer)
                this.$alignContainer.position.set(0, 0);
        }

        public setSize(width: number, height: number): void {
            this.adjustMaskContainer();

            if (this.$hzScrollBar) {
                this.$hzScrollBar.y = height - this.$hzScrollBar.height;
                if (this.$vtScrollBar && !this.$vScrollNone) {
                    this.$hzScrollBar.width = width - this.$vtScrollBar.width - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    if (this.$displayOnLeft)
                        this.$hzScrollBar.x = this.$scrollBarMargin.left + this.$vtScrollBar.width;
                    else
                        this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
                else {
                    this.$hzScrollBar.width = width - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
            }
            if (this.$vtScrollBar) {
                if (!this.$displayOnLeft)
                    this.$vtScrollBar.x = width - this.$vtScrollBar.width;
                if (this.$hzScrollBar)
                    this.$vtScrollBar.height = height - this.$hzScrollBar.height - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                else
                    this.$vtScrollBar.height = height - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                this.$vtScrollBar.y = this.$scrollBarMargin.top;
            }

            this.$viewSize.x = width;
            this.$viewSize.y = height;
            if (this.$hzScrollBar && !this.$hScrollNone)
                this.$viewSize.y -= this.$hzScrollBar.height;
            if (this.$vtScrollBar && !this.$vScrollNone)
                this.$viewSize.x -= this.$vtScrollBar.width;
            this.$viewSize.x -= (this.$owner.margin.left + this.$owner.margin.right);
            this.$viewSize.y -= (this.$owner.margin.top + this.$owner.margin.bottom);

            this.$viewSize.x = Math.max(1, this.$viewSize.x);
            this.$viewSize.y = Math.max(1, this.$viewSize.y);
            this.$pageSize.x = this.$viewSize.x;
            this.$pageSize.y = this.$viewSize.y;

            this.handleSizeChanged();
        }

        public setContentSize(w: number, h: number): void {
            if (this.$contentSize.x == w && this.$contentSize.y == h)
                return;

            this.$contentSize.x = w;
            this.$contentSize.y = h;
            this.handleSizeChanged();
        }

        /**
         * @internal
         */
        changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void {
            const isRightmost: boolean = this.$xPos == this.$overlapSize.x;
            const isBottom: boolean = this.$yPos == this.$overlapSize.y;

            this.$contentSize.x += deltaWidth;
            this.$contentSize.y += deltaHeight;
            this.handleSizeChanged();

            if (this.$tweening == 1) {
                //if the last scroll is CLINGING-SIDE, then just continue to cling
                if (deltaWidth != 0 && isRightmost && this.$tweenChange.x < 0) {
                    this.$xPos = this.$overlapSize.x;
                    this.$tweenChange.x = -this.$xPos - this.$tweenStart.x;
                }

                if (deltaHeight != 0 && isBottom && this.$tweenChange.y < 0) {
                    this.$yPos = this.$overlapSize.y;
                    this.$tweenChange.y = -this.$yPos - this.$tweenStart.y;
                }
            }
            else if (this.$tweening == 2) {
                //re-pos to ensure the scrolling will go on smooth
                if (deltaPosX != 0) {
                    this.$container.x -= deltaPosX;
                    this.$tweenStart.x -= deltaPosX;
                    this.$xPos = -this.$container.x;
                }
                if (deltaPosY != 0) {
                    this.$container.y -= deltaPosY;
                    this.$tweenStart.y -= deltaPosY;
                    this.$yPos = -this.$container.y;
                }
            }
            else if (this.$isDragging) {
                if (deltaPosX != 0) {
                    this.$container.x -= deltaPosX;
                    this.$containerPos.x -= deltaPosX;
                    this.$xPos = -this.$container.x;
                }
                if (deltaPosY != 0) {
                    this.$container.y -= deltaPosY;
                    this.$containerPos.y -= deltaPosY;
                    this.$yPos = -this.$container.y;
                }
            }
            else {
                //if the last scroll is CLINGING-SIDE, then just continue to cling
                if (deltaWidth != 0 && isRightmost) {
                    this.$xPos = this.$overlapSize.x;
                    this.$container.x = -this.$xPos;
                }

                if (deltaHeight != 0 && isBottom) {
                    this.$yPos = this.$overlapSize.y;
                    this.$container.y = -this.$yPos;
                }
            }

            if (this.$pageMode)
                this.updatePageController();
        }

        private handleSizeChanged(onScrolling: boolean = false): void {
            if (this.$displayOnDemand) {
                if (this.$vtScrollBar) {
                    if (this.$contentSize.y <= this.$viewSize.y) {
                        if (!this.$vScrollNone) {
                            this.$vScrollNone = true;
                            this.$viewSize.x += this.$vtScrollBar.width;
                        }
                    }
                    else {
                        if (this.$vScrollNone) {
                            this.$vScrollNone = false;
                            this.$viewSize.x -= this.$vtScrollBar.width;
                        }
                    }
                }
                if (this.$hzScrollBar) {
                    if (this.$contentSize.x <= this.$viewSize.x) {
                        if (!this.$hScrollNone) {
                            this.$hScrollNone = true;
                            this.$viewSize.y += this.$hzScrollBar.height;
                        }
                    }
                    else {
                        if (this.$hScrollNone) {
                            this.$hScrollNone = false;
                            this.$viewSize.y -= this.$hzScrollBar.height;
                        }
                    }
                }
            }

            if (this.$vtScrollBar) {
                if (this.$viewSize.y < this.$vtScrollBar.minSize)
                    //use this.$vtScrollBar.displayObject.visible instead of this.$vtScrollBar.visible... ScrollBar actually is not in its owner's display tree, so vtScrollBar.visible will not work
                    this.$vtScrollBar.displayObject.visible = false;
                else {
                    this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
                    if (this.$contentSize.y == 0)
                        this.$vtScrollBar.displayPerc = 0;
                    else
                        this.$vtScrollBar.displayPerc = Math.min(1, this.$viewSize.y / this.$contentSize.y);
                }
            }
            if (this.$hzScrollBar) {
                if (this.$viewSize.x < this.$hzScrollBar.minSize)
                    this.$hzScrollBar.displayObject.visible = false;
                else {
                    this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
                    if (this.$contentSize.x == 0)
                        this.$hzScrollBar.displayPerc = 0;
                    else
                        this.$hzScrollBar.displayPerc = Math.min(1, this.$viewSize.x / this.$contentSize.x);
                }
            }

            const rect: PIXI.Rectangle = this.$maskContainer.scrollRect;
            if (rect) {
                rect.width = this.$viewSize.x;
                rect.height = this.$viewSize.y;
                this.$maskContainer.scrollRect = rect;
            }

            if (this.$scrollType == ScrollType.Horizontal || this.$scrollType == ScrollType.Both)
                this.$overlapSize.x = Math.ceil(Math.max(0, this.$contentSize.x - this.$viewSize.x));
            else
                this.$overlapSize.x = 0;
            if (this.$scrollType == ScrollType.Vertical || this.$scrollType == ScrollType.Both)
                this.$overlapSize.y = Math.ceil(Math.max(0, this.$contentSize.y - this.$viewSize.y));
            else
                this.$overlapSize.y = 0;

            //bounds checking
            this.$xPos = utils.NumberUtil.clamp(this.$xPos, 0, this.$overlapSize.x);
            this.$yPos = utils.NumberUtil.clamp(this.$yPos, 0, this.$overlapSize.y);
            if (this.$refreshBarAxis != null) {
                var max: number = (<IndexedObject>this.$overlapSize)[this.$refreshBarAxis];
                if (max == 0)
                    max = Math.max((<IndexedObject>this.$contentSize)[this.$refreshBarAxis] + this.$footerLockedSize - (<IndexedObject>this.$viewSize)[this.$refreshBarAxis], 0);
                else
                    max += this.$footerLockedSize;

                if (this.$refreshBarAxis == "x") {
                    this.$container.position.set(utils.NumberUtil.clamp(this.$container.x, -max, this.$headerLockedSize),
                        utils.NumberUtil.clamp(this.$container.y, -this.$overlapSize.y, 0));
                }
                else {
                    this.$container.position.set(utils.NumberUtil.clamp(this.$container.x, -this.$overlapSize.x, 0),
                        utils.NumberUtil.clamp(this.$container.y, -max, this.$headerLockedSize));
                }

                if (this.$header != null) {
                    if (this.$refreshBarAxis == "x")
                        this.$header.height = this.$viewSize.y;
                    else
                        this.$header.width = this.$viewSize.x;
                }

                if (this.$footer != null) {
                    if (this.$refreshBarAxis == "y")
                        this.$footer.height = this.$viewSize.y;
                    else
                        this.$footer.width = this.$viewSize.x;
                }
            }
            else {
                this.$container.position.set(utils.NumberUtil.clamp(this.$container.x, -this.$overlapSize.x, 0),
                    utils.NumberUtil.clamp(this.$container.y, -this.$overlapSize.y, 0));
            }

            this.syncScrollBar();
            this.checkRefreshBar();
            if (this.$pageMode)
                this.updatePageController();
        }

        private posChanged(ani: boolean): void {
            if (this.$aniFlag == 0)
                this.$aniFlag = ani ? 1 : -1;
            else if (this.$aniFlag == 1 && !ani)
                this.$aniFlag = -1;

            this.$needRefresh = true;
            GTimer.inst.callLater(this.refresh, this);
        }

        private refresh(): void {
            this.$needRefresh = false;
            GTimer.inst.remove(this.refresh, this);

            if (this.$pageMode || this.$snapToItem) {
                ScrollPane.sEndPos.set(-this.$xPos, -this.$yPos);
                this.alignPosition(ScrollPane.sEndPos, false);
                this.$xPos = -ScrollPane.sEndPos.x;
                this.$yPos = -ScrollPane.sEndPos.y;
            }

            this.refresh2();

            //Events.dispatch(Events.SCROLL, this.$owner.displayObject);
            this.emit(ScrollEvent.SCROLL, this);

            if (this.$needRefresh) { //developer might modify position in the callback, so here refresh again to avoid flickering
                this.$needRefresh = false;
                GTimer.inst.remove(this.refresh, this);
                this.refresh2();
            }
            this.syncScrollBar();
            this.$aniFlag = 0;
        }

        private refresh2(): void {
            if (this.$aniFlag == 1 && !this.$isDragging) {
                let posX: number;
                let posY: number;

                if (this.$overlapSize.x > 0)
                    posX = -Math.floor(this.$xPos);
                else {
                    if (this.$container.x != 0)
                        this.$container.x = 0;
                    posX = 0;
                }
                if (this.$overlapSize.y > 0)
                    posY = -Math.floor(this.$yPos);
                else {
                    if (this.$container.y != 0)
                        this.$container.y = 0;
                    posY = 0;
                }

                if (posX != this.$container.x || posY != this.$container.y) {
                    this.$tweening = 1;
                    this.$tweenTime.set(0, 0);
                    this.$tweenDuration.set(ScrollPane.TWEEN_MANUALLY_SET_DURATION, ScrollPane.TWEEN_MANUALLY_SET_DURATION);
                    this.$tweenStart.set(this.$container.x, this.$container.y);
                    this.$tweenChange.set(posX - this.$tweenStart.x, posY - this.$tweenStart.y);
                    GTimer.inst.addLoop(1, this.tweenUpdate, this);
                }
                else if (this.$tweening != 0)
                    this.killTween();
            }
            else {
                if (this.$tweening != 0)
                    this.killTween();

                this.$container.position.set(Math.floor(-this.$xPos), Math.floor(-this.$yPos));

                this.loopCheckingCurrent();
            }

            if (this.$pageMode)
                this.updatePageController();
        }

        private syncScrollBar(end: boolean = false): void {
            if (this.$vtScrollBar != null) {
                this.$vtScrollBar.scrollPerc = this.$overlapSize.y == 0 ? 0 : utils.NumberUtil.clamp(-this.$container.y, 0, this.$overlapSize.y) / this.$overlapSize.y;
                if (this.$scrollBarDisplayAuto)
                    this.showScrollBar(!end);
            }
            if (this.$hzScrollBar != null) {
                this.$hzScrollBar.scrollPerc = this.$overlapSize.x == 0 ? 0 : utils.NumberUtil.clamp(-this.$container.x, 0, this.$overlapSize.x) / this.$overlapSize.x;
                if (this.$scrollBarDisplayAuto)
                    this.showScrollBar(!end);
            }

            if (end)
                this.$maskContainer.interactive = true;
        }

        private $mouseDown(e:PIXI.interaction.InteractionEvent): void {
            if (!this.$touchEffect)
                return;
                
            if (this.$tweening != 0) {
                this.killTween();
                this.$isDragging = true;
            }
            else
                this.$isDragging = false;

            const globalMouse: PIXI.Point = PIXI.utils.isMobile.any ? 
                this.$owner.globalToLocal(e.data.global.x, e.data.global.y)
                : this.$owner.globalToLocal(GRoot.globalMouseStatus.mouseX, GRoot.globalMouseStatus.mouseY, ScrollPane.sHelperPoint);

            this.$containerPos.set(this.$container.x, this.$container.y);
            this.$beginTouchPos.copy(globalMouse);
            this.$lastTouchPos.copy(globalMouse);
            this.$lastTouchGlobalPos.copy(globalMouse);
            this.$isHoldAreaDone = false;
            this.$velocity.set(0, 0);
            this.$velocityScale = 1;
            this.$lastMoveTime = GTimer.inst.curTime / 1000;

            GRoot.inst.nativeStage.on(InteractiveEvents.Move, this.$mouseMove, this);
            GRoot.inst.nativeStage.on(InteractiveEvents.Up, this.$mouseUp, this);
            GRoot.inst.nativeStage.on(InteractiveEvents.Click, this.$click, this);
        }

        private $mouseMove(): void {
            if (!this.$touchEffect)
                return;

            if (ScrollPane.draggingPane != null && ScrollPane.draggingPane != this || GObject.draggingObject != null)
                return;

            let sensitivity: number = UIConfig.touchScrollSensitivity;

            const globalMouse: PIXI.Point = this.$owner.globalToLocal(GRoot.globalMouseStatus.mouseX, GRoot.globalMouseStatus.mouseY, ScrollPane.sHelperPoint);

            let diff: number, diff2: number;
            let sv: boolean, sh: boolean;

            if (this.$scrollType == ScrollType.Vertical) {
                if (!this.$isHoldAreaDone) {
                    //gesture on vertical dir is being observed
                    ScrollPane.$gestureFlag |= 1;

                    diff = Math.abs(this.$beginTouchPos.y - globalMouse.y);
                    if (diff < sensitivity)
                        return;

                    if ((ScrollPane.$gestureFlag & 2) != 0) {
                        diff2 = Math.abs(this.$beginTouchPos.x - globalMouse.x);
                        if (diff < diff2)
                            return;
                    }
                }

                sv = true;
            }
            else if (this.$scrollType == ScrollType.Horizontal) {
                if (!this.$isHoldAreaDone) {
                    ScrollPane.$gestureFlag |= 2;  //gesture on horz dir is being observed

                    diff = Math.abs(this.$beginTouchPos.x - globalMouse.x);
                    if (diff < sensitivity)
                        return;

                    if ((ScrollPane.$gestureFlag & 1) != 0) {
                        diff2 = Math.abs(this.$beginTouchPos.y - globalMouse.y);
                        if (diff < diff2)
                            return;
                    }
                }

                sh = true;
            }
            else {
                ScrollPane.$gestureFlag = 3;  //both

                if (!this.$isHoldAreaDone) {
                    diff = Math.abs(this.$beginTouchPos.y - globalMouse.y);
                    if (diff < sensitivity) {
                        diff = Math.abs(this.$beginTouchPos.x - globalMouse.x);
                        if (diff < sensitivity)
                            return;
                    }
                }

                sv = sh = true;
            }

            let newPosX: number = Math.floor(this.$containerPos.x + globalMouse.x - this.$beginTouchPos.x);
            let newPosY: number = Math.floor(this.$containerPos.y + globalMouse.y - this.$beginTouchPos.y);

            if (sv) {
                if (newPosY > 0) {
                    if (!this.$bouncebackEffect)
                        this.$container.y = 0;
                    else if (this.$header != null && this.$header.height != 0)    //TODO: height -> maxHeight
                        this.$container.y = Math.floor(Math.min(newPosY * 0.5, this.$header.height));
                    else
                        this.$container.y = Math.floor(Math.min(newPosY * 0.5, this.$viewSize.y * ScrollPane.PULL_DIST_RATIO));
                }
                else if (newPosY < -this.$overlapSize.y) {
                    if (!this.$bouncebackEffect)
                        this.$container.y = -this.$overlapSize.y;
                    else if (this.$footer != null && this.$footer.height > 0)    //TODO: height -> maxHeight
                        this.$container.y = Math.floor(Math.max((newPosY + this.$overlapSize.y) * 0.5, -this.$footer.height) - this.$overlapSize.y);
                    else
                        this.$container.y = Math.floor(Math.max((newPosY + this.$overlapSize.y) * 0.5, -this.$viewSize.y * ScrollPane.PULL_DIST_RATIO) - this.$overlapSize.y);
                }
                else
                    this.$container.y = newPosY;
            }

            if (sh) {
                if (newPosX > 0) {
                    if (!this.$bouncebackEffect)
                        this.$container.x = 0;
                    else if (this.$header != null && this.$header.width != 0)      //TODO: width -> maxWidth
                        this.$container.x = Math.floor(Math.min(newPosX * 0.5, this.$header.width));
                    else
                        this.$container.x = Math.floor(Math.min(newPosX * 0.5, this.$viewSize.x * ScrollPane.PULL_DIST_RATIO));
                }
                else if (newPosX < 0 - this.$overlapSize.x) {
                    if (!this.$bouncebackEffect)
                        this.$container.x = -this.$overlapSize.x;
                    else if (this.$footer != null && this.$footer.width > 0)  //TODO: width -> maxWidth
                        this.$container.x = Math.floor(Math.max((newPosX + this.$overlapSize.x) * 0.5, -this.$footer.width) - this.$overlapSize.x);
                    else
                        this.$container.x = Math.floor(Math.max((newPosX + this.$overlapSize.x) * 0.5, -this.$viewSize.x * ScrollPane.PULL_DIST_RATIO) - this.$overlapSize.x);
                }
                else
                    this.$container.x = newPosX;
            }

            //update acceleration
            const frameRate: number = GRoot.inst.applicationContext.ticker.FPS;
            const now: number = GTimer.inst.curTime / 1000;
            const deltaTime: number = Math.max(now - this.$lastMoveTime, 1 / frameRate);
            let deltaPositionX: number = globalMouse.x - this.$lastTouchPos.x;
            let deltaPositionY: number = globalMouse.y - this.$lastTouchPos.y;
            if (!sh)
                deltaPositionX = 0;
            if (!sv)
                deltaPositionY = 0;
            if (deltaTime != 0) {
                const elapsed: number = deltaTime * frameRate - 1;
                if (elapsed > 1) {
                    const factor: number = Math.pow(0.833, elapsed);
                    this.$velocity.x = this.$velocity.x * factor;
                    this.$velocity.y = this.$velocity.y * factor;
                }
                this.$velocity.x = utils.NumberUtil.lerp(this.$velocity.x, deltaPositionX * 60 / frameRate / deltaTime, deltaTime * 10);
                this.$velocity.y = utils.NumberUtil.lerp(this.$velocity.y, deltaPositionY * 60 / frameRate / deltaTime, deltaTime * 10);
            }

            //in the inertia scrolling we need the offset value to screen space, so here we need to reocrd the offset ratio
            const deltaGlobalPositionX: number = this.$lastTouchGlobalPos.x - globalMouse.x;
            const deltaGlobalPositionY: number = this.$lastTouchGlobalPos.y - globalMouse.y;
            if (deltaPositionX != 0)
                this.$velocityScale = Math.abs(deltaGlobalPositionX / deltaPositionX);
            else if (deltaPositionY != 0)
                this.$velocityScale = Math.abs(deltaGlobalPositionY / deltaPositionY);

            this.$lastTouchPos.copy(globalMouse);
            this.$lastTouchGlobalPos.copy(globalMouse);
            this.$lastMoveTime = now;

            //update position
            if (this.$overlapSize.x > 0)
                this.$xPos = utils.NumberUtil.clamp(-this.$container.x, 0, this.$overlapSize.x);
            if (this.$overlapSize.y > 0)
                this.$yPos = utils.NumberUtil.clamp(-this.$container.y, 0, this.$overlapSize.y);

            if (this.$loop != 0) {
                newPosX = this.$container.x;
                newPosY = this.$container.y;
                if (this.loopCheckingCurrent()) {
                    this.$containerPos.x += this.$container.x - newPosX;
                    this.$containerPos.y += this.$container.y - newPosY;
                }
            }

            ScrollPane.draggingPane = this;
            this.$isHoldAreaDone = true;
            this.$isDragging = true;
            this.$maskContainer.interactive = false;

            this.syncScrollBar();
            this.checkRefreshBar();
            if (this.$pageMode)
                this.updatePageController();

            this.emit(ScrollEvent.SCROLL, this);
            //Events.dispatch(Events.SCROLL, this.$owner.displayObject);
        }

        private $mouseUp(): void {
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$mouseMove, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$mouseUp, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Click, this.$click, this);

            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;

            ScrollPane.$gestureFlag = 0;

            if (!this.$isDragging || !this.$touchEffect) {
                this.$isDragging = false;
                this.$maskContainer.interactive = true;
                return;
            }

            this.$isDragging = false;
            this.$maskContainer.interactive = true;

            this.$tweenStart.set(this.$container.x, this.$container.y);

            ScrollPane.sEndPos.set(this.$tweenStart.x, this.$tweenStart.y);

            let flag: boolean = false;
            if (this.$container.x > 0) {
                ScrollPane.sEndPos.x = 0;
                flag = true;
            }
            else if (this.$container.x < -this.$overlapSize.x) {
                ScrollPane.sEndPos.x = -this.$overlapSize.x;
                flag = true;
            }
            if (this.$container.y > 0) {
                ScrollPane.sEndPos.y = 0;
                flag = true;
            }
            else if (this.$container.y < -this.$overlapSize.y) {
                ScrollPane.sEndPos.y = -this.$overlapSize.y;
                flag = true;
            }
            if (flag) {
                this.$tweenChange.set(ScrollPane.sEndPos.x - this.$tweenStart.x, ScrollPane.sEndPos.y - this.$tweenStart.y);
                if (this.$tweenChange.x < -UIConfig.touchDragSensitivity || this.$tweenChange.y < -UIConfig.touchDragSensitivity) {
                    this.$refreshEventDispatching = true;
                    this.emit(ScrollEvent.PULL_DOWN_RELEASE);
                    //Events.dispatch(Events.PULLthis.$DOWNthis.$RELEASE, this.$owner.displayObject);
                    this.$refreshEventDispatching = false;
                }
                else if (this.$tweenChange.x > UIConfig.touchDragSensitivity || this.$tweenChange.y > UIConfig.touchDragSensitivity) {
                    this.$refreshEventDispatching = true;
                    this.emit(ScrollEvent.PULL_UP_RELEASE);
                    //Events.dispatch(Events.PULLthis.$UPthis.$RELEASE, this.$owner.displayObject);
                    this.$refreshEventDispatching = false;
                }

                if (this.$headerLockedSize > 0 && (<IndexedObject>ScrollPane.sEndPos)[this.$refreshBarAxis] == 0) {
                    (<IndexedObject>ScrollPane.sEndPos)[this.$refreshBarAxis] = this.$headerLockedSize;
                    this.$tweenChange.x = ScrollPane.sEndPos.x - this.$tweenStart.x;
                    this.$tweenChange.y = ScrollPane.sEndPos.y - this.$tweenStart.y;
                }
                else if (this.$footerLockedSize > 0 && (<IndexedObject>ScrollPane.sEndPos)[this.$refreshBarAxis] == -(<IndexedObject>this.$overlapSize)[this.$refreshBarAxis]) {
                    var max: number = (<IndexedObject>this.$overlapSize)[this.$refreshBarAxis];
                    if (max == 0)
                        max = Math.max((<IndexedObject>this.$contentSize)[this.$refreshBarAxis] + this.$footerLockedSize - (<IndexedObject>this.$viewSize)[this.$refreshBarAxis], 0);
                    else
                        max += this.$footerLockedSize;
                    (<IndexedObject>ScrollPane.sEndPos)[this.$refreshBarAxis] = -max;
                    this.$tweenChange.x = ScrollPane.sEndPos.x - this.$tweenStart.x;
                    this.$tweenChange.y = ScrollPane.sEndPos.y - this.$tweenStart.y;
                }

                this.$tweenDuration.set(ScrollPane.TWEEN_DEFAULT_DURATION, ScrollPane.TWEEN_DEFAULT_DURATION);
            }
            else {
                if (!this.$inertiaDisabled) {
                    const frameRate: number = GRoot.inst.applicationContext.ticker.FPS;
                    const elapsed: number = (GTimer.inst.curTime / 1000 - this.$lastMoveTime) * frameRate - 1;
                    if (elapsed > 1) {
                        const factor: number = Math.pow(0.833, elapsed);
                        this.$velocity.x = this.$velocity.x * factor;
                        this.$velocity.y = this.$velocity.y * factor;
                    }
                    //calc dist & duration by speed
                    this.updateTargetAndDuration(this.$tweenStart, ScrollPane.sEndPos);
                }
                else
                    this.$tweenDuration.set(ScrollPane.TWEEN_DEFAULT_DURATION, ScrollPane.TWEEN_DEFAULT_DURATION);

                ScrollPane.sOldChange.set(ScrollPane.sEndPos.x - this.$tweenStart.x, ScrollPane.sEndPos.y - this.$tweenStart.y);

                //adjust
                this.loopCheckingTarget(ScrollPane.sEndPos);
                if (this.$pageMode || this.$snapToItem)
                    this.alignPosition(ScrollPane.sEndPos, true);

                this.$tweenChange.x = ScrollPane.sEndPos.x - this.$tweenStart.x;
                this.$tweenChange.y = ScrollPane.sEndPos.y - this.$tweenStart.y;
                if (this.$tweenChange.x == 0 && this.$tweenChange.y == 0) {
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(false);
                    return;
                }

                if (this.$pageMode || this.$snapToItem) {
                    this.fixDuration("x", ScrollPane.sOldChange.x);
                    this.fixDuration("y", ScrollPane.sOldChange.y);
                }
            }

            this.$tweening = 2;
            this.$tweenTime.set(0, 0);
            GTimer.inst.addLoop(1, this.tweenUpdate, this);
        }

        private $click(): void {
            this.$isDragging = false;
        }

        private $mouseWheel(evt: any): void {
            if (!this.$mouseWheelEnabled)
                return;
            const delta = evt.delta > 0 ? -1 : (evt.delta < 0 ? 1 : 0);
            if (this.$overlapSize.x > 0 && this.$overlapSize.y == 0) {
                if (this.$pageMode)
                    this.setPosX(this.$xPos + this.$pageSize.x * delta, false);
                else
                    this.setPosX(this.$xPos + this.$mouseWheelSpeed * delta, false);
            }
            else {
                if (this.$pageMode)
                    this.setPosY(this.$yPos + this.$pageSize.y * delta, false);
                else
                    this.setPosY(this.$yPos + this.$mouseWheelSpeed * delta, false);
            }
        }

        private $rollOver(): void {
            this.showScrollBar(true);
        }

        private $rollOut(): void {
            this.showScrollBar(false);
        }

        private showScrollBar(visible: boolean): void {
            if (visible) {
                GTimer.inst.remove(this.setScrollBarVisible, this);
                this.setScrollBarVisible(true);
            }
            else
                GTimer.inst.add(500, 1, this.setScrollBarVisible, this, visible);
        }

        private setScrollBarVisible(visible: boolean): void {
            this.$scrollBarVisible = visible && this.$viewSize.x > 0 && this.$viewSize.y > 0;
            if (this.$vtScrollBar)
                this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
            if (this.$hzScrollBar)
                this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
        }

        private getLoopPartSize(division: number, axis: string): number {
            let pad: number = 0;
            if (this.$owner instanceof GList)
                pad = axis == "x" ? this.$owner.columnGap : this.$owner.lineGap;
            return ((<IndexedObject>this.$contentSize)[axis] + pad) / division;
        }

        private loopCheckingCurrent(): boolean {
            let changed: boolean = false;
            if (this.$loop == 1 && this.$overlapSize.x > 0) {
                if (this.$xPos < 0.001) {
                    this.$xPos += this.getLoopPartSize(2, "x");
                    changed = true;
                }
                else if (this.$xPos >= this.$overlapSize.x) {
                    this.$xPos -= this.getLoopPartSize(2, "x");
                    changed = true;
                }
            }
            else if (this.$loop == 2 && this.$overlapSize.y > 0) {
                if (this.$yPos < 0.001) {
                    this.$yPos += this.getLoopPartSize(2, "y");
                    changed = true;
                }
                else if (this.$yPos >= this.$overlapSize.y) {
                    this.$yPos -= this.getLoopPartSize(2, "y");
                    changed = true;
                }
            }

            if (changed)
                this.$container.position.set(Math.floor(-this.$xPos), Math.floor(-this.$yPos));

            return changed;
        }

        private loopCheckingTarget(endPos: PIXI.Point): void {
            if (this.$loop == 1)
                this.loopCheckingTarget2(endPos, "x");

            if (this.$loop == 2)
                this.loopCheckingTarget2(endPos, "y");
        }

        private loopCheckingTarget2(endPos: PIXI.Point, axis: string): void {
            let halfSize: number;
            let tmp: number;
            if ((<IndexedObject>endPos)[axis] > 0) {
                halfSize = this.getLoopPartSize(2, axis);
                tmp = (<IndexedObject>this.$tweenStart)[axis] - halfSize;
                if (tmp <= 0 && tmp >= -(<IndexedObject>this.$overlapSize)[axis]) {
                    (<IndexedObject>endPos)[axis] -= halfSize;
                    (<IndexedObject>this.$tweenStart)[axis] = tmp;
                }
            }
            else if ((<IndexedObject>endPos)[axis] < -(<IndexedObject>this.$overlapSize)[axis]) {
                halfSize = this.getLoopPartSize(2, axis);
                tmp = (<IndexedObject>this.$tweenStart)[axis] + halfSize;
                if (tmp <= 0 && tmp >= -(<IndexedObject>this.$overlapSize)[axis]) {
                    (<IndexedObject>endPos)[axis] += halfSize;
                    (<IndexedObject>this.$tweenStart)[axis] = tmp;
                }
            }
        }

        private loopCheckingNewPos(value: number, axis: string): number {
            if ((<IndexedObject>this.$overlapSize)[axis] == 0)
                return value;

            let pos: number = axis == "x" ? this.$xPos : this.$yPos;
            let changed: boolean = false;
            let v: number;
            if (value < 0.001) {
                value += this.getLoopPartSize(2, axis);
                if (value > pos) {
                    v = this.getLoopPartSize(6, axis);
                    v = Math.ceil((value - pos) / v) * v;
                    pos = utils.NumberUtil.clamp(pos + v, 0, (<IndexedObject>this.$overlapSize)[axis]);
                    changed = true;
                }
            }
            else if (value >= (<IndexedObject>this.$overlapSize)[axis]) {
                value -= this.getLoopPartSize(2, axis);
                if (value < pos) {
                    v = this.getLoopPartSize(6, axis);
                    v = Math.ceil((pos - value) / v) * v;
                    pos = utils.NumberUtil.clamp(pos - v, 0, (<IndexedObject>this.$overlapSize)[axis]);
                    changed = true;
                }
            }

            if (changed) {
                if (axis == "x")
                    this.$container.x = -Math.floor(pos);
                else
                    this.$container.y = -Math.floor(pos);
            }

            return value;
        }

        private alignPosition(pos: PIXI.Point, inertialScrolling: boolean): void {
            if (this.$pageMode) {
                pos.x = this.alignByPage(pos.x, "x", inertialScrolling);
                pos.y = this.alignByPage(pos.y, "y", inertialScrolling);
            }
            else if (this.$snapToItem) {
                var pt: PIXI.Point = this.$owner.getSnappingPosition(-pos.x, -pos.y, ScrollPane.sHelperPoint);
                if (pos.x < 0 && pos.x > -this.$overlapSize.x)
                    pos.x = -pt.x;
                if (pos.y < 0 && pos.y > -this.$overlapSize.y)
                    pos.y = -pt.y;
            }
        }

        private alignByPage(pos: number, axis: string, inertialScrolling: boolean): number {
            let page: number;

            if (pos > 0)
                page = 0;
            else if (pos < -(<IndexedObject>this.$overlapSize)[axis])
                page = Math.ceil((<IndexedObject>this.$contentSize)[axis] / (<IndexedObject>this.$pageSize)[axis]) - 1;
            else {
                page = Math.floor(-pos / (<IndexedObject>this.$pageSize)[axis]);
                var change: number = inertialScrolling ? (pos - (<IndexedObject>this.$containerPos)[axis]) : (pos - (<IndexedObject>this.$container)[axis]);
                var testPageSize: number = Math.min((<IndexedObject>this.$pageSize)[axis], (<IndexedObject>this.$contentSize)[axis] - (page + 1) * (<IndexedObject>this.$pageSize)[axis]);
                var delta: number = -pos - page * (<IndexedObject>this.$pageSize)[axis];

                //page mode magnetic
                if (Math.abs(change) > (<IndexedObject>this.$pageSize)[axis]) {
                    if (delta > testPageSize * 0.5)
                        page++;
                }
                else {
                    if (delta > testPageSize * (change < 0 ? 0.3 : 0.7))
                        page++;
                }

                //re-calc dist
                const dst = (<IndexedObject>this.$pageSize)[axis];
                pos = -page * dst;
                if (pos < -dst)
                    pos = -dst;
            }

            if (inertialScrolling) {
                var oldPos: number = (<IndexedObject>this.$tweenStart)[axis];
                var oldPage: number;
                if (oldPos > 0)
                    oldPage = 0;
                else if (oldPos < -(<IndexedObject>this.$overlapSize)[axis])
                    oldPage = Math.ceil((<IndexedObject>this.$contentSize)[axis] / (<IndexedObject>this.$pageSize)[axis]) - 1;
                else
                    oldPage = Math.floor(-oldPos / (<IndexedObject>this.$pageSize)[axis]);
                var startPage: number = Math.floor(-(<IndexedObject>this.$containerPos)[axis] / (<IndexedObject>this.$pageSize)[axis]);
                if (Math.abs(page - startPage) > 1 && Math.abs(oldPage - startPage) <= 1) {
                    if (page > startPage)
                        page = startPage + 1;
                    else
                        page = startPage - 1;
                    pos = -page * (<IndexedObject>this.$pageSize)[axis];
                }
            }

            return pos;
        }

        private updateTargetAndDuration(orignPos: PIXI.Point, resultPos: PIXI.Point): void {
            resultPos.x = this.updateTargetAndDuration2(orignPos.x, "x");
            resultPos.y = this.updateTargetAndDuration2(orignPos.y, "y");
        }

        private updateTargetAndDuration2(pos: number, axis: string): number {
            let v: number = (<IndexedObject>this.$velocity)[axis];
            var duration: number = 0;
            if (pos > 0)
                pos = 0;
            else if (pos < -(<IndexedObject>this.$overlapSize)[axis])
                pos = -(<IndexedObject>this.$overlapSize)[axis];
            else {
                let v2: number = Math.abs(v) * this.$velocityScale;
                if (PIXI.utils.isMobile.any)
                    v2 *= Math.max(GRoot.inst.stageWrapper.designWidth, GRoot.inst.stageWrapper.designHeight) / Math.max(GRoot.inst.stageWidth, GRoot.inst.stageHeight);
                //threshold, if too slow, stop it
                let ratio: number = 0;
                if (this.$pageMode || !PIXI.utils.isMobile.any) {
                    if (v2 > 500)
                        ratio = Math.pow((v2 - 500) / 500, 2);
                }
                else {
                    if (v2 > 1000)
                        ratio = Math.pow((v2 - 1000) / 1000, 2);
                }
                if (ratio != 0) {
                    if (ratio > 1)
                        ratio = 1;

                    v2 *= ratio;
                    v *= ratio;
                    (<IndexedObject>this.$velocity)[axis] = v;

                    duration = Math.log(60 / v2) / Math.log(this.$decelerationRate) / 60;

                    const change: number = (v / 60 - 1) / (1 - this.$decelerationRate);
                    //const change: number = Math.floor(v * duration * 0.4);
                    pos += change;
                }
            }

            if (duration < ScrollPane.TWEEN_DEFAULT_DURATION)
                duration = ScrollPane.TWEEN_DEFAULT_DURATION;
            (<IndexedObject>this.$tweenDuration)[axis] = duration;

            return pos;
        }

        private fixDuration(axis: string, oldChange: number): void {
            if ((<IndexedObject>this.$tweenChange)[axis] == 0 || Math.abs((<IndexedObject>this.$tweenChange)[axis]) >= Math.abs(oldChange))
                return;

            let newDuration: number = Math.abs((<IndexedObject>this.$tweenChange)[axis] / oldChange) * (<IndexedObject>this.$tweenDuration)[axis];
            if (newDuration < ScrollPane.TWEEN_DEFAULT_DURATION)
                newDuration = ScrollPane.TWEEN_DEFAULT_DURATION;

            (<IndexedObject>this.$tweenDuration)[axis] = newDuration;
        }

        private killTween(): void {
            //tweening == 1: set to end immediately
            if (this.$tweening == 1) {
                this.$container.position.set(this.$tweenStart.x + this.$tweenChange.x, this.$tweenStart.y + this.$tweenChange.y);
                this.emit(ScrollEvent.SCROLL, this);
                //Events.dispatch(Events.SCROLL, this.$owner.displayObject);
            }

            this.$tweening = 0;
            GTimer.inst.remove(this.tweenUpdate, this);
            this.emit(ScrollEvent.SCROLL_END, this);
            //Events.dispatch(Events.SCROLLthis.$END, this.$owner.displayObject);
        }

        private checkRefreshBar(): void {
            if (this.$header == null && this.$footer == null)
                return;

            const pos: number = (<IndexedObject>this.$container)[this.$refreshBarAxis];
            if (this.$header != null) {
                if (pos > 0) {
                    if (this.$header.displayObject.parent == null)
                        this.$maskContainer.addChildAt(this.$header.displayObject, 0);
                    const pt: PIXI.Point = ScrollPane.sHelperPoint;
                    pt.set(this.$header.width, this.$header.height);
                    (<IndexedObject>pt)[this.$refreshBarAxis] = pos;
                    this.$header.setSize(pt.x, pt.y);
                }
                else {
                    if (this.$header.displayObject.parent != null)
                        this.$maskContainer.removeChild(this.$header.displayObject);
                }
            }

            if (this.$footer != null) {
                var max: number = (<IndexedObject>this.$overlapSize)[this.$refreshBarAxis];
                if (pos < -max || max == 0 && this.$footerLockedSize > 0) {
                    if (this.$footer.displayObject.parent == null)
                        this.$maskContainer.addChildAt(this.$footer.displayObject, 0);

                    const pt: PIXI.Point = ScrollPane.sHelperPoint;
                    pt.set(this.$footer.x, this.$footer.y);
                    if (max > 0)
                        (<IndexedObject>pt)[this.$refreshBarAxis] = pos + (<IndexedObject>this.$contentSize)[this.$refreshBarAxis];
                    else
                        (<IndexedObject>pt)[this.$refreshBarAxis] = Math.max(Math.min(pos + (<IndexedObject>this.$viewSize)[this.$refreshBarAxis], (<IndexedObject>this.$viewSize)[this.$refreshBarAxis] - this.$footerLockedSize),
                            (<IndexedObject>this.$viewSize)[this.$refreshBarAxis] - (<IndexedObject>this.$contentSize)[this.$refreshBarAxis]);
                    this.$footer.setXY(pt.x, pt.y);

                    pt.set(this.$footer.width, this.$footer.height);
                    if (max > 0)
                        (<IndexedObject>pt)[this.$refreshBarAxis] = -max - pos;
                    else
                        (<IndexedObject>pt)[this.$refreshBarAxis] = (<IndexedObject>this.$viewSize)[this.$refreshBarAxis] - (<IndexedObject>this.$footer)[this.$refreshBarAxis];
                    this.$footer.setSize(pt.x, pt.y);
                }
                else {
                    if (this.$footer.displayObject.parent != null)
                        this.$maskContainer.removeChild(this.$footer.displayObject);
                }
            }
        }

        private tweenUpdate(): void {
            var nx: number = this.runTween("x");
            var ny: number = this.runTween("y");

            this.$container.position.set(nx, ny);

            if (this.$tweening == 2) {
                if (this.$overlapSize.x > 0)
                    this.$xPos = utils.NumberUtil.clamp(-nx, 0, this.$overlapSize.x);
                if (this.$overlapSize.y > 0)
                    this.$yPos = utils.NumberUtil.clamp(-ny, 0, this.$overlapSize.y);

                if (this.$pageMode)
                    this.updatePageController();
            }

            if (this.$tweenChange.x == 0 && this.$tweenChange.y == 0) {
                this.$tweening = 0;
                GTimer.inst.remove(this.tweenUpdate, this);

                this.loopCheckingCurrent();

                this.syncScrollBar(true);
                this.checkRefreshBar();

                this.emit(ScrollEvent.SCROLL, this);
                this.emit(ScrollEvent.SCROLL_END, this);
                //Events.dispatch(Events.SCROLL, this.$owner.displayObject);
                //Events.dispatch(Events.SCROLLthis.$END, this.$owner.displayObject);
            }
            else {
                this.syncScrollBar(false);
                this.checkRefreshBar();

                this.emit(ScrollEvent.SCROLL, this);
                //Events.dispatch(Events.SCROLL, this.$owner.displayObject);
            }
        }

        private runTween(axis: string): number {
            const delta:number = GTimer.inst.ticker.deltaTime;
            let newValue: number;
            if ((<IndexedObject>this.$tweenChange)[axis] != 0) {
                (<IndexedObject>this.$tweenTime)[axis] += delta * PIXI.settings.TARGET_FPMS;
                if ((<IndexedObject>this.$tweenTime)[axis] >= (<IndexedObject>this.$tweenDuration)[axis]) {
                    newValue = (<IndexedObject>this.$tweenStart)[axis] + (<IndexedObject>this.$tweenChange)[axis];
                    (<IndexedObject>this.$tweenChange)[axis] = 0;
                }
                else {
                    const ratio: number = ScrollPane.$easeTypeFunc((<IndexedObject>this.$tweenTime)[axis], (<IndexedObject>this.$tweenDuration)[axis]);
                    newValue = (<IndexedObject>this.$tweenStart)[axis] + Math.floor((<IndexedObject>this.$tweenChange)[axis] * ratio);
                }

                var threshold1: number = 0;
                var threshold2: number = -(<IndexedObject>this.$overlapSize)[axis];
                if (this.$headerLockedSize > 0 && this.$refreshBarAxis == axis)
                    threshold1 = this.$headerLockedSize;
                if (this.$footerLockedSize > 0 && this.$refreshBarAxis == axis) {
                    var max: number = (<IndexedObject>this.$overlapSize)[this.$refreshBarAxis];
                    if (max == 0)
                        max = Math.max((<IndexedObject>this.$contentSize)[this.$refreshBarAxis] + this.$footerLockedSize - (<IndexedObject>this.$viewSize)[this.$refreshBarAxis], 0);
                    else
                        max += this.$footerLockedSize;
                    threshold2 = -max;
                }

                if (this.$tweening == 2 && this.$bouncebackEffect) {
                    if (newValue > 20 + threshold1 && (<IndexedObject>this.$tweenChange)[axis] > 0
                        || newValue > threshold1 && (<IndexedObject>this.$tweenChange)[axis] == 0) //start to bounce
                    {
                        (<IndexedObject>this.$tweenTime)[axis] = 0;
                        (<IndexedObject>this.$tweenDuration)[axis] = ScrollPane.TWEEN_DEFAULT_DURATION;
                        (<IndexedObject>this.$tweenChange)[axis] = -newValue + threshold1;
                        (<IndexedObject>this.$tweenStart)[axis] = newValue;
                    }
                    else if (newValue < threshold2 - 20 && (<IndexedObject>this.$tweenChange)[axis] < 0
                        || newValue < threshold2 && (<IndexedObject>this.$tweenChange)[axis] == 0)
                    {
                        (<IndexedObject>this.$tweenTime)[axis] = 0;
                        (<IndexedObject>this.$tweenDuration)[axis] = ScrollPane.TWEEN_DEFAULT_DURATION;
                        (<IndexedObject>this.$tweenChange)[axis] = threshold2 - newValue;
                        (<IndexedObject>this.$tweenStart)[axis] = newValue;
                    }
                }
                else {
                    if (newValue > threshold1) {
                        newValue = threshold1;
                        (<IndexedObject>this.$tweenChange)[axis] = 0;
                    }
                    else if (newValue < threshold2) {
                        newValue = threshold2;
                        (<IndexedObject>this.$tweenChange)[axis] = 0;
                    }
                }
            }
            else
                newValue = (<IndexedObject>this.$container)[axis];

            return newValue;
        }
    }
}
