namespace fgui {

    export type GListRenderer = (index: number, item: GObject) => void;
    export type GListItemProvider = (index: number) => string;

    const enum VirtualListChangedType {
        None = 0,
        ContentChanged = 1,
        SizeChanged = 2
    };

    class ItemInfo {
        public width: number = 0;
        public height: number = 0;
        public obj: GObject;
        public updateFlag: number = 0;
        public selected: boolean = false;
    }

    export class GList extends GComponent {

        public itemRenderer: GListRenderer;
        public itemProvider: GListItemProvider;

        public scrollItemToViewOnClick: boolean;
        public foldInvisibleItems: boolean;

        private $layout: number;
        private $lineCount: number = 0;
        private $columnCount: number = 0;
        private $lineGap: number = 0;
        private $columnGap: number = 0;
        private $defaultItem: string;
        private $autoResizeItem: boolean;
        private $selectionMode: ListSelectionMode;
        private $align: AlignType;
        private $verticalAlign: VertAlignType;
        private $selectionController: controller.Controller;

        private $lastSelectedIndex: number = 0;
        private $pool: utils.GObjectRecycler;

        // virtual list
        private $virtual: boolean;
        private $loop: boolean;
        private $numItems: number = 0;
        private $realNumItems: number;
        private $firstIndex: number = 0;       //top left index
        private $curLineItemCount: number = 0; //item count in one line
        private $curLineItemCount2: number;    //for page mode only, represents the item count on vertical direction
        private $itemSize: PIXI.Point;
        private $virtualListChanged: VirtualListChangedType = VirtualListChangedType.None;
        private $virtualItems: ItemInfo[];
        private $eventLocked: boolean;

        //render sorting type
        protected $apexIndex: number = 0;
        private $childrenRenderOrder = ListChildrenRenderOrder.Ascent;

        private $itemInfoVer: number = 0;       //is the item used in the current handling or not
        private $enterCounter: number = 0;      //because the handleScroll function can be re-entered, so this variable is used to avoid dead-lock

        private static $lastPosHelper: number = 0;
        
        public constructor() {
            super();

            this.$trackBounds = true;
            this.$pool = new utils.GObjectRecycler();
            this.$layout = ListLayoutType.SingleColumn;
            this.$autoResizeItem = true;
            this.$lastSelectedIndex = -1;
            this.$selectionMode = ListSelectionMode.Single;
            this.opaque = true;
            this.scrollItemToViewOnClick = true;
            this.$align = AlignType.Left;
            this.$verticalAlign = VertAlignType.Top;

            this.$container = new PIXI.Container();
            this.$rootContainer.addChild(this.$container);
        }

        public get childrenRenderOrder(): ListChildrenRenderOrder {
            return this.$childrenRenderOrder;
        }

        public set childrenRenderOrder(value: ListChildrenRenderOrder) {
            if (this.$childrenRenderOrder != value) {
                this.$childrenRenderOrder = value;
                this.appendChildrenList();
            }
        }

        public get apexIndex(): number {
            return this.$apexIndex;
        }

        public set apexIndex(value: number) {
            if (this.$apexIndex != value) {
                this.$apexIndex = value;

                if (this.$childrenRenderOrder == ListChildrenRenderOrder.Arch)
                    this.appendChildrenList();
            }
        }

        /**@override */
        protected appendChildrenList(): void {
            const cnt: number = this.$children.length;
            if (cnt == 0)
                return;

            let i: number;
            let child: GObject;
            switch (this.$childrenRenderOrder) {
                case ListChildrenRenderOrder.Ascent:
                    {
                        for (i = 0; i < cnt; i++) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;
                case ListChildrenRenderOrder.Descent:
                    {
                        for (i = cnt - 1; i >= 0; i--) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;

                case ListChildrenRenderOrder.Arch:
                    {
                        for (i = 0; i < this.$apexIndex; i++) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                        for (i = cnt - 1; i >= this.$apexIndex; i--) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;
            }
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

        /**@override */
        protected $setChildIndex(child: GObject, oldIndex: number, index: number = 0): number {
            let cnt: number = this.$children.length;
            if (index > cnt)
                index = cnt;

            if (oldIndex == index)
                return oldIndex;

            this.$children.splice(oldIndex, 1);
            this.$children.splice(index, 0, child);

            if (child.inContainer) {
                let displayIndex: number = 0;
                let g: GObject;
                let i: number;

                if (this.$childrenRenderOrder == ListChildrenRenderOrder.Ascent) {
                    for (i = 0; i < index; i++) {
                        g = this.$children[i];
                        if (g.inContainer)
                            displayIndex++;
                    }
                    if (displayIndex == this.$container.children.length)
                        displayIndex--;
                    this.$container.setChildIndex(child.displayObject, displayIndex);
                }
                else if (this.$childrenRenderOrder == ListChildrenRenderOrder.Descent) {
                    for (i = cnt - 1; i > index; i--) {
                        g = this.$children[i];
                        if (g.inContainer)
                            displayIndex++;
                    }
                    if (displayIndex == this.$container.children.length)
                        displayIndex--;
                    this.$container.setChildIndex(child.displayObject, displayIndex);
                }
                else
                    GTimer.inst.callLater(this.appendChildrenList, this);

                this.setBoundsChangedFlag();
            }
            return index;
        }

        /**@override */
        public childStateChanged(child: GObject): void {
            if (this.$buildingDisplayList)
                return;

            if (child instanceof GGroup) {
                this.$children.forEach(g => {
                    if (g.group == child)
                        this.childStateChanged(g);
                }, this);
                return;
            }

            if (!child.displayObject)
                return;

            if (child.finalVisible) {
                let i: number, g: GObject;
                let cnt = this.$children.length;
                if (!child.displayObject.parent) {
                    let index: number = 0;
                    if (this.$childrenRenderOrder == ListChildrenRenderOrder.Ascent) {
                        for (let i = 0; i < cnt; i++) {
                            g = this.$children[i];
                            if (g == child)
                                break;

                            if (g.displayObject != null && g.displayObject.parent != null)
                                index++;
                        }
                        this.$container.addChildAt(child.displayObject, index);
                    }
                    else if (this.$childrenRenderOrder == ListChildrenRenderOrder.Descent) {
                        for (i = cnt - 1; i >= 0; i--) {
                            g = this.$children[i];
                            if (g == child)
                                break;

                            if (g.displayObject != null && g.displayObject.parent != null)
                                index++;
                        }
                        this.$container.addChildAt(child.displayObject, index);
                    }
                    else {
                        this.$container.addChild(child.displayObject);
                        GTimer.inst.callLater(this.appendChildrenList, this);
                    }
                }
            }
            else {
                if (child.displayObject.parent)
                    this.$container.removeChild(child.displayObject);
            }
        }

        public dispose(): void {
            GTimer.inst.remove(this.$refreshVirtualList, this);
            this.$pool.clear();
            if (this.$scrollPane) {
                this.$scrollPane.off(ScrollEvent.SCROLL, this.$scrolled, this);
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
                if (this.$layout == ListLayoutType.FlowVertical || this.$layout == ListLayoutType.Pagination) {
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            }
        }

        public get columnCount(): number {
            return this.$columnCount;
        }

        public set columnCount(value: number) {
            if (this.$columnCount != value) {
                this.$columnCount = value;
                if (this.$layout == ListLayoutType.FlowHorizontal || this.$layout == ListLayoutType.Pagination) {
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
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

        public get selectionController(): controller.Controller {
            return this.$selectionController;
        }

        public set selectionController(value: controller.Controller) {
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
            this.$pool.recycle(obj.resourceURL, obj);
        }

        public addChildAt(child: GObject, index: number = 0): GObject {
            super.addChildAt(child, index);

            if (child instanceof GButton) {
                child.selected = false;
                child.changeStateOnClick = false;
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
            if (index >= 0 && index < this.numChildren) {
                let child: GObject = this.$children[index];
                child.parent = null;

                if (child.sortingOrder != 0)
                    this.$sortingChildCount--;

                this.$children.splice(index, 1);
                if (child.inContainer) {
                    this.$container.removeChild(child.displayObject);
                    if (this.$childrenRenderOrder == ListChildrenRenderOrder.Arch)
                        GTimer.inst.callLater(this.appendChildrenList, this);
                }

                if (dispose === true)
                    child.dispose();

                this.setBoundsChangedFlag();

                child.removeClick(this.$clickItem, this);
                return child;
            }
            else
                throw new Error("Invalid child index");
        }

        public removeChildToPoolAt(index: number): void {
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
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if ((ii.obj instanceof GButton && ii.obj.selected) || (ii.obj == null && ii.selected)) {
                        if (this.$loop)
                            return i % this.$numItems;
                        else
                            return i;
                    }
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null && obj.selected)
                        return i;
                }
            }
            return -1;
        }

        public set selectedIndex(value: number) {
            if (value >= 0 && value < this.numItems) {
                if (this.selectionMode != ListSelectionMode.Single)
                    this.clearSelection();
                this.addSelection(value);
            }
            else
                this.clearSelection();
        }

        public getSelection(): number[] {
            let ret: number[] = [];
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if ((ii.obj instanceof GButton && ii.obj.selected) || (ii.obj == null && ii.selected)) {
                        let j: number = i;
                        if (this.$loop) {
                            j = i % this.$numItems;
                            if (ret.indexOf(j) != -1)
                                continue;
                        }
                        ret.push(j);
                    }
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null && obj.selected)
                        ret.push(i);
                }
            }
            return ret;
        }

        public addSelection(index: number, scrollIntoView: boolean = false): void {
            if (this.$selectionMode == ListSelectionMode.None)
                return;

            this.checkVirtualList();

            if (this.$selectionMode == ListSelectionMode.Single)
                this.clearSelection();

            if (scrollIntoView)
                this.scrollToView(index);

            this.$lastSelectedIndex = index;

            let obj: GButton = null;
            if (this.$virtual) {
                const ii: ItemInfo = this.$virtualItems[index];
                if (ii.obj != null)
                    obj = ii.obj as GButton;
                ii.selected = true;
            }
            else
                obj = this.getChildAt(index) as GButton;

            if (obj != null && !obj.selected) {
                obj.selected = true;
                this.updateSelectionController(index);
            }
        }

        public removeSelection(index: number): void {
            if (this.$selectionMode == ListSelectionMode.None)
                return;

            let obj: GButton = null;
            if (this.$virtual) {
                const ii: ItemInfo = this.$virtualItems[index];
                if (ii.obj != null)
                    obj = ii.obj as GButton;
                ii.selected = false;
            }
            else
                obj = this.getChildAt(index) as GButton;

            if (obj != null)
                obj.selected = false;
        }

        public clearSelection(): void {
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = false;
                    ii.selected = false;
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null)
                        obj.selected = false;
                }
            }
        }

        private clearSelectionExcept(g: GObject): void {
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if (ii.obj != g) {
                        if (ii.obj instanceof GButton)
                            ii.obj.selected = false;
                        ii.selected = false;
                    }
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null && obj != g)
                        obj.selected = false;
                }
            }
        }

        public selectAll(): void {
            this.checkVirtualList();

            let last: number = -1;
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if (ii.obj instanceof GButton && !ii.obj.selected) {
                        ii.obj.selected = true;
                        last = i;
                    }
                    ii.selected = true;
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null && !obj.selected) {
                        obj.selected = true;
                        last = i;
                    }
                }
            }

            if (last != -1)
                this.updateSelectionController(last);
        }

        public selectNone(): void {
            this.clearSelection();
        }

        public selectReverse(): void {
            this.checkVirtualList();

            let last: number = -1;
            let i: number;
            if (this.$virtual) {
                for (i = 0; i < this.$realNumItems; i++) {
                    const ii: ItemInfo = this.$virtualItems[i];
                    if (ii.obj instanceof GButton) {
                        ii.obj.selected = !ii.obj.selected;
                        if (ii.obj.selected)
                            last = i;
                    }
                    ii.selected = !ii.selected;
                }
            }
            else {
                const cnt: number = this.$children.length;
                for (i = 0; i < cnt; i++) {
                    const obj: GButton = this.$children[i] as GButton;
                    if (obj != null) {
                        obj.selected = !obj.selected;
                        if (obj.selected)
                            last = i;
                    }
                }
            }

            if (last != -1)
                this.updateSelectionController(last);
        }

        public handleArrowKey(key: Keys): void {
            let index: number = this.selectedIndex;
            if (index == -1)
                return;

            let current: GObject;
            let k: number, i: number;
            let obj: GObject;

            switch (key) {
                case Keys.Up:
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
                        for (i = index - 1; i >= 0; i--) {
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

                case Keys.Right:
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
                        const cnt: number = this.$children.length;
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

                case Keys.Down:
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
                        const cnt: number = this.$children.length;
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

                case Keys.Left:
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
            if (this.$scrollPane != null && this.$scrollPane.isDragging)
                return;

            const item: GObject = GObject.castFromNativeObject(evt.currentTarget);
            if (!item) return;
            this.setSelectionOnEvent(item);

            if (this.$scrollPane && this.scrollItemToViewOnClick)
                this.$scrollPane.scrollToView(item, true);

            this.emit(ListEvent.ItemClick, evt, item);
        }

        private setSelectionOnEvent(button: GObject): void {
            if (!(button instanceof GButton) || this.$selectionMode == ListSelectionMode.None)
                return;

            let dontChangeLastIndex: boolean = false;
            let index: number = this.childIndexToItemIndex(this.getChildIndex(button));

            if (this.$selectionMode == ListSelectionMode.Single) {
                if (!button.selected) {
                    this.clearSelectionExcept(button);
                    button.selected = true;
                }
            }
            else {
                if (utils.DOMEventManager.inst.isKeyPressed(Keys.Shift)) {
                    if (!button.selected) {
                        if (this.$lastSelectedIndex != -1) {
                            const min: number = Math.min(this.$lastSelectedIndex, index);
                            const max: number = Math.min(Math.max(this.$lastSelectedIndex, index), this.numItems - 1);
                            let i: number;
                            if (this.$virtual) {
                                for (i = min; i <= max; i++) {
                                    const ii: ItemInfo = this.$virtualItems[i];
                                    if (ii.obj instanceof GButton)
                                        ii.obj.selected = true;
                                    ii.selected = true;
                                }
                            }
                            else {
                                for (i = min; i <= max; i++) {
                                    const obj: GButton = this.getChildAt(i) as GButton;
                                    if (obj != null)
                                        obj.selected = true;
                                }
                            }

                            dontChangeLastIndex = true;
                        }
                        else
                            button.selected = true;
                    }
                }
                else if (utils.DOMEventManager.inst.isKeyPressed(Keys.Ctrl) || this.$selectionMode == ListSelectionMode.Multiple_SingleClick)
                    button.selected = !button.selected;
                else {
                    if (!button.selected) {
                        this.clearSelectionExcept(button);
                        button.selected = true;
                    }
                    else
                        this.clearSelectionExcept(button);
                }
            }

            if (!dontChangeLastIndex)
                this.$lastSelectedIndex = index;

            if (button.selected)
                this.updateSelectionController(index);
        }

        public resizeToFit(itemCount: number = 1000000, minSize: number = 0): void {
            this.ensureBoundsCorrect();

            const curCount: number = this.numItems;
            if (itemCount > curCount)
                itemCount = curCount;

            if (this.$virtual) {
                const lineCount: number = Math.ceil(itemCount / this.$curLineItemCount);
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
                let obj: GObject;
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
            const cnt: number = this.$children.length;
            let max: number = 0;
            for (let i: number = 0; i < cnt; i++) {
                const child: GObject = this.getChildAt(i);
                if (child.width > max)
                    max = child.width;
            }
            return max;
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            this.setBoundsChangedFlag();
            if (this.$virtual)
                this.setVirtualListChangedFlag(true);
        }

        public handleControllerChanged(c: controller.Controller): void {
            super.handleControllerChanged(c);

            if (this.$selectionController == c)
                this.selectedIndex = c.selectedIndex;
        }

        private updateSelectionController(index: number): void {
            if (this.$selectionController != null && !this.$selectionController.$updating
                && index < this.$selectionController.pageCount) {
                const c: controller.Controller = this.$selectionController;
                this.$selectionController = null;
                c.selectedIndex = index;
                this.$selectionController = c;
            }
        }

        public getSnappingPosition(xValue: number, yValue: number, resultPoint: PIXI.Point = null): PIXI.Point {
            if (this.$virtual) {
                if (!resultPoint)
                    resultPoint = new PIXI.Point();

                let saved: number;
                let index: number;

                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                    saved = yValue;
                    GList.$lastPosHelper = yValue;
                    index = this.getIndexOnPos1(false);
                    yValue = GList.$lastPosHelper;
                    if (index < this.$virtualItems.length && saved - yValue > this.$virtualItems[index].height / 2 && index < this.$realNumItems)
                        yValue += this.$virtualItems[index].height + this.$lineGap;
                }
                else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                    saved = xValue;
                    GList.$lastPosHelper = xValue;
                    index = this.getIndexOnPos2(false);
                    xValue = GList.$lastPosHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }
                else {
                    saved = xValue;
                    GList.$lastPosHelper = xValue;
                    index = this.getIndexOnPos3(false);
                    xValue = GList.$lastPosHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }

                resultPoint.x = xValue;
                resultPoint.y = yValue;
                return resultPoint;
            }
            else
                return super.getSnappingPosition(xValue, yValue, resultPoint);
        }

        public scrollToView(index: number, ani: boolean = false, snapToFirst: boolean = false): void {
            if (this.$virtual) {
                if (this.$numItems == 0)
                    return;

                this.checkVirtualList();

                if (index >= this.$virtualItems.length)
                    throw new Error(`Invalid child index: ${index} is larger than max length: ${this.$virtualItems.length}`);

                if (this.$loop)
                    index = Math.floor(this.$firstIndex / this.$numItems) * this.$numItems + index;

                let rect: PIXI.Rectangle;
                const ii: ItemInfo = this.$virtualItems[index];
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
                    const page: number = index / (this.$curLineItemCount * this.$curLineItemCount2);
                    rect = new PIXI.Rectangle(page * this.viewWidth + (index % this.$curLineItemCount) * (ii.width + this.$columnGap),
                        (index / this.$curLineItemCount) % this.$curLineItemCount2 * (ii.height + this.$lineGap),
                        ii.width, ii.height);
                }

                //the position will be also changed if the height of its parent (if changeable) is being changed, so here we need to forcely set this to true
                snapToFirst = true;
                if (this.$scrollPane != null)
                    this.$scrollPane.scrollToView(rect, ani, snapToFirst);
            }
            else {
                const obj: GObject = this.getChildAt(index);
                if (this.$scrollPane != null)
                    this.$scrollPane.scrollToView(obj, ani, snapToFirst);
                else if (this.parent != null && this.parent.scrollPane != null)
                    this.parent.scrollPane.scrollToView(obj, ani, snapToFirst);
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

            if (this.$layout == ListLayoutType.Pagination)
                return this.getChildIndex(this.$virtualItems[index].obj);
            else {
                if (this.$loop && this.$numItems > 0) {
                    const j: number = this.$firstIndex % this.$numItems;
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
                    const obj: GObject = this.getFromPool(null);
                    if (obj == null)
                        throw new Error("Virtual list must have a default list item resource specified through list.defaultItem = resUrl.");
                    else {
                        this.$itemSize.x = obj.width;
                        this.$itemSize.y = obj.height;
                    }
                    this.returnToPool(obj);
                }

                if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                    this.$scrollPane.scrollSpeed = this.$itemSize.y;
                    if (this.$loop)
                        this.$scrollPane.$loop = 2;
                }
                else {
                    this.$scrollPane.scrollSpeed = this.$itemSize.x;
                    if (this.$loop)
                        this.$scrollPane.$loop = 1;
                }

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

        public set numItems(value: number) {
            let i: number;

            if (this.$virtual) {
                if (this.itemRenderer == null)
                    throw new Error("list.itemRenderer is required");

                this.$numItems = value;
                if (this.$loop)
                    this.$realNumItems = this.$numItems * 6;   //enlarge for loop
                else
                    this.$realNumItems = this.$numItems;

                //increase only
                const oldCount: number = this.$virtualItems.length;
                if (this.$realNumItems > oldCount) {
                    for (i = oldCount; i < this.$realNumItems; i++) {
                        let ii: ItemInfo = new ItemInfo();
                        ii.width = this.$itemSize.x;
                        ii.height = this.$itemSize.y;
                        this.$virtualItems.push(ii);
                    }
                }
                else {
                    for (i = this.$realNumItems; i < oldCount; i++)
                        this.$virtualItems[i].selected = false;
                }

                if (this.$virtualListChanged != VirtualListChangedType.None)
                    GTimer.inst.remove(this.$refreshVirtualList, this);

                //refresh now
                this.$refreshVirtualList();
            }
            else {
                const cnt: number = this.$children.length;
                if (value > cnt) {
                    for (i = cnt; i < value; i++) {
                        if (this.itemProvider == null)
                            this.addItemFromPool();
                        else
                            this.addItemFromPool(this.itemProvider(i));
                    }
                }
                else
                    this.removeChildrenToPool(value, cnt);

                if (this.itemRenderer != null) {
                    for (i = 0; i < value; i++)
                        this.itemRenderer(i, this.getChildAt(i));
                }
            }
        }

        public refreshVirtualList(): void {
            this.setVirtualListChangedFlag(false);
        }

        private checkVirtualList(): void {
            if (this.$virtualListChanged != VirtualListChangedType.None) {
                this.$refreshVirtualList();
                GTimer.inst.remove(this.$refreshVirtualList, this);
            }
        }

        private setVirtualListChangedFlag(layoutChanged: boolean = false): void {
            if (layoutChanged)
                this.$virtualListChanged = VirtualListChangedType.SizeChanged;
            else if (this.$virtualListChanged == VirtualListChangedType.None)
                this.$virtualListChanged = VirtualListChangedType.ContentChanged;

            GTimer.inst.callLater(this.$refreshVirtualList, this);
        }

        private $refreshVirtualList(): void {
            const layoutChanged: boolean = this.$virtualListChanged == VirtualListChangedType.SizeChanged;
            this.$virtualListChanged = VirtualListChangedType.None;
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
                        ch = this.$scrollPane.viewHeight;
                    else {
                        for (i = 0; i < len2; i++)
                            ch += this.$virtualItems[i].height + this.$lineGap;
                        if (ch > 0)
                            ch -= this.$lineGap;
                    }
                }
                else {
                    const pageCount: number = Math.ceil(len / (this.$curLineItemCount * this.$curLineItemCount2));
                    cw = pageCount * this.viewWidth;
                    ch = this.viewHeight;
                }
            }

            this.handleAlign(cw, ch);
            this.$scrollPane.setContentSize(cw, ch);

            this.$eventLocked = false;

            this.handleScroll(true);
        }

        private $scrolled(): void {
            this.handleScroll(false);
        }

        private getIndexOnPos1(forceUpdate: Boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.$lastPosHelper = 0;
                return 0;
            }

            let i: number;
            let pos2: number;
            let pos3: number;
            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).y;
                if (pos2 > GList.$lastPosHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].height + this.$lineGap);
                        if (pos2 <= GList.$lastPosHelper) {
                            GList.$lastPosHelper = pos2;
                            return i;
                        }
                    }
                    GList.$lastPosHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                        if (pos3 > GList.$lastPosHelper) {
                            GList.$lastPosHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }

                    GList.$lastPosHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                    if (pos3 > GList.$lastPosHelper) {
                        GList.$lastPosHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                GList.$lastPosHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        }

        private getIndexOnPos2(forceUpdate: Boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.$lastPosHelper = 0;
                return 0;
            }

            let i: number;
            let pos2: number;
            let pos3: number;
            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).x;
                if (pos2 > GList.$lastPosHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].width + this.$columnGap);
                        if (pos2 <= GList.$lastPosHelper) {
                            GList.$lastPosHelper = pos2;
                            return i;
                        }
                    }

                    GList.$lastPosHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                        if (pos3 > GList.$lastPosHelper) {
                            GList.$lastPosHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }

                    GList.$lastPosHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                    if (pos3 > GList.$lastPosHelper) {
                        GList.$lastPosHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }

                GList.$lastPosHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        }

        private getIndexOnPos3(forceUpdate: Boolean): number {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.$lastPosHelper = 0;
                return 0;
            }

            const viewWidth: number = this.viewWidth;
            const page: number = Math.floor(GList.$lastPosHelper / viewWidth);
            const startIndex: number = page * (this.$curLineItemCount * this.$curLineItemCount2);
            let i: number;
            let pos3: number;
            let pos2: number = page * viewWidth;
            for (i = 0; i < this.$curLineItemCount; i++) {
                pos3 = pos2 + this.$virtualItems[startIndex + i].width + this.$columnGap;
                if (pos3 > GList.$lastPosHelper) {
                    GList.$lastPosHelper = pos2;
                    return startIndex + i;
                }
                pos2 = pos3;
            }

            GList.$lastPosHelper = pos2;
            return startIndex + this.$curLineItemCount - 1;
        }

        private handleScroll(forceUpdate: boolean): void {
            if (this.$eventLocked)
                return;

            this.$enterCounter = 0;
            if (this.$layout == ListLayoutType.SingleColumn || this.$layout == ListLayoutType.FlowHorizontal) {
                this.handleScroll1(forceUpdate);
                this.handleArchOrder1();
            }
            else if (this.$layout == ListLayoutType.SingleRow || this.$layout == ListLayoutType.FlowVertical) {
                this.handleScroll2(forceUpdate);
                this.handleArchOrder2();
            }
            else
                this.handleScroll3(forceUpdate);

            this.$boundsChanged = false;
        }

        private handleScroll1(forceUpdate: boolean): void {
            this.$enterCounter++;
            if (this.$enterCounter > 3) {
                console.warn("this list view cannot be filled full as the itemRenderer function always returns an item with different size.");
                return;
            }

            let pos: number = this.$scrollPane.scrollingPosY;
            let max: number = pos + this.$scrollPane.viewHeight;
            const end: boolean = max == this.$scrollPane.contentHeight; //indicates we need to scroll to end in spite of content size changing

            //find the first item from current pos
            GList.$lastPosHelper = pos;
            const newFirstIndex: number = this.getIndexOnPos1(forceUpdate);
            if (newFirstIndex == this.$firstIndex && !forceUpdate)
                return;

            pos = GList.$lastPosHelper;
            const oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;

            let curIndex: number = newFirstIndex;
            const forward: boolean = oldFirstIndex > newFirstIndex;
            const oldCount: number = this.numChildren;
            const lastIndex: number = oldFirstIndex + oldCount - 1;
            let reuseIndex: number = forward ? lastIndex : oldFirstIndex;
            let curX: number = 0, curY: number = pos;
            let needRender: boolean;
            let deltaSize: number = 0;
            let firstItemDeltaSize: number = 0;
            let url: string = this.defaultItem;
            let ii: ItemInfo, ii2: ItemInfo;
            let i: number, j: number;
            const partSize: number = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;

            this.$itemInfoVer++;

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
                        if (ii.obj instanceof GButton)
                            ii.selected = ii.obj.selected;
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }

                if (ii.obj == null) {
                    //search for a most suitable item to reuse in order to render or create less item when refresh
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != this.$itemInfoVer && ii2.obj.resourceURL == url) {
                                if (ii2.obj instanceof GButton)
                                    ii2.selected = ii2.obj.selected;
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
                            if (ii2.obj != null && ii2.updateFlag != this.$itemInfoVer && ii2.obj.resourceURL == url) {
                                if (ii2.obj instanceof GButton)
                                    ii2.selected = ii2.obj.selected;
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }

                    if (ii.obj != null)
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = ii.selected;

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
                            //when scrolling down, we need to make compensation for the position to avoid flickering if the item's size changes
                            firstItemDeltaSize = Math.ceil(ii.obj.height) - ii.height;
                        }
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }

                ii.updateFlag = this.$itemInfoVer;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex) //pad one more
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
                if (ii.updateFlag != this.$itemInfoVer && ii.obj != null) {
                    if (ii.obj instanceof GButton)
                        ii.selected = ii.obj.selected;
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(0, deltaSize, 0, firstItemDeltaSize);

            if (curIndex > 0 && this.numChildren > 0 && this.$container.y < 0 && this.getChildAt(0).y > -this.$container.y)  //last page is not full
                this.handleScroll1(false);  //recursive
        }

        private handleScroll2(forceUpdate: boolean): void {
            this.$enterCounter++;
            if (this.$enterCounter > 3) {
                console.warn("this list view cannot be filled full as the itemRenderer function always returns an item with different size.");
                return;
            }

            let pos: number = this.$scrollPane.scrollingPosX;
            let max: number = pos + this.$scrollPane.viewWidth;
            const end: Boolean = pos == this.$scrollPane.contentWidth;

            GList.$lastPosHelper = pos;
            const newFirstIndex: number = this.getIndexOnPos2(forceUpdate);
            if (newFirstIndex == this.$firstIndex && !forceUpdate)
                return;

            pos = GList.$lastPosHelper;
            const oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;

            let curIndex: number = newFirstIndex;
            const forward: Boolean = oldFirstIndex > newFirstIndex;
            const oldCount: number = this.numChildren;
            let lastIndex: number = oldFirstIndex + oldCount - 1;
            let reuseIndex: number = forward ? lastIndex : oldFirstIndex;
            let curX: number = pos, curY: number = 0;
            let needRender: boolean;
            let deltaSize: number = 0;
            let firstItemDeltaSize: number = 0;
            let url: string = this.defaultItem;
            let ii: ItemInfo, ii2: ItemInfo;
            let i: number, j: number;
            const partSize: number = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;

            this.$itemInfoVer++;

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
                        if (ii.obj instanceof GButton)
                            ii.selected = ii.obj.selected;
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }

                if (ii.obj == null) {
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != this.$itemInfoVer && ii2.obj.resourceURL == url) {
                                if (ii2.obj instanceof GButton)
                                    ii2.selected = ii2.obj.selected;
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
                            if (ii2.obj != null && ii2.updateFlag != this.$itemInfoVer && ii2.obj.resourceURL == url) {
                                if (ii2.obj instanceof GButton)
                                    ii2.selected = ii2.obj.selected;
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }

                    if (ii.obj != null)
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof GButton)
                        ii.obj.selected = ii.selected;

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
                        if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex)
                            firstItemDeltaSize = Math.ceil(ii.obj.width) - ii.width;
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }

                ii.updateFlag = this.$itemInfoVer;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex)
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
                if (ii.updateFlag != this.$itemInfoVer && ii.obj != null) {
                    if (ii.obj instanceof GButton)
                        ii.selected = ii.obj.selected;
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }

            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(deltaSize, 0, firstItemDeltaSize, 0);

            if (curIndex > 0 && this.numChildren > 0 && this.$container.x < 0 && this.getChildAt(0).x > -this.$container.x)
                this.handleScroll2(false);
        }

        private handleScroll3(forceUpdate: boolean): void {
            let pos: number = this.$scrollPane.scrollingPosX;

            GList.$lastPosHelper = pos;
            const newFirstIndex: number = this.getIndexOnPos3(forceUpdate);
            if (newFirstIndex == this.$firstIndex && !forceUpdate)
                return;
            pos = GList.$lastPosHelper;

            const oldFirstIndex: number = this.$firstIndex;
            this.$firstIndex = newFirstIndex;

            //height-sync is not supported in pagnation mode, so just only render 1 page
            let reuseIndex: number = oldFirstIndex;
            const virtualItemCount: number = this.$virtualItems.length;
            const pageSize: number = this.$curLineItemCount * this.$curLineItemCount2;
            const startCol: number = newFirstIndex % this.$curLineItemCount;
            const viewWidth: number = this.viewWidth;
            const page: number = Math.floor(newFirstIndex / pageSize);
            const startIndex: number = page * pageSize;
            const lastIndex: number = startIndex + pageSize * 2;
            let needRender: boolean;
            let i: number;
            let ii: ItemInfo, ii2: ItemInfo;
            let col: number;
            let url: string = this.$defaultItem;
            const partWidth: number = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;
            const partHeight: number = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount2 - 1)) / this.$curLineItemCount2;

            this.$itemInfoVer++;

            //add mark for items used this time
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
                ii.updateFlag = this.$itemInfoVer;
            }

            let lastObj: GObject = null;
            let insertIndex: number = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;

                ii = this.$virtualItems[i];
                if (ii.updateFlag != this.$itemInfoVer)
                    continue;

                if (ii.obj == null) {
                    //find if any free item can be used
                    while (reuseIndex < virtualItemCount) {
                        ii2 = this.$virtualItems[reuseIndex];
                        if (ii2.obj != null && ii2.updateFlag != this.$itemInfoVer) {
                            if (ii2.obj instanceof GButton)
                                ii2.selected = ii2.obj.selected;
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
                    else
                        insertIndex = this.setChildIndexBefore(ii.obj, insertIndex);

                    insertIndex++;

                    if (ii.obj instanceof GButton)
                        ii.obj.selected = ii.selected;

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

            //layout
            let borderX: number = (startIndex / pageSize) * viewWidth;
            let xx: number = borderX;
            let yy: number = 0;
            let lineHeight: number = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;

                ii = this.$virtualItems[i];
                if (ii.updateFlag == this.$itemInfoVer)
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

            //release items not used
            for (i = reuseIndex; i < virtualItemCount; i++) {
                ii = this.$virtualItems[i];
                if (ii.updateFlag != this.$itemInfoVer && ii.obj != null) {
                    if (ii.obj instanceof GButton)
                        ii.selected = ii.obj.selected;
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }
        }

        private handleArchOrder1(): void {
            if (this.$childrenRenderOrder == ListChildrenRenderOrder.Arch) {
                const mid: number = this.$scrollPane.posY + this.viewHeight / 2;
                let minDist: number = Number.POSITIVE_INFINITY;
                let dist: number = 0;
                let apexIndex: number = 0;
                const cnt: number = this.numChildren;
                for (let i: number = 0; i < cnt; i++) {
                    const obj: GObject = this.getChildAt(i);
                    if (!this.foldInvisibleItems || obj.visible) {
                        dist = Math.abs(mid - obj.y - obj.height / 2);
                        if (dist < minDist) {
                            minDist = dist;
                            apexIndex = i;
                        }
                    }
                }
                this.apexIndex = apexIndex;
            }
        }

        private handleArchOrder2(): void {
            if (this.childrenRenderOrder == ListChildrenRenderOrder.Arch) {
                const mid: number = this.$scrollPane.posX + this.viewWidth / 2;
                let minDist: number = Number.POSITIVE_INFINITY;
                let dist: number = 0;
                let apexIndex: number = 0;
                const cnt: number = this.numChildren;
                for (let i: number = 0; i < cnt; i++) {
                    const obj: GObject = this.getChildAt(i);
                    if (!this.foldInvisibleItems || obj.visible) {
                        dist = Math.abs(mid - obj.x - obj.width / 2);
                        if (dist < minDist) {
                            minDist = dist;
                            apexIndex = i;
                        }
                    }
                }
                this.apexIndex = apexIndex;
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

        /**@override */
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
            const cnt: number = this.$children.length;
            const viewWidth: number = this.viewWidth;
            const viewHeight: number = this.viewHeight;
            let lineSize: number = 0;
            let lineStart: number = 0;
            let ratio: number;

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
                                else
                                    child.setSize(viewWidth - curX, child.height, true);
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
                                else
                                    child.setSize(child.width, viewHeight - curY, true);
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
                                else
                                    child.setSize(viewWidth - curX, this.$lineCount > 0 ? eachHeight : child.height, true);
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
                                || this.$lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) //new page
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

                let headerRes: string;
                let footerRes: string;
                str = xml.attributes.ptrRes;
                if (str) {
                    arr = str.split(",");
                    headerRes = arr[0];
                    footerRes = arr[1];
                }

                this.setupScroll(scrollBarMargin, scroll, scrollBarDisplay, scrollBarFlags, vtScrollBarRes, hzScrollBarRes, headerRes, footerRes);
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

            str = xml.attributes.renderOrder;
            if (str) {
                this.$childrenRenderOrder = ParseListChildrenRenderOrder(str);
                if (this.$childrenRenderOrder == ListChildrenRenderOrder.Arch) {
                    str = xml.attributes.apex;
                    if (str)
                        this.$apexIndex = parseInt(str);
                }
            }

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
                    str = cxml.attributes.selectedIcon;
                    if (str && (obj instanceof GButton))
                        obj.selectedIcon = str;

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