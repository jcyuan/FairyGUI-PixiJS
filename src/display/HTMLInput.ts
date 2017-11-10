namespace fgui {
    export class HTMLInput {

        private $input:InputElement;
        private $singleLine:HTMLInputElement;
        private $multiLine:HTMLTextAreaElement;
        private $curEle:HTMLInputElement | HTMLTextAreaElement;

        /**@internal */
        $wrapper:HTMLDivElement;
        private $delegateDiv:HTMLDivElement;
        private $canvas:HTMLCanvasElement;

        /**@internal */
        $requestToShow:boolean = false;
        /**@internal */
        $scaleX:number = 1;
        /**@internal */
        $scaleY:number = 1;

        public static isTyping:boolean = false;
        
        private constructor() {}

        private static $instance:HTMLInput;

        public static get inst():HTMLInput {
            if(!HTMLInput.$instance)
                HTMLInput.$instance = new HTMLInput();
            return HTMLInput.$instance;
        }

        public initialize(container:HTMLElement, view:HTMLCanvasElement):void {
            this.$canvas = view;
            let div;
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

                GRoot.inst.on(fgui.InteractiveEvents.Click, this.canvasClickHandler, this);
                
                this.initInputElement(true);   //input
                this.initInputElement(false);  //textarea
            }
        }

        public isInputOn():boolean {
            return this.$input != null;
        }

        private canvasClickHandler(e:Event):void {
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
        }

        public isInputShown():boolean {
            return this.$input != null;
        }
        
        public isCurrentInput(input:InputElement):boolean {
            return this.$input == input;
        }
        
        private initDomPos(dom:HTMLElement):void {
            dom.style.position = "absolute";
            dom.style.left = "0px";
            dom.style.top = "0px";
            dom.style.border = "none";
            dom.style.padding = "0";
        }

        private setTransform(el:HTMLElement, origin:string, transform?:string):void {
            let style:any = el.style;
            style.transformOrigin = style.webkitTransformOrigin = style.msTransformOrigin = style.mozTransformOrigin = style.oTransformOrigin = origin;
            if(transform && transform.length > 0)
                style.transform = style.webkitTransform = style.msTransform = style.mozTransform = style.oTransform = transform;
        }
        
        /**@internal */
        $updateSize(sx:number, sy:number):void {
            if(!this.$canvas)
                return;

            this.$scaleX = sx;
            this.$scaleY = sy;

            this.$delegateDiv.style.left = this.$canvas.style.left;
            this.$delegateDiv.style.top = this.$canvas.style.top;

            let cvsStyle:any = this.$canvas.style;
            this.setTransform(this.$delegateDiv, "0% 0% 0px", cvsStyle.transform || cvsStyle.webkitTransform || cvsStyle.msTransform || cvsStyle.mozTransform || cvsStyle.oTransform);
        }
        
        private initInputElement(multiline:boolean):void {
            let inputElement:HTMLInputElement | HTMLTextAreaElement;
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
            let style:any = inputElement.style;
            style.outline = "thin";
            style.background = "none";
            style.overflow = "hidden";
            style.wordBreak = "break-all";
            style.opacity = 0;

            inputElement.oninput = (e) => {
                if (this.$input)
                    this.$input.onInputHandler();
            };
        }

        public show():void {
            GTimer.inst.callLater(() => {
                this.$curEle.style.opacity = "1";
            }, this);
        }

        public disconnect(ele:InputElement):void {
            if (this.$input == null || this.$input == ele) {
                this.clearInputElement();

                if (this.$curEle)
                    this.$curEle.blur();
            }
        }

        public clearAttributes(obj:any):void {
            if(this.$curEle) {
                for(let key in obj) {
                    this.$curEle.removeAttribute(key);
                }
            }
        }
        
        public clearInputElement():void {
            if (this.$curEle) {
                this.$curEle.value = "";

                this.$curEle.onblur = null;
                let style = this.$curEle.style;
                style.width = "1px";
                style.height = "12px";
                style.left = "0px";
                style.top = "0px";
                style.opacity = "0";

                let el2;
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
        }

        public requestInput(ele:InputElement):HTMLInputElement | HTMLTextAreaElement {
            this.clearInputElement();
            this.$input = ele;
            HTMLInput.isTyping = true;
            
            let el2;
            if(this.$input.textField.multipleLine) {
                this.$curEle = this.$multiLine;
                el2 = this.$singleLine;
            }
            else {
                this.$curEle = this.$singleLine;
                el2 = this.$multiLine;
            }
            el2.style.display = "none";

            return this.$curEle;
        }
    }
}