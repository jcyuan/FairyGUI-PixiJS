namespace fgui {

    /**for webgl only */
    export class FillSprite extends PIXI.Sprite {
        protected _fillMode:TextureFillMode;
        protected _fillBegin:TextureFillBegin;
        protected _fillDir:TextureFillDirection = TextureFillDirection.CW;   //for deg type only
        protected _fillAmount:number;   //percentage

        protected _flip:FlipType = 0;

        protected _percent:number = 0;

        public constructor(texture?:PIXI.Texture) {
            super(texture);

        }

        public get flip():FlipType {
            return this._flip;
        }

        public set flip(v:FlipType) {
            if(v != this._flip) {
                this._flip = v;
                //this.requiresUpdate = true;
            }
        }

        public get fillAmount():number {
            return typeof this._fillAmount == "number" ? this._fillAmount : 100;
        }

        public set fillAmount(n:number) {
            if(n != this._fillAmount) {
                this._fillAmount = n;
                //this.requiresUpdate = true;
            }
        }

        public get fillBegin():TextureFillBegin {
            return this._fillBegin;
        }

        public set fillBegin(n:TextureFillBegin) {
            if(n != this._fillBegin) {
                this._fillBegin = n;
                //this.requiresUpdate = true;
            }
        }

        public get fillMode():TextureFillMode {
            return this._fillMode;
        }

        public set fillMode(n:TextureFillMode) {
            if(n != this._fillMode) {
                this._fillMode = n;
                this.checkAndFixFillBegin();
                //this.requiresUpdate = true;
            }
        }

        public get fillDirection():TextureFillDirection {
            return this._fillDir;
        }

        public set fillDirection(n:TextureFillDirection) {
            if(n != this._fillDir) {
                this._fillDir = n;
                this.checkAndFixFillBegin();
                //this.requiresUpdate = true;
            }
        }

        private checkAndFixFillBegin():void {
            switch(this._fillMode) {
                case TextureFillMode.HORZ:
                    if(this._fillBegin != TextureFillBegin.L && this._fillBegin != TextureFillBegin.R)
                        this._fillBegin = TextureFillBegin.L;
                    break;
                case TextureFillMode.VERT:
                    if(this._fillBegin != TextureFillBegin.T && this._fillBegin != TextureFillBegin.B)
                        this._fillBegin = TextureFillBegin.T;
                    break;
                case TextureFillMode.DEG90:
                    if(this._fillBegin != TextureFillBegin.LT && this._fillBegin != TextureFillBegin.LB
                        && this._fillBegin != TextureFillBegin.RT && this._fillBegin != TextureFillBegin.RB
                    )
                        this._fillBegin = TextureFillBegin.LT;
                    break;
                case TextureFillMode.DEG180:
                case TextureFillMode.DEG360:
                    if(this._fillBegin != TextureFillBegin.L && this._fillBegin != TextureFillBegin.R
                        && this._fillBegin != TextureFillBegin.T && this._fillBegin != TextureFillBegin.B
                    )
                        this._fillBegin = TextureFillBegin.T;
                    break;
            }
        }

        public set amount(v:number) {
            this._percent = v;
        }

        public get amount():number {
            return this._percent;
        }
        
    }
}