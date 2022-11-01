var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Source/ArrTool.js", "./Source/AsyncTool.js", "./Source/BOMTool.js", "./Source/ColorTool.js", "./Source/DateTool.js", "./Source/GISTool.js", "./Source/HTTPTool.js", "./Source/MathTool.js", "./Source/SafeTool.js", "./Source/StringTool.js", "./Source/Utils.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    const ArrTool_js_1 = __importDefault(require("./Source/ArrTool.js"));
    const AsyncTool_js_1 = __importDefault(require("./Source/AsyncTool.js"));
    const BOMTool_js_1 = __importDefault(require("./Source/BOMTool.js"));
    const ColorTool_js_1 = __importDefault(require("./Source/ColorTool.js"));
    const DateTool_js_1 = __importDefault(require("./Source/DateTool.js"));
    const GISTool_js_1 = __importDefault(require("./Source/GISTool.js"));
    const HTTPTool_js_1 = __importDefault(require("./Source/HTTPTool.js"));
    const MathTool_js_1 = __importDefault(require("./Source/MathTool.js"));
    const SafeTool_js_1 = __importDefault(require("./Source/SafeTool.js"));
    const StringTool_js_1 = __importDefault(require("./Source/StringTool.js"));
    const Utils_js_1 = __importDefault(require("./Source/Utils.js"));
    let YaoDo = {
        ArrTool: ArrTool_js_1.default,
        awaitWrap: AsyncTool_js_1.default,
        BOMTool: BOMTool_js_1.default,
        ColorTool: ColorTool_js_1.default,
        DateTool: DateTool_js_1.default,
        GISTool: GISTool_js_1.default,
        HTTPTool: HTTPTool_js_1.default,
        MathTool: MathTool_js_1.default,
        SafeTool: SafeTool_js_1.default,
        StringTool: StringTool_js_1.default,
        Util: Utils_js_1.default
    };
    return YaoDo;
});
//# sourceMappingURL=index.js.map