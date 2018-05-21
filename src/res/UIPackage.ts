namespace fgui {

    export type AssetTypes = PIXI.Texture | BitmapFont | Frame[] | utils.XmlNode | PIXI.loaders.Resource;

    type UIPackageDictionary = {
        [key: string]: UIPackage
    }

    type PackageItemDictionary = {
        [key: string]: PackageItem
    }

    type BitmapFontDictionary = {
        [key: string]: BitmapFont
    }

    type ResDataDictionary = {
        [key: string]: string
    }

    class AtlasConfig {
        public atlasName: string;
        public texCacheID: string;
        public frame: PIXI.Rectangle;
        public orig: PIXI.Rectangle;
        public trim: PIXI.Rectangle;
        public rotate: number;
        public constructor(atlasName: string, frame?: PIXI.Rectangle, orig?: PIXI.Rectangle, trim?: PIXI.Rectangle, rotate?: number) {
            this.atlasName = atlasName;
            this.frame = frame;
            this.orig = orig;
            this.trim = trim;
            this.rotate = rotate;
        }
    }

    type AtlasDictionary = {
        [key: string]: AtlasConfig
    }

    type StringSource = {
        [key: string]: string
    }
    type StringSourceMap = {
        [key: string]: StringSource
    }

    export class UIPackage {
        private $id: string;
        private $name: string;
        private $resKey: string;

        private $items: PackageItem[];
        private $itemsById: PackageItemDictionary;
        private $itemsByName: PackageItemDictionary;

        private $resData: ResDataDictionary;
        private $customId: string;
        private $atlasConfigs: AtlasDictionary;

        /**@internal */
        static $constructingObjects: number = 0;

        private static $packageInstById: UIPackageDictionary = {};
        private static $packageInstByName: UIPackageDictionary = {};
        private static $bitmapFonts: BitmapFontDictionary = {};

        private static $stringsSource: StringSourceMap = null;

        private static sep0: string = ",";
        private static sep1: string = "\n";
        private static sep2: string = " ";
        private static sep3: string = "=";

        public constructor() {
            this.$items = [];
            this.$atlasConfigs = {};
        }

        public static getById(id: string): UIPackage {
            return UIPackage.$packageInstById[id];
        }

        public static getByName(name: string): UIPackage {
            return UIPackage.$packageInstByName[name];
        }

        public static addPackage(resKey: string): UIPackage {
            let pkg: UIPackage = new UIPackage();
            pkg.create(resKey);
            UIPackage.$packageInstById[pkg.id] = pkg;
            UIPackage.$packageInstByName[pkg.name] = pkg;
            pkg.customId = resKey;
            return pkg;
        }

        public static removePackage(packageId: string): void {
            let pkg: UIPackage = UIPackage.$packageInstById[packageId];
            pkg.dispose();
            delete UIPackage.$packageInstById[pkg.id];
            if (pkg.$customId != null)
                delete UIPackage.$packageInstById[pkg.$customId];
            delete UIPackage.$packageInstByName[pkg.name];
        }

        public static createObject(pkgName: string, resName: string, userClass?: { new():GObject }): GObject {
            let pkg: UIPackage = UIPackage.getByName(pkgName);
            if (pkg)
                return pkg.createObject(resName, userClass);
            else
                return null;
        }

        public static createObjectFromURL(url: string, userClass?: { new():GObject }): GObject {
            let pi: PackageItem = UIPackage.getItemByURL(url);
            if (pi)
                return pi.owner.internalCreateObject(pi, userClass);
            else
                return null;
        }

        public static getItemURL(pkgName: string, resName: string): string {
            let pkg: UIPackage = UIPackage.getByName(pkgName);
            if (!pkg)
                return null;

            let pi: PackageItem = pkg.$itemsByName[resName];
            if (!pi)
                return null;

            return `ui://${pkg.id}${pi.id}`;
        }

        public static getItemByURL(url: string): PackageItem {
            let pos1: number = url.indexOf("//");
            if (pos1 == -1)
                return null;

            let pos2: number = url.indexOf("/", pos1 + 2);
            let pkg: UIPackage;
            if (pos2 == -1) {
                if (url.length > 13) {
                    let pkgId: string = url.substr(5, 8);
                    pkg = UIPackage.getById(pkgId);
                    if (pkg != null) {
                        let srcId: string = url.substr(13);
                        return pkg.getItemById(srcId);
                    }
                }
            }
            else {
                let pkgName: string = url.substr(pos1 + 2, pos2 - pos1 - 2);
                pkg = UIPackage.getByName(pkgName);
                if (pkg != null) {
                    let srcName: string = url.substr(pos2 + 1);
                    return pkg.getItemByName(srcName);
                }
            }

            return null;
        }

        public static getBitmapFontByURL(url: string): BitmapFont {
            return UIPackage.$bitmapFonts[url];
        }

        public static setStringsSource(source: string): void {
            UIPackage.$stringsSource = {};
            let xmlroot: utils.XmlNode = utils.XmlParser.tryParse(source);
            xmlroot.children.forEach(cxml => {
                if (cxml.nodeName == "string")
                {
                    let key: string = cxml.attributes.name;
                    let i: number = key.indexOf("-");
                    if (i == -1) return;

                    let text: string = cxml.children.length > 0 ? cxml.children[0].text : "";

                    let key2: string = key.substr(0, i);
                    let key3: string = key.substr(i + 1);
                    let col: StringSource = UIPackage.$stringsSource[key2];
                    if (!col) {
                        col = {};
                        UIPackage.$stringsSource[key2] = col;
                    }
                    col[key3] = text;
                }
            });
        }

        /**
         * format the URL from old version to new version
         * @param url url with old version format
         */
        public static normalizeURL(url: string): string {
            if (url == null)
                return null;

            let pos1: number = url.indexOf("//");
            if (pos1 == -1)
                return null;

            let pos2: number = url.indexOf("/", pos1 + 2);
            if (pos2 == -1)
                return url;

            let pkgName: string = url.substr(pos1 + 2, pos2 - pos1 - 2);
            let srcName: string = url.substr(pos2 + 1);
            return UIPackage.getItemURL(pkgName, srcName);
        }

        private create(resKey: string): void {
            this.$resKey = resKey;

            let buf: PIXI.loaders.Resource = utils.AssetLoader.resourcesPool[this.$resKey];
            if (!buf)
                buf = utils.AssetLoader.resourcesPool[`${this.$resKey}_fui`];
            if (!buf)
                throw new Error(`Resource '${this.$resKey}' not found, please make sure that you use "new fgui.utils.AssetLoader" to load resources instead of " PIXI.loaders.Loader".`);

            if (!buf.data || !(buf.data instanceof ArrayBuffer))
                throw new Error(`Resource '${this.$resKey}' is not a proper binary resource, please load it as binary format by calling yourLoader.add(name, url, { loadType:PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })`);

            this.decompressPackage(buf.data);

            let str = this.getResDescriptor("sprites.bytes");
            str && str.split(UIPackage.sep1).forEach((str, index) => {
                if(index >= 1 && str && str.length)
                {
                    let arr: string[] = str.split(UIPackage.sep2);

                    let texID: string;
                    let itemId: string = arr[0];
                    let binIndex: number = parseInt(arr[1]);
                    if (binIndex >= 0)
                        texID = `atlas${binIndex}`;
                    else
                    {
                        let pos: number = itemId.indexOf("_");
                        if (pos == -1)
                            texID = `atlas_${itemId}`;
                        else
                            texID = `atlas_${itemId.substr(0, pos)}`;
                    }

                    let cfg: AtlasConfig = new AtlasConfig(texID);
                    cfg.frame = new PIXI.Rectangle(parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), parseInt(arr[5]));
                    /*
                    //just ignored for now - editor not support
                    let rotate:boolean = arr[6] == "1";  
                    let trimed:PIXI.Rectangle = ; //ignored for now - editor not support
                    cfg.orig = orig;
                    cfg.trim = trimed;
                    cfg.rotate = rotate ? 2 : 0;*/
                    this.$atlasConfigs[itemId] = cfg;
                }
            });
            
            str = this.getResDescriptor("package.xml");
            let xml: utils.XmlNode = utils.XmlParser.tryParse(str);

            this.$id = xml.attributes.id;
            this.$name = xml.attributes.name;

            let resources: utils.XmlNode[] = xml.children[0].children;

            this.$itemsById = {};
            this.$itemsByName = {};
            
            resources.forEach(cxml => {
                let pi = new PackageItem();
                pi.type = ParsePackageItemType(cxml.nodeName);
                pi.id = cxml.attributes.id;
                pi.name = cxml.attributes.name;
                pi.file = cxml.attributes.file;
                str = cxml.attributes.size;
                if (str) {
                    let arr = str.split(UIPackage.sep0);
                    pi.width = parseInt(arr[0]);
                    pi.height = parseInt(arr[1]);
                }
                switch (pi.type) {
                    case PackageItemType.Image: {
                        str = cxml.attributes.scale;
                        if (str == "9grid") {
                            str = cxml.attributes.scale9grid;
                            if (str) {
                                let arr = str.split(UIPackage.sep0);
                                let rect = new PIXI.Rectangle(
                                    parseInt(arr[0]),
                                    parseInt(arr[1]),
                                    parseInt(arr[2]),
                                    parseInt(arr[3])
                                );
                                pi.scale9Grid = rect;

                                str = cxml.attributes.gridTile;
                                if (str)
                                    pi.tiledSlices = parseInt(str);
                            }
                        }
                        else if (str == "tile")
                            pi.scaleByTile = true;

                        break;
                    }
                }

                pi.owner = this;
                this.$items.push(pi);
                this.$itemsById[pi.id] = pi;
                if (pi.name != null)
                    this.$itemsByName[pi.name] = pi;
            }, this);
            
            this.$items.forEach(pi => {
                if (pi.type == PackageItemType.Font) {
                    this.loadFont(pi);
                    UIPackage.$bitmapFonts[pi.bitmapFont.id] = pi.bitmapFont;
                }
            }, this);
        }

        private decompressPackage(buf: ArrayBuffer): void {
            this.$resData = {};

            let inflater: Zlib.RawInflate = new Zlib.RawInflate(buf);
            let data: Uint8Array = inflater.decompress();
            let source: string = utils.RawByte.decodeUTF8(data);
            let curr: number = 0;
            let fn: string;
            let size: number;
            while (true) {
                let pos: number = source.indexOf("|", curr);
                if (pos == -1)
                    break;
                fn = source.substring(curr, pos);
                curr = pos + 1;
                pos = source.indexOf("|", curr);
                size = parseInt(source.substring(curr, pos));
                curr = pos + 1;
                this.$resData[fn] = source.substr(curr, size);
                curr += size;
            }
        }

        public dispose(): void {
            this.$items.forEach(pi => {
                let texture: PIXI.Texture = pi.texture;
                if (texture != null) {
                    texture.destroy();
                    //texture.baseTexture.destroy();
                    PIXI.Texture.removeFromCache(texture);
                }
                else if (pi.frames != null) {
                    pi.frames.forEach(f => {
                        texture = f.texture;
                        if(texture)
                        {
                            texture.destroy();
                            //texture.baseTexture.destroy();
                            PIXI.Texture.removeFromCache(texture);
                        }
                    });
                }
                else if (pi.bitmapFont != null)
                    delete UIPackage.$bitmapFonts[pi.bitmapFont.id];
                    
                let cfg = this.$atlasConfigs[pi.id];
                if(cfg)
                    utils.AssetLoader.destroyResource(`${this.$resKey}@${cfg.atlasName}`);
            }, this);

            utils.AssetLoader.destroyResource(`${this.$resKey}`);
        }

        public get id(): string {
            return this.$id;
        }

        public get name(): string {
            return this.$name;
        }

        public get customId(): string {
            return this.$customId;
        }

        public set customId(value: string) {
            if (this.$customId != null)
                delete UIPackage.$packageInstById[this.$customId];
            this.$customId = value;
            if (this.$customId != null)
                UIPackage.$packageInstById[this.$customId] = this;
        }

        public createObject(resName: string, userClass?: { new():GObject }): GObject {
            let pi: PackageItem = this.$itemsByName[resName];
            if (pi)
                return this.internalCreateObject(pi, userClass);
            else
                return null;
        }

        public internalCreateObject(item: PackageItem, userClass: { new(): GObject; } = null): GObject {
            let g: GObject = item.type == PackageItemType.Component && userClass != null ? new userClass() : UIObjectFactory.newObject(item);
            if (g == null)
                return null;

            UIPackage.$constructingObjects++;
            g.packageItem = item;
            g.constructFromResource();
            UIPackage.$constructingObjects--;
            return g;
        }

        public getItemById(itemId: string): PackageItem {
            return this.$itemsById[itemId];
        }

        public getItemByName(resName: string): PackageItem {
            return this.$itemsByName[resName];
        }

        public getItemAssetByName(resName: string): AssetTypes {
            let pi: PackageItem = this.$itemsByName[resName];
            if (pi == null)
                throw new Error(`Resource '${resName}' not found`);
            return this.getItemAsset(pi);
        }

        private createSpriteTexture(cfgName:string, cfg: AtlasConfig): PIXI.Texture {
            let atlasItem: PackageItem = this.$itemsById[cfg.atlasName];
            if (atlasItem != null) {
                let atlasTexture: PIXI.Texture = this.getItemAsset(atlasItem) as PIXI.Texture;
                if (!atlasTexture || !atlasTexture.baseTexture) return null;
                if(!cfg.texCacheID)
                    cfg.texCacheID = `${this.$resKey}@${cfg.atlasName}@${cfgName}`;

                let tex = PIXI.utils.TextureCache[cfg.texCacheID];
                if(!tex)
                {
                    tex = new PIXI.Texture(atlasTexture.baseTexture, cfg.frame, cfg.orig, cfg.trim, cfg.rotate);
                    PIXI.Texture.addToCache(tex, cfg.texCacheID);
                }
                return tex;
            }
            else
                return null;
        }

        public getItemAsset(item: PackageItem): AssetTypes {
            switch (item.type) {
                case PackageItemType.Image:
                    if (!item.decoded) {
                        item.decoded = true;
                        let cfg: AtlasConfig = this.$atlasConfigs[item.id];
                        if (cfg != null)
                            item.texture = this.createSpriteTexture(item.id, cfg);
                    }
                    return item.texture;

                case PackageItemType.Atlas:
                    if (!item.decoded) {
                        item.decoded = true;
                        let fileName: string = (item.file != null && item.file.length > 0) ? item.file : (`${item.id}.png`);
                        let resName: string = `${this.$resKey}@${utils.StringUtil.getFileName(fileName)}`;
                        let res: PIXI.loaders.Resource = utils.AssetLoader.resourcesPool[resName];
                        if (!res) throw new Error(`${resName} not found in fgui.utils.AssetLoader.resourcesPool, please use new AssetLoader() to load assets instead of using new PIXI.loaders.Loader(). besides, AssetLoader is a sub-class from PIXI.loaders.Loader so they have the same usage.`);
                        item.texture = res.texture;
                        if (!item.texture) {
                            res = utils.AssetLoader.resourcesPool[`${this.$resKey}@${fileName.replace("\.", "_")}`];
                            item.texture = res.texture;
                        }
                    }
                    return item.texture;

                case PackageItemType.Sound:   //ignored, maybe integrate with PIXI.Sound
                    item.decoded = false;
                    return null;

                case PackageItemType.Font:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadFont(item);
                    }
                    return item.bitmapFont;

                case PackageItemType.MovieClip:
                    if (!item.decoded) {
                        item.decoded = true;
                        this.loadMovieClip(item);
                    }
                    return item.frames;

                case PackageItemType.Component:
                    if (!item.decoded) {
                        item.decoded = true;
                        let str: string = this.getResDescriptor(`${item.id}.xml`);
                        let xml: utils.XmlNode = utils.XmlParser.tryParse(str);
                        item.componentData = xml;
                        this.loadComponentChildren(item);
                        this.loadComponentTranslation(item);
                    }
                    return item.componentData;

                default:
                    return utils.AssetLoader.resourcesPool[`${this.$resKey}@${item.id}`];
            }
        }

        private loadComponentChildren(item: PackageItem): void {
            let listNode: utils.XmlNode[] = utils.XmlParser.getChildNodes(item.componentData, "displayList");
            if (listNode != null && listNode.length > 0) {
                item.displayList = [];
                listNode[0].children.forEach(cxml => {
                    let tagName: string = cxml.nodeName;
                    let di: DisplayListItem;
                    let src: string = cxml.attributes.src;
                    if (src) {
                        let pkgId: string = cxml.attributes.pkg;
                        let pkg: UIPackage;
                        if (pkgId && pkgId != item.owner.id)
                            pkg = UIPackage.getById(pkgId);
                        else
                            pkg = item.owner;

                        let pi: PackageItem = pkg != null ? pkg.getItemById(src) : null;
                        if (pi != null)
                            di = new DisplayListItem(pi, null);
                        else
                            di = new DisplayListItem(null, tagName);
                    }
                    else {
                        if (tagName == "text" && cxml.attributes.input == "true")
                            di = new DisplayListItem(null, "inputtext");
                        else
                            di = new DisplayListItem(null, tagName);
                    }

                    di.desc = cxml;
                    item.displayList.push(di);
                });
            }
            else
                item.displayList = [];
        }

        private getResDescriptor(fn: string): string {
            return this.$resData[fn];
        }

        private loadComponentTranslation(item: PackageItem): void {
            if (UIPackage.$stringsSource == null)
                return;

            let strings: StringSource = UIPackage.$stringsSource[this.id + item.id];
            if (strings == null)
                return;

            let value: string;
            let cxml: utils.XmlNode, dxml: utils.XmlNode;
            let ename: string;
            let elementId: string;
            let str: string;

            item.displayList.forEach(item => {

                cxml = item.desc;
                ename = cxml.nodeName;
                elementId = cxml.attributes.id;

                str = cxml.attributes.tooltips;
                if (str) {
                    value = strings[`${elementId}-tips`];
                    if (value != undefined)
                        cxml.attributes.tooltips = value;
                }

                let cs: utils.XmlNode[] = utils.XmlParser.getChildNodes(cxml, "gearText");
                dxml = cs && cs[0];
                if (dxml) {
                    value = strings[`${elementId}-texts`];
                    if (value != undefined)
                        dxml.attributes.values = value;

                    value = strings[`${elementId}-texts_def`];
                    if (value != undefined)
                        dxml.attributes.default = value;
                }

                if (ename == "text" || ename == "richtext") {
                    value = strings[elementId];
                    if (value != undefined)
                        cxml.attributes.text = value;
                    value = strings[`${elementId}-prompt`];
                    if (value != undefined)
                        cxml.attributes.prompt = value;
                }
                else if (ename == "list") {
                    cxml.children.forEach((exml, index) => {
                        if (exml.nodeName != "item")
                            return;
                        value = strings[`${elementId}-${index}`];
                        if (value != undefined)
                            exml.attributes.title = value;
                    });
                }
                else if (ename == "component") {
                    cs = utils.XmlParser.getChildNodes(cxml, "Button");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;
                        value = strings[`${elementId}-0`];
                        if (value != undefined)
                            dxml.attributes.selectedTitle = value;
                        return;
                    }

                    cs = utils.XmlParser.getChildNodes(cxml, "Label");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;
                        return;
                    }

                    cs = utils.XmlParser.getChildNodes(cxml, "ComboBox");
                    dxml = cs && cs[0];
                    if (dxml) {
                        value = strings[elementId];
                        if (value != undefined)
                            dxml.attributes.title = value;

                        dxml.children.forEach((exml, index) => {
                            if (exml.nodeName != "item")
                                return;
                            value = strings[`${elementId}-${index}`];
                            if (value != undefined)
                                exml.attributes.title = value;
                        });
                        return;
                    }
                }
            });
        }

        private loadMovieClip(item: PackageItem): void {
            let xml: utils.XmlNode = utils.XmlParser.tryParse(this.getResDescriptor(`${item.id}.xml`));
            let str: string;
            
            str = xml.attributes.interval;
            if (str != null)
                item.interval = parseInt(str);
            str = xml.attributes.swing;
            if (str != null)
                item.swing = str == "true";
            str = xml.attributes.repeatDelay;
            if (str != null)
                item.repeatDelay = parseInt(str);

            item.frames = [];
            let frameNodes: utils.XmlNode[] = xml.children[0].children;
            frameNodes.forEach((node, index) => {
                let frame: Frame = new Frame();
                str = node.attributes.rect;
                let arr = str.split(UIPackage.sep0);
                let trimRect: PIXI.Rectangle = new PIXI.Rectangle(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]));
                str = node.attributes.addDelay;
                if (str)
                    frame.addDelay = parseInt(str);
                item.frames.push(frame);
                if (trimRect.width <= 0)
                    return;
                str = node.attributes.sprite;
                if (str)
                    str = `${item.id}_${str}`;
                else
                    str = `${item.id}_${index}`;
                let cfg: AtlasConfig = this.$atlasConfigs[str];
                if(cfg != null) {
                    cfg.trim = trimRect;
                    frame.texture = this.createSpriteTexture(str, cfg);
                }
            });
        }

        private loadFont(item: PackageItem): void {
            let font: BitmapFont = new BitmapFont();
            font.id = `ui://${this.id}${item.id}`;
            let str: string = this.getResDescriptor(`${item.id}.fnt`);

            let lines: string[] = str.split(UIPackage.sep1);
            
            let kv: { [key: string]: string } = {};
            let ttf: boolean = false;
            let size: number = 0;
            let xadvance: number = 0;
            let resizable: boolean = false;
            let colorable: boolean = false;
            let atlasOffsetX: number = 0, atlasOffsetY: number = 0;
            let charImg: PackageItem;
            let mainTexture: PIXI.Texture;
            let lineHeight: number = 0;
            let maxCharHeight:number = 0;

            lines.forEach(line => {
                if(line && line.length)
                {
                    str = utils.StringUtil.trim(line);
                    let arr: string[] = str.split(UIPackage.sep2);
                    arr.forEach(v => {
                        let at = v.split(UIPackage.sep3);
                        kv[at[0]] = at[1];
                    });
                    
                    str = arr[0];
                    if (str == "char") {
                        let bg: BMGlyph = new BMGlyph();
                        bg.x = parseInt(kv.x) || 0;
                        bg.y = parseInt(kv.y) || 0;
                        bg.offsetX = parseInt(kv.xoffset) || 0;
                        bg.offsetY = parseInt(kv.yoffset) || 0;
                        bg.width = parseInt(kv.width) || 0;
                        bg.height = parseInt(kv.height) || 0;
                        maxCharHeight = Math.max(bg.height, maxCharHeight);
                        bg.advance = parseInt(kv.xadvance) || 0;
                        if (kv.chnl != undefined)
                        {
                            bg.channel = parseInt(kv.chnl);
                            if (bg.channel == 15)
                                bg.channel = 4;
                            else if (bg.channel == 1)
                                bg.channel = 3;
                            else if (bg.channel == 2)
                                bg.channel = 2;
                            else
                                bg.channel = 1;
                        }

                        if (!ttf) {
                            if (kv.img) {
                                charImg = this.$itemsById[kv.img];
                                if (charImg != null) {
                                    charImg.load();
                                    bg.width = charImg.width;
                                    bg.height = charImg.height;
                                    bg.texture = charImg.texture;
                                }
                            }
                        }
                        else if (mainTexture != null) {
                            bg.texture = new PIXI.Texture(mainTexture.baseTexture, new PIXI.Rectangle(bg.x + atlasOffsetX, bg.y + atlasOffsetY, bg.width, bg.height));
                        }

                        if (ttf)
                            bg.lineHeight = lineHeight;
                        else {
                            if (bg.advance == 0) {
                                if (xadvance == 0)
                                    bg.advance = bg.offsetX + bg.width;
                                else
                                    bg.advance = xadvance;
                            }

                            bg.lineHeight = bg.offsetY < 0 ? bg.height : (bg.offsetY + bg.height);
                            if (size > 0 && bg.lineHeight < size)
                                bg.lineHeight = size;
                        }
                        font.glyphs[String.fromCharCode(+kv.id | 0)] = bg;
                    }
                    else if (str == "info") {
                        ttf = kv.face != null;
                        if (kv.size)
                            size = parseInt(kv.size);
                        resizable = kv.resizable == "true";
                        colorable = kv.colored == "true";
                        if (ttf) {
                            let cfg: AtlasConfig = this.$atlasConfigs[item.id];
                            if (cfg != null) {
                                atlasOffsetX = cfg.frame.x;
                                atlasOffsetY = cfg.frame.y;
                                let atlasItem: PackageItem = this.$itemsById[cfg.atlasName];
                                if (atlasItem != null)
                                    mainTexture = this.getItemAsset(atlasItem) as PIXI.Texture;
                            }
                        }
                    }
                    else if (str == "common") {
                        if (kv.lineHeight)
                            lineHeight = parseInt(kv.lineHeight);
                        if (size == 0)
                            size = lineHeight;
                        else if (lineHeight == 0)
                            lineHeight = size;
                        if (kv.xadvance)
                            xadvance = parseInt(kv.xadvance);
                    }
                }
            });

            if (size == 0 && maxCharHeight > 0)
                size = maxCharHeight;
            
            font.ttf = ttf;
            font.size = size;
            font.resizable = resizable;
            font.colorable = colorable;
            item.bitmapFont = font;
        }
    }
}