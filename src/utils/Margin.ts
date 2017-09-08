namespace fgui.utils {

    export class Margin {
        public left: number = 0;
        public right: number = 0;
        public top: number = 0;
        public bottom: number = 0;

        public parse(str: string): void {
            if (!str) {
                this.left = this.right = this.top = this.bottom = 0;
                return;
            }
            let arr: string[] = str.split(",");
            if (arr.length == 1) {
                let k: number = parseInt(arr[0]);
                this.left = this.right = this.top = this.bottom = k;
            }
            else {
                this.top = parseInt(arr[0]);
                this.bottom = parseInt(arr[1]);
                this.left = parseInt(arr[2]);
                this.right = parseInt(arr[3]);
            }
        }

        public copy(source: Margin): void {
            this.top = source.top;
            this.bottom = source.bottom;
            this.left = source.left;
            this.right = source.right;
        }
    }
}