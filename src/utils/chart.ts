
import * as Highcharts from 'highcharts'
import { zoomOutHundred, zoomInHundred, cutFn } from '@/utils/helper';

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

        value = zoomOutHundred(value);
        cutoff = cutoff.map((c: any) => zoomOutHundred(c));
        if(value != 0 && (!value || !cutoff.length)) {
            console.log(selector)
            throw new Error('参数value、cutOff是必须的！')
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
                        color: cutFn(value, cutoff, colors)
                    }
                },
                plotBands: (function() {
                    const bands: any[] = [];
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

};
