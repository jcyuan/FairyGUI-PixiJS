namespace fgui {
    export type GlyphDictionary = {
        [key: string]: BMGlyph
    }

    export class BitmapFont {
        public id: string;
        public size: number = 0;
        public ttf: boolean;
        public glyphs: GlyphDictionary;
        public resizable: boolean;
        public colorable: boolean;

        public constructor() {
            this.glyphs = {};
        }
    }
}