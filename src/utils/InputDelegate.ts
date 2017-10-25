namespace fgui.utils {

    export class InputDelegate {

        protected $inited:boolean = false;
        protected $textField:GTextInput;
        protected $input:InputElement;
        protected $restrictString:string = null;
        protected $restrictRegex:RegExp = null;
        protected $type:InputType;

        private $focused:boolean = false;

        public constructor(tf:GTextInput) {
            this.$textField = tf;
            this.$input = new InputElement(tf);
        }

        public initialize():void {
            if(this.$inited) return;
            
            this.$input.$addToStage();

            this.$input.on("updateText", this.updateText, this);
            this.$input.on(FocusEvent.CHANGED, this.focusHandler, this);

            this.$textField.on(fgui.InteractiveEvents.Down, this.textFieldDownHandler, this);
            
            this.$inited = true;
        }

        private textFieldDownHandler():void {
            this.$onFocus();
        }

        public destroy():void {
            if(!this.$inited) return;
            
            this.$input.$removeFromStage();

            this.$textField.off(fgui.InteractiveEvents.Down, this.textFieldDownHandler, this);
            GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
            
            this.$input.off("updateText", this.updateText, this);
            this.$input.off(FocusEvent.CHANGED, this.focusHandler, this);

            this.$inited = false;
        }

        public get text():string {
            return this.$input.text;
        }

        public set text(v:string) {
            this.$input.text = v;
        }

        public setColor(v:number) {
            return this.$input.setColor(v);
        }

        private updateText():void {
            let textValue = this.$input.text;
            let isChanged:boolean = false;
            if(this.$restrictRegex != null) {
                let result: string[] = textValue.match(this.$restrictRegex);
                if (result)
                    textValue = result.join("");
                else
                    textValue = "";
                isChanged = true;
            }
            
            if (isChanged && this.$input.text != textValue)
                this.$input.text = textValue;

            this.$textField.text = this.$input.text;

            this.$textField.emit(TextEvent.Change, this.$textField);
        }

        private onStageDown(e:PIXI.interaction.InteractionEvent):void {
            let target = fgui.GObject.castFromNativeObject(e.currentTarget);
            if(target != this.$textField)
                this.$input.$hide();
        }

        private focusHandler(type: string): void {
            if (type == "focus") {
                if (!this.$focused) {
                    this.$focused = true;
                    this.$textField.$isTyping = true;
                    this.$textField.alpha = 0;
                    this.$textField.emit(FocusEvent.CHANGED, "focus", this.$textField);
                }
            }
            else if (type == "blur") {
                if (this.$focused) {
                    this.$focused = false;
                    GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
                    this.$textField.$isTyping = false;
                    this.$textField.alpha = 1;
                    this.$input.$onBlur();
                    this.$textField.emit(FocusEvent.CHANGED, "blur", this.$textField);
                }
            }
        }

        public get isFocused():boolean {
            return this.$focused;
        }

        /**@internal */
        $getProperty(name:string):string {
            return this.$inited && this.$input.getAttribute(name) || null;
        }

        /**@internal */
        $setProperty(name:string, value:string):void {
            if(!this.$inited) return;
            this.$input.setAttribute(name, value);
        }

        get $restrict():string {
            return this.$restrictString;
        }

        set $restrict(v:string) {
            this.$restrictString = v;
            if(this.$restrictString != null && this.$restrictString.length > 0)
                this.$restrictRegex = new RegExp(this.$restrictString);
            else
                this.$restrictRegex = null;
        }

        public get type():InputType {
            return this.$type;
        }

        public set type(v:InputType) {
            if(v != this.$type)
                this.$type = v;
        }

        private tryHideInput():void {
            if (!this.$textField.visible && this.$input)
                this.$input.$removeFromStage();
        }

        /**@internal */
        $updateProperties():void {
            if (this.isFocused) {
                this.$input.resetInput();
                this.tryHideInput();
                return;
            }

            this.$input.text = this.$textField.text;
            this.$input.resetInput();
            this.tryHideInput();
        }
        

        /**@internal */
        $onFocus():void {
            if (!this.$textField.visible || this.$focused)
                return;
            
            GRoot.inst.off(fgui.InteractiveEvents.Down, this.onStageDown, this);
            GTimer.inst.callLater(() => {
                GRoot.inst.on(fgui.InteractiveEvents.Down, this.onStageDown, this);
            }, this);

            this.$input.$show();
        }
    }
}