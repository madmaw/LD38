

class Color {

    public static WHITE = new Color([true, true, true], 'white');
    public static YELLOW = new Color([true, true, false], 'yellow');
    public static MAGENTA = new Color([true, false, true], 'magenta');
    public static RED = new Color([true, false, false], 'red');
    public static CYAN = new Color([false, true, true], 'cyan');
    public static GREEN = new Color([false, true, false], 'green');
    public static BLUE = new Color([false, false, true], 'blue');
    public static BLACK = new Color([false, false, false], 'black');

    public static VALUES = [
        Color.BLACK, 
        Color.BLUE, 
        Color.GREEN, 
        Color.CYAN, 
        Color.RED, 
        Color.MAGENTA, 
        Color.YELLOW, 
        Color.WHITE
    ]

    public hex: string;
    public id: number;

    constructor(
        public rgb: boolean[], 
        public name: string
    ) {
        let hex = '#';
        let id = 0;
        for (let v of rgb) {
            id = id << 1;
            if (v) {
                id = id | 1;
                hex += 'F';
            } else {
                hex += '0';
            }
        }
        this.hex = hex;
        this.id = id;
    }

    hasRed(): boolean {
        return this.rgb[0];
    }

    hasGreen(): boolean {
        return this.rgb[1];
    }

    hasBlue(): boolean {
        return this.rgb[2];
    }

    overlaps(color: Color): boolean {
        let result = false;
        for (let i = 0; i < this.rgb.length; i++) {
            let v1 = this.rgb[i];
            let v2 = color.rgb[i];
            result = result || (v1 && v2);
        }
        return result;
    }

    contains(color: Color): boolean {
        let result = true;
        for (let i = 0; i < this.rgb.length; i++) {
            let v1 = this.rgb[i];
            let v2 = color.rgb[i];
            if (v2) {
                result = result && v1;
            }
        }
        return result;

    }

    isBlack(): boolean {
        return this.id == 0;
    }

    isWhite(): boolean {
        return this.id == Color.VALUES.length - 1;
    }

    exclude(color: Color): Color {
        let id = (~color.id) & this.id;
        return Color.VALUES[id];
    }

    intersection(color: Color): Color {
        let id = color.id & this.id;
        return Color.VALUES[id];
    }

    union(color: Color): Color {
        let id = color.id | this.id;
        return Color.VALUES[id];
    }
}