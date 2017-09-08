namespace fgui {

    //TODO: impl
    export class GTextInput extends GComponent {

        public constructor() {
            super();
        }

        public get editable(): boolean {
            return false;
        }

        public set editable(v: boolean) {

        }

        public get promptText(): string {
            return "";
        }

        public set promptText(v: string) {

        }

        public get maxLength(): number {
            return 0;
        }

        public set maxLength(v: number) {

        }

        public get restrict(): string {
            return "";
        }

        public set restrict(v: string) {

        }

        public get password(): boolean {
            return false;
        }

        public set password(v: boolean) {

        }

    }

}