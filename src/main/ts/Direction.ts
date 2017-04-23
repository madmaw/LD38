class Direction {

    public static NORTH = new Direction(0, -1);
    public static SOUTH = new Direction(0, 1);
    public static EAST = new Direction(1, 0);
    public static WEST = new Direction(-1, 0);
    public static NONE = new Direction(0, 0);

    public static VALUES = [
        Direction.NORTH,
        Direction.SOUTH,
        Direction.EAST,
        Direction.WEST
        
    ];

    constructor(public dx: number, public dy: number) {
    }

    public isVertical(): boolean  {
       return this.dy != 0;
    }
}