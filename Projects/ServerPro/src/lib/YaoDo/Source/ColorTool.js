(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    let ColorTool = {
        getRandomColor() {
            const rgb = [];
            for (let i = 0; i < 3; ++i) {
                let color = Math.floor(Math.random() * 256).toString(16);
                color = color.length === 1 ? '0' + color : color;
                rgb.push(color);
            }
            return '#' + rgb.join('');
        },
        hexToRGB(hex) {
            const extendHex = (shortHex) => '#' + shortHex.slice(shortHex.startsWith('#') ? 1 : 0).split('').map(x => x + x).join('');
            const extendedHex = hex.slice(hex.startsWith('#') ? 1 : 0).length === 3 ? extendHex(hex) : hex;
            return `rgb(${parseInt(extendedHex.slice(1), 16) >> 16}, ${(parseInt(extendedHex.slice(1), 16) & 0x00ff00) >> 8}, ${parseInt(extendedHex.slice(1), 16) & 0x0000ff})`;
        },
        RGBToHex(r, g, b) {
            let hex = ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
            return hex;
        }
    };
    return ColorTool;
});
//# sourceMappingURL=ColorTool.js.map