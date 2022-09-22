// config-like settings, that might be exposed to users later
export const ROUNDED_ADJUSTMENTS = false // Currently I think it's better to show the original values even if a rounding is selected

// enums
export const DISPATCH_ACTION = {
    PROJECT_LOADED: "PROJECT_LOADED",
    WEEK_LENGTH_CHANGED: "WEEK_LENGTH_CHANGED",
    START_CHANGED: "START_CHANGED",
    ADJUST: "ADJUST",
    IGNORE_PROJECT_TOGGLE: "IGNORE_PROJECT_TOGGLE",
    ROUNDING_CHANGED: "ROUNDING_CHANGED",
    ORDER_CHANGED: "ORDER_CHANGED",
    HIDE_IGNORED_TOGGLE: "HIDE_IGNORED_TOGGLE",
}

// should not change these
export const DEFAULT_ADJUSTMENT = 1

export const DOCS_BASE_PATH = process.env.REACT_APP_DOCS_BASE_PATH || ""