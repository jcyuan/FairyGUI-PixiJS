namespace fgui {

    export class MovieClipData {
        public reachesEnd: boolean;
        public reversed: boolean;
        public repeatedCount: number = 0;

        private $curFrame: number = 0;
        private $lastTime: number = 0;
        private $curFrameDelay: number = 0;

        public constructor() {
            this.$lastTime = Date.now();
        }

        public update(mc: MovieClip): void {
            let t: number = Date.now();
            let elapsed: number = t - this.$lastTime;
            this.$lastTime = t;

            let cur: number = this.$curFrame;
            if (cur >= mc.frameCount)
                cur = mc.frameCount - 1;

            this.reachesEnd = false;
            this.$curFrameDelay += elapsed;
            let interval: number = mc.interval + mc.frames[cur].addDelay
                + ((cur == 0 && this.repeatedCount > 0) ? mc.repeatDelay : 0);
            if (this.$curFrameDelay < interval)
                return;

            this.$curFrameDelay -= interval;
            if (this.$curFrameDelay > mc.interval)
                this.$curFrameDelay = mc.interval;

            if (mc.swing) {
                if (this.reversed) {
                    this.$curFrame--;
                    if (this.$curFrame < 0) {
                        this.$curFrame = Math.min(1, mc.frameCount - 1);
                        this.repeatedCount++;
                        this.reversed = !this.reversed;
                    }
                }
                else {
                    this.$curFrame++;
                    if (this.$curFrame > mc.frameCount - 1) {
                        this.$curFrame = Math.max(0, mc.frameCount - 2);
                        this.repeatedCount++;
                        this.reachesEnd = true;
                        this.reversed = !this.reversed;
                    }
                }
            }
            else {
                this.$curFrame++;
                if (this.$curFrame > mc.frameCount - 1) {
                    this.$curFrame = 0;
                    this.repeatedCount++;
                    this.reachesEnd = true;
                }
            }
        }

        public get currentFrame(): number {
            return this.$curFrame;
        }

        public set currentFrame(value: number) {
            this.$curFrame = value;
            this.$curFrameDelay = 0;
        }

        public rewind(): void {
            this.$curFrame = 0;
            this.$curFrameDelay = 0;
            this.reversed = false;
            this.reachesEnd = false;
        }

        public reset(): void {
            this.$curFrame = 0;
            this.$curFrameDelay = 0;
            this.repeatedCount = 0;
            this.reachesEnd = false;
            this.reversed = false;
        }

        public copy(src: MovieClipData): void {
            this.$curFrame = src.$curFrame;
            this.$curFrameDelay = src.$curFrameDelay;
            this.repeatedCount = src.repeatedCount;
            this.reachesEnd = src.reachesEnd;
            this.reversed = src.reversed;
        }
    }
}