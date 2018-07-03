
namespace PIXI.extras {
    
    export class NineSlicePlane extends PIXI.mesh.NineSlicePlane {

        protected $flipX:boolean = false;
        protected $flipY:boolean = false;

        public updateHorizontalVertices():void {
            const vertices = this.vertices;
    
            const h = this._topHeight + this._bottomHeight;
            const scale = this._height > h ? 1.0 : this._height / h;
    
            vertices[9] = vertices[11] = vertices[13] = vertices[15] = (this.$flipY ? this._bottomHeight : this._topHeight) * scale;
            vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - (this.$flipY ? this._topHeight : this._bottomHeight) * scale;
            vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
        };
    
        public updateVerticalVertices():void {
            const vertices = this.vertices;
    
            const w = this._leftWidth + this._rightWidth;
            const scale = this._width > w ? 1.0 : this._width / w;
    
            vertices[2] = vertices[10] = vertices[18] = vertices[26] = (this.$flipX ? this._rightWidth : this._leftWidth) * scale;
            vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - (this.$flipX ? this._leftWidth : this._rightWidth) * scale;
            vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
        };

        protected _refresh():void {
            //call stack: super() -> Plane.refresh -> this._refresh() but now _leftWidth etc are undefined, so the calculations in this._refresh are useless.
            if(isNaN(this._leftWidth) || isNaN(this._topHeight) || isNaN(this._rightWidth) || isNaN(this._bottomHeight))
                return;
            
            super._refresh();

            let uvs = this.uvs;
            
            if(this.$flipX) {
                let x0 = uvs[0];
                let x1 = uvs[2];
                uvs[0] = uvs[6];
                uvs[2] = uvs[4];
                uvs[6] = x0;
                uvs[4] = x1;

                x0 = uvs[8];
                x1 = uvs[10];
                uvs[8] = uvs[14];
                uvs[10] = uvs[12];
                uvs[14] = x0;
                uvs[12] = x1;

                x0 = uvs[16];
                x1 = uvs[18];
                uvs[16] = uvs[22];
                uvs[18] = uvs[20];
                uvs[22] = x0;
                uvs[20] = x1;

                x0 = uvs[24];
                x1 = uvs[26];
                uvs[24] = uvs[30];
                uvs[26] = uvs[28];
                uvs[30] = x0;
                uvs[28] = x1;
            }

            if(this.$flipY) {
                let y0 = uvs[1];
                let y1 = uvs[9];
                uvs[1] = uvs[25];
                uvs[9] = uvs[17];
                uvs[25] = y0;
                uvs[17] = y1;

                y0 = uvs[3];
                y1 = uvs[11];
                uvs[3] = uvs[27];
                uvs[11] = uvs[19];
                uvs[27] = y0;
                uvs[19] = y1;

                y0 = uvs[5];
                y1 = uvs[13];
                uvs[5] = uvs[29];
                uvs[13] = uvs[21];
                uvs[29] = y0;
                uvs[21] = y1;

                y0 = uvs[7];
                y1 = uvs[15];
                uvs[7] = uvs[31];
                uvs[15] = uvs[23];
                uvs[31] = y0;
                uvs[23] = y1;
            }
        }

        public get flipX():boolean {
            return this.$flipX;
        }

        public get flipY():boolean {
            return this.$flipY;
        }

        public set flipX(v:boolean) {
            if(this.$flipX != v) {
                this.$flipX = v;
                this._refresh();
            }
        }

        public set flipY(v:boolean) {
            if(this.$flipY != v) {
                this.$flipY = v;
                this._refresh();
            }
        }
    }
    
}
