namespace fgui.controller {
    export class PageOption {
        private $controller: Controller;
        private $id: string;

        public set controller(val: Controller) {
            this.$controller = val;
        }

        public set name(pageName: string) {
            this.$id = this.$controller.getPageIdByName(pageName);
        }

        public get name(): string {
            if (this.$id)
                return this.$controller.getPageNameById(this.$id);
            else
                return null;
        }

        public set index(pageIndex: number) {
            this.$id = this.$controller.getPageId(pageIndex);
        }

        public get index(): number {
            if (this.$id)
                return this.$controller.getPageIndexById(this.$id);
            else
                return -1;
        }

        public clear(): void {
            this.$id = null;
        }

        public set id(id: string) {
            this.$id = id;
        }

        public get id(): string {
            return this.$id;
        }
    }
}