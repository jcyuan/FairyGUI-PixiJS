/// <reference path="./GTextField.ts" />

namespace fgui {

    export class TextBlock {
        public text:string;
        public style:PIXI.TextStyle;
    }

    //TOOD: impl
    export class GRichTextField extends GTextField {
        
        protected $ubbEnabled: boolean;
        protected $textFlow: TextBlock[];
        
        public set ubbEnabled(value: boolean) {
            if (this.$ubbEnabled != value) {
                this.$ubbEnabled = value;
                this.render();
            }
        }

        public get ubbEnabled(): boolean {
            return this.$ubbEnabled;
        }

        public setupBeforeAdd(xml:utils.XmlNode):void
        {
            super.setupBeforeAdd(xml);
            this.$ubbEnabled = xml.attributes.ubb == "true";
        }

        public constructor() {
            super();
            
            this.$textField.interactive = true;
            this.$textField.interactiveChildren = false;
            this.on(TextEvent.LinkClick, this.$clickLink, this);
        }

        public set textFlow(flow:TextBlock[])
        {
            this.$textFlow = flow;
            this.render();
        }
        
        public set text(value: string) {
            this.$text = value;
            if(this.$text == null)
                this.$text = "";
            this.$textField.width = this.width;
            //if(this.$ubbEnabled)
                //this.textFlow = utils.StringUtil.parseUBB(this.$text);   //TODO: parser impl
            this.updateGear(GearType.Text);
            this.render();
        }
        
        private $clickLink(block: TextBlock) {
            this.emit(TextEvent.LinkClick, block.text, this);
        }

        public dispose():void {
            this.off(TextEvent.LinkClick, this.$clickLink, this);
            super.dispose();
        }
    }
}