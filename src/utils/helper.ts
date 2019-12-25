
interface ICSSProperty {
    fontSize: string;
    fontFamily: string;
}

export function padZero(num: number): string {
    return num < 10 ? num.toString().padStart(2, '0') : num.toString();
}


const regex = /{{([^}}]+)?}}/g;
export function compileTemplate (tpl: string, data: any) {
    let match;
    while(match = regex.exec(tpl)){
        tpl = tpl.replace(match[0],data[match[1]])
    }
    return tpl
}

export function domParser(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc;
}

// 计算一组字符串中最长字符串的长度
export function stringLengthToPx (arr: string[] = [], cssStyle: ICSSProperty) {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.left = '-999999px';
    span.style.fontFamily = cssStyle.fontFamily;
    span.style.fontSize = cssStyle.fontSize;
    document.body.append(span);
    const tempPxArr: number[] = [];
    arr.forEach(str => {
        span.innerHTML = str.trim();
        tempPxArr.push(span.offsetWidth);
    })
    document.body.removeChild(span);
    return Math.max(...tempPxArr);
}

// 根据value和cutOff 显示对应的label。比如显示不同风险程度或显示不同颜色
export function cutFn(value: number, cutoff: number[], labels: string[]) {
    for (let i = 0, len = cutoff.length; i < len; i++) {
        const cutValue = cutoff[i];
        if (i === 0 && value < cutValue) {
            return labels[0];
        }
        if (i === len - 1 && value >= cutValue) {
            return labels[len];
        }
        if (value >= cutValue && value < cutoff[i + 1]) {
            return labels[i + 1];
        }
    }
}


export function dateFormat(date: Date, fmt: string) {
    if (isNaN(date.getFullYear())) {
        return 'xxxx年xx月xx日'
    }
    var o: {[index: string]: any} = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;
}

export function calculateZScore(numbersArr: number[]) {
    // 计算平均值
    let total = 0;
    for(let key in numbersArr) 
       total += numbersArr[key];
    const meanVal = total / numbersArr.length;
  
    // 计算标准差
    let SDprep = 0;
    for(let key in numbersArr) 
       SDprep += Math.pow((numbersArr[key] - meanVal), 2);
    const SDresult = Math.sqrt(SDprep / numbersArr.length);
	
	return { meanVal, SDresult };
}