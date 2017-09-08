/// <reference path="./GObject.ts" />

namespace fgui {

    export class GComponent extends GObject {

        protected $sortingChildCount: number = 0;
        protected $opaque: boolean;

        protected $margin: utils.Margin;
        protected $trackBounds: boolean;
        protected $boundsChanged: boolean;
        protected $children: GObject[];

        /**@internal */
        $buildingDisplayList: boolean;
        /**@internal */
        $controllers: Controller[];
        /**@internal */
        $transitions: Transition[];
        /**@internal */
        $rootContainer: UIContainer;
        /**@internal */
        $container: PIXI.Container;
        /**@internal */
        $scrollPane: ScrollPane;
        /**@internal */
        $alignOffset: PIXI.Point;

        public constructor() {
            super();
            this.$children = [];
            this.$controllers = [];
            this.$transitions = [];
            this.$margin = new utils.Margin();
            this.$alignOffset = new PIXI.Point();
        }

        protected createDisplayObject(): void {
            this.$rootContainer = new UIContainer(this);
            this.setDisplayObject(this.$rootContainer);
            this.$container = this.$rootContainer;
        }

        public dispose(): void {
            GTimer.inst.remove(this.$reRenderLater, this);
            this.off("added", this.$added, this);
            this.off("removed", this.$removed, this);
            this.$transitions.forEach((trans: Transition): void => {
                trans.dispose();
            });
            let numChildren: number = this.$children.length;
            for (let i = numChildren - 1; i >= 0; --i) {
                let obj: GObject = this.$children[i];
                obj.parent = null; //avoid removeFromParent call
                obj.dispose();
            }
            this.$boundsChanged = false;
            if(this.$scrollPane) this.$scrollPane.dispose();
            super.dispose();
        }

        public get displayListContainer(): PIXI.Container {
            return this.$container;
        }

        public addChild(child: GObject): GObject {
            this.addChildAt(child, this.$children.length);
            return child;
        }

        public addChildAt(child: GObject, index: number = 0): GObject {
            if (!child)
                throw new Error("Invalid child");
            let numChildren: number = this.$children.length;
            if (index >= 0 && index <= numChildren) {
                if (child.parent == this)
                    this.setChildIndex(child, index);
                else {
                    child.removeFromParent();
                    child.parent = this;
                    let cnt: number = this.$children.length;
                    if (child.sortingOrder != 0) {
                        this.$sortingChildCount++;
                        index = this.getInsertPosForSortingChild(child);
                    }
                    else if (this.$sortingChildCount > 0) {
                        if (index > (cnt - this.$sortingChildCount))
                            index = cnt - this.$sortingChildCount;
                    }
                    if (index == cnt)
                        this.$children.push(child);
                    else
                        this.$children.splice(index, 0, child);
                    this.childStateChanged(child);
                    this.setBoundsChangedFlag();
                }
                return child;
            }
            else
                throw new Error("Invalid child index");
        }

        private getInsertPosForSortingChild(target: GObject): number {
            let cnt: number = this.$children.length;
            let i: number = 0;
            for (i = 0; i < cnt; i++) {
                let child: GObject = this.$children[i];
                if (child == target)
                    continue;
                if (target.sortingOrder < child.sortingOrder)
                    break;
            }
            return i;
        }

        public removeChild(child: GObject, dispose: boolean = false): GObject {
            let childIndex: number = this.$children.indexOf(child);
            if (childIndex != -1)
                this.removeChildAt(childIndex, dispose);
            return child;
        }

        public removeChildAt(index: number, dispose: boolean = false): GObject {
            if (index >= 0 && index < this.numChildren) {
                let child: GObject = this.$children[index];
                child.parent = null;

                if (child.sortingOrder != 0)
                    this.$sortingChildCount--;

                this.$children.splice(index, 1);
                if (child.inContainer)
                    this.$container.removeChild(child.displayObject);

                if (dispose === true)
                    child.dispose();

                this.setBoundsChangedFlag();

                return child;
            }
            else
                throw new Error("Invalid child index");
        }

        public removeChildren(beginIndex: number = 0, endIndex: number = -1, dispose: boolean = false): void {
            if (endIndex < 0 || endIndex >= this.numChildren)
                endIndex = this.numChildren - 1;

            for (let i: number = beginIndex; i <= endIndex; ++i)
                this.removeChildAt(beginIndex, dispose);
        }

        public getChildAt(index: number = 0): GObject {
            if (index >= 0 && index < this.numChildren)
                return this.$children[index];
            else
                throw new Error("Invalid child index");
        }

        public getChild(name: string): GObject {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; ++i) {
                if (this.$children[i].name == name)
                    return this.$children[i];
            }
            return null;
        }

        public getVisibleChild(name: string): GObject {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; ++i) {
                let child: GObject = this.$children[i];
                if (child.finalVisible && child.name == name)
                    return child;
            }
            return null;
        }

        public getChildInGroup(name: string, group: GGroup): GObject {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; ++i) {
                let child: GObject = this.$children[i];
                if (child.group == group && child.name == name)
                    return child;
            }
            return null;
        }

        public getChildById(id: string): GObject {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; ++i) {
                if (this.$children[i].id == id)
                    return this.$children[i];
            }
            return null;
        }

        public getChildIndex(child: GObject): number {
            return this.$children.indexOf(child);
        }

        public setChildIndex(child: GObject, index: number = 0): void {
            let oldIndex: number = this.$children.indexOf(child);
            if (oldIndex == -1)
                throw new Error("no such child found");
            if (child.sortingOrder != 0) //no effect
                return;
            let cnt: number = this.$children.length;
            if (this.$sortingChildCount > 0) {
                if (index > (cnt - this.$sortingChildCount - 1))
                    index = cnt - this.$sortingChildCount - 1;
            }
            this.$setChildIndex(child, oldIndex, index);
        }

        public setChildIndexBefore(child: GObject, index: number): number {
            let oldIndex: number = this.$children.indexOf(child);
            if (oldIndex == -1)
                throw new Error("no such child found");
            if (child.sortingOrder != 0) //no effect
                return oldIndex;
            let cnt: number = this.$children.length;
            if (this.$sortingChildCount > 0) {
                if (index > (cnt - this.$sortingChildCount - 1))
                    index = cnt - this.$sortingChildCount - 1;
            }
            if (oldIndex < index)
                return this.$setChildIndex(child, oldIndex, index - 1);
            else
                return this.$setChildIndex(child, oldIndex, index);
        }

        private $setChildIndex(child: GObject, oldIndex: number, index: number = 0): number {
            let cnt: number = this.$children.length;
            if (index > cnt)
                index = cnt;

            if (oldIndex == index)
                return oldIndex;

            this.$children.splice(oldIndex, 1);
            this.$children.splice(index, 0, child);

            if (child.inContainer) {
                let displayIndex: number = 0;
                let childCount: number = this.$container.children.length;
                for (let i: number = 0; i < index; i++) {
                    let g: GObject = this.$children[i];
                    if (g.inContainer)
                        displayIndex++;
                }
                if (displayIndex == childCount)
                    displayIndex--;
                this.$container.setChildIndex(child.displayObject, displayIndex);

                this.setBoundsChangedFlag();
            }
            return index;
        }

        public swapChildren(child1: GObject, child2: GObject): void {
            let index1: number = this.$children.indexOf(child1);
            let index2: number = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1)
                throw new Error("no such child found");
            this.swapChildrenAt(index1, index2);
        }

        public swapChildrenAt(index1: number, index2: number = 0): void {
            let child1: GObject = this.$children[index1];
            let child2: GObject = this.$children[index2];
            this.setChildIndex(child1, index2);
            this.setChildIndex(child2, index1);
        }

        public get numChildren(): number {
            return this.$children.length;
        }

        public isAncestorOf(child: GObject): boolean {
            if (child == null)
                return false;

            let p: GComponent = child.parent;
            while (p) {
                if (p == this)
                    return true;

                p = p.parent;
            }
            return false;
        }

        public addController(controller: Controller): void {
            this.$controllers.push(controller);
            controller.$parent = this;
            this.applyController(controller);
        }

        public getControllerAt(index: number): Controller {
            return this.$controllers[index];
        }

        public getController(name: string): Controller {
            let cnt: number = this.$controllers.length;
            for (let i: number = 0; i < cnt; ++i) {
                let c: Controller = this.$controllers[i];
                if (c.name == name)
                    return c;
            }
            return null;
        }

        public removeController(c: Controller): void {
            let index: number = this.$controllers.indexOf(c);
            if (index == -1)
                throw new Error("controller not exists");

            c.$parent = null;
            this.$controllers.splice(index, 1);

            this.$children.forEach(child => {
                child.handleControllerChanged(c);
            });
        }

        public get controllers(): Controller[] {
            return this.$controllers;
        }

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
                if (!child.displayObject.parent) {
                    let index: number = 0;
                    let len: number = this.$children.length;
                    for (let i1: number = 0; i1 < len; i1++) {
                        let g = this.$children[i1];
                        if (g == child)
                            break;

                        if (g.displayObject && g.displayObject.parent)
                            index++;
                    }
                    this.$container.addChildAt(child.displayObject, index);
                }
            }
            else {
                if (child.displayObject.parent)
                    this.$container.removeChild(child.displayObject);
            }
        }

        public applyController(c: Controller): void {
            this.$children.forEach(child => {
                child.handleControllerChanged(c);
            });
        }

        public applyAllControllers(): void {
            this.$controllers.forEach(c => {
                this.applyController(c);
            }, this);
        }

        public adjustRadioGroupDepth(obj: GObject, c: Controller): void {
            let myIndex: number = -1, maxIndex: number = -1;
            this.$children.forEach((child, i) => {
                if (child == obj) {
                    myIndex = i;
                }
                else if ((child instanceof GButton)
                    && child.relatedController == c) {
                    if (i > maxIndex)
                        maxIndex = i;
                }
            });
            if (myIndex < maxIndex)
                this.swapChildrenAt(myIndex, maxIndex);
        }

        public getTransitionAt(index: number): Transition {
            return this.$transitions[index];
        }

        public getTransition(transName: string): Transition {
            let cnt: number = this.$transitions.length;
            for (let i: number = 0; i < cnt; ++i) {
                let trans: Transition = this.$transitions[i];
                if (trans.name == transName)
                    return trans;
            }
            return null;
        }

        public isChildInView(child: GObject): boolean {
            if (this.$rootContainer.scrollRect != null) {
                return child.x + child.width >= 0 && child.x <= this.width
                    && child.y + child.height >= 0 && child.y <= this.height;
            }
            else if (this.$scrollPane != null) {
                return this.$scrollPane.isChildInView(child);
            }
            else
                return true;
        }

        public getFirstChildInView(): number {
            let cnt: number = this.$children.length;
            for (let i: number = 0; i < cnt; ++i) {
                let child: GObject = this.$children[i];
                if (this.isChildInView(child))
                    return i;
            }
            return -1;
        }

        public get scrollPane(): ScrollPane {
            return this.$scrollPane;
        }

        public get opaque(): boolean {
            return this.$opaque;
        }

        public set opaque(value: boolean) {
            if (this.$opaque != value) {
                this.$opaque = value;
                if (this.$opaque)
                    this.updateOpaque();
                else {
                    if (this.$rootContainer.hitArea && this.$rootContainer.hitArea instanceof PIXI.Rectangle)
                        this.$rootContainer.hitArea.width = this.$rootContainer.hitArea.height = 0;
                }
            }
        }

        public get margin(): utils.Margin {
            return this.$margin;
        }

        public set margin(value: utils.Margin) {
            this.$margin.copy(value);
            if (this.$rootContainer.scrollRect != null) {
                this.$container.x = this.$margin.left + this.$alignOffset.x;
                this.$container.y = this.$margin.top + this.$alignOffset.y;
            }
            this.handleSizeChanged();
        }

        public get mask(): PIXI.Graphics | PIXI.Sprite {
            return this.$rootContainer.mask;
        }

        public set mask(value: PIXI.Graphics | PIXI.Sprite) {
            if (value instanceof PIXI.Graphics)
                (value as PIXI.Graphics).isMask = true;
            this.$rootContainer.mask = value;
        }

        protected updateOpaque() {
            if (!this.$rootContainer.hitArea)
                this.$rootContainer.hitArea = new PIXI.Rectangle();
            let h: PIXI.Rectangle = this.$rootContainer.hitArea as PIXI.Rectangle;
            h.x = h.y = 0;
            h.width = this.width;
            h.height = this.height;
        }

        protected updateScrollRect() {
            let rect: PIXI.Rectangle = this.$rootContainer.scrollRect;
            if (rect == null)
                rect = new PIXI.Rectangle();
            let w: number = this.width - this.$margin.right;
            let h: number = this.height - this.$margin.bottom;
            rect.x = rect.y = 0;
            rect.width = w;
            rect.height = h;
            this.$rootContainer.scrollRect = rect;
        }

        protected setupScroll(scrollBarMargin: utils.Margin,
            scroll: ScrollType,
            scrollBarDisplay: ScrollBarDisplayType,
            flags: number,
            vtScrollBarRes: string,
            hzScrollBarRes: string): void {
            if (this.$rootContainer == this.$container) {
                this.$container = new PIXI.Container();
                this.$rootContainer.addChild(this.$container);
            }
            this.$scrollPane = new ScrollPane(this, scroll, scrollBarMargin, scrollBarDisplay, flags, vtScrollBarRes, hzScrollBarRes);
            this.setBoundsChangedFlag();
        }

        protected setupOverflow(overflow: OverflowType): void {
            if (overflow == OverflowType.Hidden) {
                if (this.$rootContainer == this.$container) {
                    this.$container = new PIXI.Container();
                    this.$rootContainer.addChild(this.$container);
                }
                this.updateScrollRect();
                this.$container.x = this.$margin.left;
                this.$container.y = this.$margin.top;
            }
            else if (this.$margin.left != 0 || this.$margin.top != 0) {
                if (this.$rootContainer == this.$container) {
                    this.$container = new PIXI.Container();
                    this.$rootContainer.addChild(this.$container);
                }
                this.$container.x = this.$margin.left;
                this.$container.y = this.$margin.top;
            }
            this.setBoundsChangedFlag();
        }
        
        protected handleSizeChanged(): void {
            if (this.$scrollPane)
                this.$scrollPane.onOwnerSizeChanged();
            else if (this.$rootContainer.scrollRect != null)
                this.updateScrollRect();

            if (this.$opaque)
                this.updateOpaque();
        }

        protected handleGrayedChanged(): void {
            let c: Controller = this.getController("grayed");
            if (c != null) {
                c.selectedIndex = this.grayed ? 1 : 0;
                return;
            }
            let v: boolean = this.grayed;
            this.$children.forEach(child => {
                child.grayed = v;
            });
        }

        public setBoundsChangedFlag(): void {
            if (!this.$scrollPane && !this.$trackBounds)
                return;
            if (!this.$boundsChanged) {
                this.$boundsChanged = true;
                GTimer.inst.callLater(this.$reRenderLater, this);
            }
        }

        private $reRenderLater(dt: number): void {
            if (this.$boundsChanged)
                this.updateBounds();
        }

        public ensureBoundsCorrect(): void {
            if (this.$boundsChanged)
                this.updateBounds();
        }

        protected updateBounds(): void {
            let ax: number = 0, ay: number = 0, aw: number = 0, ah: number = 0;
            let len: number = this.$children.length;
            if (len > 0) {
                ax = Number.POSITIVE_INFINITY, ay = Number.POSITIVE_INFINITY;
                let ar: number = Number.NEGATIVE_INFINITY, ab: number = Number.NEGATIVE_INFINITY;
                let tmp: number = 0;

                this.$children.forEach(child => {
                    child.ensureSizeCorrect();

                    tmp = child.x;
                    if (tmp < ax)
                        ax = tmp;
                    tmp = child.y;
                    if (tmp < ay)
                        ay = tmp;
                    tmp = child.x + child.actualWidth;
                    if (tmp > ar)
                        ar = tmp;
                    tmp = child.y + child.actualHeight;
                    if (tmp > ab)
                        ab = tmp;
                });
                aw = ar - ax;
                ah = ab - ay;
            }

            this.setBounds(ax, ay, aw, ah);
        }

        public setBounds(ax: number, ay: number, aw: number, ah: number = 0): void {
            this.$boundsChanged = false;

            if (this.$scrollPane)
                this.$scrollPane.setContentSize(Math.round(ax + aw), Math.round(ay + ah));
        }

        public get viewWidth(): number {
            if (this.$scrollPane != null)
                return this.$scrollPane.viewWidth;
            else
                return this.width - this.$margin.left - this.$margin.right;
        }

        public set viewWidth(value: number) {
            if (this.$scrollPane != null)
                this.$scrollPane.viewWidth = value;
            else
                this.width = value + this.$margin.left + this.$margin.right;
        }

        public get viewHeight(): number {
            if (this.$scrollPane != null)
                return this.$scrollPane.viewHeight;
            else
                return this.height - this.$margin.top - this.$margin.bottom;
        }

        public set viewHeight(value: number) {
            if (this.$scrollPane != null)
                this.$scrollPane.viewHeight = value;
            else
                this.height = value + this.$margin.top + this.$margin.bottom;
        }

        public getSnappingPosition(xValue: number, yValue: number, resultPoint?: PIXI.Point): PIXI.Point {
            if (!resultPoint)
                resultPoint = new PIXI.Point();

            let cnt: number = this.$children.length;
            if (cnt <= 0) {
                resultPoint.x = 0;
                resultPoint.y = 0;
                return resultPoint;
            }

            this.ensureBoundsCorrect();

            let obj: GObject = null;
            let prev: GObject = null;
            let i: number = 0;
            if (yValue != 0) {
                for (; i < cnt; i++) {
                    obj = this.$children[i];
                    if (yValue < obj.y) {
                        if (i == 0) {
                            yValue = 0;
                            break;
                        }
                        else {
                            prev = this.$children[i - 1];
                            if (yValue < prev.y + prev.actualHeight / 2) //top half part
                                yValue = prev.y;
                            else //bottom half part
                                yValue = obj.y;
                            break;
                        }
                    }
                }

                if (i == cnt)
                    yValue = obj.y;
            }

            if (xValue != 0) {
                if (i > 0)
                    i--;
                for (; i < cnt; i++) {
                    obj = this.$children[i];
                    if (xValue < obj.x) {
                        if (i == 0) {
                            xValue = 0;
                            break;
                        }
                        else {
                            prev = this.$children[i - 1];
                            if (xValue < prev.x + prev.actualWidth / 2) //top half part
                                xValue = prev.x;
                            else //bottom half part
                                xValue = obj.x;
                            break;
                        }
                    }
                }

                if (i == cnt)
                    xValue = obj.x;
            }

            resultPoint.x = xValue;
            resultPoint.y = yValue;
            return resultPoint;
        }

        public childSortingOrderChanged(child: GObject, oldValue: number, newValue: number = 0): void {
            if (newValue == 0) {
                this.$sortingChildCount--;
                this.setChildIndex(child, this.$children.length);
            }
            else {
                if (oldValue == 0)
                    this.$sortingChildCount++;

                let oldIndex: number = this.$children.indexOf(child);
                let index: number = this.getInsertPosForSortingChild(child);
                if (oldIndex < index)
                    this.$setChildIndex(child, oldIndex, index - 1);
                else
                    this.$setChildIndex(child, oldIndex, index);
            }
        }

        /**@internal */
        constructFromResource(): void {
            this.constructInternal(null, 0);
        }

        private constructInternal(objectPool: GObject[], poolIndex: number): void {
            let xml: utils.XmlNode = this.packageItem.owner.getItemAsset(this.packageItem) as utils.XmlNode;

            this.$inProgressBuilding = true;

            let str: string;
            let arr: string[];

            str = xml.attributes.size;
            arr = str.split(",");
            this.$sourceWidth = parseInt(arr[0]);
            this.$sourceHeight = parseInt(arr[1]);
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;

            this.setSize(this.$sourceWidth, this.$sourceHeight);

            str = xml.attributes.pivot;
            if (str) {
                arr = str.split(",");
                str = xml.attributes.anchor;
                this.internalSetPivot(parseFloat(arr[0]), parseFloat(arr[1]), str == "true");
            }

            str = xml.attributes.opaque;
            this.opaque = str != "false";

            let overflow: OverflowType;
            str = xml.attributes.overflow;
            if (str)
                overflow = ParseOverflowType(str);
            else
                overflow = OverflowType.Visible;

            str = xml.attributes.margin;
            if (str)
                this.$margin.parse(str);

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

            this.$buildingDisplayList = true;

            let col: utils.XmlNode[] = xml.children;
            col.forEach(cxml => {
                if (cxml.nodeName == "controller") {
                    let controller = new Controller();
                    this.$controllers.push(controller);
                    controller.$parent = this;
                    controller.setup(cxml);
                }
            });

            let displayList = this.packageItem.displayList;
            displayList.forEach((di, i) => {

                let child: GObject;
                if (objectPool != null)
                    child = objectPool[poolIndex + i];
                else if (di.packageItem) {
                    child = UIObjectFactory.newObject(di.packageItem);
                    child.packageItem = di.packageItem;
                    child.constructFromResource();
                }
                else
                    child = UIObjectFactory.newObjectDirectly(di.type);

                child.$inProgressBuilding = true;
                child.setupBeforeAdd(di.desc);
                child.parent = this;
                this.$children.push(child);

            }, this);

            this.relations.setup(xml);

            this.$children.forEach((child, i) => child.relations.setup(displayList[i].desc));
            this.$children.forEach((child, i) => {
                child.setupAfterAdd(displayList[i].desc);
                child.$inProgressBuilding = false;
            });

            str = xml.attributes.mask;
            if (str) {
                let maskObj: PIXI.DisplayObject = this.getChildById(str).displayObject;
                if (maskObj instanceof PIXI.Graphics || maskObj instanceof PIXI.Sprite) {
                    if (maskObj instanceof PIXI.Graphics)
                        (maskObj as PIXI.Graphics).isMask = true;
                    this.mask = maskObj;
                }
                else
                    throw new Error("only PIXI.Sprite or PIXI.Graphics can be applied as mask object");
            }

            col.forEach(cxml => {
                if (cxml.nodeName == "transition") {
                    let trans = new Transition(this);
                    this.$transitions.push(trans);
                    trans.setup(cxml);
                }
            }, this);

            if (this.$transitions.length > 0) {
                this.on("added", this.$added, this);
                this.on("removed", this.$removed, this);
            }

            this.applyAllControllers();

            this.$buildingDisplayList = false;
            this.$inProgressBuilding = false;

            this.$children.forEach(child => {
                if (child.displayObject != null && child.finalVisible)
                    this.$container.addChild(child.displayObject);
            }, this);

            this.setBoundsChangedFlag();
            this.constructFromXML(xml);
        }

        protected constructFromXML(xml: utils.XmlNode): void {
        }

        private $added(d: PIXI.DisplayObject): void {
            this.$transitions.forEach(trans => {
                if (trans.autoPlay)
                    trans.play({ times:trans.autoPlayRepeat, delay:trans.autoPlayDelay });
            });
        }

        private $removed(d: PIXI.DisplayObject): void {
            this.$transitions.forEach(trans => {
                trans.stop(false, false);
            });
        }
    }
}