import moment, { Moment } from "moment";

export const enumerateDaysBetweenDates = function (startDate: Moment, endDate: Moment) {
    const now = startDate.clone()
    const dates = []
    let i = 0

    while (i < 7 && now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(1, 'days')
        i++
    }
    dates.push("Totals")
    return dates
};

export const enumeratePastMondays = function (startDate: Moment, count: number = 10) {
    const now = startDate.clone().day(1)
    const dates = []
    let i = 0

    while (i < count) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(-7, 'days')
        i++
    }
    return dates
};

export const roundToNearestNMinutes = (roundTo: number) => (startMS: number) => {
    if (!startMS) {
        return 0
    }
    if (!roundTo) {
        return startMS
    }
    const start = moment(startMS)
    let remainder = roundTo - (start.minute() + start.second() / 60) % roundTo;

    remainder = (remainder > roundTo / 2)
        ? -roundTo + remainder
        : remainder
    const rounded = +start.add(remainder, "minutes").seconds(0)
    return rounded 
        ? rounded 
        : 1 // show a minimum value 1ms
}