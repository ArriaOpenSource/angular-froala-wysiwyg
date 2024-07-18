import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class FroalaViewDirective {
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
    static { this.ɵfac = function FroalaViewDirective_Factory(t) { return new (t || FroalaViewDirective)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: FroalaViewDirective, selectors: [["", "froalaView", ""]], inputs: { froalaView: "froalaView" } }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FroalaViewDirective, [{
        type: Directive,
        args: [{
                selector: '[froalaView]'
            }]
    }], () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], { froalaView: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy92aWV3LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUF5QixLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBS3hFLE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsWUFBb0IsUUFBbUIsRUFBRSxPQUFtQjtRQUF4QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLElBQWEsVUFBVSxDQUFDLE9BQWU7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuRCxDQUFDO29GQWhCVSxtQkFBbUI7b0VBQW5CLG1CQUFtQjs7aUZBQW5CLG1CQUFtQjtjQUgvQixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7YUFDekI7bUVBV2MsVUFBVTtrQkFBdEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbZnJvYWxhVmlld10nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGcm9hbGFWaWV3RGlyZWN0aXZlIHtcclxuXHJcbiAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBfY29udGVudDogYW55O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcclxuICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvLyB1cGRhdGUgY29udGVudCBtb2RlbCBhcyBpdCBjb21lc1xyXG4gIEBJbnB1dCgpIHNldCBmcm9hbGFWaWV3KGNvbnRlbnQ6IHN0cmluZyl7XHJcbiAgICB0aGlzLl9lbGVtZW50LmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQsIFwiZnItdmlld1wiKTtcclxuICB9XHJcbn0iXX0=