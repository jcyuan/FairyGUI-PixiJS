namespace fgui {

    export const enum TransitionActionType {
        XY = 0,
        Size = 1,
        Scale = 2,
        Pivot = 3,
        Alpha = 4,
        Rotation = 5,
        Color = 6,
        Animation = 7,
        Visible = 8,
        Sound = 9,
        Transition = 10,
        Shake = 11,
        ColorFilter = 12,
        Skew = 13,
        Unknown = 14
    }

    export interface TransitionPlaySetting {
        onComplete?: (...args: any[]) => void,
        onCompleteObj?: any,
        onCompleteParam?: any,
        times: number,
        delay: number
    };

    export class Transition {

        public name: string;
        public autoPlayRepeat: number = 1;
        public autoPlayDelay: number = 0;

        private $owner: GComponent;
        private $ownerBaseX: number = 0;
        private $ownerBaseY: number = 0;
        private $items: TransitionItem[];
        private $totalTimes: number = 0;
        private $totalTasks: number = 0;
        private $playing: boolean = false;
        private $onComplete: (...args: any[]) => void;
        private $onCompleteObj: any;
        private $onCompleteParam: any;
        private $options: number = 0;
        private $reversed: boolean;
        private $maxTime: number = 0;
        private $autoPlay: boolean;

        public static OPTION_IGNORE_DISPLAY_CONTROLLER: number = 1;
        public static OPTION_AUTO_STOP_DISABLED:number = 1 >> 1;
        public static OPTION_AUTO_STOP_AT_END:number = 1 >> 2;
        
        private static FRAME_RATE: number = 24;

        public constructor(owner: GComponent) {
            this.$owner = owner;
            this.$items = [];
            this.$owner.on(DisplayObjectEvent.VISIBLE_CHANGED, this.$ownerVisibleChanged, this);
        }

        private $ownerVisibleChanged(vis:boolean, owner:GComponent):void
        {
            if ((this.$options & Transition.OPTION_AUTO_STOP_DISABLED) == 0 && vis === false)
                this.stop((this.$options & Transition.OPTION_AUTO_STOP_AT_END) != 0 ? true : false, false);
        }

        public get autoPlay(): boolean {
            return this.$autoPlay;
        }

        public set autoPlay(value: boolean) {
            if (this.$autoPlay != value) {
                this.$autoPlay = value;
                if (this.$autoPlay) {
                    if (this.$owner.onStage)
                        this.play({
                            times: this.autoPlayRepeat,
                            delay: this.autoPlayDelay
                        });
                }
                else {
                    if (!this.$owner.onStage)
                        this.stop(false, true);
                }
            }
        }

        public changeRepeat(value: number): void {
            this.$totalTimes = value | 0;
        }

        /**
         * Play transition by specified settings:
         * 1) pass whole parameters:
                onComplete?: (...args:any[]) => void,
                onCompleteObj?: any,
                onCompleteParam?: any,
                times: number,
                delay: number
         * 2) just pass 1 object which implements TransitionPlaySetting (recommended)
         */
        public play(...args: any[]): void {
            if (args.length && typeof (args[0]) == "object") {
                let obj = args[0] as TransitionPlaySetting;
                this.$play(obj.onComplete, obj.onCompleteObj, obj.onCompleteParam, obj.times || 1, obj.delay || 0, false);
            }
            else
                this.$play(args[0], args[1], args[2], args[3] || 1, args[4] || 0, false);
        }

        /**
         * Play transition by specified settings:
         * 1) pass whole parameters:
                onComplete?: (...args:any[]) => void,
                onCompleteObj?: any,
                onCompleteParam?: any,
                times: number,
                delay: number
         * 2) just pass 1 object which implements TransitionPlaySetting (recommended)
         */
        public playReverse(...args: any[]):void {
            if (args.length && typeof (args[0]) == "object") {
                let obj = args[0] as TransitionPlaySetting;
                this.$play(obj.onComplete, obj.onCompleteObj, obj.onCompleteParam, obj.times || 1, obj.delay || 0, true);
            }
            else
                this.$play(args[0], args[1], args[2], args[3] || 1, args[4] || 0, true);
        }

        private $play(onComplete?: (...args: any[]) => void, onCompleteObj?: any, onCompleteParam?: any, times?: number, delay?: number, reversed: boolean = false) {
            this.stop();
            if (times == 0) times = 1;
            else if (times == -1) times = Number.MAX_VALUE;
            this.$totalTimes = times;
            this.$reversed = reversed;
            this.internalPlay(delay);
            this.$playing = this.$totalTasks > 0;
            if (this.$playing) {
                this.$onComplete = onComplete;
                this.$onCompleteParam = onCompleteParam;
                this.$onCompleteObj = onCompleteObj;

                if ((this.$options & Transition.OPTION_IGNORE_DISPLAY_CONTROLLER) != 0) {
                    this.$items.forEach(item => {
                        if (item.target != null && item.target != this.$owner)
                            item.lockToken = item.target.lockGearDisplay();
                    }, this);
				}
            }
            else if (onComplete != null) {
                onCompleteParam && onCompleteParam.length ? onComplete.apply(onCompleteObj, onCompleteParam) :
                    onComplete.call(onCompleteObj, onCompleteParam);
            }
        }

        public stop(setToComplete: boolean = true, processCallback: boolean = false) {
            if (this.$playing) {
                this.$playing = false;
                this.$totalTasks = 0;
                this.$totalTimes = 0;
                let func: Function = this.$onComplete;
                let param: any = this.$onCompleteParam;
                let thisObj: any = this.$onCompleteObj;
                this.$onComplete = null;
                this.$onCompleteParam = null;
                this.$onCompleteObj = null;

                let cnt: number = this.$items.length;
                let item: TransitionItem;
                if (this.$reversed) {
                    for (let i = cnt - 1; i >= 0; i--) {
                        item = this.$items[i];
                        if (item.target == null)
                            continue;

                        this.stopItem(item, setToComplete);
                    }
                }
                else {
                    for (let i = 0; i < cnt; i++) {
                        item = this.$items[i];
                        if (item.target == null)
                            continue;

                        this.stopItem(item, setToComplete);
                    }
                }

                if (processCallback && func != null)
                    param && param.length > 0 ? func.apply(thisObj, param) : func.call(thisObj, param);
            }
        }

        private stopItem(item: TransitionItem, setToComplete: boolean): void {
            if (item.lockToken != 0) {
				item.target.releaseGearDisplay(item.lockToken);
				item.lockToken = 0;
            }
            
            if (item.type == TransitionActionType.ColorFilter && item.filterCreated)
                item.target.filters = null;

            if (item.completed)
                return;

            this.disposeTween(item);

            if (item.type == TransitionActionType.Transition) {
                let trans: Transition = (item.target as GComponent).getTransition(item.value.s);
                if (trans != null)
                    trans.stop(setToComplete, false);
            }
            else if (item.type == TransitionActionType.Shake) {
                GTimer.inst.remove(item.$shake, item);
                item.target.$gearLocked = true;
                item.target.setXY(item.target.x - item.startValue.f1, item.target.y - item.startValue.f2);
                item.target.$gearLocked = false;
            }
            else {
                if (setToComplete) {
                    if (item.tween) {
                        if (!item.yoyo || item.repeat % 2 == 0)
                            this.applyValue(item, this.$reversed ? item.startValue : item.endValue);
                        else
                            this.applyValue(item, this.$reversed ? item.endValue : item.startValue);
                    }
                    else if (item.type != TransitionActionType.Sound)
                        this.applyValue(item, item.value);
                }
            }
        }

        public dispose(): void {
            GTimer.inst.remove(this.internalPlay, this);
            this.$owner.off(DisplayObjectEvent.VISIBLE_CHANGED, this.$ownerVisibleChanged, this);
            
            this.$playing = false;
            this.$items.forEach(item => {
                if (item.target == null || item.completed)
                    return;

                this.disposeTween(item);

                if (item.type == TransitionActionType.Transition) {
                    let trans: Transition = (item.target as GComponent).getTransition(item.value.s);
                    if (trans != null)
                        trans.dispose();
                }
                else if (item.type == TransitionActionType.Shake)
                    GTimer.inst.remove(item.$shake, item);
            }, this);
        }

        public get playing(): boolean {
            return this.$playing;
        }

        public setValue(label: string, ...args: any[]) {
            this.$items.forEach(item => {
                if (item.label == null && item.label2 == null)
                    return;

                let value: TransitionValue;

                if (item.label == label) {
                    if (item.tween)
                        value = item.startValue;
                    else
                        value = item.value;
                }
                else if (item.label2 == label)
                    value = item.endValue;
                else
                    return;

                switch (item.type) {
                    case TransitionActionType.XY:
                    case TransitionActionType.Size:
                    case TransitionActionType.Pivot:
                    case TransitionActionType.Scale:
                    case TransitionActionType.Skew:
                        value.b1 = true;
                        value.b2 = true;
                        value.f1 = parseFloat(args[0]);
                        value.f2 = parseFloat(args[1]);
                        break;
                    case TransitionActionType.Alpha:
                        value.f1 = parseFloat(args[0]);
                        break;
                    case TransitionActionType.Rotation:
                        value.i = parseInt(args[0]);
                        break;
                    case TransitionActionType.Color:
                        value.c = parseFloat(args[0]);
                        break;
                    case TransitionActionType.Animation:
                        value.i = parseInt(args[0]);
                        if (args.length > 1)
                            value.b = args[1];
                        break;
                    case TransitionActionType.Visible:
                        value.b = args[0];
                        break;
                    case TransitionActionType.Sound:
                        value.s = args[0];
                        if (args.length > 1)
                            value.f1 = parseFloat(args[1]);
                        break;
                    case TransitionActionType.Transition:
                        value.s = args[0];
                        if (args.length > 1)
                            value.i = parseInt(args[1]);
                        break;
                    case TransitionActionType.Shake:
                        value.f1 = parseFloat(args[0]);
                        if (args.length > 1)
                            value.f2 = parseFloat(args[1]);
                        break;
                    case TransitionActionType.ColorFilter:
                        value.f1 = parseFloat(args[0]);
                        value.f2 = parseFloat(args[1]);
                        value.f3 = parseFloat(args[2]);
                        value.f4 = parseFloat(args[3]);
                        break;
                }
            }, this);
        }

        public setHook(label: string, callback: () => void, thisObj?: any): void {
            let cnt: number = this.$items.length;
            for (let i: number = 0; i < cnt; i++) {
                let item: TransitionItem = this.$items[i];
                if (item.label == label) {
                    item.hook = callback;
                    item.hookObj = thisObj;
                    break;
                }
                else if (item.label2 == label) {
                    item.hook2 = callback;
                    item.hook2Obj = thisObj;
                    break;
                }
            }
        }

        public clearHooks() {
            this.$items.forEach(item => {
                item.hook = null;
                item.hookObj = null;
                item.hook2 = null;
                item.hook2Obj = null;
            }, this);
        }

        public setTarget(label: string, newTarget: GObject) {
            this.$items.forEach(item => {
                if (item.label == label)
                    item.targetId = newTarget.id;
            }, this);
        }

        public setDuration(label: string, value: number) {
            this.$items.forEach(item => {
                if (item.tween && item.label == label)
                    item.duration = value;
            }, this);
        }

        public updateFromRelations(targetId: string, dx: number, dy: number) {
            this.$items.forEach(item => {
                if (item.type == TransitionActionType.XY && item.targetId == targetId) {
                    if (item.tween) {
                        item.startValue.f1 += dx;
                        item.startValue.f2 += dy;
                        item.endValue.f1 += dx;
                        item.endValue.f2 += dy;
                    }
                    else {
                        item.value.f1 += dx;
                        item.value.f2 += dy;
                    }
                }
            }, this);
        }

        private internalPlay(delay: number = 0): void {
            this.$ownerBaseX = this.$owner.x;
            this.$ownerBaseY = this.$owner.y;
            this.$totalTasks = 0;

            this.$items.forEach(item => {
                if (item.targetId)
                    item.target = this.$owner.getChildById(item.targetId);
                else
                    item.target = this.$owner;
                if (item.target == null)
                    return;

                let startTime: number;

                this.disposeTween(item);
                if (item.tween) {
                    if (this.$reversed)
                        startTime = delay + this.$maxTime - item.time - item.duration;
                    else
                        startTime = delay + item.time;
                    if (startTime > 0) {
                        this.$totalTasks++;
                        item.completed = false;
                        item.tweener = createjs.Tween.get(item.value).wait(startTime * 1000).call(this.$delayCall, [item], this);
                    }
                    else
                        this.startTween(item);
                }
                else {
                    if (this.$reversed)
                        startTime = delay + this.$maxTime - item.time;
                    else
                        startTime = delay + item.time;
                    if (startTime <= 0)
                        this.applyValue(item, item.value);
                    else {
                        this.$totalTasks++;
                        item.completed = false;
                        item.tweener = createjs.Tween.get(item.value).wait(startTime * 1000).call(this.$delayCall2, [item], this);
                    }
                }
            }, this);
        }

        private prepareValue(item: TransitionItem, toProps: TransitionValue, reversed: boolean = false): void {
            let startValue: TransitionValue;
            let endValue: TransitionValue;
            if (reversed) {
                startValue = item.endValue;
                endValue = item.startValue;
            }
            else {
                startValue = item.startValue;
                endValue = item.endValue;
            }

            switch (item.type) {
                case TransitionActionType.XY:
                case TransitionActionType.Size:
                    if (item.type == TransitionActionType.XY) {
                        if (item.target == this.$owner) {
                            if (!startValue.b1)
                                startValue.f1 = 0;
                            if (!startValue.b2)
                                startValue.f2 = 0;
                        }
                        else {
                            if (!startValue.b1)
                                startValue.f1 = item.target.x;
                            if (!startValue.b2)
                                startValue.f2 = item.target.y;
                        }
                    }
                    else {
                        if (!startValue.b1)
                            startValue.f1 = item.target.width;
                        if (!startValue.b2)
                            startValue.f2 = item.target.height;
                    }
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;

                    if (!endValue.b1)
                        endValue.f1 = item.value.f1;
                    if (!endValue.b2)
                        endValue.f2 = item.value.f2;

                    item.value.b1 = startValue.b1 || endValue.b1;
                    item.value.b2 = startValue.b2 || endValue.b2;

                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    break;

                case TransitionActionType.Scale:
                case TransitionActionType.Skew:
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;
                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    break;

                case TransitionActionType.Alpha:
                    item.value.f1 = startValue.f1;
                    toProps.f1 = endValue.f1;
                    break;

                case TransitionActionType.Rotation:
                    item.value.i = startValue.i;
                    toProps.i = endValue.i;
                    break;

                case TransitionActionType.ColorFilter:
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;
                    item.value.f3 = startValue.f3;
                    item.value.f4 = startValue.f4;
                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    toProps.f3 = endValue.f3;
                    toProps.f4 = endValue.f4;
                    break;
            }
        }

        private startTween(item: TransitionItem) {
            let toProps: TransitionValue = new TransitionValue();

            this.prepareValue(item, toProps, this.$reversed);
            this.applyValue(item, item.value);
            
            let completeHandler:(t:createjs.Tween) => any;
			if(item.repeat != 0) {
				item.tweenTimes = 0;
				completeHandler = utils.Binder.create(this.$tweenRepeatComplete, this, item);
			}
			else
				completeHandler = utils.Binder.create(this.$tweenComplete, this, item);

            this.$totalTasks++;
            item.completed = false;

            this.prepareValue(item, toProps, this.$reversed);
            
            item.tweener = createjs.Tween.get(item.value, {
                onChange: utils.Binder.create(this.$tweenUpdate, this, item)
            }).to(toProps, item.duration * 1000, item.easeType).call(completeHandler);
            
            if (item.hook != null)
                item.hook.call(item.hookObj);
        }

        private $delayCall(item: TransitionItem) {
            this.disposeTween(item);
            this.$totalTasks--;
            this.startTween(item);
        }

        private $delayCall2(item: TransitionItem) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;

            this.applyValue(item, item.value);
            if (item.hook != null)
                item.hook.call(item.hookObj);

            this.checkAllComplete();
        }

        private $tweenUpdate(event:any, item: TransitionItem): void {
            this.applyValue(item, item.value);
        }

        private $tweenComplete(event:any, item: TransitionItem) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;
            if (item.hook2 != null)
                item.hook2.call(item.hook2Obj);
            this.checkAllComplete();
        }

        private $tweenRepeatComplete(event:any, item: TransitionItem) {
            item.tweenTimes++;
            if (item.repeat == -1 || item.tweenTimes < item.repeat + 1) {
                let toProps: TransitionValue = new TransitionValue;

                let reversed: boolean;
                if (item.yoyo) {
                    if (this.$reversed)
                        reversed = item.tweenTimes % 2 == 0;
                    else
                        reversed = item.tweenTimes % 2 == 1;
                }
                else
                    reversed = this.$reversed;
                this.prepareValue(item, toProps, reversed);
                this.disposeTween(item);
                item.tweener = createjs.Tween.get(item.value, {
                    onChange: utils.Binder.create(this.$tweenUpdate, this, item)
                }).to(toProps, item.duration * 1000, item.easeType).call(this.$tweenRepeatComplete, [null, item], this);
            }
            else
                this.$tweenComplete(null, item);
        }

        private disposeTween(item:TransitionItem):void {
            if(!item) return;
            if(item.tweener) {
                item.tweener.paused = true;
                item.tweener.removeAllEventListeners();
                createjs.Tween.removeTweens(item.value);
                item.tweener = null;
            }
        }

        private $playTransComplete(item: TransitionItem) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;
            this.checkAllComplete();
        }

        private checkAllComplete() {
            if (this.$playing && this.$totalTasks == 0) {
                if (this.$totalTimes < 0) {
                    //the reason we don't call 'internalPlay' immediately here is because of the onChange handler issue, the handler's been calling all the time even the tween is in waiting/complete status.
                    GTimer.inst.callLater(this.internalPlay, this, 0);
                }
                else {
                    this.$totalTimes--;
                    if (this.$totalTimes > 0)
                        GTimer.inst.callLater(this.internalPlay, this, 0);
                    else {
                        this.$playing = false;
                        this.$items.forEach(item => {
                            if (item.target != null)
							{
								if (item.lockToken != 0)
								{
									item.target.releaseGearDisplay(item.lockToken);
									item.lockToken = 0;
								}
								
								if (item.filterCreated)
								{
									item.filterCreated = false;
									item.target.filters = null;
                                }
                                
                                this.disposeTween(item);
							}
                        });
                        
						if (this.$onComplete != null) {
                            let func: Function = this.$onComplete;
                            let param: any = this.$onCompleteParam;
                            let thisObj: any = this.$onCompleteObj;
                            this.$onComplete = null;
                            this.$onCompleteParam = null;
                            this.$onCompleteObj = null;
                            param && param.length ? func.apply(thisObj, param) : func.call(thisObj, param);
                        }
                    }
                }
            }
        }

        private applyValue(item: TransitionItem, value: TransitionValue) {
            item.target.$gearLocked = true;
            switch (item.type) {
                case TransitionActionType.XY:
                    if (item.target == this.$owner) {
                        let f1: number = 0, f2: number = 0;
                        if (!value.b1)
                            f1 = item.target.x;
                        else
                            f1 = value.f1 + this.$ownerBaseX;
                        if (!value.b2)
                            f2 = item.target.y;
                        else
                            f2 = value.f2 + this.$ownerBaseY;
                        item.target.setXY(f1, f2);
                    }
                    else {
                        if (!value.b1)
                            value.f1 = item.target.x;
                        if (!value.b2)
                            value.f2 = item.target.y;
                        item.target.setXY(value.f1, value.f2);
                    }
                    break;
                case TransitionActionType.Size:
                    if (!value.b1)
                        value.f1 = item.target.width;
                    if (!value.b2)
                        value.f2 = item.target.height;
                    item.target.setSize(value.f1, value.f2);
                    break;
                case TransitionActionType.Pivot:
                    item.target.setPivot(value.f1, value.f2);
                    break;
                case TransitionActionType.Alpha:
                    item.target.alpha = value.f1;
                    break;
                case TransitionActionType.Rotation:
                    item.target.rotation = value.i;
                    break;
                case TransitionActionType.Scale:
                    item.target.setScale(value.f1, value.f2);
                    break;
                case TransitionActionType.Skew:
                    item.target.setSkew(value.f1, value.f2);
                    break;
                case TransitionActionType.Color:
                    if (fgui.isColorGear(item.target))
                        item.target.color = value.c;
                    break;
                case TransitionActionType.Animation:
                    if (fgui.isAnimationGear(item.target)) {
                        if (!value.b1)
                            value.i = item.target.frame;
                        item.target.frame = value.i;
                        item.target.playing = value.b;
                    }
                    break;
                case TransitionActionType.Visible:
                    item.target.visible = value.b;
                    break;
                case TransitionActionType.Transition:
                    let trans: Transition = (item.target as GComponent).getTransition(value.s);
                    if (trans != null) {
                        if (value.i == 0)
                            trans.stop(false, true);
                        else if (trans.playing)
                            trans.$totalTimes = value.i == -1 ? Number.MAX_VALUE : value.i;
                        else {
                            item.completed = false;
                            this.$totalTasks++;
                            if (this.$reversed)
                                trans.playReverse(this.$playTransComplete, this, item, item.value.i);
                            else
                                trans.play(this.$playTransComplete, this, item, item.value.i);
                        }
                    }
                    break;
                case TransitionActionType.Sound:
                    //ignore
                    break;
                case TransitionActionType.Shake:
                    item.startValue.f1 = 0; //offsetX
                    item.startValue.f2 = 0; //offsetY
                    item.startValue.f3 = item.value.f2; //shakePeriod
                    GTimer.inst.add(1, 0, item.$shake, item, [this]);
                    this.$totalTasks++;
                    item.completed = false;
                    break;

                case TransitionActionType.ColorFilter:
                    item.target.updateColorComponents(value.f1, value.f2, value.f3, value.f4);
                    break;
            }
            item.target.$gearLocked = false;
        }

        /**@internal */
        $shakeItem(item: TransitionItem, elapsedMS:number) {
            let r: number = Math.ceil(item.value.f1 * item.startValue.f3 / item.value.f2);
            let rx: number = (Math.random() * 2 - 1) * r;
            let ry: number = (Math.random() * 2 - 1) * r;
            rx = rx > 0 ? Math.ceil(rx) : Math.floor(rx);
            ry = ry > 0 ? Math.ceil(ry) : Math.floor(ry);
            item.target.$gearLocked = true;
            item.target.setXY(item.target.x - item.startValue.f1 + rx, item.target.y - item.startValue.f2 + ry);
            item.target.$gearLocked = false;
            item.startValue.f1 = rx;
            item.startValue.f2 = ry;
            item.startValue.f3 -= elapsedMS / 1000;
            if (item.startValue.f3 <= 0) {
                item.target.$gearLocked = true;
                item.target.setXY(item.target.x - item.startValue.f1, item.target.y - item.startValue.f2);
                item.target.$gearLocked = false;
                item.completed = true;
                this.$totalTasks--;
                GTimer.inst.remove(item.$shake, item);
                this.checkAllComplete();
            }
        }

        public setup(xml: utils.XmlNode) {
            this.name = xml.attributes.name;
            let str: string = xml.attributes.options;
            if (str)
                this.$options = parseInt(str);
            this.$autoPlay = xml.attributes.autoPlay == "true";
            if (this.$autoPlay) {
                str = xml.attributes.autoPlayRepeat;
                if (str)
                    this.autoPlayRepeat = parseInt(str);
                str = xml.attributes.autoPlayDelay;
                if (str)
                    this.autoPlayDelay = parseFloat(str);
            }

            let col: utils.XmlNode[] = xml.children;
            col.forEach(cxml => {
                if (cxml.nodeName != "item")
                    return;
                let item: TransitionItem = new TransitionItem();
                this.$items.push(item);
                item.time = parseInt(cxml.attributes.time) / Transition.FRAME_RATE;
                item.targetId = cxml.attributes.target;
                str = cxml.attributes.type;
                switch (str) {
                    case "XY":
                        item.type = TransitionActionType.XY;
                        break;
                    case "Size":
                        item.type = TransitionActionType.Size;
                        break;
                    case "Scale":
                        item.type = TransitionActionType.Scale;
                        break;
                    case "Pivot":
                        item.type = TransitionActionType.Pivot;
                        break;
                    case "Alpha":
                        item.type = TransitionActionType.Alpha;
                        break;
                    case "Rotation":
                        item.type = TransitionActionType.Rotation;
                        break;
                    case "Color":
                        item.type = TransitionActionType.Color;
                        break;
                    case "Animation":
                        item.type = TransitionActionType.Animation;
                        break;
                    case "Visible":
                        item.type = TransitionActionType.Visible;
                        break;
                    case "Sound":
                        item.type = TransitionActionType.Sound;
                        break;
                    case "Transition":
                        item.type = TransitionActionType.Transition;
                        break;
                    case "Shake":
                        item.type = TransitionActionType.Shake;
                        break;
                    case "ColorFilter":
                        item.type = TransitionActionType.ColorFilter;
                        break;
                    case "Skew":
                        item.type = TransitionActionType.Skew;
                        break;
                    default:
                        item.type = TransitionActionType.Unknown;
                        break;
                }
                item.tween = cxml.attributes.tween == "true";
                item.label = cxml.attributes.label;
                if (item.tween) {
                    item.duration = parseInt(cxml.attributes.duration) / Transition.FRAME_RATE;
                    if (item.time + item.duration > this.$maxTime)
                        this.$maxTime = item.time + item.duration;
                    str = cxml.attributes.ease;
                    if (str)
                        item.easeType = ParseEaseType(str);
                    str = cxml.attributes.repeat;
                    if (str)
                        item.repeat = parseInt(str);
                    item.yoyo = cxml.attributes.yoyo == "true";
                    item.label2 = cxml.attributes.label2;
                    let v: string = cxml.attributes.endValue;
                    if (v) {
                        this.decodeValue(item.type, cxml.attributes.startValue, item.startValue);
                        this.decodeValue(item.type, v, item.endValue);
                    }
                    else {
                        item.tween = false;
                        this.decodeValue(item.type, cxml.attributes.startValue, item.value);
                    }
                }
                else {
                    if (item.time > this.$maxTime)
                        this.$maxTime = item.time;
                    this.decodeValue(item.type, cxml.attributes.value, item.value);
                }
            }, this);
        }

        private decodeValue(type: number, str: string, value: TransitionValue) {
            let arr: string[];
            switch (type) {
                case TransitionActionType.XY:
                case TransitionActionType.Size:
                case TransitionActionType.Pivot:
                case TransitionActionType.Skew:
                    arr = str.split(",");
                    if (arr[0] == "-") {
                        value.b1 = false;
                    }
                    else {
                        value.f1 = parseFloat(arr[0]);
                        value.b1 = true;
                    }
                    if (arr[1] == "-") {
                        value.b2 = false;
                    }
                    else {
                        value.f2 = parseFloat(arr[1]);
                        value.b2 = true;
                    }
                    break;
                case TransitionActionType.Alpha:
                    value.f1 = parseFloat(str);
                    break;
                case TransitionActionType.Rotation:
                    value.i = parseInt(str);
                    break;
                case TransitionActionType.Scale:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    break;
                case TransitionActionType.Color:
                    value.c = utils.StringUtil.convertFromHtmlColor(str);
                    break;
                case TransitionActionType.Animation:
                    arr = str.split(",");
                    if (arr[0] == "-") {
                        value.b1 = false;
                    }
                    else {
                        value.i = parseInt(arr[0]);
                        value.b1 = true;
                    }
                    value.b = arr[1] == "p";
                    break;
                case TransitionActionType.Visible:
                    value.b = str == "true";
                    break;
                case TransitionActionType.Sound:
                    arr = str.split(",");
                    value.s = arr[0];
                    if (arr.length > 1) {
                        let intv: number = parseInt(arr[1]);
                        if (intv == 0 || intv == 100)
                            value.f1 = 1;
                        else
                            value.f1 = intv / 100;
                    }
                    else
                        value.f1 = 1;
                    break;
                case TransitionActionType.Transition:
                    arr = str.split(",");
                    value.s = arr[0];
                    if (arr.length > 1)
                        value.i = parseInt(arr[1]);
                    else
                        value.i = 1;
                    break;
                case TransitionActionType.Shake:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    break;

                case TransitionActionType.ColorFilter:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    value.f3 = parseFloat(arr[2]);
                    value.f4 = parseFloat(arr[3]);
                    break;
            }
        }

    }

    class TransitionItem {
        public time: number = 0;
        public targetId: string;
        public type: number = 0;
        public duration: number = 0;
        public value: TransitionValue;
        public startValue: TransitionValue;
        public endValue: TransitionValue;
        public easeType: (t: number) => number;
        public repeat: number = 0;
        public yoyo: boolean = false;
        public tween: boolean = false;
        public label: string;
        public label2: string;
        public hook: () => void;
        public hookObj: any;
        public hook2: () => void;
        public hook2Obj: any;
        
        public tweenTimes: number = 0;

        public tweener: createjs.Tween;
        public completed: boolean = false;
        public target: GObject;
        public filterCreated: boolean;
        public lockToken:number = 0;

        public constructor() {
            this.easeType = ParseEaseType("Quad.Out");
            this.value = new TransitionValue();
            this.startValue = new TransitionValue();
            this.endValue = new TransitionValue();
        }

        /**@internal */
        $shake(trans:Transition, elapsedMS:number):void {
            trans.$shakeItem(this, elapsedMS);
        }
    }

    class TransitionValue {
        public f1: number = 0;
        public f2: number = 0;
        public f3: number = 0;
        public f4: number = 0;
        public i: number = 0;
        public c: number = 0;
        public b: boolean = false;
        public s: string;
        public b1: boolean = true;
        public b2: boolean = true;
    }
}
