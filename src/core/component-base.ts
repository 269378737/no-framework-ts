
import { PageHeader } from "../components/page-header/page-header";
import { compileTemplate } from "../utils/helper";

export class Component {
    private template: string;
    private data: any = {
        pageHeader: new PageHeader().template
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