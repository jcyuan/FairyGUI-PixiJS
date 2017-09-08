namespace fgui {

    export interface IAnimationGear {
        playing: boolean;
        frame: number;
    }

    export let isAnimationGear = function(obj:any): obj is IAnimationGear
    {
        return obj && "playing" in obj && "frame" in obj;
    }
}