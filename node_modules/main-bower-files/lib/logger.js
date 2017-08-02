var chalk = require('chalk'),
    colors = ['magenta', 'green', 'blue', 'grey', 'yellow'],
    widths = [18, 24, 18, 0, 0];

module.exports = function() {
    var args = [].map.call(arguments, function(val, i) {
        val = typeof val === 'object' ? JSON.stringify(val) : val;
        val = width(val, widths[i]);
        val = chalk[colors[i]](val);

        return val;
    });

    console.log.apply(null, args);
};

function width(str, count) {
    if (str.length < count) {
        str += new Array(count - str.length).join(' ');
    }

    return str;
}
