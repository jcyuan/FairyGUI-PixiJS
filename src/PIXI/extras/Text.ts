/*this class is temporarily for the bug fixing purpose only, so once PIXI releases a new version, this class will be removed */

namespace PIXI.extras {
    
    export class Text extends PIXI.Text {

        private static __init:boolean = false;

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
                                    const character = characters[c];
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
