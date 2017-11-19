namespace fgui {

    export class LineInfo {
        public width: number = 0;
        public height: number = 0;
        public textHeight: number = 0;
        public text: string;
        public y: number = 0;

        private static pool: LineInfo[] = [];

        public static get(): LineInfo {
            if (LineInfo.pool.length) {
                let ret: LineInfo = LineInfo.pool.pop();
                ret.width = 0;
                ret.height = 0;
                ret.textHeight = 0;
                ret.text = null;
                ret.y = 0;
                return ret;
            }
            else
                return new LineInfo();
        }

        public static recycle(value: LineInfo): void {
            LineInfo.pool.push(value);
        }

        public static recycleMany(value: LineInfo[]): void {
            if(value && value.length)
            {
                value.forEach(v => {
                    LineInfo.pool.push(v);
                }, this);
            }
            value.length = 0;
        }
    }

    export class GTextField extends GObject implements IColorGear, IColorableTitle {

        protected $textField: UITextField;
        protected $btContainer: UIContainer;
        protected $bitmapFont: BitmapFont;
        protected $lines: LineInfo[];
        protected $bitmapPool: PIXI.Sprite[];
        protected $font: string;   //could be either fontFamily or an URI pointed to a bitmap font resource
        protected $leading: number = 0;

        protected $style: PIXI.TextStyle;
        protected $verticalAlign: VertAlignType = VertAlignType.Top;
        protected $offset: PIXI.Point = new PIXI.Point();
        protected $color: number;
        protected $singleLine:boolean = true;

        protected $text: string = "";

        protected $autoSize: AutoSizeType;
        protected $widthAutoSize: boolean;
        protected $heightAutoSize: boolean;

        protected $requireRender: boolean;
        protected $updatingSize: boolean;
        protected $sizeDirty: boolean;

        protected $textWidth: number = 0;
        protected $textHeight: number = 0;

        protected static GUTTER_X: number = 2;
        protected static GUTTER_Y: number = 2;

        public constructor() {
            super();

            this.$style = new PIXI.TextStyle({
                fontSize: 12,
                fontFamily: UIConfig.defaultFont,
                align: AlignType.Left,
                leading: 3,
                fill: 0
            });
            this.$verticalAlign = VertAlignType.Top;
            this.$text = "";
            this.$autoSize = AutoSizeType.Both;
            this.$widthAutoSize = true;
            this.$heightAutoSize = true;

            this.$bitmapPool = [];

            this.touchable = false;  //base GTextField has no interaction
        }

        protected createDisplayObject(): void {
            this.$textField = new UITextField(this);
            this.setDisplayObject(this.$textField);
        }

        private switchBitmapMode(val: boolean): void {
            if (val && this.displayObject == this.$textField) {
                if (this.$btContainer == null)
                    this.$btContainer = new UIContainer(this);
                this.switchDisplayObject(this.$btContainer);
            }
            else if (!val && this.displayObject == this.$btContainer)
                this.switchDisplayObject(this.$textField);
        }

        public dispose(): void {
            GTimer.inst.remove(this.$render, this);
            this.$bitmapFont = null;
            this.$bitmapPool.length = 0;
            this.$bitmapPool = null;
            this.$style = null;
            super.dispose();
        }

        public set text(value:string) {
            this.setText(value);

        }
        protected setText(value: string):void {
            if(value == null) value = "";
            if (this.$text == value) return;
            this.$text = value;
            this.updateGear(GearType.Text);
            if (this.parent && this.parent.$inProgressBuilding)
                this.renderNow();
            else
                this.render();
        }

        public get text(): string {
            return this.getText();
        }

        protected getText():string {
            return this.$text;
        }

        public get color(): number {
            return this.getColor();
        }

        protected getColor():number {
            return this.$color;
        }

        protected setColor(value:number):void {
            if (this.$color != value) {
                this.$color = value;
                this.updateGear(GearType.Color);
                this.$style.fill = this.$color;
                this.render();
            }
        }

        public set color(value: number) {
            this.setColor(value);
        }

        public get titleColor(): number {
            return this.color;
        }

        public set titleColor(value: number) {
            this.color = value;
        }

        public get font(): string {
            return this.$font || UIConfig.defaultFont;
        }

        public set font(value: string) {
            if (this.$font != value) {
                this.$font = value;
                if (this.$font && utils.StringUtil.startsWith(this.$font, "ui://"))
                    this.$bitmapFont = UIPackage.getBitmapFontByURL(this.$font);
                else
                    this.$style.fontFamily = this.$font || UIConfig.defaultFont;
                this.render();
            }
        }

        public get fontSize(): number {
            return +this.$style.fontSize;
        }

        public set fontSize(value: number) {
            if (value <= 0)
                return;
            if (this.$style.fontSize != value) {
                this.$style.fontSize = value;
                this.render();
            }
        }

        public get align(): AlignType {
            return this.$style.align as AlignType;
        }

        public set align(value: AlignType) {
            if (this.$style.align != value) {
                this.$style.align = value;
                this.render();
            }
        }

        public get verticalAlign(): VertAlignType {
            return this.$verticalAlign;
        }

        public set verticalAlign(value: VertAlignType) {
            if (this.$verticalAlign != value) {
                this.$verticalAlign = value;
                if(!this.$inProgressBuilding)
                    this.layoutAlign();
            }
        }

        public get leading(): number {
            return this.$leading;
        }

        public set leading(value: number) {
            if (this.$leading != value) {
                this.$leading = value;
                this.$style.leading = this.$leading;
                this.render();
            }
        }

        public get letterSpacing(): number {
            return this.$style.letterSpacing;
        }

        public set letterSpacing(value: number) {
            if (this.$style.letterSpacing != value) {
                this.$style.letterSpacing = value;
                this.render();
            }
        }

        public get underline(): boolean {
            return false;   //TODO: not supported yet
        }

        public set underline(value: boolean) {
            //TODO: not supported yet
        }

        public get bold(): boolean {
            return this.$style.fontWeight == "bold";
        }

        public set bold(value: boolean) {
            let v: string = value === true ? "bold" : "normal";
            if (this.$style.fontWeight != v) {
                this.$style.fontWeight = v;
                this.render();
            }
        }
        
        public get weight(): string {
            return this.$style.fontWeight;
        }

        public set weight(v: string) {
            if (this.$style.fontWeight != v) {
                this.$style.fontWeight = v;
                this.render();
            }
        }

        public get variant(): string {
            return this.$style.fontVariant;
        }

        public set variant(v: string) {
            if (this.$style.fontVariant != v) {
                this.$style.fontVariant = v;
                this.render();
            }
        }

        public get italic(): boolean {
            return this.$style.fontStyle == "italic";
        }

        public set italic(value: boolean) {
            let v: string = value === true ? "italic" : "normal";
            if (this.$style.fontStyle != v) {
                this.$style.fontStyle = v;
                this.render();
            }
        }

        public get multipleLine(): boolean {
            return !this.$singleLine;
        }

        public set multipleLine(value: boolean) {
            value = !value;
            if(this.$singleLine != value) {
                this.$singleLine = value;
                this.render();
            }
        }

        public get stroke(): number {
            return +this.$style.strokeThickness;
        }

        public set stroke(value: number) {
            if (this.$style.strokeThickness != value)
                this.$style.strokeThickness = value;
        }

        public get strokeColor(): number | string {
            return this.$style.stroke;
        }

        public set strokeColor(value: number | string) {
            if (this.$style.stroke != value)
                this.$style.stroke = value;
        }

        public set autoSize(value: AutoSizeType) {
            if (this.$autoSize != value) {
                this.$autoSize = value;
                this.$widthAutoSize = (value == AutoSizeType.Both || value == AutoSizeType.Shrink);
                this.$heightAutoSize = (value == AutoSizeType.Both || value == AutoSizeType.Height);
                this.render();
            }
        }

        public get autoSize(): AutoSizeType {
            return this.$autoSize;
        }

        public get textWidth(): number {
            if (this.$requireRender)
                this.renderNow();
            return this.$textWidth;
        }

        public get textHeight(): number {
            if (this.$requireRender)
                this.renderNow();
            return this.$textHeight;
        }

        public ensureSizeCorrect(): void {
            if (this.$sizeDirty && this.$requireRender)
                this.renderNow();
        }

        protected render(): void {
            if (!this.$requireRender) {
                this.$requireRender = true;
                GTimer.inst.callLater(this.$render, this);
            }

            if (!this.$sizeDirty && (this.$widthAutoSize || this.$heightAutoSize)) {
                this.$sizeDirty = true;
                this.emit(DisplayObjectEvent.SIZE_DELAY_CHANGE, this);
            }
        }

        private applyStyle():void {
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
        }

        private $render(): void {
            if (this.$requireRender)
                this.renderNow();
        }

        protected renderNow(updateBounds: boolean = true): void {
            this.$requireRender = false;
            this.$sizeDirty = false;

            if (this.$bitmapFont != null) {
                this.renderWithBitmapFont(updateBounds);
                return;
            }

            this.switchBitmapMode(false);
            
            this.applyStyle();
            this.$textField.$updateMinHeight();
            let wordWrap = !this.$widthAutoSize && this.multipleLine;
            this.$textField.width = this.$textField.style.wordWrapWidth = (wordWrap || this.autoSize == AutoSizeType.None) ? Math.ceil(this.width) : 10000;
            this.$textField.style.wordWrap = wordWrap;
            this.$textField.style.breakWords = wordWrap;
            this.$textField.text = this.$text;         //trigger t.dirty = true
            
            this.$textWidth = Math.ceil(this.$textField.textWidth);
            if (this.$textWidth > 0)
                this.$textWidth += 4;   //margin gap
            this.$textHeight = Math.ceil(this.$textField.textHeight);
            if (this.$textHeight > 0)
                this.$textHeight += 4;  //margin gap

            let w = this.width, h = this.height;
            if(this.autoSize == AutoSizeType.Shrink)
                this.shrinkTextField();
            else
            {
                this.$textField.scale.set(1, 1);
                if (this.$widthAutoSize) {
                    w = this.$textWidth;
                    this.$textField.width = w;
                }
                else
                {
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
        }

        private renderWithBitmapFont(updateBounds: boolean): void {
            this.switchBitmapMode(true);

            this.$btContainer.children.forEach((c, i) => {
                this.$bitmapPool.push(this.$btContainer.getChildAt(i) as PIXI.Sprite);
            }, this);
            this.$btContainer.removeChildren();

            if (!this.$lines)
                this.$lines = [];
            else
                LineInfo.recycleMany(this.$lines);

            let letterSpacing: number = this.letterSpacing;
            let lineSpacing: number = this.leading - 1;
            let rectWidth: number = this.width - GTextField.GUTTER_X * 2;
            let lineWidth: number = 0, lineHeight: number = 0, lineTextHeight: number = 0;
            let glyphWidth: number = 0, glyphHeight: number = 0;
            let wordChars: number = 0, wordStart: number = 0, wordEnd: number = 0;
            let lastLineHeight: number = 0;
            let lineBuffer: string = "";
            let lineY: number = GTextField.GUTTER_Y;
            let line: LineInfo;
            let wordWrap: boolean = !this.$widthAutoSize && this.multipleLine;
            let fontScale: number = this.$bitmapFont.resizable ? this.fontSize / this.$bitmapFont.size : 1;
            let glyph: BMGlyph;

            this.$textWidth = 0;
            this.$textHeight = 0;

            let textLength: number = this.text.length;
            for (let offset: number = 0; offset < textLength; ++offset) {
                let ch: string = this.$text.charAt(offset);
                let cc: number = ch.charCodeAt(offset);

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

                    if (lineBuffer.length == 0) {//the line cannt fit even a char
                        line.text = ch;
                    }
                    else if (wordChars > 0 && wordEnd > 0) {//if word had broken, move it to new line
                        lineBuffer += ch;
                        let len: number = lineBuffer.length - wordChars;
                        line.text = utils.StringUtil.trimRight(lineBuffer.substr(0, len));
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
                || this.$lines.length > 0 && utils.StringUtil.endsWith(this.$lines[this.$lines.length - 1].text, "\n")) {
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

            let count: number = this.$lines.length;
            if (count == 0) {
                this.$textHeight = 0;
            }
            else {
                line = this.$lines[this.$lines.length - 1];
                this.$textHeight = line.y + line.height + GTextField.GUTTER_Y;
            }

            let w: number, h: number = 0;
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
            this.$lines.forEach(line => {

                let charX = GTextField.GUTTER_X;
                let lineIndent: number = 0;
                let charIndent: number = 0;

                if (this.align == AlignType.Center)
                    lineIndent = (rectWidth - line.width) / 2;
                else if (this.align == AlignType.Right)
                    lineIndent = rectWidth - line.width;
                else
                    lineIndent = 0;

                textLength = line.text.length;
                for (let j: number = 0; j < textLength; j++) {
                    let ch = line.text.charAt(j);

                    glyph = this.$bitmapFont.glyphs[ch];
                    if (glyph != null) {
                        charIndent = (line.height + line.textHeight) / 2 - Math.ceil(glyph.lineHeight * fontScale);
                        let bm: PIXI.Sprite;
                        if (this.$bitmapPool.length)
                            bm = this.$bitmapPool.pop();
                        else
                            bm = new PIXI.Sprite();
                        bm.x = charX + lineIndent + Math.ceil(glyph.offsetX * fontScale);
                        bm.y = line.y + charIndent + Math.ceil(glyph.offsetY * fontScale);
                        bm.texture = glyph.texture;
                        bm.scale.set(fontScale, fontScale);
                        bm.tint = this.$color;
                        this.$btContainer.addChild(bm);

                        charX += letterSpacing + Math.ceil(glyph.advance * fontScale);
                    }
                    else if (ch == " ") {
                        charX += letterSpacing + Math.ceil(this.$bitmapFont.size * fontScale / 2);
                    }
                    else {
                        charX += letterSpacing;
                    }
                }
            });
        }

        public localToGlobal(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            ax -= this.$offset.x;
            ay -= this.$offset.y;
            return super.localToGlobal(ax, ay, resultPoint);
        }

        public globalToLocal(ax: number = 0, ay: number = 0, resultPoint?: PIXI.Point): PIXI.Point {
            let r = super.globalToLocal(ax, ay, resultPoint);
            r.x -= this.$offset.x;
            r.y -= this.$offset.y;
            return r;
        }

        protected handleSizeChanged(): void {
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
                    if(this.$autoSize == AutoSizeType.Shrink)
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
        }

        protected shrinkTextField():void {
            let fitScale = Math.min(1, this.width / this.$textWidth);
            this.$textField.scale.set(fitScale, fitScale);
        }

        protected layoutAlign(): void {
            let tw = this.$textWidth, th = this.$textHeight;
            if(this.autoSize == AutoSizeType.Shrink)
            {
                tw *= this.displayObject.scale.x;
                th *= this.displayObject.scale.y;
            }
            if (this.$verticalAlign == VertAlignType.Top || th == 0)
                this.$offset.y = GTextField.GUTTER_Y;
            else {
                let dh: number = Math.max(0, this.height - th);
                if (this.$verticalAlign == VertAlignType.Middle)
                    this.$offset.y = dh * .5;
                else if(this.$verticalAlign == VertAlignType.Bottom)
                    this.$offset.y = dh;
            }
            
            let xPos = 0;
            switch(this.$style.align)
            {
                case "center":
                    xPos = (this.width - tw) * .5;
                    break;
                case "right":
                    xPos = this.width - tw;
                    break;
            }
            this.$offset.x = xPos;

            this.updatePosition();
        }

        private updatePosition():void {
            this.displayObject.position.set(Math.floor(this.x + this.$offset.x), Math.floor(this.y + this.$offset.y));
        }

        protected handleXYChanged(): void {
            super.handleXYChanged();
            if (this.$displayObject)
                this.updatePosition();
        }

        public setupBeforeAdd(xml: utils.XmlNode): void {
            super.setupBeforeAdd(xml);

            let str: string = xml.attributes.font;
            if(str)
                this.font = str;

            str = xml.attributes.fontSize;
            if (str)
                this.fontSize = parseInt(str);

            str = xml.attributes.color;
            if (str)
                this.color = utils.StringUtil.convertFromHtmlColor(str);

            str = xml.attributes.align;
            if (str)
                this.align = ParseAlignType(str);

            str = xml.attributes.vAlign;
            if (str)
                this.verticalAlign = ParseVertAlignType(str);

            str = xml.attributes.leading;
            if (str)
                this.leading = parseInt(str);

            str = xml.attributes.letterSpacing;
            if (str)
                this.letterSpacing = parseInt(str);

            str = xml.attributes.autoSize;
            if (str) {
                this.autoSize = ParseAutoSizeType(str);
                this.$widthAutoSize = (this.$autoSize == AutoSizeType.Both || this.$autoSize == AutoSizeType.Shrink);
                this.$heightAutoSize = (this.$autoSize == AutoSizeType.Both || this.$autoSize == AutoSizeType.Height);
            }

            this.underline = xml.attributes.underline == "true";
            this.italic = xml.attributes.italic == "true";
            this.bold = xml.attributes.bold == "true";
            this.multipleLine = xml.attributes.singleLine != "true";
            str = xml.attributes.strokeColor;
            if (str) {
                this.strokeColor = utils.StringUtil.convertFromHtmlColor(str);
                str = xml.attributes.strokeSize;
                if (str)
                    this.stroke = parseInt(str) + 1;
                else
                    this.stroke = 2;
            }
        }

        public setupAfterAdd(xml: utils.XmlNode): void {
            super.setupAfterAdd(xml);
            let str: string = xml.attributes.text;
            if (str != null && str.length > 0)
                this.text = str;
            this.$sizeDirty = false;
        }
    }
}