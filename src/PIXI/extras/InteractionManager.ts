namespace PIXI.extras {
    
    export class InteractionManager extends PIXI.interaction.InteractionManager {

        public stageRotation:number = 0;
        public stageScaleX:number = 1;
        public stageScaleY:number = 1;
        
        public constructor(renderer:CanvasRenderer | WebGLRenderer | SystemRenderer, options?: PIXI.interaction.InteractionManagerOptions) {
            super(renderer, options);
        }
        
        public mapPositionToPoint(point:PIXI.Point, x:number, y:number):void {
            
            let rect:any = void 0;
            let dom:any = this.interactionDOMElement;
            
            // IE 11 fix
            if (!dom.parentElement) {
                rect = { x: 0, y: 0, width: 0, height: 0 };
            } else {
                rect = dom.getBoundingClientRect();
            }
    
            let nav:any = navigator;
            let resolutionMultiplier = nav.isCocoonJS ? this.resolution : 1.0 / this.resolution;

            let doc = document.documentElement;
            let left:number = rect.left + window.pageXOffset - doc.clientLeft;
            let top:number = rect.top + window.pageYOffset - doc.clientTop;
            
            x -= left;
            y -= top;

            let newx = x, newy = y;
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

        }
    }

    //override
    PIXI.CanvasRenderer.registerPlugin("interaction", PIXI.extras.InteractionManager);
    PIXI.WebGLRenderer.registerPlugin("interaction", PIXI.extras.InteractionManager);
}
