namespace fgui {

    const enum MovieClipStatus {
        NORMAL,
        LOOPING,
        STOPPING,
        ENDED
    };

    export class MovieClip extends PIXI.Sprite implements IUIObject {

        public interval: number = 0;
        public swing: boolean;
        public repeatDelay: number = 0;

        private $playing: boolean;
        private $frameCount: number = 0;
        private $frames: Frame[];
        private $currentFrame: number = 0;
        private $status: number = MovieClipStatus.NORMAL;
        private $settings: DefaultMovieClipSettings;
        private data: MovieClipData;

        public UIOwner:GObject;

        public constructor(owner:GObject) {
            super();
            this.UIOwner = owner;
            this.data = new MovieClipData();
            this.$playing = true;
            this.interactive = this.interactiveChildren = false;
            this.$settings = new DefaultMovieClipSettings();

            this.on("added", this.added, this);
            this.on("removed", this.removed, this);
        }

        public get frames(): Frame[] {
            return this.$frames;
        }

        public set frames(value: Frame[]) {
            this.$frames = value;
            if (this.$frames != null)
                this.$frameCount = this.$frames.length;
            else
                this.$frameCount = 0;

            if (this.$settings.endFrame == -1 || this.$settings.endFrame > this.$frameCount - 1)
                this.$settings.endFrame = this.$frameCount - 1;
            if (this.$settings.loopEndAt == -1 || this.$settings.loopEndAt > this.$frameCount - 1)
                this.$settings.loopEndAt = this.$frameCount - 1;

            if (this.$currentFrame < 0 || this.$currentFrame > this.$frameCount - 1)
                this.$currentFrame = this.$frameCount - 1;

            if (this.$frameCount > 0)
                this.setFrame(this.$frames[this.$currentFrame]);
            else
                this.setFrame(null);
            this.data.rewind();
        }

        public get frameCount(): number {
            return this.$frameCount;
        }

        public get boundsRect(): PIXI.Rectangle {
            return this._boundsRect;
        }

        public set boundsRect(value: PIXI.Rectangle) {
            this._boundsRect = value;
        }

        public get currentFrame(): number {
            return this.$currentFrame;
        }

        public set currentFrame(value: number) {
            if (this.$currentFrame != value) {
                this.$currentFrame = value;
                this.data.currentFrame = value;
                this.setFrame(this.$currentFrame < this.$frameCount ? this.$frames[this.$currentFrame] : null);
            }
        }

        public get playing(): boolean {
            return this.$playing;
        }

        public set playing(value: boolean) {
            this.$playing = value;

            if (value && GObject.isDisplayObjectOnStage(this))
                GTimer.inst.add(0, 0, this.update, this);
            else
                GTimer.inst.remove(this.update, this);
        }

        /**
         * Modify the playing settings for the current MovieClip object, there are two ways to call this method:
         * 1) pass whole parameters:
                startFrame: number;
                endFrame: number;
                repeatCount: number;
                loopEndAt: number;
                endCallback: (target?: MovieClip) => void;
                endCallbackContext: any;
         * 2) just pass 1 object which implements MovieClipSettings (recommended)
         */
        public setPlaySettings(...args:any[]): void {
            if (args.length == 1 && typeof args[0] == "object")
                this.$settings.mix(args[0]);
            else {
                let s: any = args[0],
                    e: any = args[1],
                    r: any = args[2],
                    l: any = args[3],
                    ec: () => void = args[4],
                    ecc: any = args[5];

                let o: MovieClipSettings  = {};
                if (utils.NumberUtil.isNumber(s))
                    o.startFrame = s;
                if (utils.NumberUtil.isNumber(e))
                    o.endFrame = e;
                if (utils.NumberUtil.isNumber(r))
                    o.repeatCount = r;
                if (utils.NumberUtil.isNumber(l))
                    o.loopEndAt = l;
                if (ec && typeof (ec) == "function")
                    o.endCallback = ec;
                if (ecc)
                    o.endCallbackContext = ecc;

                this.$settings.mix(o);
            }

            if (this.$settings.endFrame == -1 || this.$settings.endFrame > this.$frameCount - 1)
                this.$settings.endFrame = this.$frameCount - 1;
            if (this.$settings.loopEndAt == -1)
                this.$settings.loopEndAt = this.$settings.endFrame;

            this.$status = MovieClipStatus.NORMAL;

            this.currentFrame = this.$settings.startFrame;
        }

        private update(): void {
            if (this.$playing && this.$frameCount != 0 && this.$status != MovieClipStatus.ENDED) {
                this.data.update(this);
                if (this.$currentFrame != this.data.currentFrame) {
                    if (this.$status == MovieClipStatus.LOOPING) {
                        this.$currentFrame = this.$settings.startFrame;
                        this.data.currentFrame = this.$currentFrame;
                        this.$status = MovieClipStatus.NORMAL;
                    }
                    else if (this.$status == MovieClipStatus.STOPPING) {
                        this.$currentFrame = this.$settings.loopEndAt;
                        this.data.currentFrame = this.$currentFrame;
                        this.$status = MovieClipStatus.ENDED;

                        //play end
                        if (this.$settings.endCallback != null)
                            GTimer.inst.callLater(this.$playEnd, this);
                    }
                    else {
                        this.$currentFrame = this.data.currentFrame;
                        if (this.$currentFrame == this.$settings.endFrame) {
                            if (this.$settings.repeatCount > 0) {
                                this.$settings.repeatCount--;
                                if (this.$settings.repeatCount == 0)
                                    this.$status = MovieClipStatus.STOPPING;
                                else
                                    this.$status = MovieClipStatus.LOOPING;
                            }
                        }
                    }

                    this.setFrame(this.$frames[this.$currentFrame]);
                }
            }
        }

        private $playEnd(): void {
            if (this.$settings.endCallback != null) {
                let f: (mc:MovieClip) => void = this.$settings.endCallback;
                let fObj: any = this.$settings.endCallbackContext;

                this.$settings.endCallback = this.$settings.endCallbackContext = null;
                this.$settings.endCallbackContext = null;

                if(f)
                    f.call(fObj, this);
            }
        }

        private setFrame(frame: Frame): void {
            this.texture = frame == null ? null : frame.texture;
        }

        private added(disp: PIXI.DisplayObject): void {
            if (this.$playing)
                GTimer.inst.add(0, 0, this.update, this);
        }

        private removed(disp: PIXI.DisplayObject): void {
            if (this.$playing)
                GTimer.inst.remove(this.update, this);
        }

        public destroy(): void {
            GTimer.inst.remove(this.update, this);
            this.off("added", this.added, this);
            this.off("removed", this.removed, this);
            super.destroy();
        }
    }
}