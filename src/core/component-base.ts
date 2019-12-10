
import { PageHeader } from "@/components/page-header/page-header";
import { compileTemplate } from "@/utils/helper";

interface IComponent {
    pageHeader: string;
}

export class Component {
    protected template: string;
    private data: IComponent;

    constructor() {
        this.data = {
            pageHeader: new PageHeader().template
        }
    }

    compile(templateHtml: string, hasHeader: boolean, data?: any) {
        let compileData: any = {};
        if(hasHeader) {
            compileData = Object.assign(compileData, this.data);
        }
        if(data) {
            compileData = Object.assign(compileData, data);
        }

        if (data || hasHeader) {
            this.template = compileTemplate(templateHtml, compileData);
        } else {
            this.template = templateHtml;
        }
    }

}