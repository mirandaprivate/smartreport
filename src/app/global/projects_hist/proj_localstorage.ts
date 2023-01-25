import {get, set} from '@logi/src/app/base/storage/localstorage'

const HISTORY_PROJ_PREFIX = 'history_proj_'

const MAX_LENGTH = 5

/**
 * When the user enters the research report template editing page,
 * model editing page and model list page, we need to record the project id
 * that the user browses for the model list page to switch project.
 */
export function setHistProj(userId: string, stockId: string): void {
    const hist = getHistProjs(userId)
    const stack: string[] = []
    stack.push(stockId)
    hist.forEach(r=>{
        if(r !== stockId)
            stack.push(r)
    })
    const curr = stack.slice(0, MAX_LENGTH)
    const currProjString = JSON.stringify(curr)
    set(GETKEY(userId), currProjString)
}

export function getHistProjs(userId: string): readonly string[] {
    const projectIds = get(GETKEY(userId))
    if(projectIds === undefined)
        return []
    return (JSON.parse(projectIds) as Array<string>)
}

const GETKEY = (userId: string): string =>
    `${HISTORY_PROJ_PREFIX}${userId}`
