namespace fgui.utils {

    const enum RawByteFlags {
        EOF_byte = -1,
        EOF_code_point = -1,
        Fatal_code_point = 0xFFFD
    }
    
    export class RawByte {
        
        private static inRange(a: number, min: number, max: number): boolean {
            return min <= a && a <= max;
        }

        public static decodeUTF8(data: Uint8Array): string {
            let pos: number = 0;
            let result: string = "";
            let code_point: number;
            let utf8_code_point = 0;
            let utf8_bytes_needed = 0;
            let utf8_bytes_seen = 0;
            let utf8_lower_boundary = 0;

            while (data.length > pos) {
                let _byte = data[pos++];

                if (_byte == RawByteFlags.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = RawByteFlags.Fatal_code_point;
                    } else {
                        code_point = RawByteFlags.EOF_code_point;
                    }
                } else {

                    if (utf8_bytes_needed == 0) {
                        if (RawByte.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        } else {
                            if (RawByte.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            } else if (RawByte.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            } else if (RawByte.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            } else {
                                //throw new Error("failed to decode the raw binary data");
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    } else if (!RawByte.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = RawByteFlags.Fatal_code_point;
                    } else {

                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        } else {

                            let cp = utf8_code_point;
                            let lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (RawByte.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            } else {
                                code_point = _byte;
                            }
                        }

                    }
                }
                //Decode string
                if (code_point !== null && code_point !== RawByteFlags.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    } else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        }
    }
}