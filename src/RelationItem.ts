namespace fgui {

    export class RelationItem {
        protected $owner: GObject;
        protected $target: GObject;
        protected $targetX: number;
        protected $targetY: number;
        protected $targetWidth: number;
        protected $targetHeight: number;

        protected $defs: RelationDef[];

        public constructor(owner: GObject) {
            this.$owner = owner;
            this.$defs = [];
        }

        public get owner(): GObject {
            return this.$owner;
        }

        public set target(value: GObject) {
            if (this.$target != value) {
                if (this.$target)
                    this.releaseRefTarget(this.$target);
                this.$target = value;
                if (this.$target)
                    this.addRefTarget(this.$target);
            }
        }

        public get target(): GObject {
            return this.$target;
        }

        public add(relationType: number, usePercent: boolean): void {
            if (relationType == RelationType.Size) {
                this.add(RelationType.Width, usePercent);
                this.add(RelationType.Height, usePercent);
                return;
            }

            let length: number = this.$defs.length;
            for (let i: number = 0; i < length; i++) {
                let def: RelationDef = this.$defs[i];
                if (def.type == relationType)
                    return;
            }

            this.internalAdd(relationType, usePercent);
        }

        private internalAdd(relationType: number, usePercent: boolean): void {
            if (relationType == RelationType.Size) {
                this.internalAdd(RelationType.Width, usePercent);
                this.internalAdd(RelationType.Height, usePercent);
                return;
            }

            let info: RelationDef = new RelationDef();
            info.percent = usePercent;
            info.type = relationType;
            this.$defs.push(info);

            //CENTER relation will cause float pixel, so enable the auto-pixel-snapping here
            if (usePercent || relationType == RelationType.Left_Center || relationType == RelationType.Center_Center || relationType == RelationType.Right_Center
                || relationType == RelationType.Top_Middle || relationType == RelationType.Middle_Middle || relationType == RelationType.Bottom_Middle)
                this.$owner.pixelSnapping = true;
        }

        public remove(relationType: number = 0): void {
            if (relationType == RelationType.Size) {
                this.remove(RelationType.Width);
                this.remove(RelationType.Height);
                return;
            }

            let dc: number = this.$defs.length;
            for (let k: number = dc - 1; k >= 0; k--) {
                if (this.$defs[k].type == relationType) {
                    this.$defs.splice(k, 1);
                    break;
                }
            }
        }

        public copyFrom(source: RelationItem): void {
            this.target = source.target;
            this.$defs.length = 0;
            source.$defs.forEach(info => {
                let info2: RelationDef = new RelationDef();
                info2.copyFrom(info);
                this.$defs.push(info2);
            }, this);
        }

        public dispose(): void {
            if (this.$target != null) {
                this.releaseRefTarget(this.$target);
                this.$target = null;
            }
        }

        public get isEmpty(): boolean {
            return this.$defs.length == 0;
        }

        public applyOnSelfResized(dWidth: number, dHeight: number): void {
            let ox: number = this.$owner.x;
            let oy: number = this.$owner.y;

            this.$defs.forEach(info => {
                switch (info.type) {
                    case RelationType.Center_Center:
                    case RelationType.Right_Center:
                        this.$owner.x -= dWidth / 2;
                        break;
                    case RelationType.Right_Left:
                    case RelationType.Right_Right:
                        this.$owner.x -= dWidth;
                        break;
                    case RelationType.Middle_Middle:
                    case RelationType.Bottom_Middle:
                        this.$owner.y -= dHeight / 2;
                        break;
                    case RelationType.Bottom_Top:
                    case RelationType.Bottom_Bottom:
                        this.$owner.y -= dHeight;
                        break;
                }
            }, this);

            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;

                this.$owner.updateGearFromRelations(GearType.XY, ox, oy);

                if (this.$owner.parent != null && this.$owner.parent.$transitions.length > 0) {
                    this.$owner.parent.$transitions.forEach(t => {
                        t.updateFromRelations(this.$owner.id, ox, oy);
                    }, this);
                }
            }
        }

        private applyOnXYChanged(info: RelationDef, dx: number, dy: number): void {
            let tmp: number;
            switch (info.type) {
                case RelationType.Left_Left:
                case RelationType.Left_Center:
                case RelationType.Left_Right:
                case RelationType.Center_Center:
                case RelationType.Right_Left:
                case RelationType.Right_Center:
                case RelationType.Right_Right:
                    this.$owner.x += dx;
                    break;
                case RelationType.Top_Top:
                case RelationType.Top_Middle:
                case RelationType.Top_Bottom:
                case RelationType.Middle_Middle:
                case RelationType.Bottom_Top:
                case RelationType.Bottom_Middle:
                case RelationType.Bottom_Bottom:
                    this.$owner.y += dy;
                    break;
                case RelationType.Width:
                case RelationType.Height:
                    break;
                case RelationType.LeftExt_Left:
                case RelationType.LeftExt_Right:
                    tmp = this.$owner.x;
                    this.$owner.x += dx;
                    this.$owner.width = this.$owner.$rawWidth - (this.$owner.x - tmp);
                    break;
                case RelationType.RightExt_Left:
                case RelationType.RightExt_Right:
                    this.$owner.width = this.$owner.$rawWidth + dx;
                    break;
                case RelationType.TopExt_Top:
                case RelationType.TopExt_Bottom:
                    tmp = this.$owner.y;
                    this.$owner.y += dy;
                    this.$owner.height = this.$owner.$rawHeight - (this.$owner.y - tmp);
                    break;
                case RelationType.BottomExt_Top:
                case RelationType.BottomExt_Bottom:
                    this.$owner.height = this.$owner.$rawHeight + dy;
                    break;
            }
        }

        private applyOnSizeChanged(info: RelationDef): void {
            let targetX: number, targetY: number;
            if (this.$target != this.$owner.parent) {
                targetX = this.$target.x;
                targetY = this.$target.y;
            }
            else {
                targetX = 0;
                targetY = 0;
            }
            let v: number, tmp: number;

            switch (info.type) {
                case RelationType.Left_Left:
                    break;
                case RelationType.Left_Center:
                    v = this.$owner.x - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v;
                    break;
                case RelationType.Left_Right:
                    v = this.$owner.x - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth + v;
                    break;
                case RelationType.Center_Center:
                    v = this.$owner.x + this.$owner.$rawWidth / 2 - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v - this.$owner.$rawWidth / 2;
                    break;
                case RelationType.Right_Left:
                    v = this.$owner.x + this.$owner.$rawWidth - targetX;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + v - this.$owner.$rawWidth;
                    break;
                case RelationType.Right_Center:
                    v = this.$owner.x + this.$owner.$rawWidth - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v - this.$owner.$rawWidth;
                    break;
                case RelationType.Right_Right:
                    v = this.$owner.x + this.$owner.$rawWidth - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth + v - this.$owner.$rawWidth;
                    break;

                case RelationType.Top_Top:
                    break;
                case RelationType.Top_Middle:
                    v = this.$owner.y - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v;
                    break;
                case RelationType.Top_Bottom:
                    v = this.$owner.y - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight + v;
                    break;
                case RelationType.Middle_Middle:
                    v = this.$owner.y + this.$owner.$rawHeight / 2 - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v - this.$owner.$rawHeight / 2;
                    break;
                case RelationType.Bottom_Top:
                    v = this.$owner.y + this.$owner.$rawHeight - targetY;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + v - this.$owner.$rawHeight;
                    break;
                case RelationType.Bottom_Middle:
                    v = this.$owner.y + this.$owner.$rawHeight - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v - this.$owner.$rawHeight;
                    break;
                case RelationType.Bottom_Bottom:
                    v = this.$owner.y + this.$owner.$rawHeight - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight + v - this.$owner.$rawHeight;
                    break;

                case RelationType.Width:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceWidth - this.$target.$initWidth;
                    else
                        v = this.$owner.$rawWidth - this.$targetWidth;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    if (this.$target == this.$owner.parent)
                        this.$owner.setSize(this.$target.$rawWidth + v, this.$owner.$rawHeight, true);
                    else
                        this.$owner.width = this.$target.$rawWidth + v;
                    break;
                case RelationType.Height:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceHeight - this.$target.$initHeight;
                    else
                        v = this.$owner.$rawHeight - this.$targetHeight;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    if (this.$target == this.$owner.parent)
                        this.$owner.setSize(this.$owner.$rawWidth, this.$target.$rawHeight + v, true);
                    else
                        this.$owner.height = this.$target.$rawHeight + v;
                    break;

                case RelationType.LeftExt_Left:
                    break;
                case RelationType.LeftExt_Right:
                    v = this.$owner.x - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    tmp = this.$owner.x;
                    this.$owner.x = targetX + this.$target.$rawWidth + v;
                    this.$owner.width = this.$owner.$rawWidth - (this.$owner.x - tmp);
                    break;
                case RelationType.RightExt_Left:
                    break;
                case RelationType.RightExt_Right:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceWidth - (targetX + this.$target.$initWidth);
                    else
                        v = this.$owner.width - (targetX + this.$targetWidth);
                    if (this.$owner != this.$target.parent)
                        v += this.$owner.x;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    if (this.$owner != this.$target.parent)
                        this.$owner.width = targetX + this.$target.$rawWidth + v - this.$owner.x;
                    else
                        this.$owner.width = targetX + this.$target.$rawWidth + v;
                    break;
                case RelationType.TopExt_Top:
                    break;
                case RelationType.TopExt_Bottom:
                    v = this.$owner.y - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    tmp = this.$owner.y;
                    this.$owner.y = targetY + this.$target.$rawHeight + v;
                    this.$owner.height = this.$owner.$rawHeight - (this.$owner.y - tmp);
                    break;
                case RelationType.BottomExt_Top:
                    break;
                case RelationType.BottomExt_Bottom:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceHeight - (targetY + this.$target.$initHeight);
                    else
                        v = this.$owner.$rawHeight - (targetY + this.$targetHeight);
                    if (this.$owner != this.$target.parent)
                        v += this.$owner.y;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    if (this.$owner != this.$target.parent)
                        this.$owner.height = targetY + this.$target.$rawHeight + v - this.$owner.y;
                    else
                        this.$owner.height = targetY + this.$target.$rawHeight + v;
                    break;
            }
        }

        private addRefTarget(target: GObject): void {
            if (target != this.$owner.parent)
                target.on(DisplayObjectEvent.XY_CHANGED, this.$targetXYChanged, this);
            target.on(DisplayObjectEvent.SIZE_CHANGED, this.$targetSizeChanged, this);
            target.on(DisplayObjectEvent.SIZE_DELAY_CHANGE, this.$targetSizeWillChange, this);

            this.$targetX = this.$target.x;
            this.$targetY = this.$target.y;
            this.$targetWidth = this.$target.$rawWidth;
            this.$targetHeight = this.$target.$rawHeight;
        }

        private releaseRefTarget(target: GObject): void {
            target.off(DisplayObjectEvent.XY_CHANGED, this.$targetXYChanged, this);
            target.off(DisplayObjectEvent.SIZE_CHANGED, this.$targetSizeChanged, this);
            target.off(DisplayObjectEvent.SIZE_DELAY_CHANGE, this.$targetSizeWillChange, this);
        }

        private $targetXYChanged(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$owner.relations.$dealing != null || this.$owner.group != null && this.$owner.group.$updating) {
                this.$targetX = this.$target.x;
                this.$targetY = this.$target.y;
                return;
            }

            this.$owner.relations.$dealing = this.$target;

            let ox: number = this.$owner.x;
            let oy: number = this.$owner.y;
            let dx: number = this.$target.x - this.$targetX;
            let dy: number = this.$target.y - this.$targetY;
            this.$defs.forEach(info => {
                this.applyOnXYChanged(info, dx, dy);
            }, this);
            
            this.$targetX = this.$target.x;
            this.$targetY = this.$target.y;

            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;

                this.$owner.updateGearFromRelations(GearType.XY, ox, oy);

                if (this.$owner.parent != null && this.$owner.parent.$transitions.length > 0) {
                    this.$owner.parent.$transitions.forEach(t => {
                        t.updateFromRelations(this.$owner.id, ox, oy);
                    }, this);
                }
            }
            this.$owner.relations.$dealing = null;
        }

        private $targetSizeChanged(evt: PIXI.interaction.InteractionEvent): void {
            if (this.$owner.relations.$dealing != null)
                return;

            this.$owner.relations.$dealing = this.$target;

            let ox: number = this.$owner.x;
            let oy: number = this.$owner.y;
            let ow: number = this.$owner.$rawWidth;
            let oh: number = this.$owner.$rawHeight;
            this.$defs.forEach(info => {
                this.applyOnSizeChanged(info);
            }, this);

            this.$targetWidth = this.$target.$rawWidth;
            this.$targetHeight = this.$target.$rawHeight;

            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;

                this.$owner.updateGearFromRelations(GearType.XY, ox, oy);

                if (this.$owner.parent != null && this.$owner.parent.$transitions.length > 0) {
                    this.$owner.parent.$transitions.forEach(t => {
                        t.updateFromRelations(this.$owner.id, ox, oy);
                    }, this);
                }
            }

            if (ow != this.$owner.$rawWidth || oh != this.$owner.$rawHeight) {
                ow = this.$owner.$rawWidth - ow;
                oh = this.$owner.$rawHeight - oh;

                this.$owner.updateGearFromRelations(GearType.Size, ow, oh);
            }

            this.$owner.relations.$dealing = null;
        }

        private $targetSizeWillChange(evt: Event): void {
            this.$owner.relations.sizeDirty = true;
        }
    }

    export class RelationDef {
        public percent: boolean;
        public type: number;

        public copyFrom(source: RelationDef): void {
            this.percent = source.percent;
            this.type = source.type;
        }
    }
}