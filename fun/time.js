function time() {
    const time = new Date(),
        year = '' + time.getFullYear(),
        month = ('' + (time.getMonth() + 1)).length < 2 ? '0' + (time.getMonth() + 1) : '' + (time.getMonth() + 1),
        date = ('' + time.getDate()).length < 2 ? '0' + time.getDate() : '' + time.getDate(),
        day = time.getDay(),
        hour = ('' + time.getHours()).length < 2 ? '0' + time.getHours() : '' + time.getHours(),
        minute = ('' + time.getMinutes()).length < 2 ? '0' + time.getMinutes() : '' + time.getMinutes(),
        second = ('' + time.getSeconds()).length < 2 ? '0' + time.getSeconds() : '' + time.getSeconds();
    return {
        year,
        month,
        date,
        day,
        hour,
        minute,
        second
    }

}
module.exports = time;