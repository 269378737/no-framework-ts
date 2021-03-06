import { HighChartsFormatTool } from '../../src/utils/chart'

test('formatAreaMapModel() 格式化数据为highcharts面积图所需数据格式', function() {
   expect(HighChartsFormatTool.formatAreaMapModel(
    [
        [-82.8988, 0],
        [-82.5213, 0],
        [-82.1437, 0],
        [-81.7662, 0],
        [-71.5723, 0.0001],
        [-71.1948, 0.0001],
        [-70.8172, 0.0001],
        [-70.4397, 0.0001]
   ], [-80])).toEqual({
        seriesArrs:[[
            [-82.8988, 0],
            [-82.5213, 0],
            [-82.1437, 0],
            [-81.7662, 0]
        ], [
            [-81.7662, 0],
            [-71.5723, 0.0001],
            [-71.1948, 0.0001],
            [-70.8172, 0.0001],
            [-70.4397, 0.0001]
        ]],
        xAxis: [-82.8988, -82.5213, -82.1437, -81.7662, -71.5723, -71.1948, -70.8172, -70.4397],
        yAxis: [0, 0, 0, 0, 0.0001, 0.0001, 0.0001, 0.0001]
   })
})