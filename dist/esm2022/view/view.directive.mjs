import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class FroalaViewDirective {
    renderer;
    _element;
    _content;
    constructor(renderer, element) {
        this.renderer = renderer;
        this._element = element.nativeElement;
    }
    // update content model as it comes
    set froalaView(content) {
        this._element.innerHTML = content;
    }
    ngAfterViewInit() {
        this.renderer.addClass(this._element, "fr-view");
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.5", type: FroalaViewDirective, selector: "[froalaView]", inputs: { froalaView: "froalaView" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[froalaView]'
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { froalaView: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy92aWV3LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUt4RSxNQUFNLE9BQU8sbUJBQW1CO0lBS1Y7SUFIWixRQUFRLENBQWM7SUFDdEIsUUFBUSxDQUFNO0lBRXRCLFlBQW9CLFFBQW1CLEVBQUUsT0FBbUI7UUFBeEMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDeEMsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxJQUFhLFVBQVUsQ0FBQyxPQUFlO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUNwQyxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkQsQ0FBQzswSEFoQlUsbUJBQW1COzhHQUFuQixtQkFBbUI7OzJGQUFuQixtQkFBbUI7a0JBSC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7aUJBQ3pCO3VHQVdjLFVBQVU7c0JBQXRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2Zyb2FsYVZpZXddJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRnJvYWxhVmlld0RpcmVjdGl2ZSB7XHJcblxyXG4gIHByaXZhdGUgX2VsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gIHByaXZhdGUgX2NvbnRlbnQ6IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBlbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gdXBkYXRlIGNvbnRlbnQgbW9kZWwgYXMgaXQgY29tZXNcclxuICBASW5wdXQoKSBzZXQgZnJvYWxhVmlldyhjb250ZW50OiBzdHJpbmcpe1xyXG4gICAgdGhpcy5fZWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50LCBcImZyLXZpZXdcIik7XHJcbiAgfVxyXG59Il19