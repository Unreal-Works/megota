import add from "./core/additive/add";
import sub from "./core/additive/sub";
import clone from "./core/clone";
import compare from "./core/comparison/compare";
import equals from "./core/comparison/equals";
import greaterThan from "./core/comparison/greaterThan";
import greaterThanOrEquals from "./core/comparison/greaterThanOrEquals";
import lessThan from "./core/comparison/lessThan";
import lessThanOrEquals from "./core/comparison/lessThanOrEquals";
import max from "./core/comparison/max";
import min from "./core/comparison/min";
import compare_tolerance from "./core/comparison/tolerance/compare_tolerance";
import { MegotaConstants } from "./core/constants";
import toJSON from "./core/display/toJSON";
import toNumber from "./core/display/toNumber";
import toString from "./core/display/toString";
import cbrt from "./core/exponential/cbrt";
import exp from "./core/exponential/exp";
import ln from "./core/exponential/ln";
import log from "./core/exponential/log";
import log10 from "./core/exponential/log10";
import pow from "./core/exponential/pow";
import root from "./core/exponential/root";
import sqrt from "./core/exponential/sqrt";
import ackermann from "./core/hyper/ackermann";
import arrow from "./core/hyper/arrow";
import expansion from "./core/hyper/expansion";
import gag from "./core/hyper/gag";
import hyperoperation from "./core/hyper/hyperoperation";
import slog from "./core/hyper/slog";
import ssqrt from "./core/hyper/ssqrt";
import tetrate from "./core/hyper/tetrate";
import tetrateAdd from "./core/hyper/tetrateAdd";
import div from "./core/multiplicative/div";
import modulo from "./core/multiplicative/modulo";
import mul from "./core/multiplicative/mul";
import reciprocal from "./core/multiplicative/reciprocal";
import normalize from "./core/normalize";
import fromBigInt from "./core/parsing/fromBigInt";
import fromExpantaNum from "./core/parsing/fromExpantaNum";
import fromNumber from "./core/parsing/fromNumber";
import fromOmegaNum from "./core/parsing/fromOmegaNum";
import fromString from "./core/parsing/fromString";
import ceil from "./core/rounding/ceil";
import floor from "./core/rounding/floor";
import round from "./core/rounding/round";
import maxTermsInArithmeticSeries from "./core/series/maxTermsInArithmeticSeries";
import maxTermsInGeometricSeries from "./core/series/maxTermsInGeometricSeries";
import sumArithmeticSeries from "./core/series/sumArithmeticSeries";
import sumGeometricSeries from "./core/series/sumGeometricSeries";
import choose from "./core/combinatorics/choose";
import factorial from "./core/combinatorics/factorial";
import gamma from "./core/combinatorics/gamma";
import lambertw from "./core/lambertw/lambertw";
import abs from "./core/unary/abs";
import isFinite from "./core/unary/isFinite";
import isInfinite from "./core/unary/isInfinite";
import isInteger from "./core/unary/isInteger";
import isNaN from "./core/unary/isNaN";
import isNegativeInfinity from "./core/unary/isNegativeInfinity";
import isPositiveInfinity from "./core/unary/isPositiveInfinity";
import negate from "./core/unary/negate";

/**
 * Acceptable types for creating a Megota instance.
 * Can be a number, string, bigint, BaseMegota or another Megota instance.
 */
export type MegotaLike = number | string | bigint | BaseMegota | Megota;

/**
 * A number that represents extremely large values, able to handle operations beyond standard JavaScript number limits.
 * 
 * This class serves as a wrapper around BaseMegota, providing a more object-oriented API
 * with method chaining capabilities, while the core functionality is implemented in separate modules.
 * 
 * To understand the notations used in Megota, read the README file which explains:
 * - Knuth's Up-Arrow Notation
 * - X-Sequence Hyper Notation
 * - Bower's Exploding Array Function
 * - PsiCubed2's Letter Notation
 * - Fast-Growing Hierarchy
 * 
 * @example
 * const num = new Megota("10^^3"); // Represents 10 tetrated to 3 (10^10^10)
 * const num2 = new Megota(5); // Represents the number 5
 * num.greaterThan(num2); // true
 */
export default class Megota implements BaseMegota {

    /**
     * The sign of the number.
     * Note that 0 is considered positive.
     */
    public sign: 1 | -1;

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
     */
    public array: Array<Array<number>>;

    /**
     * Acts as an additional magnitude prefix beyond {@link array}.
     * 
     * Typically incremented when transcending `N` in PsiCubed2's letter notation.
     */
    public layer: number;

    /**
     * Create a new Megota instance from a given value.
     * 
     * @param value The value to convert to a Megota number. Can be a number, string, bigint, BaseMegota, or Megota instance.
     * 
     * @example
     * new Megota(5) // Creates a Megota representing the number 5
     * new Megota("10^^3") // Creates a Megota representing 10 tetrated to 3
     * new Megota(BigInt("123456789012345678901234567890")) // Handles BigInt values
     */
    public constructor(value?: MegotaLike) {
        if (value === undefined || value === null) {
            this.sign = 1;
            this.array = [[0, 0, 0]];
            this.layer = 0;
            return;
        }
        value = Megota.getValue(value, true);
        this.sign = value.sign;
        this.array = value.array;
        this.layer = value.layer;
    }

    private static fromBaseMegota(baseMegota: BaseMegota): Megota {
        const megota = new Megota();
        megota.sign = baseMegota.sign;
        megota.array = baseMegota.array;
        megota.layer = baseMegota.layer;
        return megota;

    }

    /**
     * Helper method to convert various input types to a BaseMegota.
     * 
     * @param value The value to convert
     * @param clones Whether to clone the value if it's already a BaseMegota
     * @returns A BaseMegota representation of the input value
     * @private
     */
    private static getValue(value: MegotaLike, clones: boolean): BaseMegota {
        switch (typeof value) {
            case "number":
                return fromNumber(value);
            case "string":
                return fromString(value);
            case "bigint":
                return fromBigInt(value);
            case "object":
                if (value instanceof Megota || ("sign" in value && "array" in value && "layer" in value)) {
                    if (typeof value.sign !== "number")
                        throw new TypeError("Expected sign to be a number");

                    if (typeof value.layer !== "number")
                        throw new TypeError("Expected layer to be a number");

                    if (!Array.isArray(value.array))
                        throw new TypeError("Expected array to be an array");

                    return clones === true ? clone(value) : value;
                }
                throw new TypeError("Invalid type for Megota constructor");
            default:
                return clone(MegotaConstants.ZERO);

        }
    }

    /**
     * Creates a deep clone of the current Megota instance.
     * 
     * @returns A new Megota instance that is a complete independent copy of the current instance.
     * 
     * @example
     * const a = new Megota(5);
     * const b = a.clone(); // b is now 5, but is a separate object from a
     */
    public clone(): Megota {
        return new Megota(clone(this));
    }

    /**
     * Normalizes the current Megota number.
     * 
     * Normalization ensures that the internal representation is in the most efficient form.
     * This happens automatically during most operations but can be called explicitly when needed.
     * 
     * @returns This Megota instance, for method chaining
     */
    public normalize(): Megota {
        normalize(this);
        return this;
    }

    /**
     * Helper method to apply unary operations (operations that take one operand).
     * 
     * @param operation The unary operation function to apply 
     * @returns A new Megota instance with the operation applied
     * @private
     */
    private applyUnaryOperation(operation: (value: BaseMegota) => void): Megota {
        const value = clone(this);
        operation(value);
        return Megota.fromBaseMegota(value);
    }

    /**
     * Helper method to apply binary operations (operations that take two operands).
     * 
     * @param operation The binary operation function to apply
     * @param other The second operand for the operation
     * @returns A new Megota instance with the operation applied
     * @private
     */
    private applyBinaryOperation(operation: (a: BaseMegota, b: BaseMegota) => void, other: MegotaLike): Megota {
        const value = clone(this);
        operation(value, Megota.getValue(other, false));
        return Megota.fromBaseMegota(value);
    }

    /**
     * Helper method to apply ternary operations (operations that take three operands).
     * 
     * @param operation The ternary operation function to apply
     * @param other1 The second operand for the operation
     * @param other2 The third operand for the operation
     * @returns A new Megota instance with the operation applied
     * @private
     */
    private applyTernaryOperation(operation: (a: BaseMegota, b: BaseMegota, c: BaseMegota) => void, other1: MegotaLike, other2: MegotaLike): Megota {
        const value = clone(this);
        operation(value, Megota.getValue(other1, false), Megota.getValue(other2, false));
        return Megota.fromBaseMegota(value);
    }

    /**
     * Helper method to apply comparison operations.
     * 
     * @param operation The comparison operation function to apply
     * @param other The value to compare against
     * @returns The result of the comparison
     * @private
     */
    private applyComparisonOperation(operation: (a: BaseMegota, b: BaseMegota) => boolean, other: MegotaLike): boolean {
        return operation(this, Megota.getValue(other, false));
    }

    /**
     * Returns the absolute value of this number.
     * 
     * @returns A new Megota instance with the absolute value
     * 
     * @example
     * new Megota(-5).abs(); // Returns 5
     */
    public abs = (): Megota => this.applyUnaryOperation(abs);

    /**
     * Negates this number (changes the sign).
     * 
     * @returns A new Megota instance with the negated value
     * 
     * @example
     * new Megota(5).negate(); // Returns -5
     */
    public negate = (): Megota => this.applyUnaryOperation(negate);

    /**
     * Returns the smallest integer greater than or equal to this number.
     * 
     * @returns A new Megota instance with the ceiling value
     * 
     * @example
     * new Megota(4.3).ceil(); // Returns 5
     */
    public ceil = (): Megota => this.applyUnaryOperation(ceil);

    /**
     * Returns the largest integer less than or equal to this number.
     * 
     * @returns A new Megota instance with the floor value
     * 
     * @example
     * new Megota(4.7).floor(); // Returns 4
     */
    public floor = (): Megota => this.applyUnaryOperation(floor);

    /**
     * Rounds this number to the nearest integer.
     * 
     * @returns A new Megota instance with the rounded value
     * 
     * @example
     * new Megota(4.3).round(); // Returns 4
     * new Megota(4.7).round(); // Returns 5
     */
    public round = (): Megota => this.applyUnaryOperation(round);

    /**
     * Checks if this number is finite.
     * 
     * @returns `true` if this number is finite, `false` otherwise.
     */
    public isFinite = (): boolean => isFinite(this);

    /**
     * Checks if this number is infinite.
     * 
     * @returns `true` if this number is infinite, `false` otherwise.
     */
    public isInfinite = (): boolean => isInfinite(this);

    /**
     * Checks if this number is an integer.
     * 
     * @returns `true` if this number is an integer, `false` otherwise.
     */
    public isInteger = (): boolean => isInteger(this);

    /**
     * Checks if this number is NaN (Not a Number).
     * 
     * @returns `true` if this number is NaN, `false` otherwise.
     */
    public isNaN = (): boolean => isNaN(this);

    /**
     * Checks if this number is negative infinity.
     * 
     * @returns `true` if this number is negative infinity, `false` otherwise.
     */
    public isNegativeInfinity = (): boolean => isNegativeInfinity(this);

    /**
     * Checks if this number is positive infinity.
     * 
     * @returns `true` if this number is positive infinity, `false` otherwise.
     */
    public isPositiveInfinity = (): boolean => isPositiveInfinity(this);

    /**
     * Returns the reciprocal (1/x) of this number.
     * 
     * @returns A new Megota instance with the reciprocal value
     * 
     * @example
     * new Megota(2).reciprocal(); // Returns 0.5
     */
    public reciprocal = (): Megota => this.applyUnaryOperation(reciprocal);

    /**
     * Returns the gamma function of this number.
     * For positive integers, gamma(n) = (n-1)!
     * 
     * @returns A new Megota instance with the gamma function result
     * 
     * @example
     * new Megota(5).gamma(); // Returns 24 (equivalent to 4!)
     */
    public gamma = (): Megota => this.applyUnaryOperation(gamma);

    /**
     * Returns the factorial of this number.
     * 
     * @returns A new Megota instance with the factorial result
     * 
     * @example
     * new Megota(5).factorial(); // Returns 120 (5!)
     */
    public factorial = (): Megota => this.applyUnaryOperation(factorial);

    /**
     * Returns the Lambert W function of this number.
     * The Lambert W function is the inverse of f(x) = x*e^x
     * 
     * @param principal If true, returns the principal branch (default is true).
     * @returns A new Megota instance with the Lambert W function result
     */
    public lambertw = (principal?: boolean): Megota => {
        const value = clone(this);
        lambertw(value, principal);
        return Megota.fromBaseMegota(value);
    }

    /**
     * Returns the base-10 logarithm of this number.
     * 
     * @returns A new Megota instance with the log10 result
     * 
     * @example
     * new Megota(100).log10(); // Returns 2
     */
    public log10 = (): Megota => this.applyUnaryOperation(log10);

    /**
     * Returns the natural logarithm (base e) of this number.
     * 
     * @returns A new Megota instance with the natural logarithm result
     * 
     * @example
     * new Megota(Math.E).ln(); // Returns 1
     */
    public ln = (): Megota => this.applyUnaryOperation(ln);

    /**
     * Returns e raised to the power of this number.
     * 
     * @returns A new Megota instance with e^x
     * 
     * @example
     * new Megota(1).exp(); // Returns Math.E (approximately 2.718)
     */
    public exp = (): Megota => this.applyUnaryOperation(exp);

    /**
     * Returns the square root of this number.
     * 
     * @returns A new Megota instance with the square root result
     * 
     * @example
     * new Megota(9).sqrt(); // Returns 3
     */
    public sqrt = (): Megota => this.applyUnaryOperation(sqrt);

    /**
     * Returns the cube root of this number.
     * 
     * @returns A new Megota instance with the cube root result
     * 
     * @example
     * new Megota(8).cbrt(); // Returns 2
     */
    public cbrt = (): Megota => this.applyUnaryOperation(cbrt);

    /**
     * Returns the super square root (ssqrt) of this number.
     * The super square root is the solution to x^x = n
     * 
     * @returns A new Megota instance with the super square root result
     */
    public ssqrt = (): Megota => this.applyUnaryOperation(ssqrt);

    /**
     * Gaseous Aggregate Functionality - specialized function for working with large numbers.
     * 
     * @returns A new Megota instance with the gag result
     */
    public gag = (): Megota => this.applyUnaryOperation(gag);

    /**
     * Returns the maximum of this number and another number.
     * 
     * @param other The number to compare with
     * @returns A new Megota instance with the maximum value
     * 
     * @example
     * new Megota(5).max(8); // Returns 8
     */
    public max(other: MegotaLike): Megota {
        return new Megota(max(this, Megota.getValue(other, false)));
    }

    /**
     * Returns the minimum of this number and another number.
     * 
     * @param other The number to compare with
     * @returns A new Megota instance with the minimum value
     * 
     * @example
     * new Megota(5).min(3); // Returns 3
     */
    public min(other: MegotaLike): Megota {
        return new Megota(min(this, Megota.getValue(other, false)));
    }

    /**
     * Adds another number to this number.
     * 
     * @param other The number to add
     * @returns A new Megota instance with the sum
     * 
     * @example
     * new Megota(5).add(3); // Returns 8
     */
    public add = (other: MegotaLike): Megota => this.applyBinaryOperation(add, other);

    /**
     * Subtracts another number from this number.
     * 
     * @param other The number to subtract
     * @returns A new Megota instance with the difference
     * 
     * @example
     * new Megota(5).sub(3); // Returns 2
     */
    public sub = (other: MegotaLike): Megota => this.applyBinaryOperation(sub, other);

    /**
     * Multiplies this number by another number.
     * 
     * @param other The number to multiply by
     * @returns A new Megota instance with the product
     * 
     * @example
     * new Megota(5).mul(3); // Returns 15
     */
    public mul = (other: MegotaLike): Megota => this.applyBinaryOperation(mul, other);

    /**
     * Divides this number by another number.
     * 
     * @param other The divisor
     * @returns A new Megota instance with the quotient
     * 
     * @example
     * new Megota(10).div(2); // Returns 5
     */
    public div = (other: MegotaLike): Megota => this.applyBinaryOperation(div, other);

    /**
     * Raises this number to the power of another number.
     * 
     * @param exponent The exponent
     * @returns A new Megota instance with the result
     * 
     * @example
     * new Megota(2).pow(3); // Returns 8
     */
    public pow = (exponent: MegotaLike): Megota => this.applyBinaryOperation(pow, exponent);

    /**
     * Returns the logarithm of this number with the specified base.
     * 
     * @param base The base of the logarithm, defaults to e (natural logarithm)
     * @returns A new Megota instance with the logarithm result
     * 
     * @example
     * new Megota(100).log(10); // Returns 2
     */
    public log = (base = MegotaConstants.E): Megota => this.applyBinaryOperation(log, base);

    /**
     * Returns the nth root of this number.
     * 
     * @param other The root degree
     * @returns A new Megota instance with the root result
     * 
     * @example
     * new Megota(8).root(3); // Returns 2 (cube root of 8)
     */
    public root = (other: MegotaLike): Megota => this.applyBinaryOperation(root, other);

    /**
     * Returns the remainder after division (modulo operation).
     * 
     * @param other The divisor
     * @returns A new Megota instance with the remainder
     * 
     * @example
     * new Megota(10).modulo(3); // Returns 1
     */
    public modulo = (other: MegotaLike): Megota => this.applyBinaryOperation(modulo, other);

    /**
     * Calculates the binomial coefficient (n choose k).
     * 
     * @param other The k value in n choose k
     * @returns A new Megota instance with the binomial coefficient
     * 
     * @example
     * new Megota(5).choose(2); // Returns 10 (5 choose 2)
     */
    public choose = (other: MegotaLike): Megota => this.applyBinaryOperation(choose, other);

    /**
     * Tetrates this number to the given height.
     * Tetration is iterated exponentiation: a^^n = a^a^...^a (n times).
     * 
     * @param height The height of the tetration
     * @returns A new Megota instance with the tetration result
     * 
     * @example
     * new Megota(2).tetrate(3); // Returns 16 (2^(2^2) = 2^4 = 16)
     */
    public tetrate = (height: MegotaLike): Megota => this.applyBinaryOperation(tetrate, height);

    /**
     * Calculates the super-logarithm (slog) of this number with the given base.
     * The super-logarithm is the inverse of tetration: if b^^h = x, then slog_b(x) = h.
     * 
     * @param base The base for the super-logarithm, defaults to 10
     * @returns A new Megota instance with the slog result
     * 
     * @example
     * // If 10^^2 = 10^10 = 10000000000, then slog_10(10000000000) = 2
     * new Megota("10^10").slog(10); // Returns 2
     */
    public slog = (base: MegotaLike = MegotaConstants.TEN): Megota => this.applyBinaryOperation(slog, base);

    /**
     * Calculates the Ackermann function A(m,n) with this number as m and the parameter as n.
     * The Ackermann function is a classic example of a total computable function that is not primitive recursive.
     * It grows extremely quickly, even for small inputs.
     * 
     * The function is defined recursively as:
     * - A(0,n) = n+1
     * - A(m,0) = A(m-1,1) for m > 0
     * - A(m,n) = A(m-1, A(m,n-1)) for m,n > 0
     * 
     * @see https://en.wikipedia.org/wiki/Ackermann_function
     * 
     * @param n The second parameter to the Ackermann function
     * @returns A new Megota instance with the Ackermann function result
     * 
     * @example
     * new Megota(3).ackermann(2); // Returns A(3,2) = 29
     */
    public ackermann = (n: MegotaLike): Megota => this.applyBinaryOperation(ackermann, n);

    /**
     * Performs the binary function `a{{1}b = a{a{a...{a}...a}a}a` where there are b a`s from the center out. 
     * Expansion generalizes operations like addition, multiplication, exponentiation, and tetration
     * to handle vast numerical scales beyond standard arithmetic.
     * 
     * The expansion operation can be thought of as repeated application of a lower-level operation,
     * similar to how exponentiation is repeated multiplication.
     * 
     * @see https://googology.fandom.com/wiki/Expansion
     * 
     * @param height The height of the expansion
     * @returns A new Megota instance with the expansion result
     * 
     * @example
     * new Megota(2).expansion(3) // Represents 2{2}2, or 2 tetrated to 2 = 4.
     * new Megota(3).expansion(2) // Represents 3{3{3}3}3, which is 3{7625597484987}3 (so 7625597484987 arrows).
     */
    public expansion = (height: MegotaLike): Megota => this.applyBinaryOperation(expansion, height);

    /**
     * Adds a height to the tetration of this number with a given base.
     * 
     * @param other The amount to add to the height, defaults to 1
     * @param base The base of the tetration, defaults to 10
     * @returns A new Megota instance with the result
     */
    public tetrateAdd = (other: MegotaLike = MegotaConstants.ONE, base: MegotaLike = MegotaConstants.TEN): Megota => this.applyTernaryOperation(tetrateAdd, other, base);

    /**
     * Performs the generalized arrow operation as defined by Knuth's up-arrow notation.
     * a ↑^n b where n is the number of arrows.
     * 
     * @param arrows The number of arrows (operation level)
     * @param height The height or right operand
     * @returns A new Megota instance with the arrow operation result
     * 
     * @example
     * // 2↑↑2 = 2^2 = 4
     * new Megota(2).arrow(2, 2); 
     */
    public arrow = (arrows: MegotaLike, height: MegotaLike): Megota => this.applyTernaryOperation(arrow, arrows, height);

    /**
     * Performs a generalized hyperoperation of level n.
     * 
     * Hyperoperations extend the sequence of addition, multiplication, exponentiation, etc.
     * - Level 0: Successor function (a + 1)
     * - Level 1: Addition (a + b)
     * - Level 2: Multiplication (a * b)
     * - Level 3: Exponentiation (a ^ b)
     * - Level 4: Tetration (a ↑↑ b)
     * - And so on...
     * 
     * @param level The level of the hyperoperation
     * @param other The second operand
     * @returns A new Megota instance with the hyperoperation result
     * 
     * @example
     * // Hyperoperation level 2 is multiplication: 3 * 4 = 12
     * new Megota(3).hyperoperation(2, 4);
     */
    public hyperoperation = (level: MegotaLike, other: MegotaLike): Megota => this.applyTernaryOperation(hyperoperation, level, other);

    /**
     * Compares this number with another number.
     * 
     * @param other The number to compare with
     * @returns 1 if this > other, -1 if this < other, 0 if equal, or NaN if not comparable
     * 
     * @example
     * new Megota(5).compare(3); // Returns 1
     * new Megota(3).compare(5); // Returns -1
     * new Megota(5).compare(5); // Returns 0
     */
    public compare(other: MegotaLike): 1 | -1 | 0 | typeof NaN {
        return compare(this, Megota.getValue(other, false));
    }

    /**
     * Checks if this number is equal to another number.
     * 
     * @param other The number to compare with
     * @returns true if the numbers are equal, false otherwise
     * 
     * @example
     * new Megota(5).equals(5); // Returns true
     * new Megota(5).equals(3); // Returns false
     */
    public equals = (other: MegotaLike): boolean => this.applyComparisonOperation(equals, other);

    /**
     * Checks if this number is greater than another number.
     * 
     * @param other The number to compare with
     * @returns true if this number is greater than the other, false otherwise
     * 
     * @example
     * new Megota(5).greaterThan(3); // Returns true
     * new Megota(3).greaterThan(5); // Returns false
     */
    public greaterThan = (other: MegotaLike): boolean => this.applyComparisonOperation(greaterThan, other);

    /**
     * Checks if this number is less than another number.
     * 
     * @param other The number to compare with
     * @returns true if this number is less than the other, false otherwise
     * 
     * @example
     * new Megota(3).lessThan(5); // Returns true
     * new Megota(5).lessThan(3); // Returns false
     */
    public lessThan = (other: MegotaLike): boolean => this.applyComparisonOperation(lessThan, other);

    /**
     * Checks if this number is greater than or equal to another number.
     * 
     * @param other The number to compare with
     * @returns true if this number is greater than or equal to the other, false otherwise
     * 
     * @example
     * new Megota(5).greaterThanOrEquals(3); // Returns true
     * new Megota(5).greaterThanOrEquals(5); // Returns true
     * new Megota(3).greaterThanOrEquals(5); // Returns false
     */
    public greaterThanOrEquals = (other: MegotaLike): boolean => this.applyComparisonOperation(greaterThanOrEquals, other);

    /**
     * Checks if this number is less than or equal to another number.
     * 
     * @param other The number to compare with
     * @returns true if this number is less than or equal to the other, false otherwise
     * 
     * @example
     * new Megota(3).lessThanOrEquals(5); // Returns true
     * new Megota(5).lessThanOrEquals(5); // Returns true
     * new Megota(5).lessThanOrEquals(3); // Returns false
     */
    public lessThanOrEquals = (other: MegotaLike): boolean => this.applyComparisonOperation(lessThanOrEquals, other);

    /**
     * Compares this number with another number within a given tolerance.
     * Useful for floating-point comparisons where exact equality might not work due to precision issues.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7 (0.0000001)
     * @returns 1 if this > other, -1 if this < other, 0 if equal within tolerance, or NaN if not comparable
     */
    public compare_tolerance(other: MegotaLike, tolerance = 1e-7): 1 | -1 | 0 | typeof NaN {
        return compare_tolerance(this, Megota.getValue(other, false), tolerance);
    }

    /**
     * Checks if this number is equal to another number within a given tolerance.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7
     * @returns true if the numbers are equal within tolerance, false otherwise
     */
    public equals_tolerance = (other: MegotaLike, tolerance = 1e-7): boolean => this.compare_tolerance(other, tolerance) === 0;

    /**
     * Checks if this number is greater than or equal to another number within a given tolerance.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7
     * @returns true if this number is greater than or equal to the other within tolerance, false otherwise
     */
    public greaterThanOrEquals_tolerance = (other: MegotaLike, tolerance = 1e-7): boolean => this.compare_tolerance(other, tolerance) >= 0;

    /**
     * Checks if this number is less than or equal to another number within a given tolerance.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7
     * @returns true if this number is less than or equal to the other within tolerance, false otherwise
     */
    public lessThanOrEquals_tolerance = (other: MegotaLike, tolerance = 1e-7): boolean => this.compare_tolerance(other, tolerance) <= 0;

    /**
     * Checks if this number is greater than another number within a given tolerance.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7
     * @returns true if this number is greater than the other with consideration for the tolerance, false otherwise
     */
    public greaterThan_tolerance = (other: MegotaLike, tolerance = 1e-7): boolean => this.compare_tolerance(other, tolerance) > 0;

    /**
     * Checks if this number is less than another number within a given tolerance.
     * 
     * @param other The number to compare with
     * @param tolerance The tolerance for considering numbers equal, defaults to 1e-7
     * @returns true if this number is less than the other with consideration for the tolerance, false otherwise
     */
    public lessThan_tolerance = (other: MegotaLike, tolerance = 1e-7): boolean => this.compare_tolerance(other, tolerance) < 0;

    /**
     * Converts this Megota number to a string representation.
     * 
     * @returns A string representation of this number
     * 
     * @example
     * new Megota(10000).toString(); // Returns "10000"
     * new Megota("10^^3").toString(); // Returns "10^^3"
     */
    public toString = (): string => toString(this);

    /**
     * Converts this Megota number to a JavaScript number.
     * Note: This may lose precision for large values or return Infinity for extremely large values.
     * 
     * @returns A JavaScript number representation of this value
     * 
     * @example
     * new Megota(42).toNumber(); // Returns 42
     * new Megota("1e309").toNumber(); // Returns Infinity (exceeds JavaScript number precision)
     */
    public toNumber = (): number => toNumber(this);

    /**
     * Converts this Megota number to a JSON-friendly string representation.
     * 
     * @returns A JSON string representation of this number
     */
    public toJSON = (): string => toJSON(this);

    /**
     * Creates a Megota number from an OmegaNumber array representation.
     * 
     * @param value The OmegaNumber array to convert
     * @returns A new Megota instance representing the converted number
     */
    public static fromOmegaNum(value: Array<number>): Megota {
        return new Megota(fromOmegaNum(value));
    }

    /**
     * Creates a Megota number from an ExpantaNum array representation.
     * 
     * @param value The ExpantaNum array to convert
     * @returns A new Megota instance representing the converted number
     */
    public static fromExpantaNum(value: Array<Array<number>>): Megota {
        return new Megota(fromExpantaNum(value));
    }

    /**
     * Calculates the maximum number of terms in a geometric series that can be summed without exceeding a given limit.
     * 
     * The geometric series is defined as `S = a + ar + ar^2 + ... + ar^n`.
     * 
     * Use cases include how many times an item can be purchased in a game with a geometric cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
     * @example
     * const balance = new Megota(1000);
     * const firstItemCost = new Megota(10);
     * const nextItemCostRatio = new Megota(2);
     * const owned = new Megota(0);
     * Megota.maxTermsInGeometricSeries(balance, firstItemCost, nextItemCostRatio, owned); // returns 6
     * // 10 + 20 + 40 + 80 + 160 + 320 + 640 = 1270, which exceeds the balance of 1000, so the maximum is 6 terms.
     * 
     * @param sumLimit The maximum sum limit for the geometric series. In a game, this could be the amount of resources you have available to spend.
     * @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
     * @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The maximum number of terms that can be purchased without exceeding the sum limit.
     */
    public static maxTermsInGeometricSeries(sumLimit: MegotaLike, firstTerm: MegotaLike, ratio: MegotaLike, offset: MegotaLike): Megota {
        return Megota.fromBaseMegota(maxTermsInGeometricSeries(
            Megota.getValue(sumLimit, false),
            Megota.getValue(firstTerm, false),
            Megota.getValue(ratio, false),
            Megota.getValue(offset, false)
        ));
    }

    /**
     * Calculates the maximum number of terms in an arithmetic series that can be summed without exceeding a given limit.
     * 
     * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + nd)`.
     * 
     * Use cases include how many times an item can be purchased in a game with an arithmetic cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
     * 
     * @example
     * const balance = new Megota(1000);
     * const firstItemCost = new Megota(100);
     * const nextItemCostDifference = new Megota(50);
     * const owned = new Megota(0);
     * Megota.maxTermsInArithmeticSeries(balance, firstItemCost, nextItemCostDifference, owned); // returns 5
     * // 100 + 150 + 200 + 250 + 300 + 350 = 1350, which exceeds the balance of 1000, so the maximum is 5 terms.
     * 
     * @param sumLimit The maximum sum limit for the arithmetic series. In a game, this could be the amount of resources you have available to spend.
     * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
     * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The maximum number of terms that can be purchased without exceeding the sum limit.
     */
    public static maxTermsInArithmeticSeries(sumLimit: MegotaLike, firstTerm: MegotaLike, difference: MegotaLike, offset: MegotaLike): Megota {
        return Megota.fromBaseMegota(maxTermsInArithmeticSeries(
            Megota.getValue(sumLimit, false),
            Megota.getValue(firstTerm, false),
            Megota.getValue(difference, false),
            Megota.getValue(offset, false)
        ));
    }

    /**
     * Calculates the sum of a geometric series.
     * 
     * The geometric series is defined as `S = a + ar + ar^2 + ... + ar^(n-1)`.
     * 
     * Use cases include calculating the total cost of items in a game with a geometric cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 40, and so on, the ratio would be 2.
     * 
     * @param terms The number of terms in the geometric series.
     * @param firstTerm The first term of the geometric series. In a game, this could be the cost of the first item.
     * @param ratio The common ratio of the geometric series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The sum of the geometric series.
     */
    public static sumGeometricSeries(terms: MegotaLike, firstTerm: MegotaLike, ratio: MegotaLike, offset: MegotaLike): Megota {
        return Megota.fromBaseMegota(sumGeometricSeries(
            Megota.getValue(terms, false),
            Megota.getValue(firstTerm, false),
            Megota.getValue(ratio, false),
            Megota.getValue(offset, false)
        ));
    }

    /**
     * Calculates the sum of an arithmetic series.
     * 
     * The arithmetic series is defined as `S = a + (a + d) + (a + 2d) + ... + (a + (n-1)d)`.
     * 
     * Use cases include calculating the total cost of items in a game with an arithmetic cost increase.
     * For example, if the first item costs 10, the second costs 20, the third costs 30, and so on, the difference would be 10.
     * 
     * @param terms The number of terms in the arithmetic series.
     * @param firstTerm The first term of the arithmetic series. In a game, this could be the cost of the first item.
     * @param difference The common difference of the arithmetic series. In a game, this could be the factor by which the cost increases for each subsequent item.
     * @param offset The number of terms to offset by. In a game, this could be the number of items you already own, which would affect the cost of the next item.
     * @returns The sum of the arithmetic series.
     */
    public static sumArithmeticSeries(terms: MegotaLike, firstTerm: MegotaLike, difference: MegotaLike, offset: MegotaLike): Megota {
        return Megota.fromBaseMegota(sumArithmeticSeries(
            Megota.getValue(terms, false),
            Megota.getValue(firstTerm, false),
            Megota.getValue(difference, false),
            Megota.getValue(offset, false)
        ));
    }
}