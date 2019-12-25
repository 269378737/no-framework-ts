
import * as Highcharts from 'highcharts'
import { cutFn, calculateZScore } from '@/utils/helper';
import { IHeatMap } from '@/model/data';

declare var require: any;
require('highcharts/modules/boost')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/bullet')(Highcharts);

/**
 * HighCharts 全局设置
 */
Highcharts.setOptions({
    title: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: false
    }
});

/** 调整仪表盘图的marker */
Highcharts.seriesTypes.gauge.prototype.translate = function() {
    var series = this,
        yAxis = series.yAxis,
        options = series.options,
        center = yAxis.center;
  
    series.generatePoints();

    Highcharts.each(series.points, function(point: any) {
  
        var dialOptions = Highcharts.merge(options.dial, point.dial),
            isRectanglePoint = point.series.userOptions.isRectanglePoint,
            radius = (Highcharts.pInt(Highcharts.pick(dialOptions.radius, 80)) * center[2]) / 200,
            baseLength = (Highcharts.pInt(Highcharts.pick(dialOptions.baseLength, 70)) * radius) / 100,
            rearLength = (Highcharts.pInt(Highcharts.pick(dialOptions.rearLength, 10)) * radius) / 100,
            baseWidth = dialOptions.baseWidth || 3,
            topWidth = dialOptions.topWidth || 1,
            overshoot = options.overshoot,
            rotation = yAxis.startAngleRad + yAxis.translate(point.y, null, null, null, true);
    
        // Handle the wrap and overshoot options
        if (Highcharts.isNumber(overshoot)) {
            overshoot = overshoot / 180 * Math.PI;
            rotation = Math.max(yAxis.startAngleRad - overshoot, Math.min(yAxis.endAngleRad + overshoot, rotation));
    
        } else if (options.wrap === false) {
            rotation = Math.max(yAxis.startAngleRad, Math.min(yAxis.endAngleRad, rotation));
        }
        
    
        rotation = rotation * 180 / Math.PI;
    
        // Checking series to draw dots
        if (isRectanglePoint) {  //draw new dial
            point.shapeType = 'path';
            point.shapeArgs = {
                d: dialOptions.path || [
                    'M',
                    -rearLength + 8,
                    (-baseWidth / 2) - 6,
                    'L',
                    // -rearLength + 12,
                    // (-baseWidth / 2) + 6,
                    -rearLength + 8,
                    (-baseWidth / 2) + 8,
                    -rearLength - 2,
                    (-baseWidth / 2) + 1,
                    'z'
                ],
                translateX: center[0],
                translateY: center[1],
                rotation: rotation,
                style: 'stroke: white; stroke-width: 2;'
            };
    
        } else {  //draw standard dial
            point.shapeType = 'path';
            point.shapeArgs = {
            d: dialOptions.path || [
                'M', -rearLength, -baseWidth / 2,
                'L',
                baseLength, -baseWidth / 2,
                radius, -topWidth / 2,
                radius, topWidth / 2,
                baseLength, baseWidth / 2, -rearLength, baseWidth / 2,
                'z'
            ],
            translateX: center[0],
            translateY: center[1],
            rotation: rotation
            };
        }

        // Positions for data label
        point.plotX = center[0];
        point.plotY = center[1];
    });
};

export const HBIDXReport = {
    /** 
     * 生成疾病发病风险指数图--仪表盘 
     * value 病人的风险百分数
     * cutoff 分界点-一个数组
     */
    generateRiskScore: function (selector: string | HTMLElement, params: any) {
        let {value, cutoff = [], labels = [], colors = []} = params;

        value = parseFloat(value.toFixed(2));

        cutoff = Array.isArray(cutoff) ? cutoff : [];
        cutoff = cutoff.map((c: any) => c);
        if(value != 0 && !value) {
            alert('发病风险指数为空！');
        }
        return Highcharts.chart(selector, {
            chart: {
                type: 'solidgauge'
            },
        
            pane: {
                center: ['50%', '70%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    borderWidth: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
        
            plotOptions: {
                gauge: {
                    dataLabels: {
                        y: -40,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                minorTickLength: 0,
                minorTickPosition: 'outside',
                lineWidth: 0,
                tickLength: 10,
                tickWidth: 1,
                tickPosition: 'outside',
                tickInterval: 1,
                tickPositions: [0, ...cutoff, 100],
                labels: {
                    x: 10,
                    distance: '30',
                    format: '{value}%',
                },
                title: {
                    text: cutFn(value, cutoff, labels),
                    y: 100,
                    x: 0,
                    useHTML: true,
                    style: {
                        fontSize: '26px',
                        color: cutFn(value, cutoff, colors),
                        fontWeight: 'bold'
                    }
                },
                plotBands: (function() {
                    const bands: any[] = [];

                    if (cutoff.length === 0) {
                        bands.push({
                            from: 0,
                            to: 100,
                            color: colors[0],
                            thickness: '40%'
                        })
                    }

                    cutoff.forEach((cutOffValue: number, index: number) => {
                        if (index === 0) {
                            bands.push({
                                from: 0,
                                to: cutOffValue,
                                color: colors[index],
                                thickness: '40%'
                            })
                        } else {
                            bands.push({
                                from: cutoff[index - 1],
                                to: cutOffValue,
                                color: colors[index],
                                thickness: '40%'
                            })
                        }
                        if (index === cutoff.length - 1) {
                            bands.push({
                                from: cutOffValue,
                                to: 100,
                                color: colors[cutoff.length],
                                thickness: '40%'
                            })
                        }
                    })
                    return bands;
                })()
            },
        
            series: [ {
                isRectanglePoint: true,
                type: 'gauge',
                data: [value],
                dataLabels: {
                    formatter: function () {
                        var color = cutFn(value, cutoff, colors);
                        return `<div style="text-align:center">
                                <span style="font-size: 20px;color: ${color}">${this.y}%</span><br/>
                            </div>`
                    }
                },
                dial: {
                    rearLength: '-120%'
                },
                pivot: {
                    radius: 0
                }
            }]
        
        });
    },

    /** 
     * 生成相对人群位置分布图--面积图
     */
    generatePopulationDistribution: function (selector: string | HTMLElement, params: any) {
        let { seriesArrs = [], yAxis = [], xAxis = [], value, colors = [] } = params;

        if (!seriesArrs || !yAxis || !xAxis) {
            throw new Error('参数seriesGreen、seriesRed、yAxis、xAxis是必须的！')
        }
        var xAxisMin = Math.min(...xAxis);
        var xAxisMax = Math.max(...xAxis);
        return Highcharts.chart(selector, {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: '人群疾病风险分布',
                verticalAlign: 'bottom',
                y: -15,
                style: {
                    fontSize: 12
                }
            },
            xAxis: {
                reversed: false,
                tickPositions: [xAxisMin, xAxisMax],
                labels: {
                    formatter: function () {
                        return this.value === xAxisMin ? '低' : '高'
                    }
                },
                min: xAxisMin,
                max: xAxisMax
            },
            yAxis: {
                min: Math.min(...yAxis),
                max: Math.max(...yAxis),
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                title: {
                    text: '人群相对比例',
                    style: {
                        fontSize: 12
                    }
                }
            },
            plotOptions: {
                series: {
                    lineWidth: 0,
                    states: {
                        inactive: {
                            opacity: 1
                        },
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            series: (function() {
                const data = [];
                seriesArrs.forEach((series: any[], index: number) => {
                    data.push({
                        fillColor: colors[index],
                        data: series, // [[0,0], [1,2], [2,3], [3,4], [4,5], null, null],
                                      // [null, null, null, null, [4,5], [6,3], [7,0]],
                        marker: {
                            enabled: false
                        }
                    })
                });
                // 三角形最后push，避免层级覆盖，遮住三角形
                data.push({
                    data: [[value, 0]],
                    marker: {
                        symbol: 'triangle', // 黑色三角形标记符
                        fillColor: 'black',
                        radius: 6,
                    }
                })
                return data;
            })()
        });
    },

    /** 生成代谢产物聚类热图--热力图 */
    generateMetabolismHeatMap: function (selector: string | HTMLElement, params: any, value: number, legendStrWidth: number) {
        const { series, path, min, max, dataLen } = params;
        const markerPositions = new Array(path.length).fill(null);
        markerPositions.splice(path.length - 1, 1, value);

        return Highcharts.chart(selector, {

            chart: {
                type: 'heatmap',
                marginLeft: legendStrWidth,
                inverted: true
            },
            plotOptions: {
                series: {
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }
                }
            },
            boost: {
                useGPUTranslations: true,
                usePreAllocated: true
            },
    
            title: {
                text: null,
            },
    
            xAxis: {
                categories: path,
                labels: {
                    useHTML: true,
                    align: 'left',
                    x: -legendStrWidth,
                    style: {
                        'min-width': `${legendStrWidth}px`,
                        width: `${legendStrWidth}px`,
                        'text-align': 'right'
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function() {
                        return parseInt(this.value) // 转换成整型，避免存在小数导致旋转，影响 potLines 文字的距离
                    },
                    useHTML: true,
                    style: {
                        color: 'rgba(0, 0, 0, 0)'
                    } // y轴的数据为每个代谢通路的受检者个数
                },
                reversed: false,
                min: 0,
                tickInterval: dataLen / 10,
                plotLines: [{   // 竖直的线
                    value: value,
                    color: 'black',
                    width: 1,
                    zIndex: 10,
                    label: {
                        text: '您所处位置',
                        rotation: 0,
                        x: -60,
                        y: 788
                    }
                }]
            },
    
            colorAxis: {
                stops: [
                    [0, '#3060cf'],
                    [0.5, '#fffbbc'],
                    [0.9, '#c4463a'],
                    [1, '#c4463a']
                ],
                min: min,
                max: max
            },
    
            series: [{
                data: series,
                turboThreshold: 100000
            },{
                type: 'line',
                data: markerPositions,
                marker: {
                    symbol: 'url(data:image/png;base64,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)', // 黑色三角形标记符
                    fillColor: 'black',
                    radius: 6,
                }
            }]
    
        });
    },

    /** 生成热力图对应指示标记bar */
    generateHeatMapInstruction: function (selector: string | HTMLElement, params: any) {
        const { value, cutoff = [], colors = [], marginLeft = 0 } = params;
        return Highcharts.chart(selector, {
            chart: {
                inverted: true,
                marginLeft: marginLeft,
                type: 'bullet'
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                opposite: true,
                min: 0,
                max: 1,
                tickPositions: [0, 1],
                labels: {
                    formatter: function() {
                        return this.value == 0 ? '低风险' : '高风险'
                    },
                    useHTML: true,
                    style: {
                        fontSize: '14px',
                        textIndent: '45px'
                    }
                },
                lineWidth: 0,
                gridLineWidth: 0,
                plotBands: (function(){
                    const bands = [{
                        from: 0,
                        to: 1,
                        color: {
                            linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
                            stops: [[0]]
                        }
                    }];
                    const colorsLinear = [[0, colors[0]]]
                    cutoff.forEach((cutValue: number, index: number) => {
                        colorsLinear.push([cutValue, colors[index]]);
                    });
                    colorsLinear.push([1, colors[cutoff.length]]);
                    bands[0].color.stops = colorsLinear;
                    return bands;
                })(),
                title: null
            },
            series: [{
                data: [{
                    y: 0,
                    target: value
                }]
            }],
            plotOptions: {
                series: {
                    pointPadding: 0,
                    borderWidth: 0,
                    color: '#000',
                    targetOptions: {
                        width: '500%',
                        height: 5
                    }
                }
            }
        });
    },

    generateSurvivalCurve: function(selector: string | HTMLElement, params: any) {
        const { averages, ranges } = params; 
        Highcharts.chart(selector, {
            xAxis: {
                min: 0,
                max: 1000,
                title: {
                    text: '时间/天'
                }
            },
        
            yAxis: {
                title: {
                    text: '未患病率'
                }
            },
            plotOptions: {
                series: {
                    states: {
                        inactive: {
                            opacity: 1
                        },
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            series: [{
                data: averages,
                zIndex: 1,
                color: 'red',
                marker: {
                    enabled: false
                }
            }, {
                data: ranges,
                type: 'arearange',
                lineWidth: 0,
                color: '#ff97a0',
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }]
        });
    }
};


export const HighChartsFormatTool = {
    /** 面积图数据格式化 */
    formatAreaMap: function (csv: string) {
        var flag = false; // 标识是否交叉添加
        var seriesGreen = [], seriesRed = [], xAxis = [], yAxis = [];
        var allTextLines = csv.split('\n')
        allTextLines.splice(0, 1);
        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            xAxis.push(parseFloat(data[0]));
            yAxis.push(parseFloat(data[1]));
            if (parseFloat(data[0]) > parseFloat(data[2])) {
                if (!flag){
                    seriesGreen.push([parseFloat(data[0]), parseFloat(data[1])]);
                } else {
                    seriesGreen.push([null, null]);
                }
                seriesRed.push([parseFloat(data[0]), parseFloat(data[1])]);
            } else {
                seriesGreen.push([parseFloat(data[0]), parseFloat(data[1])]);
                seriesRed.push([null, null]); 
            }
        }
        return {
            seriesGreen, seriesRed, yAxis, xAxis
        }
    },

    /** 
     * 面积图模型数据格式化 
     * coordinateArr x\y坐标 eg: [[0,2],[2,3]]
     * cutoff 分界值，一个值或两个值 eg: [20, 30]
     */
    formatAreaMapModel: function (coordinateArr: number[][], cutoff: number[]) {
        if (!Array.isArray(coordinateArr) || !Array.isArray(cutoff)) {
            throw new Error('参数coordinateArr和cutOff都必须为数组');
        }
        if (!coordinateArr.length || !cutoff.length) {
            throw new Error('参数coordinateArr和cutOff不能为空数组');
        }

        const xAxis = [], yAxis = [];
        const seriesArrs = new Array(cutoff.length + 1).fill(null);
        seriesArrs.forEach((o, index) => seriesArrs[index] = []);

        for (let index = 0, len = coordinateArr.length; index < len; index++) {
            const data = coordinateArr[index];
            const x = data[0];
            const y = data[1];
            xAxis.push(x);
            yAxis.push(y);

            for (let i = 0, length = cutoff.length; i < length; i++) {
                const cutValue = cutoff[i];
                if (i === 0 && x < cutValue) {
                    seriesArrs[0].push([x, y]);
                }
                if (i === length - 1 && x >= cutValue) {
                    seriesArrs[length].push([x, y]);
                }
                if (x >= cutValue && x < cutoff[i + 1]) {
                    seriesArrs[i + 1].push([x, y]);
                }
            }
        }

        seriesArrs.forEach((tempArr, index) => {
            if (index != 0) {
                const preArr = seriesArrs[index - 1];
                tempArr.unshift(preArr[preArr.length - 1]);
            }
        })

        return { seriesArrs, yAxis, xAxis };
    },

    /** 热力图模型数据格式化 */
    formatHeatMapModel: function (heatMapData: IHeatMap[]) {
        var path = [], series = [], tempArr = [], dataLen = 0;

        for (let i = 0, len = heatMapData.length; i < len; i++) {
            const obj: IHeatMap = heatMapData[i];
            const data = obj.data;
            const zScorePara = calculateZScore(data);

            const seriesData = data.map(o => (o - zScorePara.meanVal) / zScorePara.SDresult);

            path.push(obj.name);
            dataLen = data.length;

            for (let j = 0, length = seriesData.length; j < length; j++) {
                const value = seriesData[j];
                series.push([i, j, value]);
                tempArr.push(value);
            }
        }
        const max = Math.max(...tempArr);
        const min = Math.min(...tempArr);
        tempArr = null;

        return { series, path, min, max, dataLen }
    }
};
