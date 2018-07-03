namespace fgui {

    const isEmojiChar = function(charCode:number, nextCharCode:number):number {
        const hs = charCode;
        const nextCharValid = typeof nextCharCode === 'number' && !isNaN(nextCharCode) && nextCharCode > 0;

        // surrogate pair
        if (hs >= 0xd800 && hs <= 0xdbff)
        {
            if (nextCharValid)
            {
                const uc = ((hs - 0xd800) * 0x400) + (nextCharCode - 0xdc00) + 0x10000;

                if (uc >= 0x1d000 && uc <= 0x1f77f)
                {
                    return 2;
                }
            }
        }
        // non surrogate
        else if ((hs >= 0x2100 && hs <= 0x27ff)
            || (hs >= 0x2B05 && hs <= 0x2b07)
            || (hs >= 0x2934 && hs <= 0x2935)
            || (hs >= 0x3297 && hs <= 0x3299)
            || hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
            || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
            || hs === 0x2b50 || hs === 0x231a)
        {
            return 1;
        }
        else if (nextCharValid && (nextCharCode === 0x20e3 || nextCharCode === 0xfe0f || nextCharCode === 0xd83c))
        {
            return 2;
        }

        return 0;
    }

    //override for emoji test
    PIXI.TextMetrics.canBreakChars = function(char: string, nextChar: string, token: string, index: number, breakWords?: boolean): boolean {
        if(isEmojiChar(char.charCodeAt(0), nextChar && nextChar.charCodeAt(0)) == 2)
            return false;
        return true;
    };

    PIXI.TextMetrics.isBreakingSpace = function(char?: string): boolean {
        if (typeof char !== 'string')
            return false;
        if(char === ' ') return false;  //not break by this
        return (PIXI.TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0);
    };

    export class UITextField extends PIXI.Text implements IUIObject {

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
                this.$minHeight = PIXI.TextMetrics.measureText("", this.style, false).lineHeight;  //no way to get the cached auto-lineheight (when style.lineHeight=0);
                this.$minHeightID = this.style.styleID;
            }
        }
        
        protected updateFrame():void {
            GTimer.inst.callLater(this.internalUpdateFrame, this);
        }

        private internalUpdateFrame():void {
            if(this._texture) {
                let frm = this._texture.frame;
                this._height = Math.max(this._height, this.$minHeight);
                let w = frm.x + this._width, h = frm.y + this._height;
                if(w > this._texture.baseTexture.width)
                    w = this._texture.baseTexture.width - frm.x;
                if(h > this._texture.baseTexture.height)
                    h = this._texture.baseTexture.height - frm.y;

                frm.width = w / this.resolution;
                frm.height = h / this.resolution;
                
                this._texture.trim.width = frm.width;
                this._texture.trim.height = frm.height;

                let padding = this._style.trim ? 0 : this._style.padding;
                this._texture.trim.x = -padding;
                this._texture.trim.y = -padding;

                this._texture.frame = frm;
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