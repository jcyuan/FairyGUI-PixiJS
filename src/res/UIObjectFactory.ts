namespace fgui {

    type ExtensionClassDictionary = {
        [key: string]: new () => GComponent
    };

    export class UIObjectFactory {

        private static packageItemExtensions: ExtensionClassDictionary = {};
        private static loaderExtension: new () => GLoader;

        public static setPackageItemExtension(url: string, type: { new(): GComponent }): void {
            UIObjectFactory.packageItemExtensions[url.substring(5)] = type;
        }

        public static setLoaderExtension(type: { new(): GLoader }): void {
            UIObjectFactory.loaderExtension = type;
        }

        public static newObject(pi: PackageItem): GObject {
            switch (pi.type) {
                case PackageItemType.Image:
                    return new GImage();

                case PackageItemType.MovieClip:
                    return new GMovieClip();

                case PackageItemType.Component:
                    let cls: { new(): GObject; } = UIObjectFactory.packageItemExtensions[pi.owner.id + pi.id];
                    if (cls)
                        return new cls();

                    let xml: utils.XmlNode = pi.owner.getItemAsset(pi) as utils.XmlNode;
                    let extention: string = xml.attributes.extention;
                    if (extention != null) {
                        switch (extention) {
                            case "Button":
                                return new GButton();

                            case "ProgressBar":
                                return new GProgressBar();

                            case "Label":
                                return new GLabel();
                                
                            case "Slider":
                                return new GSlider();

                            case "ScrollBar":
                                return new GScrollBar();

                            case "ComboBox":
                                return new GComboBox();

                            default:
                                return new GComponent();
                        }
                    }
                    else
                        return new GComponent();
            }
            return null;
        }

        /**@internal */
        static newObjectDirectly(type: string): GObject {
            switch (type) {

                case "image":
                    return new GImage();

                case "movieclip":
                    return new GMovieClip();

                case "component":
                    return new GComponent();

                case "text":
                    return new GTextField();

                case "list":
                    return new GList();
                    
                case "richtext":
                    return new GRichTextField();

                case "inputtext":
                    return new GTextInput();

                case "group":
                    return new GGroup();

                case "graph":
                    return new GGraph();

                case "loader":
                    if (UIObjectFactory.loaderExtension != null)
                        return new UIObjectFactory.loaderExtension();
                    else
                        return new GLoader();
            }
            return null;
        }
    }
}