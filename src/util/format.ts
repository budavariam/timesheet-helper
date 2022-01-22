import * as moment from "moment"
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export const formatAllDuration = (msec: number) => moment
    .duration(msec, 'milliseconds')
    .format("hh:mm", { stopTrim: "h" })

export const formatDuration = (msec: number) => msec
    ? formatAllDuration(msec)
    : ""
