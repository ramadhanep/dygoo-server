const moment = require('moment-timezone');
moment().tz("Asia/Jakarta").format();

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm A')
    }
}

module.exports = formatMessage
