export interface IComponentBase {
    pageHeader: string;
}
export interface IChartReport extends IComponentBase {
    diseaseName: string;
    survialCurveDomId: string;
    popDistributionDomId: string;
    riskScoreDomId: string;
}
export interface IPageHeader {
    copyRightYear: number
}