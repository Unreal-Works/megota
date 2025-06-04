export class MegotaConfiguration {
    /**
     * The maximum number of operators stored in array.
     * If the number of operations exceed the limit, then the least significant operations will be discarded.
     * This is to prevent long loops and eating away of memory and processing time.
     * 100 means there are at maximum of 100 elements in array.
     * It is not recommended to make this number too big.
     * 
     * @example
     * MegotaNumber.maxOps = 100;
     */
    public static maxOps: number = 15;

    /**
     * Specify what format is used when serializing for JSON.stringify.
     * 0 means the default format, which is a JSON object.
     * 1 means to serialize as a string.
     */
    public static serializeMode: number = 0;
}