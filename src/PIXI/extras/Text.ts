/*this class is temporarily for the bug fixing purpose only, so once PIXI releases a new version, this class will be removed */

namespace PIXI.extras {
    
    export class Text extends PIXI.Text {

        private static __init:boolean = false;

        /**
         * Check whether a byte is an emoji character or not.
         *
         * @param {number} charCode - the byte to test.
         * @param {number} nextCharCode - the possible second byte of the emoji.
         * @return {number} 0 means not a emoji, 1 means single byte, 2 means double bytes.
         */
        public static isEmojiChar(charCode:number, nextCharCode:number):number {
            const hs = charCode;
            const nextCharValid = typeof nextCharCode === 'number' && !isNaN(nextCharCode) && nextCharCode > 0;

            // surrogate pair
            if (hs >= 0xd800 && hs <= 0xdbff)
            {
                if (nextCharValid)
                {
                    const uc = ((hs - 0xd800) * 0x400) + (nextCharCode - 0xdc00) + 0x10000;
    
                    if (uc >= 0x1d000 && uc <= 0x1f77f)
                    {
                        return 2;
                    }
                }
            }
            // non surrogate
            else if ((hs >= 0x2100 && hs <= 0x27ff)
                || (hs >= 0x2B05 && hs <= 0x2b07)
                || (hs >= 0x2934 && hs <= 0x2935)
                || (hs >= 0x3297 && hs <= 0x3299)
                || hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
                || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
                || hs === 0x2b50 || hs === 0x231a)
            {
                return 1;
            }
            else if (nextCharValid && (nextCharCode === 0x20e3 || nextCharCode === 0xfe0f || nextCharCode === 0xd83c))
            {
                return 2;
            }

            return 0;
        }

        public constructor(text?:string, style?:PIXI.TextStyle, canvas?:HTMLCanvasElement) {
            super(text, style, canvas);
            
            if(!PIXI.extras.Text.__init) {
                PIXI.extras.Text.__init = true;

                //override
                PIXI.TextMetrics.wordWrap = function(text, style) {
                    const canvas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (PIXI.TextMetrics as any)["_canvas"];

                    let context = canvas.getContext('2d');

                    let line = '';
                    let width = 0;
                    let lines = '';
                    let cache = {};
                    let ls = style.letterSpacing;

                    // ideally there is letterSpacing after every char except the last one
                    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
                    // so for convenience the above needs to be compared to width + 1 extra space
                    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
                    // ________________________________________________
                    // And then the final space is simply no appended to each line
                    let wordWrapWidth = style.wordWrapWidth + style.letterSpacing;

                    // get the width of a space and add it to cache
                    let spaceWidth = TextMetrics.getFromCache(' ', ls, cache, context);

                    // break text into words
                    let words = text.split(' ');

                    for (var i = 0; i < words.length; i++) {
                        let word = words[i];

                        // get word width from cache if possible
                        let wordWidth = TextMetrics.getFromCache(word, ls, cache, context);

                        // word is longer than desired bounds
                        if (wordWidth > wordWrapWidth) {
                            // break large word over multiple lines
                            if (style.breakWords) {
                                // add a space to the start of the word unless its at the beginning of the line
                                var tmpWord = line.length > 0 ? ' ' + word : word;

                                // break word into characters
                                var characters = tmpWord.split('');

                                // loop the characters
                                for (var j = 0; j < characters.length; j++) {
                                    let character = characters[j];
                                    const nextChar = characters[j + 1];
                                    
                                    const isEmoji = Text.isEmojiChar(character.charCodeAt(0), nextChar ? nextChar.charCodeAt(0) : 0);

                                    if(isEmoji >= 1) {
                                        j++;
                                        character += nextChar;  //combine into 1 emoji
                                    }

                                    let characterWidth = TextMetrics.getFromCache(character, ls, cache, context);

                                    if (characterWidth + width > wordWrapWidth) {
                                        lines += TextMetrics.addLine(line);
                                        line = '';
                                        width = 0;
                                    }

                                    line += character;
                                    width += characterWidth;
                                }
                            }

                            // run word out of the bounds
                            else {
                                    // if there are words in this line already
                                    // finish that line and start a new one
                                    if (line.length > 0) {
                                        lines += TextMetrics.addLine(line);
                                        line = '';
                                        width = 0;
                                    }

                                    // give it its own line
                                    lines += TextMetrics.addLine(word);
                                    line = '';
                                    width = 0;
                                }
                        }

                        // word could fit
                        else {
                                // word won't fit, start a new line
                                if (wordWidth + width > wordWrapWidth) {
                                    lines += TextMetrics.addLine(line);
                                    line = '';
                                    width = 0;
                                }

                                // add the word to the current line
                                if (line.length > 0) {
                                    // add a space if it is not the beginning
                                    line += ' ' + word;
                                } else {
                                    // add without a space if it is the beginning
                                    line += word;
                                }

                                width += wordWidth + spaceWidth;
                            }
                    }

                    lines += TextMetrics.addLine(line, false);

                    return lines;
                }
            }
        }
    }
}
