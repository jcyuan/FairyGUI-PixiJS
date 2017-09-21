/// <reference path="./GObject.ts" />

namespace fgui {

    export class GMovieClip extends GObject implements IAnimationGear, IColorGear {

        private $movieClip: MovieClip;

        public constructor() {
            super();
        }

        protected mapPivotWidth(scale: number): number {
            return scale * this.$sourceWidth;
        }

        protected mapPivotHeight(scale: number): number {
            return scale * this.$sourceHeight;
        }

        protected handleSizeChanged(): void {
            if (this.$displayObject != null && this.$sourceWidth != 0 && this.$sourceHeight != 0)
                this.$displayObject.scale.set(this.$width / this.$sourceWidth * this.$scaleX, this.$height / this.$sourceHeight * this.$scaleY);
        }

        public handleScaleChanged(): void {
            if (this.$displayObject != null) {
                this.$displayObject.scale.set(
                    this.$width / this.$sourceWidth * this.$scaleX,
                    this.$height / this.$sourceHeight * this.$scaleY
                );
            }
        }

        public get touchable(): boolean {
            return false;
        }

        public set touchable(value: boolean) {
            this.$touchable = false;  //GMovieClip has no interaction
        }

        public get color(): number {
            return this.$movieClip.tint;
        }

        public set color(value: number) {
            this.$movieClip.tint = value;
        }

        protected createDisplayObject(): void {
            this.$movieClip = new MovieClip(this);
            this.setDisplayObject(this.$movieClip);
        }

        public get playing(): boolean {
            return this.$movieClip.playing;
        }

        public set playing(value: boolean) {
            if (this.$movieClip.playing != value) {
                this.$movieClip.playing = value;
                this.updateGear(GearType.Animation);
            }
        }

        public get frame(): number {
            return this.$movieClip.currentFrame;
        }

        public set frame(value: number) {
            if (this.$movieClip.currentFrame != value) {
                this.$movieClip.currentFrame = value;
                this.updateGear(GearType.Animation);
            }
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
        public setPlaySettings(...args: any[]): void {
            this.$movieClip.setPlaySettings.apply(this.$movieClip, args);
        }

        public constructFromResource(): void {
            this.$sourceWidth = this.packageItem.width;
            this.$sourceHeight = this.packageItem.height;
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;

            this.setSize(this.$sourceWidth, this.$sourceHeight);

            this.packageItem.load();

            this.$movieClip.interval = this.packageItem.interval;
            this.$movieClip.swing = this.packageItem.swing;
            this.$movieClip.repeatDelay = this.packageItem.repeatDelay;
            this.$movieClip.frames = this.packageItem.frames;
            this.$movieClip.boundsRect = new PIXI.Rectangle(0, 0, this.$sourceWidth, this.$sourceHeight);
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let str: string;
            str = xml.attributes.frame;
            if (str)
                this.$movieClip.currentFrame = parseInt(str);
            str = xml.attributes.playing;
            this.$movieClip.playing = str != "false";

            str = xml.attributes.color;
            if (str)
                this.color = utils.StringUtil.convertFromHtmlColor(str);
        }
    }
}