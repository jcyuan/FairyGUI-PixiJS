/// <reference path="./GObject.ts" />
/// <reference path="./utils/GObjectRecycler.ts" />

namespace fgui {

    export class GLoader extends GObject implements IAnimationGear, IColorGear {

        protected $url: string;
        protected $align: AlignType;
        protected $verticalAlign: VertAlignType;
        protected $autoSize: boolean;
        protected $fill: LoaderFillType;
        protected $showErrorSign: boolean;
        protected $playing: boolean;
        protected $frame: number = 0;
        protected $color: number = 0;

        private $contentItem: PackageItem;
        private $contentSourceWidth: number = 0;
        private $contentSourceHeight: number = 0;
        private $contentWidth: number = 0;
        private $contentHeight: number = 0;

        protected $container: UIContainer;
        protected $content: UIImage | MovieClip;
        protected $errorSign: GObject;

        private $updatingLayout: boolean;

        private static $errorSignPool: utils.GObjectRecycler = new utils.GObjectRecycler();
        
        public constructor() {
            super();
            this.$playing = true;
            this.$url = "";
            this.$fill = LoaderFillType.None;
            this.$align = AlignType.Left;
            this.$verticalAlign = VertAlignType.Top;
            this.$showErrorSign = true;
            this.$color = 0xFFFFFF;
        }

        protected createDisplayObject(): void {
            this.$container = new UIContainer(this);
            this.$container.hitArea = new PIXI.Rectangle();
            this.setDisplayObject(this.$container);
            this.$container.interactiveChildren = false;
        }

        public dispose(): void {
            this.clearContent();
            super.dispose();
        }

        public get url(): string {
            return this.$url;
        }

        public set url(value: string) {
            if (this.$url == value)
                return;

            this.$url = value;
            this.loadContent();
            this.updateGear(GearType.Icon);
        }

        public get icon(): string {
            return this.$url;
        }

        public set icon(value: string) {
            this.url = value;
        }

        public get align(): AlignType {
            return this.$align;
        }

        public set align(value: AlignType) {
            if (this.$align != value) {
                this.$align = value;
                this.updateLayout();
            }
        }

        public get verticalAlign(): VertAlignType {
            return this.$verticalAlign;
        }

        public set verticalAlign(value: VertAlignType) {
            if (this.$verticalAlign != value) {
                this.$verticalAlign = value;
                this.updateLayout();
            }
        }

        public get fill(): LoaderFillType {
            return this.$fill;
        }

        public set fill(value: LoaderFillType) {
            if (this.$fill != value) {
                this.$fill = value;
                this.updateLayout();
            }
        }

        public get autoSize(): boolean {
            return this.$autoSize;
        }

        public set autoSize(value: boolean) {
            if (this.$autoSize != value) {
                this.$autoSize = value;
                this.updateLayout();
            }
        }

        public get playing(): boolean {
            return this.$playing;
        }

        public set playing(value: boolean) {
            if (this.$playing != value) {
                this.$playing = value;
                if (this.$content instanceof MovieClip)
                    this.$content.playing = value;
                this.updateGear(GearType.Animation);
            }
        }

        public get frame(): number {
            return this.$frame;
        }

        public set frame(value: number) {
            if (this.$frame != value) {
                this.$frame = value;
                if (this.$content instanceof MovieClip)
                    this.$content.currentFrame = value;
                this.updateGear(GearType.Animation);
            }
        }

        public get color(): number {
            return this.$color;
        }

        public set color(value: number) {
            if (this.$color != value) {
                this.$color = value;
                this.updateGear(GearType.Color);
                this.applyColor();
            }
        }

        private applyColor(): void {
            if (this.$content)
                this.$content.tint = this.$color;
        }

        public get showErrorSign(): boolean {
            return this.$showErrorSign;
        }

        public set showErrorSign(value: boolean) {
            this.$showErrorSign = value;
        }

        public get content(): UIImage | MovieClip {
            return this.$content;
        }

        public get texture(): PIXI.Texture {
            if (this.$content instanceof UIImage)
                return this.$content.texture;
            else
                return null;
        }

        public set texture(value: PIXI.Texture) {
            this.url = null;
            this.switchToMovieMode(false);

            if(this.$content instanceof UIImage)
                this.$content.texture = value;

            if (value) {
                this.$contentSourceWidth = value.orig.width;
                this.$contentSourceHeight = value.orig.height;
            }
            else
                this.$contentSourceWidth = this.$contentHeight = 0;

            this.updateLayout();
        }

        protected loadContent(): void {
            this.clearContent();

            if (!this.$url)
                return;

            if (utils.StringUtil.startsWith(this.$url, "ui://"))
                this.loadFromPackage(this.$url);
            else
                this.loadExternal();
        }
        
        protected loadFromPackage(itemURL: string): void {
            this.$contentItem = UIPackage.getItemByURL(itemURL);
            if (this.$contentItem) {
                this.$contentItem.load();

                if (this.$contentItem.type == PackageItemType.Image) {
                    if (this.$contentItem.texture == null) {
                        this.setErrorState();
                    }
                    else {
                        this.switchToMovieMode(false);
                        (this.$content as UIImage).$initDisp(this.$contentItem);
                        this.$contentSourceWidth = this.$contentItem.width;
                        this.$contentSourceHeight = this.$contentItem.height;
                        this.updateLayout();
                    }
                }
                else if (this.$contentItem.type == PackageItemType.MovieClip) {
                    this.switchToMovieMode(true);
                    this.$contentSourceWidth = this.$contentItem.width;
                    this.$contentSourceHeight = this.$contentItem.height;
                    let mc: MovieClip = this.$content as MovieClip;
                    mc.interval = this.$contentItem.interval;
                    mc.swing = this.$contentItem.swing;
                    mc.repeatDelay = this.$contentItem.repeatDelay;
                    mc.frames = this.$contentItem.frames;
                    mc.boundsRect = new PIXI.Rectangle(0, 0, this.$contentSourceWidth, this.$contentSourceHeight);
                    this.updateLayout();
                }
                else
                    this.setErrorState();
            }
            else
                this.setErrorState();
        }

        private switchToMovieMode(value: boolean): void {
            this.$container.removeChildren();
            if (value) {
                if (!(this.$content instanceof MovieClip))
                    this.$content = new MovieClip(this);
            }
            else {
                if (!(this.$content instanceof UIImage))
                    this.$content = new UIImage(null);
            }
            this.$container.addChild(this.$content);
        }

        /**overwrite this for load resources by your own way */
        protected loadExternal(): void {
            let texture = PIXI.utils.TextureCache[this.$url];
            if (!texture) {
                texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.$url));
                PIXI.Texture.addToCache(texture, this.$url);
            }
            this.$loadResCompleted(texture);
        }

        /**free the resource you loaded */
        protected freeExternal(texture: PIXI.Texture): void {
            PIXI.Texture.removeFromCache(texture);
            texture.destroy(true);
        }

        private $loadResCompleted(res: PIXI.Texture): void {
            if (res)
                this.onExternalLoadSuccess(res);
            else
                this.onExternalLoadFailed();
        }
        
        /**content loaded */
        protected onExternalLoadSuccess(texture: PIXI.Texture): void {
            this.$container.removeChildren();
            if (!this.$content || !(this.$content instanceof UIImage)) {
                this.$content = new UIImage(null);
                this.$content.$initDisp();
                this.$container.addChild(this.$content);
            }
            else
                this.$container.addChild(this.$content);
            this.$content.texture = texture;
            this.$contentSourceWidth = texture.orig.width;
            this.$contentSourceHeight = texture.orig.height;
            this.updateLayout();
        }

        protected onExternalLoadFailed(): void {
            this.setErrorState();
        }

        private setErrorState(): void {
            if (!this.$showErrorSign)
                return;

            if (this.$errorSign == null) {
                if (UIConfig.loaderErrorSign) {
                    this.$errorSign = GLoader.$errorSignPool.get(UIConfig.loaderErrorSign);
                }
            }

            if (this.$errorSign) {
                this.$errorSign.width = this.width;
                this.$errorSign.height = this.height;
                this.$container.addChild(this.$errorSign.displayObject);
            }
        }

        private clearErrorState(): void {
            if (this.$errorSign) {
                this.$container.removeChild(this.$errorSign.displayObject);
                GLoader.$errorSignPool.recycle(this.$errorSign.resourceURL, this.$errorSign);
                this.$errorSign = null;
            }
        }

        private updateLayout(): void {
            if (this.$content == null) {
                if (this.$autoSize) {
                    this.$updatingLayout = true;
                    this.setSize(50, 30);
                    this.$updatingLayout = false;
                }
                return;
            }

            this.$content.position.set(0, 0);
            this.$content.scale.set(1, 1);
            this.$contentWidth = this.$contentSourceWidth;
            this.$contentHeight = this.$contentSourceHeight;

            if (this.$autoSize) {
                this.$updatingLayout = true;
                if (this.$contentWidth == 0)
                    this.$contentWidth = 50;
                if (this.$contentHeight == 0)
                    this.$contentHeight = 30;
                this.setSize(this.$contentWidth, this.$contentHeight);
                this.$updatingLayout = false;
            }
            else {
                let sx: number = 1, sy: number = 1;
                if (this.$fill != LoaderFillType.None) {
                    sx = this.width / this.$contentSourceWidth;
                    sy = this.height / this.$contentSourceHeight;

                    if (sx != 1 || sy != 1) {
                        if (this.$fill == LoaderFillType.ScaleMatchHeight)
                            sx = sy;
                        else if (this.$fill == LoaderFillType.ScaleMatchWidth)
                            sy = sx;
                        else if (this.$fill == LoaderFillType.Scale) {
                            if (sx > sy)
                                sx = sy;
                            else
                                sy = sx;
                        }
                        this.$contentWidth = this.$contentSourceWidth * sx;
                        this.$contentHeight = this.$contentSourceHeight * sy;
                    }
                }

                if (this.$content instanceof UIImage) {
                    this.$content.width = this.$contentWidth;
                    this.$content.height = this.$contentHeight;
                }
                else
                    this.$content.scale.set(sx, sy);

                if (this.$align == AlignType.Center)
                    this.$content.x = Math.floor((this.width - this.$contentWidth) / 2);
                else if (this.$align == AlignType.Right)
                    this.$content.x = this.width - this.$contentWidth;
                if (this.$verticalAlign == VertAlignType.Middle)
                    this.$content.y = Math.floor((this.height - this.$contentHeight) / 2);
                else if (this.$verticalAlign == VertAlignType.Bottom)
                    this.$content.y = this.height - this.$contentHeight;
            }
        }

        private clearContent(): void {
            this.clearErrorState();

            if (this.$content && this.$content.parent)
                this.$container.removeChild(this.$content);

            if (this.$contentItem == null && this.$content instanceof UIImage)
                this.freeExternal(this.$content.texture);
            
            this.$content && this.$content.destroy();
            this.$content = null;
            
            this.$contentItem = null;
        }

        protected handleSizeChanged(): void {
            if (!this.$updatingLayout)
                this.updateLayout();

            let rect: PIXI.Rectangle = this.$container.hitArea as PIXI.Rectangle;  //TODO: hitArea can be Rectangle | Circle | Ellipse | Polygon | RoundedRectangle
            rect.x = rect.y = 0;
            rect.width = this.width;
            rect.height = this.height;
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let str: string;
            str = xml.attributes.url;
            if (str)
                this.$url = str;

            str = xml.attributes.align;
            if (str)
                this.$align = ParseAlignType(str);

            str = xml.attributes.vAlign;
            if (str)
                this.$verticalAlign = ParseVertAlignType(str);

            str = xml.attributes.fill;
            if (str)
                this.$fill = ParseLoaderFillType(str);

            this.$autoSize = xml.attributes.autoSize == "true";

            str = xml.attributes.errorSign;
            if (str)
                this.$showErrorSign = str == "true";

            this.$playing = xml.attributes.playing != "false";

            str = xml.attributes.color;
            if (str)
                this.color = utils.StringUtil.convertFromHtmlColor(str);

            if (this.$url)
                this.loadContent();
        }
    }
}