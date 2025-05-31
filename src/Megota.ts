import MegotaNumber from "./MegotaNumber";

export type MegotaLike = number | string | bigint | MegotaNumber | Megota;

/**
 * Higher level class for Megota numbers, providing easy manipulation and interaction of {@link MegotaNumber} instances.
 */
export default class Megota {

    public value: MegotaNumber;

    public constructor(value: MegotaLike) {
        switch (typeof value) {
            case "number":
                this.value = MegotaNumber.fromNumber(value);
                break;
            case "string":
                this.value = MegotaNumber.fromString(value);
                break;
            case "bigint":
                this.value = MegotaNumber.fromBigInt(value);
                break;
            case "object":
                if (value instanceof Megota) {
                    this.value = value.value.clone();
                }
                else if (value instanceof MegotaNumber) {
                    this.value = value;
                }
                else {
                    throw new Error("Invalid type for Megota constructor");
                }
                break;
            default:
                this.value = new MegotaNumber();
        }
    }

    
    public toString(): string {
        return this.value.toString();
    }

    public add(other: MegotaLike): Megota {
        const otherValue = new Megota(other).value;
        return new Megota(this.value.add(otherValue));
    }

    public mul(other: MegotaLike): Megota {
        const otherValue = new Megota(other).value;
        return new Megota(this.value.mul(otherValue));
    }
    
}