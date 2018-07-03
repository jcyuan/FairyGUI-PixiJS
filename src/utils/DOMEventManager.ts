namespace fgui.utils {
    export class DOMEventManager extends PIXI.utils.EventEmitter {

        public static inst:DOMEventManager = new DOMEventManager();
        
        public constructor() {
            super();

            //resize
            window.addEventListener("resize", e => this.notifyResizeEvents(e), false);
            
            //modifer keys
            window.addEventListener('keydown', e => this.onWindowKeyDown(e), false);
            window.addEventListener('keyup', e => this.onWindowKeyUp(e), false);

            //mouse wheel
            const toBind:string[] = ('onwheel' in document || (<any>document)["documentMode"] >= 9 ) ?
                        ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
            for(let i:number = toBind.length; i; ) {
                window.addEventListener(toBind[--i], e => this.onMouseWheel(e), false);
            }
        }

        //resize
        private notifyResizeEvents(e:any):void {
            this.emit('resize');
        }
        
        private onMouseWheel(event:any):void {
            let orgEvent:any   = (event || window.event),
            delta:number      = 0,
            deltaX:number     = 0,
            deltaY:number     = 0,
            absDelta:number   = 0;

            if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
            if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
            if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
            if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

            //FF DOMMouseScroll
            if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
                deltaX = deltaY * -1;
                deltaY = 0;
            }

            delta = deltaY === 0 ? deltaX : deltaY;

            if ( 'deltaY' in orgEvent ) {
                deltaY = orgEvent.deltaY * -1;
                delta  = deltaY;
            }
            if ( 'deltaX' in orgEvent ) {
                deltaX = orgEvent.deltaX;
                if ( deltaY === 0 ) { delta  = deltaX * -1; }
            }

            if ( deltaY === 0 && deltaX === 0 ) { return; }

            // Delta modes:
            //   * deltaMode 0 is by pixels, nothing to do
            //   * deltaMode 1 is by lines
            //   * deltaMode 2 is by pages
            if ( orgEvent.deltaMode === 1 ) {
                const lineHeight = 16; //fontSize - line-height;
                delta  *= lineHeight;
                deltaY *= lineHeight;
                deltaX *= lineHeight;
            } else if ( orgEvent.deltaMode === 2 ) {
                const pageHeight = 16;  //dom.clientHeight = page-height
                delta  *= pageHeight;
                deltaY *= pageHeight;
                deltaX *= pageHeight;
            }

            absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

            if ( !this.lowestDelta || absDelta < this.lowestDelta ) {
                this.lowestDelta = absDelta;

                if(orgEvent.type === 'mousewheel' && absDelta % 120 === 0)
                    this.lowestDelta /= 40;
            }

            if(orgEvent.type === 'mousewheel' && absDelta % 120 === 0) {
                delta  /= 40;
                deltaX /= 40;
                deltaY /= 40;
            }

            delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / this.lowestDelta);
            deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / this.lowestDelta);
            deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / this.lowestDelta);

            this.retEvent.delta = delta;
            this.retEvent.deltaX = deltaX;
            this.retEvent.deltaY = deltaY;
            this.retEvent.deltaFactor = this.lowestDelta;
            this.retEvent.deltaMode = 0;

            if (this.nullLowestDeltaTimeout) { clearTimeout(this.nullLowestDeltaTimeout); }
            this.nullLowestDeltaTimeout = setTimeout(() => this.nullLowestDelta(), 200);

            this.emit(DisplayObjectEvent.MOUSE_WHEEL, this.retEvent);
        }

        private retEvent:any = {};
        private lowestDelta:number;
        private nullLowestDeltaTimeout:number = NaN;

        private nullLowestDelta():void {
            this.lowestDelta = null;
        }

        /*******************keys*******************/
        private $pressedKeys:{ [key:number] : boolean } = {};
        private $releasedKeys:{ [key:number] : boolean } = {};
        private $downKeys:number[] = [];

        public isKeyDown(key:number):boolean {
            return this.$downKeys.indexOf(key) >= 0;
        }

        public isKeyPressed(key:number):boolean {
            return !!this.$pressedKeys[key];
        }
        
        public isKeyReleased(key:number):boolean {
            return !!this.$releasedKeys[key];
        }

        private onWindowKeyDown(evt:any):void {
            let key:number = evt.which || evt.keyCode;
            
            if(!this.isKeyDown(key)){
                this.$downKeys.push(key);
                this.$pressedKeys[key] = true;

                this.emit('keyPressed', key);
            }
        }

        private onWindowKeyUp(evt:any):void {
            let key:number = evt.which || evt.keyCode;
            
            if(this.isKeyDown(key)){
                this.$pressedKeys[key] = false;
                this.$releasedKeys[key] = true;
                
                let index:number = this.$downKeys.indexOf(key);
                if(index >= 0) this.$downKeys.splice(index, 1);

                this.emit('keyReleased', key);
            }
        }
    }
}