namespace fgui {
    
        let win:any = window;
        let hasPointer = !!(win.PointerEvent || win.MSPointerEvent);
        let hasTouch = 'ontouchstart' in window && PIXI.utils.isMobile.any;

        export type IndexedObject = { [key:string]: any };
    
        export class InteractiveEvents {
            public static Down:string = hasPointer ? "pointerdown" : hasTouch ? "touchstart" : "mousedown";
            public static Cancel:string = hasPointer ? "pointercancel" : hasTouch ? "touchcancel" : "mousecancel";
            public static Up:string = hasPointer ? "pointerup" : hasTouch ? "touchend" : "mouseup";
            public static Click:string = hasPointer ? "pointertap" : hasTouch ? "tap" : "click";
            public static UpOutside:string = hasPointer ? "pointerupoutside" : hasTouch ? "touchendoutside" : "mouseupoutside";
            public static Move:string = hasPointer ? "pointermove" : hasTouch ? "touchmove" : "mousemove";
            public static Over:string = hasPointer ? "pointerover" : hasTouch ? null : "mouseover";
            public static Out:string = hasPointer ? "pointerout" : hasTouch ?  null : "mouseout";
            //mouse only
            public static RightDown = "rightdown";
            public static RightUp = "rightup";
            public static RightClick = "rightclick";
            public static RightUpOutside = "rightupoutside";
        }
    
        export const enum GearType {
            Display = 0,
            XY,
            Size,
            Look,
            Color,
            Animation,
            Text,
            Icon,
    
            Count  //helper member
        };
    
        export type GearNameMap = {
            [key: string]: number
        };
        export let GearXMLNodeNameMap: GearNameMap = {
            "gearDisplay": 0,
            "gearXY": 1,
            "gearSize": 2,
            "gearLook": 3,
            "gearColor": 4,
            "gearAni": 5,
            "gearText": 6,
            "gearIcon": 7
        };
    
        export let BlendModeMap: string[] = [
            "Normal",      //  NORMAL
            "Add",         //  ADD
            "Multiply",    //  MULTIPLY
            "Screen",      //  SCREEN
            "Overlay",     //  OVERLAY
            "Darken",      //  DARKEN
            "Lighten",     //  LIGHTEN
            "ColorDodge",  //  COLOR_DODGE
            "ColorBurn",   //  COLOR_BURN
            "HardLight",   //  HARD_LIGHT
            "SoftLight",   //  SOFT_LIGHT
            "Difference",  //  DIFFERENCE
            "Exclusion",   //  EXCLUSION
            "Hue",         //  HUE
            "Saturation",  //  SATURATION
            "Color",       //  COLOR
            "Luminosity",  //  LUMINOSITY
            "NormalNPM",   //  NORMAL_NPM
            "AddNPM",      //  ADD_NPM
            "ScreenNPM"    //  SCREEN_NPM
        ];
    
        export const enum ScrollPaneFlags {
            DisplayOnLeft = 1,
            SnapToItem = 1 << 1,
            DisplayOnDemand = 1 << 2,
            PageMode = 1 << 3,
            TouchEffect = 1 << 4,
            DisableTouchEffect = 1 << 5,
            BounceEffect = 1 << 6,
            DisableBounceEffect = 1 << 7,
            DisableInertia = 1 << 8,
            DisableScissorRect = 1 << 9
        };
    
        export const enum PopupDirection { Auto, Down, Up };
        export const enum ScrollBarDisplayType { Default, Visible, Auto, Hidden };
        export const enum OverflowType { Visible, Hidden, Scroll, Scale, ScaleFree };
        export const enum ScrollType { Horizontal, Vertical, Both };
        export const enum ButtonMode { Common, Check, Radio };
        export const enum AutoSizeType { None, Both, Height, Shrink };
        export const enum AlignType { Left = "left", Center = "center", Right = "right" };
        export const enum VertAlignType { Top, Middle, Bottom };
        export const enum LoaderFillType { None, Scale, ScaleMatchHeight, ScaleMatchWidth, ScaleFree, ScaleNoBorder };
        export const enum ListLayoutType { SingleColumn, SingleRow, FlowHorizontal, FlowVertical, Pagination };
        export const enum ListSelectionMode { Single, Multiple, Multiple_SingleClick, None };
        export const enum PackageItemType { Image, Swf, MovieClip, Sound, Component, Misc, Font, Atlas };
        export const enum ProgressTitleType { Percent, ValueAndMax, Value, Max };

        export const enum Keys {
            Up = 38,
            Down = 40,
            Left = 37,
            Right = 39,
            Shift = 16,
            Alt = 18,
            Ctrl = 17
        };
    
        export const enum FlipType { None, Horizontal, Vertical, Both };

        export const enum TextureFillMode {
            NONE,
            HORZ,         //begin from: L, R
            VERT,         //begin from: T, B
            DEG90,        //begin from: LT, RT, LB, RB
            DEG180,       //begin from: L, R, T, B
            DEG360        //begin from: L, R, T, B
        }
    
        export const enum TextureFillBegin {
            L,
            R,
            T,
            B,
            LT,
            RT,
            LB,
            RB
        }
    
        export const enum TextureFillDirection {  //for deg item only
            CW,
            CCW
        }
    
        export const enum RelationType {
            Left_Left = 0,
            Left_Center = 1,
            Left_Right = 2,
            Center_Center = 3,
            Right_Left = 4,
            Right_Center = 5,
            Right_Right = 6,
    
            Top_Top = 7,
            Top_Middle = 8,
            Top_Bottom = 9,
            Middle_Middle = 10,
            Bottom_Top = 11,
            Bottom_Middle = 12,
            Bottom_Bottom = 13,
    
            Width = 14,
            Height = 15,
    
            LeftExt_Left = 16,
            LeftExt_Right = 17,
            RightExt_Left = 18,
            RightExt_Right = 19,
            TopExt_Top = 20,
            TopExt_Bottom = 21,
            BottomExt_Top = 22,
            BottomExt_Bottom = 23,
    
            Size = 24
        };

        export const enum ListChildrenRenderOrder {
            Ascent = 0,
            Descent = 1,
            Arch = 2
        };
    
        export function ParseOverflowType(value: string): OverflowType {
            switch (value) {
                case "visible":
                    return OverflowType.Visible;
                case "hidden":
                    return OverflowType.Hidden;
                case "scroll":
                    return OverflowType.Scroll;
                case "scale":
                    return OverflowType.Scale;
                case "scaleFree":
                    return OverflowType.ScaleFree;
                default:
                    return OverflowType.Visible;
            }
        }
    
        export function ParseScrollType(value: string): ScrollType {
            switch (value) {
                case "horizontal":
                    return ScrollType.Horizontal;
                case "vertical":
                    return ScrollType.Vertical;
                case "both":
                    return ScrollType.Both;
                default:
                    return ScrollType.Vertical;
            }
        }
    
        export function ParseLoaderFillType(value: string): LoaderFillType {
            switch (value) {
                case "none":
                    return LoaderFillType.None;
                case "scale":
                    return LoaderFillType.Scale;
                case "scaleMatchHeight":
                    return LoaderFillType.ScaleMatchHeight;
                case "scaleMatchWidth":
                    return LoaderFillType.ScaleMatchWidth;
                case "scaleFree":
                    return LoaderFillType.ScaleFree;
                case "scaleNoBorder":
                    return LoaderFillType.ScaleNoBorder;
                default:
                    return LoaderFillType.None;
            }
        }
    
        export function ParseListLayoutType(value: string): ListLayoutType {
            switch (value) {
                case "column":
                    return ListLayoutType.SingleColumn;
                case "row":
                    return ListLayoutType.SingleRow;
                case "flow_hz":
                    return ListLayoutType.FlowHorizontal;
                case "flow_vt":
                    return ListLayoutType.FlowVertical;
                case "pagination":
                    return ListLayoutType.Pagination;
                default:
                    return ListLayoutType.SingleColumn;
            }
        }
    
        export function ParseListSelectionMode(value: string): ListSelectionMode {
            switch (value) {
                case "single":
                    return ListSelectionMode.Single;
                case "multiple":
                    return ListSelectionMode.Multiple;
                case "multipleSingleClick":
                    return ListSelectionMode.Multiple_SingleClick;
                case "none":
                    return ListSelectionMode.None;
                default:
                    return ListSelectionMode.Single;
            }
        }
    
        export function ParsePackageItemType(value: string): PackageItemType {
            switch (value) {
                case "image":
                    return PackageItemType.Image;
                case "movieclip":
                    return PackageItemType.MovieClip;
                case "sound":
                    return PackageItemType.Sound;
                case "component":
                    return PackageItemType.Component;
                case "swf":
                    return PackageItemType.Swf;
                case "font":
                    return PackageItemType.Font;
                case "atlas":
                    return PackageItemType.Atlas;
                default:
                    return PackageItemType.Misc;
            }
        }
    
        export function ParseProgressTitleType(value: string): ProgressTitleType {
            switch (value) {
                case "percent":
                    return ProgressTitleType.Percent;
                case "valueAndmax":
                    return ProgressTitleType.ValueAndMax;
                case "value":
                    return ProgressTitleType.Value;
                case "max":
                    return ProgressTitleType.Max;
                default:
                    return ProgressTitleType.Percent;
            }
        }
    
        export function ParseScrollBarDisplayType(value: string): ScrollBarDisplayType {
            switch (value) {
                case "default":
                    return ScrollBarDisplayType.Default;
                case "visible":
                    return ScrollBarDisplayType.Visible;
                case "auto":
                    return ScrollBarDisplayType.Auto;
                case "hidden":
                    return ScrollBarDisplayType.Hidden;
                default:
                    return ScrollBarDisplayType.Default;
            }
        }
    
        export function ParseFlipType(value: string): FlipType {
            switch (value) {
                case "hz":
                    return FlipType.Horizontal;
                case "vt":
                    return FlipType.Vertical;
                case "both":
                    return FlipType.Both;
                default:
                    return FlipType.None;
            }
        }
    
        export function ParseButtonMode(value: string): ButtonMode {
            switch (value) {
                case "Common":
                    return ButtonMode.Common;
                case "Check":
                    return ButtonMode.Check;
                case "Radio":
                    return ButtonMode.Radio;
                default:
                    return ButtonMode.Common;
            }
        }
    
        export function ParseAutoSizeType(value: string): AutoSizeType {
            switch (value) {
                case "none":
                    return AutoSizeType.None;
                case "both":
                    return AutoSizeType.Both;
                case "height":
                    return AutoSizeType.Height;
                case "shrink":
                    return AutoSizeType.Shrink;
                default:
                    return AutoSizeType.None;
            }
        }
    
        export function ParseAlignType(value: string): AlignType {
            switch (value) {
                case "left":
                    return AlignType.Left;
                case "center":
                    return AlignType.Center;
                case "right":
                    return AlignType.Right;
                default:
                    return AlignType.Left;
            }
        }
    
        export function ParseVertAlignType(value: string): VertAlignType {
            switch (value) {
                case "top":
                    return VertAlignType.Top;
                case "middle":
                    return VertAlignType.Middle;
                case "bottom":
                    return VertAlignType.Bottom;
                default:
                    return VertAlignType.Top;
            }
        }

        export function ParseListChildrenRenderOrder(value:string):ListChildrenRenderOrder {
			switch (value)
			{
				case "ascent":
					return ListChildrenRenderOrder.Ascent;
				case "descent":
					return ListChildrenRenderOrder.Descent;
				case "arch":
					return ListChildrenRenderOrder.Arch;
				default:
					return ListChildrenRenderOrder.Ascent;
			}
		}
    
        type EaseTypeDictionary = {
            [key: string]: (t: number) => number
        }
    
        let easeMap: EaseTypeDictionary = {
            "Linear": createjs.Ease.linear,
            "Elastic.In": createjs.Ease.elasticIn,
            "Elastic.Out": createjs.Ease.elasticOut,
            "Elastic.InOut": createjs.Ease.elasticInOut,
            "Quad.In": createjs.Ease.quadIn,
            "Quad.Out": createjs.Ease.quadOut,
            "Quad.InOut": createjs.Ease.quadInOut,
            "Cube.In": createjs.Ease.cubicIn,
            "Cube.Out": createjs.Ease.cubicOut,
            "Cube.InOut": createjs.Ease.cubicInOut,
            "Quart.In": createjs.Ease.quartIn,
            "Quart.Out": createjs.Ease.quartOut,
            "Quart.InOut": createjs.Ease.quartInOut,
            "Quint.In": createjs.Ease.quintIn,
            "Quint.Out": createjs.Ease.quintOut,
            "Quint.InOut": createjs.Ease.quintInOut,
            "Sine.In": createjs.Ease.sineIn,
            "Sine.Out": createjs.Ease.sineOut,
            "Sine.InOut": createjs.Ease.sineInOut,
            "Bounce.In": createjs.Ease.bounceIn,
            "Bounce.Out": createjs.Ease.bounceOut,
            "Bounce.InOut": createjs.Ease.bounceInOut,
            "Circ.In": createjs.Ease.circIn,
            "Circ.Out": createjs.Ease.circOut,
            "Circ.InOut": createjs.Ease.circInOut,
            "Expo.In": createjs.Ease.quartIn,
            "Expo.Out": createjs.Ease.quartOut,
            "Expo.InOut": createjs.Ease.quartInOut,
            "Back.In": createjs.Ease.backIn,
            "Back.Out": createjs.Ease.backOut,
            "Back.InOut": createjs.Ease.backInOut
        };
    
        export function ParseEaseType(name: string): (t: number) => number {
            return easeMap[name] || easeMap["Linear"];
        }
    }
    