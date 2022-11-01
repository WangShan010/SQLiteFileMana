/****************************************************************************
 名称：常用工具函数集合 - 颜色类
 作者：冯功耀
 ****************************************************************************/
let ColorTool = {

    // 生成随机十六进制颜色值（hex）
    getRandomColor() {
        const rgb = [];
        for (let i = 0; i < 3; ++i) {
            let color = Math.floor(Math.random() * 256).toString(16);
            color = color.length === 1 ? '0' + color : color;
            rgb.push(color);
        }
        return '#' + rgb.join('');
    },

    // hexToRGB: 将 十六进制颜色值（hex） 转换为rgb()字符串
    // 使用按位右运算符和掩码位与&(and) 运算符将十六进制颜色代码 (前缀为#) 转换为具有 RGB 值的字符串。如果它是一个3位数的 colorcode, 那么用 extendHex () 函数 (ref.extendHex代码段) 扩展的6位 colorcode 进行相同的处理
    hexToRGB(hex: string) {
        const extendHex = (shortHex: string) => '#' + shortHex.slice(shortHex.startsWith('#') ? 1 : 0).split('').map(x => x + x).join('');
        const extendedHex = hex.slice(hex.startsWith('#') ? 1 : 0).length === 3 ? extendHex(hex) : hex;
        return `rgb(${parseInt(extendedHex.slice(1), 16) >> 16}, ${(parseInt(extendedHex.slice(1), 16) & 0x00ff00) >> 8}, ${parseInt(extendedHex.slice(1), 16) & 0x0000ff})`;
    },

    // RGBToHex: 将 RGB 组件的值转换为 colorcode。
    // 使用按位左移位运算符 (<<) 和toString(16)将给定的 RGB 参数转换为十六进制字符串, 然后padStart(6,'0')以获取6位十六进制值
    RGBToHex(r: number, g: number, b: number) {
        let hex = ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
        return hex;
    }
};

export = ColorTool;
