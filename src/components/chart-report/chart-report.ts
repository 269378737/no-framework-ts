import templateHtml from "./chart-report.html"
import { Component } from "../../core/component-base";
import { IChartReport } from "../../model/component";

export class ChartReport extends Component {
    riskScoreContainerId: string;
    survivalCurveComtainerId: string;
    popDistributionContainerId: string;

    constructor(data: IChartReport) {
        super();

        this.riskScoreContainerId = data.riskScoreDomId;
        this.survivalCurveComtainerId = data.survialCurveDomId;
        this.popDistributionContainerId = data.popDistributionDomId;


        this.compile(templateHtml, true, data);
    }
}