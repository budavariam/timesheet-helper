import { DISPATCH_ACTION } from "../util/const"
import { formatDuration } from "../util/format"


export function Duration(props: any) {
    const num: number = props.value
    const projectID: string = props.projectID
    const columnIndex: number = props.columnIndex
    const adjusted: number = props.adjusted
    const adjustable: boolean = props.adjustable
    const dispatch: Function = props.dispatch

    let durationNodes = null
    if (num) {
        const durationItems = formatDuration(num).split(":")
        durationNodes = durationItems.map((e, i) => <span key={i} className={`time ${e === "00" ? "irrelevant" : ""} ${i < durationItems.length - 1 ? "sep" : ""}`}>{e}</span>)
    }

    return <span className="duration">
        {adjustable && <span className="adjust" onClick={() => { dispatch({ type: DISPATCH_ACTION.ADJUST, projectID, columnIndex, value: -1 }) }}>-</span>}
        {durationNodes}
        <span
            className={`adjustmentInfo ${adjusted > 0 ? "plus" : "minus"}`}
            style={{ visibility: adjusted ? "visible" : "hidden" }}
            title={`Changed by: ${formatDuration(adjusted)}`}>
            *
        </span>
        {adjustable && <span className="adjust" onClick={() => { dispatch({ type: DISPATCH_ACTION.ADJUST, projectID, columnIndex, value: 1 }) }}>+</span>}
    </span>
}
