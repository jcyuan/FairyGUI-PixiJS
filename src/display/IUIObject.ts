namespace fgui {
    export interface IUIObject {
        UIOwner:GObject;
    }

    export let isUIObject = function(obj:any): obj is IUIObject {
        return obj && "UIOwner" in obj && obj.UIOwner != null;
    }
}
