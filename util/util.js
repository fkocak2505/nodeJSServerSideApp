const winston = require("winston");
global.logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ level: 'info', filename: '/tmp/golgi_server.log' })
    ]
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}



module.exports = {
    formatDate,
}