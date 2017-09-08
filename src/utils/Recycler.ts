namespace fgui.utils {

    export abstract class Recycler<T> {
        protected $pool: { [name: string]: T[] };
        protected $count: number = 0;

        public constructor() {
            this.$pool = {};
        }

        public get count(): number {
            return this.$count;
        }

        public clear(): void {
            for (let key in this.$pool) {
                let arr = this.$pool[key];
                if (arr) {
                    arr.length = 0;
                    arr = null;
                }
            }
            this.$pool = {};
            this.$count = 0;
        }

        public get(id: string): T {
            let arr: T[] = this.$pool[id];
            if (arr == null) {
                arr = [];
                this.$pool[id] = arr;
            }
            if (arr.length) {
                this.$count--;
                return arr.shift();
            }
            return this.createObject(id);
        }

        protected abstract createObject(id: string): T;

        public recycle(id: string, obj: T): void {
            if (!id) return;
            let arr: T[] = this.$pool[id];
            if (arr == null) {
                arr = [];
                this.$pool[id] = arr;
            }
            this.$count++;
            arr.push(obj);
        }
    }
}