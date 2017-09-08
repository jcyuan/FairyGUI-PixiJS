namespace fgui {

    export class Relations {

        protected $owner: GObject;
        protected $items: RelationItem[];

        public sizeDirty: boolean = false;

        /**@internal */
        $dealing: GObject;  //currently deal with

        private static RELATION_NAMES: string[] =
        [
            "left-left",        //0
            "left-center",
            "left-right",
            "center-center",
            "right-left",
            "right-center",
            "right-right",
            "top-top",          //7
            "top-middle",
            "top-bottom",
            "middle-middle",
            "bottom-top",
            "bottom-middle",
            "bottom-bottom",
            "width-width",      //14
            "height-height",    //15
            "leftext-left",     //16
            "leftext-right",
            "rightext-left",
            "rightext-right",
            "topext-top",//20
            "topext-bottom",
            "bottomext-top",
            "bottomext-bottom"//23
        ];

        public constructor(owner: GObject) {
            this.$owner = owner;
            this.$items = [];
        }

        public add(target: GObject, relationType: number, usePercent: boolean = false): void {
            let length: number = this.$items.length;
            for (let i: number = 0; i < length; i++) {
                let item: RelationItem = this.$items[i];
                if (item.target == target) {
                    item.add(relationType, usePercent);
                    return;
                }
            }
            let newItem: RelationItem = new RelationItem(this.$owner);
            newItem.target = target;
            newItem.add(relationType, usePercent);
            this.$items.push(newItem);
        }

        public addItems(target: GObject, sidePairs: string): void {
            let arr: string[] = sidePairs.split(",");
            let s: string;
            let usePercent: boolean;
            
            for (let i = 0; i < 2; i++) {
                s = arr[i];
                if (!s)
                    continue;

                if (s.charAt(s.length - 1) == "%") {
                    s = s.substr(0, s.length - 1);
                    usePercent = true;
                }
                else
                    usePercent = false;
                if (s.indexOf("-") == -1)
                    s = `${s}-${s}`;

                let t: number = Relations.RELATION_NAMES.indexOf(s);
                if (t == -1)
                    throw new Error("Invalid relation type");

                this.add(target, t, usePercent);
            }
        }

        public remove(target: GObject, relationType: number = 0): void {
            let cnt: number = this.$items.length;
            let i: number = 0;
            while (i < cnt) {
                let item: RelationItem = this.$items[i];
                if (item.target == target) {
                    item.remove(relationType);
                    if (item.isEmpty) {
                        item.dispose();
                        this.$items.splice(i, 1);
                        cnt--;
                    }
                    else
                        i++;
                }
                else
                    i++;
            }
        }

        public contains(target: GObject): boolean {
            let length: number = this.$items.length;
            for (let i: number = 0; i < length; i++) {
                if (this.$items[i].target == target)
                    return true;
            }
            return false;
        }

        public clearFor(target: GObject): void {
            let cnt: number = this.$items.length;
            let i: number = 0;
            while (i < cnt) {
                let item: RelationItem = this.$items[i];
                if (item.target == target) {
                    item.dispose();
                    this.$items.splice(i, 1);
                    cnt--;
                }
                else
                    i++;
            }
        }

        public clearAll(): void {
            this.$items.forEach(item => {
                item.dispose();
            }, this);
            this.$items.length = 0;
        }

        public copyFrom(source: Relations): void {
            this.clearAll();
            source.$items.forEach(ri => {
                let item: RelationItem = new RelationItem(this.$owner);
                item.copyFrom(ri);
                this.$items.push(item);
            }, this);
        }

        public dispose(): void {
            this.clearAll();
        }

        public onOwnerSizeChanged(dWidth: number, dHeight: number): void {
            if (this.$items.length <= 0)
                return;
            this.$items.forEach(item => {
                item.applyOnSelfResized(dWidth, dHeight);
            }, this);
        }

        public ensureRelationsSizeCorrect(): void {
            if (this.$items.length == 0)
                return;

            this.sizeDirty = false;
            this.$items.forEach(item => {
                item.target.ensureSizeCorrect();
            }, this);
        }

        public get empty(): boolean {
            return this.$items.length == 0;
        }

        public setup(xml: utils.XmlNode): void {
            xml.children.forEach(cxml => {
                if (cxml.nodeName != "relation")
                    return;

                let targetId: string;
                let target: GObject;

                targetId = cxml.attributes.target;
                if (this.$owner.parent) {
                    if (targetId)
                        target = this.$owner.parent.getChildById(targetId);
                    else
                        target = this.$owner.parent;
                }
                else {
                    //call from the component's constructor
                    target = (this.$owner as GComponent).getChildById(targetId);
                }
                if (target)
                    this.addItems(target, cxml.attributes.sidePair);
            }, this);
        }
    }
}