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
    let slog = require('single-line-log').stdout;
    class ProgressBar {
        start_time;
        description;
        length;
        iscompleted;
        constructor(description, bar_length) {
            this.start_time = Date.now();
            this.description = description || 'Progress';
            this.length = bar_length || 25;
            this.iscompleted = false;
        }
        render = (opts) => {
            if (this.iscompleted) {
                return;
            }
            let percent = (opts.completed / opts.total).toFixed(4);
            let cell_num = Math.floor(Number(percent) * this.length);
            let cell = '';
            for (let i = 0; i < cell_num; i++) {
                cell += '█';
            }
            let empty = '';
            for (let i = 0; i < this.length - cell_num; i++) {
                empty += '░';
            }
            let cmdText = this.description + ': ' + (100 * Number(percent)).toFixed(2) + '% ' + cell + empty + ` ${opts.completed}/${opts.total} (已运行：${formatTime((Date.now() - this.start_time) / 1000)})`;
            slog(cmdText);
            if (opts.completed / opts.total === 1) {
                this.iscompleted = true;
            }
        };
    }
    function formatTime(time) {
        time = Math.floor(time);
        let h = Math.floor(time / 3600);
        let m = Math.floor((time - h * 3600) / 60);
        let s = time - h * 3600 - m * 60;
        return `${h < 10 ? '0' + h : h}h:${m < 10 ? '0' + m : m}m:${s < 10 ? '0' + s : s}s`;
    }
    return ProgressBar;
});
//# sourceMappingURL=ProgressBar.js.map