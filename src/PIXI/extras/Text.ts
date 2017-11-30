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
                PIXI.TextMetrics.wordWrap = function(text, style, canvas)
                {
                    if(!canvas) canvas = (PIXI.TextMetrics as any)["_canvas"];

                    const context = canvas.getContext('2d');
            
                    // Greedy wrapping algorithm that will wrap words as the line grows longer
                    // than its horizontal bounds.
                    let result = '';
                    let firstChar = text.charAt(0);
                    const lines = text.split('\n');
                    const wordWrapWidth = style.wordWrapWidth;
                    const characterCache:{ [char:string] : number } = {};
            
                    for (let i = 0; i < lines.length; i++)
                    {
                        let spaceLeft = wordWrapWidth;
                        const words = lines[i].split(' ');
            
                        for (let j = 0; j < words.length; j++)
                        {
                            const wordWidth = context.measureText(words[j]).width;
            
                            if (style.breakWords && wordWidth > wordWrapWidth)
                            {
                                // Word should be split in the middle
                                const characters = words[j].split('');
            
                                for (let c = 0; c < characters.length; c++)
                                {
                                    let character = characters[c];
                                    const nextChar = characters[c + 1];
                                    
                                    const isEmoji = Text.isEmojiChar(character.charCodeAt(0), nextChar ? nextChar.charCodeAt(0) : 0);

                                    if(isEmoji > 1) {
                                        c++;
                                        character += nextChar;  //combine into 1 emoji
                                    }

                                    let characterWidth = characterCache[character];
            
                                    if (characterWidth === undefined)
                                    {
                                        characterWidth = context.measureText(character).width;
                                        characterCache[character] = characterWidth;
                                    }
            
                                    if (characterWidth > spaceLeft)
                                    {
                                        result += `\n${character}`;
                                        spaceLeft = wordWrapWidth - characterWidth;
                                    }
                                    else
                                    {
                                        if (c === 0 && (j > 0 || firstChar == ' '))
                                        {
                                            result += ' ';
                                        }
            
                                        result += character;
                                        spaceLeft -= characterWidth;
                                    }
                                }
                            }
                            else
                            {
                                const wordWidthWithSpace = wordWidth + context.measureText(' ').width;
            
                                if (j === 0 || wordWidthWithSpace > spaceLeft)
                                {
                                    // Skip printing the newline if it's the first word of the line that is
                                    // greater than the word wrap width.
                                    if (j > 0)
                                    {
                                        result += '\n';
                                    }
                                    result += words[j];
                                    spaceLeft = wordWrapWidth - wordWidth;
                                }
                                else
                                {
                                    spaceLeft -= wordWidthWithSpace;
                                    result += ` ${words[j]}`;
                                }
                            }
                        }
            
                        if (i < lines.length - 1)
                        {
                            result += '\n';
                        }
                    }
            
                    return result;
                }
            }
        }
    }
}
