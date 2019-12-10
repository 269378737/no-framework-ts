import { Component } from '../../src/core/component-base';

test('组件基类测试', function() {
    class TempComponent extends Component {
        get _template() {
            return this.template
        }
    }
    
    const component = new TempComponent();
    component.compile('<div>{{pageHeader}} <p>这是有一个测试</p></div>', true)
    expect(component._template).toBe(`<div>mock-html <p>这是有一个测试</p></div>`)

    component.compile('<div><p>这是有一个测试</p></div>', false);
    expect(component._template).toBe('<div><p>这是有一个测试</p></div>');

    const comp = new TempComponent();
    comp.compile('<div>{{pageHeader}} <div>{{mock}}</div></div>', true, { mock: '这是一段模拟测试' });
    expect(comp._template).toBe('<div>mock-html <div>这是一段模拟测试</div></div>')

    component.compile('<div><p>{{mock}}</p></div>', false, { mock: '这是一段模拟测试' });
    expect(component._template).toBe('<div><p>这是一段模拟测试</p></div>')

})