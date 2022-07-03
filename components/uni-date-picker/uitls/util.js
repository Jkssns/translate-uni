/**
 * 获取某年某月有多少天
 */
export const getOneMonthDays = (year, month) => {
    month = Number(month);

    let baseMonthsDays = [];
    var date = new Date(year.toString() ? year + '' : new Date());
    var year = date.getFullYear();
    for (let i = 0; i < 12; i++) {
        let monthData = new Date(year, i + 1, 0); // 获取一个月最后一天的日期
        let monthDataLength = monthData.getDate();
        baseMonthsDays.push(monthDataLength);
    }
    if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
        if (month === 2) {
            baseMonthsDays[month] = 29;
        }
    }
    return baseMonthsDays[month];
};

/**
 * 获取日期的年月日时分秒
 */
export const getTimeArray = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day, hour, minute, second];
};
/**
 * 小于10的数字前面补0
 */
export const addZero = num => {
    return num < 10 ? '0' + num : num;
};

/**
 * 获取当前值在数组中的索引
 */
export const getIndexOfArray = (value, array) => {
    let index = array.findIndex(item => item == value);
    return index > -1 ? index : 0;
};