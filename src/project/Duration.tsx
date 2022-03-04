import { DISPATCH_ACTION } from "../util/const"
import { formatAllDuration, formatDuration } from "../util/format"

const createDurationNodes = (e: string, i: number, lst: string[]) => <span key={i} className={`time ${e === "00" ? "irrelevant" : ""} ${i < lst.length - 1 ? "sep" : ""}`}>{e}</span>

type DurationProps = {
    projectID: string,
    columnIndex: number,
    num: number,
    adjusted: number,
    dispatch: Function,
    hideInfo?: boolean,
    showEmpty?: boolean,
    adjustable?: boolean,
}

export function Duration(props: DurationProps) {
    const {
        num,
        projectID,
        hideInfo,
        columnIndex,
        adjusted,
        adjustable,
        dispatch,
        showEmpty,
    } = props

    const durationItems = formatAllDuration(num).split(":")
    const durationNodes = durationItems.map(createDurationNodes)

    return <span className="duration">
        {adjustable && <span className="adjust" onClick={() => { dispatch({ type: DISPATCH_ACTION.ADJUST, projectID, columnIndex, value: -1 }) }}>-</span>}
        <span style={{ visibility: num || showEmpty || adjusted !== 0 ? "visible" : "hidden" }}>{durationNodes}</span>
        {!hideInfo && <span
            className={`adjustmentInfo ${adjusted > 0 ? "plus" : "minus"}`}
            style={{ visibility: adjusted ? "visible" : "hidden" }}
            title={`Changed by: ${formatDuration(adjusted)}`}>
            *
        </span>
        }
        {adjustable && <span className="adjust" onClick={() => { dispatch({ type: DISPATCH_ACTION.ADJUST, projectID, columnIndex, value: 1 }) }}>+</span>}
    </span>
}

Duration.defaultProps = {
    hideInfo: false,
    showEmpty: false,
    adjustable: false,
}