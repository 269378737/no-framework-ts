
import {
  padZero,
  domParser,
  zoomOutHundred,
  zoomInHundred,
  dateFormat,
  compileTemplate,
  cutFn
} from "../../src/utils/helper";




test('padZero() 返回两位数', function() {
  expect(padZero(9)).toBe('09');
})

test('domParser() 返回doucment对象', function() {
  expect(domParser('<div></div>')).toBeInstanceOf(Document);
})

test('zoomOutHundred() 将0-1的数字放大100倍，大于 1 的数字原样返回', function() {
  expect(zoomOutHundred(0.32143)).toBe(32.14);
  expect(zoomOutHundred(23.4324)).toBe(23.43);
})

test('zoomInHundred() 将1-100的数字缩小100倍，0-1的数字原样返回', function() {
  expect(zoomInHundred(34.32)).toBe(0.34);
  expect(zoomInHundred(0.2326)).toBe(0.23);
})

test('dateFormat() 将日期对象格式化成指定格式', function() {
  expect(dateFormat(new Date('2019/12/09'), 'yyyy年MM月dd日')).toBe('2019年12月09日');
})

test('compileTemplate() 将字符串中的占位符{{key}}替换成传入数据中key的值', function() {
  expect(compileTemplate('<div>{{title}}</div>', {title: '标题'})).toBe('<div>标题</div>')
})

test('cutFn() 根据value在集合中的位置返回不同的结果', function() {
  expect(cutFn(20, [30, 60], ['低', '中', '高'])).toBe('低')
})