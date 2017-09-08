namespace fgui {

    export class UISprite extends PIXI.Graphics implements IUIObject {

        public UIOwner:GObject;

        public constructor(owner?:GObject) {
            super();
            this.UIOwner = owner;
            this.interactive = false;
            this.interactiveChildren = false;
        }
    }
}