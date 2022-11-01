// 这里用到一个很实用的 npm 模块，用以在同一行打印文本
let slog = require('single-line-log').stdout;

// 封装的 ProgressBar 工具
class ProgressBar {
    private start_time: number;
    private description: string;
    private length: number;
    private iscompleted: boolean;

    constructor(description: string, bar_length: number) {
        this.start_time = Date.now();
        // 两个基本参数(属性)
        this.description = description || 'Progress';       // 命令行开头的文字信息
        this.length = bar_length || 25;                     // 进度条的长度(单位：字符)，默认设为 25
        this.iscompleted = false;
    }

    // 刷新进度条图案、文字的方法
    render = (opts: any) => {
        if (this.iscompleted) {
            return;
        }

        let percent: string = (opts.completed / opts.total).toFixed(4);    // 计算进度(子任务的 完成数 除以 总数)
        let cell_num = Math.floor(Number(percent) * this.length);             // 计算需要多少个 █ 符号来拼凑图案

        // 拼接黑色条
        let cell = '';
        for (let i = 0; i < cell_num; i++) {
            cell += '█';
        }

        // 拼接灰色条
        let empty = '';
        for (let i = 0; i < this.length - cell_num; i++) {
            empty += '░';
        }

        // 拼接最终文本
        let cmdText = this.description + ': ' + (100 * Number(percent)).toFixed(2) + '% ' + cell + empty + ` ${opts.completed}/${opts.total} (已运行：${formatTime((Date.now() - this.start_time) / 1000)})`;


        // 在单行输出文本
        slog(cmdText);

        if (opts.completed / opts.total === 1) {
            this.iscompleted = true;
        }
    };
}

// 时间格式化，秒转换为 xx:xx:xx
function formatTime(time: number) {
    time = Math.floor(time);
    let h = Math.floor(time / 3600);
    let m = Math.floor((time - h * 3600) / 60);
    let s = time - h * 3600 - m * 60;
    return `${h < 10 ? '0' + h : h}h:${m < 10 ? '0' + m : m}m:${s < 10 ? '0' + s : s}s`;
}

// 模块导出
export = ProgressBar;
