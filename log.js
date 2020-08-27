const fs = require('fs')

function keepLog(
    event,
    eventHandler,
    eventName,
    msg
) {
    if (!event) event = ''
    if (!eventHandler) eventHandler = ''
    if (!eventName) eventName = ''
    if (!msg) msg = ''

    if (event == 'event') event = '\x1B[34mevent\x1B[39m'
    if (event == 'ready') event = '\x1B[32mready\x1B[39m'
    if (event == 'error') event = '\x1B[31merror\x1B[39m'

    function padding(num, len) {
        if (String(num).length > len) return num;
        return (Array(len).join('0') + num).slice(-len);
    }

    var currentDate = new Date()
    var parsedDate = {
        y: padding(currentDate.getUTCFullYear(), 4),
        mo: padding((currentDate.getUTCMonth() + 1), 2),
        d: padding(currentDate.getUTCDate(), 2),
        h: padding(currentDate.getUTCHours(), 2),
        mi: padding(currentDate.getUTCMinutes(), 2),
        s: padding(currentDate.getUTCSeconds(), 2),
        ms: padding(currentDate.getUTCMilliseconds(), 3)
    }
    var d = parsedDate

    var align = (str, length) => {
        var spaces = ''
        for (let i = 0; i < (length - str.length); i++) {
            spaces = spaces + ' '
        }
        return `${str}${spaces}`
    }

    var divider = ' - '
    var timeStr = `${d.y}-${d.mo}-${d.d}-${d.h}-${d.mi}-${d.s}${divider}`
    var logStr = timeStr + align(event, 5) + divider + align(eventHandler, 15) + divider + align(eventName, 10) + divider + msg

    console.log(logStr)
    fs.appendFile(`./.log/${d.y}-${d.mo}-${d.d}-${d.h}.log`, logStr, (err) => { })
}

module.exports = keepLog