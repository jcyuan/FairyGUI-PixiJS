namespace fgui.controller {
    export class Action {

        public fromPage: string[];
        public toPage: string[];

        public static create(type: string): Action {
            switch (type) {
                case "play_transition":
                    return new PlayTransitionAction();

                case "change_page":
                    return new ChangePageAction();
            }
            return null;
        }

        public execute(controller: Controller, prevPage: string, curPage: string): void {
            if ((!this.fromPage || this.fromPage.length == 0 || this.fromPage.indexOf(prevPage) != -1)
                && (!this.toPage || this.toPage.length == 0 || this.toPage.indexOf(curPage) != -1))
                this.enter(controller);
            else
                this.leave(controller);
        }

        protected enter(controller: Controller): void {
        }

        protected leave(controller: Controller): void {
        }
        
        public setup(xml: fgui.utils.XmlNode): void {
            let str: String;

            str = xml.attributes.fromPage;
            if (str)
                this.fromPage = str.split(",");

            str = xml.attributes.toPage;
            if (str)
                this.toPage = str.split(",");
        }
    }
}