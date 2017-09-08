namespace fgui {

    export interface IColorableTitle {
        titleColor: number;
        fontSize: number;
    }

    export let isColorableTitle = function(obj:any): obj is IColorableTitle
    {
        return obj && "titleColor" in obj && "fontSize" in obj;
    }
}