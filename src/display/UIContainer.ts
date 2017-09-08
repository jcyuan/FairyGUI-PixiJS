namespace fgui {

    export class UIContainer extends PIXI.Container implements IUIObject {

        protected $scrollRect: PIXI.Rectangle;
        protected $rectMask: PIXI.Graphics;

        public UIOwner:GObject;

        public constructor(owner?:GObject) {
            super();
            this.UIOwner = owner;
            this.interactive = true;
            this.interactiveChildren = true;
        }

        public get scrollRect(): PIXI.Rectangle {
            return this.$scrollRect;
        }

        public set scrollRect(rect: PIXI.Rectangle) {
            this.$scrollRect = rect;
            if (rect != null) {
                if (!this.$rectMask) {
                    this.$rectMask = new PIXI.Graphics();
                    this.$rectMask.isMask = true;
                    this.addChild(this.$rectMask);
                    this.mask = this.$rectMask;
                }
                this.$rectMask.clear();
                if(rect.width > 0 && rect.height > 0) {
                    this.$rectMask.beginFill(0x0, 1);
                    this.$rectMask.drawRect(this.$scrollRect.x, this.$scrollRect.y, this.$scrollRect.width, this.$scrollRect.height);
                    this.$rectMask.endFill();
                }
            }
            else
                this.mask = null;
        }
    }
}