///<reference path="../PIXI/extras/Text.ts" />

namespace fgui {

    export class UITextField extends PIXI.extras.Text implements IUIObject {

        public UIOwner:GObject;

        protected $minHeight:number;
        protected $minHeightID:number = -1;
        
        public constructor(owner?:GObject) {
            super();
            this.UIOwner = owner;
            this.interactive = this.interactiveChildren = false;
            this._texture.noFrame = false;
            this._width = this._texture.frame.width;
            this._height = this._texture.frame.height;
            this.$minHeight = -1;
            this._texture.on("update", this.updateFrame, this);
        }

        public get minHeight():number {
            return this.$minHeight;
        }

        /**@internal */
        $updateMinHeight():void {
            if(this.style.styleID != this.$minHeightID || this.$minHeight <= 0) {
                let wordWrap = this.style.wordWrap;
                this.style.wordWrap = false;        //TextMetrics.measureText bug line22990: wordWrap = wordWrap || style.wordWrap;
                this.$minHeight = PIXI.TextMetrics.measureText("", this.style, false).lineHeight;  //no way to get the cached auto-lineheight (when style.lineHeight=0);
                this.style.wordWrap = wordWrap;     //restore

                this.$minHeightID = this.style.styleID;
            }
        }
        
        protected updateFrame():void {
            let frm = this._texture.frame;
            this._height = Math.max(this._height, this.$minHeight);
            let w = frm.x + this._width, h = frm.y + this._height;
            if(w > this._texture.baseTexture.width)
                w = this._texture.baseTexture.width - frm.x;
            if(h > this._texture.baseTexture.height)
                h = this._texture.baseTexture.height - frm.y;

            if(w != frm.width || h != frm.height) {
                frm.width = w / this.resolution;
                frm.height = h / this.resolution;
                
                this._texture.trim.width = frm.width;
                this._texture.trim.height = frm.height;

                let padding = this._style.trim ? 0 : this._style.padding;
                this._texture.trim.x = -padding;
                this._texture.trim.y = -padding;
                
                this._texture.frame = frm; //trigger to update UVs;
            }
        }

        //cancel scaling update
        protected _onTextureUpdate():void {
            this._textureID = -1;
            this._textureTrimmedID = -1;
        }

        public get width():number {
            return this._width;
        }

        public set width(v:number) {
            this._width = v;
            this.updateFrame();
        }

        public get height():number {
            return this._height;
        }

        public set height(v:number) {
            this._height = v;
            this.updateFrame();
        }

        public get textHeight():number {
            this.updateText(true);
            return this._texture.orig.height;
        }

        public set textHeight(v:number) {
        }

        public get textWidth():number {
            this.updateText(true);
            return this._texture.orig.width;
        }

        public set textWidth(v:number) {
            if(v != this.style.wordWrapWidth)
                this.style.wordWrapWidth = v;
        }
    }
}