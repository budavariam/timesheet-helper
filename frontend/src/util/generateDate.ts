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
    console.log(dates)
    return dates
};

export const enumeratePastMondays = function (startDate: any, count: number) {
    const now = moment(startDate).clone().day(1)
    const dates = []
    let i = 0

    while (i < count) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(-7, 'days')
        i++
    }
    console.log(dates)
    return dates
};
