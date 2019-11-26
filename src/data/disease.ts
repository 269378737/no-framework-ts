/**
 * 疾病定义 - 报告中可能会检测的疾病
 * 控制报告中疾病的显示
 */
import { RISK_LEVEL, DISEASE, KIDNEY_DISEASE, HYPERTENSION, HEART_DISEASE, DIABETES } from '../utils/global'

export interface IComplication {
    has: boolean;
    name: string;
}

export interface IDiseaseConfig {
    diseaseName: string;
    has: boolean;
    complication: IComplication[];

    riskLevel: string;
    riskScore: number;
    riskCutoff: number[];
    riskSuggestion?: string;

    densityModel: number[][];
    densityCutoff: number[];
    densityValue: number;
}
export const diseaseList: IDiseaseConfig[] = [
    {
        diseaseName: DISEASE.kidneyDisease,
        has: false,
        complication: [
            {
                has: true,
                name: KIDNEY_DISEASE.arf
            }, {
                has: true,
                name: KIDNEY_DISEASE.ckd
            }, {
                has: true,
                name: KIDNEY_DISEASE.esrd
            }
        ],
        riskLevel: RISK_LEVEL.LOW,
        riskSuggestion: '',
        riskScore: 0,
        riskCutoff: [],
        densityCutoff: [],
        densityModel: [],
        densityValue: 0
    },
    {
        diseaseName: DISEASE.hypertension,
        has: false,
        complication: [
            {
                has: true,
                name: HYPERTENSION.eh
            }, {
                has: true,
                name: HYPERTENSION.hwhf
            }, {
                has: true,
                name: HYPERTENSION.hwn
            }, {
                has: true,
                name: HYPERTENSION.hwoc
            }
        ],
        riskLevel: RISK_LEVEL.LOW,
        riskScore: 0,
        riskCutoff: [],
        densityCutoff: [],
        densityModel: [],
        densityValue: 0
    },
    {
        diseaseName: DISEASE.heartDisease,
        has: false,
        complication: [
            {
                has: true,
                name: HEART_DISEASE.ami
            }, {
                has: true,
                name: HEART_DISEASE.chdhf
            }, {
                has: true,
                name: HEART_DISEASE.chf
            }
        ],
        riskLevel: RISK_LEVEL.LOW,
        riskScore: 0,
        riskCutoff: [],
        densityCutoff: [],
        densityModel: [],
        densityValue: 0
    },
    {
        diseaseName: DISEASE.diabetes,
        has: false,
        complication: [
            {
                has: true,
                name: DIABETES.dhd
            }, {
                has: true,
                name: DIABETES.diabetes
            }, {
                has: true,
                name: DIABETES.dkd
            }
        ],
        riskLevel: RISK_LEVEL.LOW,
        riskScore: 0,
        riskCutoff: [],
        densityCutoff: [],
        densityModel: [],
        densityValue: 0
    }
]



