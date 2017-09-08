namespace fgui.utils {

    export type UBBParserHandlerMap = {
        [key: string]: (tag: string, end: boolean, attr: string) => string
    }
    
    export class UBBParser {
        private $text: string;
        private $readPos: number = 0;

        protected $handlers: UBBParserHandlerMap;

        public smallFontSize: number = 12;
        public normalFontSize: number = 14;
        public largeFontSize: number = 16;

        public defaultImgWidth: number = 0;
        public defaultImgHeight: number = 0;

        public static inst: UBBParser = new UBBParser();

        public constructor() {
            this.$handlers = {
                url: this.onTag_URL,
                img: this.onTag_IMG,
                b: this.onTag_Simple,
                i: this.onTag_Simple,
                u: this.onTag_Simple,
                sup: this.onTag_Simple,
                sub: this.onTag_Simple,
                color: this.onTag_COLOR,
                font: this.onTag_FONT,
                size: this.onTag_SIZE
            };
        }

        protected onTag_URL(tagName: string, end: boolean, attr: string): string {
            if (!end) {
                if (attr != null)
                    return `<a href="${attr}" target="_blank">`;
                else {
                    let href: string = this.getTagText();
                    return `<a href="${href}" target="_blank">`;
                }
            }
            else
                return "</a>";
        }

        protected onTag_IMG(tagName: string, end: boolean, attr: string): string {
            if (!end) {
                let src: string = this.getTagText(true);
                if (!src)
                    return null;

                if (this.defaultImgWidth)
                    return `<img src="${src}" width="${this.defaultImgWidth}" height="${this.defaultImgHeight}"/>`;
                else
                    return `<img src="${src}"/>`;
            }
            else
                return null;
        }

        protected onTag_Simple(tagName: string, end: boolean, attr: string): string {
            return end ? `</${tagName}>` : `<${tagName}>`;
        }

        protected onTag_COLOR(tagName: string, end: boolean, attr: string): string {
            if (!end)
                return `<font color="${attr}">`;
            else
                return "</font>";
        }

        protected onTag_FONT(tagName: string, end: boolean, attr: string): string {
            if (!end)
                return `<font face="${attr}">`;
            else
                return "</font>";
        }

        protected onTag_SIZE(tagName: string, end: boolean, attr: string): string {
            if (!end) {
                if (attr == "normal")
                    attr = `${this.normalFontSize}`;
                else if (attr == "small")
                    attr = `${this.smallFontSize}`;
                else if (attr == "large")
                    attr = `${this.largeFontSize}`;
                else if (attr.length && attr.charAt(0) == "+")
                    attr = `${this.smallFontSize + parseInt(attr.substr(1))}`;
                else if (attr.length && attr.charAt(0) == "-")
                    attr = `${this.smallFontSize - parseInt(attr.substr(1))}`;
                return `<font size="${attr}">`;
            }
            else
                return "</font>";
        }

        protected getTagText(remove: boolean = false): string {
            let pos: number = this.$text.indexOf("[", this.$readPos);
            if (pos == -1)
                return null;

            let ret: string = this.$text.substring(this.$readPos, pos);
            if (remove)
                this.$readPos = pos;
            return ret;
        }

        //TODO: impl for GRichTextField
        public parseStyle(text: string): TextBlock[] {
            return [];
        }
    }
}