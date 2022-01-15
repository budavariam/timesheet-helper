import { DISPATCH_ACTION } from "../util/const"
import { formatDuration } from "../util/format"


export function Duration(props: any) {
    const num: number = props.value
    const adjustable: boolean = props.adjustable
    const dispatch: Function = props.dispatch
    if (!num) {
        return null
    }
    const durationItems = formatDuration(num).split(":")
    return <span className="duration">
    {adjustable && <span className="adjust" onClick={() => {dispatch({type: DISPATCH_ACTION.ROUNDING, value: -1})}}>-</span>}
    {
        
        durationItems.map((e, i) => <span key={i} className={`time ${e === "00" ? "irrelevant" : ""} ${i < durationItems.length-1 ? "sep" : ""}`}>{e}</span>)
    }
    {adjustable && <span className="adjust" onClick={() => {dispatch({type: DISPATCH_ACTION.ROUNDING, value: 1})}}>+</span>}
    </span>
}
