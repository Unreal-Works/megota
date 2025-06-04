/**
 * An object that represents a number as large as {10, 9e15, 1, 1, 2} in BEAF notation.
 */
interface BaseMegota {

    /**
     * The sign of the number.
     * 
     * Note that the number `0` is signed, and will have a sign of `1` (positive zero).
     */
    sign: 1 | -1;

    /**
     * Array of triplets in the form `[[a0,b0,c0],[a1,b1,c1],[a2,b2,c2],[a3,b3,c3],...]`, representing the *top* layer of a number in the level of megotion.
     * - `a` is the level; how many times the operation is applied.
     * - `b` is the type; what operation is applied.
     * - `c` is the value; the coefficient of the operation.
     * 
     * The number it represents is `sign × {10,10,10,layer} × array`.
     * 
     * @example
     * 5 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 5 ] ]
     * -1.5e18 = -1 × {10, 10, 10, 0} × [ [ 0, 0, 18.176... ], [ 0, 1, 1 ] ] // (10↑18.176){1}1
     * 4{25}80 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 18.602... ], [ 0, 1, 1 ], [ 0, 24, 79 ] ] // (10↑18.602){25}80
     * 4{{3}}3 = 1 × {10, 10, 10, 0} × [ [ 0, 0, 153.906... ], [ 0, 1, 2 ], [ 0, 2, 2 ], [ 0, 3, 2 ], [ 1, 0, 1 ] ] // (10↑153.906){3}3
     */
    array: Array<Array<number>>;

    /**
     * Acts as an additional magnitude prefix beyond {@link array}.
     * 
     * Typically incremented when transcending `N` in PsiCubed2's letter notation.
     */
    layer: number;
}

/**
 * 
 */
type Operator = [number, number];