namespace fgui.controller {
    export class PlayTransitionAction extends Action {

        public transitionName: string;
        public repeat: number = 1;
        public delay: number = 0;
        public stopOnExit: boolean = false;

        private $currentTransition: Transition;

        protected enter(controller: Controller): void {
            let trans: Transition = controller.parent.getTransition(this.transitionName);
            if (trans) {
                if (this.$currentTransition && this.$currentTransition.playing)
                    trans.changeRepeat(this.repeat);
                else
                    trans.play({
                        times: this.repeat,
                        delay: this.delay
                    });
                this.$currentTransition = trans;
            }
        }

        protected leave(controller: Controller): void {
            if (this.stopOnExit && this.$currentTransition) {
                this.$currentTransition.stop();
                this.$currentTransition = null;
            }
        }

        /**@internal */
        public setup(xml: utils.XmlNode): void {
            super.setup(xml);

            this.transitionName = xml.attributes.transition;

            let str: string;

            str = xml.attributes.repeat;
            if (str)
                this.repeat = parseInt(str);

            str = xml.attributes.delay;
            if (str)
                this.delay = parseFloat(str);

            this.stopOnExit = xml.attributes.stopOnExit == "true";
        }
    }
}