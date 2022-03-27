import { useState } from "react"
import "./CopyToClipboard.css"

// inspiration: https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/
type CopyProps = {
    data: string
}

export const CopyToClipboard = function (props: CopyProps) {
    const [text, setText] = useState("Copy")

    return (
        <button className="copy-code-button"
            onClick={async () => {
                const result = await copyCodeToClipboard(props.data)
                if (result) {
                    setText("Copied!")
                    setTimeout(function () {
                        setText("Copy")
                    }, 2000);
                }
            }}
        >
            {text}
        </button>
    )
}

async function copyCodeToClipboard(data: string): Promise<boolean> {
    try {
        const permissionName = "clipboard-write" as PermissionName;
        const result = await navigator.permissions.query({ name: permissionName });
        if (result.state === "granted" || result.state === "prompt") {
            await navigator.clipboard.writeText(data);
            return true
        } else {
            return copyCodeBlockExecCommand(data);
        }
    } catch (error) {
        console.error("Failed to copy data to clpboard", error)
        return copyCodeBlockExecCommand(data);
    }
}

function copyCodeBlockExecCommand(data: string): boolean {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = data;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.visibility = "hidden";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    } catch (err) {
        console.error("Failed to copy data to clipboard", err)
        return false
    }
    return true
}
