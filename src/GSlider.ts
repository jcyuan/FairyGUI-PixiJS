namespace fgui {

    export class GSlider extends GComponent {
        protected $max: number = 0;
        protected $value: number = 0;
        protected $titleType: ProgressTitleType;

        protected $titleObject: GTextField;
        protected $aniObject: GObject;
        protected $barObjectH: GObject;
        protected $barObjectV: GObject;

        protected $barMaxWidth: number = 0;
        protected $barMaxHeight: number = 0;
        protected $barMaxWidthDelta: number = 0;
        protected $barMaxHeightDelta: number = 0;
        protected $gripObject: GObject;

        private $clickPos: PIXI.Point;
        private $clickPercent: number;

        public constructor() {
            super();

            this.$titleType = ProgressTitleType.Percent;
            this.$value = 50;
            this.$max = 100;
            this.$clickPos = new PIXI.Point();
        }

        public get titleType(): ProgressTitleType {
            return this.$titleType;
        }

        public set titleType(value: ProgressTitleType) {
            this.$titleType = value;
        }

        public get max(): number {
            return this.$max;
        }

        public set max(value: number) {
            if (this.$max != value) {
                this.$max = value;
                this.update();
            }
        }

        public get value(): number {
            return this.$value;
        }

        public set value(value: number) {
            if (this.$value != value) {
                this.$value = value;
                this.update();
            }
        }

        public update(): void {
            let percent: number = Math.min(this.$value / this.$max, 1);
            this.updateWidthPercent(percent);
        }

        private updateWidthPercent(percent: number): void {
            if (this.$titleObject) {
                switch (this.$titleType) {
                    case ProgressTitleType.Percent:
                        this.$titleObject.text = `${Math.round(percent * 100)}%`;
                        break;

                    case ProgressTitleType.ValueAndMax:
                        this.$titleObject.text = `${this.$value}/${this.$max}`;
                        break;

                    case ProgressTitleType.Value:
                        this.$titleObject.text = `${this.$value}`;
                        break;

                    case ProgressTitleType.Max:
                        this.$titleObject.text = `${this.$max}`;
                        break;
                }
            }

            if (this.$barObjectH)
                this.$barObjectH.width = (this.width - this.$barMaxWidthDelta) * percent;
            if (this.$barObjectV)
                this.$barObjectV.height = (this.height - this.$barMaxHeightDelta) * percent;

            if (this.$aniObject instanceof GMovieClip)
                (this.$aniObject as GMovieClip).frame = Math.round(percent * 100);
        }

        protected handleSizeChanged(): void {
            super.handleSizeChanged();

            if (this.$barObjectH)
                this.$barMaxWidth = this.width - this.$barMaxWidthDelta;
            if (this.$barObjectV)
                this.$barMaxHeight = this.height - this.$barMaxHeightDelta;
            if (!this.$inProgressBuilding)
                this.update();
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            xml = utils.XmlParser.getChildNodes(xml, "Slider")[0];
            if (xml) {
                this.$value = parseInt(xml.attributes.value);
                this.$max = parseInt(xml.attributes.max);
            }

            this.update();
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            xml = utils.XmlParser.getChildNodes(xml, "Slider")[0];

            let str: string;
            if (xml) {
                str = xml.attributes.titleType;
                if (str)
                    this.$titleType = ParseProgressTitleType(str);
            }

            this.$titleObject = this.getChild("title") as GTextField;
            this.$barObjectH = this.getChild("bar");
            this.$barObjectV = this.getChild("bar_v");
            this.$aniObject = this.getChild("ani");
            this.$gripObject = this.getChild("grip");

            if (this.$barObjectH) {
                this.$barMaxWidth = this.$barObjectH.width;
                this.$barMaxWidthDelta = this.width - this.$barMaxWidth;
            }
            if (this.$barObjectV) {
                this.$barMaxHeight = this.$barObjectV.height;
                this.$barMaxHeightDelta = this.height - this.$barMaxHeight;
            }
            if (this.$gripObject)
                this.$gripObject.on(InteractiveEvents.Down, this.$gripMouseDown, this);
        }

        private $gripMouseDown(evt: PIXI.interaction.InteractionEvent): void {
            this.$clickPos = this.globalToLocal(evt.data.global.x, evt.data.global.y);
            this.$clickPercent = this.$value / this.$max;

            GRoot.inst.nativeStage.on(InteractiveEvents.Move, this.$gripMouseMove, this);
            GRoot.inst.nativeStage.on(InteractiveEvents.Up, this.$gripMouseUp, this);
        }

        private static sSilderHelperPoint: PIXI.Point = new PIXI.Point();

        private $gripMouseMove(evt: PIXI.interaction.InteractionEvent): void {
            let pt: PIXI.Point = this.globalToLocal(evt.data.global.x, evt.data.global.y, GSlider.sSilderHelperPoint);
            let deltaX: number = pt.x - this.$clickPos.x;
            let deltaY: number = pt.y - this.$clickPos.y;

            let percent: number;
            if (this.$barObjectH)
                percent = this.$clickPercent + deltaX / this.$barMaxWidth;
            else
                percent = this.$clickPercent + deltaY / this.$barMaxHeight;
            if (percent > 1)
                percent = 1;
            else if (percent < 0)
                percent = 0;
            let newValue: number = Math.round(this.$max * percent);
            if (newValue != this.$value) {
                this.$value = newValue;
                this.emit(StateChangeEvent.CHANGED, this);
            }
            this.updateWidthPercent(percent);
        }

        private $gripMouseUp(evt: PIXI.interaction.InteractionEvent): void {
            let percent: number = this.$value / this.$max;
            this.updateWidthPercent(percent);

            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$gripMouseMove, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$gripMouseUp, this);
        }

        public dispose():void {
            if (this.$gripObject)
                this.$gripObject.off(InteractiveEvents.Down, this.$gripMouseDown, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Move, this.$gripMouseMove, this);
            GRoot.inst.nativeStage.off(InteractiveEvents.Up, this.$gripMouseUp, this);
            super.dispose();
        }
    }
}