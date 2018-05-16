"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fgui;
(function (fgui) {
    var win = window;
    var hasPointer = !!(win.PointerEvent || win.MSPointerEvent);
    var hasTouch = 'ontouchstart' in window && PIXI.utils.isMobile.any;
    var InteractiveEvents = (function () {
        function InteractiveEvents() {
        }
        InteractiveEvents.Down = hasPointer ? "pointerdown" : hasTouch ? "touchstart" : "mousedown";
        InteractiveEvents.Cancel = hasPointer ? "pointercancel" : hasTouch ? "touchcancel" : "mousecancel";
        InteractiveEvents.Up = hasPointer ? "pointerup" : hasTouch ? "touchend" : "mouseup";
        InteractiveEvents.Click = hasPointer ? "pointertap" : hasTouch ? "tap" : "click";
        InteractiveEvents.UpOutside = hasPointer ? "pointerupoutside" : hasTouch ? "touchendoutside" : "mouseupoutside";
        InteractiveEvents.Move = hasPointer ? "pointermove" : hasTouch ? "touchmove" : "mousemove";
        InteractiveEvents.Over = hasPointer ? "pointerover" : hasTouch ? null : "mouseover";
        InteractiveEvents.Out = hasPointer ? "pointerout" : hasTouch ? null : "mouseout";
        //mouse only
        InteractiveEvents.RightDown = "rightdown";
        InteractiveEvents.RightUp = "rightup";
        InteractiveEvents.RightClick = "rightclick";
        InteractiveEvents.RightUpOutside = "rightupoutside";
        return InteractiveEvents;
    }());
    fgui.InteractiveEvents = InteractiveEvents;
    ;
    fgui.GearXMLNodeNameMap = {
        "gearDisplay": 0,
        "gearXY": 1,
        "gearSize": 2,
        "gearLook": 3,
        "gearColor": 4,
        "gearAni": 5,
        "gearText": 6,
        "gearIcon": 7
    };
    fgui.BlendModeMap = [
        "Normal",
        "Add",
        "Multiply",
        "Screen",
        "Overlay",
        "Darken",
        "Lighten",
        "ColorDodge",
        "ColorBurn",
        "HardLight",
        "SoftLight",
        "Difference",
        "Exclusion",
        "Hue",
        "Saturation",
        "Color",
        "Luminosity",
        "NormalNPM",
        "AddNPM",
        "ScreenNPM" //  SCREEN_NPM
    ];
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    function ParseOverflowType(value) {
        switch (value) {
            case "visible":
                return 0 /* Visible */;
            case "hidden":
                return 1 /* Hidden */;
            case "scroll":
                return 2 /* Scroll */;
            case "scale":
                return 3 /* Scale */;
            case "scaleFree":
                return 4 /* ScaleFree */;
            default:
                return 0 /* Visible */;
        }
    }
    fgui.ParseOverflowType = ParseOverflowType;
    function ParseScrollType(value) {
        switch (value) {
            case "horizontal":
                return 0 /* Horizontal */;
            case "vertical":
                return 1 /* Vertical */;
            case "both":
                return 2 /* Both */;
            default:
                return 1 /* Vertical */;
        }
    }
    fgui.ParseScrollType = ParseScrollType;
    function ParseLoaderFillType(value) {
        switch (value) {
            case "none":
                return 0 /* None */;
            case "scale":
                return 1 /* Scale */;
            case "scaleMatchHeight":
                return 2 /* ScaleMatchHeight */;
            case "scaleMatchWidth":
                return 3 /* ScaleMatchWidth */;
            case "scaleFree":
                return 4 /* ScaleFree */;
            default:
                return 0 /* None */;
        }
    }
    fgui.ParseLoaderFillType = ParseLoaderFillType;
    function ParseListLayoutType(value) {
        switch (value) {
            case "column":
                return 0 /* SingleColumn */;
            case "row":
                return 1 /* SingleRow */;
            case "flow_hz":
                return 2 /* FlowHorizontal */;
            case "flow_vt":
                return 3 /* FlowVertical */;
            case "pagination":
                return 4 /* Pagination */;
            default:
                return 0 /* SingleColumn */;
        }
    }
    fgui.ParseListLayoutType = ParseListLayoutType;
    function ParseListSelectionMode(value) {
        switch (value) {
            case "single":
                return 0 /* Single */;
            case "multiple":
                return 1 /* Multiple */;
            case "multipleSingleClick":
                return 2 /* Multiple_SingleClick */;
            case "none":
                return 3 /* None */;
            default:
                return 0 /* Single */;
        }
    }
    fgui.ParseListSelectionMode = ParseListSelectionMode;
    function ParsePackageItemType(value) {
        switch (value) {
            case "image":
                return 0 /* Image */;
            case "movieclip":
                return 2 /* MovieClip */;
            case "sound":
                return 3 /* Sound */;
            case "component":
                return 4 /* Component */;
            case "swf":
                return 1 /* Swf */;
            case "font":
                return 6 /* Font */;
            case "atlas":
                return 7 /* Atlas */;
            default:
                return 5 /* Misc */;
        }
    }
    fgui.ParsePackageItemType = ParsePackageItemType;
    function ParseProgressTitleType(value) {
        switch (value) {
            case "percent":
                return 0 /* Percent */;
            case "valueAndmax":
                return 1 /* ValueAndMax */;
            case "value":
                return 2 /* Value */;
            case "max":
                return 3 /* Max */;
            default:
                return 0 /* Percent */;
        }
    }
    fgui.ParseProgressTitleType = ParseProgressTitleType;
    function ParseScrollBarDisplayType(value) {
        switch (value) {
            case "default":
                return 0 /* Default */;
            case "visible":
                return 1 /* Visible */;
            case "auto":
                return 2 /* Auto */;
            case "hidden":
                return 3 /* Hidden */;
            default:
                return 0 /* Default */;
        }
    }
    fgui.ParseScrollBarDisplayType = ParseScrollBarDisplayType;
    function ParseFlipType(value) {
        switch (value) {
            case "hz":
                return 1 /* Horizontal */;
            case "vt":
                return 2 /* Vertical */;
            case "both":
                return 3 /* Both */;
            default:
                return 0 /* None */;
        }
    }
    fgui.ParseFlipType = ParseFlipType;
    function ParseButtonMode(value) {
        switch (value) {
            case "Common":
                return 0 /* Common */;
            case "Check":
                return 1 /* Check */;
            case "Radio":
                return 2 /* Radio */;
            default:
                return 0 /* Common */;
        }
    }
    fgui.ParseButtonMode = ParseButtonMode;
    function ParseAutoSizeType(value) {
        switch (value) {
            case "none":
                return 0 /* None */;
            case "both":
                return 1 /* Both */;
            case "height":
                return 2 /* Height */;
            case "shrink":
                return 3 /* Shrink */;
            default:
                return 0 /* None */;
        }
    }
    fgui.ParseAutoSizeType = ParseAutoSizeType;
    function ParseAlignType(value) {
        switch (value) {
            case "left":
                return "left" /* Left */;
            case "center":
                return "center" /* Center */;
            case "right":
                return "right" /* Right */;
            default:
                return "left" /* Left */;
        }
    }
    fgui.ParseAlignType = ParseAlignType;
    function ParseVertAlignType(value) {
        switch (value) {
            case "top":
                return 0 /* Top */;
            case "middle":
                return 1 /* Middle */;
            case "bottom":
                return 2 /* Bottom */;
            default:
                return 0 /* Top */;
        }
    }
    fgui.ParseVertAlignType = ParseVertAlignType;
    function ParseListChildrenRenderOrder(value) {
        switch (value) {
            case "ascent":
                return 0 /* Ascent */;
            case "descent":
                return 1 /* Descent */;
            case "arch":
                return 2 /* Arch */;
            default:
                return 0 /* Ascent */;
        }
    }
    fgui.ParseListChildrenRenderOrder = ParseListChildrenRenderOrder;
    var easeMap = {
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
    function ParseEaseType(name) {
        return easeMap[name] || easeMap["linear"];
    }
    fgui.ParseEaseType = ParseEaseType;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GObject = (function () {
        function GObject() {
            this.$x = 0;
            this.$y = 0;
            this.$width = 0;
            this.$height = 0;
            this.$alpha = 1;
            this.$rotation = 0;
            this.$visible = true;
            this.$touchable = true;
            this.$grayed = false;
            this.$draggable = false;
            this.$scaleX = 1;
            this.$scaleY = 1;
            this.$skewX = 0;
            this.$skewY = 0;
            this.$pivot = new PIXI.Point();
            this.$pivotAsAnchor = false;
            this.$pivotOffset = new PIXI.Point();
            this.$sortingOrder = 0;
            this.$internalVisible = true;
            this.$focusable = false;
            this.$pixelSnapping = false;
            this.$handlingController = false;
            this.$lastColorComponents = null;
            /**@internal */
            this.$rawWidth = 0;
            /**@internal */
            this.$rawHeight = 0;
            /**@internal */
            this.$initWidth = 0;
            /**@internal */
            this.$initHeight = 0;
            this.$sourceWidth = 0;
            this.$sourceHeight = 0;
            this.$id = "" + GObject.gInstanceCounter++;
            this.$name = "";
            this.createDisplayObject();
            this.$relations = new fgui.Relations(this);
            this.$gears = [];
        }
        Object.defineProperty(GObject.prototype, "id", {
            get: function () {
                return this.$id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "name", {
            get: function () {
                return this.$name;
            },
            set: function (value) {
                this.$name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "x", {
            get: function () {
                return this.$x;
            },
            set: function (value) {
                this.setXY(value, this.$y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "y", {
            get: function () {
                return this.$y;
            },
            set: function (value) {
                this.setXY(this.$x, value);
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.setXY = function (xv, yv) {
            if (this.$x != xv || this.$y != yv) {
                this.$x = xv;
                this.$y = yv;
                this.handleXYChanged();
                this.updateGear(1 /* XY */);
                if (this.$parent) {
                    this.$parent.setBoundsChangedFlag();
                    this.$displayObject.emit("__xyChanged" /* XY_CHANGED */, this);
                }
                if (GObject.draggingObject == this && !GObject.sUpdatingWhileDragging)
                    this.localToGlobalRect(0, 0, this.width, this.height, GObject.sGlobalRect);
            }
        };
        Object.defineProperty(GObject.prototype, "pixelSnapping", {
            get: function () {
                return this.$pixelSnapping;
            },
            set: function (value) {
                if (this.$pixelSnapping != value) {
                    this.$pixelSnapping = value;
                    this.handleXYChanged();
                }
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.center = function (restraint) {
            if (restraint === void 0) { restraint = false; }
            var r;
            if (this.$parent != null)
                r = this.parent;
            else
                r = this.root;
            this.setXY((r.width - this.width) / 2, (r.height - this.height) / 2);
            if (restraint) {
                this.addRelation(r, 3 /* Center_Center */);
                this.addRelation(r, 10 /* Middle_Middle */);
            }
        };
        Object.defineProperty(GObject.prototype, "width", {
            get: function () {
                this.ensureSizeCorrect();
                if (this.$relations.sizeDirty)
                    this.$relations.ensureRelationsSizeCorrect();
                return this.$width;
            },
            set: function (value) {
                this.setSize(value, this.$rawHeight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "height", {
            get: function () {
                this.ensureSizeCorrect();
                if (this.$relations.sizeDirty)
                    this.$relations.ensureRelationsSizeCorrect();
                return this.$height;
            },
            set: function (value) {
                this.setSize(this.$rawWidth, value);
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.setSize = function (wv, hv, ignorePivot) {
            if (ignorePivot === void 0) { ignorePivot = false; }
            if (this.$rawWidth != wv || this.$rawHeight != hv) {
                this.$rawWidth = wv;
                this.$rawHeight = hv;
                wv = Math.max(0, wv);
                hv = Math.max(0, hv);
                var diffw = wv - this.mapPivotWidth(1);
                var diffh = hv - this.mapPivotHeight(1);
                this.$width = wv;
                this.$height = hv;
                this.handleSizeChanged();
                if (this.$pivot.x != 0 || this.$pivot.y != 0) {
                    if (!this.$pivotAsAnchor) {
                        if (!ignorePivot)
                            this.setXY(this.x - this.$pivot.x * diffw, this.y - this.$pivot.y * diffh);
                        this.updatePivotOffset();
                    }
                    else
                        this.applyPivot();
                }
                this.updateGear(2 /* Size */);
                if (this.$parent) {
                    this.$relations.onOwnerSizeChanged(diffw, diffh);
                    this.$parent.setBoundsChangedFlag();
                }
                this.$displayObject.emit("__sizeChanged" /* SIZE_CHANGED */, this);
            }
        };
        GObject.prototype.ensureSizeCorrect = function () {
        };
        Object.defineProperty(GObject.prototype, "sourceHeight", {
            get: function () {
                return this.$sourceHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "sourceWidth", {
            get: function () {
                return this.$sourceWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "initHeight", {
            get: function () {
                return this.$initHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "initWidth", {
            get: function () {
                return this.$initWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "actualWidth", {
            get: function () {
                return this.width * Math.abs(this.$scaleX);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "actualHeight", {
            get: function () {
                return this.height * Math.abs(this.$scaleY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "scaleX", {
            get: function () {
                return this.$scaleX;
            },
            set: function (value) {
                this.setScale(value, this.$scaleY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "scaleY", {
            get: function () {
                return this.$scaleY;
            },
            set: function (value) {
                this.setScale(this.$scaleX, value);
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.setScale = function (sx, sy) {
            if (this.$scaleX != sx || this.$scaleY != sy) {
                this.$scaleX = sx;
                this.$scaleY = sy;
                this.handleScaleChanged();
                this.applyPivot();
                this.updateGear(2 /* Size */);
            }
        };
        Object.defineProperty(GObject.prototype, "skewX", {
            get: function () {
                return this.$skewX;
            },
            set: function (value) {
                this.setSkew(value, this.$skewY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "skewY", {
            get: function () {
                return this.$skewY;
            },
            set: function (value) {
                this.setSkew(this.$skewX, value);
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.setSkew = function (xv, yv) {
            if (this.$skewX != xv || this.$skewY != yv) {
                this.$skewX = xv;
                this.$skewY = yv;
                this.$displayObject.skew.set(xv * -fgui.utils.NumberUtil.RADIAN, yv * fgui.utils.NumberUtil.RADIAN);
                this.applyPivot();
            }
        };
        GObject.prototype.mapPivotWidth = function (scale) {
            return scale * this.$width;
        };
        GObject.prototype.mapPivotHeight = function (scale) {
            return scale * this.$height;
        };
        Object.defineProperty(GObject.prototype, "pivotX", {
            get: function () {
                return this.$pivot.x;
            },
            set: function (value) {
                this.setPivot(value, this.pivotY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "pivotY", {
            get: function () {
                return this.$pivot.y;
            },
            set: function (value) {
                this.setPivot(this.pivotX, value);
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.setPivot = function (xv, yv, asAnchor) {
            if (asAnchor === void 0) { asAnchor = false; }
            if (this.$pivot.x != xv || this.$pivot.y != yv || this.$pivotAsAnchor != asAnchor) {
                this.$pivot.set(xv, yv);
                this.$pivotAsAnchor = asAnchor;
                this.updatePivotOffset();
                this.handleXYChanged();
            }
        };
        GObject.prototype.internalSetPivot = function (xv, yv, asAnchor) {
            this.$pivot.set(xv, yv);
            this.$pivotAsAnchor = asAnchor;
            if (asAnchor)
                this.handleXYChanged();
        };
        GObject.prototype.updatePivotOffset = function () {
            if (this.$pivot.x != 0 || this.$pivot.y != 0 && this.$displayObject.transform) {
                var vx = this.mapPivotWidth(this.$pivot.x), vy = this.mapPivotHeight(this.$pivot.y);
                GObject.sHelperPoint.set(vx, vy);
                this.$displayObject.transform.updateLocalTransform(); //TODO: sync with PIXI instead of update actively
                var trans = this.$displayObject.localTransform;
                var p = trans.apply(GObject.sHelperPoint, GObject.sHelperPoint);
                p.x -= trans.tx, p.y -= trans.ty;
                this.$pivotOffset.set(this.$pivot.x * this.$width - p.x, this.$pivot.y * this.$height - p.y);
            }
            else
                this.$pivotOffset.set(0, 0);
        };
        GObject.prototype.applyPivot = function () {
            if (this.$pivot.x != 0 || this.$pivot.y != 0) {
                this.updatePivotOffset();
                this.handleXYChanged();
            }
        };
        Object.defineProperty(GObject.prototype, "touchable", {
            get: function () {
                return this.$touchable;
            },
            set: function (value) {
                this.$touchable = value;
                this.$displayObject.interactive = this.$touchable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "grayed", {
            get: function () {
                return this.$grayed;
            },
            set: function (value) {
                if (this.$grayed != value) {
                    this.$grayed = value;
                    this.handleGrayedChanged();
                    this.updateGear(3 /* Look */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "enabled", {
            get: function () {
                return !this.$grayed && this.$touchable;
            },
            set: function (value) {
                this.grayed = !value;
                this.touchable = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "rotation", {
            get: function () {
                return this.$rotation;
            },
            set: function (value) {
                if (this.$rotation != value) {
                    this.$rotation = value;
                    if (this.$displayObject)
                        this.$displayObject.rotation = fgui.utils.NumberUtil.angleToRadian(this.normalizeRotation);
                    this.applyPivot();
                    this.updateGear(3 /* Look */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "normalizeRotation", {
            get: function () {
                var rot = this.$rotation % 360;
                if (rot > 180)
                    rot -= 360;
                else if (rot < -180)
                    rot += 360;
                return rot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "alpha", {
            get: function () {
                return this.$alpha;
            },
            set: function (value) {
                if (this.$alpha != value) {
                    this.$alpha = value;
                    this.updateAlpha();
                }
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.updateAlpha = function () {
            if (this.$displayObject)
                this.$displayObject.alpha = this.$alpha;
            this.updateGear(3 /* Look */);
        };
        Object.defineProperty(GObject.prototype, "visible", {
            get: function () {
                return this.$visible;
            },
            set: function (value) {
                if (this.$visible != value) {
                    this.$visible = value;
                    if (this.$displayObject)
                        this.$displayObject.visible = this.$visible;
                    if (this.$parent) {
                        this.$parent.childStateChanged(this);
                        this.$parent.setBoundsChangedFlag();
                    }
                    this.emit("__visibleChanged" /* VISIBLE_CHANGED */, this.$visible, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "internalVisible", {
            /**@internal */
            get: function () {
                return this.$internalVisible;
            },
            /**@internal */
            set: function (value) {
                if (value != this.$internalVisible) {
                    this.$internalVisible = value;
                    if (this.$parent)
                        this.$parent.childStateChanged(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "finalVisible", {
            get: function () {
                return this.$visible && this.$internalVisible && (!this.$group || this.$group.finalVisible);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "sortingOrder", {
            get: function () {
                return this.$sortingOrder;
            },
            set: function (value) {
                if (value < 0)
                    value = 0;
                if (this.$sortingOrder != value) {
                    var old = this.$sortingOrder;
                    this.$sortingOrder = value;
                    if (this.$parent != null)
                        this.$parent.childSortingOrderChanged(this, old, this.$sortingOrder);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "focusable", {
            get: function () {
                return this.$focusable;
            },
            set: function (value) {
                this.$focusable = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "focused", {
            get: function () {
                return this.root.focus == this;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.requestFocus = function () {
            var p = this;
            while (p && !p.$focusable)
                p = p.parent;
            if (p != null)
                this.root.focus = p;
        };
        Object.defineProperty(GObject.prototype, "tooltips", {
            get: function () {
                return this.$tooltips;
            },
            set: function (value) {
                this.$tooltips = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "blendMode", {
            get: function () {
                if (this.$displayObject && this.$displayObject instanceof PIXI.Sprite)
                    return fgui.BlendModeMap[this.$displayObject.blendMode] || "None";
                return fgui.BlendModeMap[0]; //Normal
            },
            set: function (value) {
                if (!value || !value.length || !this.$displayObject || !(this.$displayObject instanceof PIXI.Sprite))
                    return;
                for (var i = 0; i < fgui.BlendModeMap.length; i++) {
                    if (fgui.BlendModeMap[i].toLowerCase() === value.toLowerCase()) {
                        this.$displayObject.blendMode = i;
                        return;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "filters", {
            get: function () {
                return this.$displayObject.filters;
            },
            set: function (value) {
                this.$displayObject.filters = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "inContainer", {
            get: function () {
                return this.$displayObject.parent != null;
            },
            enumerable: true,
            configurable: true
        });
        GObject.isDisplayObjectOnStage = function (display) {
            if (!display || !display.parent)
                return false;
            var p = display;
            while (p != null) {
                if (p == fgui.GRoot.inst.nativeStage)
                    return true;
                p = p.parent;
            }
            return false;
        };
        Object.defineProperty(GObject.prototype, "onStage", {
            get: function () {
                return GObject.isDisplayObjectOnStage(this.$displayObject);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "resourceURL", {
            get: function () {
                if (this.packageItem != null)
                    return "{ui://" + this.packageItem.owner.id + this.packageItem.id;
                else
                    return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "group", {
            get: function () {
                return this.$group;
            },
            set: function (value) {
                this.$group = value;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.getGear = function (index) {
            var gear = this.$gears[index];
            if (gear == null) {
                switch (index) {
                    case 0 /* Display */:
                        gear = new fgui.GearDisplay(this);
                        break;
                    case 1 /* XY */:
                        gear = new fgui.GearXY(this);
                        break;
                    case 2 /* Size */:
                        gear = new fgui.GearSize(this);
                        break;
                    case 3 /* Look */:
                        gear = new fgui.GearLook(this);
                        break;
                    case 4 /* Color */:
                        if (fgui.isColorGear(this))
                            gear = new fgui.GearColor(this);
                        else
                            throw new Error("Invalid component type to add GearColor feature, please check the component named " + this.$name + " in the Editor.");
                        break;
                    case 5 /* Animation */:
                        if (fgui.isAnimationGear(this))
                            gear = new fgui.GearAnimation(this);
                        else
                            throw new Error("Invalid component type to add GearAnimation feature, please check the component named " + this.$name + " in the Editor.");
                        break;
                    case 6 /* Text */:
                        gear = new fgui.GearText(this);
                        break;
                    case 7 /* Icon */:
                        gear = new fgui.GearIcon(this);
                        break;
                    default:
                        throw new Error("FGUI: invalid gear type");
                }
                this.$gears[index] = gear;
            }
            return gear;
        };
        GObject.prototype.updateGear = function (index) {
            if (this.$gears[index] != null)
                this.$gears[index].updateState();
        };
        GObject.prototype.updateGearFromRelations = function (index, dx, dy) {
            if (this.$gears[index] != null)
                this.$gears[index].updateFromRelations(dx, dy);
        };
        GObject.prototype.hasGearController = function (index, c) {
            return this.$gears[index] && this.$gears[index].controller == c;
        };
        /**@internal */
        GObject.prototype.lockGearDisplay = function () {
            var g = this.$gears[0];
            if (g && g.controller) {
                var ret = g.lock();
                this.checkGearVisible();
                return ret;
            }
            else
                return 0;
        };
        /**@internal */
        GObject.prototype.releaseGearDisplay = function (token) {
            var g = this.$gears[0];
            if (g && g.controller) {
                g.release(token);
                this.checkGearVisible();
            }
        };
        GObject.prototype.checkGearVisible = function () {
            if (this.$handlingController)
                return;
            var g = this.$gears[0];
            var v = !g || g.connected;
            if (v != this.$internalVisible) {
                this.$internalVisible = v;
                if (this.$parent)
                    this.$parent.childStateChanged(this);
            }
        };
        Object.defineProperty(GObject.prototype, "gearXY", {
            get: function () {
                return this.getGear(1 /* XY */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "gearSize", {
            get: function () {
                return this.getGear(2 /* Size */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "gearLook", {
            get: function () {
                return this.getGear(3 /* Look */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "relations", {
            get: function () {
                return this.$relations;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.addRelation = function (target, relationType, usePercent) {
            if (usePercent === void 0) { usePercent = false; }
            this.$relations.add(target, relationType, usePercent);
        };
        GObject.prototype.removeRelation = function (target, relationType) {
            if (relationType === void 0) { relationType = 0; }
            this.$relations.remove(target, relationType);
        };
        Object.defineProperty(GObject.prototype, "displayObject", {
            get: function () {
                return this.$displayObject;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.createDisplayObject = function () {
        };
        GObject.prototype.setDisplayObject = function (value) {
            this.$displayObject = value;
        };
        Object.defineProperty(GObject.prototype, "parent", {
            get: function () {
                return this.$parent;
            },
            set: function (val) {
                this.$parent = val;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.removeFromParent = function () {
            if (this.$parent)
                this.$parent.removeChild(this);
        };
        Object.defineProperty(GObject.prototype, "root", {
            get: function () {
                if (this instanceof fgui.GRoot)
                    return this;
                var p = this.$parent;
                while (p) {
                    if (p instanceof fgui.GRoot)
                        return p;
                    p = p.parent;
                }
                return fgui.GRoot.inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "text", {
            /** @virtual */
            get: function () {
                return null;
            },
            /** @virtual */
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "icon", {
            /** @virtual */
            get: function () {
                return null;
            },
            /** @virtual */
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.dispose = function () {
            this.removeFromParent();
            this.$relations.dispose();
            this.removeAllListeners();
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$moving, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$end, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$moving2, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$end2, this);
            this.$displayObject.destroy();
        };
        GObject.prototype.click = function (listener, thisObj) {
            return this.on(fgui.InteractiveEvents.Click, listener, thisObj);
        };
        GObject.prototype.removeClick = function (listener, thisObj) {
            return this.off(fgui.InteractiveEvents.Click, listener, thisObj);
        };
        GObject.prototype.hasClick = function (fn) {
            return this.hasListener(fgui.InteractiveEvents.Click, fn);
        };
        GObject.prototype.on = function (type, listener, thisObject) {
            if (type == null)
                return this;
            this.$displayObject.on(type, listener, thisObject);
            return this;
        };
        GObject.prototype.off = function (type, listener, thisObject) {
            if (type == null)
                return this;
            if (this.$displayObject.listeners(type, true))
                this.$displayObject.off(type, listener, thisObject);
            return this;
        };
        GObject.prototype.once = function (type, listener, thisObject) {
            if (type == null)
                return this;
            this.$displayObject.once(type, listener, thisObject);
            return this;
        };
        GObject.prototype.hasListener = function (event, handler) {
            if (!handler)
                return this.$displayObject.listeners(event, true);
            else
                return this.$displayObject.listeners(event).indexOf(handler) >= 0;
        };
        GObject.prototype.emit = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!args || args.length <= 0)
                args = [event];
            else
                args.unshift(event);
            return this.$displayObject.emit.apply(this.$displayObject, args);
        };
        GObject.prototype.removeAllListeners = function (type) {
            this.$displayObject.removeAllListeners(type);
        };
        Object.defineProperty(GObject.prototype, "draggable", {
            get: function () {
                return this.$draggable;
            },
            set: function (value) {
                if (this.$draggable != value) {
                    this.$draggable = value;
                    this.initDrag();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GObject.prototype, "dragBounds", {
            get: function () {
                return this.$dragBounds;
            },
            set: function (value) {
                this.$dragBounds = value;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.startDrag = function (touchPointID) {
            if (touchPointID === void 0) { touchPointID = -1; }
            if (!this.onStage)
                return;
            this.dragBegin();
        };
        GObject.prototype.stopDrag = function () {
            this.dragEnd();
        };
        Object.defineProperty(GObject.prototype, "dragging", {
            get: function () {
                return GObject.draggingObject == this;
            },
            enumerable: true,
            configurable: true
        });
        GObject.prototype.localToGlobal = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            if (this.$pivotAsAnchor) {
                ax += this.$pivot.x * this.$width;
                ay += this.$pivot.y * this.$height;
            }
            if (!resultPoint)
                resultPoint = GObject.sHelperPoint;
            resultPoint.x = ax;
            resultPoint.y = ay;
            return this.$displayObject.toGlobal(resultPoint, resultPoint);
        };
        GObject.prototype.globalToLocal = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            if (!resultPoint)
                resultPoint = GObject.sHelperPoint;
            resultPoint.set(ax, ay);
            resultPoint = this.$displayObject.toLocal(resultPoint, fgui.GRoot.inst.nativeStage);
            if (this.$pivotAsAnchor) {
                resultPoint.x -= this.$pivot.x * this.$width;
                resultPoint.y -= this.$pivot.y * this.$height;
            }
            return resultPoint;
        };
        GObject.prototype.localToRoot = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            var pt = this.localToGlobal(ax, ay, resultPoint);
            pt.x /= fgui.GRoot.inst.contentScaleFactor;
            pt.y /= fgui.GRoot.inst.contentScaleFactor;
            return pt;
        };
        GObject.prototype.rootToLocal = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            ax *= fgui.GRoot.inst.contentScaleFactor;
            ay *= fgui.GRoot.inst.contentScaleFactor;
            return this.globalToLocal(ax, ay, resultPoint);
        };
        GObject.prototype.localToGlobalRect = function (ax, ay, aWidth, aHeight, resultRect) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            if (aWidth === void 0) { aWidth = 0; }
            if (aHeight === void 0) { aHeight = 0; }
            if (resultRect == null)
                resultRect = GObject.sDragHelperRect;
            var pt = this.localToGlobal(ax, ay);
            resultRect.x = pt.x;
            resultRect.y = pt.y;
            resultRect.width = aWidth;
            resultRect.height = aHeight;
            return resultRect;
        };
        GObject.prototype.globalToLocalRect = function (ax, ay, aWidth, aHeight, resultRect) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            if (aWidth === void 0) { aWidth = 0; }
            if (aHeight === void 0) { aHeight = 0; }
            if (resultRect == null)
                resultRect = GObject.sDragHelperRect;
            var pt = this.globalToLocal(ax, ay);
            resultRect.x = pt.x;
            resultRect.y = pt.y;
            resultRect.width = aWidth;
            resultRect.height = aHeight;
            return resultRect;
        };
        GObject.prototype.handleControllerChanged = function (c) {
            this.$handlingController = true;
            for (var i = 0; i < 8 /* Count */; i++) {
                var gear = this.$gears[i];
                if (gear != null && gear.controller == c)
                    gear.apply();
            }
            this.$handlingController = false;
            this.checkGearVisible();
        };
        GObject.prototype.switchDisplayObject = function (newObj) {
            if (newObj == this.$displayObject)
                return;
            var old = this.$displayObject;
            if (this.inContainer) {
                var i = this.$displayObject.parent.getChildIndex(this.$displayObject);
                this.$displayObject.parent.addChildAt(newObj, i);
                this.$displayObject.parent.removeChild(this.$displayObject);
            }
            this.$displayObject = newObj;
            this.$displayObject.x = old.x;
            this.$displayObject.y = old.y;
            this.$displayObject.rotation = old.rotation;
            this.$displayObject.alpha = old.alpha;
            this.$displayObject.visible = old.visible;
            this.$displayObject.scale.x = old.scale.x;
            this.$displayObject.scale.y = old.scale.y;
            this.$displayObject.interactive = old.interactive;
            this.$displayObject.interactiveChildren = old.interactiveChildren;
        };
        GObject.prototype.handleXYChanged = function () {
            if (this.$displayObject) {
                var xv = this.$x;
                var yv = this.$y;
                if (this.$pivotAsAnchor) {
                    xv -= this.$pivot.x * this.$width;
                    yv -= this.$pivot.y * this.$height;
                }
                if (this.$pixelSnapping) {
                    xv = Math.round(xv);
                    yv = Math.round(yv);
                }
                this.$displayObject.position.set(xv + this.$pivotOffset.x, yv + this.$pivotOffset.y);
            }
        };
        GObject.prototype.handleSizeChanged = function () {
        };
        GObject.prototype.handleScaleChanged = function () {
            if (this.$displayObject)
                this.$displayObject.scale.set(this.$scaleX, this.$scaleY);
        };
        Object.defineProperty(GObject.prototype, "colorFilter", {
            get: function () {
                if (this.$colorFilter)
                    return this.$colorFilter;
                this.$colorFilter = new PIXI.filters.ColorMatrixFilter();
                if (this.$displayObject) {
                    var a = this.$displayObject.filters || [];
                    a.push(this.$colorFilter);
                    this.$displayObject.filters = a;
                }
                return this.$colorFilter;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * update color appearance
         * @param brightness value of the brigthness (-1 - 1, where -1 is black)
         * @param contrast value of the contrast (-1 - 1)
         * @param saturate The saturation amount (-1 - 1)
         * @param hue The hue property of the color in degress (-1 - 1, where 1 is 360deg)
         */
        GObject.prototype.updateColorComponents = function (brightness, contrast, saturate, hue) {
            if (!GObject.$colorHelper)
                GObject.$colorHelper = new fgui.utils.ColorMatrix();
            var helper = GObject.$colorHelper;
            helper.setColor(brightness, contrast * 100, saturate * 100, hue * 180);
            var f = this.colorFilter;
            f.enabled = true;
            f.reset();
            f.matrix = helper.toArray();
            if (!this.$lastColorComponents)
                this.$lastColorComponents = [];
            this.$lastColorComponents.length = 0;
            this.$lastColorComponents.push(helper.brightness, helper.contrast, helper.saturation, helper.hue);
        };
        GObject.prototype.handleGrayedChanged = function () {
            if (this.$displayObject) {
                var c = this.colorFilter;
                c.enabled = true;
                if (this.$grayed)
                    c.blackAndWhite(true);
                else {
                    if (this.$lastColorComponents && this.$lastColorComponents.length >= 4)
                        this.updateColorComponents(this.$lastColorComponents[0], this.$lastColorComponents[1], this.$lastColorComponents[2], this.$lastColorComponents[3]);
                    else
                        c.enabled = false;
                }
            }
        };
        /**@internal */
        GObject.prototype.constructFromResource = function () {
        };
        GObject.prototype.setupBeforeAdd = function (xml) {
            var str;
            var arr;
            this.$id = xml.attributes.id;
            this.$name = xml.attributes.name;
            str = xml.attributes.xy;
            arr = str.split(",");
            this.setXY(parseInt(arr[0]), parseInt(arr[1]));
            str = xml.attributes.size;
            if (str) {
                arr = str.split(",");
                this.$initWidth = parseInt(arr[0]);
                this.$initHeight = parseInt(arr[1]);
                this.setSize(this.$initWidth, this.$initHeight, true);
            }
            str = xml.attributes.scale;
            if (str) {
                arr = str.split(",");
                this.setScale(parseFloat(arr[0]), parseFloat(arr[1]));
            }
            str = xml.attributes.rotation;
            if (str)
                this.rotation = parseInt(str);
            str = xml.attributes.skew;
            if (str) {
                arr = str.split(",");
                this.setSkew(parseFloat(arr[0]), parseFloat(arr[1]));
            }
            str = xml.attributes.pivot;
            if (str) {
                arr = str.split(",");
                var n1 = parseFloat(arr[0]), n2 = parseFloat(arr[1]);
                str = xml.attributes.anchor;
                this.setPivot(n1, n2, str == "true");
            }
            str = xml.attributes.alpha;
            if (str)
                this.alpha = parseFloat(str);
            if (xml.attributes.touchable == "false")
                this.touchable = false;
            if (xml.attributes.visible == "false")
                this.visible = false;
            if (xml.attributes.grayed == "true")
                this.grayed = true;
            this.tooltips = xml.attributes.tooltips;
            str = xml.attributes.blend;
            if (str)
                this.blendMode = str;
            str = xml.attributes.filter;
            if (str) {
                switch (str) {
                    case "color":
                        str = xml.attributes.filterData;
                        arr = str.split(",");
                        this.updateColorComponents(parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2]), parseFloat(arr[3]));
                        break;
                }
            }
        };
        GObject.prototype.setupAfterAdd = function (xml) {
            var _this = this;
            var str = xml.attributes.group;
            if (str)
                this.$group = this.$parent.getChildById(str);
            var col = xml.children;
            col.forEach(function (cxml) {
                var index = fgui.GearXMLNodeNameMap[cxml.nodeName];
                if (index != void 0)
                    _this.getGear(index).setup(cxml);
            }, this);
        };
        GObject.castFromNativeObject = function (disp) {
            if (fgui.isUIObject(disp))
                return disp.UIOwner;
            return null;
        };
        GObject.prototype.initDrag = function () {
            if (this.$draggable)
                this.on(fgui.InteractiveEvents.Down, this.$touchBegin, this);
            else
                this.off(fgui.InteractiveEvents.Down, this.$touchBegin, this);
        };
        GObject.prototype.dragBegin = function () {
            if (GObject.draggingObject != null)
                GObject.draggingObject.stopDrag();
            GObject.sGlobalDragStart.x = fgui.GRoot.statusData.mouseX;
            GObject.sGlobalDragStart.y = fgui.GRoot.statusData.mouseY;
            this.localToGlobalRect(0, 0, this.width, this.height, GObject.sGlobalRect);
            GObject.draggingObject = this;
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Move, this.$moving2, this);
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Up, this.$end2, this);
        };
        GObject.prototype.dragEnd = function () {
            if (GObject.draggingObject == this) {
                fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$moving2, this);
                fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$end2, this);
                GObject.draggingObject = null;
            }
            GObject.$dragBeginCancelled = true;
        };
        GObject.prototype.reset = function () {
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$moving, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$end, this);
        };
        GObject.prototype.$touchBegin = function (evt) {
            if (this.$touchDownPoint == null)
                this.$touchDownPoint = new PIXI.Point();
            this.$touchDownPoint.x = evt.data.global.x;
            this.$touchDownPoint.y = evt.data.global.y;
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Move, this.$moving, this);
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Up, this.$end, this);
        };
        GObject.prototype.$end = function (evt) {
            this.reset();
        };
        GObject.prototype.$moving = function (evt) {
            var sensitivity = fgui.UIConfig.touchDragSensitivity;
            if (this.$touchDownPoint != null
                && Math.abs(this.$touchDownPoint.x - evt.data.global.x) < sensitivity
                && Math.abs(this.$touchDownPoint.y - evt.data.global.y) < sensitivity)
                return;
            this.reset();
            GObject.$dragBeginCancelled = false;
            evt.currentTarget = this.$displayObject;
            this.$displayObject.emit("__dragStart" /* START */, evt, this);
            if (!GObject.$dragBeginCancelled)
                this.dragBegin();
        };
        GObject.prototype.$moving2 = function (evt) {
            var xx = evt.data.global.x - GObject.sGlobalDragStart.x + GObject.sGlobalRect.x;
            var yy = evt.data.global.y - GObject.sGlobalDragStart.y + GObject.sGlobalRect.y;
            if (this.$dragBounds != null) {
                var rect = fgui.GRoot.inst.localToGlobalRect(this.$dragBounds.x, this.$dragBounds.y, this.$dragBounds.width, this.$dragBounds.height, GObject.sDragHelperRect);
                if (xx < rect.x)
                    xx = rect.x;
                else if (xx + GObject.sGlobalRect.width > rect.right) {
                    xx = rect.right - GObject.sGlobalRect.width;
                    if (xx < rect.x)
                        xx = rect.x;
                }
                if (yy < rect.y)
                    yy = rect.y;
                else if (yy + GObject.sGlobalRect.height > rect.bottom) {
                    yy = rect.bottom - GObject.sGlobalRect.height;
                    if (yy < rect.y)
                        yy = rect.y;
                }
            }
            GObject.sUpdatingWhileDragging = true;
            GObject.sHelperPoint.x = xx;
            GObject.sHelperPoint.y = yy;
            var pt = this.parent.globalToLocal(xx, yy, GObject.sHelperPoint);
            this.setXY(Math.round(pt.x), Math.round(pt.y));
            GObject.sUpdatingWhileDragging = false;
            evt.currentTarget = this.$displayObject;
            this.$displayObject.emit("__dragMoving" /* MOVING */, evt, this);
        };
        GObject.prototype.$end2 = function (evt) {
            if (GObject.draggingObject == this) {
                this.stopDrag();
                evt.currentTarget = this.$displayObject;
                this.$displayObject.emit("__dragEnd" /* END */, evt, this);
            }
        };
        GObject.gInstanceCounter = 0;
        //dragging
        //-------------------------------------------------------------------
        GObject.sGlobalDragStart = new PIXI.Point();
        GObject.sGlobalRect = new PIXI.Rectangle();
        GObject.sHelperPoint = new PIXI.Point();
        GObject.sDragHelperRect = new PIXI.Rectangle();
        return GObject;
    }());
    fgui.GObject = GObject;
})(fgui || (fgui = {}));
/// <reference path="./GObject.ts" />
var fgui;
(function (fgui) {
    var GComponent = (function (_super) {
        __extends(GComponent, _super);
        function GComponent() {
            var _this = _super.call(this) || this;
            _this.$sortingChildCount = 0;
            _this.$children = [];
            _this.$controllers = [];
            _this.$transitions = [];
            _this.$margin = new fgui.utils.Margin();
            _this.$alignOffset = new PIXI.Point();
            return _this;
        }
        GComponent.prototype.createDisplayObject = function () {
            this.$rootContainer = new fgui.UIContainer(this);
            this.setDisplayObject(this.$rootContainer);
            this.$container = this.$rootContainer;
        };
        GComponent.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.$validate, this);
            this.off("added", this.$added, this);
            this.off("removed", this.$removed, this);
            this.$transitions.forEach(function (trans) {
                trans.dispose();
            });
            var numChildren = this.$children.length;
            for (var i = numChildren - 1; i >= 0; --i) {
                var obj = this.$children[i];
                obj.parent = null; //avoid removeFromParent call
                obj.dispose();
            }
            this.$boundsChanged = false;
            if (this.$scrollPane)
                this.$scrollPane.dispose();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(GComponent.prototype, "displayListContainer", {
            get: function () {
                return this.$container;
            },
            enumerable: true,
            configurable: true
        });
        GComponent.prototype.addChild = function (child) {
            this.addChildAt(child, this.$children.length);
            return child;
        };
        GComponent.prototype.addChildAt = function (child, index) {
            if (index === void 0) { index = 0; }
            if (!child)
                throw new Error("Invalid child");
            var numChildren = this.$children.length;
            if (index >= 0 && index <= numChildren) {
                if (child.parent == this)
                    this.setChildIndex(child, index);
                else {
                    child.removeFromParent();
                    child.parent = this;
                    var cnt = this.$children.length;
                    if (child.sortingOrder != 0) {
                        this.$sortingChildCount++;
                        index = this.getInsertPosForSortingChild(child);
                    }
                    else if (this.$sortingChildCount > 0) {
                        if (index > (cnt - this.$sortingChildCount))
                            index = cnt - this.$sortingChildCount;
                    }
                    if (index == cnt)
                        this.$children.push(child);
                    else
                        this.$children.splice(index, 0, child);
                    this.childStateChanged(child);
                    this.setBoundsChangedFlag();
                }
                return child;
            }
            else
                throw new Error("Invalid child index");
        };
        GComponent.prototype.getInsertPosForSortingChild = function (target) {
            var cnt = this.$children.length;
            var i = 0;
            for (i = 0; i < cnt; i++) {
                var child = this.$children[i];
                if (child == target)
                    continue;
                if (target.sortingOrder < child.sortingOrder)
                    break;
            }
            return i;
        };
        GComponent.prototype.removeChild = function (child, dispose) {
            if (dispose === void 0) { dispose = false; }
            var childIndex = this.$children.indexOf(child);
            if (childIndex != -1)
                this.removeChildAt(childIndex, dispose);
            return child;
        };
        GComponent.prototype.removeChildAt = function (index, dispose) {
            if (dispose === void 0) { dispose = false; }
            if (index >= 0 && index < this.numChildren) {
                var child = this.$children[index];
                child.parent = null;
                if (child.sortingOrder != 0)
                    this.$sortingChildCount--;
                this.$children.splice(index, 1);
                if (child.inContainer)
                    this.$container.removeChild(child.displayObject);
                if (dispose === true)
                    child.dispose();
                this.setBoundsChangedFlag();
                return child;
            }
            else
                throw new Error("Invalid child index");
        };
        GComponent.prototype.removeChildren = function (beginIndex, endIndex, dispose) {
            if (beginIndex === void 0) { beginIndex = 0; }
            if (endIndex === void 0) { endIndex = -1; }
            if (dispose === void 0) { dispose = false; }
            if (endIndex < 0 || endIndex >= this.numChildren)
                endIndex = this.numChildren - 1;
            for (var i = beginIndex; i <= endIndex; ++i)
                this.removeChildAt(beginIndex, dispose);
        };
        GComponent.prototype.getChildAt = function (index) {
            if (index === void 0) { index = 0; }
            if (index >= 0 && index < this.numChildren)
                return this.$children[index];
            else
                throw new Error("Invalid child index");
        };
        GComponent.prototype.getChild = function (name) {
            var cnt = this.$children.length;
            for (var i = 0; i < cnt; ++i) {
                if (this.$children[i].name == name)
                    return this.$children[i];
            }
            return null;
        };
        GComponent.prototype.getChildInGroup = function (name, group) {
            var cnt = this.$children.length;
            for (var i = 0; i < cnt; ++i) {
                var child = this.$children[i];
                if (child.group == group && child.name == name)
                    return child;
            }
            return null;
        };
        GComponent.prototype.getChildById = function (id) {
            var cnt = this.$children.length;
            for (var i = 0; i < cnt; ++i) {
                if (this.$children[i].id == id)
                    return this.$children[i];
            }
            return null;
        };
        GComponent.prototype.getChildIndex = function (child) {
            return this.$children.indexOf(child);
        };
        GComponent.prototype.setChildIndex = function (child, index) {
            if (index === void 0) { index = 0; }
            var oldIndex = this.$children.indexOf(child);
            if (oldIndex == -1)
                throw new Error("no such child found");
            if (child.sortingOrder != 0)
                return;
            var cnt = this.$children.length;
            if (this.$sortingChildCount > 0) {
                if (index > (cnt - this.$sortingChildCount - 1))
                    index = cnt - this.$sortingChildCount - 1;
            }
            this.$setChildIndex(child, oldIndex, index);
        };
        GComponent.prototype.setChildIndexBefore = function (child, index) {
            var oldIndex = this.$children.indexOf(child);
            if (oldIndex == -1)
                throw new Error("no such child found");
            if (child.sortingOrder != 0)
                return oldIndex;
            var cnt = this.$children.length;
            if (this.$sortingChildCount > 0) {
                if (index > (cnt - this.$sortingChildCount - 1))
                    index = cnt - this.$sortingChildCount - 1;
            }
            if (oldIndex < index)
                return this.$setChildIndex(child, oldIndex, index - 1);
            else
                return this.$setChildIndex(child, oldIndex, index);
        };
        GComponent.prototype.$setChildIndex = function (child, oldIndex, index) {
            if (index === void 0) { index = 0; }
            var cnt = this.$children.length;
            if (index > cnt)
                index = cnt;
            if (oldIndex == index)
                return oldIndex;
            this.$children.splice(oldIndex, 1);
            this.$children.splice(index, 0, child);
            if (child.inContainer) {
                var displayIndex = 0;
                var childCount = this.$container.children.length;
                for (var i = 0; i < index; i++) {
                    var g = this.$children[i];
                    if (g.inContainer)
                        displayIndex++;
                }
                if (displayIndex == childCount)
                    displayIndex--;
                this.$container.setChildIndex(child.displayObject, displayIndex);
                this.setBoundsChangedFlag();
            }
            return index;
        };
        GComponent.prototype.swapChildren = function (child1, child2) {
            var index1 = this.$children.indexOf(child1);
            var index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1)
                throw new Error("no such child found");
            this.swapChildrenAt(index1, index2);
        };
        GComponent.prototype.swapChildrenAt = function (index1, index2) {
            if (index2 === void 0) { index2 = 0; }
            var child1 = this.$children[index1];
            var child2 = this.$children[index2];
            this.setChildIndex(child1, index2);
            this.setChildIndex(child2, index1);
        };
        Object.defineProperty(GComponent.prototype, "numChildren", {
            get: function () {
                return this.$children.length;
            },
            enumerable: true,
            configurable: true
        });
        GComponent.prototype.isAncestorOf = function (child) {
            if (child == null)
                return false;
            var p = child.parent;
            while (p) {
                if (p == this)
                    return true;
                p = p.parent;
            }
            return false;
        };
        GComponent.prototype.addController = function (controller) {
            this.$controllers.push(controller);
            controller.$parent = this;
            this.applyController(controller);
        };
        GComponent.prototype.getControllerAt = function (index) {
            return this.$controllers[index];
        };
        GComponent.prototype.getController = function (name) {
            var cnt = this.$controllers.length;
            for (var i = 0; i < cnt; ++i) {
                var c = this.$controllers[i];
                if (c.name == name)
                    return c;
            }
            return null;
        };
        GComponent.prototype.removeController = function (c) {
            var index = this.$controllers.indexOf(c);
            if (index == -1)
                throw new Error("controller not exists");
            c.$parent = null;
            this.$controllers.splice(index, 1);
            this.$children.forEach(function (child) {
                child.handleControllerChanged(c);
            });
        };
        Object.defineProperty(GComponent.prototype, "controllers", {
            get: function () {
                return this.$controllers;
            },
            enumerable: true,
            configurable: true
        });
        GComponent.prototype.childStateChanged = function (child) {
            var _this = this;
            if (this.$buildingDisplayList)
                return;
            if (child instanceof fgui.GGroup) {
                this.$children.forEach(function (g) {
                    if (g.group == child)
                        _this.childStateChanged(g);
                }, this);
                return;
            }
            if (!child.displayObject)
                return;
            if (child.finalVisible) {
                if (!child.displayObject.parent) {
                    var index = 0;
                    var len = this.$children.length;
                    for (var i1 = 0; i1 < len; i1++) {
                        var g = this.$children[i1];
                        if (g == child)
                            break;
                        if (g.displayObject && g.displayObject.parent)
                            index++;
                    }
                    this.$container.addChildAt(child.displayObject, index);
                }
            }
            else {
                if (child.displayObject.parent)
                    this.$container.removeChild(child.displayObject);
            }
        };
        GComponent.prototype.applyController = function (c) {
            this.$applyingController = c;
            this.$children.forEach(function (child) {
                child.handleControllerChanged(c);
            });
            this.$applyingController = null;
            c.executeActions();
        };
        GComponent.prototype.applyAllControllers = function () {
            var _this = this;
            this.$controllers.forEach(function (c) {
                _this.applyController(c);
            }, this);
        };
        GComponent.prototype.adjustRadioGroupDepth = function (obj, c) {
            var myIndex = -1, maxIndex = -1;
            this.$children.forEach(function (child, i) {
                if (child == obj) {
                    myIndex = i;
                }
                else if ((child instanceof fgui.GButton)
                    && child.relatedController == c) {
                    if (i > maxIndex)
                        maxIndex = i;
                }
            });
            if (myIndex < maxIndex) {
                if (this.$applyingController != null)
                    this.$children[maxIndex].handleControllerChanged(this.$applyingController); //TODO: twice
                this.swapChildrenAt(myIndex, maxIndex);
            }
        };
        GComponent.prototype.getTransitionAt = function (index) {
            return this.$transitions[index];
        };
        GComponent.prototype.getTransition = function (transName) {
            var cnt = this.$transitions.length;
            for (var i = 0; i < cnt; ++i) {
                var trans = this.$transitions[i];
                if (trans.name == transName)
                    return trans;
            }
            return null;
        };
        GComponent.prototype.isChildInView = function (child) {
            if (this.$rootContainer.scrollRect != null) {
                return child.x + child.width >= 0 && child.x <= this.width
                    && child.y + child.height >= 0 && child.y <= this.height;
            }
            else if (this.$scrollPane != null) {
                return this.$scrollPane.isChildInView(child);
            }
            else
                return true;
        };
        GComponent.prototype.getFirstChildInView = function () {
            var cnt = this.$children.length;
            for (var i = 0; i < cnt; ++i) {
                var child = this.$children[i];
                if (this.isChildInView(child))
                    return i;
            }
            return -1;
        };
        Object.defineProperty(GComponent.prototype, "scrollPane", {
            get: function () {
                return this.$scrollPane;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComponent.prototype, "opaque", {
            get: function () {
                return this.$opaque;
            },
            set: function (value) {
                if (this.$opaque != value) {
                    this.$opaque = value;
                    if (this.$opaque)
                        this.updateOpaque();
                    else {
                        if (this.$rootContainer.hitArea && this.$rootContainer.hitArea instanceof PIXI.Rectangle)
                            this.$rootContainer.hitArea.width = this.$rootContainer.hitArea.height = 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComponent.prototype, "margin", {
            get: function () {
                return this.$margin;
            },
            set: function (value) {
                this.$margin.copy(value);
                if (this.$rootContainer.scrollRect != null) {
                    this.$container.x = this.$margin.left + this.$alignOffset.x;
                    this.$container.y = this.$margin.top + this.$alignOffset.y;
                }
                this.handleSizeChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComponent.prototype, "mask", {
            get: function () {
                return this.$rootContainer.mask;
            },
            set: function (obj) {
                if (!obj)
                    return;
                obj.interactive = obj.interactiveChildren = false;
                if (obj instanceof PIXI.Graphics)
                    obj.isMask = true;
                this.$rootContainer.mask = obj;
            },
            enumerable: true,
            configurable: true
        });
        GComponent.prototype.updateOpaque = function () {
            if (!this.$rootContainer.hitArea)
                this.$rootContainer.hitArea = new PIXI.Rectangle();
            var h = this.$rootContainer.hitArea;
            h.x = h.y = 0;
            h.width = this.width;
            h.height = this.height;
        };
        GComponent.prototype.updateScrollRect = function () {
            var rect = this.$rootContainer.scrollRect;
            if (rect == null)
                rect = new PIXI.Rectangle();
            var w = this.width - this.$margin.right;
            var h = this.height - this.$margin.bottom;
            rect.x = rect.y = 0;
            rect.width = w;
            rect.height = h;
            this.$rootContainer.scrollRect = rect;
        };
        GComponent.prototype.setupScroll = function (scrollBarMargin, scroll, scrollBarDisplay, flags, vtScrollBarRes, hzScrollBarRes) {
            if (this.$rootContainer == this.$container) {
                this.$container = new PIXI.Container();
                this.$rootContainer.addChild(this.$container);
            }
            this.$scrollPane = new fgui.ScrollPane(this, scroll, scrollBarMargin, scrollBarDisplay, flags, vtScrollBarRes, hzScrollBarRes);
            this.setBoundsChangedFlag();
        };
        GComponent.prototype.setupOverflow = function (overflow) {
            if (overflow == 1 /* Hidden */) {
                if (this.$rootContainer == this.$container) {
                    this.$container = new PIXI.Container();
                    this.$rootContainer.addChild(this.$container);
                }
                this.updateScrollRect();
                this.$container.x = this.$margin.left;
                this.$container.y = this.$margin.top;
            }
            else if (this.$margin.left != 0 || this.$margin.top != 0) {
                if (this.$rootContainer == this.$container) {
                    this.$container = new PIXI.Container();
                    this.$rootContainer.addChild(this.$container);
                }
                this.$container.x = this.$margin.left;
                this.$container.y = this.$margin.top;
            }
            this.setBoundsChangedFlag();
        };
        GComponent.prototype.handleSizeChanged = function () {
            if (this.$scrollPane)
                this.$scrollPane.onOwnerSizeChanged();
            else if (this.$rootContainer.scrollRect != null)
                this.updateScrollRect();
            if (this.$opaque)
                this.updateOpaque();
        };
        GComponent.prototype.handleGrayedChanged = function () {
            var c = this.getController("grayed");
            if (c != null) {
                c.selectedIndex = this.grayed ? 1 : 0;
                return;
            }
            var v = this.grayed;
            this.$children.forEach(function (child) {
                child.grayed = v;
            });
        };
        GComponent.prototype.setBoundsChangedFlag = function () {
            if (!this.$scrollPane && !this.$trackBounds)
                return;
            if (!this.$boundsChanged) {
                this.$boundsChanged = true;
                fgui.GTimer.inst.callLater(this.$validate, this);
            }
        };
        GComponent.prototype.$validate = function (dt) {
            if (this.$boundsChanged)
                this.updateBounds();
        };
        GComponent.prototype.ensureBoundsCorrect = function () {
            if (this.$boundsChanged)
                this.updateBounds();
        };
        GComponent.prototype.updateBounds = function () {
            var ax = 0, ay = 0, aw = 0, ah = 0;
            var len = this.$children.length;
            if (len > 0) {
                ax = Number.POSITIVE_INFINITY, ay = Number.POSITIVE_INFINITY;
                var ar_1 = Number.NEGATIVE_INFINITY, ab_1 = Number.NEGATIVE_INFINITY;
                var tmp_1 = 0;
                this.$children.forEach(function (child) {
                    child.ensureSizeCorrect();
                    tmp_1 = child.x;
                    if (tmp_1 < ax)
                        ax = tmp_1;
                    tmp_1 = child.y;
                    if (tmp_1 < ay)
                        ay = tmp_1;
                    tmp_1 = child.x + child.actualWidth;
                    if (tmp_1 > ar_1)
                        ar_1 = tmp_1;
                    tmp_1 = child.y + child.actualHeight;
                    if (tmp_1 > ab_1)
                        ab_1 = tmp_1;
                });
                aw = ar_1 - ax;
                ah = ab_1 - ay;
            }
            this.setBounds(ax, ay, aw, ah);
        };
        GComponent.prototype.setBounds = function (ax, ay, aw, ah) {
            if (ah === void 0) { ah = 0; }
            this.$boundsChanged = false;
            if (this.$scrollPane)
                this.$scrollPane.setContentSize(Math.round(ax + aw), Math.round(ay + ah));
        };
        Object.defineProperty(GComponent.prototype, "viewWidth", {
            get: function () {
                if (this.$scrollPane != null)
                    return this.$scrollPane.viewWidth;
                else
                    return this.width - this.$margin.left - this.$margin.right;
            },
            set: function (value) {
                if (this.$scrollPane != null)
                    this.$scrollPane.viewWidth = value;
                else
                    this.width = value + this.$margin.left + this.$margin.right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComponent.prototype, "viewHeight", {
            get: function () {
                if (this.$scrollPane != null)
                    return this.$scrollPane.viewHeight;
                else
                    return this.height - this.$margin.top - this.$margin.bottom;
            },
            set: function (value) {
                if (this.$scrollPane != null)
                    this.$scrollPane.viewHeight = value;
                else
                    this.height = value + this.$margin.top + this.$margin.bottom;
            },
            enumerable: true,
            configurable: true
        });
        GComponent.prototype.getSnappingPosition = function (xValue, yValue, resultPoint) {
            if (!resultPoint)
                resultPoint = new PIXI.Point();
            var cnt = this.$children.length;
            if (cnt <= 0) {
                resultPoint.x = 0;
                resultPoint.y = 0;
                return resultPoint;
            }
            this.ensureBoundsCorrect();
            var obj = null;
            var prev = null;
            var i = 0;
            if (yValue != 0) {
                for (; i < cnt; i++) {
                    obj = this.$children[i];
                    if (yValue < obj.y) {
                        if (i == 0) {
                            yValue = 0;
                            break;
                        }
                        else {
                            prev = this.$children[i - 1];
                            if (yValue < prev.y + prev.actualHeight / 2)
                                yValue = prev.y;
                            else
                                yValue = obj.y;
                            break;
                        }
                    }
                }
                if (i == cnt)
                    yValue = obj.y;
            }
            if (xValue != 0) {
                if (i > 0)
                    i--;
                for (; i < cnt; i++) {
                    obj = this.$children[i];
                    if (xValue < obj.x) {
                        if (i == 0) {
                            xValue = 0;
                            break;
                        }
                        else {
                            prev = this.$children[i - 1];
                            if (xValue < prev.x + prev.actualWidth / 2)
                                xValue = prev.x;
                            else
                                xValue = obj.x;
                            break;
                        }
                    }
                }
                if (i == cnt)
                    xValue = obj.x;
            }
            resultPoint.x = xValue;
            resultPoint.y = yValue;
            return resultPoint;
        };
        GComponent.prototype.childSortingOrderChanged = function (child, oldValue, newValue) {
            if (newValue === void 0) { newValue = 0; }
            if (newValue == 0) {
                this.$sortingChildCount--;
                this.setChildIndex(child, this.$children.length);
            }
            else {
                if (oldValue == 0)
                    this.$sortingChildCount++;
                var oldIndex = this.$children.indexOf(child);
                var index = this.getInsertPosForSortingChild(child);
                if (oldIndex < index)
                    this.$setChildIndex(child, oldIndex, index - 1);
                else
                    this.$setChildIndex(child, oldIndex, index);
            }
        };
        /**@internal */
        GComponent.prototype.constructFromResource = function () {
            this.constructInternal(null, 0);
        };
        GComponent.prototype.constructInternal = function (objectPool, poolIndex) {
            var _this = this;
            var xml = this.packageItem.owner.getItemAsset(this.packageItem);
            this.$inProgressBuilding = true;
            var str;
            var arr;
            str = xml.attributes.size;
            arr = str.split(",");
            this.$sourceWidth = parseInt(arr[0]);
            this.$sourceHeight = parseInt(arr[1]);
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;
            this.setSize(this.$sourceWidth, this.$sourceHeight);
            str = xml.attributes.pivot;
            if (str) {
                arr = str.split(",");
                str = xml.attributes.anchor;
                this.internalSetPivot(parseFloat(arr[0]), parseFloat(arr[1]), str == "true");
            }
            str = xml.attributes.opaque;
            this.opaque = str != "false";
            var overflow;
            str = xml.attributes.overflow;
            if (str)
                overflow = fgui.ParseOverflowType(str);
            else
                overflow = 0 /* Visible */;
            str = xml.attributes.margin;
            if (str)
                this.$margin.parse(str);
            if (overflow == 2 /* Scroll */) {
                var scroll_1;
                str = xml.attributes.scroll;
                if (str)
                    scroll_1 = fgui.ParseScrollType(str);
                else
                    scroll_1 = 1 /* Vertical */;
                var scrollBarDisplay = void 0;
                str = xml.attributes.scrollBar;
                if (str)
                    scrollBarDisplay = fgui.ParseScrollBarDisplayType(str);
                else
                    scrollBarDisplay = 0 /* Default */;
                var scrollBarFlags = void 0;
                str = xml.attributes.scrollBarFlags;
                if (str)
                    scrollBarFlags = parseInt(str);
                else
                    scrollBarFlags = 0;
                var scrollBarMargin = new fgui.utils.Margin();
                str = xml.attributes.scrollBarMargin;
                if (str)
                    scrollBarMargin.parse(str);
                var vtScrollBarRes = void 0;
                var hzScrollBarRes = void 0;
                str = xml.attributes.scrollBarRes;
                if (str) {
                    arr = str.split(",");
                    vtScrollBarRes = arr[0];
                    hzScrollBarRes = arr[1];
                }
                this.setupScroll(scrollBarMargin, scroll_1, scrollBarDisplay, scrollBarFlags, vtScrollBarRes, hzScrollBarRes);
            }
            else
                this.setupOverflow(overflow);
            this.$buildingDisplayList = true;
            var col = xml.children;
            col.forEach(function (cxml) {
                if (cxml.nodeName == "controller") {
                    var c = new fgui.controller.Controller();
                    _this.$controllers.push(c);
                    c.$parent = _this;
                    c.setup(cxml);
                }
            });
            var displayList = this.packageItem.displayList;
            displayList.forEach(function (di, i) {
                var child;
                if (objectPool != null)
                    child = objectPool[poolIndex + i];
                else if (di.packageItem) {
                    child = fgui.UIObjectFactory.newObject(di.packageItem);
                    child.packageItem = di.packageItem;
                    child.constructFromResource();
                }
                else
                    child = fgui.UIObjectFactory.newObjectDirectly(di.type);
                child.$inProgressBuilding = true;
                child.setupBeforeAdd(di.desc);
                child.parent = _this;
                _this.$children.push(child);
            }, this);
            this.relations.setup(xml);
            this.$children.forEach(function (child, i) {
                child.relations.setup(displayList[i].desc);
                child.setupAfterAdd(displayList[i].desc);
                child.$inProgressBuilding = false;
            });
            str = xml.attributes.mask;
            if (str) {
                var maskObj = this.getChildById(str).displayObject;
                if (maskObj instanceof PIXI.Graphics || maskObj instanceof PIXI.Sprite)
                    this.mask = maskObj;
                else
                    throw new Error("only PIXI.Sprite or PIXI.Graphics can be applied as mask object");
            }
            col.forEach(function (cxml) {
                if (cxml.nodeName == "transition") {
                    var trans = new fgui.Transition(_this);
                    _this.$transitions.push(trans);
                    trans.setup(cxml);
                }
            }, this);
            if (this.$transitions.length > 0) {
                this.on("added", this.$added, this);
                this.on("removed", this.$removed, this);
            }
            this.applyAllControllers();
            this.$buildingDisplayList = false;
            this.$inProgressBuilding = false;
            this.appendChildrenList();
            this.setBoundsChangedFlag();
            this.constructFromXML(xml);
        };
        GComponent.prototype.appendChildrenList = function () {
            var _this = this;
            this.$children.forEach(function (child) {
                if (child.displayObject != null && child.finalVisible)
                    _this.$container.addChild(child.displayObject);
            }, this);
        };
        GComponent.prototype.constructFromXML = function (xml) {
        };
        GComponent.prototype.$added = function (d) {
            this.$transitions.forEach(function (trans) {
                if (trans.autoPlay)
                    trans.play({ times: trans.autoPlayRepeat, delay: trans.autoPlayDelay });
            });
        };
        GComponent.prototype.$removed = function (d) {
            this.$transitions.forEach(function (trans) {
                trans.stop(false, false);
            });
        };
        return GComponent;
    }(fgui.GObject));
    fgui.GComponent = GComponent;
})(fgui || (fgui = {}));
/// <reference path="./GComponent.ts" />
var fgui;
(function (fgui) {
    var GButton = (function (_super) {
        __extends(GButton, _super);
        function GButton() {
            var _this = _super.call(this) || this;
            _this.$mode = 0 /* Common */;
            _this.$title = "";
            _this.$icon = "";
            _this.$pageOption = new fgui.controller.PageOption();
            _this.$changeStateOnClick = true;
            _this.$downEffect = 0;
            _this.$downEffectValue = 0.8;
            return _this;
        }
        GButton.prototype.setDisplayObject = function (value) {
            _super.prototype.setDisplayObject.call(this, value);
            this.$displayObject.buttonMode = true;
        };
        Object.defineProperty(GButton.prototype, "icon", {
            get: function () {
                return this.$icon;
            },
            set: function (value) {
                this.$icon = value;
                value = (this.$selected && this.$selectedIcon) ? this.$selectedIcon : this.$icon;
                if (this.$iconObject != null)
                    this.$iconObject.icon = value;
                this.updateGear(7 /* Icon */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "selectedIcon", {
            get: function () {
                return this.$selectedIcon;
            },
            set: function (value) {
                this.$selectedIcon = value;
                value = (this.$selected && this.$selectedIcon) ? this.$selectedIcon : this.$icon;
                if (this.$iconObject != null)
                    this.$iconObject.icon = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "title", {
            get: function () {
                return this.$title;
            },
            set: function (value) {
                this.$title = value;
                if (this.$titleObject)
                    this.$titleObject.text = (this.$selected && this.$selectedTitle) ? this.$selectedTitle : this.$title;
                this.updateGear(6 /* Text */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "text", {
            get: function () {
                return this.title;
            },
            set: function (value) {
                this.title = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "selectedTitle", {
            get: function () {
                return this.$selectedTitle;
            },
            set: function (value) {
                this.$selectedTitle = value;
                if (this.$titleObject)
                    this.$titleObject.text = (this.$selected && this.$selectedTitle) ? this.$selectedTitle : this.$title;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "titleColor", {
            get: function () {
                if (fgui.isColorableTitle(this.$titleObject))
                    return this.$titleObject.titleColor;
                return 0;
            },
            set: function (value) {
                if (fgui.isColorableTitle(this.$titleObject))
                    this.$titleObject.titleColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "fontSize", {
            get: function () {
                if (fgui.isColorableTitle(this.$titleObject))
                    return this.$titleObject.fontSize;
                return 0;
            },
            set: function (value) {
                if (fgui.isColorableTitle(this.$titleObject))
                    this.$titleObject.fontSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "selected", {
            get: function () {
                return this.$selected;
            },
            set: function (val) {
                if (this.$mode == 0 /* Common */)
                    return;
                if (this.$selected != val) {
                    this.$selected = val;
                    if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED)) {
                        if (this.$selected)
                            this.setState(GButton.SELECTED_DISABLED);
                        else
                            this.setState(GButton.DISABLED);
                    }
                    else {
                        if (this.$selected)
                            this.setState(this.$over ? GButton.SELECTED_OVER : GButton.DOWN);
                        else
                            this.setState(this.$over ? GButton.OVER : GButton.UP);
                    }
                    if (this.$selectedTitle && this.$titleObject)
                        this.$titleObject.text = this.$selected ? this.$selectedTitle : this.$title;
                    if (this.$selectedIcon) {
                        var str = this.$selected ? this.$selectedIcon : this.$icon;
                        if (this.$iconObject != null)
                            this.$iconObject.icon = str;
                    }
                    if (this.$relatedController
                        && this.$parent
                        && !this.$parent.$buildingDisplayList) {
                        if (this.$selected) {
                            this.$relatedController.selectedPageId = this.$pageOption.id;
                            if (this.$relatedController.$autoRadioGroupDepth)
                                this.$parent.adjustRadioGroupDepth(this, this.$relatedController);
                        }
                        else if (this.$mode == 1 /* Check */ && this.$relatedController.selectedPageId == this.$pageOption.id)
                            this.$relatedController.oppositePageId = this.$pageOption.id;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "mode", {
            get: function () {
                return this.$mode;
            },
            set: function (value) {
                if (this.$mode != value) {
                    if (value == 0 /* Common */)
                        this.selected = false;
                    this.$mode = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "relatedController", {
            get: function () {
                return this.$relatedController;
            },
            set: function (val) {
                if (val != this.$relatedController) {
                    this.$relatedController = val;
                    this.$pageOption.controller = val;
                    this.$pageOption.clear();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "pageOption", {
            get: function () {
                return this.$pageOption;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "changeStateOnClick", {
            get: function () {
                return this.$changeStateOnClick;
            },
            set: function (value) {
                this.$changeStateOnClick = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GButton.prototype, "linkedPopup", {
            get: function () {
                return this.$linkedPopup;
            },
            set: function (value) {
                this.$linkedPopup = value;
            },
            enumerable: true,
            configurable: true
        });
        GButton.prototype.addStateListener = function (listener, thisObj) {
            this.on("__stateChanged" /* CHANGED */, listener, thisObj);
        };
        GButton.prototype.removeStateListener = function (listener, thisObj) {
            this.off("__stateChanged" /* CHANGED */, listener, thisObj);
        };
        GButton.prototype.fireClick = function (downEffect) {
            if (downEffect === void 0) { downEffect = true; }
            if (downEffect && this.$mode == 0 /* Common */) {
                this.setState(GButton.OVER);
                fgui.GTimer.inst.add(100, 1, this.setState, this, GButton.DOWN);
                fgui.GTimer.inst.add(200, 1, this.setState, this, GButton.UP);
            }
            this.$click(null);
        };
        GButton.prototype.setState = function (val) {
            if (this.$buttonController)
                this.$buttonController.selectedPage = val;
            if (this.$downEffect == 1) {
                if (val == GButton.DOWN || val == GButton.SELECTED_OVER || val == GButton.SELECTED_DISABLED) {
                    var r = this.$downEffectValue * 255;
                    var color_1 = (r << 16) + (r << 8) + r;
                    this.$children.forEach(function (obj) {
                        if (fgui.isColorGear(obj))
                            obj.color = color_1;
                    });
                }
                else {
                    this.$children.forEach(function (obj) {
                        if (fgui.isColorGear(obj))
                            obj.color = 0xffffff;
                    });
                }
            }
            else if (this.$downEffect == 2) {
                if (val == GButton.DOWN || val == GButton.SELECTED_OVER || val == GButton.SELECTED_DISABLED)
                    this.setScale(this.$downEffectValue, this.$downEffectValue);
                else
                    this.setScale(1, 1);
            }
        };
        GButton.prototype.handleControllerChanged = function (c) {
            _super.prototype.handleControllerChanged.call(this, c);
            if (this.$relatedController == c)
                this.selected = this.$pageOption.id == c.selectedPageId;
        };
        GButton.prototype.handleGrayedChanged = function () {
            if (this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED)) {
                if (this.grayed) {
                    if (this.$selected && this.$buttonController.hasPage(GButton.SELECTED_DISABLED))
                        this.setState(GButton.SELECTED_DISABLED);
                    else
                        this.setState(GButton.DISABLED);
                }
                else if (this.$selected)
                    this.setState(GButton.DOWN);
                else
                    this.setState(GButton.UP);
            }
            else
                _super.prototype.handleGrayedChanged.call(this);
        };
        GButton.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "Button")[0];
            var str;
            str = xml.attributes.mode;
            if (str)
                this.$mode = fgui.ParseButtonMode(str);
            str = xml.attributes.downEffect;
            if (str) {
                this.$downEffect = str == "dark" ? 1 : (str == "scale" ? 2 : 0);
                str = xml.attributes.downEffectValue;
                this.$downEffectValue = parseFloat(str);
                if (this.$downEffect == 2)
                    this.setPivot(0.5, 0.5);
            }
            this.$buttonController = this.getController("button");
            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");
            if (this.$titleObject != null)
                this.$title = this.$titleObject.text;
            if (this.$iconObject != null)
                this.$icon = this.$iconObject.icon;
            if (this.$mode == 0 /* Common */)
                this.setState(GButton.UP);
            this.on(fgui.InteractiveEvents.Over, this.$rollover, this);
            this.on(fgui.InteractiveEvents.Out, this.$rollout, this);
            this.on(fgui.InteractiveEvents.Down, this.$mousedown, this);
            this.on(fgui.InteractiveEvents.Click, this.$click, this);
        };
        GButton.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "Button")[0];
            if (xml) {
                var str = void 0;
                str = xml.attributes.title;
                if (str)
                    this.title = str;
                str = xml.attributes.icon;
                if (str)
                    this.icon = str;
                str = xml.attributes.selectedTitle;
                if (str)
                    this.selectedTitle = str;
                str = xml.attributes.selectedIcon;
                if (str)
                    this.selectedIcon = str;
                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = fgui.utils.StringUtil.convertFromHtmlColor(str);
                str = xml.attributes.titleFontSize;
                if (str)
                    this.fontSize = parseInt(str);
                str = xml.attributes.controller;
                if (str)
                    this.$relatedController = this.$parent.getController(str);
                else
                    this.$relatedController = null;
                this.$pageOption.id = xml.attributes.page;
                this.selected = xml.attributes.checked == "true";
            }
        };
        GButton.prototype.$rollover = function (evt) {
            if (!this.$buttonController || !this.$buttonController.hasPage(GButton.OVER))
                return;
            this.$over = true;
            if (this.$down)
                return;
            this.setState(this.$selected ? GButton.SELECTED_OVER : GButton.OVER);
        };
        GButton.prototype.$rollout = function (evt) {
            if (!this.$buttonController || !this.$buttonController.hasPage(GButton.OVER))
                return;
            this.$over = false;
            if (this.$down)
                return;
            this.setState(this.$selected ? GButton.DOWN : GButton.UP);
        };
        GButton.prototype.$mousedown = function (evt) {
            this.$down = true;
            fgui.GRoot.inst.on(fgui.InteractiveEvents.Up, this.$mouseup, this);
            if (this.$mode == 0 /* Common */) {
                if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED))
                    this.setState(GButton.SELECTED_DISABLED);
                else
                    this.setState(GButton.DOWN);
            }
            if (this.$linkedPopup != null) {
                if (this.$linkedPopup instanceof fgui.Window)
                    this.$linkedPopup.toggleVisible();
                else
                    this.root.togglePopup(this.$linkedPopup, this);
            }
        };
        GButton.prototype.$mouseup = function (evt) {
            if (this.$down) {
                fgui.GRoot.inst.off(fgui.InteractiveEvents.Up, this.$mouseup, this);
                this.$down = false;
                if (this.$mode == 0 /* Common */) {
                    if (this.grayed && this.$buttonController && this.$buttonController.hasPage(GButton.DISABLED))
                        this.setState(GButton.DISABLED);
                    else if (this.$over)
                        this.setState(GButton.OVER);
                    else
                        this.setState(GButton.UP);
                }
            }
        };
        GButton.prototype.$click = function (evt) {
            if (!this.$changeStateOnClick)
                return;
            if (this.$mode == 1 /* Check */) {
                this.selected = !this.$selected;
                this.emit("__stateChanged" /* CHANGED */, this);
            }
            else if (this.$mode == 2 /* Radio */) {
                if (!this.$selected) {
                    this.selected = true;
                    this.emit("__stateChanged" /* CHANGED */, this);
                }
            }
        };
        GButton.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.setState, this);
            fgui.GTimer.inst.remove(this.setState, this);
            fgui.GRoot.inst.off(fgui.InteractiveEvents.Up, this.$mouseup, this);
            _super.prototype.dispose.call(this);
        };
        GButton.UP = "up";
        GButton.DOWN = "down";
        GButton.OVER = "over";
        GButton.SELECTED_OVER = "selectedOver";
        GButton.DISABLED = "disabled";
        GButton.SELECTED_DISABLED = "selectedDisabled";
        return GButton;
    }(fgui.GComponent));
    fgui.GButton = GButton;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GComboBox = (function (_super) {
        __extends(GComboBox, _super);
        function GComboBox() {
            var _this = _super.call(this) || this;
            _this.$visibleItemCount = 0;
            _this.$selectedIndex = 0;
            _this.$popupDir = 1 /* Down */;
            _this.$visibleItemCount = fgui.UIConfig.defaultComboBoxVisibleItemCount;
            _this.$itemsUpdated = true;
            _this.$selectedIndex = -1;
            _this.$items = [];
            _this.$values = [];
            return _this;
        }
        Object.defineProperty(GComboBox.prototype, "text", {
            get: function () {
                if (this.$titleObject)
                    return this.$titleObject.text;
                else
                    return null;
            },
            set: function (value) {
                if (this.$titleObject)
                    this.$titleObject.text = value;
                this.updateGear(6 /* Text */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "icon", {
            get: function () {
                if (this.$iconObject)
                    return this.$iconObject.icon;
                else
                    return null;
            },
            set: function (value) {
                if (this.$iconObject)
                    this.$iconObject.icon = value;
                this.updateGear(7 /* Icon */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "titleColor", {
            get: function () {
                if (fgui.isColorableTitle(this.$titleObject))
                    return this.$titleObject.titleColor;
                return 0;
            },
            set: function (value) {
                if (fgui.isColorableTitle(this.$titleObject))
                    this.$titleObject.titleColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "visibleItemCount", {
            get: function () {
                return this.$visibleItemCount;
            },
            set: function (value) {
                this.$visibleItemCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "popupDirection", {
            get: function () {
                return this.$popupDir;
            },
            set: function (value) {
                this.$popupDir = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "items", {
            get: function () {
                return this.$items;
            },
            set: function (value) {
                if (!value)
                    this.$items.length = 0;
                else
                    this.$items = value.concat();
                if (this.$items.length > 0) {
                    if (this.$selectedIndex >= this.$items.length)
                        this.$selectedIndex = this.$items.length - 1;
                    else if (this.$selectedIndex == -1)
                        this.$selectedIndex = 0;
                    this.text = this.$items[this.$selectedIndex];
                    if (this.$icons != null && this.$selectedIndex < this.$icons.length)
                        this.icon = this.$icons[this.$selectedIndex];
                }
                else {
                    this.text = "";
                    if (this.$icons != null)
                        this.icon = null;
                    this.$selectedIndex = -1;
                }
                this.$itemsUpdated = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "icons", {
            get: function () {
                return this.$icons;
            },
            set: function (value) {
                this.$icons = value;
                if (this.$icons != null && this.$selectedIndex != -1 && this.$selectedIndex < this.$icons.length)
                    this.icon = this.$icons[this.$selectedIndex];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "values", {
            get: function () {
                return this.$values;
            },
            set: function (value) {
                if (!value)
                    this.$values.length = 0;
                else
                    this.$values = value.concat();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "selectedIndex", {
            get: function () {
                return this.$selectedIndex;
            },
            set: function (val) {
                if (this.$selectedIndex == val)
                    return;
                this.$selectedIndex = val;
                if (this.selectedIndex >= 0 && this.selectedIndex < this.$items.length) {
                    this.text = this.$items[this.$selectedIndex];
                    if (this.$icons != null && this.$selectedIndex < this.$icons.length)
                        this.icon = this.$icons[this.$selectedIndex];
                }
                else {
                    this.text = "";
                    if (this.$icons != null)
                        this.icon = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GComboBox.prototype, "value", {
            get: function () {
                return this.$values[this.$selectedIndex];
            },
            set: function (val) {
                this.selectedIndex = this.$values.indexOf(val);
            },
            enumerable: true,
            configurable: true
        });
        GComboBox.prototype.setState = function (val) {
            if (this.$buttonController)
                this.$buttonController.selectedPage = val;
        };
        GComboBox.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "ComboBox")[0];
            var str;
            this.$buttonController = this.getController("button");
            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");
            str = xml.attributes.dropdown;
            if (str) {
                this.$dropdown = fgui.UIPackage.createObjectFromURL(str);
                if (!this.$dropdown)
                    throw new Error("the 'dropdown' is not specified, it must be a component definied in the package pool");
                this.$dropdown.name = "this.dropdown";
                this.$list = this.$dropdown.getChild("list");
                if (this.$list == null)
                    throw new Error(this.resourceURL + ": the dropdown component must have a GList child and named 'list'.");
                this.$list.on("__itemClick" /* ItemClick */, this.$clickItem, this);
                this.$list.addRelation(this.$dropdown, 14 /* Width */);
                this.$list.removeRelation(this.$dropdown, 15 /* Height */);
                this.$dropdown.addRelation(this.$list, 15 /* Height */);
                this.$dropdown.removeRelation(this.$list, 14 /* Width */);
                this.$dropdown.on("removed", this.$popupWinClosed, this);
            }
            if (!PIXI.utils.isMobile.any) {
                this.on(fgui.InteractiveEvents.Over, this.$rollover, this);
                this.on(fgui.InteractiveEvents.Out, this.$rollout, this);
            }
            this.on(fgui.InteractiveEvents.Down, this.$mousedown, this);
        };
        GComboBox.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.delayedClickItem, this);
            this.$list.off("__itemClick" /* ItemClick */, this.$clickItem, this);
            this.$dropdown.off("removed", this.$popupWinClosed, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$mouseup, this);
            this.$popupWinClosed(null);
            if (this.$dropdown) {
                this.$dropdown.dispose();
                this.$dropdown = null;
            }
            _super.prototype.dispose.call(this);
        };
        GComboBox.prototype.setupAfterAdd = function (xml) {
            var _this = this;
            _super.prototype.setupAfterAdd.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "ComboBox")[0];
            if (xml) {
                var str_1;
                str_1 = xml.attributes.titleColor;
                if (str_1)
                    this.titleColor = fgui.utils.StringUtil.convertFromHtmlColor(str_1);
                str_1 = xml.attributes.visibleItemCount;
                if (str_1)
                    this.$visibleItemCount = parseInt(str_1);
                var col = xml.children;
                if (col) {
                    col.forEach(function (x, i) {
                        if (x.nodeName == "item") {
                            _this.$items.push(x.attributes.title);
                            _this.$values.push(x.attributes.value);
                            str_1 = x.attributes.icon;
                            if (str_1) {
                                if (!_this.$icons)
                                    _this.$icons = new Array(length);
                                _this.$icons[i] = str_1;
                            }
                        }
                    });
                }
                str_1 = xml.attributes.title;
                if (str_1) {
                    this.text = str_1;
                    this.$selectedIndex = this.$items.indexOf(str_1);
                }
                else if (this.$items.length > 0) {
                    this.$selectedIndex = 0;
                    this.text = this.$items[0];
                }
                else
                    this.$selectedIndex = -1;
                str_1 = xml.attributes.icon;
                if (str_1)
                    this.icon = str_1;
                str_1 = xml.attributes.direction;
                if (str_1) {
                    if (str_1 == "up")
                        this.$popupDir = 2 /* Up */;
                    else if (str_1 == "auto")
                        this.$popupDir = 0 /* Auto */;
                }
            }
        };
        GComboBox.prototype.showDropdown = function () {
            var _this = this;
            if (this.$itemsUpdated) {
                this.$itemsUpdated = false;
                this.$list.removeChildrenToPool();
                this.$items.forEach(function (o, i) {
                    var item = _this.$list.addItemFromPool();
                    item.name = i < _this.$values.length ? _this.$values[i] : "";
                    item.text = _this.$items[i];
                    item.icon = (_this.$icons != null && i < _this.$icons.length) ? _this.$icons[i] : null;
                }, this);
                this.$list.resizeToFit(this.$visibleItemCount);
            }
            this.$list.selectedIndex = -1;
            this.$dropdown.width = this.width;
            this.root.togglePopup(this.$dropdown, this, this.$popupDir);
            if (this.$dropdown.parent)
                this.setState(fgui.GButton.DOWN);
        };
        GComboBox.prototype.$popupWinClosed = function (evt) {
            if (this.$over)
                this.setState(fgui.GButton.OVER);
            else
                this.setState(fgui.GButton.UP);
        };
        GComboBox.prototype.$clickItem = function (evt, item) {
            fgui.GTimer.inst.add(100, 1, this.delayedClickItem, this, this.$list.getChildIndex(item));
        };
        GComboBox.prototype.delayedClickItem = function (index) {
            if (this.$dropdown.parent instanceof fgui.GRoot)
                this.$dropdown.parent.hidePopup();
            this.$selectedIndex = index;
            if (this.$selectedIndex >= 0)
                this.text = this.$items[this.$selectedIndex];
            else
                this.text = "";
            this.emit("__stateChanged" /* CHANGED */, this);
        };
        GComboBox.prototype.$rollover = function (evt) {
            this.$over = true;
            if (this.$down || this.$dropdown && this.$dropdown.parent)
                return;
            this.setState(fgui.GButton.OVER);
        };
        GComboBox.prototype.$rollout = function (evt) {
            this.$over = false;
            if (this.$down || this.$dropdown && this.$dropdown.parent)
                return;
            this.setState(fgui.GButton.UP);
        };
        GComboBox.prototype.$mousedown = function (evt) {
            evt.stopPropagation();
            //if(evt.currentTarget instanceof PIXI.TextInput)   //TODO: TextInput
            //    return;
            fgui.GRoot.inst.checkPopups(evt.target);
            this.$down = true;
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Up, this.$mouseup, this);
            if (this.$dropdown)
                this.showDropdown();
        };
        GComboBox.prototype.$mouseup = function (evt) {
            if (this.$down) {
                this.$down = false;
                fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$mouseup, this);
                if (this.$dropdown && !this.$dropdown.parent) {
                    if (this.$over)
                        this.setState(fgui.GButton.OVER);
                    else
                        this.setState(fgui.GButton.UP);
                }
            }
        };
        return GComboBox;
    }(fgui.GComponent));
    fgui.GComboBox = GComboBox;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearBase = (function () {
        function GearBase(owner) {
            this.$lockToken = 0;
            this.$owner = owner;
            this.$easeType = fgui.ParseEaseType("Quad.Out");
            this.$tweenTime = 0.3;
            this.$tweenDelay = 0;
        }
        Object.defineProperty(GearBase.prototype, "controller", {
            get: function () {
                return this.$controller;
            },
            set: function (val) {
                if (val != this.$controller) {
                    this.$controller = val;
                    if (this.$controller)
                        this.init();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GearBase.prototype, "tween", {
            get: function () {
                return this.$tween;
            },
            set: function (val) {
                this.$tween = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GearBase.prototype, "tweenDelay", {
            get: function () {
                return this.$tweenDelay;
            },
            set: function (val) {
                this.$tweenDelay = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GearBase.prototype, "tweenTime", {
            get: function () {
                return this.$tweenTime;
            },
            set: function (value) {
                this.$tweenTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GearBase.prototype, "easeType", {
            get: function () {
                return this.$easeType;
            },
            set: function (value) {
                this.$easeType = value;
            },
            enumerable: true,
            configurable: true
        });
        GearBase.prototype.setup = function (xml) {
            var _this = this;
            this.$controller = this.$owner.parent.getController(xml.attributes.controller);
            if (this.$controller == null)
                return;
            this.init();
            var str;
            str = xml.attributes.tween;
            if (str)
                this.$tween = true;
            str = xml.attributes.ease;
            if (str)
                this.$easeType = fgui.ParseEaseType(str);
            str = xml.attributes.duration;
            if (str)
                this.$tweenTime = parseFloat(str);
            str = xml.attributes.delay;
            if (str)
                this.$tweenDelay = parseFloat(str);
            if (this instanceof fgui.GearDisplay) {
                str = xml.attributes.pages;
                if (str)
                    this.pages = str.split(",");
            }
            else {
                var pages_1;
                var values = void 0;
                str = xml.attributes.pages;
                if (str)
                    pages_1 = str.split(",");
                str = xml.attributes.values;
                if (str)
                    values = str.split("|");
                if (pages_1 && values) {
                    values.forEach(function (s, i) {
                        _this.addStatus(pages_1[i], s);
                    });
                }
                str = xml.attributes.default;
                if (str)
                    this.addStatus(null, str);
            }
        };
        GearBase.prototype.updateFromRelations = function (dx, dy) {
        };
        GearBase.prototype.addStatus = function (pageId, value) {
        };
        GearBase.prototype.init = function () {
        };
        GearBase.prototype.apply = function () {
        };
        GearBase.prototype.updateState = function () {
        };
        GearBase.disableAllTweenEffect = false;
        return GearBase;
    }());
    fgui.GearBase = GearBase;
})(fgui || (fgui = {}));
/// <reference path="./GearBase.ts" />
var fgui;
(function (fgui) {
    var GearAnimation = (function (_super) {
        __extends(GearAnimation, _super);
        function GearAnimation(owner) {
            return _super.call(this, owner) || this;
        }
        GearAnimation.prototype.init = function () {
            this.$default = new GearAnimationValue(this.$owner.playing, this.$owner.frame);
            this.$storage = {};
        };
        GearAnimation.prototype.addStatus = function (pageId, value) {
            if (value == "-")
                return;
            var gv;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearAnimationValue();
                this.$storage[pageId] = gv;
            }
            var arr = value.split(",");
            gv.frame = parseInt(arr[0]);
            gv.playing = arr[1] == "p";
        };
        GearAnimation.prototype.apply = function () {
            this.$owner.$gearLocked = true;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;
            this.$owner.frame = gv.frame;
            this.$owner.playing = gv.playing;
            this.$owner.$gearLocked = false;
        };
        GearAnimation.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearAnimationValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }
            gv.frame = this.$owner.frame;
            gv.playing = this.$owner.playing;
        };
        return GearAnimation;
    }(fgui.GearBase));
    fgui.GearAnimation = GearAnimation;
    var GearAnimationValue = (function () {
        function GearAnimationValue(playing, frame) {
            if (playing === void 0) { playing = true; }
            if (frame === void 0) { frame = 0; }
            this.playing = playing;
            this.frame = frame;
        }
        return GearAnimationValue;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearColor = (function (_super) {
        __extends(GearColor, _super);
        function GearColor(owner) {
            var _this = _super.call(this, owner) || this;
            _this.$default = 0;
            return _this;
        }
        GearColor.prototype.init = function () {
            this.$default = this.$owner.color;
            this.$storage = {};
        };
        GearColor.prototype.addStatus = function (pageId, value) {
            if (value == "-")
                return;
            var col = fgui.utils.StringUtil.convertFromHtmlColor(value);
            if (pageId == null)
                this.$default = col;
            else
                this.$storage[pageId] = col;
        };
        GearColor.prototype.apply = function () {
            this.$owner.$gearLocked = true;
            var data = this.$storage[this.$controller.selectedPageId];
            if (data != undefined)
                this.$owner.color = Math.floor(data);
            else
                this.$owner.color = Math.floor(this.$default);
            this.$owner.$gearLocked = false;
        };
        GearColor.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            this.$storage[this.$controller.selectedPageId] = this.$owner.color;
        };
        return GearColor;
    }(fgui.GearBase));
    fgui.GearColor = GearColor;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearDisplay = (function (_super) {
        __extends(GearDisplay, _super);
        function GearDisplay(owner) {
            var _this = _super.call(this, owner) || this;
            _this.$vid = 0;
            _this.$lockToken = 1;
            return _this;
        }
        GearDisplay.prototype.init = function () {
            this.pages = null;
        };
        GearDisplay.prototype.lock = function () {
            this.$vid++;
            return this.$lockToken;
        };
        GearDisplay.prototype.release = function (token) {
            if (token == this.$lockToken)
                this.$vid--;
        };
        Object.defineProperty(GearDisplay.prototype, "connected", {
            get: function () {
                return this.controller == null || this.$vid > 0;
            },
            enumerable: true,
            configurable: true
        });
        GearDisplay.prototype.apply = function () {
            this.$lockToken++;
            if (this.$lockToken <= 0)
                this.$lockToken = 1;
            if (this.pages == null || this.pages.length == 0
                || this.pages.indexOf(this.$controller.selectedPageId) != -1)
                this.$vid = 1;
            else
                this.$vid = 0;
        };
        return GearDisplay;
    }(fgui.GearBase));
    fgui.GearDisplay = GearDisplay;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearIcon = (function (_super) {
        __extends(GearIcon, _super);
        function GearIcon(owner) {
            return _super.call(this, owner) || this;
        }
        GearIcon.prototype.init = function () {
            this.$default = this.$owner.icon;
            this.$storage = {};
        };
        GearIcon.prototype.addStatus = function (pageId, value) {
            if (pageId == null)
                this.$default = value;
            else
                this.$storage[pageId] = value;
        };
        GearIcon.prototype.apply = function () {
            this.$owner.$gearLocked = true;
            var data = this.$storage[this.$controller.selectedPageId];
            if (data != undefined)
                this.$owner.icon = data;
            else
                this.$owner.icon = this.$default;
            this.$owner.$gearLocked = false;
        };
        GearIcon.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            this.$storage[this.$controller.selectedPageId] = this.$owner.icon;
        };
        return GearIcon;
    }(fgui.GearBase));
    fgui.GearIcon = GearIcon;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearLook = (function (_super) {
        __extends(GearLook, _super);
        function GearLook(owner) {
            return _super.call(this, owner) || this;
        }
        GearLook.prototype.init = function () {
            this.$default = new GearLookValue(this.$owner.alpha, this.$owner.rotation, this.$owner.grayed);
            this.$storage = {};
        };
        GearLook.prototype.addStatus = function (pageId, value) {
            if (value == "-")
                return;
            var arr = value.split(",");
            var gv;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearLookValue();
                this.$storage[pageId] = gv;
            }
            gv.alpha = parseFloat(arr[0]);
            gv.rotation = parseInt(arr[1]);
            gv.grayed = arr[2] == "1" ? true : false;
        };
        GearLook.prototype.apply = function () {
            var _this = this;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;
            if (this.$tween && !fgui.UIPackage.$constructingObjects && !fgui.GearBase.disableAllTweenEffect) {
                this.$owner.$gearLocked = true;
                this.$owner.grayed = gv.grayed;
                this.$owner.$gearLocked = false;
                if (this.$tweener) {
                    if (this.$tweenTarget.alpha === gv.alpha && this.$tweenTarget.rotation === gv.rotation)
                        return;
                    this.$tweener.gotoAndStop(this.$tweener.duration); //set to end
                    this.$tweener = null;
                }
                var a_1 = gv.alpha != this.$owner.alpha;
                var b_1 = gv.rotation != this.$owner.rotation;
                if (a_1 || b_1) {
                    if (this.$owner.hasGearController(0, this.$controller))
                        this.$lockToken = this.$owner.lockGearDisplay();
                    this.$tweenTarget = gv;
                    var vars = {
                        onChange: function () {
                            _this.$owner.$gearLocked = true;
                            if (a_1)
                                _this.$owner.alpha = _this.$tweenValue.x;
                            if (b_1)
                                _this.$owner.rotation = _this.$tweenValue.y;
                            _this.$owner.$gearLocked = false;
                        }
                    };
                    if (this.$tweenValue == null)
                        this.$tweenValue = new PIXI.Point();
                    this.$tweenValue.x = this.$owner.alpha;
                    this.$tweenValue.y = this.$owner.rotation;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ x: gv.alpha, y: gv.rotation }, this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenComplete, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.grayed = gv.grayed;
                this.$owner.alpha = gv.alpha;
                this.$owner.rotation = gv.rotation;
                this.$owner.$gearLocked = false;
            }
        };
        GearLook.prototype.tweenComplete = function () {
            if (this.$lockToken != 0) {
                this.$owner.releaseGearDisplay(this.$lockToken);
                this.$lockToken = 0;
            }
            this.$tweener = null;
            this.$owner.emit("__gearStop" /* GEAR_STOP */, this);
        };
        GearLook.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearLookValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }
            gv.alpha = this.$owner.alpha;
            gv.rotation = this.$owner.rotation;
            gv.grayed = this.$owner.grayed;
        };
        return GearLook;
    }(fgui.GearBase));
    fgui.GearLook = GearLook;
    var GearLookValue = (function () {
        function GearLookValue(alpha, rotation, grayed) {
            if (alpha === void 0) { alpha = 0; }
            if (rotation === void 0) { rotation = 0; }
            if (grayed === void 0) { grayed = false; }
            this.alpha = alpha;
            this.rotation = rotation;
            this.grayed = grayed;
        }
        return GearLookValue;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearSize = (function (_super) {
        __extends(GearSize, _super);
        function GearSize(owner) {
            return _super.call(this, owner) || this;
        }
        GearSize.prototype.init = function () {
            this.$default = new GearSizeValue(this.$owner.width, this.$owner.height, this.$owner.scaleX, this.$owner.scaleY);
            this.$storage = {};
        };
        GearSize.prototype.addStatus = function (pageId, value) {
            if (value == "-")
                return;
            var arr = value.split(",");
            var gv;
            if (pageId == null)
                gv = this.$default;
            else {
                gv = new GearSizeValue();
                this.$storage[pageId] = gv;
            }
            gv.width = parseInt(arr[0]);
            gv.height = parseInt(arr[1]);
            if (arr.length > 2) {
                gv.scaleX = parseFloat(arr[2]);
                gv.scaleY = parseFloat(arr[3]);
            }
        };
        GearSize.prototype.apply = function () {
            var _this = this;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv)
                gv = this.$default;
            if (this.$tween && !fgui.UIPackage.$constructingObjects && !fgui.GearBase.disableAllTweenEffect) {
                if (this.$tweener) {
                    if (this.$tweenTarget.width != gv.width || this.$tweenTarget.height != gv.height
                        || this.$tweenTarget.scaleX != gv.scaleX || this.$tweenTarget.scaleY != gv.scaleY) {
                        this.$tweener.gotoAndStop(this.$tweener.duration); //set to end
                        this.$tweener = null;
                    }
                    else
                        return;
                }
                var a_2 = gv.width != this.$owner.width || gv.height != this.$owner.height;
                var b_2 = gv.scaleX != this.$owner.scaleX || gv.scaleY != this.$owner.scaleY;
                if (a_2 || b_2) {
                    if (this.$owner.hasGearController(0, this.$controller))
                        this.$lockToken = this.$owner.lockGearDisplay();
                    this.$tweenTarget = gv;
                    var vars = {
                        onChange: function () {
                            _this.$owner.$gearLocked = true;
                            if (a_2)
                                _this.$owner.setSize(_this.$tweenValue.width, _this.$tweenValue.height, _this.$owner.gearXY.controller == _this.$controller);
                            if (b_2)
                                _this.$owner.setScale(_this.$tweenValue.scaleX, _this.$tweenValue.scaleY);
                            _this.$owner.$gearLocked = false;
                        }
                    };
                    if (this.$tweenValue == null)
                        this.$tweenValue = new GearSizeValue();
                    this.$tweenValue.width = this.$owner.width;
                    this.$tweenValue.height = this.$owner.height;
                    this.$tweenValue.scaleX = this.$owner.scaleX;
                    this.$tweenValue.scaleY = this.$owner.scaleY;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ width: gv.width, height: gv.height, scaleX: gv.scaleX, scaleY: gv.scaleY }, this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenComplete, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.setSize(gv.width, gv.height, this.$owner.gearXY.controller == this.$controller);
                this.$owner.setScale(gv.scaleX, gv.scaleY);
                this.$owner.$gearLocked = false;
            }
        };
        GearSize.prototype.tweenComplete = function () {
            if (this.$lockToken != 0) {
                this.$owner.releaseGearDisplay(this.$lockToken);
                this.$lockToken = 0;
            }
            this.$tweener = null;
            this.$owner.emit("__gearStop" /* GEAR_STOP */, this);
        };
        GearSize.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            var gv = this.$storage[this.$controller.selectedPageId];
            if (!gv) {
                gv = new GearSizeValue();
                this.$storage[this.$controller.selectedPageId] = gv;
            }
            gv.width = this.$owner.width;
            gv.height = this.$owner.height;
            gv.scaleX = this.$owner.scaleX;
            gv.scaleY = this.$owner.scaleY;
        };
        GearSize.prototype.updateFromRelations = function (dx, dy) {
            if (this.$controller == null || this.$storage == null)
                return;
            for (var key in this.$storage) {
                var gv = this.$storage[key];
                gv.width += dx;
                gv.height += dy;
            }
            this.$default.width += dx;
            this.$default.height += dy;
            this.updateState();
        };
        return GearSize;
    }(fgui.GearBase));
    fgui.GearSize = GearSize;
    var GearSizeValue = (function () {
        function GearSizeValue(width, height, scaleX, scaleY) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (scaleX === void 0) { scaleX = 0; }
            if (scaleY === void 0) { scaleY = 0; }
            this.width = width;
            this.height = height;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        return GearSizeValue;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearText = (function (_super) {
        __extends(GearText, _super);
        function GearText(owner) {
            return _super.call(this, owner) || this;
        }
        GearText.prototype.init = function () {
            this.$default = this.$owner.text;
            this.$storage = {};
        };
        GearText.prototype.addStatus = function (pageId, value) {
            if (pageId == null)
                this.$default = value;
            else
                this.$storage[pageId] = value;
        };
        GearText.prototype.apply = function () {
            this.$owner.$gearLocked = true;
            var data = this.$storage[this.$controller.selectedPageId];
            if (data != undefined)
                this.$owner.text = data;
            else
                this.$owner.text = this.$default;
            this.$owner.$gearLocked = false;
        };
        GearText.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            this.$storage[this.$controller.selectedPageId] = this.$owner.text;
        };
        return GearText;
    }(fgui.GearBase));
    fgui.GearText = GearText;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GearXY = (function (_super) {
        __extends(GearXY, _super);
        function GearXY(owner) {
            return _super.call(this, owner) || this;
        }
        GearXY.prototype.init = function () {
            this.$default = new PIXI.Point(this.$owner.x, this.$owner.y);
            this.$storage = {};
        };
        GearXY.prototype.addStatus = function (pageId, value) {
            if (value == "-")
                return;
            var arr = value.split(",");
            var pt;
            if (pageId == null)
                pt = this.$default;
            else {
                pt = new PIXI.Point();
                this.$storage[pageId] = pt;
            }
            pt.x = parseInt(arr[0]);
            pt.y = parseInt(arr[1]);
        };
        GearXY.prototype.apply = function () {
            var _this = this;
            var pt = this.$storage[this.$controller.selectedPageId];
            if (!pt)
                pt = this.$default;
            if (this.$tween && !fgui.UIPackage.$constructingObjects && !fgui.GearBase.disableAllTweenEffect) {
                if (this.$tweener) {
                    if (this.$tweenTarget.x === pt.x && this.$tweenTarget.y === pt.y)
                        return;
                    this.$tweener.gotoAndStop(this.$tweener.duration); //set to end
                    this.$tweener = null;
                }
                if (this.$owner.x != pt.x || this.$owner.y != pt.y) {
                    this.$owner.hasGearController(0, this.$controller);
                    this.$lockToken = this.$owner.lockGearDisplay();
                    this.$tweenTarget = pt;
                    var vars = {
                        onChange: function () {
                            _this.$owner.$gearLocked = true;
                            _this.$owner.setXY(_this.$tweenValue.x, _this.$tweenValue.y);
                            _this.$owner.$gearLocked = false;
                        }
                    };
                    if (this.$tweenValue == null)
                        this.$tweenValue = new PIXI.Point();
                    this.$tweenValue.x = this.$owner.x;
                    this.$tweenValue.y = this.$owner.y;
                    this.$tweener = createjs.Tween.get(this.$tweenValue, vars)
                        .wait(this.$tweenDelay * 1000)
                        .to({ x: pt.x, y: pt.y }, this.$tweenTime * 1000, this.$easeType)
                        .call(this.tweenComplete, null, this);
                }
            }
            else {
                this.$owner.$gearLocked = true;
                this.$owner.setXY(pt.x, pt.y);
                this.$owner.$gearLocked = false;
            }
        };
        GearXY.prototype.tweenComplete = function () {
            if (this.$lockToken != 0) {
                this.$owner.releaseGearDisplay(this.$lockToken);
                this.$lockToken = 0;
            }
            this.$tweener = null;
            this.$owner.emit("__gearStop" /* GEAR_STOP */, this);
        };
        GearXY.prototype.updateState = function () {
            if (this.$controller == null || this.$owner.$gearLocked || this.$owner.$inProgressBuilding)
                return;
            var pt = this.$storage[this.$controller.selectedPageId];
            if (!pt) {
                pt = new PIXI.Point();
                this.$storage[this.$controller.selectedPageId] = pt;
            }
            pt.x = this.$owner.x;
            pt.y = this.$owner.y;
        };
        GearXY.prototype.updateFromRelations = function (dx, dy) {
            if (this.$controller == null || this.$storage == null)
                return;
            for (var key in this.$storage) {
                var pt = this.$storage[key];
                pt.x += dx;
                pt.y += dy;
            }
            this.$default.x += dx;
            this.$default.y += dy;
            this.updateState();
        };
        return GearXY;
    }(fgui.GearBase));
    fgui.GearXY = GearXY;
})(fgui || (fgui = {}));
/// <reference path="./GObject.ts" />
var fgui;
(function (fgui) {
    var GGraph = (function (_super) {
        __extends(GGraph, _super);
        function GGraph() {
            var _this = _super.call(this) || this;
            _this.$type = 0;
            _this.$lineSize = 0;
            _this.$lineColor = 0;
            _this.$fillColor = 0;
            _this.$lineSize = 1;
            _this.$lineAlpha = 1;
            _this.$fillAlpha = 1;
            _this.$fillColor = 0xFFFFFF;
            return _this;
        }
        GGraph.prototype.drawRect = function (lineSize, lineColor, lineAlpha, fillColor, fillAlpha, corner) {
            if (corner === void 0) { corner = null; }
            this.$type = 1;
            this.$lineSize = lineSize;
            this.$lineColor = lineColor;
            this.$lineAlpha = lineAlpha;
            this.$fillColor = fillColor;
            this.$fillAlpha = fillAlpha;
            this.$corner = corner;
            this.drawGraph();
        };
        GGraph.prototype.drawEllipse = function (lineSize, lineColor, lineAlpha, fillColor, fillAlpha) {
            this.$type = 2;
            this.$lineSize = lineSize;
            this.$lineColor = lineColor;
            this.$lineAlpha = lineAlpha;
            this.$fillColor = fillColor;
            this.$fillAlpha = fillAlpha;
            this.$corner = null;
            this.drawGraph();
        };
        Object.defineProperty(GGraph.prototype, "color", {
            get: function () {
                return this.$fillColor;
            },
            set: function (value) {
                this.$fillColor = value;
                if (this.$type != 0)
                    this.drawGraph();
            },
            enumerable: true,
            configurable: true
        });
        GGraph.prototype.drawGraph = function () {
            var g = this.$displayObject;
            g.interactive = this.touchable;
            g.clear();
            var w = this.width;
            var h = this.height;
            if (w == 0 || h == 0)
                return;
            if (this.$lineSize == 0)
                g.lineStyle(0, 0, 0);
            else
                g.lineStyle(this.$lineSize, this.$lineColor, this.$lineAlpha);
            g.beginFill(this.$fillColor, this.$fillAlpha);
            if (this.$type == 1) {
                if (this.$corner && this.$corner.length >= 1) {
                    //if (this.$corner.length == 1)
                    g.drawRoundedRect(0, 0, w, h, this.$corner[0]); //PIXI does not support 4 corners with different radius, so only apply the first number in this array
                    //else
                    //    g.drawRoundedRect(0, 0, w, h, this.$corner[0], this.$corner[1], this.$corner[2], this.$corner[3]);
                }
                else
                    g.drawRect(0, 0, w, h);
            }
            else {
                var halfW = w * .5, halfH = h * .5;
                if (w == h)
                    g.drawCircle(halfW, halfW, halfW);
                else
                    g.drawEllipse(halfW, halfH, halfW, halfH);
            }
            g.endFill();
        };
        GGraph.prototype.replaceMe = function (target) {
            if (!this.$parent)
                throw new Error("parent not set");
            target.name = this.name;
            target.alpha = this.alpha;
            target.rotation = this.rotation;
            target.visible = this.visible;
            target.touchable = this.touchable;
            target.grayed = this.grayed;
            target.setXY(this.x, this.y);
            target.setSize(this.width, this.height);
            var index = this.$parent.getChildIndex(this);
            this.$parent.addChildAt(target, index);
            target.relations.copyFrom(this.relations);
            this.$parent.removeChild(this, true);
        };
        GGraph.prototype.addBeforeMe = function (target) {
            if (this.$parent == null)
                throw new Error("parent not set");
            var index = this.$parent.getChildIndex(this);
            this.$parent.addChildAt(target, index);
        };
        GGraph.prototype.addAfterMe = function (target) {
            if (this.$parent == null)
                throw new Error("parent not set");
            var index = this.$parent.getChildIndex(this);
            index++;
            this.$parent.addChildAt(target, index);
        };
        GGraph.prototype.setNativeObject = function (obj) {
            this.$type = 0;
            var g = this.$displayObject;
            g.interactive = this.touchable;
            g.clear();
            g.removeChildren(); //clear old
            g.addChild(obj);
        };
        GGraph.prototype.createDisplayObject = function () {
            this.$displayObject = new fgui.UISprite(this);
        };
        GGraph.prototype.handleSizeChanged = function () {
            if (this.$type != 0)
                this.drawGraph();
        };
        GGraph.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            var type = xml.attributes.type;
            if (type && type != "empty") {
                var str = void 0;
                str = xml.attributes.lineSize;
                if (str)
                    this.$lineSize = parseInt(str);
                var c = void 0;
                str = xml.attributes.lineColor;
                if (str) {
                    c = fgui.utils.StringUtil.convertFromHtmlColor(str, true);
                    this.$lineColor = c & 0xFFFFFF;
                    this.$lineAlpha = ((c >> 24) & 0xFF) / 0xFF;
                }
                str = xml.attributes.fillColor;
                if (str) {
                    c = fgui.utils.StringUtil.convertFromHtmlColor(str, true);
                    this.$fillColor = c & 0xFFFFFF;
                    this.$fillAlpha = ((c >> 24) & 0xFF) / 0xFF;
                }
                var arr = void 0;
                str = xml.attributes.corner;
                if (str) {
                    arr = str.split(",");
                    if (arr.length > 1)
                        this.$corner = [parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3])];
                    else
                        this.$corner = [parseInt(arr[0])];
                }
                if (type == "rect")
                    this.$type = 1;
                else
                    this.$type = 2;
                this.drawGraph();
            }
        };
        return GGraph;
    }(fgui.GObject));
    fgui.GGraph = GGraph;
})(fgui || (fgui = {}));
/// <reference path="./GObject.ts" />
var fgui;
(function (fgui) {
    var GGroup = (function (_super) {
        __extends(GGroup, _super);
        function GGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GGroup.prototype.createDisplayObject = function () {
            var c = new fgui.UIContainer(this);
            c.interactive = false;
            this.setDisplayObject(c);
        };
        GGroup.prototype.updateBounds = function () {
            if (this.$updating || !this.parent)
                return;
            var cnt = this.$parent.numChildren;
            var i = 0;
            var ax = Number.POSITIVE_INFINITY, ay = Number.POSITIVE_INFINITY;
            var ar = Number.NEGATIVE_INFINITY, ab = Number.NEGATIVE_INFINITY;
            this.$empty = true;
            var child;
            var tmp = 0;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this) {
                    tmp = child.x;
                    if (tmp < ax)
                        ax = tmp;
                    tmp = child.y;
                    if (tmp < ay)
                        ay = tmp;
                    tmp = child.x + child.width;
                    if (tmp > ar)
                        ar = tmp;
                    tmp = child.y + child.height;
                    if (tmp > ab)
                        ab = tmp;
                    this.$empty = false;
                }
            }
            this.$updating = true;
            if (!this.$empty) {
                this.setXY(ax, ay);
                this.setSize(ar - ax, ab - ay);
            }
            else
                this.setSize(0, 0);
            this.$updating = false;
        };
        GGroup.prototype.setXY = function (xv, yv) {
            if (this.$x != xv || this.$y != yv) {
                var dx = xv - this.$x;
                var dy = yv - this.$y;
                _super.prototype.setXY.call(this, xv, yv);
                this.moveChildren(dx, dy);
            }
        };
        GGroup.prototype.moveChildren = function (dx, dy) {
            if (this.$updating || !this.$parent)
                return;
            this.$updating = true;
            var cnt = this.$parent.numChildren;
            var i = 0;
            var child;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this) {
                    child.setXY(child.x + dx, child.y + dy);
                }
            }
            this.$updating = false;
        };
        GGroup.prototype.updateAlpha = function () {
            _super.prototype.updateAlpha.call(this);
            if (this.$inProgressBuilding)
                return;
            var cnt = this.$parent.numChildren;
            var i;
            var child;
            for (i = 0; i < cnt; i++) {
                child = this.$parent.getChildAt(i);
                if (child.group == this)
                    child.alpha = this.alpha;
            }
        };
        return GGroup;
    }(fgui.GObject));
    fgui.GGroup = GGroup;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GImage = (function (_super) {
        __extends(GImage, _super);
        function GImage() {
            return _super.call(this) || this;
        }
        Object.defineProperty(GImage.prototype, "touchable", {
            get: function () {
                return false;
            },
            set: function (value) {
                this.$touchable = false; //GImage has no interaction
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GImage.prototype, "color", {
            get: function () {
                return this.$content.tint;
            },
            set: function (value) {
                if (this.color != value) {
                    this.updateGear(4 /* Color */);
                    this.$content.tint = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GImage.prototype, "flip", {
            get: function () {
                return this.$flip;
            },
            set: function (value) {
                if (this.$flip != value) {
                    this.$flip = value;
                    var sx = 1, sy = 1;
                    if (this.$flip == 1 /* Horizontal */ || this.$flip == 3 /* Both */)
                        sx = -1;
                    if (this.$flip == 2 /* Vertical */ || this.$flip == 3 /* Both */)
                        sy = -1;
                    this.$content.scale.set(sx, sy);
                    this.handleXYChanged();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GImage.prototype, "texture", {
            get: function () {
                return this.$content.texture;
            },
            set: function (value) {
                if (value != null) {
                    this.$sourceWidth = value.orig.width;
                    this.$sourceHeight = value.orig.height;
                }
                else
                    this.$sourceWidth = this.$sourceHeight = 0;
                this.$initWidth = this.$sourceWidth;
                this.$initHeight = this.$sourceHeight;
                this.$content.texture = value;
            },
            enumerable: true,
            configurable: true
        });
        GImage.prototype.createDisplayObject = function () {
            this.$content = new fgui.UIImage(this);
            this.setDisplayObject(this.$content);
        };
        GImage.prototype.dispose = function () {
            this.$content.destroy();
            _super.prototype.dispose.call(this);
        };
        GImage.prototype.constructFromResource = function () {
            this.$sourceWidth = this.packageItem.width;
            this.$sourceHeight = this.packageItem.height;
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;
            this.$content.$initDisp(this.packageItem);
            this.setSize(this.$sourceWidth, this.$sourceHeight);
        };
        GImage.prototype.handleXYChanged = function () {
            _super.prototype.handleXYChanged.call(this);
            if (this.$flip != 0 /* None */) {
                if (this.$content.scale.x == -1)
                    this.$content.x += this.width;
                if (this.$content.scale.y == -1)
                    this.$content.y += this.height;
            }
        };
        GImage.prototype.handleSizeChanged = function () {
            this.$content.width = this.width;
            this.$content.height = this.height;
        };
        GImage.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            var str;
            str = xml.attributes.color;
            if (str)
                this.color = fgui.utils.StringUtil.convertFromHtmlColor(str);
            str = xml.attributes.flip;
            if (str)
                this.flip = fgui.ParseFlipType(str);
        };
        return GImage;
    }(fgui.GObject));
    fgui.GImage = GImage;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GLabel = (function (_super) {
        __extends(GLabel, _super);
        function GLabel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(GLabel.prototype, "icon", {
            get: function () {
                if (this.$iconObject != null)
                    return this.$iconObject.icon;
                return null;
            },
            set: function (value) {
                if (this.$iconObject != null)
                    this.$iconObject.icon = value;
                this.updateGear(7 /* Icon */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLabel.prototype, "title", {
            get: function () {
                if (this.$titleObject)
                    return this.$titleObject.text;
                else
                    return null;
            },
            set: function (value) {
                if (this.$titleObject)
                    this.$titleObject.text = value;
                this.updateGear(6 /* Text */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLabel.prototype, "text", {
            get: function () {
                return this.title;
            },
            set: function (value) {
                this.title = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLabel.prototype, "titleColor", {
            get: function () {
                if (fgui.isColorableTitle(this.$titleObject))
                    return this.$titleObject.titleColor;
                return 0;
            },
            set: function (value) {
                if (fgui.isColorableTitle(this.$titleObject))
                    this.$titleObject.titleColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLabel.prototype, "fontSize", {
            get: function () {
                if (fgui.isColorableTitle(this.$titleObject))
                    return this.$titleObject.fontSize;
                return 0;
            },
            set: function (value) {
                if (fgui.isColorableTitle(this.$titleObject))
                    this.$titleObject.fontSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLabel.prototype, "editable", {
            get: function () {
                if (this.$titleObject && (this.$titleObject instanceof fgui.GTextInput))
                    return this.$titleObject.editable;
                else
                    return false;
            },
            set: function (val) {
                if (this.$titleObject)
                    this.$titleObject.editable = val;
            },
            enumerable: true,
            configurable: true
        });
        GLabel.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            this.$titleObject = this.getChild("title");
            this.$iconObject = this.getChild("icon");
        };
        GLabel.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            var cs = fgui.utils.XmlParser.getChildNodes(xml, "Label");
            if (cs && cs.length > 0) {
                xml = cs[0];
                var str = void 0;
                str = xml.attributes.title;
                if (str)
                    this.text = str;
                str = xml.attributes.icon;
                if (str)
                    this.icon = str;
                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = fgui.utils.StringUtil.convertFromHtmlColor(str);
                if (this.$titleObject instanceof fgui.GTextInput) {
                    str = xml.attributes.prompt;
                    var ti = this.$titleObject;
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
        };
        return GLabel;
    }(fgui.GComponent));
    fgui.GLabel = GLabel;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var ItemInfo = (function () {
        function ItemInfo() {
            this.width = 0;
            this.height = 0;
        }
        return ItemInfo;
    }());
    var GList = (function (_super) {
        __extends(GList, _super);
        function GList() {
            var _this = _super.call(this) || this;
            _this.scrollItemToViewOnClick = true;
            _this.foldInvisibleItems = false;
            _this.$lineCount = 0;
            _this.$columnCount = 0;
            _this.$lineGap = 0;
            _this.$columnGap = 0;
            _this.$numItems = 0;
            _this.$realNumItems = 0;
            _this.$firstIndex = 0;
            _this.$curLineItemCount = 0; //item count in one row
            _this.$curLineItemCount2 = 0; //only for page mode, represents the item count on vertical direction
            _this.$virtualListChanged = 0; //1-content changed, 2-size changed
            //render sorting type
            _this.$apexIndex = 0;
            _this.$childrenRenderOrder = 0 /* Ascent */;
            _this.$trackBounds = true;
            _this.$pool = new fgui.utils.GObjectRecycler();
            _this.$layout = 0 /* SingleColumn */;
            _this.$autoResizeItem = true;
            //this.$lastSelectedIndex = -1;
            _this.$selectionMode = 0 /* Single */;
            _this.opaque = true;
            _this.$align = "left" /* Left */;
            _this.$verticalAlign = 0 /* Top */;
            _this.$container = new PIXI.Container();
            _this.$rootContainer.addChild(_this.$container);
            return _this;
        }
        Object.defineProperty(GList.prototype, "childrenRenderOrder", {
            get: function () {
                return this.$childrenRenderOrder;
            },
            set: function (value) {
                if (this.$childrenRenderOrder != value) {
                    this.$childrenRenderOrder = value;
                    this.appendChildrenList();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "apexIndex", {
            get: function () {
                return this.$apexIndex;
            },
            set: function (value) {
                if (this.$apexIndex != value) {
                    this.$apexIndex = value;
                    if (this.$childrenRenderOrder == 2 /* Arch */)
                        this.appendChildrenList();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**@override */
        GList.prototype.appendChildrenList = function () {
            var cnt = this.$children.length;
            if (cnt == 0)
                return;
            var i;
            var child;
            switch (this.$childrenRenderOrder) {
                case 0 /* Ascent */:
                    {
                        for (i = 0; i < cnt; i++) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;
                case 1 /* Descent */:
                    {
                        for (i = cnt - 1; i >= 0; i--) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;
                case 2 /* Arch */:
                    {
                        for (i = 0; i < this.$apexIndex; i++) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                        for (i = cnt - 1; i >= this.$apexIndex; i--) {
                            child = this.$children[i];
                            if (child.displayObject != null && child.finalVisible)
                                this.$container.addChild(child.displayObject);
                        }
                    }
                    break;
            }
        };
        /**@override */
        GList.prototype.setXY = function (xv, yv) {
            if (this.$x != xv || this.$y != yv) {
                this.$x = xv;
                this.$y = yv;
                this.handleXYChanged();
                this.updateGear(1 /* XY */);
                if (fgui.GObject.draggingObject == this && !fgui.GObject.sUpdatingWhileDragging)
                    this.localToGlobalRect(0, 0, this.width, this.height, fgui.GObject.sGlobalRect);
            }
        };
        /**@override */
        GList.prototype.$setChildIndex = function (child, oldIndex, index) {
            if (index === void 0) { index = 0; }
            var cnt = this.$children.length;
            if (index > cnt)
                index = cnt;
            if (oldIndex == index)
                return oldIndex;
            this.$children.splice(oldIndex, 1);
            this.$children.splice(index, 0, child);
            if (child.inContainer) {
                var displayIndex = 0;
                var g = void 0;
                var i = void 0;
                if (this.$childrenRenderOrder == 0 /* Ascent */) {
                    for (i = 0; i < index; i++) {
                        g = this.$children[i];
                        if (g.inContainer)
                            displayIndex++;
                    }
                    if (displayIndex == this.$container.children.length)
                        displayIndex--;
                    this.$container.setChildIndex(child.displayObject, displayIndex);
                }
                else if (this.$childrenRenderOrder == 1 /* Descent */) {
                    for (i = cnt - 1; i > index; i--) {
                        g = this.$children[i];
                        if (g.inContainer)
                            displayIndex++;
                    }
                    if (displayIndex == this.$container.children.length)
                        displayIndex--;
                    this.$container.setChildIndex(child.displayObject, displayIndex);
                }
                else
                    fgui.GTimer.inst.callLater(this.appendChildrenList, this);
                this.setBoundsChangedFlag();
            }
            return index;
        };
        /**@override */
        GList.prototype.childStateChanged = function (child) {
            var _this = this;
            if (this.$buildingDisplayList)
                return;
            if (child instanceof fgui.GGroup) {
                this.$children.forEach(function (g) {
                    if (g.group == child)
                        _this.childStateChanged(g);
                }, this);
                return;
            }
            if (!child.displayObject)
                return;
            if (child.finalVisible) {
                var i = void 0, g = void 0;
                var cnt = this.$children.length;
                if (!child.displayObject.parent) {
                    var index = 0;
                    if (this.$childrenRenderOrder == 0 /* Ascent */) {
                        for (var i_1 = 0; i_1 < cnt; i_1++) {
                            g = this.$children[i_1];
                            if (g == child)
                                break;
                            if (g.displayObject != null && g.displayObject.parent != null)
                                index++;
                        }
                        this.$container.addChildAt(child.displayObject, index);
                    }
                    else if (this.$childrenRenderOrder == 1 /* Descent */) {
                        for (i = cnt - 1; i >= 0; i--) {
                            g = this.$children[i];
                            if (g == child)
                                break;
                            if (g.displayObject != null && g.displayObject.parent != null)
                                index++;
                        }
                        this.$container.addChildAt(child.displayObject, index);
                    }
                    else {
                        this.$container.addChild(child.displayObject);
                        fgui.GTimer.inst.callLater(this.appendChildrenList, this);
                    }
                }
            }
            else {
                if (child.displayObject.parent)
                    this.$container.removeChild(child.displayObject);
            }
        };
        GList.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this._refreshVirtualList, this);
            this.$pool.clear();
            if (this.$scrollPane) {
                this.$scrollPane.off("__scroll" /* SCROLL */, this.$scrolled, this);
                this.$scrollPane.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(GList.prototype, "layout", {
            get: function () {
                return this.$layout;
            },
            set: function (value) {
                if (this.$layout != value) {
                    this.$layout = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "lineCount", {
            get: function () {
                return this.$lineCount;
            },
            set: function (value) {
                if (this.$lineCount != value) {
                    this.$lineCount = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "columnCount", {
            get: function () {
                return this.$columnCount;
            },
            set: function (value) {
                if (this.$columnCount != value) {
                    this.$columnCount = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "lineGap", {
            get: function () {
                return this.$lineGap;
            },
            set: function (value) {
                if (this.$lineGap != value) {
                    this.$lineGap = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "columnGap", {
            get: function () {
                return this.$columnGap;
            },
            set: function (value) {
                if (this.$columnGap != value) {
                    this.$columnGap = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "align", {
            get: function () {
                return this.$align;
            },
            set: function (value) {
                if (this.$align != value) {
                    this.$align = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "verticalAlign", {
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                if (this.$verticalAlign != value) {
                    this.$verticalAlign = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "virtualItemSize", {
            get: function () {
                return this.$itemSize;
            },
            set: function (value) {
                if (this.$virtual) {
                    if (this.$itemSize == null)
                        this.$itemSize = new PIXI.Point();
                    this.$itemSize.copy(value);
                    this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "defaultItem", {
            get: function () {
                return this.$defaultItem;
            },
            set: function (val) {
                this.$defaultItem = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "autoResizeItem", {
            get: function () {
                return this.$autoResizeItem;
            },
            set: function (value) {
                if (this.$autoResizeItem != value) {
                    this.$autoResizeItem = value;
                    this.setBoundsChangedFlag();
                    if (this.$virtual)
                        this.setVirtualListChangedFlag(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "selectionMode", {
            get: function () {
                return this.$selectionMode;
            },
            set: function (value) {
                this.$selectionMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "selectionController", {
            get: function () {
                return this.$selectionController;
            },
            set: function (value) {
                this.$selectionController = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GList.prototype, "itemPool", {
            get: function () {
                return this.$pool;
            },
            enumerable: true,
            configurable: true
        });
        GList.prototype.getFromPool = function (url) {
            if (url === void 0) { url = null; }
            if (!url)
                url = this.$defaultItem;
            var obj = this.$pool.get(url);
            if (obj != null)
                obj.visible = true;
            return obj;
        };
        GList.prototype.returnToPool = function (obj) {
            obj.displayObject.cacheAsBitmap = false;
            this.$pool.recycle(obj.resourceURL, obj);
        };
        GList.prototype.addChildAt = function (child, index) {
            if (index === void 0) { index = 0; }
            _super.prototype.addChildAt.call(this, child, index);
            if (child instanceof fgui.GButton) {
                var button = child;
                button.selected = false;
                button.changeStateOnClick = false;
            }
            child.click(this.$clickItem, this);
            return child;
        };
        GList.prototype.addItem = function (url) {
            if (url === void 0) { url = null; }
            if (!url)
                url = this.$defaultItem;
            return this.addChild(fgui.UIPackage.createObjectFromURL(url));
        };
        GList.prototype.addItemFromPool = function (url) {
            if (url === void 0) { url = null; }
            return this.addChild(this.getFromPool(url));
        };
        GList.prototype.removeChildAt = function (index, dispose) {
            if (dispose === void 0) { dispose = false; }
            if (index >= 0 && index < this.numChildren) {
                var child = this.$children[index];
                child.parent = null;
                if (child.sortingOrder != 0)
                    this.$sortingChildCount--;
                this.$children.splice(index, 1);
                if (child.inContainer) {
                    this.$container.removeChild(child.displayObject);
                    if (this.$childrenRenderOrder == 2 /* Arch */)
                        fgui.GTimer.inst.callLater(this.appendChildrenList, this);
                }
                if (dispose === true)
                    child.dispose();
                this.setBoundsChangedFlag();
                child.removeClick(this.$clickItem, this);
                return child;
            }
            else
                throw new Error("Invalid child index");
        };
        GList.prototype.removeChildToPoolAt = function (index) {
            if (index === void 0) { index = 0; }
            var child = _super.prototype.removeChildAt.call(this, index);
            this.returnToPool(child);
        };
        GList.prototype.removeChildToPool = function (child) {
            _super.prototype.removeChild.call(this, child);
            this.returnToPool(child);
        };
        GList.prototype.removeChildrenToPool = function (beginIndex, endIndex) {
            if (beginIndex === void 0) { beginIndex = 0; }
            if (endIndex === void 0) { endIndex = -1; }
            if (endIndex < 0 || endIndex >= this.$children.length)
                endIndex = this.$children.length - 1;
            for (var i = beginIndex; i <= endIndex; ++i)
                this.removeChildToPoolAt(beginIndex);
        };
        Object.defineProperty(GList.prototype, "selectedIndex", {
            get: function () {
                var cnt = this.$children.length;
                for (var i = 0; i < cnt; i++) {
                    var obj = this.$children[i];
                    if (obj != null && obj.selected)
                        return this.childIndexToItemIndex(i);
                }
                return -1;
            },
            set: function (value) {
                this.clearSelection();
                if (value >= 0 && value < this.numItems)
                    this.addSelection(value);
            },
            enumerable: true,
            configurable: true
        });
        GList.prototype.getSelection = function () {
            var _this = this;
            var ret = [];
            this.$children.forEach(function (child, index) {
                if (child != null && child.selected)
                    ret.push(_this.childIndexToItemIndex(index));
            }, this);
            return ret;
        };
        GList.prototype.addSelection = function (index, scrollItToView) {
            if (scrollItToView === void 0) { scrollItToView = false; }
            if (this.$selectionMode == 3 /* None */)
                return;
            this.checkVirtualList();
            if (this.$selectionMode == 0 /* Single */)
                this.clearSelection();
            if (scrollItToView)
                this.scrollToView(index);
            index = this.itemIndexToChildIndex(index);
            if (index < 0 || index >= this.$children.length)
                return;
            var obj = this.getChildAt(index);
            if (obj != null && !obj.selected) {
                obj.selected = true;
                this.updateSelectionController(index);
            }
        };
        GList.prototype.removeSelection = function (index) {
            if (index === void 0) { index = 0; }
            if (this.$selectionMode == 3 /* None */)
                return;
            index = this.itemIndexToChildIndex(index);
            if (index >= this.$children.length)
                return;
            var obj = this.getChildAt(index);
            if (obj != null && obj.selected)
                obj.selected = false;
        };
        GList.prototype.clearSelection = function () {
            this.$children.forEach(function (child) {
                if (child != null)
                    child.selected = false;
            }, this);
        };
        GList.prototype.selectAll = function () {
            this.checkVirtualList();
            var last = -1;
            this.$children.forEach(function (child, index) {
                if (child) {
                    child.selected = true;
                    last = index;
                }
            }, this);
            if (last != -1)
                this.updateSelectionController(last);
        };
        GList.prototype.selectNone = function () {
            this.$children.forEach(function (child) {
                if (child && child instanceof fgui.GButton)
                    child.selected = false;
            }, this);
        };
        GList.prototype.selectReverse = function () {
            this.checkVirtualList();
            var last = -1;
            this.$children.forEach(function (child, index) {
                if (child && child instanceof fgui.GButton) {
                    child.selected = !child.selected;
                    if (child.selected)
                        last = index;
                }
            }, this);
            if (last != -1)
                this.updateSelectionController(last);
        };
        GList.prototype.handleArrowKey = function (dir) {
            if (dir === void 0) { dir = 0; }
            var index = this.selectedIndex;
            if (index == -1)
                return;
            var obj, current;
            var i, k, cnt;
            switch (dir) {
                case 1://up
                    if (this.$layout == 0 /* SingleColumn */ || this.$layout == 3 /* FlowVertical */) {
                        index--;
                        if (index >= 0) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == 2 /* FlowHorizontal */ || this.$layout == 4 /* Pagination */) {
                        current = this.$children[index];
                        k = 0;
                        for (var i_2 = index - 1; i_2 >= 0; i_2--) {
                            obj = this.$children[i_2];
                            if (obj.y != current.y) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                this.clearSelection();
                                this.addSelection(i + k + 1, true);
                                break;
                            }
                        }
                    }
                    break;
                case 3://right
                    if (this.$layout == 1 /* SingleRow */ || this.$layout == 2 /* FlowHorizontal */ || this.$layout == 4 /* Pagination */) {
                        index++;
                        if (index < this.$children.length) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == 3 /* FlowVertical */) {
                        current = this.$children[index];
                        k = 0;
                        cnt = this.$children.length;
                        for (i = index + 1; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                this.clearSelection();
                                this.addSelection(i - k - 1, true);
                                break;
                            }
                        }
                    }
                    break;
                case 5://down
                    if (this.$layout == 0 /* SingleColumn */ || this.$layout == 3 /* FlowVertical */) {
                        index++;
                        if (index < this.$children.length) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == 2 /* FlowHorizontal */ || this.$layout == 4 /* Pagination */) {
                        current = this.$children[index];
                        k = 0;
                        cnt = this.$children.length;
                        for (i = index + 1; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i < cnt; i++) {
                            obj = this.$children[i];
                            if (obj.y != current.y) {
                                this.clearSelection();
                                this.addSelection(i - k - 1, true);
                                break;
                            }
                        }
                    }
                    break;
                case 7://left
                    if (this.$layout == 1 /* SingleRow */ || this.$layout == 2 /* FlowHorizontal */ || this.$layout == 4 /* Pagination */) {
                        index--;
                        if (index >= 0) {
                            this.clearSelection();
                            this.addSelection(index, true);
                        }
                    }
                    else if (this.$layout == 3 /* FlowVertical */) {
                        current = this.$children[index];
                        k = 0;
                        for (i = index - 1; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                current = obj;
                                break;
                            }
                            k++;
                        }
                        for (; i >= 0; i--) {
                            obj = this.$children[i];
                            if (obj.x != current.x) {
                                this.clearSelection();
                                this.addSelection(i + k + 1, true);
                                break;
                            }
                        }
                    }
                    break;
            }
        };
        GList.prototype.$clickItem = function (evt) {
            if (this.$scrollPane != null && this.$scrollPane.$isDragged)
                return;
            var item = fgui.GObject.castFromNativeObject(evt.currentTarget);
            if (!item)
                return;
            this.setSelectionOnEvent(item);
            if (this.$scrollPane && this.scrollItemToViewOnClick)
                this.$scrollPane.scrollToView(item, true);
            this.emit("__itemClick" /* ItemClick */, evt, item);
        };
        GList.prototype.setSelectionOnEvent = function (item) {
            if (!(item instanceof fgui.GButton) || this.$selectionMode == 3 /* None */)
                return;
            //let dontChangeLastIndex: boolean = false;
            var index = this.getChildIndex(item);
            if (this.$selectionMode == 0 /* Single */) {
                if (!item.selected) {
                    this.clearSelectionExcept(item);
                    item.selected = true;
                }
            }
            else {
                if (!item.selected) {
                    this.clearSelectionExcept(item);
                    item.selected = true;
                }
                else
                    this.clearSelectionExcept(item);
            }
            //if (!dontChangeLastIndex)
            //    this.$lastSelectedIndex = index;
            if (item.selected)
                this.updateSelectionController(index);
        };
        GList.prototype.clearSelectionExcept = function (obj) {
            this.$children.forEach(function (child) {
                if (child && child instanceof fgui.GButton && child.selected)
                    child.selected = false;
            }, this);
        };
        GList.prototype.resizeToFit = function (itemCount, minSize) {
            if (itemCount === void 0) { itemCount = Number.POSITIVE_INFINITY; }
            if (minSize === void 0) { minSize = 0; }
            this.ensureBoundsCorrect();
            var curCount = this.numItems;
            if (itemCount > curCount)
                itemCount = curCount;
            if (this.$virtual) {
                var lineCount = Math.ceil(itemCount / this.$curLineItemCount);
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */)
                    this.viewHeight = lineCount * this.$itemSize.y + Math.max(0, lineCount - 1) * this.$lineGap;
                else
                    this.viewWidth = lineCount * this.$itemSize.x + Math.max(0, lineCount - 1) * this.$columnGap;
            }
            else if (itemCount == 0) {
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */)
                    this.viewHeight = minSize;
                else
                    this.viewWidth = minSize;
            }
            else {
                var i = itemCount - 1;
                var obj = null;
                while (i >= 0) {
                    obj = this.getChildAt(i);
                    if (!this.foldInvisibleItems || obj.visible)
                        break;
                    i--;
                }
                if (i < 0) {
                    if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */)
                        this.viewHeight = minSize;
                    else
                        this.viewWidth = minSize;
                }
                else {
                    var size = 0;
                    if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */) {
                        size = obj.y + obj.height;
                        if (size < minSize)
                            size = minSize;
                        this.viewHeight = size;
                    }
                    else {
                        size = obj.x + obj.width;
                        if (size < minSize)
                            size = minSize;
                        this.viewWidth = size;
                    }
                }
            }
        };
        GList.prototype.getMaxItemWidth = function () {
            var max = 0;
            this.$children.forEach(function (child) {
                if (child && child.width > max)
                    max = child.width;
            }, this);
            return max;
        };
        GList.prototype.handleSizeChanged = function () {
            _super.prototype.handleSizeChanged.call(this);
            this.setBoundsChangedFlag();
            if (this.$virtual)
                this.setVirtualListChangedFlag(true);
        };
        GList.prototype.handleControllerChanged = function (c) {
            _super.prototype.handleControllerChanged.call(this, c);
            if (this.$selectionController == c)
                this.selectedIndex = c.selectedIndex;
        };
        GList.prototype.updateSelectionController = function (index) {
            if (this.$selectionController != null && !this.$selectionController.$updating && index < this.$selectionController.pageCount) {
                var c = this.$selectionController;
                this.$selectionController = null;
                c.selectedIndex = index;
                this.$selectionController = c;
            }
        };
        GList.prototype.getSnappingPosition = function (xValue, yValue, resultPoint) {
            if (this.$virtual) {
                if (!resultPoint)
                    resultPoint = new PIXI.Point();
                var saved = void 0;
                var index = void 0;
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */) {
                    saved = yValue;
                    GList.posHelper = yValue;
                    index = this.getIndexOnPos1(false);
                    yValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - yValue > this.$virtualItems[index].height / 2 && index < this.$realNumItems)
                        yValue += this.$virtualItems[index].height + this.$lineGap;
                }
                else if (this.$layout == 1 /* SingleRow */ || this.$layout == 3 /* FlowVertical */) {
                    saved = xValue;
                    GList.posHelper = xValue;
                    index = this.getIndexOnPos2(false);
                    xValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }
                else {
                    saved = xValue;
                    GList.posHelper = xValue;
                    index = this.getIndexOnPos3(false);
                    xValue = GList.posHelper;
                    if (index < this.$virtualItems.length && saved - xValue > this.$virtualItems[index].width / 2 && index < this.$realNumItems)
                        xValue += this.$virtualItems[index].width + this.$columnGap;
                }
                resultPoint.x = xValue;
                resultPoint.y = yValue;
                return resultPoint;
            }
            else {
                return _super.prototype.getSnappingPosition.call(this, xValue, yValue, resultPoint);
            }
        };
        GList.prototype.scrollToView = function (index, ani, setFirst) {
            if (ani === void 0) { ani = false; }
            if (setFirst === void 0) { setFirst = false; }
            if (this.$virtual) {
                if (this.$numItems == 0)
                    return;
                this.checkVirtualList();
                if (index >= this.$virtualItems.length)
                    throw new Error("Invalid child index: " + index + " is larger than max length: " + this.$virtualItems.length);
                if (this.$loop)
                    index = Math.floor(this.$firstIndex / this.$numItems) * this.$numItems + index;
                var rect = void 0;
                var ii = this.$virtualItems[index];
                var pos = 0;
                var i = void 0;
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */) {
                    for (i = 0; i < index; i += this.$curLineItemCount)
                        pos += this.$virtualItems[i].height + this.$lineGap;
                    rect = new PIXI.Rectangle(0, pos, this.$itemSize.x, ii.height);
                }
                else if (this.$layout == 1 /* SingleRow */ || this.$layout == 3 /* FlowVertical */) {
                    for (i = 0; i < index; i += this.$curLineItemCount)
                        pos += this.$virtualItems[i].width + this.$columnGap;
                    rect = new PIXI.Rectangle(pos, 0, ii.width, this.$itemSize.y);
                }
                else {
                    var page = index / (this.$curLineItemCount * this.$curLineItemCount2);
                    rect = new PIXI.Rectangle(page * this.viewWidth + (index % this.$curLineItemCount) * (ii.width + this.$columnGap), (index / this.$curLineItemCount) % this.$curLineItemCount2 * (ii.height + this.$lineGap), ii.width, ii.height);
                }
                //set to top to prevent from position changing caused by the item size changing (size-changeable item)
                setFirst = true;
                if (this.$scrollPane != null)
                    this.$scrollPane.scrollToView(rect, ani, setFirst);
            }
            else {
                var obj = this.getChildAt(index);
                if (obj != null) {
                    if (this.$scrollPane != null)
                        this.$scrollPane.scrollToView(obj, ani, setFirst);
                    else if (this.parent != null && this.parent.scrollPane != null)
                        this.parent.scrollPane.scrollToView(obj, ani, setFirst);
                }
            }
        };
        GList.prototype.getFirstChildInView = function () {
            return this.childIndexToItemIndex(_super.prototype.getFirstChildInView.call(this));
        };
        GList.prototype.childIndexToItemIndex = function (index) {
            if (!this.$virtual)
                return index;
            if (this.$layout == 4 /* Pagination */) {
                for (var i = this.$firstIndex; i < this.$realNumItems; i++) {
                    if (this.$virtualItems[i].obj != null) {
                        index--;
                        if (index < 0)
                            return i;
                    }
                }
                return index;
            }
            else {
                index += this.$firstIndex;
                if (this.$loop && this.$numItems > 0)
                    index = index % this.$numItems;
                return index;
            }
        };
        GList.prototype.itemIndexToChildIndex = function (index) {
            if (!this.$virtual)
                return index;
            if (this.$layout == 4 /* Pagination */) {
                return this.getChildIndex(this.$virtualItems[index].obj);
            }
            else {
                if (this.$loop && this.$numItems > 0) {
                    var j = this.$firstIndex % this.$numItems;
                    if (index >= j)
                        index = this.$firstIndex + (index - j);
                    else
                        index = this.$firstIndex + this.$numItems + (j - index);
                }
                else
                    index -= this.$firstIndex;
                return index;
            }
        };
        GList.prototype.setVirtual = function () {
            this.$setVirtual(false);
        };
        /**set as virtual list with loop mode */
        GList.prototype.setVirtualAndLoop = function () {
            this.$setVirtual(true);
        };
        GList.prototype.$setVirtual = function (loop) {
            if (!this.$virtual) {
                if (this.$scrollPane == null)
                    throw new Error("Virtual list must be scrollable");
                if (loop) {
                    if (this.$layout == 2 /* FlowHorizontal */ || this.$layout == 3 /* FlowVertical */)
                        throw new Error("Virtual list with loop mode is not supported for both FlowHorizontal and FlowVertical layout");
                    this.$scrollPane.bouncebackEffect = false;
                }
                this.$virtual = true;
                this.$loop = loop;
                this.$virtualItems = [];
                this.removeChildrenToPool();
                if (this.$itemSize == null) {
                    this.$itemSize = new PIXI.Point();
                    var obj = this.getFromPool(null);
                    if (obj == null) {
                        throw new Error("Virtual list must have a default list item resource specified.");
                    }
                    else {
                        this.$itemSize.x = obj.width;
                        this.$itemSize.y = obj.height;
                    }
                    this.returnToPool(obj);
                }
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */)
                    this.$scrollPane.scrollSpeed = this.$itemSize.y;
                else
                    this.$scrollPane.scrollSpeed = this.$itemSize.x;
                this.$scrollPane.on("__scroll" /* SCROLL */, this.$scrolled, this);
                this.setVirtualListChangedFlag(true);
            }
        };
        Object.defineProperty(GList.prototype, "numItems", {
            get: function () {
                if (this.$virtual)
                    return this.$numItems;
                else
                    return this.$children.length;
            },
            /**
             * set item count for the list.
             * 1, if the list is a normal list (not virtual), the set number of items will be created inside the list.
             * 2, if the list is a virtual list, only count of visible items will be created inside the list's viewport.
             */
            set: function (value) {
                if (this.$virtual) {
                    if (this.itemRenderer == null)
                        throw new Error("list.itemRenderer is required");
                    this.$numItems = value;
                    if (this.$loop)
                        this.$realNumItems = this.$numItems * 5; //enlarge for loop
                    else
                        this.$realNumItems = this.$numItems;
                    var oldCount = this.$virtualItems.length;
                    if (this.$realNumItems > oldCount) {
                        for (var i = oldCount; i < this.$realNumItems; i++) {
                            var ii = new ItemInfo();
                            ii.width = this.$itemSize.x;
                            ii.height = this.$itemSize.y;
                            this.$virtualItems.push(ii);
                        }
                    }
                    if (this.$virtualListChanged != 0)
                        fgui.GTimer.inst.remove(this._refreshVirtualList, this);
                    this._refreshVirtualList();
                }
                else {
                    var cnt = this.$children.length;
                    if (value > cnt) {
                        for (var i = cnt; i < value; i++) {
                            if (this.itemProvider == null)
                                this.addItemFromPool();
                            else
                                this.addItemFromPool(this.itemProvider(i));
                        }
                    }
                    else {
                        this.removeChildrenToPool(value, cnt);
                    }
                    if (this.itemRenderer != null) {
                        for (var i = 0; i < value; i++)
                            this.itemRenderer(i, this.getChildAt(i));
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        GList.prototype.refreshVirtualList = function () {
            this.setVirtualListChangedFlag(false);
        };
        GList.prototype.checkVirtualList = function () {
            if (this.$virtualListChanged != 0) {
                this._refreshVirtualList();
                fgui.GTimer.inst.remove(this._refreshVirtualList, this);
            }
        };
        GList.prototype.setVirtualListChangedFlag = function (layoutChanged) {
            if (layoutChanged === void 0) { layoutChanged = false; }
            if (layoutChanged)
                this.$virtualListChanged = 2;
            else if (this.$virtualListChanged == 0)
                this.$virtualListChanged = 1;
            fgui.GTimer.inst.callLater(this._refreshVirtualList, this);
        };
        GList.prototype._refreshVirtualList = function () {
            var layoutChanged = this.$virtualListChanged == 2;
            this.$virtualListChanged = 0;
            this.$eventLocked = true;
            if (layoutChanged) {
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 1 /* SingleRow */)
                    this.$curLineItemCount = 1;
                else if (this.$layout == 2 /* FlowHorizontal */) {
                    if (this.$columnCount > 0)
                        this.$curLineItemCount = this.$columnCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewWidth + this.$columnGap) / (this.$itemSize.x + this.$columnGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }
                }
                else if (this.$layout == 3 /* FlowVertical */) {
                    if (this.$lineCount > 0)
                        this.$curLineItemCount = this.$lineCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewHeight + this.$lineGap) / (this.$itemSize.y + this.$lineGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }
                }
                else {
                    if (this.$columnCount > 0)
                        this.$curLineItemCount = this.$columnCount;
                    else {
                        this.$curLineItemCount = Math.floor((this.$scrollPane.viewWidth + this.$columnGap) / (this.$itemSize.x + this.$columnGap));
                        if (this.$curLineItemCount <= 0)
                            this.$curLineItemCount = 1;
                    }
                    if (this.$lineCount > 0)
                        this.$curLineItemCount2 = this.$lineCount;
                    else {
                        this.$curLineItemCount2 = Math.floor((this.$scrollPane.viewHeight + this.$lineGap) / (this.$itemSize.y + this.$lineGap));
                        if (this.$curLineItemCount2 <= 0)
                            this.$curLineItemCount2 = 1;
                    }
                }
            }
            var ch = 0, cw = 0;
            if (this.$realNumItems > 0) {
                var i = void 0;
                var len = Math.ceil(this.$realNumItems / this.$curLineItemCount) * this.$curLineItemCount;
                var len2 = Math.min(this.$curLineItemCount, this.$realNumItems);
                if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */) {
                    for (i = 0; i < len; i += this.$curLineItemCount)
                        ch += this.$virtualItems[i].height + this.$lineGap;
                    if (ch > 0)
                        ch -= this.$lineGap;
                    if (this.$autoResizeItem)
                        cw = this.$scrollPane.viewWidth;
                    else {
                        for (i = 0; i < len2; i++)
                            cw += this.$virtualItems[i].width + this.$columnGap;
                        if (cw > 0)
                            cw -= this.$columnGap;
                    }
                }
                else if (this.$layout == 1 /* SingleRow */ || this.$layout == 3 /* FlowVertical */) {
                    for (i = 0; i < len; i += this.$curLineItemCount)
                        cw += this.$virtualItems[i].width + this.$columnGap;
                    if (cw > 0)
                        cw -= this.$columnGap;
                    if (this.$autoResizeItem)
                        ch = this.scrollPane.viewHeight;
                    else {
                        for (i = 0; i < len2; i++)
                            ch += this.$virtualItems[i].height + this.$lineGap;
                        if (ch > 0)
                            ch -= this.$lineGap;
                    }
                }
                else {
                    var pageCount = Math.ceil(len / (this.$curLineItemCount * this.$curLineItemCount2));
                    cw = pageCount * this.viewWidth;
                    ch = this.viewHeight;
                }
            }
            this.handleAlign(cw, ch);
            this.$scrollPane.setContentSize(cw, ch);
            this.$eventLocked = false;
            this.handleScroll(true);
        };
        GList.prototype.$scrolled = function (evt) {
            this.handleScroll(false);
        };
        GList.prototype.getIndexOnPos1 = function (forceUpdate) {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }
            var i;
            var pos2;
            var pos3;
            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).y;
                if (pos2 > GList.posHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].height + this.$lineGap);
                        if (pos2 <= GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                    }
                    GList.posHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                        if (pos3 > GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }
                    GList.posHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].height + this.$lineGap;
                    if (pos3 > GList.posHelper) {
                        GList.posHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }
                GList.posHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        };
        GList.prototype.getIndexOnPos2 = function (forceUpdate) {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }
            var i;
            var pos2;
            var pos3;
            if (this.numChildren > 0 && !forceUpdate) {
                pos2 = this.getChildAt(0).x;
                if (pos2 > GList.posHelper) {
                    for (i = this.$firstIndex - this.$curLineItemCount; i >= 0; i -= this.$curLineItemCount) {
                        pos2 -= (this.$virtualItems[i].width + this.$columnGap);
                        if (pos2 <= GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                    }
                    GList.posHelper = 0;
                    return 0;
                }
                else {
                    for (i = this.$firstIndex; i < this.$realNumItems; i += this.$curLineItemCount) {
                        pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                        if (pos3 > GList.posHelper) {
                            GList.posHelper = pos2;
                            return i;
                        }
                        pos2 = pos3;
                    }
                    GList.posHelper = pos2;
                    return this.$realNumItems - this.$curLineItemCount;
                }
            }
            else {
                pos2 = 0;
                for (i = 0; i < this.$realNumItems; i += this.$curLineItemCount) {
                    pos3 = pos2 + this.$virtualItems[i].width + this.$columnGap;
                    if (pos3 > GList.posHelper) {
                        GList.posHelper = pos2;
                        return i;
                    }
                    pos2 = pos3;
                }
                GList.posHelper = pos2;
                return this.$realNumItems - this.$curLineItemCount;
            }
        };
        GList.prototype.getIndexOnPos3 = function (forceUpdate) {
            if (this.$realNumItems < this.$curLineItemCount) {
                GList.posHelper = 0;
                return 0;
            }
            var viewWidth = this.viewWidth;
            var page = Math.floor(GList.posHelper / viewWidth);
            var startIndex = page * (this.$curLineItemCount * this.$curLineItemCount2);
            var pos2 = page * viewWidth;
            var pos3;
            var i;
            for (i = 0; i < this.$curLineItemCount; i++) {
                pos3 = pos2 + this.$virtualItems[startIndex + i].width + this.$columnGap;
                if (pos3 > GList.posHelper) {
                    GList.posHelper = pos2;
                    return startIndex + i;
                }
                pos2 = pos3;
            }
            GList.posHelper = pos2;
            return startIndex + this.$curLineItemCount - 1;
        };
        GList.prototype.handleScroll = function (forceUpdate) {
            if (this.$eventLocked)
                return;
            var pos;
            var roundSize;
            if (this.$layout == 0 /* SingleColumn */ || this.$layout == 2 /* FlowHorizontal */) {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosY;
                    //key: scroll to head/tail then re-pos
                    roundSize = this.$numItems * (this.$itemSize.y + this.$lineGap);
                    if (pos == 0)
                        this.$scrollPane.posY = roundSize;
                    else if (pos == this.$scrollPane.contentHeight - this.$scrollPane.viewHeight)
                        this.$scrollPane.posY = this.$scrollPane.contentHeight - roundSize - this.viewHeight;
                }
                this.handleScroll1(forceUpdate);
            }
            else if (this.$layout == 1 /* SingleRow */ || this.$layout == 3 /* FlowVertical */) {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosX;
                    //key: scroll to head/tail then re-pos
                    roundSize = this.$numItems * (this.$itemSize.x + this.$columnGap);
                    if (pos == 0)
                        this.$scrollPane.posX = roundSize;
                    else if (pos == this.$scrollPane.contentWidth - this.$scrollPane.viewWidth)
                        this.$scrollPane.posX = this.$scrollPane.contentWidth - roundSize - this.viewWidth;
                }
                this.handleScroll2(forceUpdate);
            }
            else {
                if (this.$loop) {
                    pos = this.$scrollPane.scrollingPosX;
                    //key: scroll to head/tail then re-pos
                    roundSize = Math.floor(this.$numItems / (this.$curLineItemCount * this.$curLineItemCount2)) * this.viewWidth;
                    if (pos == 0)
                        this.$scrollPane.posX = roundSize;
                    else if (pos == this.$scrollPane.contentWidth - this.$scrollPane.viewWidth)
                        this.$scrollPane.posX = this.$scrollPane.contentWidth - roundSize - this.viewWidth;
                }
                this.handleScroll3(forceUpdate);
            }
            this.$boundsChanged = false;
        };
        GList.prototype.handleScroll1 = function (forceUpdate) {
            GList.scrollEnterCounter++;
            if (GList.scrollEnterCounter > 3)
                return;
            var pos = this.$scrollPane.scrollingPosY;
            var max = pos + this.$scrollPane.viewHeight;
            var end = max == this.$scrollPane.contentHeight; //need to scroll to the end whatever the size currently is.
            //find the first item around the current pos
            GList.posHelper = pos;
            var newFirstIndex = this.getIndexOnPos1(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate) {
                GList.scrollEnterCounter--;
                return;
            }
            var oldFirstIndex = this.$firstIndex;
            this.$firstIndex = newFirstIndex;
            var curIndex = newFirstIndex;
            var forward = oldFirstIndex > newFirstIndex;
            var oldCount = this.numChildren;
            var lastIndex = oldFirstIndex + oldCount - 1;
            var reuseIndex = forward ? lastIndex : oldFirstIndex;
            var curX = 0, curY = pos;
            var needRender;
            var deltaSize = 0;
            var firstItemDeltaSize = 0;
            var url = this.defaultItem;
            var ii, ii2;
            var i, j;
            var partSize = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;
            GList.posHelper++;
            while (curIndex < this.$realNumItems && (end || curY < max)) {
                ii = this.$virtualItems[curIndex];
                if (ii.obj == null || forceUpdate) {
                    if (this.itemProvider != null) {
                        url = this.itemProvider(curIndex % this.$numItems);
                        if (url == null)
                            url = this.$defaultItem;
                        url = fgui.UIPackage.normalizeURL(url);
                    }
                    if (ii.obj != null && ii.obj.resourceURL != url) {
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }
                if (ii.obj == null) {
                    //search for a best item to reuse, ensure everytime recreate items after refreshing we render less items
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex--;
                                break;
                            }
                        }
                    }
                    else {
                        for (j = reuseIndex; j <= lastIndex; j++) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }
                    if (ii.obj != null) {
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    }
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof fgui.GButton)
                        ii.obj.selected = false;
                    needRender = true;
                }
                else
                    needRender = forceUpdate;
                if (needRender) {
                    if (this.$autoResizeItem && (this.$layout == 0 /* SingleColumn */ || this.$columnCount > 0))
                        ii.obj.setSize(partSize, ii.obj.height, true);
                    this.itemRenderer(curIndex % this.$numItems, ii.obj);
                    if (curIndex % this.$curLineItemCount == 0) {
                        deltaSize += Math.ceil(ii.obj.height) - ii.height;
                        if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                            //pad gap to avoid the scrolling jump if the new coming item's size changes while scrolling down
                            firstItemDeltaSize = Math.ceil(ii.obj.height) - ii.height;
                        }
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }
                ii.updateFlag = GList.itemInfoReuseFlag;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex)
                    max += ii.height;
                curX += ii.width + this.$columnGap;
                if (curIndex % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    curX = 0;
                    curY += ii.height + this.$lineGap;
                }
                curIndex++;
            }
            for (i = 0; i < oldCount; i++) {
                ii = this.$virtualItems[oldFirstIndex + i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }
            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(0, deltaSize, 0, firstItemDeltaSize);
            if (curIndex > 0 && this.numChildren > 0 && this.$container.y < 0 && this.getChildAt(0).y > -this.$container.y)
                this.handleScroll1(false);
            GList.scrollEnterCounter--;
        };
        GList.prototype.handleScroll2 = function (forceUpdate) {
            GList.scrollEnterCounter++;
            if (GList.scrollEnterCounter > 3)
                return;
            var pos = this.$scrollPane.scrollingPosX;
            var max = pos + this.$scrollPane.viewWidth;
            var end = pos == this.$scrollPane.contentWidth;
            GList.posHelper = pos;
            var newFirstIndex = this.getIndexOnPos2(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate) {
                GList.scrollEnterCounter--;
                return;
            }
            var oldFirstIndex = this.$firstIndex;
            this.$firstIndex = newFirstIndex;
            var curIndex = newFirstIndex;
            var forward = oldFirstIndex > newFirstIndex;
            var oldCount = this.numChildren;
            var lastIndex = oldFirstIndex + oldCount - 1;
            var reuseIndex = forward ? lastIndex : oldFirstIndex;
            var curX = pos, curY = 0;
            var needRender;
            var deltaSize = 0;
            var firstItemDeltaSize = 0;
            var url = this.defaultItem;
            var ii, ii2;
            var i, j;
            var partSize = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;
            GList.itemInfoReuseFlag++;
            while (curIndex < this.$realNumItems && (end || curX < max)) {
                ii = this.$virtualItems[curIndex];
                if (ii.obj == null || forceUpdate) {
                    if (this.itemProvider != null) {
                        url = this.itemProvider(curIndex % this.$numItems);
                        if (url == null)
                            url = this.$defaultItem;
                        url = fgui.UIPackage.normalizeURL(url);
                    }
                    if (ii.obj != null && ii.obj.resourceURL != url) {
                        this.removeChildToPool(ii.obj);
                        ii.obj = null;
                    }
                }
                if (ii.obj == null) {
                    if (forward) {
                        for (j = reuseIndex; j >= oldFirstIndex; j--) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex--;
                                break;
                            }
                        }
                    }
                    else {
                        for (j = reuseIndex; j <= lastIndex; j++) {
                            ii2 = this.$virtualItems[j];
                            if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag && ii2.obj.resourceURL == url) {
                                ii.obj = ii2.obj;
                                ii2.obj = null;
                                if (j == reuseIndex)
                                    reuseIndex++;
                                break;
                            }
                        }
                    }
                    if (ii.obj != null) {
                        this.setChildIndex(ii.obj, forward ? curIndex - newFirstIndex : this.numChildren);
                    }
                    else {
                        ii.obj = this.$pool.get(url);
                        if (forward)
                            this.addChildAt(ii.obj, curIndex - newFirstIndex);
                        else
                            this.addChild(ii.obj);
                    }
                    if (ii.obj instanceof fgui.GButton)
                        ii.obj.selected = false;
                    needRender = true;
                }
                else
                    needRender = forceUpdate;
                if (needRender) {
                    if (this.$autoResizeItem && (this.$layout == 1 /* SingleRow */ || this.$lineCount > 0))
                        ii.obj.setSize(ii.obj.width, partSize, true);
                    this.itemRenderer(curIndex % this.$numItems, ii.obj);
                    if (curIndex % this.$curLineItemCount == 0) {
                        deltaSize += Math.ceil(ii.obj.width) - ii.width;
                        if (curIndex == newFirstIndex && oldFirstIndex > newFirstIndex) {
                            firstItemDeltaSize = Math.ceil(ii.obj.width) - ii.width;
                        }
                    }
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }
                ii.updateFlag = GList.itemInfoReuseFlag;
                ii.obj.setXY(curX, curY);
                if (curIndex == newFirstIndex)
                    max += ii.width;
                curY += ii.height + this.$lineGap;
                if (curIndex % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    curY = 0;
                    curX += ii.width + this.$columnGap;
                }
                curIndex++;
            }
            for (i = 0; i < oldCount; i++) {
                ii = this.$virtualItems[oldFirstIndex + i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }
            if (deltaSize != 0 || firstItemDeltaSize != 0)
                this.$scrollPane.changeContentSizeOnScrolling(deltaSize, 0, firstItemDeltaSize, 0);
            if (curIndex > 0 && this.numChildren > 0 && this.$container.x < 0 && this.getChildAt(0).x > -this.$container.x)
                this.handleScroll2(false);
            GList.scrollEnterCounter--;
        };
        GList.prototype.handleScroll3 = function (forceUpdate) {
            var pos = this.$scrollPane.scrollingPosX;
            GList.posHelper = pos;
            var newFirstIndex = this.getIndexOnPos3(forceUpdate);
            pos = GList.posHelper;
            if (newFirstIndex == this.$firstIndex && !forceUpdate)
                return;
            var oldFirstIndex = this.$firstIndex;
            this.$firstIndex = newFirstIndex;
            //items are all the same height in pagination mode, so just render a full page
            var reuseIndex = oldFirstIndex;
            var virtualItemCount = this.$virtualItems.length;
            var pageSize = this.$curLineItemCount * this.$curLineItemCount2;
            var startCol = newFirstIndex % this.$curLineItemCount;
            var viewWidth = this.viewWidth;
            var page = Math.floor(newFirstIndex / pageSize);
            var startIndex = page * pageSize;
            var lastIndex = startIndex + pageSize * 2;
            var needRender;
            var i;
            var ii, ii2;
            var col;
            var url = this.$defaultItem;
            var partWidth = (this.$scrollPane.viewWidth - this.$columnGap * (this.$curLineItemCount - 1)) / this.$curLineItemCount;
            var partHeight = (this.$scrollPane.viewHeight - this.$lineGap * (this.$curLineItemCount2 - 1)) / this.$curLineItemCount2;
            GList.itemInfoReuseFlag++;
            //make the items need to be used first
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;
                col = i % this.$curLineItemCount;
                if (i - startIndex < pageSize) {
                    if (col < startCol)
                        continue;
                }
                else {
                    if (col > startCol)
                        continue;
                }
                ii = this.$virtualItems[i];
                ii.updateFlag = GList.itemInfoReuseFlag;
            }
            var lastObj = null;
            var insertIndex = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;
                ii = this.$virtualItems[i];
                if (ii.updateFlag != GList.itemInfoReuseFlag)
                    continue;
                if (ii.obj == null) {
                    //see if there is reusable items
                    while (reuseIndex < virtualItemCount) {
                        ii2 = this.$virtualItems[reuseIndex];
                        if (ii2.obj != null && ii2.updateFlag != GList.itemInfoReuseFlag) {
                            ii.obj = ii2.obj;
                            ii2.obj = null;
                            break;
                        }
                        reuseIndex++;
                    }
                    if (insertIndex == -1)
                        insertIndex = this.getChildIndex(lastObj) + 1;
                    if (ii.obj == null) {
                        if (this.itemProvider != null) {
                            url = this.itemProvider(i % this.$numItems);
                            if (url == null)
                                url = this.$defaultItem;
                            url = fgui.UIPackage.normalizeURL(url);
                        }
                        ii.obj = this.$pool.get(url);
                        this.addChildAt(ii.obj, insertIndex);
                    }
                    else {
                        insertIndex = this.setChildIndexBefore(ii.obj, insertIndex);
                    }
                    insertIndex++;
                    if (ii.obj instanceof fgui.GButton)
                        ii.obj.selected = false;
                    needRender = true;
                }
                else {
                    needRender = forceUpdate;
                    insertIndex = -1;
                    lastObj = ii.obj;
                }
                if (needRender) {
                    if (this.$autoResizeItem) {
                        if (this.$curLineItemCount == this.$columnCount && this.$curLineItemCount2 == this.$lineCount)
                            ii.obj.setSize(partWidth, partHeight, true);
                        else if (this.$curLineItemCount == this.$columnCount)
                            ii.obj.setSize(partWidth, ii.obj.height, true);
                        else if (this.$curLineItemCount2 == this.$lineCount)
                            ii.obj.setSize(ii.obj.width, partHeight, true);
                    }
                    this.itemRenderer(i % this.$numItems, ii.obj);
                    ii.width = Math.ceil(ii.obj.width);
                    ii.height = Math.ceil(ii.obj.height);
                }
            }
            //arrange items
            var borderX = (startIndex / pageSize) * viewWidth;
            var xx = borderX;
            var yy = 0;
            var lineHeight = 0;
            for (i = startIndex; i < lastIndex; i++) {
                if (i >= this.$realNumItems)
                    continue;
                ii = this.$virtualItems[i];
                if (ii.updateFlag == GList.itemInfoReuseFlag)
                    ii.obj.setXY(xx, yy);
                if (ii.height > lineHeight)
                    lineHeight = ii.height;
                if (i % this.$curLineItemCount == this.$curLineItemCount - 1) {
                    xx = borderX;
                    yy += lineHeight + this.$lineGap;
                    lineHeight = 0;
                    if (i == startIndex + pageSize - 1) {
                        borderX += viewWidth;
                        xx = borderX;
                        yy = 0;
                    }
                }
                else
                    xx += ii.width + this.$columnGap;
            }
            //release unused items
            for (i = reuseIndex; i < virtualItemCount; i++) {
                ii = this.$virtualItems[i];
                if (ii.updateFlag != GList.itemInfoReuseFlag && ii.obj != null) {
                    this.removeChildToPool(ii.obj);
                    ii.obj = null;
                }
            }
        };
        GList.prototype.handleAlign = function (contentWidth, contentHeight) {
            var newOffsetX = 0;
            var newOffsetY = 0;
            if (contentHeight < this.viewHeight) {
                if (this.$verticalAlign == 1 /* Middle */)
                    newOffsetY = Math.floor((this.viewHeight - contentHeight) / 2);
                else if (this.$verticalAlign == 2 /* Bottom */)
                    newOffsetY = this.viewHeight - contentHeight;
            }
            if (contentWidth < this.viewWidth) {
                if (this.$align == "center" /* Center */)
                    newOffsetX = Math.floor((this.viewWidth - contentWidth) / 2);
                else if (this.$align == "right" /* Right */)
                    newOffsetX = this.viewWidth - contentWidth;
            }
            if (newOffsetX != this.$alignOffset.x || newOffsetY != this.$alignOffset.y) {
                this.$alignOffset.set(newOffsetX, newOffsetY);
                if (this.$scrollPane != null)
                    this.$scrollPane.adjustMaskContainer();
                else {
                    this.$container.x = this.$margin.left + this.$alignOffset.x;
                    this.$container.y = this.$margin.top + this.$alignOffset.y;
                }
            }
        };
        GList.prototype.updateBounds = function () {
            if (this.$virtual)
                return;
            var i;
            var child;
            var curX = 0;
            var curY = 0;
            var maxWidth = 0;
            var maxHeight = 0;
            var cw = 0, ch = 0;
            var j = 0;
            var page = 0;
            var k = 0;
            var cnt = this.$children.length;
            var viewWidth = this.viewWidth;
            var viewHeight = this.viewHeight;
            var lineSize = 0;
            var lineStart = 0;
            var ratio = 0;
            if (this.$layout == 0 /* SingleColumn */) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;
                    if (curY != 0)
                        curY += this.$lineGap;
                    child.y = curY;
                    if (this.$autoResizeItem)
                        child.setSize(viewWidth, child.height, true);
                    curY += Math.ceil(child.height);
                    if (child.width > maxWidth)
                        maxWidth = child.width;
                }
                cw = Math.ceil(maxWidth);
                ch = curY;
            }
            else if (this.$layout == 1 /* SingleRow */) {
                for (i = 0; i < cnt; i++) {
                    child = this.getChildAt(i);
                    if (this.foldInvisibleItems && !child.visible)
                        continue;
                    if (curX != 0)
                        curX += this.$columnGap;
                    child.x = curX;
                    if (this.$autoResizeItem)
                        child.setSize(child.width, viewHeight, true);
                    curX += Math.ceil(child.width);
                    if (child.height > maxHeight)
                        maxHeight = child.height;
                }
                cw = curX;
                ch = Math.ceil(maxHeight);
            }
            else if (this.$layout == 2 /* FlowHorizontal */) {
                if (this.$autoResizeItem && this.$columnCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        lineSize += child.sourceWidth;
                        j++;
                        if (j == this.$columnCount || i == cnt - 1) {
                            ratio = (viewWidth - lineSize - (j - 1) * this.$columnGap) / lineSize;
                            curX = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                child.setXY(curX, curY);
                                if (j < i) {
                                    child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), child.height, true);
                                    curX += Math.ceil(child.width) + this.$columnGap;
                                }
                                else {
                                    child.setSize(viewWidth - curX, child.height, true);
                                }
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                            }
                            //new line
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;
                        }
                    }
                    ch = curY + Math.ceil(maxHeight);
                    cw = viewWidth;
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        if (curX != 0)
                            curX += this.$columnGap;
                        if (this.$columnCount != 0 && j >= this.$columnCount
                            || this.$columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                            //new line
                            curX = 0;
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                        }
                        child.setXY(curX, curY);
                        curX += Math.ceil(child.width);
                        if (curX > maxWidth)
                            maxWidth = curX;
                        if (child.height > maxHeight)
                            maxHeight = child.height;
                        j++;
                    }
                    ch = curY + Math.ceil(maxHeight);
                    cw = Math.ceil(maxWidth);
                }
            }
            else if (this.$layout == 3 /* FlowVertical */) {
                if (this.$autoResizeItem && this.$lineCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        lineSize += child.sourceHeight;
                        j++;
                        if (j == this.$lineCount || i == cnt - 1) {
                            ratio = (viewHeight - lineSize - (j - 1) * this.$lineGap) / lineSize;
                            curY = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                child.setXY(curX, curY);
                                if (j < i) {
                                    child.setSize(child.width, child.sourceHeight + Math.round(child.sourceHeight * ratio), true);
                                    curY += Math.ceil(child.height) + this.$lineGap;
                                }
                                else {
                                    child.setSize(child.width, viewHeight - curY, true);
                                }
                                if (child.width > maxWidth)
                                    maxWidth = child.width;
                            }
                            //new line
                            curX += Math.ceil(maxWidth) + this.$columnGap;
                            maxWidth = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;
                        }
                    }
                    cw = curX + Math.ceil(maxWidth);
                    ch = viewHeight;
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        if (curY != 0)
                            curY += this.$lineGap;
                        if (this.$lineCount != 0 && j >= this.$lineCount
                            || this.$lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) {
                            curY = 0;
                            curX += Math.ceil(maxWidth) + this.$columnGap;
                            maxWidth = 0;
                            j = 0;
                        }
                        child.setXY(curX, curY);
                        curY += Math.ceil(child.height);
                        if (curY > maxHeight)
                            maxHeight = curY;
                        if (child.width > maxWidth)
                            maxWidth = child.width;
                        j++;
                    }
                    cw = curX + Math.ceil(maxWidth);
                    ch = Math.ceil(maxHeight);
                }
            }
            else {
                var eachHeight = void 0;
                if (this.$autoResizeItem && this.$lineCount > 0)
                    eachHeight = Math.floor((viewHeight - (this.$lineCount - 1) * this.$lineGap) / this.$lineCount);
                if (this.$autoResizeItem && this.$columnCount > 0) {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        lineSize += child.sourceWidth;
                        j++;
                        if (j == this.$columnCount || i == cnt - 1) {
                            ratio = (viewWidth - lineSize - (j - 1) * this.$columnGap) / lineSize;
                            curX = 0;
                            for (j = lineStart; j <= i; j++) {
                                child = this.getChildAt(j);
                                if (this.foldInvisibleItems && !child.visible)
                                    continue;
                                child.setXY(page * viewWidth + curX, curY);
                                if (j < i) {
                                    child.setSize(child.sourceWidth + Math.round(child.sourceWidth * ratio), this.$lineCount > 0 ? eachHeight : child.height, true);
                                    curX += Math.ceil(child.width) + this.$columnGap;
                                }
                                else {
                                    child.setSize(viewWidth - curX, this.$lineCount > 0 ? eachHeight : child.height, true);
                                }
                                if (child.height > maxHeight)
                                    maxHeight = child.height;
                            }
                            //new line
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            lineStart = i + 1;
                            lineSize = 0;
                            k++;
                            if (this.$lineCount != 0 && k >= this.$lineCount
                                || this.$lineCount == 0 && curY + child.height > viewHeight) {
                                //new page
                                page++;
                                curY = 0;
                                k = 0;
                            }
                        }
                    }
                }
                else {
                    for (i = 0; i < cnt; i++) {
                        child = this.getChildAt(i);
                        if (this.foldInvisibleItems && !child.visible)
                            continue;
                        if (curX != 0)
                            curX += this.$columnGap;
                        if (this.$autoResizeItem && this.$lineCount > 0)
                            child.setSize(child.width, eachHeight, true);
                        if (this.$columnCount != 0 && j >= this.$columnCount
                            || this.$columnCount == 0 && curX + child.width > viewWidth && maxHeight != 0) {
                            //new line
                            curX = 0;
                            curY += Math.ceil(maxHeight) + this.$lineGap;
                            maxHeight = 0;
                            j = 0;
                            k++;
                            if (this.$lineCount != 0 && k >= this.$lineCount
                                || this.$lineCount == 0 && curY + child.height > viewHeight && maxWidth != 0) {
                                page++;
                                curY = 0;
                                k = 0;
                            }
                        }
                        child.setXY(page * viewWidth + curX, curY);
                        curX += Math.ceil(child.width);
                        if (curX > maxWidth)
                            maxWidth = curX;
                        if (child.height > maxHeight)
                            maxHeight = child.height;
                        j++;
                    }
                }
                ch = page > 0 ? viewHeight : curY + Math.ceil(maxHeight);
                cw = (page + 1) * viewWidth;
            }
            this.handleAlign(cw, ch);
            this.setBounds(0, 0, cw, ch);
        };
        GList.prototype.setupBeforeAdd = function (xml) {
            var _this = this;
            _super.prototype.setupBeforeAdd.call(this, xml);
            var str;
            var arr;
            str = xml.attributes.layout;
            if (str)
                this.$layout = fgui.ParseListLayoutType(str);
            var overflow;
            str = xml.attributes.overflow;
            if (str)
                overflow = fgui.ParseOverflowType(str);
            else
                overflow = 0 /* Visible */;
            str = xml.attributes.margin;
            if (str)
                this.$margin.parse(str);
            str = xml.attributes.align;
            if (str)
                this.$align = fgui.ParseAlignType(str);
            str = xml.attributes.vAlign;
            if (str)
                this.$verticalAlign = fgui.ParseVertAlignType(str);
            if (overflow == 2 /* Scroll */) {
                var scroll_2;
                str = xml.attributes.scroll;
                if (str)
                    scroll_2 = fgui.ParseScrollType(str);
                else
                    scroll_2 = 1 /* Vertical */;
                var scrollBarDisplay = void 0;
                str = xml.attributes.scrollBar;
                if (str)
                    scrollBarDisplay = fgui.ParseScrollBarDisplayType(str);
                else
                    scrollBarDisplay = 0 /* Default */;
                var scrollBarFlags = void 0;
                str = xml.attributes.scrollBarFlags;
                if (str)
                    scrollBarFlags = parseInt(str);
                else
                    scrollBarFlags = 0;
                var scrollBarMargin = new fgui.utils.Margin();
                str = xml.attributes.scrollBarMargin;
                if (str)
                    scrollBarMargin.parse(str);
                var vtScrollBarRes = void 0;
                var hzScrollBarRes = void 0;
                str = xml.attributes.scrollBarRes;
                if (str) {
                    arr = str.split(",");
                    vtScrollBarRes = arr[0];
                    hzScrollBarRes = arr[1];
                }
                this.setupScroll(scrollBarMargin, scroll_2, scrollBarDisplay, scrollBarFlags, vtScrollBarRes, hzScrollBarRes);
            }
            else
                this.setupOverflow(overflow);
            str = xml.attributes.lineGap;
            if (str)
                this.$lineGap = parseInt(str);
            str = xml.attributes.colGap;
            if (str)
                this.$columnGap = parseInt(str);
            str = xml.attributes.lineItemCount;
            if (str) {
                if (this.$layout == 2 /* FlowHorizontal */ || this.$layout == 4 /* Pagination */)
                    this.$columnCount = parseInt(str);
                else if (this.$layout == 3 /* FlowVertical */)
                    this.$lineCount = parseInt(str);
            }
            str = xml.attributes.lineItemCount2;
            if (str)
                this.$lineCount = parseInt(str);
            str = xml.attributes.selectionMode;
            if (str)
                this.$selectionMode = fgui.ParseListSelectionMode(str);
            str = xml.attributes.defaultItem;
            if (str)
                this.$defaultItem = str;
            str = xml.attributes.autoItemSize;
            if (this.$layout == 1 /* SingleRow */ || this.$layout == 0 /* SingleColumn */)
                this.$autoResizeItem = str != "false";
            else
                this.$autoResizeItem = str == "true";
            str = xml.attributes.renderOrder;
            if (str) {
                this.$childrenRenderOrder = fgui.ParseListChildrenRenderOrder(str);
                if (this.$childrenRenderOrder == 2 /* Arch */) {
                    str = xml.attributes.apex;
                    if (str)
                        this.$apexIndex = parseInt(str);
                }
            }
            var col = xml.children;
            col.forEach(function (cxml) {
                if (cxml.nodeName != "item")
                    return;
                var url = cxml.attributes.url;
                if (!url)
                    url = _this.$defaultItem;
                if (!url)
                    return;
                var obj = _this.getFromPool(url);
                if (obj != null) {
                    _this.addChild(obj);
                    str = cxml.attributes.title;
                    if (str)
                        obj.text = str;
                    str = cxml.attributes.icon;
                    if (str)
                        obj.icon = str;
                    str = cxml.attributes.name;
                    if (str)
                        obj.name = str;
                }
            }, this);
        };
        GList.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            var str;
            str = xml.attributes.selectionController;
            if (str)
                this.$selectionController = this.parent.getController(str);
        };
        GList.itemInfoReuseFlag = 0; //indicate whether the item is reused in the current handling
        GList.scrollEnterCounter = 0; //there will be concurrent issue of HandleScroll method, this flag is for the extremely deadlock situation
        return GList;
    }(fgui.GComponent));
    fgui.GList = GList;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var Recycler = (function () {
            function Recycler() {
                this.$count = 0;
                this.$pool = {};
            }
            Object.defineProperty(Recycler.prototype, "count", {
                get: function () {
                    return this.$count;
                },
                enumerable: true,
                configurable: true
            });
            Recycler.prototype.clear = function () {
                for (var key in this.$pool) {
                    var arr = this.$pool[key];
                    if (arr) {
                        arr.length = 0;
                        arr = null;
                    }
                }
                this.$pool = {};
                this.$count = 0;
            };
            Recycler.prototype.get = function (id) {
                var arr = this.$pool[id];
                if (arr == null) {
                    arr = [];
                    this.$pool[id] = arr;
                }
                if (arr.length) {
                    this.$count--;
                    return arr.shift();
                }
                return this.createObject(id);
            };
            Recycler.prototype.recycle = function (id, obj) {
                if (!id)
                    return;
                var arr = this.$pool[id];
                if (arr == null) {
                    arr = [];
                    this.$pool[id] = arr;
                }
                this.$count++;
                arr.push(obj);
            };
            return Recycler;
        }());
        utils.Recycler = Recycler;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
/// <reference path="./Recycler.ts" />
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var GObjectRecycler = (function (_super) {
            __extends(GObjectRecycler, _super);
            function GObjectRecycler() {
                return _super.call(this) || this;
            }
            GObjectRecycler.prototype.clear = function () {
                for (var key in this.$pool) {
                    var arr = this.$pool[key];
                    if (arr) {
                        arr.forEach(function (v) {
                            v.dispose();
                        });
                    }
                }
                _super.prototype.clear.call(this);
            };
            GObjectRecycler.prototype.createObject = function (id) {
                return fgui.UIPackage.createObjectFromURL(id); //id = url
            };
            return GObjectRecycler;
        }(utils.Recycler));
        utils.GObjectRecycler = GObjectRecycler;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
/// <reference path="./GObject.ts" />
/// <reference path="./utils/GObjectRecycler.ts" />
var fgui;
(function (fgui) {
    var GLoader = (function (_super) {
        __extends(GLoader, _super);
        function GLoader() {
            var _this = _super.call(this) || this;
            _this.$frame = 0;
            _this.$color = 0;
            _this.$contentSourceWidth = 0;
            _this.$contentSourceHeight = 0;
            _this.$contentWidth = 0;
            _this.$contentHeight = 0;
            _this.$playing = true;
            _this.$url = "";
            _this.$fill = 0 /* None */;
            _this.$align = "left" /* Left */;
            _this.$verticalAlign = 0 /* Top */;
            _this.$showErrorSign = true;
            _this.$color = 0xFFFFFF;
            return _this;
        }
        GLoader.prototype.createDisplayObject = function () {
            this.$container = new fgui.UIContainer(this);
            this.$container.hitArea = new PIXI.Rectangle();
            this.setDisplayObject(this.$container);
            this.$container.interactiveChildren = false;
        };
        GLoader.prototype.dispose = function () {
            this.clearContent();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(GLoader.prototype, "url", {
            get: function () {
                return this.$url;
            },
            set: function (value) {
                if (this.$url == value)
                    return;
                this.$url = value;
                this.loadContent();
                this.updateGear(7 /* Icon */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "icon", {
            get: function () {
                return this.$url;
            },
            set: function (value) {
                this.url = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "align", {
            get: function () {
                return this.$align;
            },
            set: function (value) {
                if (this.$align != value) {
                    this.$align = value;
                    this.updateLayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "verticalAlign", {
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                if (this.$verticalAlign != value) {
                    this.$verticalAlign = value;
                    this.updateLayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "fill", {
            get: function () {
                return this.$fill;
            },
            set: function (value) {
                if (this.$fill != value) {
                    this.$fill = value;
                    this.updateLayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "autoSize", {
            get: function () {
                return this.$autoSize;
            },
            set: function (value) {
                if (this.$autoSize != value) {
                    this.$autoSize = value;
                    this.updateLayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "playing", {
            get: function () {
                return this.$playing;
            },
            set: function (value) {
                if (this.$playing != value) {
                    this.$playing = value;
                    if (this.$content instanceof fgui.MovieClip)
                        this.$content.playing = value;
                    this.updateGear(5 /* Animation */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "frame", {
            get: function () {
                return this.$frame;
            },
            set: function (value) {
                if (this.$frame != value) {
                    this.$frame = value;
                    if (this.$content instanceof fgui.MovieClip)
                        this.$content.currentFrame = value;
                    this.updateGear(5 /* Animation */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "color", {
            get: function () {
                return this.$color;
            },
            set: function (value) {
                if (this.$color != value) {
                    this.$color = value;
                    this.updateGear(4 /* Color */);
                    this.applyColor();
                }
            },
            enumerable: true,
            configurable: true
        });
        GLoader.prototype.applyColor = function () {
            if (this.$content)
                this.$content.tint = this.$color;
        };
        Object.defineProperty(GLoader.prototype, "showErrorSign", {
            get: function () {
                return this.$showErrorSign;
            },
            set: function (value) {
                this.$showErrorSign = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "content", {
            get: function () {
                return this.$content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GLoader.prototype, "texture", {
            get: function () {
                if (this.$content instanceof fgui.UIImage)
                    return this.$content.texture;
                else
                    return null;
            },
            set: function (value) {
                this.url = null;
                this.switchToMovieMode(false);
                if (this.$content instanceof fgui.UIImage)
                    this.$content.texture = value;
                if (value) {
                    this.$contentSourceWidth = value.orig.width;
                    this.$contentSourceHeight = value.orig.height;
                }
                else
                    this.$contentSourceWidth = this.$contentHeight = 0;
                this.updateLayout();
            },
            enumerable: true,
            configurable: true
        });
        GLoader.prototype.loadContent = function () {
            this.clearContent();
            if (!this.$url)
                return;
            if (fgui.utils.StringUtil.startsWith(this.$url, "ui://"))
                this.loadFromPackage(this.$url);
            else
                this.loadExternal();
        };
        GLoader.prototype.loadFromPackage = function (itemURL) {
            this.$contentItem = fgui.UIPackage.getItemByURL(itemURL);
            if (this.$contentItem) {
                this.$contentItem.load();
                if (this.$contentItem.type == 0 /* Image */) {
                    if (this.$contentItem.texture == null) {
                        this.setErrorState();
                    }
                    else {
                        this.switchToMovieMode(false);
                        this.$content.$initDisp(this.$contentItem);
                        this.$contentSourceWidth = this.$contentItem.width;
                        this.$contentSourceHeight = this.$contentItem.height;
                        this.updateLayout();
                    }
                }
                else if (this.$contentItem.type == 2 /* MovieClip */) {
                    this.switchToMovieMode(true);
                    this.$contentSourceWidth = this.$contentItem.width;
                    this.$contentSourceHeight = this.$contentItem.height;
                    var mc = this.$content;
                    mc.interval = this.$contentItem.interval;
                    mc.swing = this.$contentItem.swing;
                    mc.repeatDelay = this.$contentItem.repeatDelay;
                    mc.frames = this.$contentItem.frames;
                    mc.boundsRect = new PIXI.Rectangle(0, 0, this.$contentSourceWidth, this.$contentSourceHeight);
                    this.updateLayout();
                }
                else
                    this.setErrorState();
            }
            else
                this.setErrorState();
        };
        GLoader.prototype.switchToMovieMode = function (value) {
            this.$container.removeChildren();
            if (value) {
                if (!(this.$content instanceof fgui.MovieClip))
                    this.$content = new fgui.MovieClip(this);
            }
            else {
                if (!(this.$content instanceof fgui.UIImage))
                    this.$content = new fgui.UIImage(null);
            }
            this.$container.addChild(this.$content);
        };
        /**overwrite this for load resources by your own way */
        GLoader.prototype.loadExternal = function () {
            var texture = PIXI.utils.TextureCache[this.$url];
            if (!texture) {
                texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(this.$url));
                PIXI.Texture.addToCache(texture, this.$url);
            }
            this.$loadResCompleted(texture);
        };
        /**free the resource you loaded */
        GLoader.prototype.freeExternal = function (texture) {
            PIXI.Texture.removeFromCache(texture);
            texture.destroy(true);
        };
        GLoader.prototype.$loadResCompleted = function (res) {
            if (res)
                this.onExternalLoadSuccess(res);
            else
                this.onExternalLoadFailed();
        };
        /**content loaded */
        GLoader.prototype.onExternalLoadSuccess = function (texture) {
            this.$container.removeChildren();
            if (!this.$content || !(this.$content instanceof fgui.UIImage)) {
                this.$content = new fgui.UIImage(null);
                this.$content.$initDisp();
                this.$container.addChild(this.$content);
            }
            else
                this.$container.addChild(this.$content);
            this.$content.texture = texture;
            this.$contentSourceWidth = texture.orig.width;
            this.$contentSourceHeight = texture.orig.height;
            this.updateLayout();
        };
        GLoader.prototype.onExternalLoadFailed = function () {
            this.setErrorState();
        };
        GLoader.prototype.setErrorState = function () {
            if (!this.$showErrorSign)
                return;
            if (this.$errorSign == null) {
                if (fgui.UIConfig.loaderErrorSign) {
                    this.$errorSign = GLoader.$errorSignPool.get(fgui.UIConfig.loaderErrorSign);
                }
            }
            if (this.$errorSign) {
                this.$errorSign.width = this.width;
                this.$errorSign.height = this.height;
                this.$container.addChild(this.$errorSign.displayObject);
            }
        };
        GLoader.prototype.clearErrorState = function () {
            if (this.$errorSign) {
                this.$container.removeChild(this.$errorSign.displayObject);
                GLoader.$errorSignPool.recycle(this.$errorSign.resourceURL, this.$errorSign);
                this.$errorSign = null;
            }
        };
        GLoader.prototype.updateLayout = function () {
            if (this.$content == null) {
                if (this.$autoSize) {
                    this.$updatingLayout = true;
                    this.setSize(50, 30);
                    this.$updatingLayout = false;
                }
                return;
            }
            this.$content.position.set(0, 0);
            this.$content.scale.set(1, 1);
            this.$contentWidth = this.$contentSourceWidth;
            this.$contentHeight = this.$contentSourceHeight;
            if (this.$autoSize) {
                this.$updatingLayout = true;
                if (this.$contentWidth == 0)
                    this.$contentWidth = 50;
                if (this.$contentHeight == 0)
                    this.$contentHeight = 30;
                this.setSize(this.$contentWidth, this.$contentHeight);
                this.$updatingLayout = false;
            }
            else {
                var sx = 1, sy = 1;
                if (this.$fill != 0 /* None */) {
                    sx = this.width / this.$contentSourceWidth;
                    sy = this.height / this.$contentSourceHeight;
                    if (sx != 1 || sy != 1) {
                        if (this.$fill == 2 /* ScaleMatchHeight */)
                            sx = sy;
                        else if (this.$fill == 3 /* ScaleMatchWidth */)
                            sy = sx;
                        else if (this.$fill == 1 /* Scale */) {
                            if (sx > sy)
                                sx = sy;
                            else
                                sy = sx;
                        }
                        this.$contentWidth = this.$contentSourceWidth * sx;
                        this.$contentHeight = this.$contentSourceHeight * sy;
                    }
                }
                if (this.$content instanceof fgui.UIImage) {
                    this.$content.width = this.$contentWidth;
                    this.$content.height = this.$contentHeight;
                }
                else
                    this.$content.scale.set(sx, sy);
                if (this.$align == "center" /* Center */)
                    this.$content.x = Math.floor((this.width - this.$contentWidth) / 2);
                else if (this.$align == "right" /* Right */)
                    this.$content.x = this.width - this.$contentWidth;
                if (this.$verticalAlign == 1 /* Middle */)
                    this.$content.y = Math.floor((this.height - this.$contentHeight) / 2);
                else if (this.$verticalAlign == 2 /* Bottom */)
                    this.$content.y = this.height - this.$contentHeight;
            }
        };
        GLoader.prototype.clearContent = function () {
            this.clearErrorState();
            if (this.$content && this.$content.parent)
                this.$container.removeChild(this.$content);
            if (this.$contentItem == null && this.$content instanceof fgui.UIImage)
                this.freeExternal(this.$content.texture);
            this.$content && this.$content.destroy();
            this.$content = null;
            this.$contentItem = null;
        };
        GLoader.prototype.handleSizeChanged = function () {
            if (!this.$updatingLayout)
                this.updateLayout();
            var rect = this.$container.hitArea; //TODO: hitArea can be Rectangle | Circle | Ellipse | Polygon | RoundedRectangle
            rect.x = rect.y = 0;
            rect.width = this.width;
            rect.height = this.height;
        };
        GLoader.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            var str;
            str = xml.attributes.url;
            if (str)
                this.$url = str;
            str = xml.attributes.align;
            if (str)
                this.$align = fgui.ParseAlignType(str);
            str = xml.attributes.vAlign;
            if (str)
                this.$verticalAlign = fgui.ParseVertAlignType(str);
            str = xml.attributes.fill;
            if (str)
                this.$fill = fgui.ParseLoaderFillType(str);
            this.$autoSize = xml.attributes.autoSize == "true";
            str = xml.attributes.errorSign;
            if (str)
                this.$showErrorSign = str == "true";
            this.$playing = xml.attributes.playing != "false";
            str = xml.attributes.color;
            if (str)
                this.color = fgui.utils.StringUtil.convertFromHtmlColor(str);
            if (this.$url)
                this.loadContent();
        };
        GLoader.$errorSignPool = new fgui.utils.GObjectRecycler();
        return GLoader;
    }(fgui.GObject));
    fgui.GLoader = GLoader;
})(fgui || (fgui = {}));
/// <reference path="./GObject.ts" />
var fgui;
(function (fgui) {
    var GMovieClip = (function (_super) {
        __extends(GMovieClip, _super);
        function GMovieClip() {
            return _super.call(this) || this;
        }
        GMovieClip.prototype.mapPivotWidth = function (scale) {
            return scale * this.$sourceWidth;
        };
        GMovieClip.prototype.mapPivotHeight = function (scale) {
            return scale * this.$sourceHeight;
        };
        GMovieClip.prototype.handleSizeChanged = function () {
            if (this.$displayObject != null && this.$sourceWidth != 0 && this.$sourceHeight != 0)
                this.$displayObject.scale.set(this.$width / this.$sourceWidth * this.$scaleX, this.$height / this.$sourceHeight * this.$scaleY);
        };
        GMovieClip.prototype.handleScaleChanged = function () {
            if (this.$displayObject != null) {
                this.$displayObject.scale.set(this.$width / this.$sourceWidth * this.$scaleX, this.$height / this.$sourceHeight * this.$scaleY);
            }
        };
        Object.defineProperty(GMovieClip.prototype, "touchable", {
            get: function () {
                return false;
            },
            set: function (value) {
                this.$touchable = false; //GMovieClip has no interaction
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GMovieClip.prototype, "color", {
            get: function () {
                return this.$movieClip.tint;
            },
            set: function (value) {
                this.$movieClip.tint = value;
            },
            enumerable: true,
            configurable: true
        });
        GMovieClip.prototype.createDisplayObject = function () {
            this.$movieClip = new fgui.MovieClip(this);
            this.setDisplayObject(this.$movieClip);
        };
        Object.defineProperty(GMovieClip.prototype, "playing", {
            get: function () {
                return this.$movieClip.playing;
            },
            set: function (value) {
                if (this.$movieClip.playing != value) {
                    this.$movieClip.playing = value;
                    this.updateGear(5 /* Animation */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GMovieClip.prototype, "frame", {
            get: function () {
                return this.$movieClip.currentFrame;
            },
            set: function (value) {
                if (this.$movieClip.currentFrame != value) {
                    this.$movieClip.currentFrame = value;
                    this.updateGear(5 /* Animation */);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Modify the playing settings for the current MovieClip object, there are two ways to call this method:
         * 1) pass whole parameters:
                startFrame: number;
                endFrame: number;
                repeatCount: number;
                loopEndAt: number;
                endCallback: (target?: MovieClip) => void;
                endCallbackContext: any;
         * 2) just pass 1 object which implements MovieClipSettings (recommended)
         */
        GMovieClip.prototype.setPlaySettings = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.$movieClip.setPlaySettings.apply(this.$movieClip, args);
        };
        GMovieClip.prototype.constructFromResource = function () {
            this.$sourceWidth = this.packageItem.width;
            this.$sourceHeight = this.packageItem.height;
            this.$initWidth = this.$sourceWidth;
            this.$initHeight = this.$sourceHeight;
            this.setSize(this.$sourceWidth, this.$sourceHeight);
            this.packageItem.load();
            this.$movieClip.interval = this.packageItem.interval;
            this.$movieClip.swing = this.packageItem.swing;
            this.$movieClip.repeatDelay = this.packageItem.repeatDelay;
            this.$movieClip.frames = this.packageItem.frames;
            this.$movieClip.boundsRect = new PIXI.Rectangle(0, 0, this.$sourceWidth, this.$sourceHeight);
        };
        GMovieClip.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            var str;
            str = xml.attributes.frame;
            if (str)
                this.$movieClip.currentFrame = parseInt(str);
            str = xml.attributes.playing;
            this.$movieClip.playing = str != "false";
            str = xml.attributes.color;
            if (str)
                this.color = fgui.utils.StringUtil.convertFromHtmlColor(str);
        };
        return GMovieClip;
    }(fgui.GObject));
    fgui.GMovieClip = GMovieClip;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GProgressBar = (function (_super) {
        __extends(GProgressBar, _super);
        function GProgressBar() {
            var _this = _super.call(this) || this;
            _this.$max = 0;
            _this.$value = 0;
            _this.$barMaxWidth = 0;
            _this.$barMaxHeight = 0;
            _this.$barMaxWidthDelta = 0;
            _this.$barMaxHeightDelta = 0;
            _this.$barStartX = 0;
            _this.$barStartY = 0;
            _this.$tweenValue = 0;
            _this.$titleType = 0 /* Percent */;
            _this.$value = 50;
            _this.$max = 100;
            return _this;
        }
        Object.defineProperty(GProgressBar.prototype, "titleType", {
            get: function () {
                return this.$titleType;
            },
            set: function (value) {
                if (this.$titleType != value) {
                    this.$titleType = value;
                    this.update(this.$value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GProgressBar.prototype, "max", {
            get: function () {
                return this.$max;
            },
            set: function (value) {
                if (this.$max != value) {
                    this.$max = value;
                    this.update(this.$value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GProgressBar.prototype, "value", {
            get: function () {
                return this.$value;
            },
            set: function (value) {
                if (this.$tweener != null) {
                    this.$tweener.paused = true;
                    this.$tweener = null;
                }
                if (this.$value != value) {
                    this.$value = value;
                    this.update(this.$value);
                }
            },
            enumerable: true,
            configurable: true
        });
        GProgressBar.prototype.tweenValue = function (value, duration) {
            if (this.$value != value) {
                if (this.$tweener)
                    this.$tweener.paused = true;
                this.$tweenValue = this.$value;
                this.$value = value;
                this.$tweener = createjs.Tween.get(this, { onChange: fgui.utils.Binder.create(this.onUpdateTween, this) })
                    .to({ $tweenValue: value }, duration * 1000, GProgressBar.easeLinear);
                return this.$tweener;
            }
            else
                return null;
        };
        GProgressBar.prototype.onUpdateTween = function () {
            this.update(this.$tweenValue);
        };
        GProgressBar.prototype.update = function (newValue) {
            var percent = Math.min(newValue / this.$max, 1);
            if (this.$titleObject) {
                switch (this.$titleType) {
                    case 0 /* Percent */:
                        this.$titleObject.text = Math.round(percent * 100) + "%";
                        break;
                    case 1 /* ValueAndMax */:
                        this.$titleObject.text = Math.round(newValue) + "/" + Math.round(this.$max);
                        break;
                    case 2 /* Value */:
                        this.$titleObject.text = "" + Math.round(newValue);
                        break;
                    case 3 /* Max */:
                        this.$titleObject.text = "" + Math.round(this.$max);
                        break;
                }
            }
            var fullWidth = this.width - this.$barMaxWidthDelta;
            var fullHeight = this.height - this.$barMaxHeightDelta;
            if (!this.$reverse) {
                if (this.$barObjectH)
                    this.$barObjectH.width = fullWidth * percent;
                if (this.$barObjectV)
                    this.$barObjectV.height = fullHeight * percent;
            }
            else {
                if (this.$barObjectH) {
                    this.$barObjectH.width = fullWidth * percent;
                    this.$barObjectH.x = this.$barStartX + (fullWidth - this.$barObjectH.width);
                }
                if (this.$barObjectV) {
                    this.$barObjectV.height = fullHeight * percent;
                    this.$barObjectV.y = this.$barStartY + (fullHeight - this.$barObjectV.height);
                }
            }
            if (this.$aniObject instanceof fgui.GMovieClip)
                this.$aniObject.frame = Math.round(percent * 100);
        };
        GProgressBar.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "ProgressBar")[0];
            var str;
            str = xml.attributes.titleType;
            if (str)
                this.$titleType = fgui.ParseProgressTitleType(str);
            this.$reverse = xml.attributes.reverse == "true";
            this.$titleObject = this.getChild("title");
            this.$barObjectH = this.getChild("bar");
            this.$barObjectV = this.getChild("bar_v");
            this.$aniObject = this.getChild("ani");
            if (this.$barObjectH) {
                this.$barMaxWidth = this.$barObjectH.width;
                this.$barMaxWidthDelta = this.width - this.$barMaxWidth;
                this.$barStartX = this.$barObjectH.x;
            }
            if (this.$barObjectV) {
                this.$barMaxHeight = this.$barObjectV.height;
                this.$barMaxHeightDelta = this.height - this.$barMaxHeight;
                this.$barStartY = this.$barObjectV.y;
            }
        };
        GProgressBar.prototype.handleSizeChanged = function () {
            _super.prototype.handleSizeChanged.call(this);
            if (this.$barObjectH)
                this.$barMaxWidth = this.width - this.$barMaxWidthDelta;
            if (this.$barObjectV)
                this.$barMaxHeight = this.height - this.$barMaxHeightDelta;
            if (!this.$inProgressBuilding)
                this.update(this.$value);
        };
        GProgressBar.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "ProgressBar")[0];
            if (xml) {
                this.$value = parseInt(xml.attributes.value) || 0;
                this.$max = parseInt(xml.attributes.max) || 0;
            }
            this.update(this.$value);
        };
        GProgressBar.prototype.dispose = function () {
            if (this.$tweener) {
                this.$tweener.paused = true;
                this.$tweener.removeAllEventListeners();
            }
            createjs.Tween.removeTweens(this);
            this.$tweener = null;
            _super.prototype.dispose.call(this);
        };
        GProgressBar.easeLinear = fgui.ParseEaseType("linear"); // createjs.Ease.getPowIn(1);
        return GProgressBar;
    }(fgui.GComponent));
    fgui.GProgressBar = GProgressBar;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var LineInfo = (function () {
        function LineInfo() {
            this.width = 0;
            this.height = 0;
            this.textHeight = 0;
            this.y = 0;
        }
        LineInfo.get = function () {
            if (LineInfo.pool.length) {
                var ret = LineInfo.pool.pop();
                ret.width = 0;
                ret.height = 0;
                ret.textHeight = 0;
                ret.text = null;
                ret.y = 0;
                return ret;
            }
            else
                return new LineInfo();
        };
        LineInfo.recycle = function (value) {
            LineInfo.pool.push(value);
        };
        LineInfo.recycleMany = function (value) {
            if (value && value.length) {
                value.forEach(function (v) {
                    LineInfo.pool.push(v);
                }, this);
            }
            value.length = 0;
        };
        LineInfo.pool = [];
        return LineInfo;
    }());
    fgui.LineInfo = LineInfo;
    var GTextField = (function (_super) {
        __extends(GTextField, _super);
        function GTextField() {
            var _this = _super.call(this) || this;
            _this.$verticalAlign = 0 /* Top */;
            _this.$offset = new PIXI.Point();
            _this.$singleLine = true;
            _this.$text = "";
            _this.$textWidth = 0;
            _this.$textHeight = 0;
            _this.$style = new PIXI.TextStyle({
                fontSize: 12,
                fontFamily: fgui.UIConfig.defaultFont,
                align: "left" /* Left */,
                leading: 3,
                fill: 0
            });
            _this.$verticalAlign = 0 /* Top */;
            _this.$text = "";
            _this.$autoSize = 1 /* Both */;
            _this.$widthAutoSize = true;
            _this.$heightAutoSize = true;
            _this.$bitmapPool = [];
            _this.touchable = false; //base GTextField has no interaction
            return _this;
        }
        GTextField.prototype.createDisplayObject = function () {
            this.$textField = new fgui.UITextField(this);
            this.setDisplayObject(this.$textField);
        };
        GTextField.prototype.switchBitmapMode = function (val) {
            if (val && this.displayObject == this.$textField) {
                if (this.$btContainer == null)
                    this.$btContainer = new fgui.UIContainer(this);
                this.switchDisplayObject(this.$btContainer);
            }
            else if (!val && this.displayObject == this.$btContainer)
                this.switchDisplayObject(this.$textField);
        };
        GTextField.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.$render, this);
            this.$bitmapFont = null;
            this.$bitmapPool.length = 0;
            this.$bitmapPool = null;
            this.$style = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(GTextField.prototype, "text", {
            get: function () {
                return this.getText();
            },
            set: function (value) {
                this.setText(value);
            },
            enumerable: true,
            configurable: true
        });
        GTextField.prototype.setText = function (value) {
            if (value == null)
                value = "";
            if (this.$text == value)
                return;
            this.$text = value;
            this.updateGear(6 /* Text */);
            if (this.parent && this.parent.$inProgressBuilding)
                this.renderNow();
            else
                this.render();
        };
        GTextField.prototype.getText = function () {
            return this.$text;
        };
        Object.defineProperty(GTextField.prototype, "color", {
            get: function () {
                return this.getColor();
            },
            set: function (value) {
                this.setColor(value);
            },
            enumerable: true,
            configurable: true
        });
        GTextField.prototype.getColor = function () {
            return this.$color;
        };
        GTextField.prototype.setColor = function (value) {
            if (this.$color != value) {
                this.$color = value;
                this.updateGear(4 /* Color */);
                this.$style.fill = this.$color;
                this.render();
            }
        };
        Object.defineProperty(GTextField.prototype, "titleColor", {
            get: function () {
                return this.color;
            },
            set: function (value) {
                this.color = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "lineHeight", {
            get: function () {
                if (this.$style.lineHeight > 0)
                    return this.$style.lineHeight;
                if (!this.$fontProperties)
                    return (+this.$style.fontSize) + this.$style.strokeThickness; //rough value
                return this.$fontProperties.fontSize + this.$style.strokeThickness + this.$style.leading;
            },
            set: function (lh) {
                this.$style.lineHeight = lh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "font", {
            get: function () {
                return this.$font || fgui.UIConfig.defaultFont;
            },
            set: function (value) {
                if (this.$font != value) {
                    this.$font = value;
                    if (this.$font && fgui.utils.StringUtil.startsWith(this.$font, "ui://"))
                        this.$bitmapFont = fgui.UIPackage.getBitmapFontByURL(this.$font);
                    else
                        this.$style.fontFamily = this.$font || fgui.UIConfig.defaultFont;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "fontSize", {
            get: function () {
                return +this.$style.fontSize;
            },
            set: function (value) {
                if (value <= 0)
                    return;
                if (this.$style.fontSize != value) {
                    this.$style.fontSize = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "align", {
            get: function () {
                return this.$style.align;
            },
            set: function (value) {
                if (this.$style.align != value) {
                    this.$style.align = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "verticalAlign", {
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                if (this.$verticalAlign != value) {
                    this.$verticalAlign = value;
                    if (!this.$inProgressBuilding)
                        this.layoutAlign();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "leading", {
            get: function () {
                return this.$style.leading;
            },
            set: function (value) {
                if (this.$style.leading != value) {
                    this.$style.leading = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "letterSpacing", {
            get: function () {
                return this.$style.letterSpacing;
            },
            set: function (value) {
                if (this.$style.letterSpacing != value) {
                    this.$style.letterSpacing = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "underline", {
            get: function () {
                return false; //TODO: not supported yet
            },
            set: function (value) {
                //TODO: not supported yet
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "bold", {
            get: function () {
                return this.$style.fontWeight == "bold";
            },
            set: function (value) {
                var v = value === true ? "bold" : "normal";
                if (this.$style.fontWeight != v) {
                    this.$style.fontWeight = v;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "weight", {
            get: function () {
                return this.$style.fontWeight;
            },
            set: function (v) {
                if (this.$style.fontWeight != v) {
                    this.$style.fontWeight = v;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "variant", {
            get: function () {
                return this.$style.fontVariant;
            },
            set: function (v) {
                if (this.$style.fontVariant != v) {
                    this.$style.fontVariant = v;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "italic", {
            get: function () {
                return this.$style.fontStyle == "italic";
            },
            set: function (value) {
                var v = value === true ? "italic" : "normal";
                if (this.$style.fontStyle != v) {
                    this.$style.fontStyle = v;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "multipleLine", {
            get: function () {
                return !this.$singleLine;
            },
            set: function (value) {
                value = !value;
                if (this.$singleLine != value) {
                    this.$singleLine = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "stroke", {
            get: function () {
                return +this.$style.strokeThickness;
            },
            set: function (value) {
                if (this.$style.strokeThickness != value)
                    this.$style.strokeThickness = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "strokeColor", {
            get: function () {
                return this.$style.stroke;
            },
            set: function (value) {
                if (this.$style.stroke != value)
                    this.$style.stroke = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "autoSize", {
            get: function () {
                return this.$autoSize;
            },
            set: function (value) {
                if (this.$autoSize != value) {
                    this.$autoSize = value;
                    this.$widthAutoSize = (value == 1 /* Both */ || value == 3 /* Shrink */);
                    this.$heightAutoSize = (value == 1 /* Both */ || value == 2 /* Height */);
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "textWidth", {
            get: function () {
                if (this.$requireRender)
                    this.renderNow();
                return this.$textWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextField.prototype, "textHeight", {
            get: function () {
                if (this.$requireRender)
                    this.renderNow();
                return this.$textHeight;
            },
            enumerable: true,
            configurable: true
        });
        GTextField.prototype.ensureSizeCorrect = function () {
            if (this.$sizeDirty && this.$requireRender)
                this.renderNow();
        };
        GTextField.prototype.render = function () {
            if (!this.$requireRender) {
                this.$requireRender = true;
                fgui.GTimer.inst.callLater(this.$render, this);
            }
            if (!this.$sizeDirty && (this.$widthAutoSize || this.$heightAutoSize)) {
                this.$sizeDirty = true;
                this.emit("__sizeDelayChange" /* SIZE_DELAY_CHANGE */, this);
            }
        };
        GTextField.prototype.applyStyle = function () {
            this.$textField.style.stroke = this.$style.stroke;
            this.$textField.style.strokeThickness = this.$style.strokeThickness;
            this.$textField.style.fontStyle = this.$style.fontStyle;
            this.$textField.style.fontVariant = this.$style.fontVariant;
            this.$textField.style.fontWeight = this.$style.fontWeight;
            this.$textField.style.letterSpacing = this.$style.letterSpacing;
            this.$textField.style.align = this.$style.align;
            this.$textField.style.fontSize = this.$style.fontSize;
            this.$textField.style.fontFamily = this.$style.fontFamily;
            this.$textField.style.fill = this.$style.fill;
            this.$textField.style.leading = this.$style.leading;
        };
        GTextField.prototype.$render = function () {
            if (this.$requireRender)
                this.renderNow();
        };
        GTextField.prototype.renderNow = function (updateBounds) {
            if (updateBounds === void 0) { updateBounds = true; }
            this.$requireRender = false;
            this.$sizeDirty = false;
            if (this.$bitmapFont != null) {
                this.renderWithBitmapFont(updateBounds);
                return;
            }
            this.switchBitmapMode(false);
            this.applyStyle();
            this.$textField.$updateMinHeight();
            var wordWrap = !this.$widthAutoSize && this.multipleLine;
            this.$textField.width = this.$textField.style.wordWrapWidth = (wordWrap || this.autoSize == 0 /* None */) ? Math.ceil(this.width) : 10000;
            this.$textField.style.wordWrap = wordWrap;
            this.$textField.style.breakWords = wordWrap;
            this.$textField.text = this.$text; //trigger t.dirty = true
            this.$fontProperties = PIXI.TextMetrics.measureFont(this.$style.toFontString());
            this.$textWidth = Math.ceil(this.$textField.textWidth);
            if (this.$textWidth > 0)
                this.$textWidth += GTextField.GUTTER_X * 2; //margin gap
            this.$textHeight = Math.ceil(this.$textField.textHeight);
            if (this.$textHeight > 0)
                this.$textHeight += GTextField.GUTTER_Y * 2; //margin gap
            var w = this.width, h = this.height;
            if (this.autoSize == 3 /* Shrink */)
                this.shrinkTextField();
            else {
                this.$textField.scale.set(1, 1);
                if (this.$widthAutoSize) {
                    w = this.$textWidth;
                    this.$textField.width = w;
                }
                else {
                    w = this.width;
                    if (this.$heightAutoSize) {
                        h = this.$textHeight;
                        if (this.$textField.height != this.$textHeight)
                            this.$textField.height = this.$textHeight;
                    }
                    else {
                        h = this.height;
                        if (this.$textHeight > h)
                            this.$textHeight = h;
                    }
                }
            }
            if (updateBounds) {
                this.$updatingSize = true;
                this.setSize(w, h);
                this.$updatingSize = false;
            }
            this.layoutAlign();
        };
        GTextField.prototype.renderWithBitmapFont = function (updateBounds) {
            var _this = this;
            this.switchBitmapMode(true);
            this.$btContainer.children.forEach(function (c, i) {
                _this.$bitmapPool.push(_this.$btContainer.getChildAt(i));
            }, this);
            this.$btContainer.removeChildren();
            if (!this.$lines)
                this.$lines = [];
            else
                LineInfo.recycleMany(this.$lines);
            var letterSpacing = this.letterSpacing;
            var lineSpacing = this.leading - 1;
            var rectWidth = this.width - GTextField.GUTTER_X * 2;
            var lineWidth = 0, lineHeight = 0, lineTextHeight = 0;
            var glyphWidth = 0, glyphHeight = 0;
            var wordChars = 0, wordStart = 0, wordEnd = 0;
            var lastLineHeight = 0;
            var lineBuffer = "";
            var lineY = GTextField.GUTTER_Y;
            var line;
            var wordWrap = !this.$widthAutoSize && this.multipleLine;
            var fontScale = this.$bitmapFont.resizable ? this.fontSize / this.$bitmapFont.size : 1;
            var glyph;
            this.$textWidth = 0;
            this.$textHeight = 0;
            var textLength = this.text.length;
            for (var offset = 0; offset < textLength; ++offset) {
                var ch = this.$text.charAt(offset);
                var cc = ch.charCodeAt(offset);
                if (ch == "\n") {
                    lineBuffer += ch;
                    line = LineInfo.get();
                    line.width = lineWidth;
                    if (lineTextHeight == 0) {
                        if (lastLineHeight == 0)
                            lastLineHeight = Math.ceil(this.fontSize * fontScale);
                        if (lineHeight == 0)
                            lineHeight = lastLineHeight;
                        lineTextHeight = lineHeight;
                    }
                    line.height = lineHeight;
                    lastLineHeight = lineHeight;
                    line.textHeight = lineTextHeight;
                    line.text = lineBuffer;
                    line.y = lineY;
                    lineY += (line.height + lineSpacing);
                    if (line.width > this.$textWidth)
                        this.$textWidth = line.width;
                    this.$lines.push(line);
                    lineBuffer = "";
                    lineWidth = 0;
                    lineHeight = 0;
                    lineTextHeight = 0;
                    wordChars = 0;
                    wordStart = 0;
                    wordEnd = 0;
                    continue;
                }
                if (cc > 256 || cc <= 32) {
                    if (wordChars > 0)
                        wordEnd = lineWidth;
                    wordChars = 0;
                }
                else {
                    if (wordChars == 0)
                        wordStart = lineWidth;
                    wordChars++;
                }
                if (ch == " ") {
                    glyphWidth = Math.ceil(this.fontSize / 2);
                    glyphHeight = Math.ceil(this.fontSize);
                }
                else {
                    glyph = this.$bitmapFont.glyphs[ch];
                    if (glyph) {
                        glyphWidth = Math.ceil(glyph.advance * fontScale);
                        glyphHeight = Math.ceil(glyph.lineHeight * fontScale);
                    }
                    else if (ch == " ") {
                        glyphWidth = Math.ceil(this.$bitmapFont.size * fontScale / 2);
                        glyphHeight = Math.ceil(this.$bitmapFont.size * fontScale);
                    }
                    else {
                        glyphWidth = 0;
                        glyphHeight = 0;
                    }
                }
                if (glyphHeight > lineTextHeight)
                    lineTextHeight = glyphHeight;
                if (glyphHeight > lineHeight)
                    lineHeight = glyphHeight;
                if (lineWidth != 0)
                    lineWidth += letterSpacing;
                lineWidth += glyphWidth;
                if (!wordWrap || lineWidth <= rectWidth) {
                    lineBuffer += ch;
                }
                else {
                    line = LineInfo.get();
                    line.height = lineHeight;
                    line.textHeight = lineTextHeight;
                    if (lineBuffer.length == 0) {
                        line.text = ch;
                    }
                    else if (wordChars > 0 && wordEnd > 0) {
                        lineBuffer += ch;
                        var len = lineBuffer.length - wordChars;
                        line.text = fgui.utils.StringUtil.trimRight(lineBuffer.substr(0, len));
                        line.width = wordEnd;
                        lineBuffer = lineBuffer.substr(len + 1);
                        lineWidth -= wordStart;
                    }
                    else {
                        line.text = lineBuffer;
                        line.width = lineWidth - (glyphWidth + letterSpacing);
                        lineBuffer = ch;
                        lineWidth = glyphWidth;
                        lineHeight = glyphHeight;
                        lineTextHeight = glyphHeight;
                    }
                    line.y = lineY;
                    lineY += (line.height + lineSpacing);
                    if (line.width > this.$textWidth)
                        this.$textWidth = line.width;
                    wordChars = 0;
                    wordStart = 0;
                    wordEnd = 0;
                    this.$lines.push(line);
                }
            }
            if (lineBuffer.length > 0
                || this.$lines.length > 0 && fgui.utils.StringUtil.endsWith(this.$lines[this.$lines.length - 1].text, "\n")) {
                line = LineInfo.get();
                line.width = lineWidth;
                if (lineHeight == 0)
                    lineHeight = lastLineHeight;
                if (lineTextHeight == 0)
                    lineTextHeight = lineHeight;
                line.height = lineHeight;
                line.textHeight = lineTextHeight;
                line.text = lineBuffer;
                line.y = lineY;
                if (line.width > this.$textWidth)
                    this.$textWidth = line.width;
                this.$lines.push(line);
            }
            if (this.$textWidth > 0)
                this.$textWidth += GTextField.GUTTER_X * 2;
            var count = this.$lines.length;
            if (count == 0) {
                this.$textHeight = 0;
            }
            else {
                line = this.$lines[this.$lines.length - 1];
                this.$textHeight = line.y + line.height + GTextField.GUTTER_Y;
            }
            var w, h = 0;
            if (this.$widthAutoSize) {
                if (this.$textWidth == 0)
                    w = 0;
                else
                    w = this.$textWidth;
            }
            else
                w = this.width;
            if (this.$heightAutoSize) {
                if (this.$textHeight == 0)
                    h = 0;
                else
                    h = this.$textHeight;
            }
            else
                h = this.height;
            if (updateBounds) {
                this.$updatingSize = true;
                this.setSize(w, h);
                this.$updatingSize = false;
            }
            if (w == 0 || h == 0)
                return;
            rectWidth = this.width - GTextField.GUTTER_X * 2;
            this.$lines.forEach(function (line) {
                var charX = GTextField.GUTTER_X;
                var lineIndent = 0;
                var charIndent = 0;
                if (_this.align == "center" /* Center */)
                    lineIndent = (rectWidth - line.width) / 2;
                else if (_this.align == "right" /* Right */)
                    lineIndent = rectWidth - line.width;
                else
                    lineIndent = 0;
                textLength = line.text.length;
                for (var j = 0; j < textLength; j++) {
                    var ch = line.text.charAt(j);
                    glyph = _this.$bitmapFont.glyphs[ch];
                    if (glyph != null) {
                        charIndent = (line.height + line.textHeight) / 2 - Math.ceil(glyph.lineHeight * fontScale);
                        var bm = void 0;
                        if (_this.$bitmapPool.length)
                            bm = _this.$bitmapPool.pop();
                        else
                            bm = new PIXI.Sprite();
                        bm.x = charX + lineIndent + Math.ceil(glyph.offsetX * fontScale);
                        bm.y = line.y + charIndent + Math.ceil(glyph.offsetY * fontScale);
                        bm.texture = glyph.texture;
                        bm.scale.set(fontScale, fontScale);
                        bm.tint = _this.$bitmapFont.colorable === true ? _this.$color : 0xFFFFFF;
                        _this.$btContainer.addChild(bm);
                        charX += letterSpacing + Math.ceil(glyph.advance * fontScale);
                    }
                    else if (ch == " ") {
                        charX += letterSpacing + Math.ceil(_this.$bitmapFont.size * fontScale / 2);
                    }
                    else {
                        charX += letterSpacing;
                    }
                }
            });
        };
        GTextField.prototype.localToGlobal = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            ax -= this.$offset.x;
            ay -= this.$offset.y;
            return _super.prototype.localToGlobal.call(this, ax, ay, resultPoint);
        };
        GTextField.prototype.globalToLocal = function (ax, ay, resultPoint) {
            if (ax === void 0) { ax = 0; }
            if (ay === void 0) { ay = 0; }
            var r = _super.prototype.globalToLocal.call(this, ax, ay, resultPoint);
            r.x -= this.$offset.x;
            r.y -= this.$offset.y;
            return r;
        };
        GTextField.prototype.handleSizeChanged = function () {
            if (this.$updatingSize)
                return;
            if (this.$bitmapFont != null) {
                if (!this.$widthAutoSize)
                    this.render();
            }
            else {
                if (this.$inProgressBuilding) {
                    this.$textField.width = this.width;
                    this.$textField.height = this.height;
                }
                else {
                    if (this.$autoSize == 3 /* Shrink */)
                        this.shrinkTextField();
                    else {
                        if (!this.$widthAutoSize) {
                            if (!this.$heightAutoSize) {
                                this.$textField.width = this.width;
                                this.$textField.height = this.height;
                            }
                            else
                                this.$textField.width = this.width;
                        }
                    }
                }
            }
            this.layoutAlign();
        };
        GTextField.prototype.shrinkTextField = function () {
            var fitScale = Math.min(1, this.width / this.$textWidth);
            this.$textField.scale.set(fitScale, fitScale);
        };
        GTextField.prototype.layoutAlign = function () {
            var tw = this.$textWidth, th = this.$textHeight;
            if (this.autoSize == 3 /* Shrink */) {
                tw *= this.displayObject.scale.x;
                th *= this.displayObject.scale.y;
            }
            if (this.$verticalAlign == 0 /* Top */ || th == 0)
                this.$offset.y = GTextField.GUTTER_Y;
            else {
                var dh = Math.max(0, this.height - th);
                if (this.$verticalAlign == 1 /* Middle */)
                    this.$offset.y = dh * .5;
                else if (this.$verticalAlign == 2 /* Bottom */)
                    this.$offset.y = dh;
            }
            var xPos = 0;
            switch (this.$style.align) {
                case "center":
                    xPos = (this.width - tw) * .5;
                    break;
                case "right":
                    xPos = this.width - tw;
                    break;
            }
            this.$offset.x = xPos;
            this.updatePosition();
        };
        GTextField.prototype.updatePosition = function () {
            this.displayObject.position.set(Math.floor(this.x + this.$offset.x), Math.floor(this.y + this.$offset.y));
        };
        GTextField.prototype.handleXYChanged = function () {
            _super.prototype.handleXYChanged.call(this);
            if (this.$displayObject)
                this.updatePosition();
        };
        GTextField.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            var str = xml.attributes.font;
            if (str)
                this.font = str;
            str = xml.attributes.vAlign;
            if (str)
                this.verticalAlign = fgui.ParseVertAlignType(str);
            str = xml.attributes.leading;
            if (str)
                this.$style.leading = parseInt(str);
            str = xml.attributes.letterSpacing;
            if (str)
                this.$style.letterSpacing = parseInt(str);
            str = xml.attributes.fontSize;
            if (str)
                this.$style.fontSize = parseInt(str);
            str = xml.attributes.color;
            if (str)
                this.color = fgui.utils.StringUtil.convertFromHtmlColor(str);
            str = xml.attributes.align;
            if (str)
                this.align = fgui.ParseAlignType(str);
            str = xml.attributes.autoSize;
            if (str) {
                this.autoSize = fgui.ParseAutoSizeType(str);
                this.$widthAutoSize = (this.$autoSize == 1 /* Both */ || this.$autoSize == 3 /* Shrink */);
                this.$heightAutoSize = (this.$autoSize == 1 /* Both */ || this.$autoSize == 2 /* Height */);
            }
            this.underline = xml.attributes.underline == "true";
            this.italic = xml.attributes.italic == "true";
            this.bold = xml.attributes.bold == "true";
            this.multipleLine = xml.attributes.singleLine != "true";
            str = xml.attributes.strokeColor;
            if (str) {
                this.strokeColor = fgui.utils.StringUtil.convertFromHtmlColor(str);
                str = xml.attributes.strokeSize;
                if (str)
                    this.stroke = parseInt(str) + 1;
                else
                    this.stroke = 2;
            }
        };
        GTextField.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            var str = xml.attributes.text;
            if (str != null && str.length > 0)
                this.text = str;
            this.$sizeDirty = false;
        };
        GTextField.GUTTER_X = 2;
        GTextField.GUTTER_Y = 2;
        return GTextField;
    }(fgui.GObject));
    fgui.GTextField = GTextField;
})(fgui || (fgui = {}));
/// <reference path="./GTextField.ts" />
var fgui;
(function (fgui) {
    var TextBlock = (function () {
        function TextBlock() {
        }
        return TextBlock;
    }());
    fgui.TextBlock = TextBlock;
    //TOOD: impl
    var GRichTextField = (function (_super) {
        __extends(GRichTextField, _super);
        function GRichTextField() {
            var _this = _super.call(this) || this;
            _this.$textField.interactive = true;
            _this.$textField.interactiveChildren = false;
            _this.on("__linkClick" /* LinkClick */, _this.$clickLink, _this);
            return _this;
        }
        Object.defineProperty(GRichTextField.prototype, "ubbEnabled", {
            get: function () {
                return this.$ubbEnabled;
            },
            set: function (value) {
                if (this.$ubbEnabled != value) {
                    this.$ubbEnabled = value;
                    this.render();
                }
            },
            enumerable: true,
            configurable: true
        });
        GRichTextField.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            this.$ubbEnabled = xml.attributes.ubb == "true";
        };
        Object.defineProperty(GRichTextField.prototype, "textFlow", {
            set: function (flow) {
                this.$textFlow = flow;
                this.render();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRichTextField.prototype, "text", {
            set: function (value) {
                this.$text = value;
                if (this.$text == null)
                    this.$text = "";
                this.$textField.width = this.width;
                //if(this.$ubbEnabled)
                //this.textFlow = utils.StringUtil.parseUBB(this.$text);   //TODO: parser impl
                this.updateGear(6 /* Text */);
                this.render();
            },
            enumerable: true,
            configurable: true
        });
        GRichTextField.prototype.$clickLink = function (block) {
            this.emit("__linkClick" /* LinkClick */, block.text, this);
        };
        GRichTextField.prototype.dispose = function () {
            this.off("__linkClick" /* LinkClick */, this.$clickLink, this);
            _super.prototype.dispose.call(this);
        };
        return GRichTextField;
    }(fgui.GTextField));
    fgui.GRichTextField = GRichTextField;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GRootPointerStatus = (function () {
        function GRootPointerStatus() {
            this.touchDown = false;
            this.mouseX = 0;
            this.mouseY = 0;
        }
        return GRootPointerStatus;
    }());
    fgui.GRootPointerStatus = GRootPointerStatus;
    var GRoot = (function (_super) {
        __extends(GRoot, _super);
        function GRoot() {
            var _this = _super.call(this) || this;
            if (GRoot.$inst == null)
                GRoot.$inst = _this;
            _this.opaque = false;
            _this.$popupStack = [];
            _this.$justClosedPopups = [];
            _this.$uid = GRoot.uniqueID++;
            return _this;
        }
        Object.defineProperty(GRoot, "inst", {
            /**
             * the singleton instance of the GRoot object
             */
            get: function () {
                if (GRoot.$inst == null)
                    new GRoot();
                return GRoot.$inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot, "statusData", {
            /**
             * @deprecated will be removed later, please use pointerStatusData instead
             */
            get: function () {
                return GRoot.$retStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot, "pointerStatusData", {
            /**
             * the current mouse/pointer data
             */
            get: function () {
                return GRoot.$retStatus;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * get the objects which are placed underneath the given stage coordinate
         * @param globalX the stage X
         * @param globalY the stage Y
         */
        GRoot.prototype.getObjectUnderPoint = function (globalX, globalY) {
            var ret = this.$uiStage.applicationContext.renderer.plugins.interaction.hitTest(GRoot.sHelperPoint, this.nativeStage);
            return fgui.GObject.castFromNativeObject(ret);
        };
        /**
         * the main entry to lauch the UI root, e.g.: GRoot.inst.attachTo(app, options)
         * @param app your PIXI.Application instance to be used in this GRoot instance
         * @param stageOptions stage rotation / resize options
         */
        GRoot.prototype.attachTo = function (app, stageOptions) {
            createjs.Ticker = null; //no need this one
            fgui.GTimer.inst.setTicker(app.ticker);
            if (this.$uiStage) {
                this.$uiStage.off("__sizeChanged" /* SIZE_CHANGED */, this.$winResize, this);
                this.$uiStage.nativeStage.off(fgui.InteractiveEvents.Down, this.$stageDown, this);
                this.$uiStage.nativeStage.off(fgui.InteractiveEvents.Up, this.$stageUp, this);
                this.$uiStage.nativeStage.off(fgui.InteractiveEvents.Move, this.$stageMove, this);
                this.$uiStage.nativeStage.removeChild(this.$displayObject);
                this.$uiStage.dispose();
            }
            this.$uiStage = new fgui.UIStage(app, stageOptions);
            this.$uiStage.on("__sizeChanged" /* SIZE_CHANGED */, this.$winResize, this);
            this.$uiStage.nativeStage.on(fgui.InteractiveEvents.Down, this.$stageDown, this);
            this.$uiStage.nativeStage.on(fgui.InteractiveEvents.Up, this.$stageUp, this);
            this.$uiStage.nativeStage.on(fgui.InteractiveEvents.Move, this.$stageMove, this);
            this.$uiStage.nativeStage.addChild(this.$displayObject);
            this.$winResize(this.$uiStage);
            if (!this.$modalLayer) {
                this.$modalLayer = new fgui.GGraph();
                this.$modalLayer.setSize(this.width, this.height);
                this.$modalLayer.drawRect(0, 0, 0, fgui.UIConfig.modalLayerColor, fgui.UIConfig.modalLayerAlpha);
                this.$modalLayer.addRelation(this, 24 /* Size */);
            }
        };
        Object.defineProperty(GRoot.prototype, "uniqueID", {
            get: function () {
                return this.$uid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "stageWidth", {
            get: function () {
                return this.$uiStage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "stageHeight", {
            get: function () {
                return this.$uiStage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "contentScaleFactor", {
            get: function () {
                return this.$uiStage.resolution;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "applicationContext", {
            get: function () {
                return this.$uiStage.applicationContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "nativeStage", {
            get: function () {
                return this.$uiStage.nativeStage;
            },
            enumerable: true,
            configurable: true
        });
        GRoot.prototype.showWindow = function (win) {
            this.addChild(win);
            win.requestFocus();
            if (win.x > this.width)
                win.x = this.width - win.width;
            else if (win.x + win.width < 0)
                win.x = 0;
            if (win.y > this.height)
                win.y = this.height - win.height;
            else if (win.y + win.height < 0)
                win.y = 0;
            this.adjustModalLayer();
        };
        GRoot.prototype.hideWindow = function (win) {
            win.hide();
        };
        GRoot.prototype.hideWindowImmediately = function (win) {
            if (win.parent == this)
                this.removeChild(win);
            this.adjustModalLayer();
        };
        GRoot.prototype.bringToFront = function (win) {
            var i;
            if (this.$modalLayer.parent != null && !win.modal)
                i = this.getChildIndex(this.$modalLayer) - 1;
            else
                i = this.numChildren - 1;
            for (; i >= 0; i--) {
                var g = this.getChildAt(i);
                if (g == win)
                    return;
                if (g instanceof fgui.Window)
                    break;
            }
            if (i >= 0)
                this.setChildIndex(win, i);
        };
        GRoot.prototype.showModalWait = function (msg) {
            if (msg === void 0) { msg = null; }
            if (fgui.UIConfig.globalModalWaiting != null) {
                if (this.$modalWaitPane == null) {
                    this.$modalWaitPane = fgui.UIPackage.createObjectFromURL(fgui.UIConfig.globalModalWaiting);
                    this.$modalWaitPane.addRelation(this, 24 /* Size */);
                }
                this.$modalWaitPane.setSize(this.width, this.height);
                this.addChild(this.$modalWaitPane);
                this.$modalWaitPane.text = msg;
            }
        };
        GRoot.prototype.closeModalWait = function () {
            if (this.$modalWaitPane != null && this.$modalWaitPane.parent != null)
                this.removeChild(this.$modalWaitPane);
        };
        GRoot.prototype.closeAllExceptModals = function () {
            var arr = this.$children.slice();
            arr.forEach(function (g) {
                if ((g instanceof fgui.Window) && !g.modal)
                    g.hide();
            }, this);
        };
        GRoot.prototype.closeAllWindows = function () {
            var arr = this.$children.slice();
            arr.forEach(function (g) {
                if (g instanceof fgui.Window)
                    g.hide();
            }, this);
        };
        GRoot.prototype.getTopWindow = function () {
            var cnt = this.numChildren;
            for (var i = cnt - 1; i >= 0; i--) {
                var g = this.getChildAt(i);
                if (g instanceof fgui.Window) {
                    return g;
                }
            }
            return null;
        };
        Object.defineProperty(GRoot.prototype, "hasModalWindow", {
            get: function () {
                return this.$modalLayer.parent != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GRoot.prototype, "modalWaiting", {
            get: function () {
                return this.$modalWaitPane && this.$modalWaitPane.inContainer;
            },
            enumerable: true,
            configurable: true
        });
        GRoot.prototype.showPopup = function (popup, target, dir) {
            if (target === void 0) { target = null; }
            if (dir === void 0) { dir = 0 /* Auto */; }
            if (this.$popupStack.length > 0) {
                var k = this.$popupStack.indexOf(popup);
                if (k != -1) {
                    for (var i = this.$popupStack.length - 1; i >= k; i--)
                        this.removeChild(this.$popupStack.pop());
                }
            }
            this.$popupStack.push(popup);
            this.addChild(popup);
            this.adjustModalLayer();
            var pos;
            var sizeW = 0, sizeH = 0;
            if (target) {
                pos = target.localToRoot();
                sizeW = target.width;
                sizeH = target.height;
            }
            else
                pos = this.globalToLocal(GRoot.$retStatus.mouseX, GRoot.$retStatus.mouseY);
            var xx, yy;
            xx = pos.x;
            if (xx + popup.width > this.width)
                xx = xx + sizeW - popup.width;
            yy = pos.y + sizeH;
            if ((dir == 0 /* Auto */ && yy + popup.height > this.height)
                || dir == 2 /* Up */) {
                yy = pos.y - popup.height - 1;
                if (yy < 0) {
                    yy = 0;
                    xx += sizeW * .5;
                }
            }
            popup.x = xx;
            popup.y = yy;
        };
        GRoot.prototype.togglePopup = function (popup, target, dir) {
            if (target === void 0) { target = null; }
            if (this.$justClosedPopups.indexOf(popup) != -1)
                return;
            this.showPopup(popup, target, dir);
        };
        GRoot.prototype.hidePopup = function (popup) {
            if (popup === void 0) { popup = null; }
            var i;
            if (popup != null) {
                var k = this.$popupStack.indexOf(popup);
                if (k != -1) {
                    for (i = this.$popupStack.length - 1; i >= k; i--)
                        this.closePopup(this.$popupStack.pop());
                }
            }
            else {
                var cnt = this.$popupStack.length;
                for (i = cnt - 1; i >= 0; i--)
                    this.closePopup(this.$popupStack[i]);
                this.$popupStack.length = 0;
            }
        };
        Object.defineProperty(GRoot.prototype, "hasAnyPopup", {
            get: function () {
                return this.$popupStack.length != 0;
            },
            enumerable: true,
            configurable: true
        });
        GRoot.prototype.closePopup = function (target) {
            if (target.parent != null) {
                if (target instanceof fgui.Window)
                    target.hide();
                else
                    this.removeChild(target);
            }
        };
        GRoot.prototype.showTooltips = function (msg) {
            if (this.$defaultTooltipWin == null) {
                var resourceURL = fgui.UIConfig.tooltipsWin;
                if (!resourceURL) {
                    console.error("UIConfig.tooltipsWin not defined");
                    return;
                }
                this.$defaultTooltipWin = fgui.UIPackage.createObjectFromURL(resourceURL);
            }
            this.$defaultTooltipWin.text = msg;
            this.showTooltipsWin(this.$defaultTooltipWin);
        };
        GRoot.prototype.showTooltipsWin = function (tooltipWin, position) {
            if (position === void 0) { position = null; }
            this.hideTooltips();
            this.$tooltipWin = tooltipWin;
            var xx = 0;
            var yy = 0;
            if (position == null) {
                xx = GRoot.$retStatus.mouseX + 10;
                yy = GRoot.$retStatus.mouseY + 20;
            }
            else {
                xx = position.x;
                yy = position.y;
            }
            var pt = this.globalToLocal(xx, yy);
            xx = pt.x;
            yy = pt.y;
            if (xx + this.$tooltipWin.width > this.width) {
                xx = xx - this.$tooltipWin.width - 1;
                if (xx < 0)
                    xx = 10;
            }
            if (yy + this.$tooltipWin.height > this.height) {
                yy = yy - this.$tooltipWin.height - 1;
                if (xx - this.$tooltipWin.width - 1 > 0)
                    xx = xx - this.$tooltipWin.width - 1;
                if (yy < 0)
                    yy = 10;
            }
            this.$tooltipWin.x = xx;
            this.$tooltipWin.y = yy;
            this.addChild(this.$tooltipWin);
        };
        GRoot.prototype.hideTooltips = function () {
            if (this.$tooltipWin != null) {
                if (this.$tooltipWin.parent)
                    this.removeChild(this.$tooltipWin);
                this.$tooltipWin = null;
            }
        };
        Object.defineProperty(GRoot.prototype, "focus", {
            get: function () {
                if (this.$focusedObject && !this.$focusedObject.onStage)
                    this.$focusedObject = null;
                return this.$focusedObject;
            },
            set: function (value) {
                if (value && (!value.focusable || !value.onStage))
                    throw new Error("Invalid target to focus");
                this.setFocus(value);
            },
            enumerable: true,
            configurable: true
        });
        GRoot.prototype.setFocus = function (value) {
            if (this.$focusedObject != value) {
                this.$focusedObject = value;
                this.emit("__focusChanged" /* CHANGED */, this);
            }
        };
        GRoot.prototype.adjustModalLayer = function () {
            var cnt = this.numChildren;
            if (this.$modalWaitPane != null && this.$modalWaitPane.parent != null)
                this.setChildIndex(this.$modalWaitPane, cnt - 1);
            for (var i = cnt - 1; i >= 0; i--) {
                var g = this.getChildAt(i);
                if ((g instanceof fgui.Window) && g.modal) {
                    if (this.$modalLayer.parent == null)
                        this.addChildAt(this.$modalLayer, i);
                    else
                        this.setChildIndexBefore(this.$modalLayer, i);
                    return;
                }
            }
            if (this.$modalLayer.parent != null)
                this.removeChild(this.$modalLayer);
        };
        GRoot.prototype.$stageDown = function (evt) {
            GRoot.$retStatus.mouseX = evt.data.global.x;
            GRoot.$retStatus.mouseY = evt.data.global.y;
            GRoot.$retStatus.touchDown = true;
            //check focus
            var mc = evt.target;
            while (mc && mc != this.nativeStage) {
                if (fgui.isUIObject(mc)) {
                    var g = mc.UIOwner;
                    if (g.touchable && g.focusable) {
                        this.setFocus(g);
                        break;
                    }
                }
                mc = mc.parent;
            }
            if (this.$tooltipWin != null)
                this.hideTooltips();
            this.checkPopups(evt.target);
        };
        GRoot.prototype.checkPopups = function (target) {
            if (this.$checkingPopups)
                return;
            this.$checkingPopups = true;
            this.$justClosedPopups.length = 0;
            if (this.$popupStack.length > 0) {
                var mc = target;
                while (mc && mc != this.nativeStage) {
                    if (fgui.isUIObject(mc)) {
                        var pindex = this.$popupStack.indexOf(mc.UIOwner);
                        if (pindex != -1) {
                            var popup_1 = void 0;
                            for (var i = this.$popupStack.length - 1; i > pindex; i--) {
                                popup_1 = this.$popupStack.pop();
                                this.closePopup(popup_1);
                                this.$justClosedPopups.push(popup_1);
                            }
                            return;
                        }
                    }
                    mc = mc.parent;
                }
                var cnt = this.$popupStack.length;
                var popup = void 0;
                for (var i = cnt - 1; i >= 0; i--) {
                    popup = this.$popupStack[i];
                    this.closePopup(popup);
                    this.$justClosedPopups.push(popup);
                }
                this.$popupStack.length = 0;
            }
        };
        GRoot.prototype.$stageMove = function (evt) {
            GRoot.$retStatus.mouseX = evt.data.global.x;
            GRoot.$retStatus.mouseY = evt.data.global.y;
        };
        GRoot.prototype.$stageUp = function (evt) {
            GRoot.$retStatus.touchDown = false;
            this.$checkingPopups = false;
        };
        GRoot.prototype.$winResize = function (stage) {
            this.setSize(stage.stageWidth, stage.stageHeight);
        };
        GRoot.uniqueID = 0;
        GRoot.$retStatus = new GRootPointerStatus();
        return GRoot;
    }(fgui.GComponent));
    fgui.GRoot = GRoot;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GScrollBar = (function (_super) {
        __extends(GScrollBar, _super);
        function GScrollBar() {
            var _this = _super.call(this) || this;
            _this.$dragOffset = new PIXI.Point();
            _this.$scrollPerc = 0;
            return _this;
        }
        GScrollBar.prototype.setScrollPane = function (target, vertical) {
            this.$target = target;
            this.$vertical = vertical;
        };
        Object.defineProperty(GScrollBar.prototype, "displayPerc", {
            set: function (val) {
                if (this.$vertical) {
                    if (!this.$fixedGripSize)
                        this.$grip.height = val * this.$bar.height;
                    this.$grip.y = this.$bar.y + (this.$bar.height - this.$grip.height) * this.$scrollPerc;
                }
                else {
                    if (!this.$fixedGripSize)
                        this.$grip.width = val * this.$bar.width;
                    this.$grip.x = this.$bar.x + (this.$bar.width - this.$grip.width) * this.$scrollPerc;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GScrollBar.prototype, "scrollPerc", {
            set: function (val) {
                this.$scrollPerc = val;
                if (this.$vertical)
                    this.$grip.y = this.$bar.y + (this.$bar.height - this.$grip.height) * this.$scrollPerc;
                else
                    this.$grip.x = this.$bar.x + (this.$bar.width - this.$grip.width) * this.$scrollPerc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GScrollBar.prototype, "minSize", {
            get: function () {
                if (this.$vertical)
                    return (this.$arrowButton1 != null ? this.$arrowButton1.height : 0) + (this.$arrowButton2 != null ? this.$arrowButton2.height : 0);
                else
                    return (this.$arrowButton1 != null ? this.$arrowButton1.width : 0) + (this.$arrowButton2 != null ? this.$arrowButton2.width : 0);
            },
            enumerable: true,
            configurable: true
        });
        GScrollBar.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "ScrollBar")[0];
            if (xml != null)
                this.$fixedGripSize = xml.attributes.fixedGripSize == "true";
            this.$grip = this.getChild("grip");
            if (!this.$grip) {
                console.error("please create and define 'grip' in the Editor for the scrollbar");
                return;
            }
            this.$bar = this.getChild("bar");
            if (!this.$bar) {
                console.error("please create and define 'bar' in the Editor for the scrollbar");
                return;
            }
            this.$arrowButton1 = this.getChild("arrow1");
            this.$arrowButton2 = this.getChild("arrow2");
            this.$grip.on(fgui.InteractiveEvents.Down, this.$gripMouseDown, this);
            if (this.$arrowButton1)
                this.$arrowButton1.on(fgui.InteractiveEvents.Down, this.$arrowButton1Click, this);
            if (this.$arrowButton2)
                this.$arrowButton2.on(fgui.InteractiveEvents.Down, this.$arrowButton2Click, this);
            this.on(fgui.InteractiveEvents.Down, this.$barMouseDown, this);
        };
        GScrollBar.prototype.$gripMouseDown = function (evt) {
            if (!this.$bar)
                return;
            evt.stopPropagation();
            this.$dragOffset = evt.data.getLocalPosition(this.displayObject, this.$dragOffset);
            this.$dragOffset.x -= this.$grip.x;
            this.$dragOffset.y -= this.$grip.y;
            var g = fgui.GRoot.inst.nativeStage;
            g.on(fgui.InteractiveEvents.Move, this.$gripDragging, this);
            g.on(fgui.InteractiveEvents.Up, this.$gripDraggingEnd, this);
        };
        GScrollBar.prototype.$gripDragging = function (evt) {
            var pt = evt.data.getLocalPosition(this.displayObject, GScrollBar.sScrollbarHelperPoint);
            if (this.$vertical) {
                var curY = pt.y - this.$dragOffset.y;
                this.$target.setPercY((curY - this.$bar.y) / (this.$bar.height - this.$grip.height), false);
            }
            else {
                var curX = pt.x - this.$dragOffset.x;
                this.$target.setPercX((curX - this.$bar.x) / (this.$bar.width - this.$grip.width), false);
            }
        };
        GScrollBar.prototype.$gripDraggingEnd = function (evt) {
            var g = fgui.GRoot.inst.nativeStage;
            g.off(fgui.InteractiveEvents.Move, this.$gripDragging, this);
            g.off(fgui.InteractiveEvents.Up, this.$gripDraggingEnd, this);
        };
        GScrollBar.prototype.$arrowButton1Click = function (evt) {
            evt.stopPropagation();
            if (this.$vertical)
                this.$target.scrollUp();
            else
                this.$target.scrollLeft();
        };
        GScrollBar.prototype.$arrowButton2Click = function (evt) {
            evt.stopPropagation();
            if (this.$vertical)
                this.$target.scrollDown();
            else
                this.$target.scrollRight();
        };
        GScrollBar.prototype.$barMouseDown = function (evt) {
            var pt = evt.data.getLocalPosition(this.$grip.displayObject, GScrollBar.sScrollbarHelperPoint);
            if (this.$vertical) {
                if (pt.y < 0)
                    this.$target.scrollUp(4);
                else
                    this.$target.scrollDown(4);
            }
            else {
                if (pt.x < 0)
                    this.$target.scrollLeft(4);
                else
                    this.$target.scrollRight(4);
            }
        };
        GScrollBar.prototype.dispose = function () {
            this.off(fgui.InteractiveEvents.Down, this.$barMouseDown, this);
            if (this.$arrowButton1)
                this.$arrowButton1.off(fgui.InteractiveEvents.Down, this.$arrowButton1Click, this);
            if (this.$arrowButton2)
                this.$arrowButton2.off(fgui.InteractiveEvents.Down, this.$arrowButton2Click, this);
            this.$grip.off(fgui.InteractiveEvents.Down, this.$gripMouseDown, this);
            this.$gripDraggingEnd(null);
            _super.prototype.dispose.call(this);
        };
        GScrollBar.sScrollbarHelperPoint = new PIXI.Point();
        return GScrollBar;
    }(fgui.GComponent));
    fgui.GScrollBar = GScrollBar;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GSlider = (function (_super) {
        __extends(GSlider, _super);
        function GSlider() {
            var _this = _super.call(this) || this;
            _this.$max = 0;
            _this.$value = 0;
            _this.$barMaxWidth = 0;
            _this.$barMaxHeight = 0;
            _this.$barMaxWidthDelta = 0;
            _this.$barMaxHeightDelta = 0;
            _this.$titleType = 0 /* Percent */;
            _this.$value = 50;
            _this.$max = 100;
            _this.$clickPos = new PIXI.Point();
            return _this;
        }
        Object.defineProperty(GSlider.prototype, "titleType", {
            get: function () {
                return this.$titleType;
            },
            set: function (value) {
                this.$titleType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GSlider.prototype, "max", {
            get: function () {
                return this.$max;
            },
            set: function (value) {
                if (this.$max != value) {
                    this.$max = value;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GSlider.prototype, "value", {
            get: function () {
                return this.$value;
            },
            set: function (value) {
                if (this.$value != value) {
                    this.$value = value;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        GSlider.prototype.update = function () {
            var percent = Math.min(this.$value / this.$max, 1);
            this.updateWidthPercent(percent);
        };
        GSlider.prototype.updateWidthPercent = function (percent) {
            if (this.$titleObject) {
                switch (this.$titleType) {
                    case 0 /* Percent */:
                        this.$titleObject.text = Math.round(percent * 100) + "%";
                        break;
                    case 1 /* ValueAndMax */:
                        this.$titleObject.text = this.$value + "/" + this.$max;
                        break;
                    case 2 /* Value */:
                        this.$titleObject.text = "" + this.$value;
                        break;
                    case 3 /* Max */:
                        this.$titleObject.text = "" + this.$max;
                        break;
                }
            }
            if (this.$barObjectH)
                this.$barObjectH.width = (this.width - this.$barMaxWidthDelta) * percent;
            if (this.$barObjectV)
                this.$barObjectV.height = (this.height - this.$barMaxHeightDelta) * percent;
            if (this.$aniObject instanceof fgui.GMovieClip)
                this.$aniObject.frame = Math.round(percent * 100);
        };
        GSlider.prototype.handleSizeChanged = function () {
            _super.prototype.handleSizeChanged.call(this);
            if (this.$barObjectH)
                this.$barMaxWidth = this.width - this.$barMaxWidthDelta;
            if (this.$barObjectV)
                this.$barMaxHeight = this.height - this.$barMaxHeightDelta;
            if (!this.$inProgressBuilding)
                this.update();
        };
        GSlider.prototype.setupAfterAdd = function (xml) {
            _super.prototype.setupAfterAdd.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "Slider")[0];
            if (xml) {
                this.$value = parseInt(xml.attributes.value);
                this.$max = parseInt(xml.attributes.max);
            }
            this.update();
        };
        GSlider.prototype.constructFromXML = function (xml) {
            _super.prototype.constructFromXML.call(this, xml);
            xml = fgui.utils.XmlParser.getChildNodes(xml, "Slider")[0];
            var str;
            if (xml) {
                str = xml.attributes.titleType;
                if (str)
                    this.$titleType = fgui.ParseProgressTitleType(str);
            }
            this.$titleObject = this.getChild("title");
            this.$barObjectH = this.getChild("bar");
            this.$barObjectV = this.getChild("bar_v");
            this.$aniObject = this.getChild("ani");
            this.$gripObject = this.getChild("grip");
            if (this.$barObjectH) {
                this.$barMaxWidth = this.$barObjectH.width;
                this.$barMaxWidthDelta = this.width - this.$barMaxWidth;
            }
            if (this.$barObjectV) {
                this.$barMaxHeight = this.$barObjectV.height;
                this.$barMaxHeightDelta = this.height - this.$barMaxHeight;
            }
            if (this.$gripObject)
                this.$gripObject.on(fgui.InteractiveEvents.Down, this.$gripMouseDown, this);
        };
        GSlider.prototype.$gripMouseDown = function (evt) {
            this.$clickPos = this.globalToLocal(evt.data.global.x, evt.data.global.y);
            this.$clickPercent = this.$value / this.$max;
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Move, this.$gripMouseMove, this);
            fgui.GRoot.inst.nativeStage.on(fgui.InteractiveEvents.Up, this.$gripMouseUp, this);
        };
        GSlider.prototype.$gripMouseMove = function (evt) {
            var pt = this.globalToLocal(evt.data.global.x, evt.data.global.y, GSlider.sSilderHelperPoint);
            var deltaX = pt.x - this.$clickPos.x;
            var deltaY = pt.y - this.$clickPos.y;
            var percent;
            if (this.$barObjectH)
                percent = this.$clickPercent + deltaX / this.$barMaxWidth;
            else
                percent = this.$clickPercent + deltaY / this.$barMaxHeight;
            if (percent > 1)
                percent = 1;
            else if (percent < 0)
                percent = 0;
            var newValue = Math.round(this.$max * percent);
            if (newValue != this.$value) {
                this.$value = newValue;
                this.emit("__stateChanged" /* CHANGED */, this);
            }
            this.updateWidthPercent(percent);
        };
        GSlider.prototype.$gripMouseUp = function (evt) {
            var percent = this.$value / this.$max;
            this.updateWidthPercent(percent);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$gripMouseMove, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$gripMouseUp, this);
        };
        GSlider.prototype.dispose = function () {
            if (this.$gripObject)
                this.$gripObject.off(fgui.InteractiveEvents.Down, this.$gripMouseDown, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Move, this.$gripMouseMove, this);
            fgui.GRoot.inst.nativeStage.off(fgui.InteractiveEvents.Up, this.$gripMouseUp, this);
            _super.prototype.dispose.call(this);
        };
        GSlider.sSilderHelperPoint = new PIXI.Point();
        return GSlider;
    }(fgui.GComponent));
    fgui.GSlider = GSlider;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    ;
    var GTextInput = (function (_super) {
        __extends(GTextInput, _super);
        function GTextInput() {
            var _this = _super.call(this) || this;
            _this.$util = null;
            /**@internal */
            _this.$isTyping = false;
            _this.focusable = true;
            _this.editable = true; //init
            _this.type = "text" /* TEXT */;
            _this.on("removed", _this.removed, _this);
            _this.$util.initialize();
            return _this;
        }
        GTextInput.prototype.createDisplayObject = function () {
            _super.prototype.createDisplayObject.call(this);
            this.$displayObject.hitArea = new PIXI.Rectangle();
        };
        GTextInput.prototype.handleSizeChanged = function () {
            _super.prototype.handleSizeChanged.call(this);
            var rect = this.$displayObject.hitArea;
            rect.x = rect.y = 0;
            rect.width = this.width;
            rect.height = this.height;
        };
        GTextInput.prototype.removed = function (disp) {
            if (this.$util)
                this.$util.destroy();
        };
        GTextInput.prototype.requestFocus = function () {
            this.root.focus = this;
            this.$util.$onFocus();
        };
        Object.defineProperty(GTextInput.prototype, "editable", {
            get: function () {
                return this.$editable;
            },
            set: function (v) {
                if (v != this.$editable) {
                    this.$editable = v;
                    if (this.$editable) {
                        if (!this.$util)
                            this.$util = new fgui.utils.InputDelegate(this);
                        this.$util.initialize();
                    }
                    else {
                        if (this.$util)
                            this.$util.destroy();
                    }
                    this.touchable = this.$editable;
                }
            },
            enumerable: true,
            configurable: true
        });
        GTextInput.prototype.changeToPassText = function (text) {
            var passText = "";
            for (var i = 0, num = text.length; i < num; i++) {
                switch (text.charAt(i)) {
                    case '\n':
                        passText += "\n";
                        break;
                    case '\r':
                        break;
                    default:
                        passText += '*';
                }
            }
            return passText;
        };
        GTextInput.prototype.getText = function () {
            return this.$util.text;
        };
        GTextInput.prototype.setText = function (value) {
            if (value == null)
                value = "";
            if (this.$text == value)
                return;
            this.$util.text = value;
            _super.prototype.setText.call(this, value);
        };
        GTextInput.prototype.setColor = function (value) {
            _super.prototype.setColor.call(this, value);
            this.$util.setColor(value);
        };
        Object.defineProperty(GTextInput.prototype, "promptText", {
            get: function () {
                return this.$util.$getProperty("placeholder");
            },
            set: function (v) {
                if (v == null)
                    v = "";
                this.$util.$setProperty("placeholder", v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextInput.prototype, "maxLength", {
            get: function () {
                return parseInt(this.$util.$getProperty("maxlength")) || 0;
            },
            set: function (v) {
                this.$util.$setProperty("maxlength", String(v));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextInput.prototype, "restrict", {
            get: function () {
                return this.$util.$restrict;
            },
            set: function (v) {
                this.$util.$restrict = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextInput.prototype, "password", {
            get: function () {
                return this.type == "password" /* PASSWORD */;
            },
            set: function (v) {
                this.type = "password" /* PASSWORD */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GTextInput.prototype, "type", {
            get: function () {
                return this.$util.type;
            },
            set: function (t) {
                this.$util.type = t;
            },
            enumerable: true,
            configurable: true
        });
        GTextInput.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.off("removed", this.removed, this);
            this.$util.destroy();
            this.$util = null;
        };
        GTextInput.prototype.renderNow = function (updateBounds) {
            if (updateBounds === void 0) { updateBounds = true; }
            this.$requireRender = false;
            this.$sizeDirty = false;
            this.$util.$updateProperties();
            if (this.$isTyping)
                this.decorateInputbox();
            var origText = this.$text;
            if (this.type == "password" /* PASSWORD */)
                this.$text = this.changeToPassText(this.$text);
            _super.prototype.renderNow.call(this, updateBounds);
            this.$text = origText;
        };
        GTextInput.prototype.decorateInputbox = function () {
            //draw underlines?
        };
        GTextInput.prototype.setupBeforeAdd = function (xml) {
            _super.prototype.setupBeforeAdd.call(this, xml);
            //this.promptText = xml.attributes.prompt;  //this will be available once UBB has implemented.
            var str = xml.attributes.maxLength;
            if (str != null)
                this.maxLength = parseInt(str);
            str = xml.attributes.restrict;
            if (str != null)
                this.restrict = str;
            str = xml.attributes.password;
            if (str == "true")
                this.password = true;
            else {
                str = xml.attributes.keyboardType;
                if (str == "4")
                    this.type = "number" /* NUMBER */;
                else if (str == "3")
                    this.type = "url" /* URL */;
                else if (str == "5")
                    this.type = "tel" /* TEL */;
                else if (str == "6")
                    this.type = "email" /* EMAIL */;
            }
        };
        return GTextInput;
    }(fgui.GTextField));
    fgui.GTextInput = GTextInput;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var GTimer = (function () {
        function GTimer() {
            this.$enumIdx = 0;
            this.$enumCount = 0;
            this.$items = [];
            this.$itemPool = [];
        }
        GTimer.prototype.getItem = function () {
            if (this.$itemPool.length)
                return this.$itemPool.pop();
            else
                return new TimerItem();
        };
        GTimer.prototype.findItem = function (callback, thisObj) {
            var len = this.$items.length;
            for (var i = 0; i < len; i++) {
                var item = this.$items[i];
                if (item.callback == callback && item.thisObj == thisObj)
                    return item;
            }
            return null;
        };
        GTimer.prototype.add = function (delayInMs, repeat, callback, thisObj, callbackParam) {
            var item = this.findItem(callback, thisObj);
            if (!item) {
                item = this.getItem();
                item.callback = callback;
                item.thisObj = thisObj;
                this.$items.push(item);
            }
            item.delay = delayInMs;
            item.counter = 0;
            item.repeat = repeat;
            item.param = callbackParam;
            item.end = false;
        };
        GTimer.prototype.callLater = function (callback, thisObj, callbackParam) {
            this.add(1, 1, callback, thisObj, callbackParam);
        };
        GTimer.prototype.callDelay = function (delayInMs, callback, thisObj, callbackParam) {
            this.add(delayInMs, 1, callback, thisObj, callbackParam);
        };
        GTimer.prototype.exists = function (callback, thisObj) {
            var item = this.findItem(callback, thisObj);
            return item != null;
        };
        GTimer.prototype.remove = function (callback, thisObj) {
            var item = this.findItem(callback, thisObj);
            if (item) {
                var i = this.$items.indexOf(item);
                this.$items.splice(i, 1);
                if (i < this.$enumIdx)
                    this.$enumIdx--;
                this.$enumCount--;
                item.callback = null;
                item.param = null;
                this.$itemPool.push(item);
            }
        };
        GTimer.prototype.advance = function () {
            this.$enumIdx = 0;
            this.$enumCount = this.$items.length;
            while (this.$enumIdx < this.$enumCount) {
                var item = this.$items[this.$enumIdx];
                this.$enumIdx++;
                var ms = this.$ticker.elapsedMS;
                if (item.advance(ms)) {
                    if (item.end) {
                        this.$enumIdx--;
                        this.$enumCount--;
                        this.$items.splice(this.$enumIdx, 1);
                        this.$itemPool.push(item);
                    }
                    if (item.callback) {
                        var args = [ms];
                        if (item.param && item.param instanceof Array)
                            args = item.param.concat(args);
                        else if (item.param !== void 0)
                            args.unshift(item.param);
                        item.callback.apply(item.thisObj, args);
                    }
                    if (item.end)
                        item.callback = item.thisObj = item.param = null;
                }
            }
        };
        GTimer.prototype.tickTween = function () {
            createjs.Tween.tick(this.$ticker.elapsedMS, !this.$ticker.started);
        };
        GTimer.prototype.setTicker = function (ticker) {
            if (this.$ticker) {
                this.$ticker.remove(this.advance, this, PIXI.UPDATE_PRIORITY.NORMAL);
                this.$ticker.remove(this.tickTween, this, PIXI.UPDATE_PRIORITY.HIGH);
            }
            this.$ticker = ticker;
            this.$ticker.add(this.advance, this, PIXI.UPDATE_PRIORITY.NORMAL);
            this.$ticker.add(this.tickTween, this, PIXI.UPDATE_PRIORITY.HIGH);
            if (!this.$ticker.started)
                this.$ticker.start();
        };
        GTimer.inst = new GTimer();
        return GTimer;
    }());
    fgui.GTimer = GTimer;
    var TimerItem = (function () {
        function TimerItem() {
            this.delay = 0;
            this.counter = 0;
            this.repeat = 0;
        }
        TimerItem.prototype.advance = function (elapsed) {
            if (elapsed === void 0) { elapsed = 0; }
            this.counter += elapsed;
            if (this.counter >= this.delay) {
                this.counter -= this.delay;
                if (this.counter > this.delay)
                    this.counter = this.delay;
                if (this.repeat > 0) {
                    this.repeat--;
                    if (this.repeat == 0)
                        this.end = true;
                }
                return true;
            }
            else
                return false;
        };
        return TimerItem;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    fgui.isAnimationGear = function (obj) {
        return obj && "playing" in obj && "frame" in obj;
    };
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    fgui.isColorableTitle = function (obj) {
        return obj && "titleColor" in obj && "fontSize" in obj;
    };
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    fgui.isColorGear = function (obj) {
        return obj && "color" in obj;
    };
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var PopupMenu = (function () {
        function PopupMenu(resourceURL) {
            if (resourceURL === void 0) { resourceURL = null; }
            if (!resourceURL) {
                resourceURL = fgui.UIConfig.popupMenu;
                if (!resourceURL)
                    throw new Error("UIConfig.popupMenu not defined");
            }
            this.$contentPane = fgui.UIPackage.createObjectFromURL(resourceURL);
            this.$contentPane.on("added", this.$addedToStage, this);
            this.$list = this.$contentPane.getChild("list");
            this.$list.removeChildrenToPool();
            this.$list.addRelation(this.$contentPane, 14 /* Width */);
            this.$list.removeRelation(this.$contentPane, 15 /* Height */);
            this.$contentPane.addRelation(this.$list, 15 /* Height */);
            this.$list.on("__itemClick" /* ItemClick */, this.$clickItem, this);
        }
        PopupMenu.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.$delayClickItem, this);
            this.$list.off("__itemClick" /* ItemClick */, this.$clickItem, this);
            this.$contentPane.off("added", this.$addedToStage, this);
            this.$contentPane.dispose();
        };
        PopupMenu.prototype.addItem = function (caption, handler) {
            var item = this.$list.addItemFromPool();
            item.title = caption;
            item.data = handler;
            item.grayed = false;
            var c = item.getController("checked");
            if (c != null)
                c.selectedIndex = 0;
            return item;
        };
        PopupMenu.prototype.addItemAt = function (caption, index, handler) {
            var item = this.$list.getFromPool();
            this.$list.addChildAt(item, index);
            item.title = caption;
            item.data = handler;
            item.grayed = false;
            var c = item.getController("checked");
            if (c != null)
                c.selectedIndex = 0;
            return item;
        };
        PopupMenu.prototype.addSeperator = function () {
            if (fgui.UIConfig.popupMenuSeperator == null)
                throw new Error("UIConfig.popupMenuSeperator not defined");
            this.$list.addItemFromPool(fgui.UIConfig.popupMenuSeperator);
        };
        PopupMenu.prototype.getItemName = function (index) {
            var item = this.$list.getChildAt(index);
            return item.name;
        };
        PopupMenu.prototype.setItemText = function (name, caption) {
            var item = this.$list.getChild(name);
            item.title = caption;
        };
        PopupMenu.prototype.setItemVisible = function (name, visible) {
            var item = this.$list.getChild(name);
            if (item.visible != visible) {
                item.visible = visible;
                this.$list.setBoundsChangedFlag();
            }
        };
        PopupMenu.prototype.setItemGrayed = function (name, grayed) {
            var item = this.$list.getChild(name);
            item.grayed = grayed;
        };
        PopupMenu.prototype.setItemCheckable = function (name, checkable) {
            var item = this.$list.getChild(name);
            var c = item.getController("checked");
            if (c != null) {
                if (checkable) {
                    if (c.selectedIndex == 0)
                        c.selectedIndex = 1;
                }
                else
                    c.selectedIndex = 0;
            }
        };
        PopupMenu.prototype.setItemChecked = function (name, checked) {
            var item = this.$list.getChild(name);
            var c = item.getController("checked");
            if (c != null)
                c.selectedIndex = checked ? 2 : 1;
        };
        PopupMenu.prototype.isItemChecked = function (name) {
            var item = this.$list.getChild(name);
            var c = item.getController("checked");
            if (c != null)
                return c.selectedIndex == 2;
            else
                return false;
        };
        PopupMenu.prototype.removeItem = function (name) {
            var item = this.$list.getChild(name);
            if (item != null) {
                var index = this.$list.getChildIndex(item);
                this.$list.removeChildToPoolAt(index);
                return true;
            }
            else
                return false;
        };
        PopupMenu.prototype.clearItems = function () {
            this.$list.removeChildrenToPool();
        };
        Object.defineProperty(PopupMenu.prototype, "itemCount", {
            get: function () {
                return this.$list.numChildren;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMenu.prototype, "contentPane", {
            get: function () {
                return this.$contentPane;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopupMenu.prototype, "list", {
            get: function () {
                return this.$list;
            },
            enumerable: true,
            configurable: true
        });
        PopupMenu.prototype.show = function (target, dir) {
            if (target === void 0) { target = null; }
            var r = target != null ? target.root : fgui.GRoot.inst;
            r.showPopup(this.contentPane, (target instanceof fgui.GRoot) ? null : target, dir);
        };
        PopupMenu.prototype.$clickItem = function (evt, itemObject) {
            fgui.GTimer.inst.add(100, 1, this.$delayClickItem, this, itemObject);
        };
        PopupMenu.prototype.$delayClickItem = function (itemObject) {
            if (!(itemObject instanceof fgui.GButton))
                return;
            if (itemObject.grayed) {
                this.$list.selectedIndex = -1;
                return;
            }
            var c = itemObject.getController("checked");
            if (c != null && c.selectedIndex != 0) {
                if (c.selectedIndex == 1)
                    c.selectedIndex = 2;
                else
                    c.selectedIndex = 1;
            }
            var r = this.$contentPane.parent;
            if (r)
                r.hidePopup(this.contentPane);
            if (itemObject.data != null)
                itemObject.data.call(null);
            fgui.GTimer.inst.remove(this.$delayClickItem, this);
        };
        PopupMenu.prototype.$addedToStage = function () {
            this.$list.selectedIndex = -1;
            this.$list.resizeToFit(100000, 10);
        };
        return PopupMenu;
    }());
    fgui.PopupMenu = PopupMenu;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var RelationItem = (function () {
        function RelationItem(owner) {
            this.$owner = owner;
            this.$defs = [];
        }
        Object.defineProperty(RelationItem.prototype, "owner", {
            get: function () {
                return this.$owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RelationItem.prototype, "target", {
            get: function () {
                return this.$target;
            },
            set: function (value) {
                if (this.$target != value) {
                    if (this.$target)
                        this.releaseRefTarget(this.$target);
                    this.$target = value;
                    if (this.$target)
                        this.addRefTarget(this.$target);
                }
            },
            enumerable: true,
            configurable: true
        });
        RelationItem.prototype.add = function (relationType, usePercent) {
            if (relationType == 24 /* Size */) {
                this.add(14 /* Width */, usePercent);
                this.add(15 /* Height */, usePercent);
                return;
            }
            var length = this.$defs.length;
            for (var i = 0; i < length; i++) {
                var def = this.$defs[i];
                if (def.type == relationType)
                    return;
            }
            this.internalAdd(relationType, usePercent);
        };
        RelationItem.prototype.internalAdd = function (relationType, usePercent) {
            if (relationType == 24 /* Size */) {
                this.internalAdd(14 /* Width */, usePercent);
                this.internalAdd(15 /* Height */, usePercent);
                return;
            }
            var info = new RelationDef();
            info.percent = usePercent;
            info.type = relationType;
            this.$defs.push(info);
            //CENTER relation will cause float pixel, so enable the auto-pixel-snapping here
            if (usePercent || relationType == 1 /* Left_Center */ || relationType == 3 /* Center_Center */ || relationType == 5 /* Right_Center */
                || relationType == 8 /* Top_Middle */ || relationType == 10 /* Middle_Middle */ || relationType == 12 /* Bottom_Middle */)
                this.$owner.pixelSnapping = true;
        };
        RelationItem.prototype.remove = function (relationType) {
            if (relationType === void 0) { relationType = 0; }
            if (relationType == 24 /* Size */) {
                this.remove(14 /* Width */);
                this.remove(15 /* Height */);
                return;
            }
            var dc = this.$defs.length;
            for (var k = dc - 1; k >= 0; k--) {
                if (this.$defs[k].type == relationType) {
                    this.$defs.splice(k, 1);
                    break;
                }
            }
        };
        RelationItem.prototype.copyFrom = function (source) {
            var _this = this;
            this.target = source.target;
            this.$defs.length = 0;
            source.$defs.forEach(function (info) {
                var info2 = new RelationDef();
                info2.copyFrom(info);
                _this.$defs.push(info2);
            }, this);
        };
        RelationItem.prototype.dispose = function () {
            if (this.$target != null) {
                this.releaseRefTarget(this.$target);
                this.$target = null;
            }
        };
        Object.defineProperty(RelationItem.prototype, "isEmpty", {
            get: function () {
                return this.$defs.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        RelationItem.prototype.applyOnSelfResized = function (dWidth, dHeight) {
            var _this = this;
            var ox = this.$owner.x;
            var oy = this.$owner.y;
            this.$defs.forEach(function (info) {
                switch (info.type) {
                    case 3 /* Center_Center */:
                    case 5 /* Right_Center */:
                        _this.$owner.x -= dWidth / 2;
                        break;
                    case 4 /* Right_Left */:
                    case 6 /* Right_Right */:
                        _this.$owner.x -= dWidth;
                        break;
                    case 10 /* Middle_Middle */:
                    case 12 /* Bottom_Middle */:
                        _this.$owner.y -= dHeight / 2;
                        break;
                    case 11 /* Bottom_Top */:
                    case 13 /* Bottom_Bottom */:
                        _this.$owner.y -= dHeight;
                        break;
                }
            }, this);
            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;
                this.$owner.updateGearFromRelations(1 /* XY */, ox, oy);
                if (this.$owner.parent != null) {
                    this.$owner.parent.$transitions.forEach(function (t) {
                        t.updateFromRelations(_this.$owner.id, ox, oy);
                    }, this);
                }
            }
        };
        RelationItem.prototype.applyOnXYChanged = function (info, dx, dy) {
            var tmp;
            switch (info.type) {
                case 0 /* Left_Left */:
                case 1 /* Left_Center */:
                case 2 /* Left_Right */:
                case 3 /* Center_Center */:
                case 4 /* Right_Left */:
                case 5 /* Right_Center */:
                case 6 /* Right_Right */:
                    this.$owner.x += dx;
                    break;
                case 7 /* Top_Top */:
                case 8 /* Top_Middle */:
                case 9 /* Top_Bottom */:
                case 10 /* Middle_Middle */:
                case 11 /* Bottom_Top */:
                case 12 /* Bottom_Middle */:
                case 13 /* Bottom_Bottom */:
                    this.$owner.y += dy;
                    break;
                case 14 /* Width */:
                case 15 /* Height */:
                    break;
                case 16 /* LeftExt_Left */:
                case 17 /* LeftExt_Right */:
                    tmp = this.$owner.x;
                    this.$owner.x += dx;
                    this.$owner.width = this.$owner.$rawWidth - (this.$owner.x - tmp);
                    break;
                case 18 /* RightExt_Left */:
                case 19 /* RightExt_Right */:
                    this.$owner.width = this.$owner.$rawWidth + dx;
                    break;
                case 20 /* TopExt_Top */:
                case 21 /* TopExt_Bottom */:
                    tmp = this.$owner.y;
                    this.$owner.y += dy;
                    this.$owner.height = this.$owner.$rawHeight - (this.$owner.y - tmp);
                    break;
                case 22 /* BottomExt_Top */:
                case 23 /* BottomExt_Bottom */:
                    this.$owner.height = this.$owner.$rawHeight + dy;
                    break;
            }
        };
        RelationItem.prototype.applyOnSizeChanged = function (info) {
            var targetX, targetY;
            if (this.$target != this.$owner.parent) {
                targetX = this.$target.x;
                targetY = this.$target.y;
            }
            else {
                targetX = 0;
                targetY = 0;
            }
            var v, tmp;
            switch (info.type) {
                case 0 /* Left_Left */:
                    break;
                case 1 /* Left_Center */:
                    v = this.$owner.x - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v;
                    break;
                case 2 /* Left_Right */:
                    v = this.$owner.x - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth + v;
                    break;
                case 3 /* Center_Center */:
                    v = this.$owner.x + this.$owner.$rawWidth / 2 - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v - this.$owner.$rawWidth / 2;
                    break;
                case 4 /* Right_Left */:
                    v = this.$owner.x + this.$owner.$rawWidth - targetX;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + v - this.$owner.$rawWidth;
                    break;
                case 5 /* Right_Center */:
                    v = this.$owner.x + this.$owner.$rawWidth - (targetX + this.$targetWidth / 2);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth / 2 + v - this.$owner.$rawWidth;
                    break;
                case 6 /* Right_Right */:
                    v = this.$owner.x + this.$owner.$rawWidth - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    this.$owner.x = targetX + this.$target.$rawWidth + v - this.$owner.$rawWidth;
                    break;
                case 7 /* Top_Top */:
                    break;
                case 8 /* Top_Middle */:
                    v = this.$owner.y - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v;
                    break;
                case 9 /* Top_Bottom */:
                    v = this.$owner.y - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight + v;
                    break;
                case 10 /* Middle_Middle */:
                    v = this.$owner.y + this.$owner.$rawHeight / 2 - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v - this.$owner.$rawHeight / 2;
                    break;
                case 11 /* Bottom_Top */:
                    v = this.$owner.y + this.$owner.$rawHeight - targetY;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + v - this.$owner.$rawHeight;
                    break;
                case 12 /* Bottom_Middle */:
                    v = this.$owner.y + this.$owner.$rawHeight - (targetY + this.$targetHeight / 2);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight / 2 + v - this.$owner.$rawHeight;
                    break;
                case 13 /* Bottom_Bottom */:
                    v = this.$owner.y + this.$owner.$rawHeight - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    this.$owner.y = targetY + this.$target.$rawHeight + v - this.$owner.$rawHeight;
                    break;
                case 14 /* Width */:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceWidth - this.$target.$initWidth;
                    else
                        v = this.$owner.$rawWidth - this.$targetWidth;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    if (this.$target == this.$owner.parent)
                        this.$owner.setSize(this.$target.$rawWidth + v, this.$owner.$rawHeight, true);
                    else
                        this.$owner.width = this.$target.$rawWidth + v;
                    break;
                case 15 /* Height */:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceHeight - this.$target.$initHeight;
                    else
                        v = this.$owner.$rawHeight - this.$targetHeight;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    if (this.$target == this.$owner.parent)
                        this.$owner.setSize(this.$owner.$rawWidth, this.$target.$rawHeight + v, true);
                    else
                        this.$owner.height = this.$target.$rawHeight + v;
                    break;
                case 16 /* LeftExt_Left */:
                    break;
                case 17 /* LeftExt_Right */:
                    v = this.$owner.x - (targetX + this.$targetWidth);
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    tmp = this.$owner.x;
                    this.$owner.x = targetX + this.$target.$rawWidth + v;
                    this.$owner.width = this.$owner.$rawWidth - (this.$owner.x - tmp);
                    break;
                case 18 /* RightExt_Left */:
                    break;
                case 19 /* RightExt_Right */:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceWidth - (targetX + this.$target.$initWidth);
                    else
                        v = this.$owner.width - (targetX + this.$targetWidth);
                    if (this.$owner != this.$target.parent)
                        v += this.$owner.x;
                    if (info.percent)
                        v = v / this.$targetWidth * this.$target.$rawWidth;
                    if (this.$owner != this.$target.parent)
                        this.$owner.width = targetX + this.$target.$rawWidth + v - this.$owner.x;
                    else
                        this.$owner.width = targetX + this.$target.$rawWidth + v;
                    break;
                case 20 /* TopExt_Top */:
                    break;
                case 21 /* TopExt_Bottom */:
                    v = this.$owner.y - (targetY + this.$targetHeight);
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    tmp = this.$owner.y;
                    this.$owner.y = targetY + this.$target.$rawHeight + v;
                    this.$owner.height = this.$owner.$rawHeight - (this.$owner.y - tmp);
                    break;
                case 22 /* BottomExt_Top */:
                    break;
                case 23 /* BottomExt_Bottom */:
                    if (this.$owner.$inProgressBuilding && this.$owner == this.$target.parent)
                        v = this.$owner.sourceHeight - (targetY + this.$target.$initHeight);
                    else
                        v = this.$owner.$rawHeight - (targetY + this.$targetHeight);
                    if (this.$owner != this.$target.parent)
                        v += this.$owner.y;
                    if (info.percent)
                        v = v / this.$targetHeight * this.$target.$rawHeight;
                    if (this.$owner != this.$target.parent)
                        this.$owner.height = targetY + this.$target.$rawHeight + v - this.$owner.y;
                    else
                        this.$owner.height = targetY + this.$target.$rawHeight + v;
                    break;
            }
        };
        RelationItem.prototype.addRefTarget = function (target) {
            if (target != this.$owner.parent)
                target.on("__xyChanged" /* XY_CHANGED */, this.$targetXYChanged, this);
            target.on("__sizeChanged" /* SIZE_CHANGED */, this.$targetSizeChanged, this);
            target.on("__sizeDelayChange" /* SIZE_DELAY_CHANGE */, this.$targetSizeWillChange, this);
            this.$targetX = this.$target.x;
            this.$targetY = this.$target.y;
            this.$targetWidth = this.$target.$rawWidth;
            this.$targetHeight = this.$target.$rawHeight;
        };
        RelationItem.prototype.releaseRefTarget = function (target) {
            target.off("__xyChanged" /* XY_CHANGED */, this.$targetXYChanged, this);
            target.off("__sizeChanged" /* SIZE_CHANGED */, this.$targetSizeChanged, this);
            target.off("__sizeDelayChange" /* SIZE_DELAY_CHANGE */, this.$targetSizeWillChange, this);
        };
        RelationItem.prototype.$targetXYChanged = function (evt) {
            var _this = this;
            if (this.$owner.relations.$dealing != null || this.$owner.group != null && this.$owner.group.$updating) {
                this.$targetX = this.$target.x;
                this.$targetY = this.$target.y;
                return;
            }
            this.$owner.relations.$dealing = this.$target;
            var ox = this.$owner.x;
            var oy = this.$owner.y;
            var dx = this.$target.x - this.$targetX;
            var dy = this.$target.y - this.$targetY;
            this.$defs.forEach(function (info) {
                _this.applyOnXYChanged(info, dx, dy);
            }, this);
            this.$targetX = this.$target.x;
            this.$targetY = this.$target.y;
            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;
                this.$owner.updateGearFromRelations(1 /* XY */, ox, oy);
                if (this.$owner.parent != null) {
                    this.$owner.parent.$transitions.forEach(function (t) {
                        t.updateFromRelations(_this.$owner.id, ox, oy);
                    }, this);
                }
            }
            this.$owner.relations.$dealing = null;
        };
        RelationItem.prototype.$targetSizeChanged = function (evt) {
            var _this = this;
            if (this.$owner.relations.$dealing != null)
                return;
            this.$owner.relations.$dealing = this.$target;
            var ox = this.$owner.x;
            var oy = this.$owner.y;
            var ow = this.$owner.$rawWidth;
            var oh = this.$owner.$rawHeight;
            this.$defs.forEach(function (info) {
                _this.applyOnSizeChanged(info);
            }, this);
            this.$targetWidth = this.$target.$rawWidth;
            this.$targetHeight = this.$target.$rawHeight;
            if (ox != this.$owner.x || oy != this.$owner.y) {
                ox = this.$owner.x - ox;
                oy = this.$owner.y - oy;
                this.$owner.updateGearFromRelations(1 /* XY */, ox, oy);
                if (this.$owner.parent != null) {
                    this.$owner.parent.$transitions.forEach(function (t) {
                        t.updateFromRelations(_this.$owner.id, ox, oy);
                    }, this);
                }
            }
            if (ow != this.$owner.$rawWidth || oh != this.$owner.$rawHeight) {
                ow = this.$owner.$rawWidth - ow;
                oh = this.$owner.$rawHeight - oh;
                this.$owner.updateGearFromRelations(2 /* Size */, ow, oh);
            }
            this.$owner.relations.$dealing = null;
        };
        RelationItem.prototype.$targetSizeWillChange = function (evt) {
            this.$owner.relations.sizeDirty = true;
        };
        return RelationItem;
    }());
    fgui.RelationItem = RelationItem;
    var RelationDef = (function () {
        function RelationDef() {
        }
        RelationDef.prototype.copyFrom = function (source) {
            this.percent = source.percent;
            this.type = source.type;
        };
        return RelationDef;
    }());
    fgui.RelationDef = RelationDef;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var Relations = (function () {
        function Relations(owner) {
            this.sizeDirty = false;
            this.$owner = owner;
            this.$items = [];
        }
        Relations.prototype.add = function (target, relationType, usePercent) {
            if (usePercent === void 0) { usePercent = false; }
            var length = this.$items.length;
            for (var i = 0; i < length; i++) {
                var item = this.$items[i];
                if (item.target == target) {
                    item.add(relationType, usePercent);
                    return;
                }
            }
            var newItem = new fgui.RelationItem(this.$owner);
            newItem.target = target;
            newItem.add(relationType, usePercent);
            this.$items.push(newItem);
        };
        Relations.prototype.addItems = function (target, sidePairs) {
            var arr = sidePairs.split(",");
            var s;
            var usePercent;
            for (var i = 0; i < 2; i++) {
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
                    s = s + "-" + s;
                var t = Relations.RELATION_NAMES.indexOf(s);
                if (t == -1)
                    throw new Error("Invalid relation type");
                this.add(target, t, usePercent);
            }
        };
        Relations.prototype.remove = function (target, relationType) {
            if (relationType === void 0) { relationType = 0; }
            var cnt = this.$items.length;
            var i = 0;
            while (i < cnt) {
                var item = this.$items[i];
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
        };
        Relations.prototype.contains = function (target) {
            var length = this.$items.length;
            for (var i = 0; i < length; i++) {
                if (this.$items[i].target == target)
                    return true;
            }
            return false;
        };
        Relations.prototype.clearFor = function (target) {
            var cnt = this.$items.length;
            var i = 0;
            while (i < cnt) {
                var item = this.$items[i];
                if (item.target == target) {
                    item.dispose();
                    this.$items.splice(i, 1);
                    cnt--;
                }
                else
                    i++;
            }
        };
        Relations.prototype.clearAll = function () {
            this.$items.forEach(function (item) {
                item.dispose();
            }, this);
            this.$items.length = 0;
        };
        Relations.prototype.copyFrom = function (source) {
            var _this = this;
            this.clearAll();
            source.$items.forEach(function (ri) {
                var item = new fgui.RelationItem(_this.$owner);
                item.copyFrom(ri);
                _this.$items.push(item);
            }, this);
        };
        Relations.prototype.dispose = function () {
            this.clearAll();
        };
        Relations.prototype.onOwnerSizeChanged = function (dWidth, dHeight) {
            if (this.$items.length <= 0)
                return;
            this.$items.forEach(function (item) {
                item.applyOnSelfResized(dWidth, dHeight);
            }, this);
        };
        Relations.prototype.ensureRelationsSizeCorrect = function () {
            if (this.$items.length == 0)
                return;
            this.sizeDirty = false;
            this.$items.forEach(function (item) {
                item.target.ensureSizeCorrect();
            }, this);
        };
        Object.defineProperty(Relations.prototype, "empty", {
            get: function () {
                return this.$items.length == 0;
            },
            enumerable: true,
            configurable: true
        });
        Relations.prototype.setup = function (xml) {
            var _this = this;
            xml.children.forEach(function (cxml) {
                if (cxml.nodeName != "relation")
                    return;
                var targetId;
                var target;
                targetId = cxml.attributes.target;
                if (_this.$owner.parent) {
                    if (targetId)
                        target = _this.$owner.parent.getChildById(targetId);
                    else
                        target = _this.$owner.parent;
                }
                else {
                    //call from the component's constructor
                    target = _this.$owner.getChildById(targetId);
                }
                if (target)
                    _this.addItems(target, cxml.attributes.sidePair);
            }, this);
        };
        Relations.RELATION_NAMES = [
            "left-left",
            "left-center",
            "left-right",
            "center-center",
            "right-left",
            "right-center",
            "right-right",
            "top-top",
            "top-middle",
            "top-bottom",
            "middle-middle",
            "bottom-top",
            "bottom-middle",
            "bottom-bottom",
            "width-width",
            "height-height",
            "leftext-left",
            "leftext-right",
            "rightext-left",
            "rightext-right",
            "topext-top",
            "topext-bottom",
            "bottomext-top",
            "bottomext-bottom" //23
        ];
        return Relations;
    }());
    fgui.Relations = Relations;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    /**@final */
    var ScrollPane = (function (_super) {
        __extends(ScrollPane, _super);
        function ScrollPane(owner, scrollType, scrollBarMargin, scrollBarDisplay, flags, vtScrollBarRes, hzScrollBarRes) {
            var _this = _super.call(this) || this;
            _this.$viewWidth = 0;
            _this.$viewHeight = 0;
            _this.$contentWidth = 0;
            _this.$contentHeight = 0;
            _this.$scrollType = 0;
            _this.$scrollSpeed = 0;
            _this.$onStage = false;
            if (ScrollPane.$easeTypeFunc == null)
                ScrollPane.$easeTypeFunc = fgui.ParseEaseType("cubeOut");
            _this.$throwTween = new ThrowTween();
            _this.$owner = owner;
            _this.$maskContainer = new fgui.UIContainer(null);
            _this.$owner.$rootContainer.addChild(_this.$maskContainer);
            _this.$container = _this.$owner.$container;
            _this.$container.x = 0;
            _this.$container.y = 0;
            _this.$maskContainer.addChild(_this.$container);
            _this.$scrollType = scrollType;
            _this.$scrollBarMargin = scrollBarMargin;
            _this.$bouncebackEffect = fgui.UIConfig.defaultScrollBounceEffect;
            _this.$touchEffect = fgui.UIConfig.defaultScrollTouchEffect;
            _this.$scrollSpeed = fgui.UIConfig.defaultScrollSpeed;
            //this.$mouseWheelSpeed = this.$scrollSpeed * 2;
            _this.$displayOnLeft = (flags & 1 /* DisplayOnLeft */) != 0;
            _this.$snapToItem = (flags & 2 /* SnapToItem */) != 0;
            _this.$displayOnDemand = (flags & 4 /* DisplayOnDemand */) != 0;
            _this.$pageMode = (flags & 8 /* PageMode */) != 0;
            if (flags & 16 /* TouchEffect */)
                _this.$touchEffect = true;
            else if (flags & 32 /* DisableTouchEffect */)
                _this.$touchEffect = false;
            else
                _this.$touchEffect = fgui.UIConfig.defaultScrollTouchEffect;
            if (flags & 64 /* BounceEffect */)
                _this.$bouncebackEffect = true;
            else if (flags & 128 /* DisableBounceEffect */)
                _this.$bouncebackEffect = false;
            else
                _this.$bouncebackEffect = fgui.UIConfig.defaultScrollBounceEffect;
            _this.$inertiaDisabled = (flags & 256 /* DisableInertia */) != 0;
            if ((flags & 512 /* DisableScissorRect */) == 0)
                _this.$maskContainer.scrollRect = new PIXI.Rectangle();
            _this.$xPerc = 0;
            _this.$yPerc = 0;
            _this.$xPos = 0;
            _this.$yPos = 0;
            _this.$xOverlap = 0;
            _this.$yOverlap = 0;
            _this.$aniFlag = 0;
            _this.$scrollBarVisible = true;
            //this.$mouseWheelEnabled = false;
            _this.$holdAreaPoint = new PIXI.Point();
            if (scrollBarDisplay == 0 /* Default */)
                scrollBarDisplay = fgui.UIConfig.defaultScrollBarDisplay;
            if (scrollBarDisplay != 3 /* Hidden */) {
                if (_this.$scrollType == 2 /* Both */ || _this.$scrollType == 1 /* Vertical */) {
                    var res = vtScrollBarRes ? vtScrollBarRes : fgui.UIConfig.verticalScrollBar;
                    if (res) {
                        _this.$vtScrollBar = fgui.UIPackage.createObjectFromURL(res);
                        if (!_this.$vtScrollBar)
                            throw new Error("Cannot create scrollbar from " + res);
                        _this.$vtScrollBar.setScrollPane(_this, true);
                        _this.$owner.$rootContainer.addChild(_this.$vtScrollBar.displayObject);
                    }
                }
                if (_this.$scrollType == 2 /* Both */ || _this.$scrollType == 0 /* Horizontal */) {
                    var res = hzScrollBarRes ? hzScrollBarRes : fgui.UIConfig.horizontalScrollBar;
                    if (res) {
                        _this.$hzScrollBar = fgui.UIPackage.createObjectFromURL(res);
                        if (!_this.$hzScrollBar)
                            throw new Error("Cannot create scrollbar from " + res);
                        _this.$hzScrollBar.setScrollPane(_this, false);
                        _this.$owner.$rootContainer.addChild(_this.$hzScrollBar.displayObject);
                    }
                }
                _this.$scrollBarDisplayAuto = scrollBarDisplay == 2 /* Auto */;
                if (_this.$scrollBarDisplayAuto) {
                    _this.$scrollBarVisible = false;
                    if (_this.$vtScrollBar)
                        _this.$vtScrollBar.displayObject.visible = false;
                    if (_this.$hzScrollBar)
                        _this.$hzScrollBar.displayObject.visible = false;
                }
            }
            _this.$contentWidth = 0;
            _this.$contentHeight = 0;
            _this.setSize(owner.width, owner.height);
            _this.$owner.on(fgui.InteractiveEvents.Over, _this.$rollOver, _this);
            _this.$owner.on(fgui.InteractiveEvents.Out, _this.$rollOut, _this);
            _this.$owner.on(fgui.InteractiveEvents.Down, _this.$mouseDown, _this);
            _this.$owner.$rootContainer.on("added", _this.$ownerAdded, _this);
            _this.$owner.$rootContainer.on("removed", _this.$ownerRemoved, _this);
            return _this;
        }
        ScrollPane.prototype.$ownerAdded = function (e) {
            this.$onStage = true;
        };
        ScrollPane.prototype.$ownerRemoved = function (e) {
            this.$onStage = false;
        };
        Object.defineProperty(ScrollPane.prototype, "owner", {
            get: function () {
                return this.$owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "bouncebackEffect", {
            get: function () {
                return this.$bouncebackEffect;
            },
            set: function (sc) {
                this.$bouncebackEffect = sc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "touchEffect", {
            get: function () {
                return this.$touchEffect;
            },
            set: function (sc) {
                this.$touchEffect = sc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "scrollSpeed", {
            get: function () {
                return this.$scrollSpeed;
            },
            set: function (val) {
                this.$scrollSpeed = this.scrollSpeed;
                if (this.$scrollSpeed == 0)
                    this.$scrollSpeed = fgui.UIConfig.defaultScrollSpeed;
                //this.$mouseWheelSpeed = this.$scrollSpeed * 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "snapToItem", {
            get: function () {
                return this.$snapToItem;
            },
            set: function (value) {
                this.$snapToItem = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "percX", {
            get: function () {
                return this.$xPerc;
            },
            set: function (value) {
                this.setPercX(value, false);
            },
            enumerable: true,
            configurable: true
        });
        ScrollPane.prototype.setPercX = function (value, ani) {
            if (ani === void 0) { ani = false; }
            this.$owner.ensureBoundsCorrect();
            value = fgui.utils.NumberUtil.clamp01(value);
            if (value != this.$xPerc) {
                this.$xPerc = value;
                this.$xPos = this.$xPerc * this.$xOverlap;
                this.posChanged(ani);
            }
        };
        Object.defineProperty(ScrollPane.prototype, "percY", {
            get: function () {
                return this.$yPerc;
            },
            set: function (value) {
                this.setPercY(value, false);
            },
            enumerable: true,
            configurable: true
        });
        ScrollPane.prototype.setPercY = function (value, ani) {
            if (ani === void 0) { ani = false; }
            this.$owner.ensureBoundsCorrect();
            value = fgui.utils.NumberUtil.clamp01(value);
            if (value != this.$yPerc) {
                this.$yPerc = value;
                this.$yPos = this.$yPerc * this.$yOverlap;
                this.posChanged(ani);
            }
        };
        Object.defineProperty(ScrollPane.prototype, "posX", {
            get: function () {
                return this.$xPos;
            },
            set: function (value) {
                this.setPosX(value, false);
            },
            enumerable: true,
            configurable: true
        });
        ScrollPane.prototype.setPosX = function (value, ani) {
            if (ani === void 0) { ani = false; }
            this.$owner.ensureBoundsCorrect();
            value = fgui.utils.NumberUtil.clamp(value, 0, this.$xOverlap);
            if (value != this.$xPos) {
                this.$xPos = value;
                this.$xPerc = this.$xOverlap == 0 ? 0 : this.$xPos / this.$xOverlap;
                this.posChanged(ani);
            }
        };
        Object.defineProperty(ScrollPane.prototype, "posY", {
            get: function () {
                return this.$yPos;
            },
            set: function (value) {
                this.setPosY(value, false);
            },
            enumerable: true,
            configurable: true
        });
        ScrollPane.prototype.setPosY = function (value, ani) {
            if (ani === void 0) { ani = false; }
            this.$owner.ensureBoundsCorrect();
            value = fgui.utils.NumberUtil.clamp(value, 0, this.$yOverlap);
            if (value != this.$yPos) {
                this.$yPos = value;
                this.$yPerc = this.$yOverlap == 0 ? 0 : this.$yPos / this.$yOverlap;
                this.posChanged(ani);
            }
        };
        Object.defineProperty(ScrollPane.prototype, "isBottomMost", {
            get: function () {
                return this.$yPerc == 1 || this.$yOverlap == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "isRightMost", {
            get: function () {
                return this.$xPerc == 1 || this.$xOverlap == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "currentPageX", {
            get: function () {
                return this.$pageMode ? Math.floor(this.posX / this.$pageSizeH) : 0;
            },
            set: function (value) {
                if (this.$pageMode && this.$xOverlap > 0)
                    this.setPosX(value * this.$pageSizeH, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "currentPageY", {
            get: function () {
                return this.$pageMode ? Math.floor(this.posY / this.$pageSizeV) : 0;
            },
            set: function (value) {
                if (this.$pageMode && this.$yOverlap > 0)
                    this.setPosY(value * this.$pageSizeV, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "scrollingPosX", {
            get: function () {
                return fgui.utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "scrollingPosY", {
            get: function () {
                return fgui.utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "contentWidth", {
            get: function () {
                return this.$contentWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "contentHeight", {
            get: function () {
                return this.$contentHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "viewWidth", {
            get: function () {
                return this.$viewWidth;
            },
            set: function (value) {
                value = value + this.$owner.margin.left + this.$owner.margin.right;
                if (this.$vtScrollBar != null)
                    value += this.$vtScrollBar.width;
                this.$owner.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollPane.prototype, "viewHeight", {
            get: function () {
                return this.$viewHeight;
            },
            set: function (value) {
                value = value + this.$owner.margin.top + this.$owner.margin.bottom;
                if (this.$hzScrollBar != null)
                    value += this.$hzScrollBar.height;
                this.$owner.height = value;
            },
            enumerable: true,
            configurable: true
        });
        ScrollPane.prototype.getDeltaX = function (move) {
            return move / (this.$contentWidth - this.$viewWidth);
        };
        ScrollPane.prototype.getDeltaY = function (move) {
            return move / (this.$contentHeight - this.$viewHeight);
        };
        ScrollPane.prototype.scrollTop = function (ani) {
            if (ani === void 0) { ani = false; }
            this.setPercY(0, ani);
        };
        ScrollPane.prototype.scrollBottom = function (ani) {
            if (ani === void 0) { ani = false; }
            this.setPercY(1, ani);
        };
        ScrollPane.prototype.scrollUp = function (speed, ani) {
            if (speed === void 0) { speed = 1; }
            if (ani === void 0) { ani = false; }
            this.setPercY(this.$yPerc - this.getDeltaY(this.$scrollSpeed * speed), ani);
        };
        ScrollPane.prototype.scrollDown = function (speed, ani) {
            if (speed === void 0) { speed = 1; }
            if (ani === void 0) { ani = false; }
            this.setPercY(this.$yPerc + this.getDeltaY(this.$scrollSpeed * speed), ani);
        };
        ScrollPane.prototype.scrollLeft = function (speed, ani) {
            if (speed === void 0) { speed = 1; }
            if (ani === void 0) { ani = false; }
            this.setPercX(this.$xPerc - this.getDeltaX(this.$scrollSpeed * speed), ani);
        };
        ScrollPane.prototype.scrollRight = function (speed, ani) {
            if (speed === void 0) { speed = 1; }
            if (ani === void 0) { ani = false; }
            this.setPercX(this.$xPerc + this.getDeltaX(this.$scrollSpeed * speed), ani);
        };
        ScrollPane.prototype.scrollToView = function (target, ani, setFirst) {
            if (ani === void 0) { ani = false; }
            if (setFirst === void 0) { setFirst = false; }
            this.$owner.ensureBoundsCorrect();
            if (this.$needRefresh)
                this.refresh();
            var rect;
            if (target instanceof fgui.GObject) {
                if (target.parent != this.$owner) {
                    target.parent.localToGlobalRect(target.x, target.y, target.width, target.height, ScrollPane.sHelperRect);
                    rect = this.$owner.globalToLocalRect(ScrollPane.sHelperRect.x, ScrollPane.sHelperRect.y, ScrollPane.sHelperRect.width, ScrollPane.sHelperRect.height, ScrollPane.sHelperRect);
                }
                else {
                    rect = ScrollPane.sHelperRect;
                    rect.x = target.x;
                    rect.y = target.y;
                    rect.width = target.width;
                    rect.height = target.height;
                }
            }
            else
                rect = target;
            if (this.$yOverlap > 0) {
                var top_1 = this.posY;
                var bottom = top_1 + this.$viewHeight;
                if (setFirst || rect.y < top_1 || rect.height >= this.$viewHeight) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSizeV) * this.$pageSizeV, ani);
                    else
                        this.setPosY(rect.y, ani);
                }
                else if (rect.y + rect.height > bottom) {
                    if (this.$pageMode)
                        this.setPosY(Math.floor(rect.y / this.$pageSizeV) * this.$pageSizeV, ani);
                    else if (rect.height <= this.$viewHeight / 2)
                        this.setPosY(rect.y + rect.height * 2 - this.$viewHeight, ani);
                    else
                        this.setPosY(rect.y + rect.height - this.$viewHeight, ani);
                }
            }
            if (this.$xOverlap > 0) {
                var left = this.posX;
                var right = left + this.$viewWidth;
                if (setFirst || rect.x < left || rect.width >= this.$viewWidth) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSizeH) * this.$pageSizeH, ani);
                    else
                        this.setPosX(rect.x, ani);
                }
                else if (rect.x + rect.width > right) {
                    if (this.$pageMode)
                        this.setPosX(Math.floor(rect.x / this.$pageSizeH) * this.$pageSizeH, ani);
                    else if (rect.width <= this.$viewWidth / 2)
                        this.setPosX(rect.x + rect.width * 2 - this.$viewWidth, ani);
                    else
                        this.setPosX(rect.x + rect.width - this.$viewWidth, ani);
                }
            }
            if (!ani && this.$needRefresh)
                this.refresh();
        };
        ScrollPane.prototype.isChildInView = function (obj) {
            var dist;
            if (this.$yOverlap > 0) {
                dist = obj.y + this.$container.y;
                if (dist < -obj.height - 20 || dist > this.$viewHeight + 20)
                    return false;
            }
            if (this.$xOverlap > 0) {
                dist = obj.x + this.$container.x;
                if (dist < -obj.width - 20 || dist > this.$viewWidth + 20)
                    return false;
            }
            return true;
        };
        ScrollPane.prototype.cancelDragging = function () {
            var g = fgui.GRoot.inst.nativeStage;
            g.off(fgui.InteractiveEvents.Move, this.$touchMove, this);
            g.off(fgui.InteractiveEvents.Up, this.$touchEnd, this);
            g.off(fgui.InteractiveEvents.Click, this.$touchTap, this);
            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;
            ScrollPane.$gestureFlag = 0;
            this.$isDragged = false;
            this.$maskContainer.interactiveChildren = true;
        };
        ScrollPane.prototype.onOwnerSizeChanged = function () {
            this.setSize(this.$owner.width, this.$owner.height);
            this.posChanged(false);
        };
        ScrollPane.prototype.adjustMaskContainer = function () {
            var mx, my;
            if (this.$displayOnLeft && this.$vtScrollBar != null)
                mx = Math.floor(this.$owner.margin.left + this.$vtScrollBar.width);
            else
                mx = Math.floor(this.$owner.margin.left);
            my = Math.floor(this.$owner.margin.top);
            mx += this.$owner.$alignOffset.x;
            my += this.$owner.$alignOffset.y;
            this.$maskContainer.x = mx;
            this.$maskContainer.y = my;
        };
        ScrollPane.prototype.setSize = function (aWidth, aHeight) {
            this.adjustMaskContainer();
            if (this.$hzScrollBar) {
                this.$hzScrollBar.y = aHeight - this.$hzScrollBar.height;
                if (this.$vtScrollBar && !this.$vScrollNone) {
                    this.$hzScrollBar.width = aWidth - this.$vtScrollBar.width - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    if (this.$displayOnLeft)
                        this.$hzScrollBar.x = this.$scrollBarMargin.left + this.$vtScrollBar.width;
                    else
                        this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
                else {
                    this.$hzScrollBar.width = aWidth - this.$scrollBarMargin.left - this.$scrollBarMargin.right;
                    this.$hzScrollBar.x = this.$scrollBarMargin.left;
                }
            }
            if (this.$vtScrollBar) {
                if (!this.$displayOnLeft)
                    this.$vtScrollBar.x = aWidth - this.$vtScrollBar.width;
                if (this.$hzScrollBar)
                    this.$vtScrollBar.height = aHeight - this.$hzScrollBar.height - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                else
                    this.$vtScrollBar.height = aHeight - this.$scrollBarMargin.top - this.$scrollBarMargin.bottom;
                this.$vtScrollBar.y = this.$scrollBarMargin.top;
            }
            this.$viewWidth = aWidth;
            this.$viewHeight = aHeight;
            if (this.$hzScrollBar && !this.$hScrollNone)
                this.$viewHeight -= this.$hzScrollBar.height;
            if (this.$vtScrollBar && !this.$vScrollNone)
                this.$viewWidth -= this.$vtScrollBar.width;
            this.$viewWidth -= (this.$owner.margin.left + this.$owner.margin.right);
            this.$viewHeight -= (this.$owner.margin.top + this.$owner.margin.bottom);
            this.$viewWidth = Math.max(1, this.$viewWidth);
            this.$viewHeight = Math.max(1, this.$viewHeight);
            this.$pageSizeH = this.$viewWidth;
            this.$pageSizeV = this.$viewHeight;
            this.handleSizeChanged();
        };
        ScrollPane.prototype.setContentSize = function (aWidth, aHeight) {
            if (this.$contentWidth == aWidth && this.$contentHeight == aHeight)
                return;
            this.$contentWidth = aWidth;
            this.$contentHeight = aHeight;
            this.handleSizeChanged();
        };
        ScrollPane.prototype.changeContentSizeOnScrolling = function (deltaWidth, deltaHeight, deltaPosX, deltaPosY) {
            this.$contentWidth += deltaWidth;
            this.$contentHeight += deltaHeight;
            if (this.$isDragged) {
                if (deltaPosX != 0)
                    this.$container.x -= deltaPosX;
                if (deltaPosY != 0)
                    this.$container.y -= deltaPosY;
                this.validateHolderPos();
                this.$xOffset += deltaPosX;
                this.$yOffset += deltaPosY;
                var tmp = this.$y2 - this.$y1;
                this.$y1 = this.$container.y;
                this.$y2 = this.$y1 + tmp;
                tmp = this.$x2 - this.$x1;
                this.$x1 = this.$container.x;
                this.$x2 = this.$x1 + tmp;
                this.$yPos = -this.$container.y;
                this.$xPos = -this.$container.x;
            }
            else if (this.$tweening == 2) {
                if (deltaPosX != 0) {
                    this.$container.x -= deltaPosX;
                    this.$throwTween.start.x -= deltaPosX;
                }
                if (deltaPosY != 0) {
                    this.$container.y -= deltaPosY;
                    this.$throwTween.start.y -= deltaPosY;
                }
            }
            this.handleSizeChanged(true);
        };
        ScrollPane.prototype.handleSizeChanged = function (onScrolling) {
            if (onScrolling === void 0) { onScrolling = false; }
            if (this.$displayOnDemand) {
                if (this.$vtScrollBar) {
                    if (this.$contentHeight <= this.$viewHeight) {
                        if (!this.$vScrollNone) {
                            this.$vScrollNone = true;
                            this.$viewWidth += this.$vtScrollBar.width;
                        }
                    }
                    else {
                        if (this.$vScrollNone) {
                            this.$vScrollNone = false;
                            this.$viewWidth -= this.$vtScrollBar.width;
                        }
                    }
                }
                if (this.$hzScrollBar) {
                    if (this.$contentWidth <= this.$viewWidth) {
                        if (!this.$hScrollNone) {
                            this.$hScrollNone = true;
                            this.$viewHeight += this.$hzScrollBar.height;
                        }
                    }
                    else {
                        if (this.$hScrollNone) {
                            this.$hScrollNone = false;
                            this.$viewHeight -= this.$hzScrollBar.height;
                        }
                    }
                }
            }
            if (this.$vtScrollBar) {
                if (this.$viewHeight < this.$vtScrollBar.minSize)
                    this.$vtScrollBar.displayObject.visible = false;
                else {
                    this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
                    if (this.$contentHeight == 0)
                        this.$vtScrollBar.displayPerc = 0;
                    else
                        this.$vtScrollBar.displayPerc = Math.min(1, this.$viewHeight / this.$contentHeight);
                }
            }
            if (this.$hzScrollBar) {
                if (this.$viewWidth < this.$hzScrollBar.minSize)
                    this.$hzScrollBar.displayObject.visible = false;
                else {
                    this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
                    if (this.$contentWidth == 0)
                        this.$hzScrollBar.displayPerc = 0;
                    else
                        this.$hzScrollBar.displayPerc = Math.min(1, this.$viewWidth / this.$contentWidth);
                }
            }
            var rect = this.$maskContainer.scrollRect;
            if (rect != null) {
                rect.x = rect.y = 0;
                rect.width = this.$viewWidth;
                rect.height = this.$viewHeight;
                this.$maskContainer.scrollRect = rect;
            }
            if (this.$scrollType == 0 /* Horizontal */ || this.$scrollType == 2 /* Both */)
                this.$xOverlap = Math.ceil(Math.max(0, this.$contentWidth - this.$viewWidth));
            else
                this.$xOverlap = 0;
            if (this.$scrollType == 1 /* Vertical */ || this.$scrollType == 2 /* Both */)
                this.$yOverlap = Math.ceil(Math.max(0, this.$contentHeight - this.$viewHeight));
            else
                this.$yOverlap = 0;
            //TODO: need to handle if it's in tweening status and try to always stick at the edge
            if (this.$tweening == 0 && onScrolling) {
                if (this.$xPerc == 0 || this.$xPerc == 1) {
                    this.$xPos = this.$xPerc * this.$xOverlap;
                    this.$container.x = -this.$xPos;
                }
                if (this.$yPerc == 0 || this.$yPerc == 1) {
                    this.$yPos = this.$yPerc * this.$yOverlap;
                    this.$container.y = -this.$yPos;
                }
            }
            else {
                this.$xPos = fgui.utils.NumberUtil.clamp(this.$xPos, 0, this.$xOverlap);
                this.$xPerc = this.$xOverlap > 0 ? this.$xPos / this.$xOverlap : 0;
                this.$yPos = fgui.utils.NumberUtil.clamp(this.$yPos, 0, this.$yOverlap);
                this.$yPerc = this.$yOverlap > 0 ? this.$yPos / this.$yOverlap : 0;
            }
            this.validateHolderPos();
            if (this.$vtScrollBar != null)
                this.$vtScrollBar.scrollPerc = this.$yPerc;
            if (this.$hzScrollBar != null)
                this.$hzScrollBar.scrollPerc = this.$xPerc;
        };
        ScrollPane.prototype.validateHolderPos = function () {
            this.$container.x = fgui.utils.NumberUtil.clamp(this.$container.x, -this.$xOverlap, 0);
            this.$container.y = fgui.utils.NumberUtil.clamp(this.$container.y, -this.$yOverlap, 0);
        };
        ScrollPane.prototype.posChanged = function (ani) {
            if (this.$aniFlag == 0)
                this.$aniFlag = ani ? 1 : -1;
            else if (this.$aniFlag == 1 && !ani)
                this.$aniFlag = -1;
            this.$needRefresh = true;
            fgui.GTimer.inst.callLater(this.refresh, this);
            //kill the tweening and reset the pos if user set a new pos through API and currently the scrolling is not stopped yet
            if (this.$tweening == 2)
                this.killTween();
        };
        ScrollPane.prototype.killTween = function () {
            if (this.$tweening == 1) {
                this.$tweener.paused = true;
                this.$tweening = 0;
                this.$tweener = null;
                this.syncScrollBar(true);
            }
            else if (this.$tweening == 2) {
                this.$tweener.paused = true;
                this.$tweener = null;
                this.$tweening = 0;
                this.validateHolderPos();
                this.syncScrollBar(true);
                this.emit("__scrollEnd" /* SCROLL_END */, this);
            }
        };
        ScrollPane.prototype.refresh = function () {
            this.$needRefresh = false;
            fgui.GTimer.inst.remove(this.refresh, this);
            if (this.$pageMode) {
                var page = void 0;
                var delta = void 0;
                if (this.$yOverlap > 0 && this.$yPerc != 1 && this.$yPerc != 0) {
                    page = Math.floor(this.$yPos / this.$pageSizeV);
                    delta = this.$yPos - page * this.$pageSizeV;
                    if (delta > this.$pageSizeV / 2)
                        page++;
                    this.$yPos = page * this.$pageSizeV;
                    if (this.$yPos > this.$yOverlap) {
                        this.$yPos = this.$yOverlap;
                        this.$yPerc = 1;
                    }
                    else
                        this.$yPerc = this.$yPos / this.$yOverlap;
                }
                if (this.$xOverlap > 0 && this.$xPerc != 1 && this.$xPerc != 0) {
                    page = Math.floor(this.$xPos / this.$pageSizeH);
                    delta = this.$xPos - page * this.$pageSizeH;
                    if (delta > this.$pageSizeH / 2)
                        page++;
                    this.$xPos = page * this.$pageSizeH;
                    if (this.$xPos > this.$xOverlap) {
                        this.$xPos = this.$xOverlap;
                        this.$xPerc = 1;
                    }
                    else
                        this.$xPerc = this.$xPos / this.$xOverlap;
                }
            }
            else if (this.$snapToItem) {
                var pt = this.$owner.getSnappingPosition(this.$xPerc == 1 ? 0 : this.$xPos, this.$yPerc == 1 ? 0 : this.$yPos, ScrollPane.sHelperPoint);
                if (this.$xPerc != 1 && pt.x != this.$xPos) {
                    this.$xPos = pt.x;
                    this.$xPerc = this.$xPos / this.$xOverlap;
                    if (this.$xPerc > 1) {
                        this.$xPerc = 1;
                        this.$xPos = this.$xOverlap;
                    }
                }
                if (this.$yPerc != 1 && pt.y != this.$yPos) {
                    this.$yPos = pt.y;
                    this.$yPerc = this.$yPos / this.$yOverlap;
                    if (this.$yPerc > 1) {
                        this.$yPerc = 1;
                        this.$yPos = this.$yOverlap;
                    }
                }
            }
            this.refresh2();
            this.emit("__scroll" /* SCROLL */, this);
            if (this.$needRefresh) {
                this.$needRefresh = false;
                fgui.GTimer.inst.remove(this.refresh, this);
                this.refresh2();
            }
            this.$aniFlag = 0;
        };
        ScrollPane.prototype.refresh2 = function () {
            var contentXLoc = Math.floor(this.$xPos);
            var contentYLoc = Math.floor(this.$yPos);
            if (this.$aniFlag == 1 && !this.$isDragged) {
                var toX = this.$container.x;
                var toY = this.$container.y;
                if (this.$yOverlap > 0)
                    toY = -contentYLoc;
                else {
                    if (this.$container.y != 0)
                        this.$container.y = 0;
                }
                if (this.$xOverlap > 0)
                    toX = -contentXLoc;
                else {
                    if (this.$container.x != 0)
                        this.$container.x = 0;
                }
                if (toX != this.$container.x || toY != this.$container.y) {
                    if (this.$tweener != null)
                        this.killTween();
                    this.$tweening = 1;
                    this.$maskContainer.interactiveChildren = false;
                    this.$tweener = createjs.Tween.get(this.$container, { onChange: fgui.utils.Binder.create(this.$tweenUpdate, this) })
                        .to({ x: toX, y: toY, }, 500, ScrollPane.$easeTypeFunc)
                        .call(this.$tweenComplete, null, this);
                }
            }
            else {
                if (this.$tweener != null)
                    this.killTween();
                //here we need to handle if user call refresh while the list is being dragged to ensure the dragging can go ahead continuously.
                if (this.$isDragged) {
                    this.$xOffset += this.$container.x - (-contentXLoc);
                    this.$yOffset += this.$container.y - (-contentYLoc);
                }
                this.$container.y = -contentYLoc;
                this.$container.x = -contentXLoc;
                //make sure the scrolling can go ahead as expected when user's finger leaves from the device's screen.
                if (this.$isDragged) {
                    this.$y1 = this.$y2 = this.$container.y;
                    this.$x1 = this.$x2 = this.$container.x;
                }
                if (this.$vtScrollBar)
                    this.$vtScrollBar.scrollPerc = this.$yPerc;
                if (this.$hzScrollBar)
                    this.$hzScrollBar.scrollPerc = this.$xPerc;
            }
        };
        ScrollPane.prototype.syncPos = function () {
            if (this.$xOverlap > 0) {
                this.$xPos = fgui.utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap);
                this.$xPerc = this.$xPos / this.$xOverlap;
            }
            if (this.$yOverlap > 0) {
                this.$yPos = fgui.utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap);
                this.$yPerc = this.$yPos / this.$yOverlap;
            }
        };
        ScrollPane.prototype.syncScrollBar = function (end) {
            if (end === void 0) { end = false; }
            if (end) {
                if (this.$vtScrollBar) {
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(false);
                }
                if (this.$hzScrollBar) {
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(false);
                }
                this.$maskContainer.interactiveChildren = true;
            }
            else {
                if (this.$vtScrollBar) {
                    this.$vtScrollBar.scrollPerc = this.$yOverlap == 0 ? 0 : fgui.utils.NumberUtil.clamp(-this.$container.y, 0, this.$yOverlap) / this.$yOverlap;
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(true);
                }
                if (this.$hzScrollBar) {
                    this.$hzScrollBar.scrollPerc = this.$xOverlap == 0 ? 0 : fgui.utils.NumberUtil.clamp(-this.$container.x, 0, this.$xOverlap) / this.$xOverlap;
                    if (this.$scrollBarDisplayAuto)
                        this.showScrollBar(true);
                }
            }
        };
        ScrollPane.prototype.$mouseDown = function (evt) {
            if (!this.$touchEffect)
                return;
            if (this.$tweener != null)
                this.killTween();
            ScrollPane.sHelperPoint = evt.data.getLocalPosition(this.$maskContainer, ScrollPane.sHelperPoint);
            this.$x1 = this.$x2 = this.$container.x;
            this.$y1 = this.$y2 = this.$container.y;
            this.$xOffset = ScrollPane.sHelperPoint.x - this.$container.x;
            this.$yOffset = ScrollPane.sHelperPoint.y - this.$container.y;
            this.$time1 = this.$time2 = Date.now();
            this.$holdAreaPoint.x = ScrollPane.sHelperPoint.x;
            this.$holdAreaPoint.y = ScrollPane.sHelperPoint.y;
            this.$isHoldAreaDone = false;
            this.$isDragged = false;
            var g = fgui.GRoot.inst.nativeStage;
            g.on(fgui.InteractiveEvents.Move, this.$touchMove, this);
            g.on(fgui.InteractiveEvents.Up, this.$touchEnd, this);
            g.on(fgui.InteractiveEvents.Click, this.$touchTap, this);
        };
        ScrollPane.prototype.$touchMove = function (evt) {
            if (!this.$onStage || !this.$owner.finalVisible)
                return;
            if (!this.$touchEffect)
                return;
            if (ScrollPane.draggingPane != null && ScrollPane.draggingPane != this || fgui.GObject.draggingObject != null)
                return;
            var sensitivity = fgui.UIConfig.touchScrollSensitivity;
            var diff, diff2;
            var sv, sh, st;
            var pt = evt.data.getLocalPosition(this.$maskContainer, ScrollPane.sHelperPoint);
            if (this.$scrollType == 1 /* Vertical */) {
                if (!this.$isHoldAreaDone) {
                    //this means the gesture on vertical direction is being observed
                    ScrollPane.$gestureFlag |= 1;
                    diff = Math.abs(this.$holdAreaPoint.y - pt.y);
                    if (diff < sensitivity)
                        return;
                    //observe the gesture on the vertical direction, so we need to detect strictly whether the scrolling moves according to the vertical direction to avoid conflict.
                    if ((ScrollPane.$gestureFlag & 2) != 0) {
                        diff2 = Math.abs(this.$holdAreaPoint.x - pt.x);
                        if (diff < diff2)
                            return;
                    }
                }
                sv = true;
            }
            else if (this.$scrollType == 0 /* Horizontal */) {
                if (!this.$isHoldAreaDone) {
                    ScrollPane.$gestureFlag |= 2;
                    diff = Math.abs(this.$holdAreaPoint.x - pt.x);
                    if (diff < sensitivity)
                        return;
                    if ((ScrollPane.$gestureFlag & 1) != 0) {
                        diff2 = Math.abs(this.$holdAreaPoint.y - pt.y);
                        if (diff < diff2)
                            return;
                    }
                }
                sh = true;
            }
            else {
                ScrollPane.$gestureFlag = 3;
                if (!this.$isHoldAreaDone) {
                    diff = Math.abs(this.$holdAreaPoint.y - pt.y);
                    if (diff < sensitivity) {
                        diff = Math.abs(this.$holdAreaPoint.x - pt.x);
                        if (diff < sensitivity)
                            return;
                    }
                }
                sv = sh = true;
            }
            var t = Date.now();
            if (t - this.$time2 > 50) {
                this.$time2 = this.$time1;
                this.$time1 = t;
                st = true;
            }
            if (sv) {
                var y = Math.floor(ScrollPane.sHelperPoint.y - this.$yOffset);
                if (y > 0) {
                    if (!this.$bouncebackEffect || this.$inertiaDisabled)
                        this.$container.y = 0;
                    else
                        this.$container.y = Math.floor(y * 0.5);
                }
                else if (y < -this.$yOverlap || this.$inertiaDisabled) {
                    if (!this.$bouncebackEffect)
                        this.$container.y = -Math.floor(this.$yOverlap);
                    else
                        this.$container.y = Math.floor((y - this.$yOverlap) * 0.5);
                }
                else {
                    this.$container.y = y;
                }
                if (st) {
                    this.$y2 = this.$y1;
                    this.$y1 = this.$container.y;
                }
            }
            if (sh) {
                var x = Math.floor(ScrollPane.sHelperPoint.x - this.$xOffset);
                if (x > 0) {
                    if (!this.$bouncebackEffect || this.$inertiaDisabled)
                        this.$container.x = 0;
                    else
                        this.$container.x = Math.floor(x * 0.5);
                }
                else if (x < 0 - this.$xOverlap || this.$inertiaDisabled) {
                    if (!this.$bouncebackEffect)
                        this.$container.x = -Math.floor(this.$xOverlap);
                    else
                        this.$container.x = Math.floor((x - this.$xOverlap) * 0.5);
                }
                else {
                    this.$container.x = x;
                }
                if (st) {
                    this.$x2 = this.$x1;
                    this.$x1 = this.$container.x;
                }
            }
            ScrollPane.draggingPane = this;
            this.$maskContainer.interactiveChildren = false;
            this.$isHoldAreaDone = true;
            this.$isDragged = true;
            this.syncPos();
            this.syncScrollBar();
            this.emit("__scroll" /* SCROLL */, this);
        };
        ScrollPane.prototype.$touchEnd = function (evt) {
            var g = fgui.GRoot.inst.nativeStage;
            g.off(fgui.InteractiveEvents.Move, this.$touchMove, this);
            g.off(fgui.InteractiveEvents.Up, this.$touchEnd, this);
            g.off(fgui.InteractiveEvents.Click, this.$touchTap, this);
            if (ScrollPane.draggingPane == this)
                ScrollPane.draggingPane = null;
            ScrollPane.$gestureFlag = 0;
            if (!this.$isDragged || !this.$touchEffect || this.$inertiaDisabled || !this.$owner.onStage)
                return;
            var time = (Date.now() - this.$time2) / 1000;
            if (time == 0)
                time = 0.001;
            var yVelocity = (this.$container.y - this.$y2) / time * 2 * fgui.UIConfig.defaultTouchScrollSpeedRatio;
            var xVelocity = (this.$container.x - this.$x2) / time * 2 * fgui.UIConfig.defaultTouchScrollSpeedRatio;
            var duration = 0.3;
            this.$throwTween.start.x = this.$container.x;
            this.$throwTween.start.y = this.$container.y;
            var change1 = this.$throwTween.change1;
            var change2 = this.$throwTween.change2;
            var endX = 0;
            var endY = 0;
            var page = 0;
            var delta = 0;
            var fireRelease = 0;
            var testPageSize;
            if (this.$scrollType == 2 /* Both */ || this.$scrollType == 0 /* Horizontal */) {
                if (this.$container.x > fgui.UIConfig.touchDragSensitivity)
                    fireRelease = 1;
                else if (this.$container.x < -this.$xOverlap - fgui.UIConfig.touchDragSensitivity)
                    fireRelease = 2;
                change1.x = ThrowTween.calculateChange(xVelocity, duration);
                change2.x = 0;
                endX = this.$container.x + change1.x;
                if (this.$pageMode && endX < 0 && endX > -this.$xOverlap) {
                    page = Math.floor(-endX / this.$pageSizeH);
                    testPageSize = Math.min(this.$pageSizeH, this.$contentWidth - (page + 1) * this.$pageSizeH);
                    delta = -endX - page * this.$pageSizeH;
                    //magnet magic
                    if (Math.abs(change1.x) > this.$pageSizeH) {
                        if (delta > testPageSize * 0.5)
                            page++;
                    }
                    else {
                        if (delta > testPageSize * (change1.x < 0 ? 0.3 : 0.7))
                            page++;
                    }
                    //re-calculate the destination point
                    endX = -page * this.$pageSizeH;
                    if (endX < -this.$xOverlap)
                        endX = -this.$xOverlap;
                    change1.x = endX - this.$container.x;
                }
            }
            else
                change1.x = change2.x = 0;
            if (this.$scrollType == 2 /* Both */ || this.$scrollType == 1 /* Vertical */) {
                if (this.$container.y > fgui.UIConfig.touchDragSensitivity)
                    fireRelease = 1;
                else if (this.$container.y < -this.$yOverlap - fgui.UIConfig.touchDragSensitivity)
                    fireRelease = 2;
                change1.y = ThrowTween.calculateChange(yVelocity, duration);
                change2.y = 0;
                endY = this.$container.y + change1.y;
                if (this.$pageMode && endY < 0 && endY > -this.$yOverlap) {
                    page = Math.floor(-endY / this.$pageSizeV);
                    testPageSize = Math.min(this.$pageSizeV, this.$contentHeight - (page + 1) * this.$pageSizeV);
                    delta = -endY - page * this.$pageSizeV;
                    if (Math.abs(change1.y) > this.$pageSizeV) {
                        if (delta > testPageSize * 0.5)
                            page++;
                    }
                    else {
                        if (delta > testPageSize * (change1.y < 0 ? 0.3 : 0.7))
                            page++;
                    }
                    endY = -page * this.$pageSizeV;
                    if (endY < -this.$yOverlap)
                        endY = -this.$yOverlap;
                    change1.y = endY - this.$container.y;
                }
            }
            else
                change1.y = change2.y = 0;
            if (this.$snapToItem && !this.$pageMode) {
                endX = -endX;
                endY = -endY;
                var pt = this.$owner.getSnappingPosition(endX, endY, ScrollPane.sHelperPoint);
                endX = -pt.x;
                endY = -pt.y;
                change1.x = endX - this.$container.x;
                change1.y = endY - this.$container.y;
            }
            if (this.$bouncebackEffect) {
                if (endX > 0)
                    change2.x = 0 - this.$container.x - change1.x;
                else if (endX < -this.$xOverlap)
                    change2.x = -this.$xOverlap - this.$container.x - change1.x;
                if (endY > 0)
                    change2.y = 0 - this.$container.y - change1.y;
                else if (endY < -this.$yOverlap)
                    change2.y = -this.$yOverlap - this.$container.y - change1.y;
            }
            else {
                if (endX > 0)
                    change1.x = 0 - this.$container.x;
                else if (endX < -this.$xOverlap)
                    change1.x = -this.$xOverlap - this.$container.x;
                if (endY > 0)
                    change1.y = 0 - this.$container.y;
                else if (endY < -this.$yOverlap)
                    change1.y = -this.$yOverlap - this.$container.y;
            }
            this.$throwTween.value = 0;
            this.$throwTween.change1 = change1;
            this.$throwTween.change2 = change2;
            if (this.$tweener != null)
                this.killTween();
            this.$tweening = 2;
            this.$tweener = createjs.Tween.get(this.$throwTween, { onChange: fgui.utils.Binder.create(this.$tweenUpdate2, this) })
                .to({ value: 1 }, duration * 1000, ScrollPane.$easeTypeFunc)
                .call(this.$tweenComplete2, null, this);
            if (fireRelease == 1)
                this.emit("__pullDownRelease" /* PULL_DOWN_RELEASE */, this);
            else if (fireRelease == 2)
                this.emit("__pullUpRelease" /* PULL_UP_RELEASE */, this);
        };
        ScrollPane.prototype.$touchTap = function (evt) {
            this.$isDragged = false;
        };
        ScrollPane.prototype.$rollOver = function (evt) {
            this.showScrollBar(true);
        };
        ScrollPane.prototype.$rollOut = function (evt) {
            this.showScrollBar(false);
        };
        ScrollPane.prototype.dispose = function () {
            fgui.GTimer.inst.remove(this.refresh, this);
            fgui.GTimer.inst.remove(this.setScrollBarVisible, this);
            createjs.Tween.removeTweens(this.$throwTween);
            createjs.Tween.removeTweens(this.$container);
            if (this.$tweener) {
                this.$tweener.removeAllEventListeners();
                this.$tweener = null;
            }
            this.$owner.$rootContainer.off("added", this.$ownerAdded, this);
            this.$owner.$rootContainer.off("removed", this.$ownerRemoved, this);
            this.$owner.off(fgui.InteractiveEvents.Over, this.$rollOver, this);
            this.$owner.off(fgui.InteractiveEvents.Out, this.$rollOut, this);
            this.$owner.off(fgui.InteractiveEvents.Down, this.$mouseDown, this);
            var g = fgui.GRoot.inst.nativeStage;
            g.off(fgui.InteractiveEvents.Move, this.$touchMove, this);
            g.off(fgui.InteractiveEvents.Up, this.$touchEnd, this);
            g.off(fgui.InteractiveEvents.Click, this.$touchTap, this);
        };
        ScrollPane.prototype.showScrollBar = function (val) {
            if (val) {
                this.setScrollBarVisible(true);
                fgui.GTimer.inst.remove(this.setScrollBarVisible, this);
            }
            else
                fgui.GTimer.inst.add(500, 1, this.setScrollBarVisible, this, val);
        };
        ScrollPane.prototype.setScrollBarVisible = function (val) {
            this.$scrollBarVisible = val && this.$viewWidth > 0 && this.$viewHeight > 0;
            if (this.$vtScrollBar)
                this.$vtScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$vScrollNone;
            if (this.$hzScrollBar)
                this.$hzScrollBar.displayObject.visible = this.$scrollBarVisible && !this.$hScrollNone;
        };
        ScrollPane.prototype.$tweenUpdate = function () {
            this.syncScrollBar();
            this.emit("__scroll" /* SCROLL */, this);
        };
        ScrollPane.prototype.$tweenComplete = function () {
            this.$tweening = 0;
            this.$tweener = null;
            this.validateHolderPos();
            this.syncScrollBar(true);
            this.emit("__scroll" /* SCROLL */, this);
        };
        ScrollPane.prototype.$tweenUpdate2 = function () {
            this.$throwTween.update(this.$container);
            this.syncPos();
            this.syncScrollBar();
            this.emit("__scroll" /* SCROLL */, this);
        };
        ScrollPane.prototype.$tweenComplete2 = function () {
            this.$tweening = 0;
            this.$tweener = null;
            this.validateHolderPos();
            this.syncPos();
            this.syncScrollBar(true);
            this.emit("__scroll" /* SCROLL */, this);
            this.emit("__scrollEnd" /* SCROLL_END */, this);
        };
        ScrollPane.$gestureFlag = 0;
        ScrollPane.sHelperRect = new PIXI.Rectangle();
        ScrollPane.sHelperPoint = new PIXI.Point();
        return ScrollPane;
    }(PIXI.utils.EventEmitter));
    fgui.ScrollPane = ScrollPane;
    var ThrowTween = (function () {
        function ThrowTween() {
            this.start = new PIXI.Point();
            this.change1 = new PIXI.Point();
            this.change2 = new PIXI.Point();
        }
        ThrowTween.prototype.update = function (obj) {
            obj.x = Math.floor(this.start.x + this.change1.x * this.value + this.change2.x * this.value * this.value);
            obj.y = Math.floor(this.start.y + this.change1.y * this.value + this.change2.y * this.value * this.value);
        };
        ThrowTween.calculateChange = function (velocity, duration) {
            return (duration * ThrowTween.checkpoint * velocity) / ThrowTween.easeOutCubic(ThrowTween.checkpoint, 0, 1, 1);
        };
        ThrowTween.easeOutCubic = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        };
        ThrowTween.checkpoint = 0.05;
        return ThrowTween;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    ;
    var Transition = (function () {
        function Transition(owner) {
            this.autoPlayRepeat = 1;
            this.autoPlayDelay = 0;
            this.$ownerBaseX = 0;
            this.$ownerBaseY = 0;
            this.$totalTimes = 0;
            this.$totalTasks = 0;
            this.$playing = false;
            this.$options = 0;
            this.$maxTime = 0;
            this.$owner = owner;
            this.$items = [];
            this.$owner.on("__visibleChanged" /* VISIBLE_CHANGED */, this.$ownerVisibleChanged, this);
        }
        Transition.prototype.$ownerVisibleChanged = function (vis, owner) {
            if ((this.$options & Transition.OPTION_AUTO_STOP_DISABLED) == 0 && vis === false)
                this.stop((this.$options & Transition.OPTION_AUTO_STOP_AT_END) != 0 ? true : false, false);
        };
        Object.defineProperty(Transition.prototype, "autoPlay", {
            get: function () {
                return this.$autoPlay;
            },
            set: function (value) {
                if (this.$autoPlay != value) {
                    this.$autoPlay = value;
                    if (this.$autoPlay) {
                        if (this.$owner.onStage)
                            this.play({
                                times: this.autoPlayRepeat,
                                delay: this.autoPlayDelay
                            });
                    }
                    else {
                        if (!this.$owner.onStage)
                            this.stop(false, true);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Transition.prototype.changeRepeat = function (value) {
            this.$totalTimes = value | 0;
        };
        /**
         * Play transition by specified settings:
         * 1) pass whole parameters:
                onComplete?: (...args:any[]) => void,
                onCompleteObj?: any,
                onCompleteParam?: any,
                times: number,
                delay: number
         * 2) just pass 1 object which implements TransitionPlaySetting (recommended)
         */
        Transition.prototype.play = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length && typeof (args[0]) == "object") {
                var obj = args[0];
                this.$play(obj.onComplete, obj.onCompleteObj, obj.onCompleteParam, obj.times || 1, obj.delay || 0, false);
            }
            else
                this.$play(args[0], args[1], args[2], args[3] || 1, args[4] || 0, false);
        };
        /**
         * Play transition by specified settings:
         * 1) pass whole parameters:
                onComplete?: (...args:any[]) => void,
                onCompleteObj?: any,
                onCompleteParam?: any,
                times: number,
                delay: number
         * 2) just pass 1 object which implements TransitionPlaySetting (recommended)
         */
        Transition.prototype.playReverse = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length && typeof (args[0]) == "object") {
                var obj = args[0];
                this.$play(obj.onComplete, obj.onCompleteObj, obj.onCompleteParam, obj.times || 1, obj.delay || 0, true);
            }
            else
                this.$play(args[0], args[1], args[2], args[3] || 1, args[4] || 0, true);
        };
        Transition.prototype.$play = function (onComplete, onCompleteObj, onCompleteParam, times, delay, reversed) {
            var _this = this;
            if (reversed === void 0) { reversed = false; }
            this.stop();
            if (times == 0)
                times = 1;
            else if (times == -1)
                times = Number.MAX_VALUE;
            this.$totalTimes = times;
            this.$reversed = reversed;
            this.internalPlay(delay);
            this.$playing = this.$totalTasks > 0;
            if (this.$playing) {
                this.$onComplete = onComplete;
                this.$onCompleteParam = onCompleteParam;
                this.$onCompleteObj = onCompleteObj;
                if ((this.$options & Transition.OPTION_IGNORE_DISPLAY_CONTROLLER) != 0) {
                    this.$items.forEach(function (item) {
                        if (item.target != null && item.target != _this.$owner)
                            item.lockToken = item.target.lockGearDisplay();
                    }, this);
                }
            }
            else if (onComplete != null) {
                onCompleteParam && onCompleteParam.length ? onComplete.apply(onCompleteObj, onCompleteParam) :
                    onComplete.call(onCompleteObj, onCompleteParam);
            }
        };
        Transition.prototype.stop = function (setToComplete, processCallback) {
            if (setToComplete === void 0) { setToComplete = true; }
            if (processCallback === void 0) { processCallback = false; }
            if (this.$playing) {
                this.$playing = false;
                this.$totalTasks = 0;
                this.$totalTimes = 0;
                var func = this.$onComplete;
                var param = this.$onCompleteParam;
                var thisObj = this.$onCompleteObj;
                this.$onComplete = null;
                this.$onCompleteParam = null;
                this.$onCompleteObj = null;
                var cnt = this.$items.length;
                var item = void 0;
                if (this.$reversed) {
                    for (var i = cnt - 1; i >= 0; i--) {
                        item = this.$items[i];
                        if (item.target == null)
                            continue;
                        this.stopItem(item, setToComplete);
                    }
                }
                else {
                    for (var i = 0; i < cnt; i++) {
                        item = this.$items[i];
                        if (item.target == null)
                            continue;
                        this.stopItem(item, setToComplete);
                    }
                }
                if (processCallback && func != null)
                    param && param.length > 0 ? func.apply(thisObj, param) : func.call(thisObj, param);
            }
        };
        Transition.prototype.stopItem = function (item, setToComplete) {
            if (item.lockToken != 0) {
                item.target.releaseGearDisplay(item.lockToken);
                item.lockToken = 0;
            }
            if (item.type == 12 /* ColorFilter */ && item.filterCreated)
                item.target.filters = null;
            if (item.completed)
                return;
            this.disposeTween(item);
            if (item.type == 10 /* Transition */) {
                var trans = item.target.getTransition(item.value.s);
                if (trans != null)
                    trans.stop(setToComplete, false);
            }
            else if (item.type == 11 /* Shake */) {
                fgui.GTimer.inst.remove(item.$shake, item);
                item.target.$gearLocked = true;
                item.target.setXY(item.target.x - item.startValue.f1, item.target.y - item.startValue.f2);
                item.target.$gearLocked = false;
            }
            else {
                if (setToComplete) {
                    if (item.tween) {
                        if (!item.yoyo || item.repeat % 2 == 0)
                            this.applyValue(item, this.$reversed ? item.startValue : item.endValue);
                        else
                            this.applyValue(item, this.$reversed ? item.endValue : item.startValue);
                    }
                    else if (item.type != 9 /* Sound */)
                        this.applyValue(item, item.value);
                }
            }
        };
        Transition.prototype.dispose = function () {
            var _this = this;
            fgui.GTimer.inst.remove(this.internalPlay, this);
            this.$owner.off("__visibleChanged" /* VISIBLE_CHANGED */, this.$ownerVisibleChanged, this);
            this.$playing = false;
            this.$items.forEach(function (item) {
                if (item.target == null || item.completed)
                    return;
                _this.disposeTween(item);
                if (item.type == 10 /* Transition */) {
                    var trans = item.target.getTransition(item.value.s);
                    if (trans != null)
                        trans.dispose();
                }
                else if (item.type == 11 /* Shake */)
                    fgui.GTimer.inst.remove(item.$shake, item);
            }, this);
        };
        Object.defineProperty(Transition.prototype, "playing", {
            get: function () {
                return this.$playing;
            },
            enumerable: true,
            configurable: true
        });
        Transition.prototype.setValue = function (label) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.$items.forEach(function (item) {
                if (item.label == null && item.label2 == null)
                    return;
                var value;
                if (item.label == label) {
                    if (item.tween)
                        value = item.startValue;
                    else
                        value = item.value;
                }
                else if (item.label2 == label)
                    value = item.endValue;
                else
                    return;
                switch (item.type) {
                    case 0 /* XY */:
                    case 1 /* Size */:
                    case 3 /* Pivot */:
                    case 2 /* Scale */:
                    case 13 /* Skew */:
                        value.b1 = true;
                        value.b2 = true;
                        value.f1 = parseFloat(args[0]);
                        value.f2 = parseFloat(args[1]);
                        break;
                    case 4 /* Alpha */:
                        value.f1 = parseFloat(args[0]);
                        break;
                    case 5 /* Rotation */:
                        value.i = parseInt(args[0]);
                        break;
                    case 6 /* Color */:
                        value.c = parseFloat(args[0]);
                        break;
                    case 7 /* Animation */:
                        value.i = parseInt(args[0]);
                        if (args.length > 1)
                            value.b = args[1];
                        break;
                    case 8 /* Visible */:
                        value.b = args[0];
                        break;
                    case 9 /* Sound */:
                        value.s = args[0];
                        if (args.length > 1)
                            value.f1 = parseFloat(args[1]);
                        break;
                    case 10 /* Transition */:
                        value.s = args[0];
                        if (args.length > 1)
                            value.i = parseInt(args[1]);
                        break;
                    case 11 /* Shake */:
                        value.f1 = parseFloat(args[0]);
                        if (args.length > 1)
                            value.f2 = parseFloat(args[1]);
                        break;
                    case 12 /* ColorFilter */:
                        value.f1 = parseFloat(args[0]);
                        value.f2 = parseFloat(args[1]);
                        value.f3 = parseFloat(args[2]);
                        value.f4 = parseFloat(args[3]);
                        break;
                }
            }, this);
        };
        Transition.prototype.setHook = function (label, callback, thisObj) {
            var cnt = this.$items.length;
            for (var i = 0; i < cnt; i++) {
                var item = this.$items[i];
                if (item.label == label) {
                    item.hook = callback;
                    item.hookObj = thisObj;
                    break;
                }
                else if (item.label2 == label) {
                    item.hook2 = callback;
                    item.hook2Obj = thisObj;
                    break;
                }
            }
        };
        Transition.prototype.clearHooks = function () {
            this.$items.forEach(function (item) {
                item.hook = null;
                item.hookObj = null;
                item.hook2 = null;
                item.hook2Obj = null;
            }, this);
        };
        Transition.prototype.setTarget = function (label, newTarget) {
            this.$items.forEach(function (item) {
                if (item.label == label)
                    item.targetId = newTarget.id;
            }, this);
        };
        Transition.prototype.setDuration = function (label, value) {
            this.$items.forEach(function (item) {
                if (item.tween && item.label == label)
                    item.duration = value;
            }, this);
        };
        Transition.prototype.updateFromRelations = function (targetId, dx, dy) {
            this.$items.forEach(function (item) {
                if (item.type == 0 /* XY */ && item.targetId == targetId) {
                    if (item.tween) {
                        item.startValue.f1 += dx;
                        item.startValue.f2 += dy;
                        item.endValue.f1 += dx;
                        item.endValue.f2 += dy;
                    }
                    else {
                        item.value.f1 += dx;
                        item.value.f2 += dy;
                    }
                }
            }, this);
        };
        Transition.prototype.internalPlay = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            this.$ownerBaseX = this.$owner.x;
            this.$ownerBaseY = this.$owner.y;
            this.$totalTasks = 0;
            this.$items.forEach(function (item) {
                if (item.targetId)
                    item.target = _this.$owner.getChildById(item.targetId);
                else
                    item.target = _this.$owner;
                if (item.target == null)
                    return;
                var startTime;
                _this.disposeTween(item);
                if (item.tween) {
                    if (_this.$reversed)
                        startTime = delay + _this.$maxTime - item.time - item.duration;
                    else
                        startTime = delay + item.time;
                    if (startTime > 0) {
                        _this.$totalTasks++;
                        item.completed = false;
                        item.tweener = createjs.Tween.get(item.value).wait(startTime * 1000).call(_this.$delayCall, [item], _this);
                    }
                    else
                        _this.startTween(item);
                }
                else {
                    if (_this.$reversed)
                        startTime = delay + _this.$maxTime - item.time;
                    else
                        startTime = delay + item.time;
                    if (startTime <= 0)
                        _this.applyValue(item, item.value);
                    else {
                        _this.$totalTasks++;
                        item.completed = false;
                        item.tweener = createjs.Tween.get(item.value).wait(startTime * 1000).call(_this.$delayCall2, [item], _this);
                    }
                }
            }, this);
        };
        Transition.prototype.prepareValue = function (item, toProps, reversed) {
            if (reversed === void 0) { reversed = false; }
            var startValue;
            var endValue;
            if (reversed) {
                startValue = item.endValue;
                endValue = item.startValue;
            }
            else {
                startValue = item.startValue;
                endValue = item.endValue;
            }
            switch (item.type) {
                case 0 /* XY */:
                case 1 /* Size */:
                    if (item.type == 0 /* XY */) {
                        if (item.target == this.$owner) {
                            if (!startValue.b1)
                                startValue.f1 = 0;
                            if (!startValue.b2)
                                startValue.f2 = 0;
                        }
                        else {
                            if (!startValue.b1)
                                startValue.f1 = item.target.x;
                            if (!startValue.b2)
                                startValue.f2 = item.target.y;
                        }
                    }
                    else {
                        if (!startValue.b1)
                            startValue.f1 = item.target.width;
                        if (!startValue.b2)
                            startValue.f2 = item.target.height;
                    }
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;
                    if (!endValue.b1)
                        endValue.f1 = item.value.f1;
                    if (!endValue.b2)
                        endValue.f2 = item.value.f2;
                    item.value.b1 = startValue.b1 || endValue.b1;
                    item.value.b2 = startValue.b2 || endValue.b2;
                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    break;
                case 2 /* Scale */:
                case 13 /* Skew */:
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;
                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    break;
                case 4 /* Alpha */:
                    item.value.f1 = startValue.f1;
                    toProps.f1 = endValue.f1;
                    break;
                case 5 /* Rotation */:
                    item.value.i = startValue.i;
                    toProps.i = endValue.i;
                    break;
                case 12 /* ColorFilter */:
                    item.value.f1 = startValue.f1;
                    item.value.f2 = startValue.f2;
                    item.value.f3 = startValue.f3;
                    item.value.f4 = startValue.f4;
                    toProps.f1 = endValue.f1;
                    toProps.f2 = endValue.f2;
                    toProps.f3 = endValue.f3;
                    toProps.f4 = endValue.f4;
                    break;
            }
        };
        Transition.prototype.startTween = function (item) {
            var toProps = new TransitionValue();
            this.prepareValue(item, toProps, this.$reversed);
            this.applyValue(item, item.value);
            var completeHandler;
            if (item.repeat != 0) {
                item.tweenTimes = 0;
                completeHandler = fgui.utils.Binder.create(this.$tweenRepeatComplete, this, item);
            }
            else
                completeHandler = fgui.utils.Binder.create(this.$tweenComplete, this, item);
            this.$totalTasks++;
            item.completed = false;
            this.prepareValue(item, toProps, this.$reversed);
            item.tweener = createjs.Tween.get(item.value, {
                onChange: fgui.utils.Binder.create(this.$tweenUpdate, this, item)
            }).to(toProps, item.duration * 1000, item.easeType).call(completeHandler);
            if (item.hook != null)
                item.hook.call(item.hookObj);
        };
        Transition.prototype.$delayCall = function (item) {
            this.disposeTween(item);
            this.$totalTasks--;
            this.startTween(item);
        };
        Transition.prototype.$delayCall2 = function (item) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;
            this.applyValue(item, item.value);
            if (item.hook != null)
                item.hook.call(item.hookObj);
            this.checkAllComplete();
        };
        Transition.prototype.$tweenUpdate = function (event, item) {
            this.applyValue(item, item.value);
        };
        Transition.prototype.$tweenComplete = function (event, item) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;
            if (item.hook2 != null)
                item.hook2.call(item.hook2Obj);
            this.checkAllComplete();
        };
        Transition.prototype.$tweenRepeatComplete = function (event, item) {
            item.tweenTimes++;
            if (item.repeat == -1 || item.tweenTimes < item.repeat + 1) {
                var toProps = new TransitionValue;
                var reversed = void 0;
                if (item.yoyo) {
                    if (this.$reversed)
                        reversed = item.tweenTimes % 2 == 0;
                    else
                        reversed = item.tweenTimes % 2 == 1;
                }
                else
                    reversed = this.$reversed;
                this.prepareValue(item, toProps, reversed);
                this.disposeTween(item);
                item.tweener = createjs.Tween.get(item.value, {
                    onChange: fgui.utils.Binder.create(this.$tweenUpdate, this, item)
                }).to(toProps, item.duration * 1000, item.easeType).call(this.$tweenRepeatComplete, [null, item], this);
            }
            else
                this.$tweenComplete(null, item);
        };
        Transition.prototype.disposeTween = function (item) {
            if (!item)
                return;
            if (item.tweener) {
                item.tweener.paused = true;
                item.tweener.removeAllEventListeners();
                createjs.Tween.removeTweens(item.value);
                item.tweener = null;
            }
        };
        Transition.prototype.$playTransComplete = function (item) {
            this.disposeTween(item);
            this.$totalTasks--;
            item.completed = true;
            this.checkAllComplete();
        };
        Transition.prototype.checkAllComplete = function () {
            var _this = this;
            if (this.$playing && this.$totalTasks == 0) {
                if (this.$totalTimes < 0) {
                    //the reason we don't call 'internalPlay' immediately here is because of the onChange handler issue, the handler's been calling all the time even the tween is in waiting/complete status.
                    fgui.GTimer.inst.callLater(this.internalPlay, this, 0);
                }
                else {
                    this.$totalTimes--;
                    if (this.$totalTimes > 0)
                        fgui.GTimer.inst.callLater(this.internalPlay, this, 0);
                    else {
                        this.$playing = false;
                        this.$items.forEach(function (item) {
                            if (item.target != null) {
                                if (item.lockToken != 0) {
                                    item.target.releaseGearDisplay(item.lockToken);
                                    item.lockToken = 0;
                                }
                                if (item.filterCreated) {
                                    item.filterCreated = false;
                                    item.target.filters = null;
                                }
                                _this.disposeTween(item);
                            }
                        });
                        if (this.$onComplete != null) {
                            var func = this.$onComplete;
                            var param = this.$onCompleteParam;
                            var thisObj = this.$onCompleteObj;
                            this.$onComplete = null;
                            this.$onCompleteParam = null;
                            this.$onCompleteObj = null;
                            param && param.length ? func.apply(thisObj, param) : func.call(thisObj, param);
                        }
                    }
                }
            }
        };
        Transition.prototype.applyValue = function (item, value) {
            item.target.$gearLocked = true;
            switch (item.type) {
                case 0 /* XY */:
                    if (item.target == this.$owner) {
                        var f1 = 0, f2 = 0;
                        if (!value.b1)
                            f1 = item.target.x;
                        else
                            f1 = value.f1 + this.$ownerBaseX;
                        if (!value.b2)
                            f2 = item.target.y;
                        else
                            f2 = value.f2 + this.$ownerBaseY;
                        item.target.setXY(f1, f2);
                    }
                    else {
                        if (!value.b1)
                            value.f1 = item.target.x;
                        if (!value.b2)
                            value.f2 = item.target.y;
                        item.target.setXY(value.f1, value.f2);
                    }
                    break;
                case 1 /* Size */:
                    if (!value.b1)
                        value.f1 = item.target.width;
                    if (!value.b2)
                        value.f2 = item.target.height;
                    item.target.setSize(value.f1, value.f2);
                    break;
                case 3 /* Pivot */:
                    item.target.setPivot(value.f1, value.f2);
                    break;
                case 4 /* Alpha */:
                    item.target.alpha = value.f1;
                    break;
                case 5 /* Rotation */:
                    item.target.rotation = value.i;
                    break;
                case 2 /* Scale */:
                    item.target.setScale(value.f1, value.f2);
                    break;
                case 13 /* Skew */:
                    item.target.setSkew(value.f1, value.f2);
                    break;
                case 6 /* Color */:
                    if (fgui.isColorGear(item.target))
                        item.target.color = value.c;
                    break;
                case 7 /* Animation */:
                    if (fgui.isAnimationGear(item.target)) {
                        if (!value.b1)
                            value.i = item.target.frame;
                        item.target.frame = value.i;
                        item.target.playing = value.b;
                    }
                    break;
                case 8 /* Visible */:
                    item.target.visible = value.b;
                    break;
                case 10 /* Transition */:
                    var trans = item.target.getTransition(value.s);
                    if (trans != null) {
                        if (value.i == 0)
                            trans.stop(false, true);
                        else if (trans.playing)
                            trans.$totalTimes = value.i == -1 ? Number.MAX_VALUE : value.i;
                        else {
                            item.completed = false;
                            this.$totalTasks++;
                            if (this.$reversed)
                                trans.playReverse(this.$playTransComplete, this, item, item.value.i);
                            else
                                trans.play(this.$playTransComplete, this, item, item.value.i);
                        }
                    }
                    break;
                case 9 /* Sound */:
                    //ignore
                    break;
                case 11 /* Shake */:
                    item.startValue.f1 = 0; //offsetX
                    item.startValue.f2 = 0; //offsetY
                    item.startValue.f3 = item.value.f2; //shakePeriod
                    fgui.GTimer.inst.add(1, 0, item.$shake, item, [this]);
                    this.$totalTasks++;
                    item.completed = false;
                    break;
                case 12 /* ColorFilter */:
                    item.target.updateColorComponents(value.f1, value.f2, value.f3, value.f4);
                    break;
            }
            item.target.$gearLocked = false;
        };
        /**@internal */
        Transition.prototype.$shakeItem = function (item, elapsedMS) {
            var r = Math.ceil(item.value.f1 * item.startValue.f3 / item.value.f2);
            var rx = (Math.random() * 2 - 1) * r;
            var ry = (Math.random() * 2 - 1) * r;
            rx = rx > 0 ? Math.ceil(rx) : Math.floor(rx);
            ry = ry > 0 ? Math.ceil(ry) : Math.floor(ry);
            item.target.$gearLocked = true;
            item.target.setXY(item.target.x - item.startValue.f1 + rx, item.target.y - item.startValue.f2 + ry);
            item.target.$gearLocked = false;
            item.startValue.f1 = rx;
            item.startValue.f2 = ry;
            item.startValue.f3 -= elapsedMS / 1000;
            if (item.startValue.f3 <= 0) {
                item.target.$gearLocked = true;
                item.target.setXY(item.target.x - item.startValue.f1, item.target.y - item.startValue.f2);
                item.target.$gearLocked = false;
                item.completed = true;
                this.$totalTasks--;
                fgui.GTimer.inst.remove(item.$shake, item);
                this.checkAllComplete();
            }
        };
        Transition.prototype.setup = function (xml) {
            var _this = this;
            this.name = xml.attributes.name;
            var str = xml.attributes.options;
            if (str)
                this.$options = parseInt(str);
            this.$autoPlay = xml.attributes.autoPlay == "true";
            if (this.$autoPlay) {
                str = xml.attributes.autoPlayRepeat;
                if (str)
                    this.autoPlayRepeat = parseInt(str);
                str = xml.attributes.autoPlayDelay;
                if (str)
                    this.autoPlayDelay = parseFloat(str);
            }
            var col = xml.children;
            col.forEach(function (cxml) {
                if (cxml.nodeName != "item")
                    return;
                var item = new TransitionItem();
                _this.$items.push(item);
                item.time = parseInt(cxml.attributes.time) / Transition.FRAME_RATE;
                item.targetId = cxml.attributes.target;
                str = cxml.attributes.type;
                switch (str) {
                    case "XY":
                        item.type = 0 /* XY */;
                        break;
                    case "Size":
                        item.type = 1 /* Size */;
                        break;
                    case "Scale":
                        item.type = 2 /* Scale */;
                        break;
                    case "Pivot":
                        item.type = 3 /* Pivot */;
                        break;
                    case "Alpha":
                        item.type = 4 /* Alpha */;
                        break;
                    case "Rotation":
                        item.type = 5 /* Rotation */;
                        break;
                    case "Color":
                        item.type = 6 /* Color */;
                        break;
                    case "Animation":
                        item.type = 7 /* Animation */;
                        break;
                    case "Visible":
                        item.type = 8 /* Visible */;
                        break;
                    case "Sound":
                        item.type = 9 /* Sound */;
                        break;
                    case "Transition":
                        item.type = 10 /* Transition */;
                        break;
                    case "Shake":
                        item.type = 11 /* Shake */;
                        break;
                    case "ColorFilter":
                        item.type = 12 /* ColorFilter */;
                        break;
                    case "Skew":
                        item.type = 13 /* Skew */;
                        break;
                    default:
                        item.type = 14 /* Unknown */;
                        break;
                }
                item.tween = cxml.attributes.tween == "true";
                item.label = cxml.attributes.label;
                if (item.tween) {
                    item.duration = parseInt(cxml.attributes.duration) / Transition.FRAME_RATE;
                    if (item.time + item.duration > _this.$maxTime)
                        _this.$maxTime = item.time + item.duration;
                    str = cxml.attributes.ease;
                    if (str)
                        item.easeType = fgui.ParseEaseType(str);
                    str = cxml.attributes.repeat;
                    if (str)
                        item.repeat = parseInt(str);
                    item.yoyo = cxml.attributes.yoyo == "true";
                    item.label2 = cxml.attributes.label2;
                    var v = cxml.attributes.endValue;
                    if (v) {
                        _this.decodeValue(item.type, cxml.attributes.startValue, item.startValue);
                        _this.decodeValue(item.type, v, item.endValue);
                    }
                    else {
                        item.tween = false;
                        _this.decodeValue(item.type, cxml.attributes.startValue, item.value);
                    }
                }
                else {
                    if (item.time > _this.$maxTime)
                        _this.$maxTime = item.time;
                    _this.decodeValue(item.type, cxml.attributes.value, item.value);
                }
            }, this);
        };
        Transition.prototype.decodeValue = function (type, str, value) {
            var arr;
            switch (type) {
                case 0 /* XY */:
                case 1 /* Size */:
                case 3 /* Pivot */:
                case 13 /* Skew */:
                    arr = str.split(",");
                    if (arr[0] == "-") {
                        value.b1 = false;
                    }
                    else {
                        value.f1 = parseFloat(arr[0]);
                        value.b1 = true;
                    }
                    if (arr[1] == "-") {
                        value.b2 = false;
                    }
                    else {
                        value.f2 = parseFloat(arr[1]);
                        value.b2 = true;
                    }
                    break;
                case 4 /* Alpha */:
                    value.f1 = parseFloat(str);
                    break;
                case 5 /* Rotation */:
                    value.i = parseInt(str);
                    break;
                case 2 /* Scale */:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    break;
                case 6 /* Color */:
                    value.c = fgui.utils.StringUtil.convertFromHtmlColor(str);
                    break;
                case 7 /* Animation */:
                    arr = str.split(",");
                    if (arr[0] == "-") {
                        value.b1 = false;
                    }
                    else {
                        value.i = parseInt(arr[0]);
                        value.b1 = true;
                    }
                    value.b = arr[1] == "p";
                    break;
                case 8 /* Visible */:
                    value.b = str == "true";
                    break;
                case 9 /* Sound */:
                    arr = str.split(",");
                    value.s = arr[0];
                    if (arr.length > 1) {
                        var intv = parseInt(arr[1]);
                        if (intv == 0 || intv == 100)
                            value.f1 = 1;
                        else
                            value.f1 = intv / 100;
                    }
                    else
                        value.f1 = 1;
                    break;
                case 10 /* Transition */:
                    arr = str.split(",");
                    value.s = arr[0];
                    if (arr.length > 1)
                        value.i = parseInt(arr[1]);
                    else
                        value.i = 1;
                    break;
                case 11 /* Shake */:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    break;
                case 12 /* ColorFilter */:
                    arr = str.split(",");
                    value.f1 = parseFloat(arr[0]);
                    value.f2 = parseFloat(arr[1]);
                    value.f3 = parseFloat(arr[2]);
                    value.f4 = parseFloat(arr[3]);
                    break;
            }
        };
        Transition.OPTION_IGNORE_DISPLAY_CONTROLLER = 1;
        Transition.OPTION_AUTO_STOP_DISABLED = 1 >> 1;
        Transition.OPTION_AUTO_STOP_AT_END = 1 >> 2;
        Transition.FRAME_RATE = 24;
        return Transition;
    }());
    fgui.Transition = Transition;
    var TransitionItem = (function () {
        function TransitionItem() {
            this.time = 0;
            this.type = 0;
            this.duration = 0;
            this.repeat = 0;
            this.yoyo = false;
            this.tween = false;
            this.tweenTimes = 0;
            this.completed = false;
            this.lockToken = 0;
            this.easeType = fgui.ParseEaseType("Quad.Out");
            this.value = new TransitionValue();
            this.startValue = new TransitionValue();
            this.endValue = new TransitionValue();
        }
        /**@internal */
        TransitionItem.prototype.$shake = function (trans, elapsedMS) {
            trans.$shakeItem(this, elapsedMS);
        };
        return TransitionItem;
    }());
    var TransitionValue = (function () {
        function TransitionValue() {
            this.f1 = 0;
            this.f2 = 0;
            this.f3 = 0;
            this.f4 = 0;
            this.i = 0;
            this.c = 0;
            this.b = false;
            this.b1 = true;
            this.b2 = true;
        }
        return TransitionValue;
    }());
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var Window = (function (_super) {
        __extends(Window, _super);
        function Window() {
            var _this = _super.call(this) || this;
            _this.$requestingCmd = 0;
            _this.focusable = true;
            _this.$uiSources = [];
            _this.bringToFrontOnClick = fgui.UIConfig.bringWindowToFrontOnClick;
            _this.on("added", _this.$onShown, _this);
            _this.on("removed", _this.$onHidden, _this);
            _this.on(fgui.InteractiveEvents.Down, _this.$mouseDown, _this);
            return _this;
        }
        Window.prototype.addUISource = function (source) {
            this.$uiSources.push(source);
        };
        Object.defineProperty(Window.prototype, "contentPane", {
            get: function () {
                return this.$contentPane;
            },
            set: function (val) {
                if (this.$contentPane != val) {
                    if (this.$contentPane != null)
                        this.removeChild(this.$contentPane);
                    this.$contentPane = val;
                    if (this.$contentPane != null) {
                        this.addChild(this.$contentPane);
                        this.setSize(this.$contentPane.width, this.$contentPane.height);
                        this.$contentPane.addRelation(this, 24 /* Size */);
                        this.$frame = this.$contentPane.getChild("frame");
                        if (this.$frame != null) {
                            this.closeButton = this.$frame.getChild("closeButton");
                            this.dragArea = this.$frame.getChild("dragArea");
                            this.contentArea = this.$frame.getChild("contentArea");
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "frame", {
            get: function () {
                return this.$frame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "closeButton", {
            get: function () {
                return this.$closeButton;
            },
            set: function (value) {
                if (this.$closeButton != null)
                    this.$closeButton.removeClick(this.closeEventHandler, this);
                this.$closeButton = value;
                if (this.$closeButton != null)
                    this.$closeButton.click(this.closeEventHandler, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "dragArea", {
            get: function () {
                return this.$dragArea;
            },
            set: function (value) {
                if (this.$dragArea != value) {
                    if (this.$dragArea != null) {
                        this.$dragArea.draggable = false;
                        this.$dragArea.off("__dragStart" /* START */, this.$dragStart, this);
                    }
                    this.$dragArea = value;
                    if (this.$dragArea != null) {
                        if (this.$dragArea instanceof fgui.GGraph)
                            this.$dragArea.drawRect(0, 0, 0, 0, 0);
                        this.$dragArea.draggable = true;
                        this.$dragArea.on("__dragStart" /* START */, this.$dragStart, this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "contentArea", {
            get: function () {
                return this.$contentArea;
            },
            set: function (value) {
                this.$contentArea = value;
            },
            enumerable: true,
            configurable: true
        });
        Window.prototype.show = function () {
            fgui.GRoot.inst.showWindow(this);
        };
        Window.prototype.showOn = function (root) {
            root.showWindow(this);
        };
        Window.prototype.hide = function () {
            if (this.isShowing)
                this.doHideAnimation();
        };
        Window.prototype.hideImmediately = function () {
            var r = (this.parent && this.parent instanceof fgui.GRoot) ? this.parent : fgui.GRoot.inst;
            r.hideWindowImmediately(this);
        };
        Window.prototype.centerOn = function (r, autoUpdate) {
            if (autoUpdate === void 0) { autoUpdate = false; }
            this.setXY(Math.round((r.width - this.width) * .5), Math.round((r.height - this.height) * .5));
            if (autoUpdate) {
                this.addRelation(r, 3 /* Center_Center */);
                this.addRelation(r, 10 /* Middle_Middle */);
            }
        };
        Window.prototype.toggleVisible = function () {
            if (this.isTop)
                this.hide();
            else
                this.show();
        };
        Object.defineProperty(Window.prototype, "isShowing", {
            get: function () {
                return this.parent != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "isTop", {
            get: function () {
                return this.parent != null && this.parent.getChildIndex(this) == this.parent.numChildren - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Window.prototype, "modal", {
            get: function () {
                return this.$modal;
            },
            set: function (val) {
                this.$modal = val;
            },
            enumerable: true,
            configurable: true
        });
        Window.prototype.bringToFront = function () {
            this.root.bringToFront(this);
        };
        Window.prototype.showModalWait = function (msg, cmd) {
            if (cmd === void 0) { cmd = 0; }
            if (cmd != 0)
                this.$requestingCmd = cmd;
            if (fgui.UIConfig.windowModalWaiting) {
                if (!this.$modalWaitPane)
                    this.$modalWaitPane = fgui.UIPackage.createObjectFromURL(fgui.UIConfig.windowModalWaiting);
                this.layoutModalWaitPane(msg);
                this.addChild(this.$modalWaitPane);
            }
        };
        Window.prototype.layoutModalWaitPane = function (msg) {
            if (this.$contentArea != null) {
                var pt = this.$frame.localToGlobal();
                pt = this.globalToLocal(pt.x, pt.y, pt);
                this.$modalWaitPane.setXY(pt.x + this.$contentArea.x, pt.y + this.$contentArea.y);
                this.$modalWaitPane.setSize(this.$contentArea.width, this.$contentArea.height);
                if (msg && msg.length)
                    this.$modalWaitPane.text = msg;
            }
            else
                this.$modalWaitPane.setSize(this.width, this.height);
        };
        Window.prototype.closeModalWait = function (cmd) {
            if (cmd === void 0) { cmd = 0; }
            if (cmd != 0) {
                if (this.$requestingCmd != cmd)
                    return false;
            }
            this.$requestingCmd = 0;
            if (this.$modalWaitPane && this.$modalWaitPane.parent != null)
                this.removeChild(this.$modalWaitPane);
            return true;
        };
        Object.defineProperty(Window.prototype, "modalWaiting", {
            get: function () {
                return this.$modalWaitPane && this.$modalWaitPane.parent != null;
            },
            enumerable: true,
            configurable: true
        });
        Window.prototype.init = function () {
            var _this = this;
            if (this.$inited || this.$loading)
                return;
            if (this.$uiSources.length > 0) {
                this.$loading = false;
                this.$uiSources.forEach(function (o) {
                    if (!o.loaded) {
                        o.load(_this.$uiLoadComplete, _this);
                        _this.$loading = true;
                    }
                }, this);
                if (!this.$loading)
                    this.$init();
            }
            else
                this.$init();
        };
        Window.prototype.onInit = function () {
        };
        Window.prototype.onShown = function () {
        };
        Window.prototype.onHide = function () {
        };
        Window.prototype.doShowAnimation = function () {
            this.onShown();
        };
        Window.prototype.doHideAnimation = function () {
            this.hideImmediately();
        };
        Window.prototype.$uiLoadComplete = function () {
            var cnt = this.$uiSources.length;
            for (var i = 0; i < cnt; i++) {
                if (!this.$uiSources[i].loaded)
                    return;
            }
            this.$loading = false;
            this.$init();
        };
        Window.prototype.$init = function () {
            this.$inited = true;
            this.onInit();
            if (this.isShowing)
                this.doShowAnimation();
        };
        Window.prototype.dispose = function () {
            this.off("added", this.$onShown, this);
            this.off("removed", this.$onHidden, this);
            this.off(fgui.InteractiveEvents.Down, this.$mouseDown, this);
            if (this.$dragArea)
                this.$dragArea.off("__dragStart" /* START */, this.$dragStart, this);
            if (this.parent != null)
                this.hideImmediately();
            if (this.$modalWaitPane)
                this.$modalWaitPane.dispose();
            if (this.$contentPane)
                this.$contentPane.dispose();
            _super.prototype.dispose.call(this);
        };
        Window.prototype.closeEventHandler = function (evt) {
            this.hide();
        };
        Window.prototype.$onShown = function (target) {
            if (!this.$inited)
                this.init();
            else
                this.doShowAnimation();
        };
        Window.prototype.$onHidden = function (target) {
            this.closeModalWait();
            this.onHide();
        };
        Window.prototype.$mouseDown = function (evt) {
            if (this.isShowing && this.bringToFrontOnClick)
                this.bringToFront();
        };
        Window.prototype.$dragStart = function (evt) {
            fgui.GObject.castFromNativeObject(evt.currentTarget).stopDrag();
            this.startDrag(evt.data.pointerID);
        };
        return Window;
    }(fgui.GComponent));
    fgui.Window = Window;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    /**global ui configuration */
    var UIConfig = (function () {
        function UIConfig() {
        }
        /**default font name of your project. */
        UIConfig.defaultFont = "Arial";
        /** modal layer background configuration. */
        UIConfig.modalLayerColor = 0x333333;
        UIConfig.modalLayerAlpha = 0.2;
        /** scrolling distance per action in pixel*/
        UIConfig.defaultScrollSpeed = 25;
        /** dragging speed ratio for scrollPane.*/
        UIConfig.defaultTouchScrollSpeedRatio = 1;
        /** default scrollbar display mode. It's recommended to set ScrollBarDisplayType.Visible for Desktop environment and ScrollBarDisplayType.Auto for mobile environment.*/
        UIConfig.defaultScrollBarDisplay = 1 /* Visible */;
        /** allow user to drag the content of a container. Set to true for mobile is recommended.*/
        UIConfig.defaultScrollTouchEffect = true;
        /** enable bounce effect when the scrolling reaches to the edge of a container. Set to true for mobile is recommended.*/
        UIConfig.defaultScrollBounceEffect = true;
        /** maximum count of items to be displayed in the visible viewport of the GCombobox.*/
        UIConfig.defaultComboBoxVisibleItemCount = 10;
        /** the finger moving threshold in pixel to trigger the scrolling action.*/
        UIConfig.touchScrollSensitivity = 20;
        /** the finger moving threshold in pixel to trigger the dragging event.*/
        UIConfig.touchDragSensitivity = 10;
        /** auto bring the window you clicked to the topmost level of the GRoot children list.*/
        UIConfig.bringWindowToFrontOnClick = true;
        return UIConfig;
    }());
    fgui.UIConfig = UIConfig;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var controller;
    (function (controller_1) {
        var Action = (function () {
            function Action() {
            }
            Action.create = function (type) {
                switch (type) {
                    case "play_transition":
                        return new controller_1.PlayTransitionAction();
                    case "change_page":
                        return new controller_1.ChangePageAction();
                }
                return null;
            };
            Action.prototype.execute = function (controller, prevPage, curPage) {
                if ((!this.fromPage || this.fromPage.length == 0 || this.fromPage.indexOf(prevPage) != -1)
                    && (!this.toPage || this.toPage.length == 0 || this.toPage.indexOf(curPage) != -1))
                    this.enter(controller);
                else
                    this.leave(controller);
            };
            Action.prototype.enter = function (controller) {
            };
            Action.prototype.leave = function (controller) {
            };
            Action.prototype.setup = function (xml) {
                var str;
                str = xml.attributes.fromPage;
                if (str)
                    this.fromPage = str.split(",");
                str = xml.attributes.toPage;
                if (str)
                    this.toPage = str.split(",");
            };
            return Action;
        }());
        controller_1.Action = Action;
    })(controller = fgui.controller || (fgui.controller = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var controller;
    (function (controller_2) {
        var ChangePageAction = (function (_super) {
            __extends(ChangePageAction, _super);
            function ChangePageAction() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ChangePageAction.prototype.enter = function (controller) {
                if (!this.controllerName)
                    return;
                var gcom;
                if (this.objectId)
                    gcom = controller.parent.getChildById(this.objectId);
                else
                    gcom = controller.parent;
                if (gcom) {
                    var cc = gcom.getController(this.controllerName);
                    if (cc && cc != controller && !cc.$updating)
                        cc.selectedPageId = this.targetPage;
                }
            };
            ChangePageAction.prototype.setup = function (xml) {
                _super.prototype.setup.call(this, xml);
                this.objectId = xml.attributes.objectId;
                this.controllerName = xml.attributes.controller;
                this.targetPage = xml.attributes.targetPage;
            };
            return ChangePageAction;
        }(controller_2.Action));
        controller_2.ChangePageAction = ChangePageAction;
    })(controller = fgui.controller || (fgui.controller = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var controller;
    (function (controller) {
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller() {
                var _this = _super.call(this) || this;
                _this.$selectedIndex = 0;
                _this.$previousIndex = 0;
                _this.$pageIds = [];
                _this.$pageNames = [];
                _this.$selectedIndex = -1;
                _this.$previousIndex = -1;
                return _this;
            }
            Object.defineProperty(Controller.prototype, "name", {
                get: function () {
                    return this.$name;
                },
                set: function (value) {
                    this.$name = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "parent", {
                get: function () {
                    return this.$parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "selectedIndex", {
                get: function () {
                    return this.$selectedIndex;
                },
                set: function (value) {
                    if (this.$selectedIndex != value) {
                        if (value > this.$pageIds.length - 1)
                            throw new Error("index out of range: " + value);
                        this.$updating = true;
                        this.$previousIndex = this.$selectedIndex;
                        this.$selectedIndex = value;
                        this.$parent.applyController(this);
                        this.emit("__stateChanged" /* CHANGED */, this);
                        this.$updating = false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            //same effect as selectedIndex but without event emitted
            Controller.prototype.setSelectedIndex = function (value) {
                if (value === void 0) { value = 0; }
                if (this.$selectedIndex != value) {
                    if (value > this.$pageIds.length - 1)
                        throw new Error("index out of range: " + value);
                    this.$updating = true;
                    this.$previousIndex = this.$selectedIndex;
                    this.$selectedIndex = value;
                    this.$parent.applyController(this);
                    this.$updating = false;
                }
            };
            Object.defineProperty(Controller.prototype, "previsousIndex", {
                get: function () {
                    return this.$previousIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "selectedPage", {
                get: function () {
                    if (this.$selectedIndex == -1)
                        return null;
                    else
                        return this.$pageNames[this.$selectedIndex];
                },
                set: function (val) {
                    this.selectedIndex = Math.max(0, this.$pageNames.indexOf(val));
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.setSelectedPage = function (value) {
                this.setSelectedIndex(Math.max(0, this.$pageNames.indexOf(value)));
            };
            Object.defineProperty(Controller.prototype, "previousPage", {
                get: function () {
                    if (this.$previousIndex == -1)
                        return null;
                    else
                        return this.$pageNames[this.$previousIndex];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "pageCount", {
                get: function () {
                    return this.$pageIds.length;
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.getPageName = function (index) {
                if (index === void 0) { index = 0; }
                return this.$pageNames[index];
            };
            Controller.prototype.addPage = function (name) {
                if (name === void 0) { name = ""; }
                this.addPageAt(name, this.$pageIds.length);
            };
            Controller.prototype.addPageAt = function (name, index) {
                if (index === void 0) { index = 0; }
                var nid = "" + Controller.$nextPageId++;
                if (index == this.$pageIds.length) {
                    this.$pageIds.push(nid);
                    this.$pageNames.push(name);
                }
                else {
                    this.$pageIds.splice(index, 0, nid);
                    this.$pageNames.splice(index, 0, name);
                }
            };
            Controller.prototype.removePage = function (name) {
                var i = this.$pageNames.indexOf(name);
                if (i != -1) {
                    this.$pageIds.splice(i, 1);
                    this.$pageNames.splice(i, 1);
                    if (this.$selectedIndex >= this.$pageIds.length)
                        this.selectedIndex = this.$selectedIndex - 1;
                    else
                        this.$parent.applyController(this);
                }
            };
            Controller.prototype.removePageAt = function (index) {
                if (index === void 0) { index = 0; }
                this.$pageIds.splice(index, 1);
                this.$pageNames.splice(index, 1);
                if (this.$selectedIndex >= this.$pageIds.length)
                    this.selectedIndex = this.$selectedIndex - 1;
                else
                    this.$parent.applyController(this);
            };
            Controller.prototype.clearPages = function () {
                this.$pageIds.length = 0;
                this.$pageNames.length = 0;
                if (this.$selectedIndex != -1)
                    this.selectedIndex = -1;
                else
                    this.$parent.applyController(this);
            };
            Controller.prototype.hasPage = function (aName) {
                return this.$pageNames.indexOf(aName) >= 0;
            };
            Controller.prototype.getPageIndexById = function (aId) {
                return this.$pageIds.indexOf(aId);
            };
            Controller.prototype.getPageIdByName = function (aName) {
                var i = this.$pageNames.indexOf(aName);
                if (i != -1)
                    return this.$pageIds[i];
                else
                    return null;
            };
            Controller.prototype.getPageNameById = function (aId) {
                var i = this.$pageIds.indexOf(aId);
                if (i != -1)
                    return this.$pageNames[i];
                else
                    return null;
            };
            Controller.prototype.getPageId = function (index) {
                if (index === void 0) { index = 0; }
                return this.$pageIds[index];
            };
            Object.defineProperty(Controller.prototype, "selectedPageId", {
                get: function () {
                    if (this.$selectedIndex == -1)
                        return null;
                    else
                        return this.$pageIds[this.$selectedIndex];
                },
                set: function (val) {
                    this.selectedIndex = this.$pageIds.indexOf(val);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "oppositePageId", {
                set: function (val) {
                    var i = this.$pageIds.indexOf(val);
                    if (i > 0)
                        this.selectedIndex = 0;
                    else if (this.$pageIds.length > 1)
                        this.selectedIndex = 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Controller.prototype, "previousPageId", {
                get: function () {
                    if (this.$previousIndex == -1)
                        return null;
                    else
                        return this.$pageIds[this.$previousIndex];
                },
                enumerable: true,
                configurable: true
            });
            Controller.prototype.executeActions = function () {
                var _this = this;
                if (this.$actions && this.$actions.length > 0) {
                    this.$actions.forEach(function (a) {
                        a.execute(_this, _this.previousPageId, _this.selectedPageId);
                    });
                }
            };
            Controller.prototype.setup = function (xml) {
                var _this = this;
                this.$name = xml.attributes.name;
                this.$autoRadioGroupDepth = xml.attributes.autoRadioGroupDepth == "true";
                var str = xml.attributes.pages;
                if (str) {
                    var arr = str.split(",");
                    var cnt = arr.length;
                    for (var i = 0; i < cnt; i += 2) {
                        this.$pageIds.push(arr[i]);
                        this.$pageNames.push(arr[i + 1]);
                    }
                }
                var col = xml.children;
                if (col.length > 0) {
                    this.$actions = this.$actions || [];
                    col.forEach(function (cxml) {
                        var action = controller.Action.create(cxml.attributes.type);
                        action.setup(cxml);
                        _this.$actions.push(action);
                    });
                }
                str = xml.attributes.transitions;
                if (str) {
                    this.$actions = this.$actions || [];
                    var k_1, e_1;
                    str.split(",").forEach(function (str) {
                        if (str && str.length) {
                            var pt = new controller.PlayTransitionAction();
                            k_1 = str.indexOf("=");
                            pt.transitionName = str.substr(k_1 + 1);
                            str = str.substring(0, k_1);
                            k_1 = str.indexOf("-");
                            e_1 = parseInt(str.substring(k_1 + 1));
                            if (e_1 < _this.$pageIds.length)
                                pt.toPage = [_this.$pageIds[e_1]];
                            str = str.substring(0, k_1);
                            if (str != "*") {
                                e_1 = parseInt(str);
                                if (e_1 < _this.$pageIds.length)
                                    pt.fromPage = [_this.$pageIds[e_1]];
                            }
                            pt.stopOnExit = true;
                            _this.$actions.push(pt);
                        }
                    });
                }
                if (this.$parent && this.$pageIds.length > 0)
                    this.$selectedIndex = 0;
                else
                    this.$selectedIndex = -1;
            };
            Controller.$nextPageId = 0;
            return Controller;
        }(PIXI.utils.EventEmitter));
        controller.Controller = Controller;
    })(controller = fgui.controller || (fgui.controller = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var controller;
    (function (controller) {
        var PageOption = (function () {
            function PageOption() {
            }
            Object.defineProperty(PageOption.prototype, "controller", {
                set: function (val) {
                    this.$controller = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageOption.prototype, "name", {
                get: function () {
                    if (this.$id)
                        return this.$controller.getPageNameById(this.$id);
                    else
                        return null;
                },
                set: function (pageName) {
                    this.$id = this.$controller.getPageIdByName(pageName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageOption.prototype, "index", {
                get: function () {
                    if (this.$id)
                        return this.$controller.getPageIndexById(this.$id);
                    else
                        return -1;
                },
                set: function (pageIndex) {
                    this.$id = this.$controller.getPageId(pageIndex);
                },
                enumerable: true,
                configurable: true
            });
            PageOption.prototype.clear = function () {
                this.$id = null;
            };
            Object.defineProperty(PageOption.prototype, "id", {
                get: function () {
                    return this.$id;
                },
                set: function (id) {
                    this.$id = id;
                },
                enumerable: true,
                configurable: true
            });
            return PageOption;
        }());
        controller.PageOption = PageOption;
    })(controller = fgui.controller || (fgui.controller = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var controller;
    (function (controller_3) {
        var PlayTransitionAction = (function (_super) {
            __extends(PlayTransitionAction, _super);
            function PlayTransitionAction() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.repeat = 1;
                _this.delay = 0;
                _this.stopOnExit = false;
                return _this;
            }
            PlayTransitionAction.prototype.enter = function (controller) {
                var trans = controller.parent.getTransition(this.transitionName);
                if (trans) {
                    if (this.$currentTransition && this.$currentTransition.playing)
                        trans.changeRepeat(this.repeat);
                    else
                        trans.play({
                            times: this.repeat,
                            delay: this.delay
                        });
                    this.$currentTransition = trans;
                }
            };
            PlayTransitionAction.prototype.leave = function (controller) {
                if (this.stopOnExit && this.$currentTransition) {
                    this.$currentTransition.stop();
                    this.$currentTransition = null;
                }
            };
            /**@internal */
            PlayTransitionAction.prototype.setup = function (xml) {
                _super.prototype.setup.call(this, xml);
                this.transitionName = xml.attributes.transition;
                var str;
                str = xml.attributes.repeat;
                if (str)
                    this.repeat = parseInt(str);
                str = xml.attributes.delay;
                if (str)
                    this.delay = parseFloat(str);
                this.stopOnExit = xml.attributes.stopOnExit == "true";
            };
            return PlayTransitionAction;
        }(controller_3.Action));
        controller_3.PlayTransitionAction = PlayTransitionAction;
    })(controller = fgui.controller || (fgui.controller = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var BitmapFont = (function () {
        function BitmapFont() {
            this.size = 0;
            this.glyphs = {};
        }
        return BitmapFont;
    }());
    fgui.BitmapFont = BitmapFont;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var BMGlyph = (function () {
        function BMGlyph() {
            this.x = 0;
            this.y = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.width = 0;
            this.height = 0;
            this.advance = 0;
            this.lineHeight = 0;
            this.channel = 0;
        }
        return BMGlyph;
    }());
    fgui.BMGlyph = BMGlyph;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    /**for webgl only */
    var FillSprite = (function (_super) {
        __extends(FillSprite, _super);
        function FillSprite(texture) {
            var _this = _super.call(this, texture) || this;
            _this._fillDir = 0 /* CW */; //for deg type only
            _this._flip = 0;
            _this._percent = 0;
            return _this;
        }
        Object.defineProperty(FillSprite.prototype, "flip", {
            get: function () {
                return this._flip;
            },
            set: function (v) {
                if (v != this._flip) {
                    this._flip = v;
                    //this.requiresUpdate = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FillSprite.prototype, "fillAmount", {
            get: function () {
                return typeof this._fillAmount == "number" ? this._fillAmount : 100;
            },
            set: function (n) {
                if (n != this._fillAmount) {
                    this._fillAmount = n;
                    //this.requiresUpdate = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FillSprite.prototype, "fillBegin", {
            get: function () {
                return this._fillBegin;
            },
            set: function (n) {
                if (n != this._fillBegin) {
                    this._fillBegin = n;
                    //this.requiresUpdate = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FillSprite.prototype, "fillMode", {
            get: function () {
                return this._fillMode;
            },
            set: function (n) {
                if (n != this._fillMode) {
                    this._fillMode = n;
                    this.checkAndFixFillBegin();
                    //this.requiresUpdate = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FillSprite.prototype, "fillDirection", {
            get: function () {
                return this._fillDir;
            },
            set: function (n) {
                if (n != this._fillDir) {
                    this._fillDir = n;
                    this.checkAndFixFillBegin();
                    //this.requiresUpdate = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        FillSprite.prototype.checkAndFixFillBegin = function () {
            switch (this._fillMode) {
                case 1 /* HORZ */:
                    if (this._fillBegin != 0 /* L */ && this._fillBegin != 1 /* R */)
                        this._fillBegin = 0 /* L */;
                    break;
                case 2 /* VERT */:
                    if (this._fillBegin != 2 /* T */ && this._fillBegin != 3 /* B */)
                        this._fillBegin = 2 /* T */;
                    break;
                case 3 /* DEG90 */:
                    if (this._fillBegin != 4 /* LT */ && this._fillBegin != 6 /* LB */
                        && this._fillBegin != 5 /* RT */ && this._fillBegin != 7 /* RB */)
                        this._fillBegin = 4 /* LT */;
                    break;
                case 4 /* DEG180 */:
                case 5 /* DEG360 */:
                    if (this._fillBegin != 0 /* L */ && this._fillBegin != 1 /* R */
                        && this._fillBegin != 2 /* T */ && this._fillBegin != 3 /* B */)
                        this._fillBegin = 2 /* T */;
                    break;
            }
        };
        Object.defineProperty(FillSprite.prototype, "amount", {
            get: function () {
                return this._percent;
            },
            set: function (v) {
                this._percent = v;
            },
            enumerable: true,
            configurable: true
        });
        return FillSprite;
    }(PIXI.Sprite));
    fgui.FillSprite = FillSprite;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var Frame = (function () {
        function Frame() {
            this.addDelay = 0;
        }
        return Frame;
    }());
    fgui.Frame = Frame;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var HTMLInput = (function () {
        function HTMLInput() {
            /**@internal */
            this.$requestToShow = false;
            /**@internal */
            this.$scaleX = 1;
            /**@internal */
            this.$scaleY = 1;
        }
        Object.defineProperty(HTMLInput, "inst", {
            get: function () {
                if (!HTMLInput.$instance)
                    HTMLInput.$instance = new HTMLInput();
                return HTMLInput.$instance;
            },
            enumerable: true,
            configurable: true
        });
        HTMLInput.prototype.initialize = function (container, view) {
            this.$canvas = view;
            var div;
            if (!this.$delegateDiv) {
                div = document.createElement("div");
                this.$delegateDiv = div;
                div.id = "__delegateDiv";
                container.appendChild(div);
                this.initDomPos(div);
                this.$wrapper = document.createElement("div");
                this.initDomPos(this.$wrapper);
                this.$wrapper.style.width = "0px";
                this.$wrapper.style.height = "0px";
                this.$wrapper.style.left = "0px";
                this.$wrapper.style.top = "-100px";
                this.setTransform(this.$wrapper, "0% 0% 0px");
                div.appendChild(this.$wrapper);
                fgui.GRoot.inst.on(fgui.InteractiveEvents.Click, this.canvasClickHandler, this);
                this.initInputElement(true); //input
                this.initInputElement(false); //textarea
            }
        };
        HTMLInput.prototype.isInputOn = function () {
            return this.$input != null;
        };
        HTMLInput.prototype.canvasClickHandler = function (e) {
            if (this.$requestToShow) {
                this.$requestToShow = false;
                this.$input.onClickHandler(e);
                this.show();
            }
            else {
                if (this.$curEle) {
                    this.clearInputElement();
                    this.$curEle.blur();
                    this.$curEle = null;
                }
            }
        };
        HTMLInput.prototype.isInputShown = function () {
            return this.$input != null;
        };
        HTMLInput.prototype.isCurrentInput = function (input) {
            return this.$input == input;
        };
        HTMLInput.prototype.initDomPos = function (dom) {
            dom.style.position = "absolute";
            dom.style.left = "0px";
            dom.style.top = "0px";
            dom.style.border = "none";
            dom.style.padding = "0";
        };
        HTMLInput.prototype.setTransform = function (el, origin, transform) {
            var style = el.style;
            style.transformOrigin = style.webkitTransformOrigin = style.msTransformOrigin = style.mozTransformOrigin = style.oTransformOrigin = origin;
            if (transform && transform.length > 0)
                style.transform = style.webkitTransform = style.msTransform = style.mozTransform = style.oTransform = transform;
        };
        /**@internal */
        HTMLInput.prototype.$updateSize = function (sx, sy) {
            if (!this.$canvas)
                return;
            this.$scaleX = sx;
            this.$scaleY = sy;
            this.$delegateDiv.style.left = this.$canvas.style.left;
            this.$delegateDiv.style.top = this.$canvas.style.top;
            var cvsStyle = this.$canvas.style;
            this.setTransform(this.$delegateDiv, "0% 0% 0px", cvsStyle.transform || cvsStyle.webkitTransform || cvsStyle.msTransform || cvsStyle.mozTransform || cvsStyle.oTransform);
        };
        HTMLInput.prototype.initInputElement = function (multiline) {
            var _this = this;
            var inputElement;
            if (multiline) {
                inputElement = document.createElement("textarea");
                inputElement.style.resize = "none";
                this.$multiLine = inputElement;
                inputElement.id = "stageTextAreaEle";
            }
            else {
                inputElement = document.createElement("input");
                this.$singleLine = inputElement;
                inputElement.type = "text";
                inputElement.id = "stageInputEle";
            }
            this.$wrapper.appendChild(inputElement);
            inputElement.setAttribute("tabindex", "-1");
            inputElement.style.width = "1px";
            inputElement.style.height = "12px";
            this.initDomPos(inputElement);
            var style = inputElement.style;
            style.outline = "thin";
            style.background = "none";
            style.overflow = "hidden";
            style.wordBreak = "break-all";
            style.opacity = 0;
            inputElement.oninput = function (e) {
                if (_this.$input)
                    _this.$input.onInputHandler();
            };
        };
        HTMLInput.prototype.show = function () {
            var _this = this;
            fgui.GTimer.inst.callLater(function () {
                _this.$curEle.style.opacity = "1";
            }, this);
        };
        HTMLInput.prototype.disconnect = function (ele) {
            if (this.$input == null || this.$input == ele) {
                this.clearInputElement();
                if (this.$curEle)
                    this.$curEle.blur();
            }
        };
        HTMLInput.prototype.clearAttributes = function (obj) {
            if (this.$curEle) {
                for (var key in obj) {
                    this.$curEle.removeAttribute(key);
                }
            }
        };
        HTMLInput.prototype.clearInputElement = function () {
            if (this.$curEle) {
                this.$curEle.value = "";
                this.$curEle.onblur = null;
                var style = this.$curEle.style;
                style.width = "1px";
                style.height = "12px";
                style.left = "0px";
                style.top = "0px";
                style.opacity = "0";
                var el2 = void 0;
                if (this.$singleLine == this.$curEle)
                    el2 = this.$multiLine;
                else
                    el2 = this.$singleLine;
                el2.style.display = "block";
                this.$wrapper.style.left = "0px";
                this.$wrapper.style.top = "-100px";
                this.$wrapper.style.height = "0px";
                this.$wrapper.style.width = "0px";
            }
            if (this.$input) {
                this.$input.onDisconnect();
                this.$input = null;
                HTMLInput.isTyping = false;
            }
        };
        HTMLInput.prototype.requestInput = function (ele) {
            this.clearInputElement();
            this.$input = ele;
            HTMLInput.isTyping = true;
            var el2;
            if (this.$input.textField.multipleLine) {
                this.$curEle = this.$multiLine;
                el2 = this.$singleLine;
            }
            else {
                this.$curEle = this.$singleLine;
                el2 = this.$multiLine;
            }
            el2.style.display = "none";
            return this.$curEle;
        };
        HTMLInput.isTyping = false;
        return HTMLInput;
    }());
    fgui.HTMLInput = HTMLInput;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var InputElement = (function (_super) {
        __extends(InputElement, _super);
        function InputElement(tf) {
            var _this = _super.call(this) || this;
            _this.$requestToShow = false;
            //private $requestToHide:boolean = false;
            _this.inputElement = null;
            _this.inputDiv = null;
            _this.$scaleX = 0;
            _this.$scaleY = 0;
            _this.textValue = "";
            _this.colorValue = 0xffffff;
            _this.$attrsCache = {};
            _this.$textfield = tf;
            return _this;
        }
        /**@internal */
        InputElement.prototype.$addToStage = function () {
            this.htmlInput = fgui.HTMLInput.inst; //take multiple canvas on webpage into account?
        };
        InputElement.prototype.initElement = function () {
            var point = this.$textfield.localToGlobal(0, 0);
            var x = point.x;
            var y = point.y;
            var scaleX = this.htmlInput.$scaleX;
            var scaleY = this.htmlInput.$scaleY;
            if (!this.$textfield.multipleLine)
                this.inputElement.style.top = (-this.$textfield.leading * scaleY) + "px";
            this.inputDiv.style.top = (y + 1) * scaleY + "px";
            this.inputDiv.style.left = x * scaleX + "px";
            var node = this.$textfield;
            var cX = 1;
            var cY = 1;
            var rotation = 0;
            while (node.parent) {
                cX *= node.scaleX;
                cY *= node.scaleY;
                rotation += node.rotation;
                node = node.parent;
            }
            var style = this.inputDiv.style;
            style.transform = style.webkitTransform = style.msTransform = style.mozTransform = style.oTransform = "rotate(" + rotation + "deg)";
            this.$scaleX = scaleX * cX;
            this.$scaleY = scaleY * cY;
        };
        Object.defineProperty(InputElement.prototype, "textField", {
            get: function () {
                return this.$textfield;
            },
            enumerable: true,
            configurable: true
        });
        /**@internal */
        InputElement.prototype.$show = function () {
            if (!this.htmlInput.isCurrentInput(this)) {
                this.inputElement = this.htmlInput.requestInput(this);
                if (!this.$textfield.multipleLine)
                    this.inputElement.type = this.$textfield.type;
                for (var key in this.$attrsCache)
                    this.inputElement.setAttribute(key, this.$attrsCache[key]);
                this.inputDiv = this.htmlInput.$wrapper;
            }
            else
                this.inputElement.onblur = null;
            this.htmlInput.$requestToShow = true;
            this.$requestToShow = true;
            this.initElement();
        };
        InputElement.prototype.onBlurHandler = function () {
            this.htmlInput.clearInputElement();
            this.htmlInput.clearAttributes(this.$attrsCache);
            window.scrollTo(0, 0);
        };
        /**@internal */
        InputElement.prototype.$hide = function () {
            /*this.$requestToHide = true;
            if (this.htmlInput && PIXI.utils.isMobile && iOS) {  //if os is ios need to clearInput once
                this.htmlInput.disconnect(this);
            }*/
        };
        Object.defineProperty(InputElement.prototype, "text", {
            get: function () {
                if (!this.textValue)
                    this.textValue = "";
                return this.textValue;
            },
            set: function (value) {
                this.textValue = value;
                if (this.inputElement)
                    this.inputElement.value = this.textValue;
            },
            enumerable: true,
            configurable: true
        });
        InputElement.prototype.setColor = function (value) {
            this.colorValue = value;
            if (this.inputElement)
                this.setElementStyle("color", fgui.utils.StringUtil.convertToHtmlColor(this.colorValue));
        };
        /**@internal */
        InputElement.prototype.$onBlur = function () {
            //this.emit("updateText");
        };
        InputElement.prototype.onInputHandler = function () {
            var _this = this;
            window.setTimeout(function () {
                if (_this.inputElement && _this.inputElement.selectionStart == _this.inputElement.selectionEnd) {
                    _this.textValue = _this.inputElement.value;
                    _this.emit("updateText");
                }
            }, 0);
        };
        InputElement.prototype.setAreaHeight = function () {
            var tf = this.$textfield;
            if (tf.multipleLine) {
                var textheight = tf.textHeight;
                if (tf.height <= tf.fontSize) {
                    this.setElementStyle("height", tf.fontSize * this.$scaleY + "px");
                    this.setElementStyle("padding", "0px");
                    this.setElementStyle("lineHeight", tf.lineHeight * this.$scaleY + "px");
                }
                else if (tf.height < textheight) {
                    this.setElementStyle("height", (tf.height) * this.$scaleY + "px");
                    this.setElementStyle("padding", "0px");
                    this.setElementStyle("lineHeight", tf.lineHeight * this.$scaleY + "px");
                }
                else {
                    this.setElementStyle("height", (textheight + tf.leading) * this.$scaleY + "px");
                    var rap = (tf.height - textheight) * this.$scaleY;
                    var valign = this.getVAlignFactor(tf);
                    var top_2 = rap * valign;
                    var bottom = rap - top_2;
                    this.setElementStyle("padding", top_2 + "px 0px " + bottom + "px 0px");
                    this.setElementStyle("lineHeight", tf.lineHeight * this.$scaleY + "px");
                }
            }
        };
        InputElement.prototype.getVAlignFactor = function (textfield) {
            var vao = 0;
            switch (textfield.verticalAlign) {
                case 0 /* Top */:
                    break;
                case 1 /* Middle */:
                    vao = .5;
                    break;
                case 2 /* Bottom */:
                    vao = 1;
                    break;
            }
            return vao;
        };
        InputElement.prototype.onClickHandler = function (e) {
            if (this.$requestToShow) {
                //e.stopImmediatePropagation();
                this.$requestToShow = false;
                this.inputElement.value = this.text;
                if (this.inputElement.onblur == null)
                    this.inputElement.onblur = fgui.utils.Binder.create(this.onBlurHandler, this);
                this.resetInput();
                if (this.$textfield.maxLength > 0)
                    this.inputElement.setAttribute("maxlength", String(this.$textfield.maxLength));
                else
                    this.inputElement.removeAttribute("maxlength");
                this.inputElement.selectionStart = this.inputElement.value.length;
                this.inputElement.selectionEnd = this.inputElement.value.length;
                this.inputElement.focus();
                this.emit("__focusChanged" /* CHANGED */, "focus", this.inputElement);
            }
        };
        InputElement.prototype.onDisconnect = function () {
            this.inputElement = null;
            this.emit("__focusChanged" /* CHANGED */, "blur", this.inputElement);
        };
        InputElement.prototype.setElementStyle = function (style, value) {
            if (value == null)
                return;
            if (this.inputElement) {
                var ss = this.inputElement.style;
                ss[style] = value;
            }
        };
        InputElement.prototype.setAttribute = function (name, value) {
            if (name == null || value == null)
                return;
            this.$attrsCache[name] = value;
        };
        InputElement.prototype.getAttribute = function (name) {
            return this.$attrsCache[name];
        };
        /**@internal */
        InputElement.prototype.$removeFromStage = function () {
            if (this.inputElement)
                this.htmlInput.disconnect(this);
        };
        InputElement.prototype.resetInput = function () {
            if (this.inputElement) {
                var textfield = this.$textfield;
                this.setElementStyle("fontFamily", textfield.font);
                this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                this.setElementStyle("textAlign", textfield.align);
                this.setElementStyle("fontSize", textfield.fontSize * this.$scaleY + "px");
                this.setElementStyle("color", fgui.utils.StringUtil.convertToHtmlColor(textfield.color));
                this.setElementStyle("width", textfield.width * this.$scaleX + "px"); //take 'maxWidth' into account
                var va = "middle", vao = 0;
                switch (textfield.verticalAlign) {
                    case 0 /* Top */:
                        va = "top";
                        break;
                    case 1 /* Middle */:
                        va = "middle";
                        vao = .5;
                        break;
                    case 2 /* Bottom */:
                        va = "bottom";
                        vao = 1;
                        break;
                }
                this.setElementStyle("verticalAlign", va);
                if (textfield.multipleLine)
                    this.setAreaHeight();
                else {
                    this.setElementStyle("lineHeight", textfield.lineHeight * this.$scaleY + "px");
                    if (textfield.height < textfield.fontSize) {
                        this.setElementStyle("height", textfield.fontSize * this.$scaleY + "px");
                        this.setElementStyle("padding", "0px 0px " + (textfield.fontSize * .5 * this.$scaleX) + "px 0px");
                    }
                    else {
                        this.setElementStyle("height", textfield.fontSize * this.$scaleY + "px");
                        var rap = (textfield.height - textfield.fontSize) * this.$scaleY;
                        var top_3 = rap * vao;
                        var bottom = rap - top_3, fsy = textfield.fontSize * .5 * this.$scaleY;
                        if (bottom < fsy)
                            bottom = fsy;
                        this.setElementStyle("padding", top_3 + "px 0px " + bottom + "px 0px");
                    }
                }
                this.inputDiv.style.clip = "rect(0px " + (textfield.width * this.$scaleX) + "px " + (textfield.height * this.$scaleY) + "px 0px)";
                this.inputDiv.style.height = textfield.height * this.$scaleY + "px";
                this.inputDiv.style.width = textfield.width * this.$scaleX + "px"; //take 'maxWidth' into account
            }
        };
        return InputElement;
    }(PIXI.utils.EventEmitter));
    fgui.InputElement = InputElement;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    fgui.isUIObject = function (obj) {
        return obj && "UIOwner" in obj && obj.UIOwner != null;
    };
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    ;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(owner) {
            var _this = _super.call(this) || this;
            _this.interval = 0;
            _this.repeatDelay = 0;
            _this.$frameCount = 0;
            _this.$currentFrame = 0;
            _this.$status = 0 /* NORMAL */;
            _this.UIOwner = owner;
            _this.data = new fgui.MovieClipData();
            _this.$playing = true;
            _this.interactive = _this.interactiveChildren = false;
            _this.$settings = new fgui.DefaultMovieClipSettings();
            _this.on("added", _this.added, _this);
            _this.on("removed", _this.removed, _this);
            return _this;
        }
        Object.defineProperty(MovieClip.prototype, "frames", {
            get: function () {
                return this.$frames;
            },
            set: function (value) {
                this.$frames = value;
                if (this.$frames != null)
                    this.$frameCount = this.$frames.length;
                else
                    this.$frameCount = 0;
                if (this.$settings.endFrame == -1 || this.$settings.endFrame > this.$frameCount - 1)
                    this.$settings.endFrame = this.$frameCount - 1;
                if (this.$settings.loopEndAt == -1 || this.$settings.loopEndAt > this.$frameCount - 1)
                    this.$settings.loopEndAt = this.$frameCount - 1;
                if (this.$currentFrame < 0 || this.$currentFrame > this.$frameCount - 1)
                    this.$currentFrame = this.$frameCount - 1;
                if (this.$frameCount > 0)
                    this.setFrame(this.$frames[this.$currentFrame]);
                else
                    this.setFrame(null);
                this.data.rewind();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "frameCount", {
            get: function () {
                return this.$frameCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "boundsRect", {
            get: function () {
                return this._boundsRect;
            },
            set: function (value) {
                this._boundsRect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "currentFrame", {
            get: function () {
                return this.$currentFrame;
            },
            set: function (value) {
                if (this.$currentFrame != value) {
                    this.$currentFrame = value;
                    this.data.currentFrame = value;
                    this.setFrame(this.$currentFrame < this.$frameCount ? this.$frames[this.$currentFrame] : null);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "playing", {
            get: function () {
                return this.$playing;
            },
            set: function (value) {
                this.$playing = value;
                if (value && fgui.GObject.isDisplayObjectOnStage(this))
                    fgui.GTimer.inst.add(0, 0, this.update, this);
                else
                    fgui.GTimer.inst.remove(this.update, this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Modify the playing settings for the current MovieClip object, there are two ways to call this method:
         * 1) pass whole parameters:
                startFrame: number;
                endFrame: number;
                repeatCount: number;
                loopEndAt: number;
                endCallback: (target?: MovieClip) => void;
                endCallbackContext: any;
         * 2) just pass 1 object which implements MovieClipSettings (recommended)
         */
        MovieClip.prototype.setPlaySettings = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length == 1 && typeof args[0] == "object")
                this.$settings.mix(args[0]);
            else {
                var s = args[0], e = args[1], r = args[2], l = args[3], ec = args[4], ecc = args[5];
                var o = {};
                if (fgui.utils.NumberUtil.isNumber(s))
                    o.startFrame = s;
                if (fgui.utils.NumberUtil.isNumber(e))
                    o.endFrame = e;
                if (fgui.utils.NumberUtil.isNumber(r))
                    o.repeatCount = r;
                if (fgui.utils.NumberUtil.isNumber(l))
                    o.loopEndAt = l;
                if (ec && typeof (ec) == "function")
                    o.endCallback = ec;
                if (ecc)
                    o.endCallbackContext = ecc;
                this.$settings.mix(o);
            }
            if (this.$settings.endFrame == -1 || this.$settings.endFrame > this.$frameCount - 1)
                this.$settings.endFrame = this.$frameCount - 1;
            if (this.$settings.loopEndAt == -1)
                this.$settings.loopEndAt = this.$settings.endFrame;
            this.$status = 0 /* NORMAL */;
            this.currentFrame = this.$settings.startFrame;
        };
        MovieClip.prototype.update = function () {
            if (this.UIOwner.$inProgressBuilding)
                return;
            if (this.$playing && this.$frameCount != 0 && this.$status != 3 /* ENDED */) {
                this.data.update(this);
                if (this.$currentFrame != this.data.currentFrame) {
                    if (this.$status == 1 /* LOOPING */) {
                        this.$currentFrame = this.$settings.startFrame;
                        this.data.currentFrame = this.$currentFrame;
                        this.$status = 0 /* NORMAL */;
                    }
                    else if (this.$status == 2 /* STOPPING */) {
                        this.$currentFrame = this.$settings.loopEndAt;
                        this.data.currentFrame = this.$currentFrame;
                        this.$status = 3 /* ENDED */;
                        //play end
                        if (this.$settings.endCallback != null)
                            fgui.GTimer.inst.callLater(this.$playEnd, this);
                    }
                    else {
                        this.$currentFrame = this.data.currentFrame;
                        if (this.$currentFrame == this.$settings.endFrame) {
                            if (this.$settings.repeatCount > 0) {
                                this.$settings.repeatCount--;
                                if (this.$settings.repeatCount == 0)
                                    this.$status = 2 /* STOPPING */;
                                else
                                    this.$status = 1 /* LOOPING */;
                            }
                        }
                    }
                    this.setFrame(this.$frames[this.$currentFrame]);
                }
            }
        };
        MovieClip.prototype.$playEnd = function () {
            if (this.$settings.endCallback != null) {
                var f = this.$settings.endCallback;
                var fObj = this.$settings.endCallbackContext;
                this.$settings.endCallback = this.$settings.endCallbackContext = null;
                this.$settings.endCallbackContext = null;
                if (f)
                    f.call(fObj, this);
            }
        };
        MovieClip.prototype.setFrame = function (frame) {
            this._texture = frame == null ? null : frame.texture;
            this._textureID = -1;
        };
        MovieClip.prototype.added = function (disp) {
            if (this.$playing)
                fgui.GTimer.inst.add(0, 0, this.update, this);
        };
        MovieClip.prototype.removed = function (disp) {
            if (this.$playing)
                fgui.GTimer.inst.remove(this.update, this);
        };
        MovieClip.prototype.destroy = function () {
            fgui.GTimer.inst.remove(this.update, this);
            this.off("added", this.added, this);
            this.off("removed", this.removed, this);
            _super.prototype.destroy.call(this);
        };
        return MovieClip;
    }(PIXI.Sprite));
    fgui.MovieClip = MovieClip;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var MovieClipData = (function () {
        function MovieClipData() {
            this.repeatedCount = 0;
            this.$curFrame = 0;
            this.$lastTime = 0;
            this.$curFrameDelay = 0;
            this.$lastTime = Date.now();
        }
        MovieClipData.prototype.update = function (mc) {
            var t = Date.now();
            var elapsed = t - this.$lastTime;
            this.$lastTime = t;
            var cur = this.$curFrame;
            if (cur >= mc.frameCount)
                cur = mc.frameCount - 1;
            this.reachesEnd = false;
            this.$curFrameDelay += elapsed;
            var interval = mc.interval + mc.frames[cur].addDelay
                + ((cur == 0 && this.repeatedCount > 0) ? mc.repeatDelay : 0);
            if (this.$curFrameDelay < interval)
                return;
            this.$curFrameDelay -= interval;
            if (this.$curFrameDelay > mc.interval)
                this.$curFrameDelay = mc.interval;
            if (mc.swing) {
                if (this.reversed) {
                    this.$curFrame--;
                    if (this.$curFrame < 0) {
                        this.$curFrame = Math.min(1, mc.frameCount - 1);
                        this.repeatedCount++;
                        this.reversed = !this.reversed;
                    }
                }
                else {
                    this.$curFrame++;
                    if (this.$curFrame > mc.frameCount - 1) {
                        this.$curFrame = Math.max(0, mc.frameCount - 2);
                        this.repeatedCount++;
                        this.reachesEnd = true;
                        this.reversed = !this.reversed;
                    }
                }
            }
            else {
                this.$curFrame++;
                if (this.$curFrame > mc.frameCount - 1) {
                    this.$curFrame = 0;
                    this.repeatedCount++;
                    this.reachesEnd = true;
                }
            }
        };
        Object.defineProperty(MovieClipData.prototype, "currentFrame", {
            get: function () {
                return this.$curFrame;
            },
            set: function (value) {
                this.$curFrame = value;
                this.$curFrameDelay = 0;
            },
            enumerable: true,
            configurable: true
        });
        MovieClipData.prototype.rewind = function () {
            this.$curFrame = 0;
            this.$curFrameDelay = 0;
            this.reversed = false;
            this.reachesEnd = false;
        };
        MovieClipData.prototype.reset = function () {
            this.$curFrame = 0;
            this.$curFrameDelay = 0;
            this.repeatedCount = 0;
            this.reachesEnd = false;
            this.reversed = false;
        };
        MovieClipData.prototype.copy = function (src) {
            this.$curFrame = src.$curFrame;
            this.$curFrameDelay = src.$curFrameDelay;
            this.repeatedCount = src.repeatedCount;
            this.reachesEnd = src.reachesEnd;
            this.reversed = src.reversed;
        };
        return MovieClipData;
    }());
    fgui.MovieClipData = MovieClipData;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var DefaultMovieClipSettings = (function () {
        function DefaultMovieClipSettings() {
            /**the first frame number to start to play */
            this.startFrame = 0;
            /**the end frame the playing will end at, -1 means to the tail */
            this.endFrame = -1;
            /**play count, 0 means endeless */
            this.repeatCount = 0;
            /**once the repeated playing completes, the playing will end at, -1 means to the tail */
            this.loopEndAt = -1;
            /**complete callback handler */
            this.endCallback = null;
            /**context object for the callback function */
            this.endCallbackContext = null;
        }
        /**modify the current settings without whole parameters provided */
        DefaultMovieClipSettings.prototype.mix = function (other) {
            var ret = this;
            for (var key in other) {
                if (key == "mix")
                    continue;
                ret[key] = other[key];
            }
            return this;
        };
        return DefaultMovieClipSettings;
    }());
    fgui.DefaultMovieClipSettings = DefaultMovieClipSettings;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var UIContainer = (function (_super) {
        __extends(UIContainer, _super);
        function UIContainer(owner) {
            var _this = _super.call(this) || this;
            _this.UIOwner = owner;
            _this.interactive = true;
            _this.interactiveChildren = true;
            return _this;
        }
        Object.defineProperty(UIContainer.prototype, "scrollRect", {
            get: function () {
                return this.$scrollRect;
            },
            set: function (rect) {
                this.$scrollRect = rect;
                if (rect != null) {
                    if (!this.$rectMask) {
                        this.$rectMask = new PIXI.Graphics();
                        this.$rectMask.isMask = true;
                        this.addChild(this.$rectMask);
                        this.mask = this.$rectMask;
                    }
                    this.$rectMask.clear();
                    if (rect.width > 0 && rect.height > 0) {
                        this.$rectMask.beginFill(0x0, 1);
                        this.$rectMask.drawRect(this.$scrollRect.x, this.$scrollRect.y, this.$scrollRect.width, this.$scrollRect.height);
                        this.$rectMask.endFill();
                    }
                }
                else
                    this.mask = null;
            },
            enumerable: true,
            configurable: true
        });
        return UIContainer;
    }(PIXI.Container));
    fgui.UIContainer = UIContainer;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var UIImage = (function (_super) {
        __extends(UIImage, _super);
        function UIImage(owner) {
            var _this = _super.call(this) || this;
            _this.UIOwner = owner;
            _this.interactive = _this.interactiveChildren = false;
            return _this;
        }
        /**@internal */
        UIImage.prototype.$initDisp = function (item) {
            if (this.$disp)
                return;
            if (item) {
                item.load();
                if (item.scaleByTile) {
                    var ts = new PIXI.extras.TilingSprite(item.texture);
                    this.$disp = ts;
                }
                else if (item.scale9Grid) {
                    this.$disp = new PIXI.mesh.NineSlicePlane(item.texture);
                    this.scale9Grid = item.scale9Grid;
                    this.tiledSlices = item.tiledSlices;
                }
                else
                    this.$disp = new PIXI.Sprite(item.texture);
            }
            else
                this.$disp = new PIXI.Sprite();
            this.addChild(this.$disp);
        };
        Object.defineProperty(UIImage.prototype, "tint", {
            get: function () {
                return this.$disp.tint;
            },
            set: function (v) {
                this.$disp.tint = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIImage.prototype, "height", {
            get: function () {
                return this.$disp.height;
            },
            set: function (v) {
                this.$disp.height = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIImage.prototype, "width", {
            get: function () {
                return this.$disp.width;
            },
            set: function (v) {
                this.$disp.width = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIImage.prototype, "texture", {
            get: function () {
                return this.$disp.texture;
            },
            set: function (v) {
                //need to reset first?
                /*if (this.$disp instanceof PIXI.extras.TilingSprite) {
                    this.$disp.tileScale.set(1, 1);
                    this.$disp.tilePosition.set(0, 0);
                }
                else if (this.$disp instanceof PIXI.mesh.NineSlicePlane)
                    this.$disp.leftWidth = this.$disp.topHeight = this.$disp.rightWidth = this.$disp.bottomHeight = 0;
                */
                this.$disp.texture = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIImage.prototype, "scale9Grid", {
            get: function () {
                if (this.$disp instanceof PIXI.mesh.NineSlicePlane)
                    return this.$scale9Rect;
                return null;
            },
            set: function (v) {
                if (this.$disp instanceof PIXI.mesh.NineSlicePlane) {
                    this.$scale9Rect = v;
                    this.$disp.leftWidth = v.x;
                    this.$disp.topHeight = v.y;
                    this.$disp.rightWidth = Math.max(0, this.$disp.width - v.width - v.x);
                    this.$disp.bottomHeight = Math.max(0, this.$disp.height - v.height - v.y);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIImage.prototype, "tiledSlices", {
            get: function () {
                return 0;
            },
            set: function (flags) {
                //not support
            },
            enumerable: true,
            configurable: true
        });
        UIImage.prototype.destroy = function (options) {
            this.$scale9Rect = null;
            if (this.$disp) {
                this.$disp.destroy(options);
                this.$disp = null;
            }
            _super.prototype.destroy.call(this, options);
        };
        return UIImage;
    }(PIXI.Container));
    fgui.UIImage = UIImage;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var UISprite = (function (_super) {
        __extends(UISprite, _super);
        function UISprite(owner) {
            var _this = _super.call(this) || this;
            _this.UIOwner = owner;
            _this.interactive = false;
            _this.interactiveChildren = false;
            return _this;
        }
        return UISprite;
    }(PIXI.Graphics));
    fgui.UISprite = UISprite;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var DefaultUIStageOptions = (function () {
        function DefaultUIStageOptions() {
            this.scaleMode = "showAll" /* SHOW_ALL */;
            this.orientation = "auto" /* AUTO */;
            this.resolution = 1;
            this.designWidth = 800;
            this.designHeight = 600;
            this.alignV = 4 /* MIDDLE */;
            this.alignH = 1 /* CENTER */;
            this.fallbackWidth = 0;
            this.fallbackHeight = 0;
        }
        return DefaultUIStageOptions;
    }());
    fgui.DefaultUIStageOptions = DefaultUIStageOptions;
    var DefaultBoudingRectCalculator = (function () {
        function DefaultBoudingRectCalculator() {
        }
        DefaultBoudingRectCalculator.prototype.getRect = function (view, fallbackWidth, fallbackHeight) {
            var p = view.parentElement;
            if (!p)
                //this should be impossible situation unless the user forget to append the view into the DOM.
                throw new Error("Your view of PIXI are still in memory but not appended to DOM yet? it's necessary that there is a parent element to wrap your view up.");
            var rect = p.getBoundingClientRect();
            var ret = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            if (!rect || rect.width <= 0 || rect.height <= 0) {
                console.warn("It seems that you did not set a explicit size for the parent element of your view, now fall back to window size instead.");
                ret.width = window.innerWidth;
                ret.height = window.innerHeight;
                ret.x = 0;
                ret.y = 0;
            }
            else {
                ret.x = rect.left;
                ret.y = rect.top;
                ret.width = rect.width;
                ret.height = rect.height;
            }
            //consider the worst situation: window does not have size!!
            if (ret.width <= 0 || ret.height <= 0) {
                console.warn("fetch container size to initialize PIXI in all ways have failed, now use default size (fallbackWidth / fallbackHeight) specified in the options instead.");
                ret.width = fallbackWidth;
                ret.height = fallbackHeight;
            }
            return ret;
        };
        return DefaultBoudingRectCalculator;
    }());
    var UIStage = (function (_super) {
        __extends(UIStage, _super);
        function UIStage(app, stageOptions) {
            var _this = _super.call(this) || this;
            _this.$width = 0;
            _this.$height = 0;
            _this.$scaleX = 1;
            _this.$scaleY = 1;
            _this.$canvasMatrix = new PIXI.Matrix();
            _this.offsetX = 0;
            _this.offsetY = 0;
            _this.$sizeCalcer = new DefaultBoudingRectCalculator();
            UIStageInst.push(_this);
            _this.$appContext = app;
            _this.$appContext.renderer.autoResize = false;
            _this.$appStage = app.stage;
            _this.$appStage.interactive = true;
            var opt;
            if (stageOptions instanceof DefaultUIStageOptions)
                opt = stageOptions;
            else {
                opt = new DefaultUIStageOptions();
                if (stageOptions != null) {
                    for (var i in stageOptions) {
                        opt[i] = stageOptions[i];
                    }
                }
            }
            if (!opt.designWidth || !opt.designHeight)
                throw new Error("Invalid designWidth / designHeight in the parameter 'stageOptions'.");
            _this.$options = opt;
            var container = _this.$appContext.view.parentElement;
            if (container.tagName != "DIV") {
                container = document.createElement("DIV");
                _this.$appContext.view.parentElement.appendChild(container);
            }
            var style = container.style;
            style.position = "relative";
            style.left = style.top = "0px";
            style.width = style.height = "100%";
            style.overflow = "hidden";
            _this.$appContext.view.style.position = "absolute";
            fgui.HTMLInput.inst.initialize(container, _this.$appContext.view);
            _this.$updateScreenSize();
            return _this;
        }
        Object.defineProperty(UIStage.prototype, "orientation", {
            get: function () {
                return this.$options.orientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "stageWidth", {
            get: function () {
                return this.$width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "stageHeight", {
            get: function () {
                return this.$height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "applicationContext", {
            get: function () {
                return this.$appContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "nativeStage", {
            get: function () {
                return this.$appStage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "resolution", {
            get: function () {
                return this.$options.resolution;
            },
            set: function (v) {
                this.$options.resolution = v;
                this.$updateScreenSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "scaleX", {
            get: function () {
                return this.$scaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIStage.prototype, "scaleY", {
            get: function () {
                return this.$scaleY;
            },
            enumerable: true,
            configurable: true
        });
        UIStage.prototype.setDesignSize = function (width, height) {
            var option = this.$options;
            option.designWidth = width;
            option.designHeight = height;
            this.$updateScreenSize();
        };
        UIStage.prototype.calculateStageSize = function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
            var displayWidth = screenWidth;
            var displayHeight = screenHeight;
            var stageWidth = contentWidth;
            var stageHeight = contentHeight;
            var scaleX = (screenWidth / stageWidth) || 0;
            var scaleY = (screenHeight / stageHeight) || 0;
            switch (scaleMode) {
                case "exactFit" /* EXACT_FIT */:
                    break;
                case "fixedHeight" /* FIXED_HEIGHT */:
                    stageWidth = Math.round(screenWidth / scaleY);
                    break;
                case "fixedWidth" /* FIXED_WIDTH */:
                    stageHeight = Math.round(screenHeight / scaleX);
                    break;
                case "noBorder" /* NO_BORDER */:
                    if (scaleX > scaleY)
                        displayHeight = Math.round(stageHeight * scaleX);
                    else
                        displayWidth = Math.round(stageWidth * scaleY);
                    break;
                case "showAll" /* SHOW_ALL */:
                    if (scaleX > scaleY)
                        displayWidth = Math.round(stageWidth * scaleY);
                    else
                        displayHeight = Math.round(stageHeight * scaleX);
                    break;
                case "fixedAuto" /* FIXED_AUTO */:
                    if ((displayWidth / displayHeight) < (stageWidth / stageHeight)) {
                        scaleY = scaleX;
                        stageHeight = Math.round(screenHeight / scaleX);
                    }
                    else {
                        scaleX = scaleY;
                        stageWidth = Math.round(screenWidth / scaleY);
                    }
                    break;
                default:
                    stageWidth = screenWidth;
                    stageHeight = screenHeight;
                    break;
            }
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        };
        /**@internal */
        UIStage.prototype.$updateScreenSize = function () {
            if (fgui.HTMLInput.isTyping)
                return;
            var canvas = this.$appContext.view;
            var canvasStyle = canvas.style;
            var rect = this.$sizeCalcer.getRect(canvas, this.$options.fallbackWidth, this.$options.fallbackHeight);
            var shouldRotate = false;
            var orientation = this.$options.orientation;
            if (orientation != "auto" /* AUTO */) {
                shouldRotate = orientation != "portrait" /* PORTRAIT */ && rect.height > rect.width
                    || orientation == "portrait" /* PORTRAIT */ && rect.width > rect.height;
            }
            var screenWidth = shouldRotate ? rect.height : rect.width;
            var screenHeight = shouldRotate ? rect.width : rect.height;
            var stageSize = this.calculateStageSize(this.$options.scaleMode, screenWidth, screenHeight, this.$options.designWidth, this.$options.designHeight);
            var stageWidth = stageSize.stageWidth;
            var stageHeight = stageSize.stageHeight;
            var displayWidth = stageSize.displayWidth;
            var displayHeight = stageSize.displayHeight;
            if (canvas.width !== stageWidth)
                canvas.width = stageWidth;
            if (canvas.height !== stageHeight)
                canvas.height = stageHeight;
            canvasStyle.transformOrigin = canvasStyle.webkitTransformOrigin = canvasStyle.msTransformOrigin = canvasStyle.mozTransformOrigin = canvasStyle.oTransformOrigin = "0px 0px 0px";
            canvasStyle.width = displayWidth + "px";
            canvasStyle.height = displayHeight + "px";
            var mat = this.$canvasMatrix.identity();
            var dispWidth = shouldRotate ? displayHeight : displayWidth;
            var dispHeight = shouldRotate ? displayWidth : displayHeight;
            var offx, offy;
            if (this.$options.alignH == 0 /* LEFT */)
                offx = 0;
            else if (this.$options.alignH == 2 /* RIGHT */)
                offx = rect.width - dispWidth;
            else
                offx = (rect.width - dispWidth) * 0.5;
            if (this.$options.alignV == 3 /* TOP */)
                offy = 0;
            else if (this.$options.alignV == 5 /* BOTTOM */)
                offy = rect.height - dispHeight;
            else
                offy = (rect.height - dispHeight) * 0.5;
            var rotDeg = 0;
            if (shouldRotate) {
                if (this.$options.orientation == "landscape" /* LANDSCAPE */) {
                    mat.rotate(Math.PI / 2);
                    mat.translate(screenHeight - offx, offy);
                    rotDeg = 90;
                }
                else {
                    mat.rotate(-Math.PI / 2);
                    mat.translate(offx, screenWidth - offy);
                    rotDeg = -90;
                }
            }
            else
                mat.translate(offx, offy);
            if (shouldRotate) {
                mat.tx += this.offsetY;
                mat.ty += this.offsetX;
            }
            else {
                mat.tx += this.offsetX;
                mat.ty += this.offsetY;
            }
            mat.a = this.formatData(mat.a), mat.d = this.formatData(mat.d),
                mat.tx = this.formatData(mat.tx), mat.ty = this.formatData(mat.ty);
            canvasStyle.transformOrigin = canvasStyle.webkitTransformOrigin = canvasStyle.msTransformOrigin = canvasStyle.mozTransformOrigin = canvasStyle.oTransformOrigin = "0px 0px 0px";
            canvasStyle.transform = canvasStyle.webkitTransform = canvasStyle.msTransform = canvasStyle.mozTransform = canvasStyle.oTransform = "matrix(" + mat.a + "," + mat.b + "," + mat.c + "," + mat.d + "," + mat.tx + "," + mat.ty + ")";
            this.$width = stageWidth;
            this.$height = stageHeight;
            this.$scaleX = stageWidth / displayWidth;
            this.$scaleY = stageHeight / displayHeight;
            var im = this.$appContext.renderer.plugins.interaction;
            im.stageRotation = rotDeg;
            im.stageScaleX = this.$scaleX;
            im.stageScaleY = this.$scaleY;
            this.$appContext.renderer.resize(stageWidth, stageHeight);
            fgui.HTMLInput.inst.$updateSize(displayWidth / stageWidth, displayHeight / stageHeight);
            this.emit("__sizeChanged" /* SIZE_CHANGED */, this);
        };
        UIStage.prototype.formatData = function (value) {
            if (Math.abs(value) < 0.000001)
                return 0;
            if (Math.abs(1 - value) < 0.001)
                return value > 0 ? 1 : -1;
            return value;
        };
        UIStage.prototype.dispose = function () {
            var i = UIStageInst.length;
            while (i-- >= 0) {
                if (UIStageInst[i] === this)
                    UIStageInst.splice(i, 1);
            }
        };
        return UIStage;
    }(PIXI.utils.EventEmitter));
    fgui.UIStage = UIStage;
    var UIStageInst = [];
    var resizeCheckTimer = NaN;
    function resizeHandler() {
        var onSafari = !!window.navigator.userAgent.match(/Version\/\d+\.\d\x20Mobile\/\S+\x20Safari/);
        resizeCheckTimer = NaN;
        UIStageInst.forEach(function (stage) {
            if (onSafari)
                stage.offsetY = (document.body.clientHeight || document.documentElement.clientHeight) - window.innerHeight;
            stage.$updateScreenSize();
        });
    }
    window.addEventListener("resize", function () {
        if (isNaN(resizeCheckTimer)) {
            resizeCheckTimer = window.setTimeout(resizeHandler, 300);
        }
    });
})(fgui || (fgui = {}));
/*this class is temporarily for the bug fixing purpose only, so once PIXI releases a new version, this class will be removed */
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(text, style, canvas) {
                var _this = _super.call(this, text, style, canvas) || this;
                if (!PIXI.extras.Text.__init) {
                    PIXI.extras.Text.__init = true;
                    //override
                    PIXI.TextMetrics.wordWrap = function (text, style) {
                        var canvas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIXI.TextMetrics["_canvas"];
                        var context = canvas.getContext('2d');
                        var line = '';
                        var width = 0;
                        var lines = '';
                        var cache = {};
                        var ls = style.letterSpacing;
                        // ideally there is letterSpacing after every char except the last one
                        // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
                        // so for convenience the above needs to be compared to width + 1 extra space
                        // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
                        // ________________________________________________
                        // And then the final space is simply no appended to each line
                        var wordWrapWidth = style.wordWrapWidth + style.letterSpacing;
                        // get the width of a space and add it to cache
                        var spaceWidth = PIXI.TextMetrics.getFromCache(' ', ls, cache, context);
                        // break text into words
                        var words = text.split(' ');
                        for (var i = 0; i < words.length; i++) {
                            var word = words[i];
                            // get word width from cache if possible
                            var wordWidth = PIXI.TextMetrics.getFromCache(word, ls, cache, context);
                            // word is longer than desired bounds
                            if (wordWidth > wordWrapWidth) {
                                // break large word over multiple lines
                                if (style.breakWords) {
                                    // add a space to the start of the word unless its at the beginning of the line
                                    var tmpWord = line.length > 0 ? ' ' + word : word;
                                    // break word into characters
                                    var characters = tmpWord.split('');
                                    // loop the characters
                                    for (var j = 0; j < characters.length; j++) {
                                        var character = characters[j];
                                        var nextChar = characters[j + 1];
                                        var isEmoji = Text.isEmojiChar(character.charCodeAt(0), nextChar ? nextChar.charCodeAt(0) : 0);
                                        if (isEmoji >= 1) {
                                            j++;
                                            character += nextChar; //combine into 1 emoji
                                        }
                                        var characterWidth = PIXI.TextMetrics.getFromCache(character, ls, cache, context);
                                        if (characterWidth + width > wordWrapWidth) {
                                            lines += PIXI.TextMetrics.addLine(line);
                                            line = '';
                                            width = 0;
                                        }
                                        line += character;
                                        width += characterWidth;
                                    }
                                }
                                else {
                                    // if there are words in this line already
                                    // finish that line and start a new one
                                    if (line.length > 0) {
                                        lines += PIXI.TextMetrics.addLine(line);
                                        line = '';
                                        width = 0;
                                    }
                                    // give it its own line
                                    lines += PIXI.TextMetrics.addLine(word);
                                    line = '';
                                    width = 0;
                                }
                            }
                            else {
                                // word won't fit, start a new line
                                if (wordWidth + width > wordWrapWidth) {
                                    lines += PIXI.TextMetrics.addLine(line);
                                    line = '';
                                    width = 0;
                                }
                                // add the word to the current line
                                if (line.length > 0) {
                                    // add a space if it is not the beginning
                                    line += ' ' + word;
                                }
                                else {
                                    // add without a space if it is the beginning
                                    line += word;
                                }
                                width += wordWidth + spaceWidth;
                            }
                        }
                        lines += PIXI.TextMetrics.addLine(line, false);
                        return lines;
                    };
                }
                return _this;
            }
            /**
             * Check whether a byte is an emoji character or not.
             *
             * @param {number} charCode - the byte to test.
             * @param {number} nextCharCode - the possible second byte of the emoji.
             * @return {number} 0 means not a emoji, 1 means single byte, 2 means double bytes.
             */
            Text.isEmojiChar = function (charCode, nextCharCode) {
                var hs = charCode;
                var nextCharValid = typeof nextCharCode === 'number' && !isNaN(nextCharCode) && nextCharCode > 0;
                // surrogate pair
                if (hs >= 0xd800 && hs <= 0xdbff) {
                    if (nextCharValid) {
                        var uc = ((hs - 0xd800) * 0x400) + (nextCharCode - 0xdc00) + 0x10000;
                        if (uc >= 0x1d000 && uc <= 0x1f77f) {
                            return 2;
                        }
                    }
                }
                else if ((hs >= 0x2100 && hs <= 0x27ff)
                    || (hs >= 0x2B05 && hs <= 0x2b07)
                    || (hs >= 0x2934 && hs <= 0x2935)
                    || (hs >= 0x3297 && hs <= 0x3299)
                    || hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
                    || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
                    || hs === 0x2b50 || hs === 0x231a) {
                    return 1;
                }
                else if (nextCharValid && (nextCharCode === 0x20e3 || nextCharCode === 0xfe0f || nextCharCode === 0xd83c)) {
                    return 2;
                }
                return 0;
            };
            Text.__init = false;
            return Text;
        }(PIXI.Text));
        extras.Text = Text;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
///<reference path="../PIXI/extras/Text.ts" />
var fgui;
(function (fgui) {
    var UITextField = (function (_super) {
        __extends(UITextField, _super);
        function UITextField(owner) {
            var _this = _super.call(this) || this;
            _this.$minHeightID = -1;
            _this.UIOwner = owner;
            _this.interactive = _this.interactiveChildren = false;
            _this._texture.noFrame = false;
            _this._width = _this._texture.frame.width;
            _this._height = _this._texture.frame.height;
            _this.$minHeight = -1;
            _this._texture.on("update", _this.updateFrame, _this);
            return _this;
        }
        Object.defineProperty(UITextField.prototype, "minHeight", {
            get: function () {
                return this.$minHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**@internal */
        UITextField.prototype.$updateMinHeight = function () {
            if (this.style.styleID != this.$minHeightID || this.$minHeight <= 0) {
                this.$minHeight = PIXI.TextMetrics.measureText("", this.style, false).lineHeight; //no way to get the cached auto-lineheight (when style.lineHeight=0);
                this.$minHeightID = this.style.styleID;
            }
        };
        UITextField.prototype.updateFrame = function () {
            fgui.GTimer.inst.callLater(this.internalUpdateFrame, this);
        };
        UITextField.prototype.internalUpdateFrame = function () {
            if (this._texture) {
                var frm = this._texture.frame;
                this._height = Math.max(this._height, this.$minHeight);
                var w = frm.x + this._width, h = frm.y + this._height;
                if (w > this._texture.baseTexture.width)
                    w = this._texture.baseTexture.width - frm.x;
                if (h > this._texture.baseTexture.height)
                    h = this._texture.baseTexture.height - frm.y;
                frm.width = w / this.resolution;
                frm.height = h / this.resolution;
                this._texture.trim.width = frm.width;
                this._texture.trim.height = frm.height;
                var padding = this._style.trim ? 0 : this._style.padding;
                this._texture.trim.x = -padding;
                this._texture.trim.y = -padding;
                this._texture.frame = frm;
            }
        };
        //cancel scaling update
        UITextField.prototype._onTextureUpdate = function () {
            this._textureID = -1;
            this._textureTrimmedID = -1;
        };
        Object.defineProperty(UITextField.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                this._width = v;
                this.updateFrame();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UITextField.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                this._height = v;
                this.updateFrame();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UITextField.prototype, "textHeight", {
            get: function () {
                this.updateText(true);
                return this._texture.orig.height;
            },
            set: function (v) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UITextField.prototype, "textWidth", {
            get: function () {
                this.updateText(true);
                return this._texture.orig.width;
            },
            set: function (v) {
                if (v != this.style.wordWrapWidth)
                    this.style.wordWrapWidth = v;
            },
            enumerable: true,
            configurable: true
        });
        return UITextField;
    }(PIXI.extras.Text));
    fgui.UITextField = UITextField;
})(fgui || (fgui = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var InteractionManager = (function (_super) {
            __extends(InteractionManager, _super);
            function InteractionManager(renderer, options) {
                var _this = _super.call(this, renderer, options) || this;
                _this.stageRotation = 0;
                _this.stageScaleX = 1;
                _this.stageScaleY = 1;
                return _this;
            }
            InteractionManager.prototype.mapPositionToPoint = function (point, x, y) {
                var rect = void 0;
                var dom = this.interactionDOMElement;
                // IE 11 fix
                if (!dom.parentElement) {
                    rect = { x: 0, y: 0, width: 0, height: 0 };
                }
                else {
                    rect = dom.getBoundingClientRect();
                }
                var nav = navigator;
                var resolutionMultiplier = nav.isCocoonJS ? this.resolution : 1.0 / this.resolution;
                var doc = document.documentElement;
                var left = rect.left + window.pageXOffset - doc.clientLeft;
                var top = rect.top + window.pageYOffset - doc.clientTop;
                x -= left;
                y -= top;
                var newx = x, newy = y;
                if (this.stageRotation == 90) {
                    newx = y;
                    newy = rect.width - x;
                }
                else if (this.stageRotation == -90) {
                    newx = rect.height - y;
                    newy = x;
                }
                newx = newx * this.stageScaleX * resolutionMultiplier;
                newy = newy * this.stageScaleY * resolutionMultiplier;
                point.set(newx, newy);
            };
            return InteractionManager;
        }(PIXI.interaction.InteractionManager));
        extras.InteractionManager = InteractionManager;
        //override
        PIXI.CanvasRenderer.registerPlugin("interaction", PIXI.extras.InteractionManager);
        PIXI.WebGLRenderer.registerPlugin("interaction", PIXI.extras.InteractionManager);
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var fgui;
(function (fgui) {
    var DisplayListItem = (function () {
        function DisplayListItem(packageItem, type) {
            this.packageItem = packageItem;
            this.type = type;
        }
        return DisplayListItem;
    }());
    fgui.DisplayListItem = DisplayListItem;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var PackageItem = (function () {
        function PackageItem() {
            this.width = 0;
            this.height = 0;
            this.tiledSlices = 0;
            //movieclip
            this.interval = 0;
            this.repeatDelay = 0;
        }
        PackageItem.prototype.load = function () {
            return this.owner.getItemAsset(this);
        };
        PackageItem.prototype.toString = function () {
            return this.name;
        };
        return PackageItem;
    }());
    fgui.PackageItem = PackageItem;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var UIObjectFactory = (function () {
        function UIObjectFactory() {
        }
        UIObjectFactory.setPackageItemExtension = function (url, type) {
            UIObjectFactory.packageItemExtensions[url.substring(5)] = type;
        };
        UIObjectFactory.setLoaderExtension = function (type) {
            UIObjectFactory.loaderExtension = type;
        };
        UIObjectFactory.newObject = function (pi) {
            switch (pi.type) {
                case 0 /* Image */:
                    return new fgui.GImage();
                case 2 /* MovieClip */:
                    return new fgui.GMovieClip();
                case 4 /* Component */:
                    var cls = UIObjectFactory.packageItemExtensions[pi.owner.id + pi.id];
                    if (cls)
                        return new cls();
                    var xml = pi.owner.getItemAsset(pi);
                    var extention = xml.attributes.extention;
                    if (extention != null) {
                        switch (extention) {
                            case "Button":
                                return new fgui.GButton();
                            case "ProgressBar":
                                return new fgui.GProgressBar();
                            case "Label":
                                return new fgui.GLabel();
                            case "Slider":
                                return new fgui.GSlider();
                            case "ScrollBar":
                                return new fgui.GScrollBar();
                            case "ComboBox":
                                return new fgui.GComboBox();
                            default:
                                return new fgui.GComponent();
                        }
                    }
                    else
                        return new fgui.GComponent();
            }
            return null;
        };
        /**@internal */
        UIObjectFactory.newObjectDirectly = function (type) {
            switch (type) {
                case "image":
                    return new fgui.GImage();
                case "movieclip":
                    return new fgui.GMovieClip();
                case "component":
                    return new fgui.GComponent();
                case "text":
                    return new fgui.GTextField();
                case "list":
                    return new fgui.GList();
                case "richtext":
                    return new fgui.GRichTextField();
                case "inputtext":
                    return new fgui.GTextInput();
                case "group":
                    return new fgui.GGroup();
                case "graph":
                    return new fgui.GGraph();
                case "loader":
                    if (UIObjectFactory.loaderExtension != null)
                        return new UIObjectFactory.loaderExtension();
                    else
                        return new fgui.GLoader();
            }
            return null;
        };
        UIObjectFactory.packageItemExtensions = {};
        return UIObjectFactory;
    }());
    fgui.UIObjectFactory = UIObjectFactory;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var AtlasConfig = (function () {
        function AtlasConfig(atlasName, frame, orig, trim, rotate) {
            this.atlasName = atlasName;
            this.frame = frame;
            this.orig = orig;
            this.trim = trim;
            this.rotate = rotate;
        }
        return AtlasConfig;
    }());
    var UIPackage = (function () {
        function UIPackage() {
            this.$items = [];
            this.$atlasConfigs = {};
        }
        UIPackage.getById = function (id) {
            return UIPackage.$packageInstById[id];
        };
        UIPackage.getByName = function (name) {
            return UIPackage.$packageInstByName[name];
        };
        UIPackage.addPackage = function (resKey) {
            var pkg = new UIPackage();
            pkg.create(resKey);
            UIPackage.$packageInstById[pkg.id] = pkg;
            UIPackage.$packageInstByName[pkg.name] = pkg;
            pkg.customId = resKey;
            return pkg;
        };
        UIPackage.removePackage = function (packageId) {
            var pkg = UIPackage.$packageInstById[packageId];
            pkg.dispose();
            delete UIPackage.$packageInstById[pkg.id];
            if (pkg.$customId != null)
                delete UIPackage.$packageInstById[pkg.$customId];
            delete UIPackage.$packageInstByName[pkg.name];
        };
        UIPackage.createObject = function (pkgName, resName, userClass) {
            var pkg = UIPackage.getByName(pkgName);
            if (pkg)
                return pkg.createObject(resName, userClass);
            else
                return null;
        };
        UIPackage.createObjectFromURL = function (url, userClass) {
            var pi = UIPackage.getItemByURL(url);
            if (pi)
                return pi.owner.internalCreateObject(pi, userClass);
            else
                return null;
        };
        UIPackage.getItemURL = function (pkgName, resName) {
            var pkg = UIPackage.getByName(pkgName);
            if (!pkg)
                return null;
            var pi = pkg.$itemsByName[resName];
            if (!pi)
                return null;
            return "ui://" + pkg.id + pi.id;
        };
        UIPackage.getItemByURL = function (url) {
            var pos1 = url.indexOf("//");
            if (pos1 == -1)
                return null;
            var pos2 = url.indexOf("/", pos1 + 2);
            var pkg;
            if (pos2 == -1) {
                if (url.length > 13) {
                    var pkgId = url.substr(5, 8);
                    pkg = UIPackage.getById(pkgId);
                    if (pkg != null) {
                        var srcId = url.substr(13);
                        return pkg.getItemById(srcId);
                    }
                }
            }
            else {
                var pkgName = url.substr(pos1 + 2, pos2 - pos1 - 2);
                pkg = UIPackage.getByName(pkgName);
                if (pkg != null) {
                    var srcName = url.substr(pos2 + 1);
                    return pkg.getItemByName(srcName);
                }
            }
            return null;
        };
        UIPackage.getBitmapFontByURL = function (url) {
            return UIPackage.$bitmapFonts[url];
        };
        UIPackage.setStringsSource = function (source) {
            UIPackage.$stringsSource = {};
            var xmlroot = fgui.utils.XmlParser.tryParse(source);
            xmlroot.children.forEach(function (cxml) {
                if (cxml.nodeName == "string") {
                    var key = cxml.attributes.name;
                    var i = key.indexOf("-");
                    if (i == -1)
                        return;
                    var text = cxml.children.length > 0 ? cxml.children[0].text : "";
                    var key2 = key.substr(0, i);
                    var key3 = key.substr(i + 1);
                    var col = UIPackage.$stringsSource[key2];
                    if (!col) {
                        col = {};
                        UIPackage.$stringsSource[key2] = col;
                    }
                    col[key3] = text;
                }
            });
        };
        /**
         * format the URL from old version to new version
         * @param url url with old version format
         */
        UIPackage.normalizeURL = function (url) {
            if (url == null)
                return null;
            var pos1 = url.indexOf("//");
            if (pos1 == -1)
                return null;
            var pos2 = url.indexOf("/", pos1 + 2);
            if (pos2 == -1)
                return url;
            var pkgName = url.substr(pos1 + 2, pos2 - pos1 - 2);
            var srcName = url.substr(pos2 + 1);
            return UIPackage.getItemURL(pkgName, srcName);
        };
        UIPackage.prototype.create = function (resKey) {
            var _this = this;
            this.$resKey = resKey;
            var buf = fgui.utils.AssetLoader.resourcesPool[this.$resKey];
            if (!buf)
                buf = fgui.utils.AssetLoader.resourcesPool[this.$resKey + "_fui"];
            if (!buf)
                throw new Error("Resource '" + this.$resKey + "' not found, please make sure that you use \"new fgui.utils.AssetLoader\" to load resources instead of \" PIXI.loaders.Loader\".");
            if (!buf.data || !(buf.data instanceof ArrayBuffer))
                throw new Error("Resource '" + this.$resKey + "' is not a proper binary resource, please load it as binary format by calling yourLoader.add(name, url, { loadType:PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })");
            this.decompressPackage(buf.data);
            var str = this.getResDescriptor("sprites.bytes");
            str && str.split(UIPackage.sep1).forEach(function (str, index) {
                if (index >= 1 && str && str.length) {
                    var arr = str.split(UIPackage.sep2);
                    var texID = void 0;
                    var itemId = arr[0];
                    var binIndex = parseInt(arr[1]);
                    if (binIndex >= 0)
                        texID = "atlas" + binIndex;
                    else {
                        var pos = itemId.indexOf("_");
                        if (pos == -1)
                            texID = "atlas_" + itemId;
                        else
                            texID = "atlas_" + itemId.substr(0, pos);
                    }
                    var cfg = new AtlasConfig(texID);
                    cfg.frame = new PIXI.Rectangle(parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]));
                    /*
                    //just ignored for now - editor not support
                    let rotate:boolean = arr[6] == "1";
                    let trimed:PIXI.Rectangle = ; //ignored for now - editor not support
                    cfg.orig = orig;
                    cfg.trim = trimed;
                    cfg.rotate = rotate ? 2 : 0;*/
                    _this.$atlasConfigs[itemId] = cfg;
                }
            });
            str = this.getResDescriptor("package.xml");
            var xml = fgui.utils.XmlParser.tryParse(str);
            this.$id = xml.attributes.id;
            this.$name = xml.attributes.name;
            var resources = xml.children[0].children;
            this.$itemsById = {};
            this.$itemsByName = {};
            resources.forEach(function (cxml) {
                var pi = new fgui.PackageItem();
                pi.type = fgui.ParsePackageItemType(cxml.nodeName);
                pi.id = cxml.attributes.id;
                pi.name = cxml.attributes.name;
                pi.file = cxml.attributes.file;
                str = cxml.attributes.size;
                if (str) {
                    var arr = str.split(UIPackage.sep0);
                    pi.width = parseInt(arr[0]);
                    pi.height = parseInt(arr[1]);
                }
                switch (pi.type) {
                    case 0 /* Image */: {
                        str = cxml.attributes.scale;
                        if (str == "9grid") {
                            pi.scale9Grid = new PIXI.Rectangle();
                            str = cxml.attributes.scale9grid;
                            if (str) {
                                var arr = str.split(UIPackage.sep0);
                                pi.scale9Grid.x = parseInt(arr[0]);
                                pi.scale9Grid.y = parseInt(arr[1]);
                                pi.scale9Grid.width = parseInt(arr[2]);
                                pi.scale9Grid.height = parseInt(arr[3]);
                                str = cxml.attributes.gridTile;
                                if (str)
                                    pi.tiledSlices = parseInt(str);
                            }
                        }
                        else if (str == "tile")
                            pi.scaleByTile = true;
                        break;
                    }
                }
                pi.owner = _this;
                _this.$items.push(pi);
                _this.$itemsById[pi.id] = pi;
                if (pi.name != null)
                    _this.$itemsByName[pi.name] = pi;
            }, this);
            this.$items.forEach(function (pi) {
                if (pi.type == 6 /* Font */) {
                    _this.loadFont(pi);
                    UIPackage.$bitmapFonts[pi.bitmapFont.id] = pi.bitmapFont;
                }
            }, this);
        };
        UIPackage.prototype.decompressPackage = function (buf) {
            this.$resData = {};
            var inflater = new Zlib.RawInflate(buf);
            var data = inflater.decompress();
            var source = fgui.utils.RawByte.decodeUTF8(data);
            var curr = 0;
            var fn;
            var size;
            while (true) {
                var pos = source.indexOf("|", curr);
                if (pos == -1)
                    break;
                fn = source.substring(curr, pos);
                curr = pos + 1;
                pos = source.indexOf("|", curr);
                size = parseInt(source.substring(curr, pos));
                curr = pos + 1;
                this.$resData[fn] = source.substr(curr, size);
                curr += size;
            }
        };
        UIPackage.prototype.dispose = function () {
            var _this = this;
            this.$items.forEach(function (pi) {
                var texture = pi.texture;
                if (texture != null) {
                    texture.destroy();
                    //texture.baseTexture.destroy();
                    PIXI.Texture.removeFromCache(texture);
                }
                else if (pi.frames != null) {
                    pi.frames.forEach(function (f) {
                        texture = f.texture;
                        if (texture) {
                            texture.destroy();
                            //texture.baseTexture.destroy();
                            PIXI.Texture.removeFromCache(texture);
                        }
                    });
                }
                else if (pi.bitmapFont != null)
                    delete UIPackage.$bitmapFonts[pi.bitmapFont.id];
                var cfg = _this.$atlasConfigs[pi.id];
                if (cfg)
                    fgui.utils.AssetLoader.destroyResource(_this.$resKey + "@" + cfg.atlasName);
            }, this);
            fgui.utils.AssetLoader.destroyResource("" + this.$resKey);
        };
        Object.defineProperty(UIPackage.prototype, "id", {
            get: function () {
                return this.$id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIPackage.prototype, "name", {
            get: function () {
                return this.$name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIPackage.prototype, "customId", {
            get: function () {
                return this.$customId;
            },
            set: function (value) {
                if (this.$customId != null)
                    delete UIPackage.$packageInstById[this.$customId];
                this.$customId = value;
                if (this.$customId != null)
                    UIPackage.$packageInstById[this.$customId] = this;
            },
            enumerable: true,
            configurable: true
        });
        UIPackage.prototype.createObject = function (resName, userClass) {
            var pi = this.$itemsByName[resName];
            if (pi)
                return this.internalCreateObject(pi, userClass);
            else
                return null;
        };
        UIPackage.prototype.internalCreateObject = function (item, userClass) {
            if (userClass === void 0) { userClass = null; }
            var g = item.type == 4 /* Component */ && userClass != null ? new userClass() : fgui.UIObjectFactory.newObject(item);
            if (g == null)
                return null;
            UIPackage.$constructingObjects++;
            g.packageItem = item;
            g.constructFromResource();
            UIPackage.$constructingObjects--;
            return g;
        };
        UIPackage.prototype.getItemById = function (itemId) {
            return this.$itemsById[itemId];
        };
        UIPackage.prototype.getItemByName = function (resName) {
            return this.$itemsByName[resName];
        };
        UIPackage.prototype.getItemAssetByName = function (resName) {
            var pi = this.$itemsByName[resName];
            if (pi == null)
                throw new Error("Resource '" + resName + "' not found");
            return this.getItemAsset(pi);
        };
        UIPackage.prototype.createSpriteTexture = function (cfgName, cfg) {
            var atlasItem = this.$itemsById[cfg.atlasName];
            if (atlasItem != null) {
                var atlasTexture = this.getItemAsset(atlasItem);
                if (!atlasTexture || !atlasTexture.baseTexture)
                    return null;
                if (!cfg.texCacheID)
                    cfg.texCacheID = this.$resKey + "@" + cfg.atlasName + "@" + cfgName;
                var tex = PIXI.utils.TextureCache[cfg.texCacheID];
                if (!tex) {
                    tex = new PIXI.Texture(atlasTexture.baseTexture, cfg.frame, cfg.orig, cfg.trim, cfg.rotate);
                    PIXI.Texture.addToCache(tex, cfg.texCacheID);
                }
                return tex;
            }
            else
                return null;
        };
        UIPackage.prototype.getItemAsset = function (item) {
            switch (item.type) {
                case 0 /* Image */:
                    if (!item.decoded) {
                        item.decoded = true;
                        var cfg = this.$atlasConfigs[item.id];
                        if (cfg != null)
                            item.texture = this.createSpriteTexture(item.id, cfg);
                    }
                    return item.texture;
                case 7 /* Atlas */:
                    if (!item.decoded) {
                        item.decoded = true;
                        var fileName = (item.file != null && item.file.length > 0) ? item.file : (item.id + ".png");
                        var resName = this.$resKey + "@" + fgui.utils.StringUtil.getFileName(fileName);
                        var res = fgui.utils.AssetLoader.resourcesPool[resName];
                        if (!res)
                            throw new Error(resName + " not found in fgui.utils.AssetLoader.resourcesPool, please use new AssetLoader() to load assets instead of using new PIXI.loaders.Loader(). besides, AssetLoader is a sub-class from PIXI.loaders.Loader so they have the same usage.");
                        item.texture = res.texture;
                        if (!item.texture) {
                            res = fgui.utils.AssetLoader.resourcesPool[this.$resKey + "@" + fileName.replace("\.", "_")];
                            item.texture = res.texture;
                        }
                    }
                    return item.texture;
                case 3 /* Sound */://ignored, maybe integrate with PIXI.Sound
                    item.decoded = false;
                    return null;
                case 6 /* Font */:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadFont(item);
                    }
                    return item.bitmapFont;
                case 2 /* MovieClip */:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadMovieClip(item);
                    }
                    return item.frames;
                case 4 /* Component */:
                    if (!item.decoded) {
                        item.decoded = true;
                        var str = this.getResDescriptor(item.id + ".xml");
                        var xml = fgui.utils.XmlParser.tryParse(str);
                        item.componentData = xml;
                        this.loadComponentChildren(item);
                        this.loadComponentTranslation(item);
                    }
                    return item.componentData;
                default:
                    return fgui.utils.AssetLoader.resourcesPool[this.$resKey + "@" + item.id];
            }
        };
        UIPackage.prototype.loadComponentChildren = function (item) {
            var listNode = fgui.utils.XmlParser.getChildNodes(item.componentData, "displayList");
            if (listNode != null && listNode.length > 0) {
                item.displayList = [];
                listNode[0].children.forEach(function (cxml) {
                    var tagName = cxml.nodeName;
                    var di;
                    var src = cxml.attributes.src;
                    if (src) {
                        var pkgId = cxml.attributes.pkg;
                        var pkg = void 0;
                        if (pkgId && pkgId != item.owner.id)
                            pkg = UIPackage.getById(pkgId);
                        else
                            pkg = item.owner;
                        var pi = pkg != null ? pkg.getItemById(src) : null;
                        if (pi != null)
                            di = new fgui.DisplayListItem(pi, null);
                        else
                            di = new fgui.DisplayListItem(null, tagName);
                    }
                    else {
                        if (tagName == "text" && cxml.attributes.input == "true")
                            di = new fgui.DisplayListItem(null, "inputtext");
                        else
                            di = new fgui.DisplayListItem(null, tagName);
                    }
                    di.desc = cxml;
                    item.displayList.push(di);
                });
            }
            else
                item.displayList = [];
        };
        UIPackage.prototype.getResDescriptor = function (fn) {
            return this.$resData[fn];
        };
        UIPackage.prototype.loadComponentTranslation = function (item) {
            if (UIPackage.$stringsSource == null)
                return;
            var strings = UIPackage.$stringsSource[this.id + item.id];
            if (strings == null)
                return;
            var value;
            var cxml, dxml;
            var ename;
            var elementId;
            var str;
            item.displayList.forEach(function (item) {
                cxml = item.desc;
                ename = cxml.nodeName;
                elementId = cxml.attributes.id;
                str = cxml.attributes.tooltips;
                if (str) {
                    value = strings[elementId + "-tips"];
                    if (value != undefined)
                        cxml.attributes.tooltips = value;
                }
                var cs = fgui.utils.XmlParser.getChildNodes(cxml, "gearText");
                dxml = cs && cs[0];
                if (dxml) {
                    value = strings[elementId + "-texts"];
                    if (value != undefined)
                        dxml.attributes.values = value;
                    value = strings[elementId + "-texts_def"];
                    if (value != undefined)
                        dxml.attributes.default = value;
                }
                if (ename == "text" || ename == "richtext") {
                    value = strings[elementId];
                    if (value != undefined)
                        cxml.attributes.text = value;
                    value = strings[elementId + "-prompt"];
                    if (value != undefined)
                        cxml.attributes.prompt = value;
                }
                else if (ename == "list") {
                    cxml.children.forEach(function (exml, index) {
                        if (exml.nodeName != "item")
                            return;
                        value = strings[elementId + "-" + index];
                        if (value != undefined)
                            exml.attributes.title = value;
                    });
                }
                else if (ename == "component") {
                    cs = fgui.utils.XmlParser.getChildNodes(cxml, "Button");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;
                        value = strings[elementId + "-0"];
                        if (value != undefined)
                            dxml.attributes.selectedTitle = value;
                        return;
                    }
                    cs = fgui.utils.XmlParser.getChildNodes(cxml, "Label");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;
                        return;
                    }
                    cs = fgui.utils.XmlParser.getChildNodes(cxml, "ComboBox");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;
                        dxml.children.forEach(function (exml, index) {
                            if (exml.nodeName != "item")
                                return;
                            value = strings[elementId + "-" + index];
                            if (value != undefined)
                                exml.attributes.title = value;
                        });
                        return;
                    }
                }
            });
        };
        UIPackage.prototype.loadMovieClip = function (item) {
            var _this = this;
            var xml = fgui.utils.XmlParser.tryParse(this.getResDescriptor(item.id + ".xml"));
            var str;
            str = xml.attributes.interval;
            if (str != null)
                item.interval = parseInt(str);
            str = xml.attributes.swing;
            if (str != null)
                item.swing = str == "true";
            str = xml.attributes.repeatDelay;
            if (str != null)
                item.repeatDelay = parseInt(str);
            item.frames = [];
            var frameNodes = xml.children[0].children;
            frameNodes.forEach(function (node, index) {
                var frame = new fgui.Frame();
                str = node.attributes.rect;
                var arr = str.split(UIPackage.sep0);
                var trimRect = new PIXI.Rectangle(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
                str = node.attributes.addDelay;
                if (str)
                    frame.addDelay = parseInt(str);
                item.frames.push(frame);
                if (trimRect.width <= 0)
                    return;
                str = node.attributes.sprite;
                if (str)
                    str = item.id + "_" + str;
                else
                    str = item.id + "_" + index;
                var cfg = _this.$atlasConfigs[str];
                if (cfg != null) {
                    cfg.trim = trimRect;
                    frame.texture = _this.createSpriteTexture(str, cfg);
                }
            });
        };
        UIPackage.prototype.loadFont = function (item) {
            var _this = this;
            var font = new fgui.BitmapFont();
            font.id = "ui://" + this.id + item.id;
            var str = this.getResDescriptor(item.id + ".fnt");
            var lines = str.split(UIPackage.sep1);
            var kv = {};
            var ttf = false;
            var size = 0;
            var xadvance = 0;
            var resizable = false;
            var colorable = false;
            var atlasOffsetX = 0, atlasOffsetY = 0;
            var charImg;
            var mainTexture;
            var lineHeight = 0;
            var maxCharHeight = 0;
            lines.forEach(function (line) {
                if (line && line.length) {
                    str = fgui.utils.StringUtil.trim(line);
                    var arr = str.split(UIPackage.sep2);
                    arr.forEach(function (v) {
                        var at = v.split(UIPackage.sep3);
                        kv[at[0]] = at[1];
                    });
                    str = arr[0];
                    if (str == "char") {
                        var bg = new fgui.BMGlyph();
                        bg.x = parseInt(kv.x) || 0;
                        bg.y = parseInt(kv.y) || 0;
                        bg.offsetX = parseInt(kv.xoffset) || 0;
                        bg.offsetY = parseInt(kv.yoffset) || 0;
                        bg.width = parseInt(kv.width) || 0;
                        bg.height = parseInt(kv.height) || 0;
                        maxCharHeight = Math.max(bg.height, maxCharHeight);
                        bg.advance = parseInt(kv.xadvance) || 0;
                        if (kv.chnl != undefined) {
                            bg.channel = parseInt(kv.chnl);
                            if (bg.channel == 15)
                                bg.channel = 4;
                            else if (bg.channel == 1)
                                bg.channel = 3;
                            else if (bg.channel == 2)
                                bg.channel = 2;
                            else
                                bg.channel = 1;
                        }
                        if (!ttf) {
                            if (kv.img) {
                                charImg = _this.$itemsById[kv.img];
                                if (charImg != null) {
                                    charImg.load();
                                    bg.width = charImg.width;
                                    bg.height = charImg.height;
                                    bg.texture = charImg.texture;
                                }
                            }
                        }
                        else if (mainTexture != null) {
                            bg.texture = new PIXI.Texture(mainTexture.baseTexture, new PIXI.Rectangle(bg.x + atlasOffsetX, bg.y + atlasOffsetY, bg.width, bg.height));
                        }
                        if (ttf)
                            bg.lineHeight = lineHeight;
                        else {
                            if (bg.advance == 0) {
                                if (xadvance == 0)
                                    bg.advance = bg.offsetX + bg.width;
                                else
                                    bg.advance = xadvance;
                            }
                            bg.lineHeight = bg.offsetY < 0 ? bg.height : (bg.offsetY + bg.height);
                            if (size > 0 && bg.lineHeight < size)
                                bg.lineHeight = size;
                        }
                        font.glyphs[String.fromCharCode(+kv.id | 0)] = bg;
                    }
                    else if (str == "info") {
                        ttf = kv.face != null;
                        if (kv.size)
                            size = parseInt(kv.size);
                        resizable = kv.resizable == "true";
                        colorable = kv.colored == "true";
                        if (ttf) {
                            var cfg = _this.$atlasConfigs[item.id];
                            if (cfg != null) {
                                atlasOffsetX = cfg.frame.x;
                                atlasOffsetY = cfg.frame.y;
                                var atlasItem = _this.$itemsById[cfg.atlasName];
                                if (atlasItem != null)
                                    mainTexture = _this.getItemAsset(atlasItem);
                            }
                        }
                    }
                    else if (str == "common") {
                        if (kv.lineHeight)
                            lineHeight = parseInt(kv.lineHeight);
                        if (size == 0)
                            size = lineHeight;
                        else if (lineHeight == 0)
                            lineHeight = size;
                        if (kv.xadvance)
                            xadvance = parseInt(kv.xadvance);
                    }
                }
            });
            if (size == 0 && maxCharHeight > 0)
                size = maxCharHeight;
            font.ttf = ttf;
            font.size = size;
            font.resizable = resizable;
            font.colorable = colorable;
            item.bitmapFont = font;
        };
        /**@internal */
        UIPackage.$constructingObjects = 0;
        UIPackage.$packageInstById = {};
        UIPackage.$packageInstByName = {};
        UIPackage.$bitmapFonts = {};
        UIPackage.$stringsSource = null;
        UIPackage.sep0 = ",";
        UIPackage.sep1 = "\n";
        UIPackage.sep2 = " ";
        UIPackage.sep3 = "=";
        return UIPackage;
    }());
    fgui.UIPackage = UIPackage;
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var AssetLoader = (function (_super) {
            __extends(AssetLoader, _super);
            function AssetLoader(baseUrl, concurrency) {
                return _super.call(this, baseUrl, concurrency) || this;
            }
            AssetLoader.prototype._onComplete = function () {
                AssetLoader.addResources(this.resources);
                _super.prototype._onComplete.call(this);
            };
            ;
            Object.defineProperty(AssetLoader, "resourcesPool", {
                get: function () {
                    return AssetLoader.$resources;
                },
                enumerable: true,
                configurable: true
            });
            AssetLoader.destroyResource = function (key) {
                var res = AssetLoader.$resources[key];
                if (res) {
                    if (!res.isComplete)
                        res.abort();
                    res.children = null;
                    res.data = null;
                    res.texture && res.texture.destroy();
                    res.textures = null;
                    res.xhr = null;
                    AssetLoader.$resources[key] = null;
                    delete AssetLoader.$resources[key];
                }
            };
            AssetLoader.addResources = function (res) {
                if (!res)
                    return;
                for (var key in res)
                    AssetLoader.$resources[key] = res[key];
            };
            AssetLoader.$resources = {};
            return AssetLoader;
        }(PIXI.loaders.Loader));
        utils.AssetLoader = AssetLoader;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var Binder = (function () {
            function Binder() {
            }
            Binder.create = function (func, context) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                if (!context)
                    return func;
                return (function () {
                    var fullargs = arguments.length > 0 ? [].concat(Array.prototype.slice.call(arguments)).concat(args) : [].concat(args);
                    func.apply(context, fullargs);
                });
            };
            return Binder;
        }());
        utils.Binder = Binder;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        /*
        * ColorMatrix
        * Visit http://createjs.com/ for documentation, updates and examples.
        *
        * Copyright (c) 2010 gskinner.com, inc.
        *
        * Permission is hereby granted, free of charge, to any person
        * obtaining a copy of this software and associated documentation
        * files (the "Software"), to deal in the Software without
        * restriction, including without limitation the rights to use,
        * copy, modify, merge, publish, distribute, sublicense, and/or sell
        * copies of the Software, and to permit persons to whom the
        * Software is furnished to do so, subject to the following
        * conditions:
        *
        * The above copyright notice and this permission notice shall be
        * included in all copies or substantial portions of the Software.
        *
        * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
        * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
        * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        * OTHER DEALINGS IN THE SOFTWARE.
        */
        var ColorMatrix = (function () {
            /**
             * Provides helper functions for assembling a matrix for use with the {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}.
             * Most methods return the instance to facilitate chained calls.
             *
             * <h4>Example</h4>
             *
             *      myColorMatrix.adjustHue(20).adjustBrightness(50);
             *
             * See {{#crossLink "Filter"}}{{/crossLink}} for an example of how to apply filters, or {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}
             * for an example of how to use ColorMatrix to change a DisplayObject's color.
             * @class ColorMatrix
             * @param {Number} brightness
             * @param {Number} contrast
             * @param {Number} saturation
             * @param {Number} hue
             * @constructor
             **/
            function ColorMatrix(brightness, contrast, saturation, hue) {
                if (brightness === void 0) { brightness = 0; }
                if (contrast === void 0) { contrast = 0; }
                if (saturation === void 0) { saturation = 0; }
                if (hue === void 0) { hue = 0; }
                /** @internal */
                this._raw = [];
                this.h = 0;
                this.s = 0;
                this.c = 0;
                this.b = 0;
                this.setColor(brightness, contrast, saturation, hue);
            }
            Object.defineProperty(ColorMatrix.prototype, "hue", {
                get: function () { return this.h; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorMatrix.prototype, "brightness", {
                get: function () { return this.b; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorMatrix.prototype, "contrast", {
                get: function () { return this.c; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorMatrix.prototype, "saturation", {
                get: function () { return this.s; },
                enumerable: true,
                configurable: true
            });
            /**
             * Resets the instance with the specified values.
             * @method setColor
             * @param {Number} brightness
             * @param {Number} contrast
             * @param {Number} saturation
             * @param {Number} hue
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             */
            ColorMatrix.prototype.setColor = function (brightness, contrast, saturation, hue) {
                return this.reset().adjustColor(brightness, contrast, saturation, hue);
            };
            ;
            /**
             * Resets the matrix to identity values.
             * @method reset
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             */
            ColorMatrix.prototype.reset = function () {
                return this.copy(ColorMatrix.IDENTITY_MATRIX);
            };
            ;
            /**
             * Shortcut method to adjust brightness, contrast, saturation and hue.
             * Equivalent to calling adjustHue(hue), adjustContrast(contrast),
             * adjustBrightness(brightness), adjustSaturation(saturation), in that order.
             * @method adjustColor
             * @param {Number} brightness
             * @param {Number} contrast
             * @param {Number} saturation
             * @param {Number} hue
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.adjustColor = function (brightness, contrast, saturation, hue) {
                this.adjustHue(hue);
                this.adjustContrast(contrast);
                this.adjustBrightness(brightness);
                return this.adjustSaturation(saturation);
            };
            ;
            /**
             * Adjusts the brightness of pixel color by adding the specified value to the red, green and blue channels.
             * Positive values will make the image brighter, negative values will make it darker.
             * @method adjustBrightness
             * @param {Number} value A value between -255 & 255 that will be added to the RGB channels.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.adjustBrightness = function (value) {
                if (value == 0 || isNaN(value)) {
                    return this;
                }
                this.b = value;
                value = this._cleanValue(value, 255);
                this._multiplyMatrix([
                    1, 0, 0, 0, value,
                    0, 1, 0, 0, value,
                    0, 0, 1, 0, value,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
                return this;
            };
            ;
            /**
             * Adjusts the contrast of pixel color.
             * Positive values will increase contrast, negative values will decrease contrast.
             * @method adjustContrast
             * @param {Number} value A value between -100 & 100.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.adjustContrast = function (value) {
                if (value == 0 || isNaN(value)) {
                    return this;
                }
                this.c = value;
                value = this._cleanValue(value, 100);
                var x;
                var cst = 1; //127
                if (value < 0) {
                    x = cst + value / 100 * cst;
                }
                else {
                    x = value % 1;
                    if (x == 0) {
                        x = ColorMatrix.DELTA_INDEX[value];
                    }
                    else {
                        x = ColorMatrix.DELTA_INDEX[(value << 0)] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x; // use linear interpolation for more granularity.
                    }
                    x = x * cst + cst;
                }
                this._multiplyMatrix([
                    x / cst, 0, 0, 0, 0.5 * (cst - x),
                    0, x / cst, 0, 0, 0.5 * (cst - x),
                    0, 0, x / cst, 0, 0.5 * (cst - x),
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
                return this;
            };
            ;
            /**
             * Adjusts the color saturation of the pixel.
             * Positive values will increase saturation, negative values will decrease saturation (trend towards greyscale).
             * @method adjustSaturation
             * @param {Number} value A value between -100 & 100.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.adjustSaturation = function (value) {
                if (value == 0 || isNaN(value)) {
                    return this;
                }
                this.s = value;
                value = this._cleanValue(value, 100);
                var x = 1 + ((value > 0) ? 3 * value / 100 : value / 100);
                var lumR = 0.3086;
                var lumG = 0.6094;
                var lumB = 0.0820;
                this._multiplyMatrix([
                    lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
                return this;
            };
            ;
            /**
             * Adjusts the hue of the pixel color.
             * @method adjustHue
             * @param {Number} value A value between -180 & 180.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.adjustHue = function (value) {
                if (value == 0 || isNaN(value)) {
                    return this;
                }
                this.h = value;
                value = this._cleanValue(value, 180) / 180 * Math.PI;
                var cosVal = Math.cos(value);
                var sinVal = Math.sin(value);
                var lumR = 0.213;
                var lumG = 0.715;
                var lumB = 0.072;
                this._multiplyMatrix([
                    lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
                return this;
            };
            ;
            /**
             * Concatenates (multiplies) the specified matrix with this one.
             * @method concat
             * @param {Array} matrix An array or ColorMatrix instance.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.concat = function (matrix) {
                matrix = this._fixMatrix(matrix);
                if (matrix.length != ColorMatrix.LENGTH) {
                    return this;
                }
                this._multiplyMatrix(matrix);
                return this;
            };
            ;
            /**
             * Returns a clone of this ColorMatrix.
             * @method clone
             * @return {ColorMatrix} A clone of this ColorMatrix.
             **/
            ColorMatrix.prototype.clone = function () {
                return (new ColorMatrix()).copy(this._raw);
            };
            ;
            /**
             * Return a length 25 (5x5) array instance containing this matrix's values.
             * @method toArray
             * @return {Array} An array holding this matrix's values.
             **/
            ColorMatrix.prototype.toArray = function () {
                var arr = [];
                for (var i = 0, l = ColorMatrix.LENGTH; i < l; i++) {
                    arr[i] = this._raw[i];
                }
                return arr;
            };
            ;
            /**
             * Copy the specified matrix's values to this matrix.
             * @method copy
             * @param {Array} matrix An array or ColorMatrix instance.
             * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
             * @chainable
             **/
            ColorMatrix.prototype.copy = function (matrix) {
                var l = ColorMatrix.LENGTH;
                for (var i = 0; i < l; i++) {
                    this._raw[i] = matrix[i];
                }
                return this;
            };
            ;
            /**
             * @method _multiplyMatrix
             * @param {Array} matrix
             * @protected
             **/
            ColorMatrix.prototype._multiplyMatrix = function (matrix) {
                var i, j, k, col = [];
                for (i = 0; i < 5; i++) {
                    for (j = 0; j < 5; j++) {
                        col[j] = this._raw[j + i * 5];
                    }
                    for (j = 0; j < 5; j++) {
                        var val = 0;
                        for (k = 0; k < 5; k++) {
                            val += matrix[j + k * 5] * col[k];
                        }
                        this._raw[j + i * 5] = val;
                    }
                }
            };
            ;
            /**
             * Make sure values are within the specified range, hue has a limit of 180, brightness is 255, others are 100.
             * @method _cleanValue
             * @param {Number} value The raw number
             * @param {Number} limit The maximum that the number can be. The minimum is the limit * -1.
             * @protected
             **/
            ColorMatrix.prototype._cleanValue = function (value, limit) {
                return Math.min(limit, Math.max(-limit, value));
            };
            ;
            /**
             * Makes sure matrixes are 5x5 (25 long).
             * @method _fixMatrix
             * @param {Array} matrix
             * @protected
             **/
            ColorMatrix.prototype._fixMatrix = function (matrix) {
                if (matrix instanceof ColorMatrix) {
                    matrix = matrix.toArray();
                }
                if (matrix.length < ColorMatrix.LENGTH) {
                    matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
                }
                else if (matrix.length > ColorMatrix.LENGTH) {
                    matrix = matrix.slice(0, ColorMatrix.LENGTH);
                }
                return matrix;
            };
            /**
             * Array of delta values for contrast calculations.
             * @property DELTA_INDEX
             * @type Array
             * @protected
             * @static
             **/
            ColorMatrix.DELTA_INDEX = [
                0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11,
                0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
                0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
                0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
                0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
                1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
                1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25,
                2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8,
                4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0,
                7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8,
                10.0
            ];
            /**
             * Identity matrix values.
             * @property IDENTITY_MATRIX
             * @type Array
             * @protected
             * @static
             **/
            ColorMatrix.IDENTITY_MATRIX = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0,
                0, 0, 0, 0, 1
            ];
            /**
             * The constant length of a color matrix.
             * @property LENGTH
             * @type Number
             * @protected
             * @static
             **/
            ColorMatrix.LENGTH = ColorMatrix.IDENTITY_MATRIX.length;
            return ColorMatrix;
        }());
        utils.ColorMatrix = ColorMatrix;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var DragIndicator = (function () {
            function DragIndicator() {
                this.$agent = new fgui.GLoader();
                this.$agent.draggable = true;
                this.$agent.touchable = false;
                this.$agent.setSize(100, 100);
                this.$agent.setPivot(0.5, 0.5, true);
                this.$agent.align = "center" /* Center */;
                this.$agent.verticalAlign = 1 /* Middle */;
                this.$agent.sortingOrder = 1000000; //top most
                this.$agent.on("__dragEnd" /* END */, this.$dragEnd, this);
            }
            Object.defineProperty(DragIndicator.prototype, "dragAgent", {
                get: function () {
                    return this.$agent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DragIndicator.prototype, "isDragging", {
                get: function () {
                    return this.$agent.parent != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DragIndicator.prototype, "sourceObject", {
                get: function () {
                    return this.$sourceObject;
                },
                enumerable: true,
                configurable: true
            });
            DragIndicator.prototype.startDrag = function (source, icon, sourceData, touchPointID) {
                if (touchPointID === void 0) { touchPointID = -1; }
                if (this.isDragging)
                    return;
                this.$sourceObject = source;
                this.$sourceData = sourceData;
                this.$agent.url = icon;
                fgui.GRoot.inst.addChild(this.$agent);
                var pt = fgui.GRoot.inst.globalToLocal(fgui.GRoot.statusData.mouseX, fgui.GRoot.statusData.mouseY);
                this.$agent.setXY(pt.x, pt.y);
                this.$agent.startDrag(touchPointID);
            };
            DragIndicator.prototype.cancel = function () {
                if (this.$agent.parent != null) {
                    this.$agent.stopDrag();
                    fgui.GRoot.inst.removeChild(this.$agent);
                    this.$sourceData = null;
                }
            };
            DragIndicator.prototype.$dragEnd = function (evt) {
                if (!this.isDragging)
                    return;
                fgui.GRoot.inst.removeChild(this.$agent);
                var sourceData = this.$sourceData;
                this.$sourceData = null;
                var obj = fgui.GRoot.inst.getObjectUnderPoint(evt.data.global.x, evt.data.global.y);
                while (obj != null) {
                    if (obj.hasListener("__dragDrop" /* DROP */)) {
                        obj.requestFocus();
                        evt.currentTarget = obj.displayObject;
                        obj.emit("__dragDrop" /* DROP */, evt, sourceData);
                        return;
                    }
                    obj = obj.parent;
                }
            };
            return DragIndicator;
        }());
        utils.DragIndicator = DragIndicator;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var InputDelegate = (function () {
            function InputDelegate(tf) {
                this.$inited = false;
                this.$restrictString = null;
                this.$restrictRegex = null;
                this.$focused = false;
                this.$textField = tf;
                this.$input = new fgui.InputElement(tf);
            }
            InputDelegate.prototype.initialize = function () {
                if (this.$inited)
                    return;
                this.$input.$addToStage();
                this.$input.on("updateText", this.updateText, this);
                this.$input.on("__focusChanged" /* CHANGED */, this.focusHandler, this);
                this.$textField.on(fgui.InteractiveEvents.Down, this.textFieldDownHandler, this);
                this.$inited = true;
            };
            InputDelegate.prototype.textFieldDownHandler = function () {
                this.$onFocus();
            };
            InputDelegate.prototype.destroy = function () {
                if (!this.$inited)
                    return;
                this.$input.$removeFromStage();
                this.$textField.off(fgui.InteractiveEvents.Down, this.textFieldDownHandler, this);
                fgui.GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
                this.$input.off("updateText", this.updateText, this);
                this.$input.off("__focusChanged" /* CHANGED */, this.focusHandler, this);
                this.$inited = false;
            };
            Object.defineProperty(InputDelegate.prototype, "text", {
                get: function () {
                    return this.$input.text;
                },
                set: function (v) {
                    this.$input.text = v;
                },
                enumerable: true,
                configurable: true
            });
            InputDelegate.prototype.setColor = function (v) {
                return this.$input.setColor(v);
            };
            InputDelegate.prototype.updateText = function () {
                var textValue = this.$input.text;
                var isChanged = false;
                if (this.$restrictRegex != null) {
                    var result = textValue.match(this.$restrictRegex);
                    if (result)
                        textValue = result.join("");
                    else
                        textValue = "";
                    isChanged = true;
                }
                if (isChanged && this.$input.text != textValue)
                    this.$input.text = textValue;
                this.$textField.text = this.$input.text;
                this.$textField.emit("__textChange" /* Change */, this.$textField);
            };
            InputDelegate.prototype.onStageDown = function (e) {
                var target = fgui.GObject.castFromNativeObject(e.currentTarget);
                if (target != this.$textField)
                    this.$input.$hide();
            };
            InputDelegate.prototype.focusHandler = function (type) {
                if (type == "focus") {
                    if (!this.$focused) {
                        this.$focused = true;
                        this.$textField.$isTyping = true;
                        this.$textField.alpha = 0;
                        this.$textField.emit("__focusChanged" /* CHANGED */, "focus", this.$textField);
                    }
                }
                else if (type == "blur") {
                    if (this.$focused) {
                        this.$focused = false;
                        fgui.GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
                        this.$textField.$isTyping = false;
                        this.$textField.alpha = 1;
                        this.$input.$onBlur();
                        this.$textField.emit("__focusChanged" /* CHANGED */, "blur", this.$textField);
                    }
                }
            };
            Object.defineProperty(InputDelegate.prototype, "isFocused", {
                get: function () {
                    return this.$focused;
                },
                enumerable: true,
                configurable: true
            });
            /**@internal */
            InputDelegate.prototype.$getProperty = function (name) {
                return this.$inited && this.$input.getAttribute(name) || null;
            };
            /**@internal */
            InputDelegate.prototype.$setProperty = function (name, value) {
                if (!this.$inited)
                    return;
                this.$input.setAttribute(name, value);
            };
            Object.defineProperty(InputDelegate.prototype, "$restrict", {
                get: function () {
                    return this.$restrictString;
                },
                set: function (v) {
                    this.$restrictString = v;
                    if (this.$restrictString != null && this.$restrictString.length > 0)
                        this.$restrictRegex = new RegExp(this.$restrictString);
                    else
                        this.$restrictRegex = null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDelegate.prototype, "type", {
                get: function () {
                    return this.$type;
                },
                set: function (v) {
                    if (v != this.$type)
                        this.$type = v;
                },
                enumerable: true,
                configurable: true
            });
            InputDelegate.prototype.tryHideInput = function () {
                if (!this.$textField.visible && this.$input)
                    this.$input.$removeFromStage();
            };
            /**@internal */
            InputDelegate.prototype.$updateProperties = function () {
                if (this.isFocused) {
                    this.$input.resetInput();
                    this.tryHideInput();
                    return;
                }
                this.$input.text = this.$textField.text;
                this.$input.resetInput();
                this.tryHideInput();
            };
            /**@internal */
            InputDelegate.prototype.$onFocus = function () {
                var _this = this;
                if (!this.$textField.visible || this.$focused)
                    return;
                fgui.GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
                fgui.GTimer.inst.callLater(function () {
                    fgui.GRoot.inst.on(fgui.InteractiveEvents.Down, _this.onStageDown, _this);
                }, this);
                this.$input.$show();
            };
            return InputDelegate;
        }());
        utils.InputDelegate = InputDelegate;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var Margin = (function () {
            function Margin() {
                this.left = 0;
                this.right = 0;
                this.top = 0;
                this.bottom = 0;
            }
            Margin.prototype.parse = function (str) {
                if (!str) {
                    this.left = this.right = this.top = this.bottom = 0;
                    return;
                }
                var arr = str.split(",");
                if (arr.length == 1) {
                    var k = parseInt(arr[0]);
                    this.left = this.right = this.top = this.bottom = k;
                }
                else {
                    this.top = parseInt(arr[0]);
                    this.bottom = parseInt(arr[1]);
                    this.left = parseInt(arr[2]);
                    this.right = parseInt(arr[3]);
                }
            };
            Margin.prototype.copy = function (source) {
                this.top = source.top;
                this.bottom = source.bottom;
                this.left = source.left;
                this.right = source.right;
            };
            return Margin;
        }());
        utils.Margin = Margin;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var NumberUtil = (function () {
            function NumberUtil() {
            }
            NumberUtil.clamp = function (value, min, max) {
                if (value < min)
                    value = min;
                else if (value > max)
                    value = max;
                return value;
            };
            NumberUtil.clamp01 = function (value) {
                if (value > 1)
                    value = 1;
                else if (value < 0)
                    value = 0;
                return value;
            };
            NumberUtil.isNumber = function (n) {
                if (typeof (n) != "number")
                    return false;
                if (isNaN(n))
                    return false;
                return true;
            };
            NumberUtil.sign = function (x) {
                x = Number(x);
                if (x === 0 || isNaN(x))
                    return x;
                return x > 0 ? 1 : -1;
            };
            NumberUtil.angleToRadian = function (n) {
                return n * NumberUtil.RADIAN;
            };
            NumberUtil.RADIAN = Math.PI / 180;
            return NumberUtil;
        }());
        utils.NumberUtil = NumberUtil;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var RawByte = (function () {
            function RawByte() {
            }
            RawByte.inRange = function (a, min, max) {
                return min <= a && a <= max;
            };
            RawByte.decodeUTF8 = function (data) {
                var pos = 0;
                var result = "";
                var code_point;
                var utf8_code_point = 0;
                var utf8_bytes_needed = 0;
                var utf8_bytes_seen = 0;
                var utf8_lower_boundary = 0;
                while (data.length > pos) {
                    var _byte = data[pos++];
                    if (_byte == -1 /* EOF_byte */) {
                        if (utf8_bytes_needed != 0) {
                            code_point = 65533 /* Fatal_code_point */;
                        }
                        else {
                            code_point = -1 /* EOF_code_point */;
                        }
                    }
                    else {
                        if (utf8_bytes_needed == 0) {
                            if (RawByte.inRange(_byte, 0x00, 0x7F)) {
                                code_point = _byte;
                            }
                            else {
                                if (RawByte.inRange(_byte, 0xC2, 0xDF)) {
                                    utf8_bytes_needed = 1;
                                    utf8_lower_boundary = 0x80;
                                    utf8_code_point = _byte - 0xC0;
                                }
                                else if (RawByte.inRange(_byte, 0xE0, 0xEF)) {
                                    utf8_bytes_needed = 2;
                                    utf8_lower_boundary = 0x800;
                                    utf8_code_point = _byte - 0xE0;
                                }
                                else if (RawByte.inRange(_byte, 0xF0, 0xF4)) {
                                    utf8_bytes_needed = 3;
                                    utf8_lower_boundary = 0x10000;
                                    utf8_code_point = _byte - 0xF0;
                                }
                                else {
                                    //throw new Error("failed to decode the raw binary data");
                                }
                                utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                                code_point = null;
                            }
                        }
                        else if (!RawByte.inRange(_byte, 0x80, 0xBF)) {
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            pos--;
                            code_point = 65533 /* Fatal_code_point */;
                        }
                        else {
                            utf8_bytes_seen += 1;
                            utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                            if (utf8_bytes_seen !== utf8_bytes_needed) {
                                code_point = null;
                            }
                            else {
                                var cp = utf8_code_point;
                                var lower_boundary = utf8_lower_boundary;
                                utf8_code_point = 0;
                                utf8_bytes_needed = 0;
                                utf8_bytes_seen = 0;
                                utf8_lower_boundary = 0;
                                if (RawByte.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                    code_point = cp;
                                }
                                else {
                                    code_point = _byte;
                                }
                            }
                        }
                    }
                    //Decode string
                    if (code_point !== null && code_point !== -1 /* EOF_code_point */) {
                        if (code_point <= 0xFFFF) {
                            if (code_point > 0)
                                result += String.fromCharCode(code_point);
                        }
                        else {
                            code_point -= 0x10000;
                            result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                            result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                        }
                    }
                }
                return result;
            };
            return RawByte;
        }());
        utils.RawByte = RawByte;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var StringUtil = (function () {
            function StringUtil() {
            }
            StringUtil.encodeHTML = function (str) {
                if (!str)
                    return "";
                else
                    return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&apos;");
            };
            StringUtil.getFileName = function (source) {
                var i = source.lastIndexOf("/");
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
            };
            StringUtil.startsWith = function (source, str, ignoreCase) {
                if (ignoreCase === void 0) { ignoreCase = false; }
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
            };
            StringUtil.endsWith = function (source, str, ignoreCase) {
                if (ignoreCase === void 0) { ignoreCase = false; }
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
            };
            StringUtil.trim = function (targetString) {
                return StringUtil.trimLeft(StringUtil.trimRight(targetString));
            };
            StringUtil.trimLeft = function (targetString) {
                var tempChar = "";
                var i;
                for (i = 0; i < targetString.length; i++) {
                    tempChar = targetString.charAt(i);
                    if (tempChar != " " && tempChar != "\n" && tempChar != "\r")
                        break;
                }
                return targetString.substr(i);
            };
            StringUtil.trimRight = function (targetString) {
                var tempChar = "";
                var i;
                for (i = targetString.length - 1; i >= 0; i--) {
                    tempChar = targetString.charAt(i);
                    if (tempChar != " " && tempChar != "\n" && tempChar != "\r")
                        break;
                }
                return targetString.substring(0, i + 1);
            };
            StringUtil.convertToHtmlColor = function (argb, hasAlpha) {
                if (hasAlpha === void 0) { hasAlpha = false; }
                var alpha;
                if (hasAlpha)
                    alpha = (argb >> 24 & 0xFF).toString(16);
                else
                    alpha = "";
                var red = (argb >> 16 & 0xFF).toString(16);
                var green = (argb >> 8 & 0xFF).toString(16);
                var blue = (argb & 0xFF).toString(16);
                if (alpha.length == 1)
                    alpha = "0" + alpha;
                if (red.length == 1)
                    red = "0" + red;
                if (green.length == 1)
                    green = "0" + green;
                if (blue.length == 1)
                    blue = "0" + blue;
                return "#" + alpha + red + green + blue;
            };
            StringUtil.convertFromHtmlColor = function (str, hasAlpha) {
                if (hasAlpha === void 0) { hasAlpha = false; }
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
            };
            return StringUtil;
        }());
        utils.StringUtil = StringUtil;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var UBBParser = (function () {
            function UBBParser() {
                this.$readPos = 0;
                this.smallFontSize = 12;
                this.normalFontSize = 14;
                this.largeFontSize = 16;
                this.defaultImgWidth = 0;
                this.defaultImgHeight = 0;
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
            UBBParser.prototype.onTag_URL = function (tagName, end, attr) {
                if (!end) {
                    if (attr != null)
                        return "<a href=\"" + attr + "\" target=\"_blank\">";
                    else {
                        var href = this.getTagText();
                        return "<a href=\"" + href + "\" target=\"_blank\">";
                    }
                }
                else
                    return "</a>";
            };
            UBBParser.prototype.onTag_IMG = function (tagName, end, attr) {
                if (!end) {
                    var src = this.getTagText(true);
                    if (!src)
                        return null;
                    if (this.defaultImgWidth)
                        return "<img src=\"" + src + "\" width=\"" + this.defaultImgWidth + "\" height=\"" + this.defaultImgHeight + "\"/>";
                    else
                        return "<img src=\"" + src + "\"/>";
                }
                else
                    return null;
            };
            UBBParser.prototype.onTag_Simple = function (tagName, end, attr) {
                return end ? "</" + tagName + ">" : "<" + tagName + ">";
            };
            UBBParser.prototype.onTag_COLOR = function (tagName, end, attr) {
                if (!end)
                    return "<font color=\"" + attr + "\">";
                else
                    return "</font>";
            };
            UBBParser.prototype.onTag_FONT = function (tagName, end, attr) {
                if (!end)
                    return "<font face=\"" + attr + "\">";
                else
                    return "</font>";
            };
            UBBParser.prototype.onTag_SIZE = function (tagName, end, attr) {
                if (!end) {
                    if (attr == "normal")
                        attr = "" + this.normalFontSize;
                    else if (attr == "small")
                        attr = "" + this.smallFontSize;
                    else if (attr == "large")
                        attr = "" + this.largeFontSize;
                    else if (attr.length && attr.charAt(0) == "+")
                        attr = "" + (this.smallFontSize + parseInt(attr.substr(1)));
                    else if (attr.length && attr.charAt(0) == "-")
                        attr = "" + (this.smallFontSize - parseInt(attr.substr(1)));
                    return "<font size=\"" + attr + "\">";
                }
                else
                    return "</font>";
            };
            UBBParser.prototype.getTagText = function (remove) {
                if (remove === void 0) { remove = false; }
                var pos = this.$text.indexOf("[", this.$readPos);
                if (pos == -1)
                    return null;
                var ret = this.$text.substring(this.$readPos, pos);
                if (remove)
                    this.$readPos = pos;
                return ret;
            };
            //TODO: impl for GRichTextField
            UBBParser.prototype.parseStyle = function (text) {
                return [];
            };
            UBBParser.inst = new UBBParser();
            return UBBParser;
        }());
        utils.UBBParser = UBBParser;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
var fgui;
(function (fgui) {
    var utils;
    (function (utils) {
        var XmlNode = (function () {
            function XmlNode(ele) {
                this.nodeName = ele.nodeName;
                this.context = ele;
                this.type = ele.nodeType;
                this.text = (this.type == Node.COMMENT_NODE || this.type == Node.TEXT_NODE) ? this.context.textContent : null;
            }
            Object.defineProperty(XmlNode.prototype, "children", {
                get: function () {
                    if (!this.$children)
                        this.$children = XmlParser.getChildNodes(this);
                    return this.$children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XmlNode.prototype, "attributes", {
                get: function () {
                    if (!this.$attributes)
                        this.$attributes = XmlParser.getNodeAttributes(this);
                    return this.$attributes;
                },
                enumerable: true,
                configurable: true
            });
            return XmlNode;
        }());
        utils.XmlNode = XmlNode;
        var XmlParser = (function () {
            function XmlParser() {
            }
            XmlParser.tryParse = function (xmlstring, mimeType) {
                if (mimeType === void 0) { mimeType = "application/xml"; }
                var doc = XmlParser.$parser.parseFromString(xmlstring, mimeType);
                if (doc && doc.childNodes && doc.childNodes.length >= 1)
                    return new XmlNode(doc.firstChild);
                return null;
            };
            XmlParser.getXmlRoot = function (xml) {
                if (!xml || !xml.context)
                    throw new Error("Invalid xml node");
                var p = xml.context;
                while (p.parentNode != null)
                    p = p.parentNode;
                return p == xml.context ? xml : new XmlNode(p);
            };
            XmlParser.getChildNodes = function (xml, matchName) {
                if (matchName === void 0) { matchName = null; }
                var nodes = xml.context.childNodes;
                var ret = [];
                if (!nodes || nodes.length <= 0)
                    return ret;
                var len = nodes.length;
                for (var i = 0; i < len; i++) {
                    var n = nodes.item(i);
                    if (n.nodeType == Node.TEXT_NODE)
                        continue;
                    if (!matchName || (matchName && matchName.length > 0 && n.nodeName.toLowerCase() == matchName.toLowerCase()))
                        ret.push(new XmlNode(n));
                }
                return ret;
            };
            XmlParser.getNodeAttributes = function (xml) {
                var asList = xml.context.attributes;
                var ret = {};
                if (!asList || asList.length <= 0)
                    return ret;
                var len = asList.length;
                for (var i = 0; i < len; i++) {
                    var a = asList.item(i);
                    ret[a.nodeName] = a.nodeValue;
                }
                return ret;
            };
            XmlParser.$parser = new DOMParser();
            return XmlParser;
        }());
        utils.XmlParser = XmlParser;
    })(utils = fgui.utils || (fgui.utils = {}));
})(fgui || (fgui = {}));
//# sourceMappingURL=fairygui.js.map