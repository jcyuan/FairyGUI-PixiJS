namespace fgui {

    export class GLabel extends GComponent implements IColorableTitle {
        protected $titleObject: GObject;
        protected $iconObject: GObject;

        public constructor() {
            super();
        }

        public get icon(): string {
            if (this.$iconObject != null)
                return this.$iconObject.icon;
            return null;
        }

        public set icon(value: string) {
            if (this.$iconObject != null)
                this.$iconObject.icon = value;
            this.updateGear(GearType.Icon);
        }

        public get title(): string {
            if (this.$titleObject)
                return this.$titleObject.text;
            else
                return null;
        }

        public set title(value: string) {
            if (this.$titleObject)
                this.$titleObject.text = value;
            this.updateGear(GearType.Text);
        }

        public get text(): string {
            return this.title;
        }

        public set text(value: string) {
            this.title = value;
        }

        public get titleColor(): number {
            if(fgui.isColorableTitle(this.$titleObject))
                return this.$titleObject.titleColor;
            return 0;
        }

        public set titleColor(value: number) {
            if(fgui.isColorableTitle(this.$titleObject))
                this.$titleObject.titleColor = value;
        }

        public get fontSize(): number {
            if(fgui.isColorableTitle(this.$titleObject))
                return this.$titleObject.fontSize;
            return 0;
        }

        public set fontSize(value: number) {
            if(fgui.isColorableTitle(this.$titleObject))
                this.$titleObject.fontSize = value;
        }
        
        public set editable(val: boolean) {
            if (this.$titleObject)
                (this.$titleObject as GTextInput).editable = val;
        }

        public get editable(): boolean {
            if (this.$titleObject && (this.$titleObject instanceof GTextInput))
                return (this.$titleObject as GTextInput).editable;
            else
                return false;
        }

        protected constructFromXML(xml: utils.XmlNode): void {
            super.constructFromXML(xml);

            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);

            let cs = utils.XmlParser.getChildNodes(xml, "Label");
            if (cs && cs.length > 0) {
                xml = cs[0];

                let str: string;
                str = xml.attributes.title;
                if (str)
                    this.text = str;
                str = xml.attributes.icon;
                if (str)
                    this.icon = str;

                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = utils.StringUtil.convertFromHtmlColor(str);

                if (this.$titleObject instanceof GTextInput) {
                    str = xml.attributes.prompt;
                    let ti = this.$titleObject as GTextInput;
                    if (str)
                        ti.promptText = str;
                    str = xml.attributes.maxLength;
                    if (str)
                        ti.maxLength = parseInt(str);
                    str = xml.attributes.restrict;
                    if (str)
                        ti.restrict = str;
                    str = xml.attributes.password;
                    if (str)
                        ti.password = str == "true";
                }
            }
        }
    }
}