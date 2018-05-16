namespace fgui {

    export class GTimer {
        private $items: TimerItem[];
        private $itemPool: TimerItem[];

        private $enumIdx: number = 0;
        private $enumCount: number = 0;

        private $ticker:PIXI.ticker.Ticker;

        public static inst: GTimer = new GTimer();

        public constructor() {
            this.$items = [];
            this.$itemPool = [];
        }

        private getItem(): TimerItem {
            if (this.$itemPool.length)
                return this.$itemPool.pop();
            else
                return new TimerItem();
        }

        private findItem(callback: (...args:any[]) => void, thisObj: any): TimerItem {
            let len: number = this.$items.length;
            for (let i: number = 0; i < len; i++) {
                let item: TimerItem = this.$items[i];
                if (item.callback == callback && item.thisObj == thisObj)
                    return item;
            }
            return null;
        }

        public add(delayInMs: number, repeat: number, callback: (...args:any[]) => void, thisObj: any, callbackParam?: any): void {
            let item: TimerItem = this.findItem(callback, thisObj);
            if (!item) {
                item = this.getItem();
                item.callback = callback;
                item.thisObj = thisObj;
                this.$items.push(item);
            }
            item.delay = delayInMs;
            item.counter = 0;
            item.repeat = repeat;
            item.param = callbackParam;
            item.end = false;
        }

        public callLater(callback: (...args:any[]) => void, thisObj: any, callbackParam?: any): void {
            this.add(1, 1, callback, thisObj, callbackParam);
        }

        public callDelay(delayInMs: number, callback: (...args:any[]) => void, thisObj: any, callbackParam?: any): void {
            this.add(delayInMs, 1, callback, thisObj, callbackParam);
        }

        public exists(callback: (...args:any[]) => void, thisObj: any): boolean {
            let item: TimerItem = this.findItem(callback, thisObj);
            return item != null;
        }

        public remove(callback: (...args:any[]) => void, thisObj: any): void {
            let item: TimerItem = this.findItem(callback, thisObj);
            if (item) {
                let i: number = this.$items.indexOf(item);
                this.$items.splice(i, 1);
                if (i < this.$enumIdx)
                    this.$enumIdx--;
                this.$enumCount--;

                item.callback = null;
                item.param = null;
                this.$itemPool.push(item);
            }
        }

        public advance(): void {
            this.$enumIdx = 0;
            this.$enumCount = this.$items.length;

            while (this.$enumIdx < this.$enumCount) {
                let item: TimerItem = this.$items[this.$enumIdx];
                this.$enumIdx++;

                let ms = this.$ticker.elapsedMS;
                if (item.advance(ms)) {
                    if (item.end) {
                        this.$enumIdx--;
                        this.$enumCount--;
                        this.$items.splice(this.$enumIdx, 1);
                        this.$itemPool.push(item);
                    }
                    
                    if(item.callback) {
                        let args = [ms];
                        if(item.param && item.param instanceof Array)
                            args = item.param.concat(args);
                        else if(item.param !== void 0)
                            args.unshift(item.param);
                        item.callback.apply(item.thisObj, args);
                    }

                    if(item.end)
                        item.callback = item.thisObj = item.param = null;
                }
            }
        }

        public tickTween():void {
            createjs.Tween.tick(this.$ticker.elapsedMS, !this.$ticker.started);
        }

        public setTicker(ticker:PIXI.ticker.Ticker):void {
            if(this.$ticker) {
                this.$ticker.remove(this.advance, this, PIXI.UPDATE_PRIORITY.NORMAL);
                this.$ticker.remove(this.tickTween, this, PIXI.UPDATE_PRIORITY.HIGH);
            }
            this.$ticker = ticker;
            this.$ticker.add(this.advance, this, PIXI.UPDATE_PRIORITY.NORMAL);
            this.$ticker.add(this.tickTween, this, PIXI.UPDATE_PRIORITY.HIGH);

            if(!this.$ticker.started)
                this.$ticker.start();
        }
    }
    
    class TimerItem {
        public delay: number = 0;
        public counter: number = 0;
        public repeat: number = 0;
        public callback: (...args:any[]) => void;
        public thisObj: any;
        public param: any;
        public end: boolean;

        public advance(elapsed: number = 0): boolean {
            this.counter += elapsed;
            if (this.counter >= this.delay) {
                this.counter -= this.delay;
                if (this.counter > this.delay)
                    this.counter = this.delay;

                if (this.repeat > 0) {
                    this.repeat--;
                    if (this.repeat == 0)
                        this.end = true;
                }

                return true;
            }
            else
                return false;
        }
    }
}