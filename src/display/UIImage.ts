namespace fgui {

    export class UIImage extends PIXI.Container implements IUIObject {
        protected $disp: PIXI.extras.TilingSprite | PIXI.mesh.NineSlicePlane | PIXI.Sprite;
        public UIOwner:GObject;

        public constructor(owner?:GObject) {
            super();
            this.UIOwner = owner;
            this.interactive = this.interactiveChildren = false;
        }
        
        /**@internal */
        $initDisp(item?: PackageItem): void {
            if (this.$disp) return;

            if(item) {
                item.load();

                if (item.scaleByTile) {
                    let ts = new PIXI.extras.TilingSprite(item.texture);
                    this.$disp = ts;
                }
                else if (item.scale9Grid) {
                    this.$disp = new PIXI.extras.NineSlicePlane(
                        item.texture,
                        item.scale9Grid.left,
                        item.scale9Grid.top,
                        Math.max(0, item.texture.width - item.scale9Grid.width - item.scale9Grid.x),
                        Math.max(0, item.texture.height - item.scale9Grid.height - item.scale9Grid.y)
                    );
                    this.tiledSlices = item.tiledSlices;
                }
                else
                    this.$disp = new PIXI.Sprite(item.texture);
            }
            else
                this.$disp = new PIXI.Sprite();
            
            this.addChild(this.$disp);
        }

        public get tint():number {
            return this.$disp.tint;
        }

        public set tint(v:number) {
            this.$disp.tint = v;
        }

        public get height():number {
            return this.$disp.height;
        }

        public set height(v:number) {
            this.$disp.height = v;
        }

        public get width():number {
            return this.$disp.width;
        }

        public set width(v:number) {
            this.$disp.width = v;
        }
        
        public get texture(): PIXI.Texture {
            return this.$disp.texture;
        }

        public set texture(v: PIXI.Texture) {
            //need to reset first?
            /*if (this.$disp instanceof PIXI.extras.TilingSprite) {
                this.$disp.tileScale.set(1, 1);
                this.$disp.tilePosition.set(0, 0);
            }
            else if (this.$disp instanceof PIXI.mesh.NineSlicePlane)
                this.$disp.leftWidth = this.$disp.topHeight = this.$disp.rightWidth = this.$disp.bottomHeight = 0;
            */
            this.$disp.texture = v;
        }

        /**
         * rect = x,y,w,h = l,t,r,b
         */
        public get scale9Grid(): PIXI.Rectangle {
            if (this.$disp instanceof PIXI.mesh.NineSlicePlane) {
                return new PIXI.Rectangle(
                    this.$disp.leftWidth,
                    this.$disp.topHeight,
                    this.$disp.rightWidth,
                    this.$disp.bottomHeight
                );
            }
            return null;
        }

        /**
         * rect = x,y,w,h = l,t,r,b
         */
        public set scale9Grid(rect: PIXI.Rectangle) {
            if (this.$disp instanceof PIXI.mesh.NineSlicePlane) {
                if(rect.left != this.$disp.leftWidth)
                    this.$disp.leftWidth = rect.left;
                if(rect.top != this.$disp.topHeight)
                    this.$disp.topHeight = rect.top;
                if(rect.right != this.$disp.rightWidth)
                    this.$disp.rightWidth = rect.right;
                if(rect.bottom != this.$disp.bottomHeight)
                    this.$disp.bottomHeight = rect.bottom;
            }
        }
        
        public get tiledSlices(): number {
            return 0;
        }

        public set tiledSlices(flags: number) {
            //not support
        }

        public destroy(options?: boolean | PIXI.DestroyOptions): void {
            if(this.$disp) {
                this.$disp.destroy(options);
                this.$disp = null;
            }
            super.destroy(options);
        }
    }

}