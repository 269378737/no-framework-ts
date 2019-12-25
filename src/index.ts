
import $ from 'jquery';
import Loading from '@/lib/loading/loading';
Loading.open();


import '@/assets/css/common.css'
import '@/assets/css/style.css'
import { HBIDXReport, HighChartsFormatTool } from "@/utils/chart";
import { getRenderConfig, IRenderConfig } from '@/component.render.config';
import { CHART_BG_COLORS, RISK_LEVEL_DESC } from '@/utils/global';
import { IBaseInformation, IDisease, IPatientDiseaseData } from '@/model/data';

declare var patientBaseInfo: IBaseInformation[];
declare var personData: IPatientDiseaseData[];
declare var buildAt: string;

const $body = $(document.body);

function renderChart(instance: any, comp: IRenderConfig) {
    console.time(comp.diseaseData.diseaseName)
    HBIDXReport.generateSurvivalCurve(instance.survivalCurveComtainerId, {
        averages: [
            [0, 21.5],
            [50, 17.6],
            [100, 17.7],
            [150, 16.8],
            [200, 17.7],
            [250, 16.3],
            [300, 17.8],
            [350, 18.1],
            [400, 17.2],
            [450, 14.4],
            [500, 13.7],
            [550, 15.7],
            [600, 14.6],
            [650, 15.3],
            [700, 15.3],
            [750, 15.8],
            [800, 15.2],
            [850, 14.8],
            [900, 14.4],
            [950, 15],
            [1000, 13.6]
        ], 
        ranges: [[0, 14.3, 27.7],
            [50, 14.5, 27.8],
            [100, 15.5, 29.6],
            [150, 16.7, 30.7],
            [200, 16.5, 25.0],
            [250, 17.8, 25.7],
            [300, 13.5, 24.8],
            [350, 10.5, 21.4],
            [400, 9.2, 23.8],
            [450, 11.6, 21.8],
            [500, 10.7, 23.7],
            [550, 11.0, 23.3],
            [600, 11.6, 23.7],
            [650, 11.8, 20.7],
            [700, 12.6, 22.4],
            [750, 13.6, 19.6],
            [800, 11.4, 22.6],
            [850, 13.2, 25.0],
            [900, 14.2, 21.6],
            [950, 13.1, 17.1],
            [1000, 12.2, 15.5]
        ]
    })

    HBIDXReport.generateRiskScore(instance.riskScoreContainerId, {
        value: comp.diseaseData.riskScore,
        cutoff: comp.diseaseData.riskCutoff,
        colors: CHART_BG_COLORS,
        labels: RISK_LEVEL_DESC
    });

    const density = HighChartsFormatTool.formatAreaMapModel(comp.diseaseData.densityModel, comp.diseaseData.densityCutoff)
    HBIDXReport.generatePopulationDistribution(instance.popDistributionContainerId, {
        ...density,
        value: comp.diseaseData.densityValue,
        colors: CHART_BG_COLORS
    });
    console.timeEnd(comp.diseaseData.diseaseName);
}


// $body.append(`<div id="not-print-section">
//                 <select id="patients-select"></select>
//                 <button id="print-btn">打印</button>
//                 <span class="check-desens">
//                     <input type="checkbox" checked="checked" id="desensitization">
//                     <label for="desensitization">脱敏</label>
//                 </span>
//             </div>`);


function render(patientDemo: IBaseInformation, patientScore: IDisease) {
    Loading.open();
    const renderData = getRenderConfig(patientScore);
    const fnPromise: any[] = [];
    renderData.forEach(comp => {
        if (comp.isVisible) {
            const Component = comp.component;
            let instance = new Component(comp.componentdata);
            $body.append(instance.template)
            
            // 有条形码的生成条形码
            if (comp.hasBarCode) {
                // code....
            }

            // 需要生成highchart图表的生成图表
            if(comp.hasChart) {
                fnPromise.push([renderChart, instance, comp]);
            }
        }  
    })
    
    setTimeout(() => {
        fnPromise.map(o => o[0](o[1], o[2]));
        Loading.close();
    })
}

render(patientBaseInfo[0], personData[0].model);

// 可以直接通过jQuery操作dom 或者进行事件处理
// $('#print-btn').click(function() {
//     window.print();
// })





const version = require('../package.json').version;
console.log(`
################################################################################                                                                  
 __  __ ____  ____   ___  ____  _____   ____  _____ ____   ___  ____ _____ 
|  \\/  |  _ \\|  _ \\ / _ \\| __ )| ____| |  _ \\| ____|  _ \\ / _ \\|  _ |_   _|
| |\\/| | |_) | |_) | | | |  _ \\|  _|   | |_) |  _| | |_) | | | | |_) || |  
| |  | |  __/|  _ <| |_| | |_) | |___  |  _ <| |___|  __/| |_| |  _ < | |  
|_|  |_|_|   |_| \\_\\\\___/|____/|_____| |_| \\_|_____|_|    \\___/|_| \\_\\|_|  
                                                                          
ReportType: MS
Version:    v${version}
BuildAt:    ${buildAt}
################################################################################
`)
