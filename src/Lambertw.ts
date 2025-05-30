export const OMEGA = 0.5671432904097838;  //W(1,0)

export class LambertWError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LambertWError";
    }
}

export function f_lambertw(z: number, tol = 1e-10, principal = true): number {
    let w: number;
    if (!Number.isFinite(z))
        return z;

    if (principal) {
        if (z === 0)
            return z;
        if (z === 1)
            return OMEGA;

        if (z < 10)
            w = 0;
        else
            w = Math.log(z) - Math.log(Math.log(z));
    }
    else {
        if (z === 0)
            return -Infinity;
        if (z <= -0.1)
            w = -2;
        else
            w = Math.log(-z) - Math.log(-Math.log(-z));
    }

    for (let i = 0; i < 100; ++i) {
        const wn = (z * Math.exp(-w) + w * w) / (w + 1);
        if (Math.abs(wn - w) < tol * Math.abs(wn))
            return wn;
        w = wn;
    }
    throw new LambertWError("Iteration failed to converge: " + z);
}