import { PageHeader } from '../../src/components/page-header/page-header'
import { ChartReport } from "../../src/components/chart-report/chart-report";
import { IChartReport } from '@/model/component';


test('page-header组件', function() {
    const pageHeader = new PageHeader();

    expect(pageHeader.template).toBe('mock-html')
})

test('chart-report组件', function() {
    const data: IChartReport = {
        diseaseName: '疾病一',
        survialCurveDomId: 'id1',
        popDistributionDomId: 'id2',
        riskScoreDomId: 'id3',
    }

    class TempChart extends ChartReport {
        constructor() {
            super(data)
        }
        get _template() {
            return this.template;
        }
    }
    const chart = new TempChart();
    expect(chart._template).toBe('mock-html')
})