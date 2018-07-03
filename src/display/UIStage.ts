/// <reference path="../utils/DOMEventManager.ts" />

namespace fgui {

    export const enum StageOrientation {
        AUTO = "auto",
        PORTRAIT = "portrait",
        LANDSCAPE = "landscape"
    }

    export const enum StageScaleMode {
        NO_SCALE = "noScale",
        SHOW_ALL = "showAll",
        NO_BORDER = "noBorder",
        EXACT_FIT = "exactFit",
        FIXED_WIDTH = "fixedWidth",
        FIXED_HEIGHT = "fixedHeight",
        FIXED_AUTO = "fixedAuto"
    }

    export const enum StageAlign {
        LEFT,
        CENTER,
        RIGHT,
        TOP,
        MIDDLE,
        BOTTOM
    }

    export interface UIStageOptions {
        scaleMode?: StageScaleMode;
        orientation?: StageOrientation;
        resolution?: number;
        designWidth: number;
        designHeight: number;
        alignV?: StageAlign,
        alignH?: StageAlign,
        fallbackWidth?: number,
        fallbackHeight?: number
        [key: string]: string | number;
    }

    export class DefaultUIStageOptions implements UIStageOptions {
        public scaleMode?: StageScaleMode = StageScaleMode.SHOW_ALL;
        public orientation?: StageOrientation = StageOrientation.AUTO;
        public resolution?: number = 1;
        public designWidth: number = 800;
        public designHeight: number = 600;
        public alignV: StageAlign = StageAlign.MIDDLE;
        public alignH: StageAlign = StageAlign.CENTER;
        public fallbackWidth: number = 0;
        public fallbackHeight: number = 0;
        [key: string]: string | number;
    }
    
    type BoundingRect = {
        x: number,
        y: number,
        width: number,
        height: number
    };

    interface IBoundingRectCalculator {
        getRect(view:HTMLCanvasElement, fallbackWidth:number, fallbackHeight:number):BoundingRect;
    }

    class DefaultBoudingRectCalculator implements IBoundingRectCalculator {
        public getRect(view:HTMLCanvasElement, fallbackWidth:number, fallbackHeight:number): BoundingRect {
            let p = view.parentElement;
            if(!p)
                //this should be impossible situation unless the user forget to append the view into the DOM.
                throw new Error("Your view of PIXI are still in memory but not appended to DOM yet? it's necessary that there is a parent element to wrap your view up.");
            let rect = p.getBoundingClientRect();
            let ret:BoundingRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
            if(!rect || rect.width <= 0 || rect.height <= 0) {
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
            if(ret.width <= 0 || ret.height <= 0) {
                console.warn("fetch container size to initialize PIXI in all ways have failed, now use default size (fallbackWidth / fallbackHeight) specified in the options instead.");
                ret.width = fallbackWidth;
                ret.height = fallbackHeight;
            }

            return ret;
        }
    }

    export class UIStage extends PIXI.utils.EventEmitter {

        protected $appContext: PIXI.Application;
        protected $appStage: PIXI.Container;

        protected $options: UIStageOptions;

        protected $width: number = 0;
        protected $height: number = 0;
        protected $scaleX:number = 1;
        protected $scaleY:number = 1;

        protected $canvasMatrix: PIXI.Matrix = new PIXI.Matrix();

        public offsetX: number = 0;
        public offsetY: number = 0;

        private $sizeCalcer:DefaultBoudingRectCalculator = new DefaultBoudingRectCalculator();

        public constructor(app: PIXI.Application, stageOptions?: UIStageOptions) {
            super();

            UIStageInst.push(this);

            this.$appContext = app;
            this.$appContext.renderer.autoResize = false;
            this.$appStage = app.stage;
            this.$appStage.interactive = true;
            
            let opt: UIStageOptions;
            if (stageOptions instanceof DefaultUIStageOptions)
                opt = stageOptions;
            else {
                opt = new DefaultUIStageOptions();
                if (stageOptions != null) {
                    for (let i in stageOptions) {
                        opt[i] = stageOptions[i];
                    }
                }
            }

            if (!opt.designWidth || !opt.designHeight)
                throw new Error("Invalid designWidth / designHeight in the parameter 'stageOptions'.");

            this.$options = opt;
            
            this.$appContext.view.style.position = "absolute";
            let container = this.$appContext.view.parentElement;
            let style = container.style;
            //if parent is not a DIV box, make one
            if(container.tagName != "DIV") {
                container = document.createElement("DIV");
                style.position = "relative";
                style.left = style.top = "0px";
                style.width = style.height = "100%";  //and set default full-screen
                style.overflow = "hidden";
                this.$appContext.view.parentElement.appendChild(container);
                container.appendChild(this.$appContext.view);
            }
            let containerPosition:string;
            if(document.defaultView && document.defaultView.getComputedStyle)
                containerPosition = document.defaultView.getComputedStyle(container).position;
            else
                containerPosition = style.position;
            if(containerPosition == "" || containerPosition == "static") {
                containerPosition = "relative";
                container.style.position = containerPosition;
            }
            
            HTMLInput.inst.initialize(container, this.$appContext.view);
            this.updateScreenSize();
        }

        public get orientation(): StageOrientation {
            return this.$options.orientation;
        }

        public get stageWidth(): number {
            return this.$width;
        }

        public get stageHeight(): number {
            return this.$height;
        }

        public get applicationContext(): PIXI.Application {
            return this.$appContext;
        }

        public get nativeStage(): PIXI.Container {
            return this.$appStage;
        }

        public get resolution(): number {
            return this.$options.resolution;
        }

        public set resolution(v: number) {
            this.$options.resolution = v;
            this.updateScreenSize();
        }

        public get scaleX():number{
            return this.$scaleX;
        }

        public get scaleY():number {
            return this.$scaleY;
        }

        public get designWidth():number {
            return this.$options.designWidth;
        }

        public get designHeight():number {
            return this.$options.designHeight;
        }

        public setDesignSize(width: number, height: number): void {
            let option = this.$options;
            option.designWidth = width;
            option.designHeight = height;
            this.updateScreenSize();
        }

        protected calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): { stageWidth: number, stageHeight: number, displayWidth: number, displayHeight: number } {
            let displayWidth = screenWidth;
            let displayHeight = screenHeight;
            let stageWidth = contentWidth;
            let stageHeight = contentHeight;
            let scaleX = (screenWidth / stageWidth) || 0;
            let scaleY = (screenHeight / stageHeight) || 0;
            switch (scaleMode) {
                case StageScaleMode.EXACT_FIT:
                    break;
                case StageScaleMode.FIXED_HEIGHT:
                    stageWidth = Math.round(screenWidth / scaleY);
                    break;
                case StageScaleMode.FIXED_WIDTH:
                    stageHeight = Math.round(screenHeight / scaleX);
                    break;
                case StageScaleMode.NO_BORDER:
                    if (scaleX > scaleY)
                        displayHeight = Math.round(stageHeight * scaleX);
                    else
                        displayWidth = Math.round(stageWidth * scaleY);
                    break;
                case StageScaleMode.SHOW_ALL:
                    if (scaleX > scaleY)
                        displayWidth = Math.round(stageWidth * scaleY);
                    else
                        displayHeight = Math.round(stageHeight * scaleX);
                    break;
                case StageScaleMode.FIXED_AUTO:
                    if ((displayWidth / displayHeight) < (stageWidth / stageHeight)) {
                        scaleY = scaleX;
                        stageHeight = Math.round(screenHeight / scaleX);
                    } else {
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
        }

        /**@internal */
        updateScreenSize(): void {

            if(HTMLInput.isTyping) return;

            let canvas = this.$appContext.view;
            let canvasStyle: any = canvas.style;

            let rect = this.$sizeCalcer.getRect(canvas, this.$options.fallbackWidth, this.$options.fallbackHeight);
            
            let shouldRotate = false;
            let orientation: string = this.$options.orientation;
            if (orientation != StageOrientation.AUTO) {
                shouldRotate = orientation != StageOrientation.PORTRAIT && rect.height > rect.width
                    || orientation == StageOrientation.PORTRAIT && rect.width > rect.height;
            }
            let screenWidth = shouldRotate ? rect.height : rect.width;
            let screenHeight = shouldRotate ? rect.width : rect.height;

            let stageSize = this.calculateStageSize(this.$options.scaleMode, screenWidth, screenHeight, this.$options.designWidth, this.$options.designHeight);
            let stageWidth = stageSize.stageWidth;
            let stageHeight = stageSize.stageHeight;
            let displayWidth = stageSize.displayWidth;
            let displayHeight = stageSize.displayHeight;
            if (canvas.width !== stageWidth)
                canvas.width = stageWidth;
            if (canvas.height !== stageHeight)
                canvas.height = stageHeight;
            canvasStyle.transformOrigin = canvasStyle.webkitTransformOrigin = canvasStyle.msTransformOrigin = canvasStyle.mozTransformOrigin = canvasStyle.oTransformOrigin = "0px 0px 0px";
            canvasStyle.width = displayWidth + "px";
            canvasStyle.height = displayHeight + "px";

            let mat = this.$canvasMatrix.identity();

            let dispWidth = shouldRotate ? displayHeight : displayWidth;
            let dispHeight = shouldRotate ? displayWidth : displayHeight;

            let offx: number, offy: number;
            if (this.$options.alignH == StageAlign.LEFT) offx = 0;
            else if (this.$options.alignH == StageAlign.RIGHT) offx = rect.width - dispWidth;
            else offx = (rect.width - dispWidth) * 0.5;

            if (this.$options.alignV == StageAlign.TOP) offy = 0;
            else if (this.$options.alignV == StageAlign.BOTTOM) offy = rect.height - dispHeight;
            else offy = (rect.height - dispHeight) * 0.5;

            let rotDeg = 0;
            if (shouldRotate) {
                if (this.$options.orientation == StageOrientation.LANDSCAPE) {
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
            canvasStyle.transform = canvasStyle.webkitTransform = canvasStyle.msTransform = canvasStyle.mozTransform = canvasStyle.oTransform = `matrix(${mat.a},${mat.b},${mat.c},${mat.d},${mat.tx},${mat.ty})`;

            this.$width = stageWidth;
            this.$height = stageHeight;

            this.$scaleX = stageWidth / displayWidth
            this.$scaleY = stageHeight / displayHeight;
            
            let im = this.$appContext.renderer.plugins.interaction as PIXI.extras.InteractionManager;
            im.stageRotation = rotDeg;
            im.stageScaleX = this.$scaleX;
            im.stageScaleY = this.$scaleY;
            this.$appContext.renderer.resize(stageWidth, stageHeight);
            HTMLInput.inst.updateSize(displayWidth / stageWidth, displayHeight / stageHeight);
            
            this.emit(DisplayObjectEvent.SIZE_CHANGED, this);
        }

        private formatData(value: number): number {
            if (Math.abs(value) < 0.000001) return 0;
            if (Math.abs(1 - value) < 0.001) return value > 0 ? 1 : -1;
            return value;
        }

        public dispose(): void {
            let i: number = UIStageInst.length;
            while (i-- >= 0) {
                if (UIStageInst[i] === this)
                    UIStageInst.splice(i, 1);
            }
        }
    }

    let UIStageInst: UIStage[] = [];
    let resizeCheckTimer: number = NaN;

    function resizeHandler(): void {

        let onSafari = !!window.navigator.userAgent.match(/Version\/\d+\.\d\x20Mobile\/\S+\x20Safari/);

        resizeCheckTimer = NaN;
        UIStageInst.forEach(stage => {
            if (onSafari) stage.offsetY = (document.body.clientHeight || document.documentElement.clientHeight) - window.innerHeight;
            stage.updateScreenSize();
        });
    }

    utils.DOMEventManager.inst.on('resize', function() {
        if (isNaN(resizeCheckTimer)) {
            resizeCheckTimer = window.setTimeout(resizeHandler, 300);
        }
    });
}
