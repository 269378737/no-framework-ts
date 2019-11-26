/**
 * 全局常量定义库
 */

export const CHART_BG_COLORS = ['#53A784', '#F6AF63', 'red'];
export const RISK_LEVEL_DESC = ['低风险', '中风险', '高风险'];
export const RISK_LEVEL_ARR = ['low', 'middle', 'high'];
export const HEAT_MAP_COLORS = ['#1aa0dd', '#fef7b9', 'rgb(201, 84, 68)'];



/**
 * 风险等级
 */
export enum RISK_LEVEL {
    LOW = 'low',
    MIDDLE = 'middle',
    HIGH = 'high'
}


export enum DISEASE {
    hypertension = '高血压',
    heartDisease = '心脏疾病',
    diabetes = '糖尿病',
    kidneyDisease = '肾病'
}

// 高血压并发症
export enum HYPERTENSION {
    eh = '原发性高血压',
    hwn = '高血压伴肾病',
    hwhf = '高血压伴心力衰竭',
    hwoc = '高血压伴其他并发症'
}

// 心脏疾病并发症
export enum HEART_DISEASE {
    ami = '急性心肌梗死',
    chf = '充血性心力衰竭',
    chdhf = '冠心病伴心力衰竭'
}

// 糖尿病并发症
export enum DIABETES {
    diabetes = '糖尿病',
    dkd = '糖尿病伴肾病',
    dhd = '糖尿病伴心脏病'
}

// 肾病并发症
export enum KIDNEY_DISEASE {
    ckd = '慢性肾病',
    arf = '急性肾功能衰竭',
    esrd = '终末期肾病'
}
