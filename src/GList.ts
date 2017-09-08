namespace fgui {

    export type GListRenderer = (index: number, item: GObject) => void;
    export type GListItemProvider = (index: number) => string;

    class ItemInfo {
        public width: number = 0;
        public height: number = 0;
        public obj: GObject;
        public updateFlag: number;
    }

    export class GList extends GComponent {

        public itemRenderer: GListRenderer;
        public itemProvider: GListItemProvider;

        public scrollItemToViewOnClick: boolean = true;
        public foldInvisibleItems: boolean = false;

        private $layout: ListLayoutType;
        private $lineCount: number = 0;
        private $columnCount: number = 0;
        private $lineGap: number = 0;
        private $columnGap: number = 0;
        private $defaultItem: string;
        private $autoResizeItem: boolean;
        private $selectionMode: ListSelectionMode;
        private $align: AlignType;
        private $verticalAlign: VertAlignType;
        private $selectionController: Controller;

        private $lastSelectedIndex: number = 0;
        private $pool: utils.GObjectRecycler;

        //virtual list support
        private $virtual: boolean;
        private $loop: boolean;
        private $numItems: number = 0;
        private $realNumItems: number = 0;
        private $firstIndex: number = 0;
        private $curLineItemCount: number = 0;   //item count in one row
        private $curLineItemCount2: number = 0;  //only for page mode, represents the item count on vertical direction
        private $itemSize: PIXI.Point;
        private $virtualListChanged: number = 0; //1-content changed, 2-size changed
        private $virtualItems: ItemInfo[];
        private $eventLocked: boolean;

        public constructor() {
            super();

            this.$trackBounds = true;
            this.$pool = new utils.GObjectRecycler();
            this.$layout = ListLayoutType.SingleColumn;
            this.$autoResizeItem = true;
            this.$lastSelectedIndex = -1;
            this.$selectionMode = ListSelectionMode.Single;
            this.opaque = true;
            this.$align = AlignType.Left;
            this.$verticalAlign = VertAlignType.Top;

            this.$container = new PIXI.Container();
            this.$rootContainer.addChild(this.$container);
        }

        /**@override */
        public setXY(xv: number, yv: number): void {
            if (this.$x != xv || this.$y != yv) {

                this.$x = xv;
                this.$y = yv;

                this.handleXYChanged();
                this.updateGear(GearType.XY);

                if (GObject.draggingObject == this && !GObject.sUpdatingWhileDragging)
                    this.localToGlobalRect(0, 0, this.width, this.height, GObject.sGlobalRect);
            }
        }

        public dispose(): void {
            GTimer.inst.remove(this._refreshVirtualList, this);
            this.$pool.clear();
            if(this.$scrollPane) {
                this.$scrollPane.off(ScrollEvent.SCROLL, this.$scrolled, this);
                this.$scrollPane.dispose();
            }
            super.dispose();
        }

        public get layout(): ListLayoutType {
            return this.$layout;
        }

        public set layout(value: ListLayoutType) {
            if (this.$layout != value) {
                this.$layout = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get lineCount(): number {
            return this.$lineCount;
        }

        public set lineCount(value: number) {
            if (this.$lineCount != value) {
                this.$lineCount = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get columnCount(): number {
            return this.$columnCount;
        }

        public set columnCount(value: number) {
            if (this.$columnCount != value) {
                this.$columnCount = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get lineGap(): number {
            return this.$lineGap;
        }

        public set lineGap(value: number) {
            if (this.$lineGap != value) {
                this.$lineGap = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get columnGap(): number {
            return this.$columnGap;
        }

        public set columnGap(value: number) {
            if (this.$columnGap != value) {
                this.$columnGap = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get align(): AlignType {
            return this.$align;
        }

        public set align(value: AlignType) {
            if (this.$align != value) {
                this.$align = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get verticalAlign(): VertAlignType {
            return this.$verticalAlign;
        }

        public set verticalAlign(value: VertAlignType) {
            if (this.$verticalAlign != value) {
                this.$verticalAlign = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get virtualItemSize(): PIXI.Point {
            return this.$itemSize;
        }

        public set virtualItemSize(value: PIXI.Point) {
            if (this.$virtual) {
                if (this.$itemSize == null)
                    this.$itemSize = new PIXI.Point();
                this.$itemSize.copy(value);
                this.setVirtualListChangedFlag(true);
            }
        }

        public get defaultItem(): string {
            return this.$defaultItem;
        }

        public set defaultItem(val: string) {
            this.$defaultItem = val;
        }

        public get autoResizeItem(): boolean {
            return this.$autoResizeItem;
        }

        public set autoResizeItem(value: boolean) {
            if (this.$autoResizeItem != value) {
                this.$autoResizeItem = value;
                this.setBoundsChangedFlag();
                if (this.$virtual)
                    this.setVirtualListChangedFlag(true);
            }
        }

        public get selectionMode(): ListSelectionMode {
            return this.$selectionMode;
        }

        public set selectionMode(value: ListSelectionMode) {
            this.$selectionMode = value;
        }

        public get selectionController(): Controller {
            return this.$selectionController;
        }

        public set selectionController(value: Controller) {
            this.$selectionController = value;
        }

        public get itemPool(): utils.GObjectRecycler {
            return this.$pool;
        }

        public getFromPool(url: string = null): GObject {
            if (!url)
                url = this.$defaultItem;

            let obj: GObject = this.$pool.get(url);
            if (obj != null)
                obj.visible = true;
            return obj;
        }

        public returnToPool(obj: GObject): void {
            obj.displayObject.cacheAsBitmap = false;
            this.$pool.recycle(obj.resourceURL, obj);
        }

        public addChildAt(child: GObject, index: number = 0): GObject {
            super.addChildAt(child, index);

            if (child instanceof GButton) {
                let button: GButton = child;
                button.selected = false;
                button.changeStateOnClick = false;
            }
            child.click(this.$clickItem, this);
            return child;
        }

        public addItem(url: string = null): GObject {
            if (!url)
                url = this.$defaultItem;

            return this.addChild(UIPackage.createObjectFromURL(url));
        }

        public addItemFromPool(url: string = null): GObject {
            return this.addChild(this.getFromPool(url));
        }

        public removeChildAt(index: number, dispose: boolean = false): GObject {
            let child: GObject = super.removeChildAt(index, dispose);
            child.removeClick(this.$clickItem, this);
            return child;
        }

        public removeChildToPoolAt(index: number = 0): void {
            let child: GObject = super.removeChildAt(index);
            this.returnToPool(child);
        }

        public removeChildToPool(child: GObject): void {
            super.removeChild(child);
            this.returnToPool(child);
        }

        public removeChildrenToPool(beginIndex: number = 0, endIndex: number = -1): void {
            if (endIndex < 0 || endIndex >= this.$children.length)
                endIndex = this.$children.length - 1;
            for (let i: number = beginIndex; i <= endIndex; ++i)
                this.removeChildToPoolAt(beginIndex);
        }

        public get selectedIndex(): number {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; i++) {
                let obj: GButton = this.$children[i] as GButton;
                if (obj != null && obj.selected)
                    return this.childIndexToItemIndex(i);
            }
            return -1;
        }

        public set selectedIndex(value: number) {
            this.clearSelection();
            if (value >= 0 && value < this.numItems)
                this.addSelection(value);
        }

        public getSelection(): Array<number> {
            let ret: number[] = [];
            this.$children.forEach((child: GButton, index: number): void => {
                if (child != null && child.selected)
                    ret.push(this.childIndexToItemIndex(index));
            }, this);
            return ret;
        }

        public addSelection(index: number, scrollItToView: boolean = false): void {
            if (this.$selectionMode == ListSelectionMode.None)
                return;

            this.checkVirtualList();

            if (this.$selectionMode == ListSelectionMode.Single)
                this.clearSelection();

            if (scrollItToView)
                this.scrollToView(index);

            index = this.itemIndexToChildIndex(index);
            if (index < 0 || index >= this.$children.length)
                return;

            let obj: GButton = this.getChildAt(index) as GButton;
            if (obj != null && !obj.selected) {
                obj.selected = true;
                this.updateSelectionController(index);
            }
        }

        public removeSelection(index: number = 0): void {
            if (this.$selectionMode == ListSelectionMode.None)
                return;

            index = this.itemIndexToChildIndex(index);
            if (index >= this.$children.length)
                return;

            let obj: GButton = this.getChildAt(index) as GButton;
            if (obj != null && obj.selected)
                obj.selected = false;
        }

        public clearSelection(): void {
            this.$children.forEach((child: GButton) => {
                if (child != null)
                    child.selected = false;
            }, this);
        }

        public selectAll(): void {
            this.checkVirtualList();

            let last: number = -1;
            this.$children.forEach((child: GButton, index: number) => {
                if (child) {
                    child.selected = true;
                    last = index;
                }
            }, this);

            if (last != -1)
                this.updateSelectionController(last);
        }

        public selectNone(): void {
            this.$children.forEach((child: GObject) => {
                if (child && child instanceof GButton)
                    child.selected = false;
            }, this);
        }

        public selectReverse(): void {
            this.checkVirtualList();

            let last: number = -1;
            this.$children.forEach((child: GObject, index: number) => {
                if (child && child instanceof GButton) {
                    child.selected = !child.selected;
                    if (child.selected)
                        last = index;
                }
            }, this);

            if (last != -1)
                this.updateSelectionController(last);
        }

        public handleArrowKey(dir: number = 0): void {
            let index: number = this.selectedIndex;
            if (index == -1)
                return;

            let obj: GObject, current: GObject;
            let i: number, k: number, cnt: number;

            switch (dir) {
                case 1:      //up
                    if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowVertical) {
                        index--;
                        if (index >= 0) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination) {
                        current = this.$children[index];
                        k = 0;
                        for (let i: number = index - 1; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                this.clearSelection();
                                this.addSelection(i + k + 1, true);
                                break;
                            }
                        }
                    }
                    break;

                case 3://right
                    if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination) {
                        index++;
                        if (index < this.$children.length) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == ListLayoutType.FlowVertical) {
                        current = this.$children[index];
                        k = 0;
                        cnt = this.$children.length;
                        for (i = index + 1; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                this.clearSelection();
                                this.addSelection(i - k - 1, true);
                                break;
                            }
                        }
                    }
                    break;

                case 5://down
                    if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowVertical) {
                        index++;
                        if (index < this.$children.length) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination) {
                        current = this.$children[index];
                        k = 0;
                        cnt = this.$children.length;
                        for (i = index + 1; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                this.clearSelection();
                                this.addSelection(i - k - 1, true);
                                break;
                            }
                        }
                    }
                    break;

                case 7://left
                    if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination) {
                        index--;
                        if (index >= 0) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == ListLayoutType.FlowVertical) {
                        current = this.$children[index];
                        k = 0;
                        for (i = index - 1; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                this.clearSelection();
                                this.addSelection(i + k + 1, true);
                                break;
                            }
                        }
                    }
                    break;
            }
        }

        private $clickItem(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$scrollPane != null && this.$scrollPane.$isDragged)
                return;

            let item: GObject = GObject.castFromNativeObject(evt.currentTarget);
            if (!item)
                return;

            this.setSelectionOnEvent(item);

            if (this.$scrollPane && this.scrollItemToViewOnClick)
                this.$scrollPane.scrollToView(item, true);

            this.emit(ListEvent.ItemClick, evt, item);
        }

        private setSelectionOnEvent(item: GObject): void {
            if (!(item instanceof GButton) || this.$selectionMode == ListSelectionMode.None)
                return;

            let dontChangeLastIndex: boolean = false;
            let index: number = this.getChildIndex(item);

            if (this.$selectionMode == ListSelectionMode.Single) {
                if (!item.selected) {
                    this.clearSelectionExcept(item);
                    item.selected = true;
                }
            }
            else {
                if (!item.selected) {
                    this.clearSelectionExcept(item);
                    item.selected = true;
                }
                else
                    this.clearSelectionExcept(item);
            }

            if (!dontChangeLastIndex)
                this.$lastSelectedIndex = index;

            if (item.selected)
                this.updateSelectionController(index);
        }

        private clearSelectionExcept(obj: GObject): void {
            this.$children.forEach((child: GObject) => {
                if (child && child instanceof GButton && child.selected)
                    child.selected = false;
            }, this);
        }

        public resizeToFit(itemCount: number = Number.POSITIVE_INFINITY, minSize: number = 0): void {
            this.ensureBoundsCorrect();

            let curCount: number = this.numItems;
            if (itemCount > curCount)
                itemCount = curCount;

            if (this.$virtual) {
                let lineCount: number = Math.ceil(itemCount / this.$curLineItemCount);
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal)
                    this.viewHeight = lineCount * this.$itemSize.y + Math.max(0, lineCount - 1) * this.$lineGap;
                else
                    this.viewWidth = lineCount * this.$itemSize.x + Math.max(0, lineCount - 1) * this.$columnGap;
            }
            else if (itemCount == 0) {
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal)
                    this.viewHeight = minSize;
                else
                    this.viewWidth = minSize;
            }
            else {
                let i: number = itemCount - 1;
                let obj: GObject = null;
                while (i >= 0) {
                    obj = this.getChildAt(i);
                    if (!this.foldInvisibleItems || obj.visible)
                        break;
                    i--;
                }
                if (i < 0) {
                    if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal)
                        this.viewHeight = minSize;
                    else
                        this.viewWidth = minSize;
                }
                else {
                    let size: number = 0;
                    if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                        size = obj.y + obj.height;
                        if (size < minSize)
                            size = minSize;
                        this.viewHeight = size;
                    }
                    else {
                        size = obj.x + obj.width;
                        if (size < minSize)
                            size = minSize;
                        this.viewWidth = size;
                    }
                }
            }
        }

        public getMaxItemWidth(): number {
            let max: number = 0;
            this.$children.forEach((child: GObject) => {
                if (child && child.width > max)
                    max = child.width;
            }, this);
            return max;
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();
            this.setBoundsChangedFlag();
            if (this.$virtual)
                this.setVirtualListChangedFlag(true);
        }

        public handleControllerChanged(c: Controller): void {
            super.handleControllerChanged(c);

            if (this.$selectionController == c)
                this.selectedIndex = c.selectedIndex;
        }

        private updateSelectionController(index: number): void {
            if (this.$selectionController != null && !this.$selectionController.$updating && index < this.$selectionController.pageCount) {
                let c: Controller = this.$selectionController;
                this.$selectionController = null;
                c.selectedIndex = index;
                this.$selectionController = c;
            }
        }

        public getSnappingPosition(xValue: number, yValue: number, resultPoint?: PIXI.Point): PIXI.Point {
            if (this.$virtual) {
                if (!resultPoint)
                    resultPoint = new PIXI.Point();

                let saved: number;
                let index: number;
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                    saved = yValue;
                    GList.posHelper = yValue;
                    index = this.getIndexOnPos1(false);
                    yValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - yValue > this.$virtualItems[index].height / 2 && index < this.$realNumItems)
                        yValue += this.$virtualItems[index].height + this.$lineGap;
                }
                else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                    saved = xValue;
                    GList.posHelper = xValue;
                    index = this.getIndexOnPos2(false);
                    xValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }
                else {
                    saved = xValue;
                    GList.posHelper = xValue;
                    index = this.getIndexOnPos3(false);
                    xValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }

                resultPoint.x = xValue;
                resultPoint.y = yValue;
                return resultPoint;
            }
            else {
                return super.getSnappingPosition(xValue, yValue, resultPoint);
            }
        }

        public scrollToView(index: number, ani: boolean = false, setFirst: boolean = false): void {
            if (this.$virtual) {
                if (this.$numItems == 0)
                    return;

                this.checkVirtualList();

                if (index >= this.$virtualItems.length)
                    throw new Error(`Invalid child index: ${index} is larger than max length: ${this.$virtualItems.length}`);

                if (this.$loop)
                    index = Math.floor(this.$firstIndex / this.$numItems) * this.$numItems + index;

                let rect: PIXI.Rectangle;
                let ii: ItemInfo = this.$virtualItems[index];
                let pos: number = 0;
                let i: number;
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                    for (i = 0; i < index; i += this.$curLineItemCount)
                        pos += this.$virtualItems[i].height + this.$lineGap;
                    rect = new PIXI.Rectangle(0, pos, this.$itemSize.x, ii.height);
                }
                else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                    for (i = 0; i < index; i += this.$curLineItemCount)
                        pos += this.$virtualItems[i].width + this.$columnGap;
                    rect = new PIXI.Rectangle(pos, 0, ii.width, this.$itemSize.y);
                }
                else {
                    let page: number = index / (this.$curLineItemCount * this.$curLineItemCount2);
                    rect = new PIXI.Rectangle(page * this.viewWidth + (index % this.$curLineItemCount) * (ii.width + this.$columnGap),
                        (index / this.$curLineItemCount) % this.$curLineItemCount2 * (ii.height + this.$lineGap),
                        ii.width, ii.height);
                }

                //set to top to prevent from position changing caused by the item size changing (size-changeable item)
                setFirst = true;
                if (this.$scrollPane != null)
                    this.$scrollPane.scrollToView(rect, ani, setFirst);
            }
            else {
                let obj: GObject = this.getChildAt(index);
                if (obj != null) {
                    if (this.$scrollPane != null)
                        this.$scrollPane.scrollToView(obj, ani, setFirst);
                    else if (this.parent != null && this.parent.scrollPane != null)
                        this.parent.scrollPane.scrollToView(obj, ani, setFirst);
                }
            }
        }

        public getFirstChildInView(): number {
            return this.childIndexToItemIndex(super.getFirstChildInView());
        }

        public childIndexToItemIndex(index: number): number {
            if (!this.$virtual)
                return index;

            if (this.$layout == ListLayoutType.Pagination) {
                for (let i: number = this.$firstIndex; i < this.$realNumItems; i++) {
                    if (this.$virtualItems[i].obj != null) {
                        index--;
                        if (index < 0)
                            return i;
                    }
                }

                return index;
            }
            else {
                index += this.$firstIndex;
                if (this.$loop && this.$numItems > 0)
                    index = index % this.$numItems;

                return index;
            }
        }

        public itemIndexToChildIndex(index: number): number {
            if (!this.$virtual)
                return index;

            if (this.$layout == ListLayoutType.Pagination) {
                return this.getChildIndex(this.$virtualItems[index].obj);
            }
            else {
                if (this.$loop && this.$numItems > 0) {
                    let j: number = this.$firstIndex % this.$numItems;
                    if (index >= j)
                        index = this.$firstIndex + (index - j);
                    else
                        index = this.$firstIndex + this.$numItems + (j - index);
                }
                else
                    index -= this.$firstIndex;

                return index;
            }
        }

        public setVirtual(): void {
            this.$setVirtual(false);
        }

        /**set as virtual list with loop mode */
        public setVirtualAndLoop(): void {
            this.$setVirtual(true);
        }

        private $setVirtual(loop: boolean): void {
            if (!this.$virtual) {
                if (this.$scrollPane == null)
                    throw new Error("Virtual list must be scrollable");

                if (loop) {
                    if (this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.FlowVertical)
                        throw new Error("Virtual list with loop mode is not supported for both FlowHorizontal and FlowVertical layout");

                    this.$scrollPane.bouncebackEffect = false;
                }

                this.$virtual = true;
                this.$loop = loop;
                this.$virtualItems = [];
                this.removeChildrenToPool();

                if (this.$itemSize == null) {
                    this.$itemSize = new PIXI.Point();
                    let obj: GObject = this.getFromPool(null);
                    if (obj == null) {
                        throw new Error("Virtual list must have a default list item resource specified.");
                    }
                    else {
                        this.$itemSize.x = obj.width;
                        this.$itemSize.y = obj.height;
                    }
                    this.returnToPool(obj);
                }

                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal)
                    this.$scrollPane.scrollSpeed = this.$itemSize.y;
                else
                    this.$scrollPane.scrollSpeed = this.$itemSize.x;

                this.$scrollPane.on(ScrollEvent.SCROLL, this.$scrolled, this);
                this.setVirtualListChangedFlag(true);
            }
        }

        public get numItems(): number {
            if (this.$virtual)
                return this.$numItems;
            else
                return this.$children.length;
        }

        /**
         * set item count for the list.
         * 1, if the list is a normal list (not virtual), the set number of items will be created inside the list.
         * 2, if the list is a virtual list, only count of visible items will be created inside the list's viewport.
         */
        public set numItems(value: number) {
            if (this.$virtual) {
                if (this.itemRenderer == null)
                    throw new Error("list.itemRenderer is required");

                this.$numItems = value;
                if (this.$loop)
                    this.$realNumItems = this.$numItems * 5; //enlarge for loop
                else
                    this.$realNumItems = this.$numItems;

                let oldCount: number = this.$virtualItems.length;
                if (this.$realNumItems > oldCount) {
                    for (let i = oldCount; i < this.$realNumItems; i++) {
                        let ii: ItemInfo = new ItemInfo();
                        ii.width = this.$itemSize.x;
                        ii.height = this.$itemSize.y;

                        this.$virtualItems.push(ii);
                    }
                }

                if (this.$virtualListChanged != 0)
                    GTimer.inst.remove(this._refreshVirtualList, this);

                this._refreshVirtualList();
            }
            else {
                let cnt: number = this.$children.length;
                if (value > cnt) {
                    for (let i: number = cnt; i < value; i++) {
                        if (this.itemProvider == null)
                            this.addItemFromPool();
                        else
                            this.addItemFromPool(this.itemProvider(i));
                    }
                }
                else {
                    this.removeChildrenToPool(value, cnt);
                }
                if (this.itemRenderer != null) {
                    for (let i = 0; i < value; i++)
                        this.itemRenderer(i, this.getChildAt(i));
                }
            }
        }

        public refreshVirtualList(): void {
            this.setVirtualListChangedFlag(false);
        }

        private checkVirtualList(): void {
            if (this.$virtualListChanged != 0) {
                this._refreshVirtualList();
                GTimer.inst.remove(this._refreshVirtualList, this);
            }
        }

        private setVirtualListChangedFlag(layoutChanged: boolean = false): void {
            if (layoutChanged)
                this.$virtualListChanged = 2;
            else if (this.$virtualListChanged == 0)
                this.$virtualListChanged = 1;

            GTimer.inst.callLater(this._refreshVirtualList, this);
        }

        private _refreshVirtualList(): void {
            let layoutChanged: boolean = this.$virtualListChanged == 2;
            this.$virtualListChanged = 0;
            this.$eventLocked = true;

            if (layoutChanged) {
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.SingleRow)
                    this.$curLineItemCount = 1;
                else if (this.$layout == ListLayoutType.FlowHorizontal) {
                    if (this.$columnCount > 0)
                        this.$curLineItemCount = this.$columnCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewWidth + this.$columnGap) / (this.$itemSize.x + this.$columnGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }
                }
                else if (this.$layout == ListLayoutType.FlowVertical) {
                    if (this.$lineCount > 0)
                        this.$curLineItemCount = this.$lineCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewHeight + this.$lineGap) / (this.$itemSize.y + this.$lineGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }
                }
                else //pagination
                {
                    if (this.$columnCount > 0)
                        this.$curLineItemCount = this.$columnCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewWidth + this.$columnGap) / (this.$itemSize.x + this.$columnGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }

                    if (this.$lineCount > 0)
                        this.$curLineItemCount2 = this.$lineCount;
                    else {
                        this.$curLineItemCount2 = Math.floor((this.$scrollPane.viewHeight + this.$lineGap) / (this.$itemSize.y + this.$lineGap));
                        if (this.$curLineItemCount2 <= 0)
                            this.$curLineItemCount2 = 1;
                    }
                }
            }

            let ch: number = 0, cw: number = 0;
            if (this.$realNumItems > 0) {
                let i: number;
                let len: number = Math.ceil(this.$realNumItems / this.$curLineItemCount) * this.$curLineItemCount;
                let len2: number = Math.min(this.$curLineItemCount, this.$realNumItems);
                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                    for (i = 0; i < len; i += this.$curLineItemCount)
                        ch += this.$virtualItems[i].height + this.$lineGap;
                    if (ch > 0)
                        ch -= this.$lineGap;

                    if (this.$autoResizeItem)
                        cw = this.$scrollPane.viewWidth;
                    else {
                        for (i = 0; i < len2; i++)
                            cw += this.$virtualItems[i].width + this.$columnGap;
                        if (cw > 0)
                            cw -= this.$columnGap;
                    }
                }
                else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                    for (i = 0; i < len; i += this.$curLineItemCount)
                        cw += this.$virtualItems[i].width + this.$columnGap;
                    if (cw > 0)
                        cw -= this.$columnGap;

                    if (this.$autoResizeItem)
                        ch = this.scrollPane.viewHeight;
                    else {
                        for (i = 0; i < len2; i++)
                            ch += this.$virtualItems[i].height + this.$lineGap;
                        if (ch > 0)
                            ch -= this.$lineGap;
                    }
                }
                else {
                    let pageCount: number = Math.ceil(len / (this.$curLineItemCount * this.$curLineItemCount2));
                    cw = pageCount * this.viewWidth;
                    ch = this.viewHeight;
                }
            }

            this.handleAlign(cw, ch);
            this.$scrollPane.setContentSize(cw, ch);

            this.$eventLocked = false;

            this.handleScroll(true);
        }

        private $scrolled(evt: Event): void {
            this.handleScroll(false);
        }

        private getIndexOnPos1(forceUpdate: boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }

            let i: number;
            let pos2: number;
            let pos3: number;

            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).y;
                if (pos2 > GList.posHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].height + this.$lineGap);
                        if (pos2 <= GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                    }

                    GList.posHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                        if (pos3 > GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }

                    GList.posHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                    if (pos3 > GList.posHelper) {
                        GList.posHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                GList.posHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        }

        private getIndexOnPos2(forceUpdate: boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }

            let i: number;
            let pos2: number;
            let pos3: number;

            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).x;
                if (pos2 > GList.posHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].width + this.$columnGap);
                        if (pos2 <= GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                    }

                    GList.posHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                        if (pos3 > GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }

                    GList.posHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                    if (pos3 > GList.posHelper) {
                        GList.posHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                GList.posHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        }

        private getIndexOnPos3(forceUpdate: boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }

            let viewWidth: number = this.viewWidth;
            let page: number = Math.floor(GList.posHelper / viewWidth);
            let startIndex: number = page * (this.$curLineItemCount * this.$curLineItemCount2);
            let pos2: number = page * viewWidth;
            let pos3: number;
            let i: number;
            for (i = 0; i < this.$curLineItemCount; i++) {
                pos3 = pos2 + this.$virtualItems[startIndex + i].width + this.$columnGap;
                if (pos3 > GList.posHelper) {
                    GList.posHelper = pos2;
                    return startIndex + i;
                }
                pos2 = pos3;
            }

            GList.posHelper = pos2;
            return startIndex + this.$curLineItemCount - 1;
        }

        private handleScroll(forceUpdate: boolean): void {
            if (this.$eventLocked)
                return;

            let pos: number;
            let roundSize: number;

            if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosY;
                    //key: scroll to head/tail then re-pos
                    roundSize = this.$numItems * (this.$itemSize.y + this.$lineGap);
                    if (pos == 0)
                        this.$scrollPane.posY = roundSize;
                    else if (pos == this.$scrollPane.contentHeight - this.$scrollPane.viewHeight)
                        this.$scrollPane.posY = this.$scrollPane.contentHeight - roundSize - this.viewHeight;
                }

                this.handleScroll1(forceUpdate);
            }
            else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosX;
                    //key: scroll to head/tail then re-pos
                    roundSize = this.$numItems * (this.$itemSize.x + this.$columnGap);
                    if (pos == 0)
                        this.$scrollPane.posX = roundSize;
                    else if (pos == this.$scrollPane.contentWidth - this.$scrollPane.viewWidth)
                        this.$scrollPane.posX = this.$scrollPane.contentWidth - roundSize - this.viewWidth;
                }

                this.handleScroll2(forceUpdate);
            }
            else {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosX;
                    //key: scroll to head/tail then re-pos
                    roundSize = Math.floor(this.$numItems / (this.$curLineItemCount * this.$curLineItemCount2)) * this.viewWidth;
                    if (pos == 0)
                        this.$scrollPane.posX = roundSize;
                    else if (pos == this.$scrollPane.contentWidth - this.$scrollPane.viewWidth)
                        this.$scrollPane.posX = this.$scrollPane.contentWidth - roundSize - this.viewWidth;
                }

                this.handleScroll3(forceUpdate);
            }

            this.$boundsChanged = false;
        }

        private static itemInfoReuseFlag: number = 0; //indicate whether the item is reused in the current handling
        private static scrollEnterCounter: number = 0; //there will be concurrent issue of HandleScroll method, this flag is for the extremely deadlock situation
        private static posHelper: number;

        private handleScroll1(forceUpdate: boolean): void {
            GList.scrollEnterCounter++;
            if (GList.scrollEnterCounter > 3)
                return;

            let pos: number = this.$scrollPane.scrollingPosY;
            let max: number = pos + this.$scrollPane.viewHeight;
            let end: boolean = max == this.$scrollPane.contentHeight;  //need to scroll to the end whatever the size currently is.

            //find the first item around the current pos
            GList.posHelper = pos;
            let newFirstIndex: number = this.getIndexOnPos1(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate) {
                GList.scrollEnterCounter--;
                return;
            }

            let oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;
            let curIndex: number = newFirstIndex;
            let forward: boolean = oldFirstIndex > newFirstIndex;
            let oldCount: number = this.numChildren;
            let lastIndex: number = oldFirstIndex + oldCount - 1;
            let reuseIndex: number = forward ? lastIndex : oldFirstIndex;
            let curX: number = 0, curY: number = pos;
            let needRender: boolean;
            let deltaSize: number = 0;
            let firstItemDeltaSize: number = 0;
            let url: string = this.defaultItem;
            let ii: ItemInfo, ii2: ItemInfo;
            let i: number, j: number;
            let partSize: number = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;

            GList.posHelper++;

            while (curIndex < this.$realNumItems && (end || curY < max)) {
                ii = this.$virtualItems[curIndex];

                if (ii.obj == null || forceUpdate) {
                    if (this.itemProvider != null) {
                        url = this.itemProvider(curIndex % this.$numItems);
                        if (url == null)
                            url = this.$defaultItem;
                        url = UIPackage.normalizeURL(url);
                    }

                    if (ii.obj != null && ii.obj.resourceURL != url) {
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }

                if (ii.obj == null) {
                    //search for a best item to reuse, ensure everytime recreate items after refreshing we render less items
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex--;
                                break;
                            }
                        }
                    }
                    else {
                        for (j = reuseIndex; j <= lastIndex; j++) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }

                    if (ii.obj != null) {
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    }
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = false;

                    needRender = true;
                }
                else
                    needRender = forceUpdate;

                if (needRender) {
                    if (this.$autoResizeItem && (this.$layout == ListLayoutType.SingleColumn || this.$columnCount > 0))
                        ii.obj.setSize(partSize, ii.obj.height, true);

                    this.itemRenderer(curIndex % this.$numItems, ii.obj);
                    if (curIndex % this.$curLineItemCount == 0) {
                        deltaSize += Math.ceil(ii.obj.height) - ii.height;
                        if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                            //pad gap to avoid the scrolling jump if the new coming item's size changes while scrolling down
                            firstItemDeltaSize = Math.ceil(ii.obj.height) - ii.height;
                        }
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }

                ii.updateFlag = GList.itemInfoReuseFlag;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex) //add one more to avoid the empty space in the viewport
                    max += ii.height;

                curX += ii.width + this.$columnGap;

                if (curIndex % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    curX = 0;
                    curY += ii.height + this.$lineGap;
                }
                curIndex++;
            }

            for (i = 0; i < oldCount; i++) {
                ii = this.$virtualItems[oldFirstIndex + i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(0, deltaSize, 0, firstItemDeltaSize);

            if (curIndex > 0 && this.numChildren > 0 && this.$container.y < 0 && this.getChildAt(0).y > -this.$container.y) //最后一页没填满！
                this.handleScroll1(false);

            GList.scrollEnterCounter--;
        }

        private handleScroll2(forceUpdate: boolean): void {
            GList.scrollEnterCounter++;
            if (GList.scrollEnterCounter > 3)
                return;

            let pos: number = this.$scrollPane.scrollingPosX;
            let max: number = pos + this.$scrollPane.viewWidth;
            let end: boolean = pos == this.$scrollPane.contentWidth;

            GList.posHelper = pos;
            let newFirstIndex: number = this.getIndexOnPos2(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate) {
                GList.scrollEnterCounter--;
                return;
            }

            let oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;
            let curIndex: number = newFirstIndex;
            let forward: boolean = oldFirstIndex > newFirstIndex;
            let oldCount: number = this.numChildren;
            let lastIndex: number = oldFirstIndex + oldCount - 1;
            let reuseIndex: number = forward ? lastIndex : oldFirstIndex;
            let curX: number = pos, curY: number = 0;
            let needRender: boolean;
            let deltaSize: number = 0;
            let firstItemDeltaSize: number = 0;
            let url: string = this.defaultItem;
            let ii: ItemInfo, ii2: ItemInfo;
            let i: number, j: number;
            let partSize: number = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;

            GList.itemInfoReuseFlag++;

            while (curIndex < this.$realNumItems && (end || curX < max)) {
                ii = this.$virtualItems[curIndex];

                if (ii.obj == null || forceUpdate) {
                    if (this.itemProvider != null) {
                        url = this.itemProvider(curIndex % this.$numItems);
                        if (url == null)
                            url = this.$defaultItem;
                        url = UIPackage.normalizeURL(url);
                    }

                    if (ii.obj != null && ii.obj.resourceURL != url) {
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }

                if (ii.obj == null) {
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex--;
                                break;
                            }
                        }
                    }
                    else {
                        for (j = reuseIndex; j <= lastIndex; j++) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }

                    if (ii.obj != null) {
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    }
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = false;

                    needRender = true;
                }
                else
                    needRender = forceUpdate;

                if (needRender) {
                    if (this.$autoResizeItem && (this.$layout == ListLayoutType.SingleRow || this.$lineCount > 0))
                        ii.obj.setSize(ii.obj.width, partSize, true);


                    this.itemRenderer(curIndex % this.$numItems, ii.obj);
                    if (curIndex % this.$curLineItemCount == 0) {
                        deltaSize += Math.ceil(ii.obj.width) - ii.width;
                        if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                            firstItemDeltaSize = Math.ceil(ii.obj.width) - ii.width;
                        }
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }

                ii.updateFlag = GList.itemInfoReuseFlag;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex) //pad one more for the empty space in the viewport
                    max += ii.width;

                curY += ii.height + this.$lineGap;

                if (curIndex % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    curY = 0;
                    curX += ii.width + this.$columnGap;
                }
                curIndex++;
            }

            for (i = 0; i < oldCount; i++) {
                ii = this.$virtualItems[oldFirstIndex + i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(deltaSize, 0, firstItemDeltaSize, 0);

            if (curIndex > 0 && this.numChildren > 0 && this.$container.x < 0 && this.getChildAt(0).x > - this.$container.x)//最后一页没填满！
                this.handleScroll2(false);

            GList.scrollEnterCounter--;
        }

        private handleScroll3(forceUpdate: boolean): void {
            let pos: number = this.$scrollPane.scrollingPosX;

            GList.posHelper = pos;
            let newFirstIndex: number = this.getIndexOnPos3(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate)
                return;

            let oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;

            //items are all the same height in pagination mode, so just render a full page
            let reuseIndex: number = oldFirstIndex;
            let virtualItemCount: number = this.$virtualItems.length;
            let pageSize: number = this.$curLineItemCount * this.$curLineItemCount2;
            let startCol: number = newFirstIndex % this.$curLineItemCount;
            let viewWidth: number = this.viewWidth;
            let page: number = Math.floor(newFirstIndex / pageSize);
            let startIndex: number = page * pageSize;
            let lastIndex: number = startIndex + pageSize * 2;
            let needRender: boolean;
            let i: number;
            let ii: ItemInfo, ii2: ItemInfo;
            let col: number;
            let url: string = this.$defaultItem;
            let partWidth: number = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;
            let partHeight: number = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount2 - 1)) / this.$curLineItemCount2;

            GList.itemInfoReuseFlag++;

            //make the items need to be used first
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;

                col = i % this.$curLineItemCount;
                if (i - startIndex < pageSize) {
                    if (col < startCol)
                        continue;
                }
                else {
                    if (col > startCol)
                        continue;
                }

                ii = this.$virtualItems[i];
                ii.updateFlag = GList.itemInfoReuseFlag;
            }

            let lastObj: GObject = null;
            let insertIndex: number = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;

                ii = this.$virtualItems[i];
                if (ii.updateFlag != GList.itemInfoReuseFlag)
                    continue;

                if (ii.obj == null) {
                    //see if there is reusable items
                    while (reuseIndex < virtualItemCount) {
                        ii2 = this.$virtualItems[reuseIndex];
                        if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag) {
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            break;
                        }
                        reuseIndex++;
                    }

                    if (insertIndex == -1)
                        insertIndex = this.getChildIndex(lastObj) + 1;

                    if (ii.obj == null) {
                        if (this.itemProvider != null) {
                            url = this.itemProvider(i % this.$numItems);
                            if (url == null)
                                url = this.$defaultItem;
                            url = UIPackage.normalizeURL(url);
                        }

                        ii.obj = this.$pool.get(url);
                        this.addChildAt(ii.obj, insertIndex);
                    }
                    else {
                        insertIndex = this.setChildIndexBefore(ii.obj, insertIndex);
                    }
                    insertIndex++;

                    if (ii.obj instanceof GButton)
                        ii.obj.selected = false;

                    needRender = true;
                }
                else {
                    needRender = forceUpdate;
                    insertIndex = -1;
                    lastObj = ii.obj;
                }

                if (needRender) {
                    if (this.$autoResizeItem) {
                        if (this.$curLineItemCount == this.$columnCount && this.$curLineItemCount2 == this.$lineCount)
                            ii.obj.setSize(partWidth, partHeight, true);
                        else if (this.$curLineItemCount == this.$columnCount)
                            ii.obj.setSize(partWidth, ii.obj.height, true);
                        else if (this.$curLineItemCount2 == this.$lineCount)
                            ii.obj.setSize(ii.obj.width, partHeight, true);
                    }

                    this.itemRenderer(i % this.$numItems, ii.obj);
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }
            }

            //arrange items
            let borderX: number = (startIndex / pageSize) * viewWidth;
            let xx: number = borderX;
            let yy: number = 0;
            let lineHeight: number = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;

                ii = this.$virtualItems[i];
                if (ii.updateFlag == GList.itemInfoReuseFlag)
                    ii.obj.setXY(xx, yy);

                if (ii.height > lineHeight)
                    lineHeight = ii.height;
                if (i % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    xx = borderX;
                    yy += lineHeight + this.$lineGap;
                    lineHeight = 0;

                    if (i == startIndex + pageSize - 1) {
                        borderX += viewWidth;
                        xx = borderX;
                        yy = 0;
                    }
                }
                else
                    xx += ii.width + this.$columnGap;
            }

            //release unused items
            for (i = reuseIndex; i < virtualItemCount; i++) {
                ii = this.$virtualItems[i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }
        }

        private handleAlign(contentWidth: number, contentHeight: number): void {
            let newOffsetX: number = 0;
            let newOffsetY: number = 0;

            if (contentHeight < this.viewHeight) {
                if (this.$verticalAlign == VertAlignType.Middle)
                    newOffsetY = Math.floor((this.viewHeight - contentHeight) / 2);
                else if (this.$verticalAlign == VertAlignType.Bottom)
                    newOffsetY = this.viewHeight - contentHeight;
            }

            if (contentWidth < this.viewWidth) {
                if (this.$align == AlignType.Center)
                    newOffsetX = Math.floor((this.viewWidth - contentWidth) / 2);
                else if (this.$align == AlignType.Right)
                    newOffsetX = this.viewWidth - contentWidth;
            }


            if (newOffsetX != this.$alignOffset.x || newOffsetY != this.$alignOffset.y) {
                this.$alignOffset.set(newOffsetX, newOffsetY);
                if (this.$scrollPane != null)
                    this.$scrollPane.adjustMaskContainer();
                else {
                    this.$container.x = this.$margin.left + this.$alignOffset.x;
                    this.$container.y = this.$margin.top + this.$alignOffset.y;
                }
            }
        }

        protected updateBounds(): void {
            if (this.$virtual)
                return;

            let i: number;
            let child: GObject;
            let curX: number = 0;
            let curY: number = 0;
            let maxWidth: number = 0;
            let maxHeight: number = 0;
            let cw: number = 0, ch: number = 0;
            let j: number = 0;
            let page: number = 0;
            let k: number = 0;
            let cnt: number = this.$children.length;
            let viewWidth: number = this.viewWidth;
            let viewHeight: number = this.viewHeight;
            let lineSize: number = 0;
            let lineStart: number = 0;
            let ratio: number = 0;

            if (this.$layout == ListLayoutType.SingleColumn) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    if (curY != 0)
                        curY += this.$lineGap;
                    child.y = curY;
                    if (this.$autoResizeItem)
                        child.setSize(viewWidth, child.height, true);
                    curY += Math.ceil(child.height);
                    if (child.width > maxWidth)
                        maxWidth = child.width;
                }
                cw = Math.ceil(maxWidth);
                ch = curY;
            }
            else if (this.$layout == ListLayoutType.SingleRow) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;

                    if (curX != 0)
                        curX += this.$columnGap;
                    child.x = curX;
                    if (this.$autoResizeItem)
                        child.setSize(child.width, viewHeight, true);
                    curX += Math.ceil(child.width);
                    if (child.height > maxHeight)
                        maxHeight = child.height;
                }
                cw = curX;
                ch = Math.ceil(maxHeight);
            }
            else if (this.$layout == ListLayoutType.FlowHorizontal) {
                if (this.$autoResizeItem && this.$columnCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        lineSize += child.sourceWidth;
                        j++;
                        if (j == this.$columnCount || i == cnt - 1) {
                            ratio = (viewWidth - lineSize - (j - 1) * this.$columnGap) / lineSize;
                            curX = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;

                                child.setXY(curX, curY);

                                if (j < i) {
                                    child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), child.height, true);
                                    curX += Math.ceil(child.width) + this.$columnGap;
                                }
                                else {
                                    child.setSize(viewWidth - curX, child.height, true);
                                }
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                            }
                            //new line
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;
                        }
                    }
                    ch = curY + Math.ceil(maxHeight);
                    cw = viewWidth;
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        if (curX != 0)
                            curX += this.$columnGap;

                        if (this.$columnCount != 0 && j >= this.$columnCount
                            || this.$columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                            //new line
                            curX = 0;
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                        }
                        child.setXY(curX, curY);
                        curX += Math.ceil(child.width);
                        if (curX > maxWidth)
                            maxWidth = curX;
                        if (child.height > maxHeight)
                            maxHeight = child.height;
                        j++;
                    }
                    ch = curY + Math.ceil(maxHeight);
                    cw = Math.ceil(maxWidth);
                }
            }
            else if (this.$layout == ListLayoutType.FlowVertical) {
                if (this.$autoResizeItem && this.$lineCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        lineSize += child.sourceHeight;
                        j++;
                        if (j == this.$lineCount || i == cnt - 1) {
                            ratio = (viewHeight - lineSize - (j - 1) * this.$lineGap) / lineSize;
                            curY = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;

                                child.setXY(curX, curY);

                                if (j < i) {
                                    child.setSize(child.width, child.sourceHeight + Math.round(child.sourceHeight * ratio), true);
                                    curY += Math.ceil(child.height) + this.$lineGap;
                                }
                                else {
                                    child.setSize(child.width, viewHeight - curY, true);
                                }
                                if (child.width > maxWidth)
                                    maxWidth = child.width;
                            }
                            //new line
                            curX += Math.ceil(maxWidth) + this.$columnGap;
                            maxWidth = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;
                        }
                    }
                    cw = curX + Math.ceil(maxWidth);
                    ch = viewHeight;
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        if (curY != 0)
                            curY += this.$lineGap;

                        if (this.$lineCount != 0 && j >= this.$lineCount
                            || this.$lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) {
                            curY = 0;
                            curX += Math.ceil(maxWidth) + this.$columnGap;
                            maxWidth = 0;
                            j = 0;
                        }
                        child.setXY(curX, curY);
                        curY += Math.ceil(child.height);
                        if (curY > maxHeight)
                            maxHeight = curY;
                        if (child.width > maxWidth)
                            maxWidth = child.width;
                        j++;
                    }
                    cw = curX + Math.ceil(maxWidth);
                    ch = Math.ceil(maxHeight);
                }
            }
            else //pagination
            {
                let eachHeight: number;
                if (this.$autoResizeItem && this.$lineCount > 0)
                    eachHeight = Math.floor((viewHeight - (this.$lineCount - 1) * this.$lineGap) / this.$lineCount);

                if (this.$autoResizeItem && this.$columnCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        lineSize += child.sourceWidth;
                        j++;
                        if (j == this.$columnCount || i == cnt - 1) {
                            ratio = (viewWidth - lineSize - (j - 1) * this.$columnGap) / lineSize;
                            curX = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;

                                child.setXY(page * viewWidth + curX, curY);

                                if (j < i) {
                                    child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio),
                                        this.$lineCount > 0 ? eachHeight : child.height, true);
                                    curX += Math.ceil(child.width) + this.$columnGap;
                                }
                                else {
                                    child.setSize(viewWidth - curX, this.$lineCount > 0 ? eachHeight : child.height, true);
                                }
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                            }
                            //new line
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;

                            k++;

                            if (this.$lineCount != 0 && k >= this.$lineCount
                                || this.$lineCount == 0 && curY + child.height > viewHeight) {
                                //new page
                                page++;
                                curY = 0;
                                k = 0;
                            }
                        }
                    }
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;

                        if (curX != 0)
                            curX += this.$columnGap;

                        if (this.$autoResizeItem && this.$lineCount > 0)
                            child.setSize(child.width, eachHeight, true);

                        if (this.$columnCount != 0 && j >= this.$columnCount
                            || this.$columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                            //new line
                            curX = 0;
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            k++;

                            if (this.$lineCount != 0 && k >= this.$lineCount
                                || this.$lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0)//new page
                            {
                                page++;
                                curY = 0;
                                k = 0;
                            }
                        }
                        child.setXY(page * viewWidth + curX, curY);
                        curX += Math.ceil(child.width);
                        if (curX > maxWidth)
                            maxWidth = curX;
                        if (child.height > maxHeight)
                            maxHeight = child.height;
                        j++;
                    }
                }
                ch = page > 0 ? viewHeight : curY + Math.ceil(maxHeight);
                cw = (page + 1) * viewWidth;
            }

            this.handleAlign(cw, ch);
            this.setBounds(0, 0, cw, ch);
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let str: string;
            let arr: string[];

            str = xml.attributes.layout;
            if (str)
                this.$layout = ParseListLayoutType(str);

            let overflow: OverflowType;
            str = xml.attributes.overflow;
            if (str)
                overflow = ParseOverflowType(str);
            else
                overflow = OverflowType.Visible;

            str = xml.attributes.margin;
            if (str)
                this.$margin.parse(str);

            str = xml.attributes.align;
            if (str)
                this.$align = ParseAlignType(str);

            str = xml.attributes.vAlign;
            if (str)
                this.$verticalAlign = ParseVertAlignType(str);

            if (overflow == OverflowType.Scroll) {
                let scroll: ScrollType;
                str = xml.attributes.scroll;
                if (str)
                    scroll = ParseScrollType(str);
                else
                    scroll = ScrollType.Vertical;

                let scrollBarDisplay: ScrollBarDisplayType;
                str = xml.attributes.scrollBar;
                if (str)
                    scrollBarDisplay = ParseScrollBarDisplayType(str);
                else
                    scrollBarDisplay = ScrollBarDisplayType.Default;

                let scrollBarFlags: number;
                str = xml.attributes.scrollBarFlags;
                if (str)
                    scrollBarFlags = parseInt(str);
                else
                    scrollBarFlags = 0;

                let scrollBarMargin: utils.Margin = new utils.Margin();
                str = xml.attributes.scrollBarMargin;
                if (str)
                    scrollBarMargin.parse(str);

                let vtScrollBarRes: string;
                let hzScrollBarRes: string;
                str = xml.attributes.scrollBarRes;
                if (str) {
                    arr = str.split(",");
                    vtScrollBarRes = arr[0];
                    hzScrollBarRes = arr[1];
                }

                this.setupScroll(scrollBarMargin, scroll, scrollBarDisplay, scrollBarFlags, vtScrollBarRes, hzScrollBarRes);
            }
            else
                this.setupOverflow(overflow);

            str = xml.attributes.lineGap;
            if (str)
                this.$lineGap = parseInt(str);

            str = xml.attributes.colGap;
            if (str)
                this.$columnGap = parseInt(str);

            str = xml.attributes.lineItemCount;
            if (str) {
                if (this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination)
                    this.$columnCount = parseInt(str);
                else if (this.$layout == ListLayoutType.FlowVertical)
                    this.$lineCount = parseInt(str);
            }

            str = xml.attributes.lineItemCount2;
            if (str)
                this.$lineCount = parseInt(str);

            str = xml.attributes.selectionMode;
            if (str)
                this.$selectionMode = ParseListSelectionMode(str);

            str = xml.attributes.defaultItem;
            if (str)
                this.$defaultItem = str;

            str = xml.attributes.autoItemSize;
            if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.SingleColumn)
                this.$autoResizeItem = str != "false";
            else
                this.$autoResizeItem = str == "true";

            let col: utils.XmlNode[] = xml.children;
            col.forEach(cxml => {
                if (cxml.nodeName != "item")
                    return;

                let url: string = cxml.attributes.url;
                if (!url)
                    url = this.$defaultItem;

                if (!url)
                    return;

                let obj: GObject = this.getFromPool(url);
                if (obj != null) {
                    this.addChild(obj);
                    str = cxml.attributes.title;
                    if (str)
                        obj.text = str;
                    str = cxml.attributes.icon;
                    if (str)
                        obj.icon = str;
                    str = cxml.attributes.name;
                    if (str)
                        obj.name = str;
                }
            }, this);
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            let str: string;
            str = xml.attributes.selectionController;
            if (str)
                this.$selectionController = this.parent.getController(str);
        }
    }
}