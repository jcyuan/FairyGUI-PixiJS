namespace fgui {

    export class GProgressBar extends GComponent {
        private $max: number = 0;
        private $value: number = 0;
        private $titleType: ProgressTitleType;
        private $reverse: boolean;

        private $titleObject: GTextField;
        private $aniObject: GObject;
        private $barObjectH: GObject;
        private $barObjectV: GObject;
        private $barMaxWidth: number = 0;
        private $barMaxHeight: number = 0;
        private $barMaxWidthDelta: number = 0;
        private $barMaxHeightDelta: number = 0;
        private $barStartX: number = 0;
        private $barStartY: number = 0;

        private $tweener: createjs.Tween;
        private $tweenValue: number = 0;

        private static easeLinear: (amount: number) => number = ParseEaseType("linear"); // createjs.Ease.getPowIn(1);

        public constructor() {
            super();

            this.$titleType = ProgressTitleType.Percent;
            this.$value = 50;
            this.$max = 100;
        }

        public get titleType(): ProgressTitleType {
            return this.$titleType;
        }

        public set titleType(value: ProgressTitleType) {
            if (this.$titleType != value) {
                this.$titleType = value;
                this.update(this.$value);
            }
        }

        public get max(): number {
            return this.$max;
        }

        public set max(value: number) {
            if (this.$max != value) {
                this.$max = value;
                this.update(this.$value);
            }
        }

        public get value(): number {
            return this.$value;
        }

        public set value(value: number) {
            if (this.$tweener != null) {
                this.$tweener.paused = true;
                this.$tweener = null;
            }

            if (this.$value != value) {
                this.$value = value;
                this.update(this.$value);
            }
        }

        public tweenValue(value: number, duration: number): createjs.Tween {
            if (this.$value != value) {
                if (this.$tweener) {
                    this.$tweener.paused = true;
                    this.$tweener.removeAllEventListeners();
                    createjs.Tween.removeTweens(this);
                }

                this.$tweenValue = this.$value;
                this.$value = value;
                this.$tweener = createjs.Tween.get(this, { onChange: utils.Binder.create(this.onUpdateTween, this) })
                    .to({ $tweenValue: value }, duration * 1000, GProgressBar.easeLinear);
                return this.$tweener;
            }
            else
                return null;
        }

        private onUpdateTween(): void {
            this.update(this.$tweenValue);
        }

        public update(val: number): void {
            let percent: number = this.$max != 0 ? Math.min(val / this.$max, 1) : 0;
            if (this.$titleObject) {
                switch (this.$titleType) {
                    case ProgressTitleType.Percent:
                        this.$titleObject.text = `${Math.round(percent * 100)}%`;
                        break;

                    case ProgressTitleType.ValueAndMax:
                        this.$titleObject.text = `${Math.round(val)}/${Math.round(this.$max)}`;
                        break;

                    case ProgressTitleType.Value:
                        this.$titleObject.text = `${Math.round(val)}`;
                        break;

                    case ProgressTitleType.Max:
                        this.$titleObject.text = `${Math.round(this.$max)}`;
                        break;
                }
            }

            let fullWidth: number = this.width - this.$barMaxWidthDelta;
            let fullHeight: number = this.height - this.$barMaxHeightDelta;
            if (!this.$reverse) {
                if (this.$barObjectH)
                    this.$barObjectH.width = fullWidth * percent;
                if (this.$barObjectV)
                    this.$barObjectV.height = fullHeight * percent;
            }
            else {
                if (this.$barObjectH) {
                    this.$barObjectH.width = fullWidth * percent;
                    this.$barObjectH.x = this.$barStartX + (fullWidth - this.$barObjectH.width);

                }
                if (this.$barObjectV) {
                    this.$barObjectV.height = fullHeight * percent;
                    this.$barObjectV.y = this.$barStartY + (fullHeight - this.$barObjectV.height);
                }
            }
            if (this.$aniObject instanceof GMovieClip)
                (this.$aniObject as GMovieClip).frame = Math.round(percent * 100);
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            xml = utils.XmlParser.getChildNodes(xml, "ProgressBar")[0];

            let str: string;
            str = xml.attributes.titleType;
            if (str)
                this.$titleType = ParseProgressTitleType(str);

            this.$reverse = xml.attributes.reverse == "true";

            this.$titleObject = this.getChild("title") as GTextField;
            this.$barObjectH = this.getChild("bar");
            this.$barObjectV = this.getChild("bar_v");
            this.$aniObject = this.getChild("ani");

            if (this.$barObjectH) {
                this.$barMaxWidth = this.$barObjectH.width;
                this.$barMaxWidthDelta = this.width - this.$barMaxWidth;
                this.$barStartX = this.$barObjectH.x;
            }
            if (this.$barObjectV) {
                this.$barMaxHeight = this.$barObjectV.height;
                this.$barMaxHeightDelta = this.height - this.$barMaxHeight;
                this.$barStartY = this.$barObjectV.y;
            }
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            if (this.$barObjectH)
                this.$barMaxWidth = this.width - this.$barMaxWidthDelta;
            if (this.$barObjectV)
                this.$barMaxHeight = this.height - this.$barMaxHeightDelta;
            if (!this.$inProgressBuilding)
                this.update(this.$value);
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            xml = utils.XmlParser.getChildNodes(xml, "ProgressBar")[0];
            if (xml) {
                this.$value = parseInt(xml.attributes.value) || 0;
                this.$max = parseInt(xml.attributes.max) || 0;
            }
            this.update(this.$value);
        }

        public dispose(): void {
            if (this.$tweener) {
                this.$tweener.paused = true;
                this.$tweener.removeAllEventListeners();
            }
            createjs.Tween.removeTweens(this);
            this.$tweener = null;
            super.dispose();
        }
    }
}