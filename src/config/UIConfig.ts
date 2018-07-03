namespace fgui {

    /**global ui configuration */
    export class UIConfig {

        /**default font name of your project. */
        public static defaultFont: string = "Arial";

        /** resource used by Window.showModalWait to lock the certain window with modal mode.*/
        public static windowModalWaiting: string;
        /** resource used by GRoot.showModalWait to lock the global screen with modal mode. */
        public static globalModalWaiting: string;

        /** modal layer background configuration. */
        public static modalLayerColor: number = 0x333333;
        public static modalLayerAlpha: number = 0.2;

        /** global scrollbar name */
        public static horizontalScrollBar: string;
        public static verticalScrollBar: string;
        /** scrolling distance per action in pixel*/
        public static defaultScrollSpeed: number = 25;
        /** default scrollbar display mode. It's recommended to set ScrollBarDisplayType.Visible for Desktop environment and ScrollBarDisplayType.Auto for mobile environment.*/
        public static defaultScrollBarDisplay: number = ScrollBarDisplayType.Visible;
        /** allow user to drag the content of a container. Set to true for mobile is recommended.*/
        public static defaultScrollTouchEffect: boolean = true;
        /** enable bounce effect when the scrolling reaches to the edge of a container. Set to true for mobile is recommended.*/
        public static defaultScrollBounceEffect: boolean = true;
        /** Deceleration ratio of scrollpane when its in touch dragging.*/
        public static defaultScrollDecelerationRate:number = .967;

        /** global PopupMenu name.*/
        public static popupMenu: string;
        /** seperator resource name to be created to seperate each items on the global PopupMenu.*/
        public static popupMenuSeperator: string;
        /** the error symbol for the error status of the GLoader object.*/
        public static loaderErrorSign: string;
        /** the widget name to create global popup tip-box to contain some messages.*/
        public static tooltipsWin: string;

        /** maximum count of items to be displayed in the visible viewport of the GCombobox.*/
        public static defaultComboBoxVisibleItemCount: number = 10;

        /** the finger moving threshold in pixel to trigger the scrolling action.*/
        public static touchScrollSensitivity: number = 20;

        /** the finger moving threshold in pixel to trigger the dragging event.*/
        public static touchDragSensitivity: number = 10;
        
        /** auto bring the window you clicked to the topmost level of the GRoot children list.*/
        public static bringWindowToFrontOnClick: boolean = true;
    }
}