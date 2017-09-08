namespace fgui.utils {

    export class StringUtil {

        public static encodeHTML(str: string): string {
            if (!str)
                return "";
            else
                return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&apos;");
        }

        public static getFileName(source: string): string {
            let i: number = source.lastIndexOf("/");
            if (i != -1)
                source = source.substr(i + 1);
            i = source.lastIndexOf("\\");
            if (i != -1)
                source = source.substr(i + 1);
            i = source.lastIndexOf(".");
            if (i != -1)
                return source.substring(0, i);
            else
                return source;
        }

        public static startsWith(source: string, str: string, ignoreCase: boolean = false): boolean {
            if (!source)
                return false;
            else if (source.length < str.length)
                return false;
            else {
                source = source.substring(0, str.length);
                if (!ignoreCase)
                    return source == str;
                else
                    return source.toLowerCase() == str.toLowerCase();
            }
        }

        public static endsWith(source: string, str: string, ignoreCase: boolean = false): boolean {
            if (!source)
                return false;
            else if (source.length < str.length)
                return false;
            else {
                source = source.substring(source.length - str.length);
                if (!ignoreCase)
                    return source == str;
                else
                    return source.toLowerCase() == str.toLowerCase();
            }
        }

        public static trim(targetString: string): string {
            return StringUtil.trimLeft(StringUtil.trimRight(targetString));
        }

        public static trimLeft(targetString: string): string {
            let tempChar: string = "";
            let i:number;
            for (i = 0; i < targetString.length; i++) {
                tempChar = targetString.charAt(i);
                if (tempChar != " " && tempChar != "\n" && tempChar != "\r")
                    break;
            }
            return targetString.substr(i);
        }

        public static trimRight(targetString: string): string {
            let tempChar: string = "";
            let i:number;
            for (i = targetString.length - 1; i >= 0; i--) {
                tempChar = targetString.charAt(i);
                if (tempChar != " " && tempChar != "\n" && tempChar != "\r")
                    break;
            }
            return targetString.substring(0, i + 1);
        }

        public static convertToHtmlColor(argb: number, hasAlpha: boolean = false): string {
            let alpha: string;
            if (hasAlpha)
                alpha = (argb >> 24 & 0xFF).toString(16);
            else
                alpha = "";
            let red: string = (argb >> 16 & 0xFF).toString(16);
            let green: string = (argb >> 8 & 0xFF).toString(16);
            let blue: string = (argb & 0xFF).toString(16);
            if (alpha.length == 1)
                alpha = `0${alpha}`;
            if (red.length == 1)
                red = `0${red}`;
            if (green.length == 1)
                green = `0${green}`;
            if (blue.length == 1)
                blue = `0${blue}`;
            return `#${alpha}${red}${green}${blue}`;
        }

        public static convertFromHtmlColor(str: string, hasAlpha: boolean = false): number {
            if (str.length < 1)
                return 0;

            if (str.charAt(0) == "#")
                str = str.substr(1);

            if (str.length == 8)
                return (parseInt(str.substr(0, 2), 16) << 24) + parseInt(str.substr(2), 16);
            else if (hasAlpha)
                return 0xFF000000 + parseInt(str, 16);
            else
                return parseInt(str, 16);
        }

    }

}