namespace fgui {

    export class GearBase<T> {

        public static disableAllTweenEffect: boolean = false;

        protected $tween: boolean;
        protected $easeType: (t: number) => number;
        protected $tweenTime: number;
        protected $tweenDelay: number;
        protected $lockToken:number = 0;
        
        protected $owner: GObject & T;
        protected $controller: controller.Controller;

        public constructor(owner: GObject & T) {
            this.$owner = owner;
            this.$easeType = ParseEaseType("Quad.Out");
            this.$tweenTime = 0.3;
            this.$tweenDelay = 0;
        }
        
        public get controller(): controller.Controller {
            return this.$controller;
        }

        public set controller(val: controller.Controller) {
            if (val != this.$controller) {
                this.$controller = val;
                if (this.$controller)
                    this.init();
            }
        }

        public get tween(): boolean {
            return this.$tween;
        }

        public set tween(val: boolean) {
            this.$tween = val;
        }

        public get tweenDelay(): number {
            return this.$tweenDelay;
        }

        public set tweenDelay(val: number) {
            this.$tweenDelay = val;
        }

        public get tweenTime(): number {
            return this.$tweenTime;
        }

        public set tweenTime(value: number) {
            this.$tweenTime = value;
        }

        public get easeType(): (t: number) => number {
            return this.$easeType;
        }

        public set easeType(value: (t: number) => number) {
            this.$easeType = value;
        }

        public setup(xml: utils.XmlNode): void {
            this.$controller = this.$owner.parent.getController(xml.attributes.controller);
            if (this.$controller == null)
                return;

            this.init();

            let str: string;

            str = xml.attributes.tween;
            if (str)
                this.$tween = true;

            str = xml.attributes.ease;
            if (str)
                this.$easeType = ParseEaseType(str);

            str = xml.attributes.duration;
            if (str)
                this.$tweenTime = parseFloat(str);

            str = xml.attributes.delay;
            if (str)
                this.$tweenDelay = parseFloat(str);

            if (this instanceof GearDisplay) {
                str = xml.attributes.pages;
                if (str)
                    (this as GearDisplay).pages = str.split(",");
            }
            else {
                let pages: string[];
                let values: string[];

                str = xml.attributes.pages;
                if (str)
                    pages = str.split(",");

                str = xml.attributes.values;
                if (str)
                    values = str.split("|");

                if (pages && values) {
                    values.forEach((s, i) => {
                        this.addStatus(pages[i], s);
                    });
                }

                str = xml.attributes.default;
                if (str)
                    this.addStatus(null, str);
            }
        }

        public updateFromRelations(dx: number, dy: number): void {
        }

        protected addStatus(pageId: string, value: string): void {
        }

        protected init(): void {
        }

        public apply(): void {
        }

        public updateState(): void {
        }
    }
}
