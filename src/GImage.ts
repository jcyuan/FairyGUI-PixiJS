namespace fgui {

    export class GImage extends GObject implements IColorGear {
        
        private $content: UIImage;
        private $flip: FlipType;

        public constructor() {
            super();
        }

        public get touchable(): boolean {
            return false;
        }

        public set touchable(value: boolean) {
            this.$touchable = false;  //GImage has no interaction
        }

        public get color(): number {
            return this.$content.tint;
        }

        public set color(value: number) {
            if (this.color != value) {
                this.updateGear(GearType.Color);
                this.$content.tint = value;
            }
        }

        public get flip(): FlipType {
            return this.$flip;
        }

        public set flip(value: FlipType) {
            if (this.$flip != value) {
                this.$flip = value;
                let sx: boolean = false, sy: boolean = false;
                if (this.$flip == FlipType.Horizontal || this.$flip == FlipType.Both)
                    sx = true;
                if (this.$flip == FlipType.Vertical || this.$flip == FlipType.Both)
                    sy = true;
                this.$content.flipX = sx;
                this.$content.flipY = sy;
            }
        }

        public get texture(): PIXI.Texture {
            return this.$content.texture;
        }

        public set texture(value: PIXI.Texture) {
            if (value != null) {
                this.$sourceWidth = value.orig.width;
                this.$sourceHeight = value.orig.height;
            }
            else
                this.$sourceWidth = this.$sourceHeight = 0;
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;
            this.$content.texture = value;
        }

        protected createDisplayObject(): void {
            this.$content = new UIImage(this);
            this.setDisplayObject(this.$content);
        }

        public dispose(): void {
            this.$content.destroy();
            super.dispose();
        }

        public constructFromResource(): void {
            this.$sourceWidth = this.packageItem.width;
            this.$sourceHeight = this.packageItem.height;
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;
            this.$content.$initDisp(this.packageItem);
            this.setSize(this.$sourceWidth, this.$sourceHeight);
        }

        protected handleXYChanged(): void {
            super.handleXYChanged();
            if (this.$flip != FlipType.None) {
                if (this.$content.scale.x == -1)
                    this.$content.x += this.width;
                if (this.$content.scale.y == -1)
                    this.$content.y += this.height;
            }
        }
        
        protected handleSizeChanged(): void {
            this.$content.width = this.width;
            this.$content.height = this.height;
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let str: string;
            str = xml.attributes.color;
            if (str)
                this.color = utils.StringUtil.convertFromHtmlColor(str);

            str = xml.attributes.flip;
            if (str)
                this.flip = ParseFlipType(str);
        }
    }
}