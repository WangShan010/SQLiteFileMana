
let MOVE_LEFT = Buffer.from('1b5b3130303044', 'hex').toString();
let MOVE_UP = Buffer.from('1b5b3141', 'hex').toString();
let CLEAR_LINE = Buffer.from('1b5b304b', 'hex').toString();
let stringWidth = require('string-width');

module.exports = function (stream) {
    let write = stream.write;
    let str;

    stream.write = function (data) {
        if (str && data !== str) str = null;
        return write.apply(this, arguments);
    };

    if (stream === process.stderr || stream === process.stdout) {
        process.on('exit', function () {
            if (str !== null) stream.write('');
        });
    }

    let prevLineCount = 0;
    let log = function () {
        str = '';
        let nextStr = Array.prototype.join.call(arguments, ' ');

        // Clear screen
        for (let i = 0; i < prevLineCount; i++) {
            str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '');
        }

        // Actual log output
        str += nextStr;
        stream.write(str);

        // How many lines to remove on next clear screen
        let prevLines = nextStr.split('\n');
        prevLineCount = 0;
        for (let i = 0; i < prevLines.length; i++) {
            prevLineCount += Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1;
        }
    };

    log.clear = function () {
        stream.write('');
    };

    return log;
};

module.exports.stdout = module.exports(process.stdout);
module.exports.stderr = module.exports(process.stderr);
