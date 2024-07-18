import { ElementRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FroalaViewDirective {
    private renderer;
    private _element;
    private _content;
    constructor(renderer: Renderer2, element: ElementRef);
    set froalaView(content: string);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FroalaViewDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FroalaViewDirective, "[froalaView]", never, { "froalaView": { "alias": "froalaView"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=view.directive.d.ts.map