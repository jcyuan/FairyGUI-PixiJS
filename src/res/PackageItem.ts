namespace fgui {

    export class PackageItem {

        public owner: UIPackage;

        public type: PackageItemType;
        public id: string;
        public name: string;
        public width: number = 0;
        public height: number = 0;
        public file: string;
        public decoded: boolean;

        //image
        public scale9Grid: PIXI.Rectangle;
        public scaleByTile: boolean;
        public tiledSlices: number = 0;
        public texture: PIXI.Texture;

        //movieclip
        public interval: number = 0;
        public repeatDelay: number = 0;
        public swing: boolean;
        public frames: Frame[];

        //componenet
        public componentData: utils.XmlNode;
        public displayList: DisplayListItem[];

        //font 
        public bitmapFont: BitmapFont;

        public load(): AssetTypes {
            return this.owner.getItemAsset(this);
        }

        public toString(): string {
            return this.name;
        }
    }
}