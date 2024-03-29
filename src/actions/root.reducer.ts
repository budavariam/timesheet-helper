import { Project, RootAction, RootState, TogglProjectResponse } from '../types';
import { manipulateData, processProjectData } from '../util/projectData';
import { DEFAULT_ADJUSTMENT, DISPATCH_ACTION } from '../util/const';
import moment from 'moment';
import { Map, Set } from "immutable";

export function handleProjectLoaded(start: string, rawData: TogglProjectResponse, weekLength: number, rounding: number, autoIgnore: Set<string>) {
    const dateFrom = start
    const dateTo = moment(start).add(7, 'days').format("YYYY-MM-DD")
    const originalProjectData = processProjectData(rawData, dateFrom, dateTo)
    const projectOrder = originalProjectData.projects.map(e => e.uuid)
    const projectData = manipulateData(originalProjectData, weekLength, rounding, Map<string, number>(), Set<string>(), autoIgnore, projectOrder)
    return {
        projectData,
        originalProjectData,
        projectOrder,
    }
}

export function rootReducer(state: RootState, action: RootAction) {
    if (!action || !action.type) {
        console.warn("Empty action")
        return state
    }
    // console.log("X", state, action)
    switch (action.type) {
        case DISPATCH_ACTION.PROJECT_LOADED: {
            const projectResponse = action.value as TogglProjectResponse
            const { projectData, originalProjectData, projectOrder } = handleProjectLoaded(
                state.start, projectResponse, state.weekLength, state.rounding, state.autoIgnore
            )
            return {
                ...state,
                projectData,
                originalProjectData,
                adjustments: Map<string, number>(),
                ignoreProjects: Set<string>(),
                hideIgnore: false,
                projectOrder
            }
        }
        case DISPATCH_ACTION.ORDER_CHANGED: {
            const uuid = action.value as string
            const currIndex = state.projectOrder.indexOf(uuid);
            if (currIndex === 0) {
                return state
            }
            const newOrder = [...state.projectOrder]
            newOrder.splice(
                currIndex - 1, // starting form the item above
                2,  // remove 2 items
                state.projectOrder[currIndex], // add the selected item first
                state.projectOrder[currIndex - 1]) // then the one before it
            return {
                ...state,
                projectOrder: newOrder,
                projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, state.adjustments, state.ignoreProjects, state.autoIgnore, newOrder),
            }
        }
        case DISPATCH_ACTION.WEEK_LENGTH_CHANGED: {
            const weekLength = (action.value as number)
            return {
                ...state,
                weekLength,
                projectData: manipulateData(state.originalProjectData, weekLength, state.rounding, state.adjustments, state.ignoreProjects, state.autoIgnore, state.projectOrder),
            }
        }
        case DISPATCH_ACTION.START_CHANGED: {
            return { ...state, start: (action.value as string) }
        }
        case DISPATCH_ACTION.ROUNDING_CHANGED: {
            const rounding = (action.value as number)
            return {
                ...state,
                rounding,
                projectData: manipulateData(state.originalProjectData, state.weekLength, rounding, state.adjustments, state.ignoreProjects, state.autoIgnore, state.projectOrder),
            }
        }
        case DISPATCH_ACTION.IGNORE_PROJECT_TOGGLE: {
            const projectID = action.value as string || ""
            const proj = state.projectData.projects.filter((e: Project) => e.uuid === projectID)[0]
            if (!proj) {
                return state
            }
            const ignoreProjects = (state.ignoreProjects.has(proj.uuid))
                ? state.ignoreProjects.remove(proj.uuid)
                : state.ignoreProjects.add(proj.uuid)

            return {
                ...state,
                ignoreProjects,
                projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, state.adjustments, ignoreProjects, state.autoIgnore, state.projectOrder)
            }
        }
        case DISPATCH_ACTION.HIDE_IGNORED_TOGGLE: {
            return {
                ...state,
                hideIgnored: !state.hideIgnored,
            }
        }
        case DISPATCH_ACTION.ADJUST: {
            const projectID = action.projectID || ""
            const columnIndex = action.columnIndex || 0
            if (!projectID) {
                return state
            }
            const adjustmentKey = `${projectID}-${columnIndex}`
            const adjustments = state.adjustments.set(adjustmentKey,
                (state.adjustments.get(adjustmentKey) || 0)
                // original value
                +
                (action.value as number) * ((state.rounding || DEFAULT_ADJUSTMENT) * 60 * 1000)
                // adjust data
            )

            return {
                ...state,
                adjustments,
                projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, adjustments, state.ignoreProjects, state.autoIgnore, state.projectOrder),
            }
        }
        case DISPATCH_ACTION.REPLACE_IGNORED: {
            let autoIgnore = Set<string>([])
            if (!action.autoIgnore) {
                return state
            }
            for (let item of action.autoIgnore) {
                autoIgnore = autoIgnore.add(item)
            }
            autoIgnore = autoIgnore.remove("")
            debugger
            return {
                ...state,
                autoIgnore: autoIgnore,
                projectData: manipulateData(state.originalProjectData, state.weekLength, state.rounding, state.adjustments, state.ignoreProjects, autoIgnore, state.projectOrder)
            }
        }
        default: {
            console.warn("Unknown action", action)
        }
    }
    // console.log(action)
    return state
}
