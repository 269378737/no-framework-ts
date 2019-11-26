import { diseaseList, IDiseaseConfig } from "./data/disease";
import { DISEASE, RISK_LEVEL_ARR } from './utils/global'
import { cutFn } from "./utils/helper";

import hypertensionHighSuggestion from "./docs/risk-suggestion/hypertension-high.html";

import { ChartReport } from "./components/chart-report/chart-report";
import { IDisease, IChartModel } from "./model/data";
import { IChartReport } from "./model/component";

interface IRenderConfig {
    // 组件类名
    component: any;
    // 是否渲染
    isVisible: boolean;
    // 是否有图表
    hasChart?: boolean;
    // 是否有条形码
    hasBarCode?: boolean;
    // 组件外部渲染所需数据
    diseaseData?: IDiseaseConfig;
    // 组件内部渲染所需数据
    componentdata?: any;
}

declare var model: IChartModel;

function initDiseaseData(patientScore: IDisease) {
    if (patientScore.T2D) {
        hypertension.riskCutoff = model.T2D.riskScore.cutoff;
        hypertension.riskLevel = cutFn(patientScore.T2D.riskScore, model.T2D.riskScore.cutoff, RISK_LEVEL_ARR);
        hypertension.riskScore = patientScore.T2D.riskScore;
        hypertension.riskSuggestion = hypertensionHighSuggestion;
        hypertension.has = patientScore.T2D ? true : false;
        hypertension.densityCutoff = model.T2D.density.cutoff;
        hypertension.densityModel = model.T2D.density.xy;
        hypertension.densityValue = patientScore.T2D.density;
    }
}

const hypertension = diseaseList.find(o => o.diseaseName === DISEASE.hypertension);

export function getRenderConfig(patientScore: IDisease) {
    initDiseaseData(patientScore);

    const renderData: IRenderConfig[] = [
        {
            component: ChartReport,
            hasChart: true,
            hasBarCode: false,
            isVisible: true,
            diseaseData: hypertension,
            componentdata: {
                diseaseName: hypertension.diseaseName,
                popDistributionDomId: 'hua-heat-map-bar',
                survialCurveDomId: 'hua-heat-map',
                riskScoreDomId: 'hua-risk-score',
            } as IChartReport
        }
    ]

    return renderData;
}



