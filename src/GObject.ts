/// <reference path="../typings/pixi.js.d.ts" />

namespace fgui {

    export class GObject {

        public data: any;

        protected $x: number = 0;
        protected $y: number = 0;
        protected $width: number = 0;
        protected $height: number = 0;
        protected $alpha: number = 1;
        protected $rotation: number = 0;
        protected $visible: boolean = true;
        protected $touchable: boolean = true;
        protected $grayed: boolean = false;
        protected $draggable: boolean = false;
        protected $scaleX: number = 1;
        protected $scaleY: number = 1;
        protected $skewX: number = 0;
        protected $skewY: number = 0;
        protected $pivot: PIXI.Point = new PIXI.Point();
        protected $pivotAsAnchor: boolean = false;
        protected $pivotOffset: PIXI.Point = new PIXI.Point();
        protected $sortingOrder: number = 0;
        protected $internalVisible: number = 1;
        protected $focusable: boolean = false;
        protected $tooltips: string;
        protected $pixelSnapping: boolean = false;

        protected $relations: Relations;
        protected $group: GGroup;
        protected $gears: GearBase<GObject>[];
        protected $displayObject: PIXI.DisplayObject;
        protected $dragBounds: PIXI.Rectangle;

        private static $colorHelper: utils.ColorMatrix;
        protected $colorFilter: PIXI.filters.ColorMatrixFilter;
        protected $lastColorComponents: number[] = null;

        protected $parent: GComponent;

        /**@internal */
        $inProgressBuilding: boolean;   //parsing xml & building
        /**@internal */
        $rawWidth: number = 0;
        /**@internal */
        $rawHeight: number = 0;
        /**@internal */
        $gearLocked: boolean;
        /**@internal */
        $initWidth: number = 0;
        /**@internal */
        $initHeight: number = 0;

        protected $sourceWidth: number = 0;
        protected $sourceHeight: number = 0;

        protected $id: string;
        protected $name: string;

        public packageItem: PackageItem;  //construction data

        private static gInstanceCounter: number = 0;

        public constructor() {
            this.$id = `${GObject.gInstanceCounter++}`;
            this.$name = "";

            this.createDisplayObject();

            this.$relations = new Relations(this);
            this.$gears = [];
        }

        public get id(): string {
            return this.$id;
        }

        public get name(): string {
            return this.$name;
        }

        public set name(value: string) {
            this.$name = value;
        }

        public get x(): number {
            return this.$x;
        }

        public set x(value: number) {
            this.setXY(value, this.$y);
        }

        public get y(): number {
            return this.$y;
        }

        public set y(value: number) {
            this.setXY(this.$x, value);
        }

        public setXY(xv: number, yv: number): void {
            if (this.$x != xv || this.$y != yv) {

                this.$x = xv;
                this.$y = yv;

                this.handleXYChanged();
                this.updateGear(GearType.XY);

                if (this.$parent) {
                    this.$parent.setBoundsChangedFlag();
                    this.$displayObject.emit(DisplayObjectEvent.XY_CHANGED, this);
                }

                if (GObject.draggingObject == this && !GObject.sUpdatingWhileDragging)
                    this.localToGlobalRect(0, 0, this.width, this.height, GObject.sGlobalRect);
            }
        }

        public get pixelSnapping(): boolean {
            return this.$pixelSnapping;
        }

        public set pixelSnapping(value: boolean) {
            if (this.$pixelSnapping != value) {
                this.$pixelSnapping = value;
                this.handleXYChanged();
            }
        }

        public center(restraint: boolean = false): void {
            let r: GComponent;
            if (this.$parent != null)
                r = this.parent;
            else
                r = this.root;

            this.setXY((r.width - this.width) / 2, (r.height - this.height) / 2);
            if (restraint) {
                this.addRelation(r, RelationType.Center_Center);
                this.addRelation(r, RelationType.Middle_Middle);
            }
        }

        public get width(): number {
            this.ensureSizeCorrect();
            if (this.$relations.sizeDirty)
                this.$relations.ensureRelationsSizeCorrect();
            return this.$width;
        }

        public set width(value: number) {
            this.setSize(value, this.$rawHeight);
        }

        public get height(): number {
            this.ensureSizeCorrect();
            if (this.$relations.sizeDirty)
                this.$relations.ensureRelationsSizeCorrect();
            return this.$height;
        }

        public set height(value: number) {
            this.setSize(this.$rawWidth, value);
        }

        public setSize(wv: number, hv: number, ignorePivot: boolean = false): void {
            if (this.$rawWidth != wv || this.$rawHeight != hv) {
                this.$rawWidth = wv;
                this.$rawHeight = hv;
                wv = Math.max(0, wv);
                hv = Math.max(0, hv);
                let diffw: number = wv - this.mapPivotWidth(1);
                let diffh: number = hv - this.mapPivotHeight(1);
                this.$width = wv;
                this.$height = hv;

                this.handleSizeChanged();
                if (this.$pivot.x != 0 || this.$pivot.y != 0) {
                    if (!this.$pivotAsAnchor) {
                        if (!ignorePivot)
                            this.setXY(this.x - this.$pivot.x * diffw, this.y - this.$pivot.y * diffh);
                        this.updatePivotOffset();
                    }
                    else
                        this.applyPivot();
                }

                this.updateGear(GearType.Size);

                if (this.$parent) {
                    this.$relations.onOwnerSizeChanged(diffw, diffh);
                    this.$parent.setBoundsChangedFlag();
                }

                this.$displayObject.emit(DisplayObjectEvent.SIZE_CHANGED, this);
            }
        }

        public ensureSizeCorrect(): void {
        }

        public get sourceHeight(): number {
            return this.$sourceHeight;
        }

        public get sourceWidth(): number {
            return this.$sourceWidth;
        }

        public get initHeight(): number {
            return this.$initHeight;
        }

        public get initWidth(): number {
            return this.$initWidth;
        }

        public get actualWidth(): number {
            return this.width * Math.abs(this.$scaleX);
        }

        public get actualHeight(): number {
            return this.height * Math.abs(this.$scaleY);
        }

        public get scaleX(): number {
            return this.$scaleX;
        }

        public set scaleX(value: number) {
            this.setScale(value, this.$scaleY);
        }

        public get scaleY(): number {
            return this.$scaleY;
        }

        public set scaleY(value: number) {
            this.setScale(this.$scaleX, value);
        }

        public setScale(sx: number, sy: number) {
            if (this.$scaleX != sx || this.$scaleY != sy) {
                this.$scaleX = sx;
                this.$scaleY = sy;
                this.handleScaleChanged();
                this.applyPivot();
                this.updateGear(GearType.Size);
            }
        }

        public get skewX(): number {
            return this.$skewX;
        }

        public set skewX(value: number) {
            this.setSkew(value, this.$skewY);
        }

        public get skewY(): number {
            return this.$skewY;
        }

        public set skewY(value: number) {
            this.setSkew(this.$skewX, value);
        }

        public setSkew(xv: number, yv: number) {
            if (this.$skewX != xv || this.$skewY != yv) {
                this.$skewX = xv;
                this.$skewY = yv;
                this.$displayObject.skew.set(xv * -utils.NumberUtil.RADIAN, yv * utils.NumberUtil.RADIAN);
                this.applyPivot();
            }
        }

        protected mapPivotWidth(scale: number): number {
            return scale * this.$width;
        }

        protected mapPivotHeight(scale: number): number {
            return scale * this.$height;
        }

        public get pivotX(): number {
            return this.$pivot.x;
        }

        public get pivotY(): number {
            return this.$pivot.y;
        }

        public set pivotX(value: number) {
            this.setPivot(value, this.pivotY);
        }

        public set pivotY(value: number) {
            this.setPivot(this.pivotX, value);
        }

        public setPivot(xv: number, yv: number, asAnchor: boolean = false): void {
            if (this.$pivot.x != xv || this.$pivot.y != yv || this.$pivotAsAnchor != asAnchor) {
                this.$pivot.set(xv, yv);
                this.$pivotAsAnchor = asAnchor;
                this.updatePivotOffset();
                this.handleXYChanged();
            }
        }

        protected internalSetPivot(xv: number, yv: number, asAnchor: boolean): void {
            this.$pivot.set(xv, yv);
            this.$pivotAsAnchor = asAnchor;
            if (asAnchor)
                this.handleXYChanged();
        }

        private updatePivotOffset(): void {
            if (this.$pivot.x != 0 || this.$pivot.y != 0 && this.$displayObject.transform) {
                let vx: number = this.mapPivotWidth(this.$pivot.x), vy: number = this.mapPivotHeight(this.$pivot.y);
                GObject.sHelperPoint.set(vx, vy);
                this.$displayObject.transform.updateLocalTransform();     //TODO: sync with PIXI instead of update actively
                let trans = this.$displayObject.localTransform;
                let p = trans.apply(GObject.sHelperPoint, GObject.sHelperPoint);
                p.x -= trans.tx, p.y -= trans.ty;
                this.$pivotOffset.set(
                    this.$pivot.x * this.$width - p.x,
                    this.$pivot.y * this.$height - p.y
                );
            }
            else
                this.$pivotOffset.set(0, 0);
        }

        private applyPivot(): void {
            if (this.$pivot.x != 0 || this.$pivot.y != 0) {
                this.updatePivotOffset();
                this.handleXYChanged();
            }
        }

        public get touchable(): boolean {
            return this.$touchable;
        }

        public set touchable(value: boolean) {
            this.$touchable = value;
            this.$displayObject.interactive = this.$touchable;
        }

        public get grayed(): boolean {
            return this.$grayed;
        }

        public set grayed(value: boolean) {
            if (this.$grayed != value) {
                this.$grayed = value;
                this.handleGrayedChanged();
                this.updateGear(GearType.Look);
            }
        }

        public get enabled(): boolean {
            return !this.$grayed && this.$touchable;
        }

        public set enabled(value: boolean) {
            this.grayed = !value;
            this.touchable = value;
        }

        public get rotation(): number {
            return this.$rotation;
        }

        public set rotation(value: number) {
            if (this.$rotation != value) {
                this.$rotation = value;
                if (this.$displayObject)
                    this.$displayObject.rotation = utils.NumberUtil.angleToRadian(this.normalizeRotation);
                this.applyPivot();
                this.updateGear(GearType.Look);
            }
        }

        public get normalizeRotation(): number {
            let rot: number = this.$rotation % 360;
            if (rot > 180) rot -= 360;
            else if (rot < -180) rot += 360;
            return rot;
        }

        public get alpha(): number {
            return this.$alpha;
        }

        public set alpha(value: number) {
            if (this.$alpha != value) {
                this.$alpha = value;
                this.updateAlpha();
            }
        }

        protected updateAlpha(): void {
            if (this.$displayObject)
                this.$displayObject.alpha = this.$alpha;

            this.updateGear(GearType.Look);
        }

        public get visible(): boolean {
            return this.$visible;
        }

        public set visible(value: boolean) {
            if (this.$visible != value) {
                this.$visible = value;
                if (this.$displayObject)
                    this.$displayObject.visible = this.$visible;
                if (this.$parent) {
                    this.$parent.childStateChanged(this);
                    this.$parent.setBoundsChangedFlag();
                }
            }
        }

        /**@internal */
        set internalVisible(value: number) {
            if (value < 0)
                value = 0;
            let oldValue: boolean = this.$internalVisible > 0;
            let newValue: boolean = value > 0;
            this.$internalVisible = value;
            if (oldValue != newValue) {
                if (this.$parent)
                    this.$parent.childStateChanged(this);
            }
        }

        /**@internal */
        get internalVisible(): number {
            return this.$internalVisible;
        }

        public get finalVisible(): boolean {
            return this.$visible && this.$internalVisible > 0 && (!this.$group || this.$group.finalVisible);
        }

        public get sortingOrder(): number {
            return this.$sortingOrder;
        }

        public set sortingOrder(value: number) {
            if (value < 0)
                value = 0;
            if (this.$sortingOrder != value) {
                let old: number = this.$sortingOrder;
                this.$sortingOrder = value;
                if (this.$parent != null)
                    this.$parent.childSortingOrderChanged(this, old, this.$sortingOrder);
            }
        }

        public get focusable(): boolean {
            return this.$focusable;
        }

        public set focusable(value: boolean) {
            this.$focusable = value;
        }

        public get focused(): boolean {
            return this.root.focus == this;
        }

        public requestFocus(): void {
            let p: GObject = this;
            while (p && !p.$focusable)
                p = p.parent;
            if (p != null)
                this.root.focus = p;
        }

        public get tooltips(): string {
            return this.$tooltips;
        }

        public set tooltips(value: string) {
            this.$tooltips = value;
        }

        public get blendMode(): string {
            if (this.$displayObject && this.$displayObject instanceof PIXI.Sprite)
                return BlendModeMap[this.$displayObject.blendMode] || "None";
            return BlendModeMap[0];  //Normal
        }

        public set blendMode(value: string) {
            if (!value || !value.length || !this.$displayObject || !(this.$displayObject instanceof PIXI.Sprite))
                return;
            for (let i: number = 0; i < BlendModeMap.length; i++) {
                if (BlendModeMap[i].toLowerCase() === value.toLowerCase()) {
                    this.$displayObject.blendMode = i;
                    return;
                }
            }
        }

        public get filters(): PIXI.Filter<{}>[] {
            return this.$displayObject.filters;
        }

        public set filters(value: PIXI.Filter<{}>[]) {
            this.$displayObject.filters = value;
        }

        public get inContainer(): boolean {
            return this.$displayObject.parent != null;
        }

        public static isDisplayObjectOnStage(display: PIXI.DisplayObject): boolean {
            if (!display || !display.parent) return false;
            let p: PIXI.DisplayObject = display;
            while (p != null) {
                if (p == GRoot.inst.nativeStage)
                    return true;
                p = p.parent;
            }
            return false;
        }

        public get onStage(): boolean {
            return GObject.isDisplayObjectOnStage(this.$displayObject);
        }

        public get resourceURL(): string {
            if (this.packageItem != null)
                return `{ui://${this.packageItem.owner.id}${this.packageItem.id}`;
            else
                return null;
        }

        public set group(value: GGroup) {
            this.$group = value;
        }

        public get group(): GGroup {
            return this.$group;
        }

        public getGear(index: number | GearType): GearBase<GObject> {
            let gear: GearBase<GObject> = this.$gears[index];
            if (gear == null) {
                switch (index) {
                    case GearType.Display:
                        gear = new GearDisplay(this);
                        break;
                    case GearType.XY:
                        gear = new GearXY(this);
                        break;
                    case GearType.Size:
                        gear = new GearSize(this);
                        break;
                    case GearType.Look:
                        gear = new GearLook(this);
                        break;
                    case GearType.Color:
                        if (fgui.isColorGear(this))
                            gear = new GearColor(this);
                        break;
                    case GearType.Animation:
                        if (fgui.isAnimationGear(this))
                            gear = new GearAnimation(this);
                        break;
                    case GearType.Text:
                        gear = new GearText(this);
                        break;
                    case GearType.Icon:
                        gear = new GearIcon(this);
                        break;
                    default:
                        throw "FGUI: invalid gear index!";
                }
                this.$gears[index] = gear;
            }
            return gear;
        }

        protected updateGear(index: GearType): void {
            if (this.$gears[index] != null)
                this.$gears[index].updateState();
        }

        public updateGearFromRelations(index: GearType, dx: number, dy: number): void {
            if (this.$gears[index] != null)
                this.$gears[index].updateFromRelations(dx, dy);
        }

        public get gearXY(): GearXY {
            return this.getGear(GearType.XY) as GearXY;
        }

        public get gearSize(): GearSize {
            return this.getGear(GearType.Size) as GearSize;
        }

        public get gearLook(): GearLook {
            return this.getGear(GearType.Look) as GearLook;
        }

        public get relations(): Relations {
            return this.$relations;
        }

        public addRelation(target: GObject, relationType: number, usePercent: boolean = false): void {
            this.$relations.add(target, relationType, usePercent);
        }

        public removeRelation(target: GObject, relationType: number = 0): void {
            this.$relations.remove(target, relationType);
        }

        public get displayObject(): PIXI.DisplayObject {
            return this.$displayObject;
        }
        
        protected createDisplayObject(): void {
        }

        protected setDisplayObject(value: PIXI.DisplayObject): void {
            this.$displayObject = value;
        }

        public get parent(): GComponent {
            return this.$parent;
        }

        public set parent(val: GComponent) {
            this.$parent = val;
        }

        public removeFromParent(): void {
            if (this.$parent)
                this.$parent.removeChild(this);
        }

        public get root(): GRoot {
            if (this instanceof GRoot)
                return this as GRoot;

            let p: GObject = this.$parent;
            while (p) {
                if (p instanceof GRoot)
                    return p as GRoot;
                p = p.parent;
            }
            return GRoot.inst;
        }

        /** @virtual */
        public get text(): string {
            return null;
        }

        /** @virtual */
        public set text(value: string) {
        }

        /** @virtual */
        public get icon(): string {
            return null;
        }

        /** @virtual */
        public set icon(value: string) {
        }

        public dispose(): void {
            this.removeFromParent();
            this.$relations.dispose();
            this.removeAllListeners();
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$moving, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$end, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$moving2, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$end2, this);
            this.$displayObject.destroy();
        }

        public click(listener: Function, thisObj?: any): this {
            return this.on(InteractiveEvents.Click, listener, thisObj);
        }

        public removeClick(listener: Function, thisObj?: any): this {
            return this.off(InteractiveEvents.Click, listener, thisObj);
        }

        public hasClick(fn?:Function): boolean {
            return this.hasListener(InteractiveEvents.Click, fn);
        }

        public on(type: string, listener: Function, thisObject?: any): this {
            if (type == null) return this;
            (this.$displayObject as PIXI.utils.EventEmitter).on(type, listener, thisObject);
            return this;
        }

        public off(type: string, listener: Function, thisObject?: any): this {
            if (type == null) return this;
            if (this.$displayObject.listeners(type, true))
                (this.$displayObject as PIXI.utils.EventEmitter).off(type, listener, thisObject);
            return this;
        }

        public once(type: string, listener: Function, thisObject?: any): this {
            if (type == null) return this;
            (this.$displayObject as PIXI.utils.EventEmitter).once(type, listener, thisObject);
            return this;
        }

        public hasListener(event: string, handler?:Function): boolean {   //do we need to also check the context?
            if(!handler)
                return this.$displayObject.listeners(event, true);
            else
                return this.$displayObject.listeners(event).indexOf(handler) >= 0;
        }

        public emit(event: string, ...args: any[]): boolean {
            if (!args || args.length <= 0) args = [event];
            else args.unshift(event);
            return this.$displayObject.emit.apply(this.$displayObject, args);
        }

        public removeAllListeners(type?:string):void {
            (this.$displayObject as PIXI.utils.EventEmitter).removeAllListeners(type);
        }

        public get draggable(): boolean {
            return this.$draggable;
        }

        public set draggable(value: boolean) {
            if (this.$draggable != value) {
                this.$draggable = value;
                this.initDrag();
            }
        }

        public get dragBounds(): PIXI.Rectangle {
            return this.$dragBounds;
        }

        public set dragBounds(value: PIXI.Rectangle) {
            this.$dragBounds = value;
        }

        public startDrag(touchPointID: number = -1): void {
            if (!this.onStage)
                return;
            this.dragBegin();
        }

        public stopDrag(): void {
            this.dragEnd();
        }

        public get dragging(): boolean {
            return GObject.draggingObject == this;
        }

        public localToGlobal(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            if (this.$pivotAsAnchor) {
                ax += this.$pivot.x * this.$width;
                ay += this.$pivot.y * this.$height;
            }
            if (!resultPoint) resultPoint = GObject.sHelperPoint;
            resultPoint.x = ax;
            resultPoint.y = ay;
            return this.$displayObject.toGlobal(resultPoint, resultPoint);
        }

        public globalToLocal(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            if (!resultPoint) resultPoint = GObject.sHelperPoint;
            resultPoint.set(ax, ay);
            resultPoint = this.$displayObject.toLocal(resultPoint, GRoot.inst.nativeStage);
            if (this.$pivotAsAnchor) {
                resultPoint.x -= this.$pivot.x * this.$width;
                resultPoint.y -= this.$pivot.y * this.$height;
            }
            return resultPoint;
        }

        public localToRoot(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            let pt: PIXI.Point = this.localToGlobal(ax, ay, resultPoint);
            pt.x /= GRoot.inst.contentScaleFactor;
            pt.y /= GRoot.inst.contentScaleFactor;
            return pt;
        }

        public rootToLocal(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            ax *= GRoot.inst.contentScaleFactor;
            ay *= GRoot.inst.contentScaleFactor;
            return this.globalToLocal(ax, ay, resultPoint);
        }

        public localToGlobalRect(ax: number = 0, ay: number = 0, aWidth: number = 0, aHeight: number = 0, resultRect?: PIXI.Rectangle): PIXI.Rectangle {
            if (resultRect == null) resultRect = GObject.sDragHelperRect;
            let pt: PIXI.Point = this.localToGlobal(ax, ay);
            resultRect.x = pt.x;
            resultRect.y = pt.y;
            resultRect.width = aWidth;
            resultRect.height = aHeight;
            return resultRect;
        }

        public globalToLocalRect(ax: number = 0, ay: number = 0, aWidth: number = 0, aHeight: number = 0, resultRect?: PIXI.Rectangle): PIXI.Rectangle {
            if (resultRect == null) resultRect = GObject.sDragHelperRect;
            let pt: PIXI.Point = this.globalToLocal(ax, ay);
            resultRect.x = pt.x;
            resultRect.y = pt.y;
            resultRect.width = aWidth;
            resultRect.height = aHeight;
            return resultRect;
        }

        public handleControllerChanged(c: Controller): void {
            for (let i: number = 0; i < GearType.Count; i++) {
                let gear: GearBase<GObject> = this.$gears[i];
                if (gear != null && gear.controller == c)
                    gear.apply();
            }
        }

        protected switchDisplayObject(newObj: PIXI.DisplayObject): void {
            if (newObj == this.$displayObject)
                return;

            let old: PIXI.DisplayObject = this.$displayObject;
            if (this.inContainer) {
                let i: number = this.$displayObject.parent.getChildIndex(this.$displayObject);
                this.$displayObject.parent.addChildAt(newObj, i);
                this.$displayObject.parent.removeChild(this.$displayObject);
            }
            this.$displayObject = newObj;
            this.$displayObject.x = old.x;
            this.$displayObject.y = old.y;
            this.$displayObject.rotation = old.rotation;
            this.$displayObject.alpha = old.alpha;
            this.$displayObject.visible = old.visible;
            this.$displayObject.scale.x = old.scale.x;
            this.$displayObject.scale.y = old.scale.y;
            this.$displayObject.interactive = old.interactive;
            this.$displayObject.interactiveChildren = old.interactiveChildren;
        }

        protected handleXYChanged(): void {
            if (this.$displayObject) {
                let xv: number = this.$x;
                let yv: number = this.$y;
                if (this.$pivotAsAnchor) {
                    xv -= this.$pivot.x * this.$width;
                    yv -= this.$pivot.y * this.$height;
                }
                if (this.$pixelSnapping) {
                    xv = Math.round(xv);
                    yv = Math.round(yv);
                }
                this.$displayObject.position.set(xv + this.$pivotOffset.x, yv + this.$pivotOffset.y);
            }
        }

        protected handleSizeChanged(): void {
        }

        protected handleScaleChanged(): void {
            if (this.$displayObject)
                this.$displayObject.scale.set(this.$scaleX, this.$scaleY);
        }

        protected get colorFilter(): PIXI.filters.ColorMatrixFilter {
            if (this.$colorFilter)
                return this.$colorFilter;
            this.$colorFilter = new PIXI.filters.ColorMatrixFilter();
            if (this.$displayObject) {
                let a = this.$displayObject.filters || [];
                a.push(this.$colorFilter);
                this.$displayObject.filters = a;
            }
            return this.$colorFilter;
        }

        /**
         * update color appearance
         * @param brightness value of the brigthness (-1 - 1, where -1 is black)
         * @param contrast value of the contrast (-1 - 1)
         * @param saturate The saturation amount (-1 - 1)
         * @param hue The hue property of the color in degress (-1 - 1, where 1 is 360deg)
         */
        public updateColorComponents(brightness: number, contrast: number, saturate: number, hue: number): void {
            if (!GObject.$colorHelper) GObject.$colorHelper = new utils.ColorMatrix();
            let helper = GObject.$colorHelper;
            helper.setColor(brightness, contrast * 100, saturate * 100, hue * 180);
            let f = this.colorFilter;
            f.enabled = true;
            f.reset();
            f.matrix = helper.toArray();
            if (!this.$lastColorComponents) this.$lastColorComponents = [];
            this.$lastColorComponents.length = 0;
            this.$lastColorComponents.push(helper.brightness, helper.contrast, helper.saturation, helper.hue);
        }

        protected handleGrayedChanged(): void {
            if (this.$displayObject) {
                let c: PIXI.filters.ColorMatrixFilter = this.colorFilter;
                c.enabled = true;
                if (this.$grayed)
                    c.blackAndWhite(true);
                else {
                    if (this.$lastColorComponents && this.$lastColorComponents.length >= 4)
                        this.updateColorComponents(this.$lastColorComponents[0], this.$lastColorComponents[1], this.$lastColorComponents[2], this.$lastColorComponents[3]);
                    else
                        c.enabled = false;
                }
            }
        }

        /**@internal */
        constructFromResource(): void {
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            let str: string;
            let arr: string[];

            this.$id = xml.attributes.id;
            this.$name = xml.attributes.name;

            str = xml.attributes.xy;
            arr = str.split(",");
            this.setXY(parseInt(arr[0]), parseInt(arr[1]));

            str = xml.attributes.size;
            if (str) {
                arr = str.split(",");
                this.$initWidth = parseInt(arr[0]);
                this.$initHeight = parseInt(arr[1]);
                this.setSize(this.$initWidth, this.$initHeight, true);
            }

            str = xml.attributes.scale;
            if (str) {
                arr = str.split(",");
                this.setScale(parseFloat(arr[0]), parseFloat(arr[1]));
            }

            str = xml.attributes.rotation;
            if (str)
                this.rotation = parseInt(str);

            str = xml.attributes.skew;
            if (str) {
                arr = str.split(",");
                this.setSkew(parseFloat(arr[0]), parseFloat(arr[1]));
            }

            str = xml.attributes.pivot;
            if (str) {
                arr = str.split(",");
                let n1: number = parseFloat(arr[0]), n2: number = parseFloat(arr[1]);
                str = xml.attributes.anchor;
                this.setPivot(n1, n2, str == "true");
            }

            str = xml.attributes.alpha;
            if (str)
                this.alpha = parseFloat(str);

            if (xml.attributes.touchable == "false")
                this.touchable = false;
            if (xml.attributes.visible == "false")
                this.visible = false;
            if (xml.attributes.grayed == "true")
                this.grayed = true;
            this.tooltips = xml.attributes.tooltips;

            str = xml.attributes.blend;
            if (str)
                this.blendMode = str;

            str = xml.attributes.filter;
            if (str) {
                switch (str) {
                    case "color":
                        str = xml.attributes.filterData;
                        arr = str.split(",");
                        this.updateColorComponents(
                            parseFloat(arr[0]),
                            parseFloat(arr[1]),
                            parseFloat(arr[2]),
                            parseFloat(arr[3])
                        );
                        break;
                }
            }
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            let str: string = xml.attributes.group;
            if (str)
                this.$group = this.$parent.getChildById(str) as GGroup;

            let col: utils.XmlNode[] = xml.children;
            col.forEach(cxml => {
                let index: number = GearXMLNodeNameMap[cxml.nodeName];
                if (index != void 0)
                    this.getGear(index).setup(cxml);
            }, this);
        }

        public static castFromNativeObject(disp: PIXI.DisplayObject): GObject {
            if (fgui.isUIObject(disp))
                return disp.UIOwner;
            return null;
        }

        //dragging
        //-------------------------------------------------------------------
        protected static sGlobalDragStart: PIXI.Point = new PIXI.Point();
        protected static sGlobalRect: PIXI.Rectangle = new PIXI.Rectangle();
        protected static sHelperPoint: PIXI.Point = new PIXI.Point();
        protected static sDragHelperRect: PIXI.Rectangle = new PIXI.Rectangle();
        protected static sUpdatingWhileDragging: boolean;
        private static $dragBeginCancelled: boolean;

        protected $touchDownPoint: PIXI.Point;

        public static draggingObject: GObject;

        private initDrag(): void {
            if (this.$draggable)
                this.on(InteractiveEvents.Down, this.$touchBegin, this);
            else
                this.off(InteractiveEvents.Down, this.$touchBegin, this);
        }

        private dragBegin(): void {
            if (GObject.draggingObject != null)
                GObject.draggingObject.stopDrag();

            GObject.sGlobalDragStart.x = GRoot.statusData.mouseX;
            GObject.sGlobalDragStart.y = GRoot.statusData.mouseY;

            this.localToGlobalRect(0, 0, this.width, this.height, GObject.sGlobalRect);
            GObject.draggingObject = this;

            GRoot.inst.nativeStage.on(InteractiveEvents.Move, this.$moving2, this);
            GRoot.inst.nativeStage.on(InteractiveEvents.Up, this.$end2, this);
        }

        private dragEnd(): void {
            if (GObject.draggingObject == this) {
                GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$moving2, this);
                GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$end2, this);
                GObject.draggingObject = null;
            }
            GObject.$dragBeginCancelled = true;
        }

        private reset(): void {
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$moving, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$end, this);
        }

        private $touchBegin(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$touchDownPoint == null)
                this.$touchDownPoint = new PIXI.Point();
            this.$touchDownPoint.x = evt.data.global.x;
            this.$touchDownPoint.y = evt.data.global.y;
            GRoot.inst.nativeStage.on(InteractiveEvents.Move, this.$moving, this);
            GRoot.inst.nativeStage.on(InteractiveEvents.Up, this.$end, this);
        }

        private $end(evt: PIXI.interaction.InteractionEvent): void {
            this.reset();
        }

        private $moving(evt: PIXI.interaction.InteractionEvent): void {
            let sensitivity: number = UIConfig.touchDragSensitivity;
            if (this.$touchDownPoint != null
                && Math.abs(this.$touchDownPoint.x - evt.data.global.x) < sensitivity
                && Math.abs(this.$touchDownPoint.y - evt.data.global.y) < sensitivity)
                return;

            this.reset();

            GObject.$dragBeginCancelled = false;

            evt.currentTarget = this.$displayObject;
            this.$displayObject.emit(DragEvent.START, evt, this);

            if (!GObject.$dragBeginCancelled)  //user may call obj.stopDrag in the DragStart event handler
                this.dragBegin();
        }

        private $moving2(evt: PIXI.interaction.InteractionEvent): void {
            let xx: number = evt.data.global.x - GObject.sGlobalDragStart.x + GObject.sGlobalRect.x;
            let yy: number = evt.data.global.y - GObject.sGlobalDragStart.y + GObject.sGlobalRect.y;

            if (this.$dragBounds != null) {
                let rect: PIXI.Rectangle = GRoot.inst.localToGlobalRect(this.$dragBounds.x, this.$dragBounds.y,
                    this.$dragBounds.width, this.$dragBounds.height, GObject.sDragHelperRect);
                if (xx < rect.x)
                    xx = rect.x;
                else if (xx + GObject.sGlobalRect.width > rect.right) {
                    xx = rect.right - GObject.sGlobalRect.width;
                    if (xx < rect.x)
                        xx = rect.x;
                }

                if (yy < rect.y)
                    yy = rect.y;
                else if (yy + GObject.sGlobalRect.height > rect.bottom) {
                    yy = rect.bottom - GObject.sGlobalRect.height;
                    if (yy < rect.y)
                        yy = rect.y;
                }
            }

            GObject.sUpdatingWhileDragging = true;
            GObject.sHelperPoint.x = xx;
            GObject.sHelperPoint.y = yy;
            let pt: PIXI.Point = this.parent.globalToLocal(xx, yy, GObject.sHelperPoint);
            this.setXY(Math.round(pt.x), Math.round(pt.y));
            GObject.sUpdatingWhileDragging = false;

            evt.currentTarget = this.$displayObject;
            this.$displayObject.emit(DragEvent.MOVING, evt, this);
        }

        private $end2(evt: PIXI.interaction.InteractionEvent): void {
            if (GObject.draggingObject == this) {
                this.stopDrag();
                evt.currentTarget = this.$displayObject;
                this.$displayObject.emit(DragEvent.END, evt, this);
            }
        }
    }
}