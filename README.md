# What is this?

* This is an UILib based on PixiJS to build game GUI.
* Download editor here: [http://en.fairygui.com/product/](http://en.fairygui.com/product)
* Editor supports a few of game engines include Unity3D, PixiJS, ActionScript, Starling etc. [Learn more.](http://en.fairygui.com/)
* The developers use the editor and Lib are all here in the Tencent QQ online chat group for discussing issues: GroupID 434866637. Welcome to join us and have fun. :)

# About Lib

## Dependencies
* PixiJS [https://github.com/pixijs/pixi.js/releases](https://github.com/pixijs/pixi.js/releases)
* TweenJS [https://github.com/CreateJS/TweenJS/releases](https://github.com/CreateJS/TweenJS/releases)
* ZLib [https://github.com/imaya/zlib.js](https://github.com/imaya/zlib.js: rawinflate.js)
* TypeScript

## Demo
* Check online demo for PixiJS version (Chrome / MobilePhone): [http://jc-space.com/pixigui/](http://jc-space.com/pixigui/)
  ![PixiJS GUI Demo](http://jc-space.com/demo.png)
* Demo project can be downloaded [here.](http://res.fairygui.com/FairyGUI-PIXI-demo20170909.zip)

# About Editor

![Editor](http://www.fairygui.com/images/software.png)

## Features
* WYSWYG
* Build complex UI components easily without writing any code even no programming knowledge needed.
* No complex skin configuration. All UI elements are seperated alone and can be mixed up to build more complex components.
* Timeline tool provided for creating transitions at the design time.
* Support sequenced frame animation creating.
* Support using of bitmap fonts which created by BMFont technology, and support to create bitmap font using pictures.
* Project files are stored separately in order to suit the version controlling, and for project collaboration.
* Instant preview.
* Flexible publish strategy, support packing atlas automatically, or define many separated atlases as you want.
* Image compression with options for image quality etc, you can adjust options to reduce the size of the final package.

# How to use the Lib?

### Here is a snippet of basic usage example from the demo code: (typescript)

```typescript
class Main extends PIXI.Application {

    public constructor() {

        let view = document.querySelector("#canvasContainer canvas") as HTMLCanvasElement;

        super({ view: view, backgroundColor: 0xb5b5b5, antialias: true, forceCanvas:false });

        /**global settings */
        fgui.UIConfig.defaultFont = "Microsoft YaHei";
        fgui.UIConfig.verticalScrollBar = "ui://test/ScrollBar_VT";
        fgui.UIConfig.horizontalScrollBar = "ui://test/ScrollBar_HZ";
        fgui.UIConfig.popupMenu = "ui://test/PopupMenu";
        fgui.UIConfig.globalModalWaiting = "ui://test/GlobalModalWaiting";
        fgui.UIConfig.windowModalWaiting = "ui://test/WindowModalWaiting";

        //main entry
        fgui.GRoot.inst.attachTo(this, {
            designWidth: 1136,
            designHeight: 640,
            scaleMode: fgui.StageScaleMode.FIXED_AUTO,
            orientation: fgui.StageOrientation.LANDSCAPE,
            alignV: fgui.StageAlign.TOP,
            alignH: fgui.StageAlign.LEFT
        });

        //start to preload resource
        //test.jpg actually is a binary file but just ends with fake postfix. so here we need to specify the loadType etc.
        PIXI.loader.add("test", "images/test.jpg", { loadType: PIXI.loaders.Resource.LOAD_TYPE.XHR, xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER })
            .add("test@atlas0", "images/test@atlas0.png")
            .add("test@atlas0_1", "images/test@atlas0_1.png")
            .add("test@atlas0_2", "images/test@atlas0_2.png")
            .on("progress", this.loadProgress, this)
            .on("complete", this.resLoaded, this)
            .load();
    }

    private loadProgress(loader: PIXI.loaders.Loader): void {
        let p = loader.progress;
        //this.loadingView.setProgress(p);
        if (p >= 100) {
            loader.off("progress", this.loadProgress, this);
            //this.loadingView.dispose();
            //this.loadingView = null;
        }
    }

    private resLoaded(loader: PIXI.loaders.Loader): void {
        loader.removeAllListeners();

        fgui.UIPackage.addPackage("test");  //add your package built in the editor
        
        let ins = fgui.UIPackage.createObject("test", "main") as fgui.GComponent;   //create an object to display
        ins.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);     //add relation so that it will be auto resized when the window size is changed.
        ins.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
        fgui.GRoot.inst.addChild(ins);   //show it
    }
```


## License
This content is released under the [MIT License.](http://opensource.org/licenses/MIT)

[![Analytics](https://ga-beacon.appspot.com/UA-46868962-2/jcyuan/FairyGUI-PIXI)](https://github.com/igrigorik/ga-beacon)
