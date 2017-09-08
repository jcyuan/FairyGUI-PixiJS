namespace fgui {

    export class Controller extends PIXI.utils.EventEmitter {

        private $name: string;
        private $selectedIndex: number = 0;
        private $previousIndex: number = 0;
        private $pageIds: string[];
        private $pageNames: string[];
        private $pageTransitions: PageTransition[];
        private $playingTransition: Transition;

        /**@internal */
        $parent: GComponent;
        /**@internal */
        $autoRadioGroupDepth: boolean;
        /**@internal */
        $updating: boolean;

        private static $nextPageId: number = 0;

        public constructor() {
            super();
            this.$pageIds = [];
            this.$pageNames = [];
            this.$selectedIndex = -1;
            this.$previousIndex = -1;
        }

        public get name(): string {
            return this.$name;
        }

        public set name(value: string) {
            this.$name = value;
        }

        public get parent(): GComponent {
            return this.$parent;
        }

        public get selectedIndex(): number {
            return this.$selectedIndex;
        }

        public set selectedIndex(value: number) {
            this.setSelectedIndexInternal(value);
        }

        public setSelectedIndex(value: number = 0): void {
            this.setSelectedIndexInternal(value, false);
        }

        protected setSelectedIndexInternal(value: number, emitEvent: boolean = true): void {
            if (this.$selectedIndex != value) {
                if (value > this.$pageIds.length - 1)
                    throw new Error(`index out of bounds: ${value}`);

                this.$updating = true;

                this.$previousIndex = this.$selectedIndex;
                this.$selectedIndex = value;
                this.$parent.applyController(this);

                if (emitEvent !== false)
                    this.emit(StateChangeEvent.CHANGED, this);

                if (this.$playingTransition) {
                    this.$playingTransition.stop();
                    this.$playingTransition = null;
                }

                if (this.$pageTransitions) {
                    let len: number = this.$pageTransitions.length;
                    for (let i: number = 0; i < len; i++) {
                        let pt: PageTransition = this.$pageTransitions[i];
                        if (pt.toIndex == this.$selectedIndex && (pt.fromIndex == -1 || pt.fromIndex == this.$previousIndex)) {
                            this.$playingTransition = this.parent.getTransition(pt.transitionName);
                            break;
                        }
                    }

                    if (this.$playingTransition)
                        this.$playingTransition.play(() => { this.$playingTransition = null; }, this);
                }

                this.$updating = false;
            }
        }

        public get previsousIndex(): number {
            return this.$previousIndex;
        }

        public get selectedPage(): string {
            if (this.$selectedIndex == -1)
                return null;
            else
                return this.$pageNames[this.$selectedIndex];
        }

        public set selectedPage(val: string) {
            let i: number = this.$pageNames.indexOf(val);
            if (i == -1)
                i = 0;
            this.selectedIndex = i;
        }

        public setSelectedPage(value: string): void {
            let i: number = this.$pageNames.indexOf(value);
            if (i == -1)
                i = 0;
            this.setSelectedIndexInternal(i, false);
        }

        public get previousPage(): string {
            if (this.$previousIndex == -1)
                return null;
            else
                return this.$pageNames[this.$previousIndex];
        }

        public get pageCount(): number {
            return this.$pageIds.length;
        }

        public getPageName(index: number = 0): string {
            return this.$pageNames[index];
        }

        public addPage(name: string = ""): void {
            this.addPageAt(name, this.$pageIds.length);
        }

        public addPageAt(name: string, index: number = 0): void {
            let nid: string = `${Controller.$nextPageId++}`;
            if (index == this.$pageIds.length) {
                this.$pageIds.push(nid);
                this.$pageNames.push(name);
            }
            else {
                this.$pageIds.splice(index, 0, nid);
                this.$pageNames.splice(index, 0, name);
            }
        }

        public removePage(name: string): void {
            let i: number = this.$pageNames.indexOf(name);
            if (i != -1) {
                this.$pageIds.splice(i, 1);
                this.$pageNames.splice(i, 1);
                if (this.$selectedIndex >= this.$pageIds.length)
                    this.selectedIndex = this.$selectedIndex - 1;
                else
                    this.$parent.applyController(this);
            }
        }

        public removePageAt(index: number = 0): void {
            this.$pageIds.splice(index, 1);
            this.$pageNames.splice(index, 1);
            if (this.$selectedIndex >= this.$pageIds.length)
                this.selectedIndex = this.$selectedIndex - 1;
            else
                this.$parent.applyController(this);
        }

        public clearPages(): void {
            this.$pageIds.length = 0;
            this.$pageNames.length = 0;
            if (this.$selectedIndex != -1)
                this.selectedIndex = -1;
            else
                this.$parent.applyController(this);
        }

        public hasPage(aName: string): boolean {
            return this.$pageNames.indexOf(aName) != -1;
        }

        public getPageIndexById(aId: string): number {
            return this.$pageIds.indexOf(aId);
        }

        public getPageIdByName(aName: string): string {
            let i: number = this.$pageNames.indexOf(aName);
            if (i != -1)
                return this.$pageIds[i];
            else
                return null;
        }

        public getPageNameById(aId: string): string {
            let i: number = this.$pageIds.indexOf(aId);
            if (i != -1)
                return this.$pageNames[i];
            else
                return null;
        }

        public getPageId(index: number = 0): string {
            return this.$pageIds[index];
        }

        public get selectedPageId(): string {
            if (this.$selectedIndex == -1)
                return null;
            else
                return this.$pageIds[this.$selectedIndex];
        }

        public set selectedPageId(val: string) {
            this.selectedIndex = this.$pageIds.indexOf(val);
        }

        public set oppositePageId(val: string) {
            let i: number = this.$pageIds.indexOf(val);
            if (i > 0)
                this.selectedIndex = 0;
            else if (this.$pageIds.length > 1)
                this.selectedIndex = 1;
        }

        public get previousPageId(): string {
            if (this.$previousIndex == -1)
                return null;
            else
                return this.$pageIds[this.$previousIndex];
        }

        public setup(xml: utils.XmlNode): void {
            this.$name = xml.attributes.name;
            this.$autoRadioGroupDepth = xml.attributes.autoRadioGroupDepth == "true";

            let str: string = xml.attributes.pages;
            if (str) {
                let arr = str.split(",");
                let cnt = arr.length;
                for (let i = 0; i < cnt; i += 2) {
                    this.$pageIds.push(arr[i]);
                    this.$pageNames.push(arr[i + 1]);
                }
            }

            str = xml.attributes.transitions;
            if (str) {
                this.$pageTransitions = [];
                let k: number = 0;
                str.split(",").forEach(str => {
                    if (str && str.length) {
                        let pt: PageTransition = new PageTransition();
                        k = str.indexOf("=");
                        pt.transitionName = str.substr(k + 1);
                        str = str.substring(0, k);
                        k = str.indexOf("-");
                        pt.toIndex = parseInt(str.substring(k + 1));
                        str = str.substring(0, k);
                        if (str == "*")
                            pt.fromIndex = -1;
                        else
                            pt.fromIndex = parseInt(str);
                        this.$pageTransitions.push(pt);
                    }
                });
            }

            if (this.$parent && this.$pageIds.length > 0)
                this.$selectedIndex = 0;
            else
                this.$selectedIndex = -1;
        }
    }

    class PageTransition {
        public transitionName: string;
        public fromIndex: number = 0;
        public toIndex: number = 0;
    }
}