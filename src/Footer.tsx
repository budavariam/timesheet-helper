import "./Footer.css"
import { DOCS_BASE_PATH } from "./util/const"

export const Footer = () => {
    return (<footer className="footer">
        <span>©&nbsp;{+new Date().getFullYear()}</span>
        <span>&nbsp;·&nbsp;</span>
        <span><a href="https://budavariam.github.io/">Mátyás&nbsp;Budavári</a></span>
        <span>&nbsp;·&nbsp;</span>
        <span><a href={`${DOCS_BASE_PATH}/timesheet-helper/docs/`} rel="noopener noreferrer" target="_blank">Docs</a></span>
    </footer>)
}