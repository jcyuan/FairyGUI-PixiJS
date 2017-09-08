namespace fgui {

    export interface IColorGear {
        color: number;
    }

    export let isColorGear = function(obj:any): obj is IColorGear
    {
        return obj && "color" in obj;
    }
}