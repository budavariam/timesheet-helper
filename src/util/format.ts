import * as moment from "moment"
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export const formatDuration = (msec: number) => msec
    ? moment
        .duration(msec, 'milliseconds')
        .format("hh:mm:ss", { stopTrim: "h" })
    : msec