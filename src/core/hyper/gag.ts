import clone from "../clone";
import ackermann from "./ackermann";

/**
 * The gag function is a specific case of the Ackermann function, where gag(n) = A(n, n).
 * 
 * @param value The input value, represented as a {@link BaseMegota}.
 */
function gag(value: BaseMegota): void {
    ackermann(value, clone(value));
    return;
};

export default gag;