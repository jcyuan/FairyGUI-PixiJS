namespace fgui {

    export interface MovieClipSettings {
        startFrame?: number;
        endFrame?: number;
        repeatCount?: number;
        loopEndAt?: number;
        endCallback?: (target?: MovieClip) => void;
        endCallbackContext?: any;
        [key:string] : any;
    }

    export class DefaultMovieClipSettings implements MovieClipSettings {
        /**the first frame number to start to play */
        public startFrame: number = 0;
        /**the end frame the playing will end at, -1 means to the tail */
        public endFrame: number = -1;
        /**play count, 0 means endeless */
        public repeatCount: number = 0;
        /**once the repeated playing completes, the playing will end at, -1 means to the tail */
        public loopEndAt: number = -1;
        /**complete callback handler */
        public endCallback: (target?: MovieClip) => void = null;
        /**context object for the callback function */
        public endCallbackContext: any = null;

        /**modify the current settings without whole parameters provided */
        public mix(other: MovieClipSettings): MovieClipSettings {
            let ret: MovieClipSettings = this;
            for (let key in other) {
                if(key == "mix") continue;
                ret[key] = other[key];
            }
            return this;
        }
    }
}