
import '../iconfont/iconfont.css';
import './loading.css';

class LoadingPlugin {
    private dom: any;
    constructor () {
        this.init();
    }

    private init() {
        var dom = document.createElement('div');
        dom.innerHTML = `
            <div class="hbi-loading-modal">
                <i class="iconfont loading"></i>
            </div>
        `;

        this.dom = dom.children[0];
        document.body.appendChild(this.dom);
    }

    public close() {
        document.body.removeChild(this.dom);
    }

    public open() {
        document.body.appendChild(this.dom);
    }
}

export default new LoadingPlugin();