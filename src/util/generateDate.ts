import moment from "moment";

export function pastMondays(start: string) {
    return []
}

export const enumerateDaysBetweenDates = function (startDate: any, endDate: any) {
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

export const enumeratePastMondays = function (startDate: any, count: number = 10) {
    const now = moment(startDate).clone().day(1)
    const dates = []
    let i = 0

    while (i < count) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(-7, 'days')
        i++
    }
    return dates
};

export const roundToNearestNMinutes = (startMS: number, roundTo: number) => {
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