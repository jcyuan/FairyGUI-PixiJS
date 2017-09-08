namespace fgui.utils {

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

    export class ColorMatrix {

        /** @internal */
        protected _raw: number[] = [];
        protected h:number = 0;
        protected s:number = 0;
        protected c:number = 0;
        protected b:number = 0;

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
        public constructor(brightness: number = 0, contrast: number = 0, saturation: number = 0, hue: number = 0) {
            this.setColor(brightness, contrast, saturation, hue);
        }

        /**
         * Array of delta values for contrast calculations.
         * @property DELTA_INDEX
         * @type Array
         * @protected
         * @static
         **/
        public static DELTA_INDEX: number[] = [
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
        public static IDENTITY_MATRIX: number[] = [
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
        public static LENGTH: number = ColorMatrix.IDENTITY_MATRIX.length;

        public get hue():number { return this.h; }
        public get brightness():number { return this.b; }
        public get contrast():number { return this.c; }
        public get saturation():number { return this.s; }

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
        public setColor(brightness: number, contrast: number, saturation: number, hue: number): ColorMatrix {
            return this.reset().adjustColor(brightness, contrast, saturation, hue);
        };

        /**
         * Resets the matrix to identity values.
         * @method reset
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         */
        public reset(): ColorMatrix {
            return this.copy(ColorMatrix.IDENTITY_MATRIX);
        };

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
        public adjustColor(brightness: number, contrast: number, saturation: number, hue: number): ColorMatrix {
            this.adjustHue(hue);
            this.adjustContrast(contrast);
            this.adjustBrightness(brightness);
            return this.adjustSaturation(saturation);
        };

        /**
         * Adjusts the brightness of pixel color by adding the specified value to the red, green and blue channels.
         * Positive values will make the image brighter, negative values will make it darker.
         * @method adjustBrightness
         * @param {Number} value A value between -255 & 255 that will be added to the RGB channels.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public adjustBrightness(value: number): ColorMatrix {
            if (value == 0 || isNaN(value)) { return this; }

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

        /**
         * Adjusts the contrast of pixel color.
         * Positive values will increase contrast, negative values will decrease contrast.
         * @method adjustContrast
         * @param {Number} value A value between -100 & 100.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public adjustContrast(value: number): ColorMatrix {
            if (value == 0 || isNaN(value)) { return this; }

            this.c = value;

            value = this._cleanValue(value, 100);
            let x;
            const cst = 1;  //127
            if (value < 0) {
                x = cst + value / 100 * cst;
            } else {
                x = value % 1;
                if (x == 0) {
                    x = ColorMatrix.DELTA_INDEX[value];
                } else {
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

        /**
         * Adjusts the color saturation of the pixel.
         * Positive values will increase saturation, negative values will decrease saturation (trend towards greyscale).
         * @method adjustSaturation
         * @param {Number} value A value between -100 & 100.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public adjustSaturation(value: number): ColorMatrix {
            if (value == 0 || isNaN(value)) { return this; }

            this.s = value;

            value = this._cleanValue(value, 100);
            let x = 1 + ((value > 0) ? 3 * value / 100 : value / 100);
            let lumR = 0.3086;
            let lumG = 0.6094;
            let lumB = 0.0820;
            this._multiplyMatrix([
                lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
                lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
                lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
                0, 0, 0, 1, 0,
                0, 0, 0, 0, 1
            ]);
            return this;
        };


        /**
         * Adjusts the hue of the pixel color.
         * @method adjustHue
         * @param {Number} value A value between -180 & 180.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public adjustHue(value: number): ColorMatrix {
            if (value == 0 || isNaN(value)) { return this; }
            
            this.h = value;

            value = this._cleanValue(value, 180) / 180 * Math.PI;
            let cosVal = Math.cos(value);
            let sinVal = Math.sin(value);
            let lumR = 0.213;
            let lumG = 0.715;
            let lumB = 0.072;
            this._multiplyMatrix([
                lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
                lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
                lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
                0, 0, 0, 1, 0,
                0, 0, 0, 0, 1
            ]);
            return this;
        };

        /**
         * Concatenates (multiplies) the specified matrix with this one.
         * @method concat
         * @param {Array} matrix An array or ColorMatrix instance.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public concat(matrix: number[]): ColorMatrix {
            matrix = this._fixMatrix(matrix);
            if (matrix.length != ColorMatrix.LENGTH) { return this; }
            this._multiplyMatrix(matrix);
            return this;
        };

        /**
         * Returns a clone of this ColorMatrix.
         * @method clone
         * @return {ColorMatrix} A clone of this ColorMatrix.
         **/
        public clone(): ColorMatrix {
            return (new ColorMatrix()).copy(this._raw);
        };

        /**
         * Return a length 25 (5x5) array instance containing this matrix's values.
         * @method toArray
         * @return {Array} An array holding this matrix's values.
         **/
        public toArray(): number[] {
            let arr = [];
            for (let i = 0, l = ColorMatrix.LENGTH; i < l; i++) {
                arr[i] = this._raw[i];
            }
            return arr;
        };

        /**
         * Copy the specified matrix's values to this matrix.
         * @method copy
         * @param {Array} matrix An array or ColorMatrix instance.
         * @return {ColorMatrix} The ColorMatrix instance the method is called on (useful for chaining calls.)
         * @chainable
         **/
        public copy(matrix: number[]): ColorMatrix {
            let l = ColorMatrix.LENGTH;
            for (let i = 0; i < l; i++) {
                this._raw[i] = matrix[i];
            }
            return this;
        };

        /**
         * @method _multiplyMatrix
         * @param {Array} matrix
         * @protected
         **/
        protected _multiplyMatrix(matrix: number[]): void {
            let i, j, k, col = [];

            for (i = 0; i < 5; i++) {
                for (j = 0; j < 5; j++) {
                    col[j] = this._raw[j + i * 5];
                }
                for (j = 0; j < 5; j++) {
                    let val = 0;
                    for (k = 0; k < 5; k++) {
                        val += matrix[j + k * 5] * col[k];
                    }
                    this._raw[j + i * 5] = val;
                }
            }
        };

        /**
         * Make sure values are within the specified range, hue has a limit of 180, brightness is 255, others are 100.
         * @method _cleanValue
         * @param {Number} value The raw number
         * @param {Number} limit The maximum that the number can be. The minimum is the limit * -1.
         * @protected
         **/
        private _cleanValue(value: number, limit: number): number {
            return Math.min(limit, Math.max(-limit, value));
        };

        /**
         * Makes sure matrixes are 5x5 (25 long).
         * @method _fixMatrix
         * @param {Array} matrix
         * @protected
         **/
        private _fixMatrix(matrix: ColorMatrix | number[]): number[] {
            if (matrix instanceof ColorMatrix) { matrix = matrix.toArray(); }
            if (matrix.length < ColorMatrix.LENGTH) {
                matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
            } else if (matrix.length > ColorMatrix.LENGTH) {
                matrix = matrix.slice(0, ColorMatrix.LENGTH);
            }
            return matrix;
        }
    }
}