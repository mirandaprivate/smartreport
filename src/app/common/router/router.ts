import {isString} from '@logi/base/ts/common/type_guard'

// tslint:disable: no-magic-numbers const-enum
export enum RouteType {
    EMPTY_GROUP = 'empty_group',
    PERM = 'perm',
    TEMPLATE = 'template',
    TEAM_LOG = 'team-log',
    REVIEW = 'review',
    MODELS = 'models',
    LOGIN = 'login',
    BUILDER = 'builder',
    DATABASE = 'db',
    MANAGE_BACKEND = 'be',
    PERSONAL_CENTER = 'pc',
    DIVIDE_INTO_TEAM= 'divide',
    TEAM_MANAGE = 'user',
    // 解析规则
    PARSING_RULE = 'parsing-rule',
    // 解析规则模板
    TEMPLATE_PARSING = 'parsing-rule',
    // 管理后台
    ADMIN = 'admin',
    // 团队配置
    TEAM_CONFIG = 'team-config',
    // 团队信息
    TEAM_INFO = 'info',
    // 服务信息
    SERVICE_INFO = 'service',
    MODEL_BOARD = 'board',
    // 成员
    MEMBER = 'member',
    // 成员管理
    MEMBER_MANAGE = 'manage',
    // 研究组
    MEMBER_RESEARCH_GROUP = 'group',
    STOCK = 'stock',
    STOCK_MANAGE = 'stock-manage',
    MODELING = 'modeling',
    // 研报编辑页面
    NOTE_EDITOR = 'note',
    // 研报模板编辑页面
    NOTE_TEMPLATE_EDITOR = 'note-template',
    // 研报管理页面
    NOTE_MANAGE = 'notes',
    CORE_INDICATOR = 'core-indicator',
    DETAILED_INDICATOR = 'detailed-indicator',
    PROJECT_TYPE_INVOLVED = 'involved',
    PROJECT_TYPE_RESPONSIBLE = 'responsible',
    PROJECT_TYPE_ALL = 'all',
    REVIEW_ALL = 'all',
    REVIEW_MY = 'my',
    TEMPLATE_NOTE = 'note',
    TEMPLATE_MODEL = 'model',
    TEMPLATE_TEAM = 'team',
    TEMPLATE_REVIEW = 'group-template',
    PREM_TEAM = 'team',
    PREM_PROJECT = 'project',
    // 公司未覆盖
    COVER_UNCOVERED = 'uncovered',
    // 公司已覆盖, 但无权限访问
    COVER_UNAUTHORIZED = 'unauthorized',
}

/**
 * NOTE: should use snakecase as value.
 */
export const enum SearchKey {
    MODEL_ID = 'modelId',
    TEAM_ID = 'teamId',
    REVIEW_PROJ = 'reviewProj',
    VERSION_ID = 'vid',
    HIST_MODEL_ID = 'histMid',
    BUILDER = 'builder',
    TEMPLATE_ID = 'templateId',
    NOTE_ID = 'noteId',
    NOTE_TEMPLATE_ID = 'noteTemplateId',
    PARSING_RULE_ID = 'parsingRuleId',
    /**
     * Identify user used in inviting a user to a team.
     */
    TOKEN = 'token',
    /**
     * 'PARAM' and 'SIGN' belong to quick login by curie user, T3771
     */
    PARAM = 'params',
    SIGN = 'sign',
}

/**
 * For use param in route. See https://angular.io/guide/router#route-parameters
 */
// tslint:disable-next-line: const-enum
export enum Param {
    /**
     * 团队ID-位置(如沪深)-股票代码, 如1-1-600519
     * 未覆盖的个股在进入个股详情页面时，无法获取team信息
     * TODO(zengkai): 通过修改路由结构或其他办法隐去team信息
     */
    STOCK_ID = 'stockId',
    PROJECT_ID = 'projectId',
    PAGE = 'page',
    PAGESIZE = 'page_size',
}

function baseModelUrl(projectId: number): string {
    return `${PREFIX}/${RouteType.STOCK}/${PID_PREFIX}${projectId}`
}

export function getModelUrl(pid: number): string {
    return `${baseModelUrl(pid)}/${RouteType.MODELS}`
}

const READONLY = 'r'
export function checkReadonly(id: unknown): boolean {
    if (!isString(id))
        return false
    return id.startsWith(READONLY)
}
const MID_PREFIX = 'm'
export function builderLink(modelId: number, isReadonly = false): string {
    const model = isReadonly ? `${READONLY}${MID_PREFIX}${modelId}` :
        `${MID_PREFIX}${modelId}`
    return `${PREFIX}/${RouteType.BUILDER}/${model}`
}

export function getMid(id: unknown): number | undefined {
    const normalReg = new RegExp(`^[${MID_PREFIX}][0-9]*$`)
    if (normalReg.test(String(id)))
        return Number(String(id).substring(1))
    const readonlyReg = new RegExp(`^${READONLY}[${MID_PREFIX}][0-9]*$`)
    if (readonlyReg.test(String(id)))
        return Number(String(id).substring(2))
    return
}

const PID_PREFIX = 'p'

export function getPid(id: unknown): number | undefined {
    const normalReg = new RegExp(`^[${PID_PREFIX}][0-9]*$`)
    if (normalReg.test(String(id)))
        return Number(String(id).substring(1))
    const readonlyReg = new RegExp(`^${READONLY}[${PID_PREFIX}][0-9]*$`)
    if (readonlyReg.test(String(id)))
        return Number(String(id).substring(2))
    return
}

/**
 * Couple with 'getPid()'
 */
export function formatPid(pid: number): string {
    return `${PID_PREFIX}${pid}`
}

export const PREFIX = RouteType.MODELING
export const PROJECT_URL = `${PREFIX}/${RouteType.STOCK_MANAGE}`
export const BE_HOME = `${RouteType.MANAGE_BACKEND}/${RouteType.TEAM_MANAGE}`
export const LOGIN_URL = `${PREFIX}/${RouteType.LOGIN}`
export const INVITE_URL = `${PREFIX}/invite`
export const HOME = PROJECT_URL
export const REVIEW_LINK = `${PREFIX}/${RouteType.REVIEW}/${RouteType.REVIEW_MY}`
export const EMPTY_GROUP_URL = `${PREFIX}/${RouteType.EMPTY_GROUP}`