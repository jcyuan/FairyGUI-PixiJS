
namespace PIXI.extras {
    
    export class NineSlicePlane extends PIXI.mesh.NineSlicePlane {

        protected _refresh():void {
            if(isNaN(this._leftWidth) || isNaN(this._topHeight) || isNaN(this._rightWidth) || isNaN(this._bottomHeight))
                return;  //call stack: super() -> Plane.refresh -> this._refresh() but now _leftWidth etc are undefined, so the calculations in this._refresh are useless.
            super._refresh();
        }
        
        public updateHorizontalVertices():void {
            var vertices = this.vertices;

            let h = this._topHeight + this._bottomHeight;
            let scale = this._height > h ? 1.0 : this._height / h;
            
            vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale;
            vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale;
            vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
        };
    
        public updateVerticalVertices():void {
            var vertices = this.vertices;

            let w = this._leftWidth + this._rightWidth;
            let scale = this._width > w ? 1.0 : this._width / w;
            
            vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale;
            vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale;
            vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
        };
    }
}
