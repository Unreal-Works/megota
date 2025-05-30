# MegotaNumber

![Version](https://img.shields.io/npm/v/megotanumber)
![License](https://img.shields.io/npm/l/megotanumber)

A powerful TypeScript/JavaScript library for handling arithmetic with extremely large numbers, supporting values up to $\{{10, 9e15, 1, 1, 2\}}$ and beyond standard number formats.

## Features

- **Unlimited Magnitude**: Process numbers far beyond JavaScript's native limitations
- **Extensive Operations**: Support for standard arithmetic, trigonometric functions, logarithms, tetration, and advanced hyperoperations
- **Multiple Notations**: Parse and work with multiple notation formats for enormous numbers
- **Full TypeScript Support**: Comprehensive type definitions for improved developer experience

## Installation

```bash
npm install megotanumber
```

## Quick Start

```javascript
import MegotaNumber from 'megotanumber';

// Basic operations
const a = MegotaNumber.fromString('10^100');  // 10 googol
const b = MegotaNumber.fromNumber(1000);      // 1000

// Arithmetic operations
const sum = a.add(b);            // 10^100 + 1000
const product = a.mul(b);        // 10^100 * 1000
const power = b.pow(a);          // 1000^(10^100)

// Advanced operations
const tetrated = MegotaNumber.TEN.tetrate(MegotaNumber.fromNumber(3));  // 10^10^10
const c = MegotaNumber.fromString('J^63');    // Using PsiCubed2's Letter Notation

console.log(a.toString());        // "1e100"
console.log(tetrated.toString()); // "10^^3"
console.log(c.toString());        // "J^63"
```

## Notations Supported

MegotaNumber incorporates several different notation systems for representing extraordinarily large numbers:

### [Knuth's Up-Arrow Notation](https://en.wikipedia.org/wiki/Knuth%27s_up-arrow_notation)
- $a ↑↑ b$ refers to a tetrated to b
- Example: $10 ↑↑ 3$ represents $10^{10^{10}}$

### [X-Sequence Hyper Notation](https://googology.fandom.com/wiki/X-Sequence_Hyper-Exponential_Notation)
- $a\{{x\}}b$ refers to $a \underbrace{\uparrow\uparrow...\uparrow}_{x\space arrows} b$
- Example: $4\{{5\}}3$ represents $4 ↑↑↑↑↑ 3$ (4 heptated to 3)
- Rules: $a\{{1\}}n = a^n$ and $a\{{x\}}1 = a$

### [Bower's Exploding Array Function](https://googology.fandom.com/wiki/Bowers%27_Exploding_Array_Function)
- $\{{a, b, c, d\}} = a\{{c\}}^db$, where d is the number of sets of braces
- Example: $\{{3, 3, 2, 1\}}$ represents $3\{{2\}}3 = 3^{27}$
- Rules:
  - $\{{a, b, 1, 1\}} = \{{a, b\}} = a\{{1\}}b = a ↑ b$
  - $\{{a, 1, c, d\}} = a\{{c\}}^d1 = a$
  - $\{{a, b, 1, d\}} = \{{a, a, \{{a, b - 1, 1, d\}}, d - 1\}}, b, d > 1$
  - $\{{a, b, c, d\}} = \{{a, b, \{{a, b - 1, c, d\}}, d - 1\}}, b > 1$

### [PsiCubed2's Letter Notation](https://googology.fandom.com/wiki/User_blog:PsiCubed2/Letter_Notation_Part_II)
- $Ex = 10\{{1\}}x,\space Fx = 10\{{2\}}x,\space Gx = 10\{{3\}}x,\space Hx = 10\{{4\}}x$
- Example: $E100$ represents $10^{100}$ (googol)
- Diagonalization: $Jx = 10\{{x\}}10$
- Extended: $Nx = \{{10, \lfloor x \rfloor +1, 2 \cdot 5^{\{x\}}, \lfloor x \rfloor\}}$

### [Fast-Growing Hierarchy](https://en.wikipedia.org/wiki/Fast-growing_hierarchy)
- $f_{\omega^2+1}$ approximately corresponds to megotional growth rate
    - [Megotion](https://googology.wikia.org/wiki/Megotion) refers to $\{{a, b, 1, 1, 2\}}$
- This library supports up to $\{{10, 9e15, 1, 1, 2\}}$

## Acknowledgements

This project is a fork of [MegotaNum.js](https://github.com/sonic3XE/MegotaNum), originally created by [sonic3XE](https://github.com/sonic3XE).

Code snippets and templates were borrowed from [Decimal.js](https://github.com/MikeMcl/decimal.js/) by [Naruyoko](https://github.com/Naruyoko).

## License

MIT