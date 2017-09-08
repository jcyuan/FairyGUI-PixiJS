/// <reference path="./Recycler.ts" />

namespace fgui.utils {
    export class GObjectRecycler extends Recycler<GObject> {

        public constructor() {
            super();
        }

        public clear(): void {
            for (let key in this.$pool) {
                let arr = this.$pool[key];
                if (arr) {
                    arr.forEach((v: GObject) => {
                        v.dispose();
                    });
                }
            }
            super.clear();
        }

        protected createObject(id: string): GObject {
            return UIPackage.createObjectFromURL(id);  //id = url
        }
    }
}