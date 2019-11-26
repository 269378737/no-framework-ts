import templateHtml from "./page-header.html";
import { compileTemplate } from "../../utils/helper";
import { IPageHeader } from "../../model/component";

export class PageHeader {
    template: string;
    private data: IPageHeader;

    constructor() {
        this.data = {
            copyRightYear: new Date().getFullYear()
        }
        this.template = compileTemplate(templateHtml, this.data);
    }
}