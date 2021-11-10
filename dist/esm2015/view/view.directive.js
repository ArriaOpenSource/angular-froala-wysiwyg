import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
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
}
FroalaViewDirective.decorators = [
    { type: Directive, args: [{
                selector: '[froalaView]'
            },] }
];
/** @nocollapse */
FroalaViewDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
FroalaViewDirective.propDecorators = {
    froalaView: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy92aWV3LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS3hFLE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsWUFBb0IsUUFBbUIsRUFBRSxPQUFtQjtRQUF4QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLElBQWEsVUFBVSxDQUFDLE9BQWU7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7WUFuQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2FBQ3pCOzs7O1lBSitCLFNBQVM7WUFBckIsVUFBVTs7O3lCQWUzQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tmcm9hbGFWaWV3XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEZyb2FsYVZpZXdEaXJlY3RpdmUge1xyXG5cclxuICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIF9jb250ZW50OiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgZWxlbWVudDogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZSBjb250ZW50IG1vZGVsIGFzIGl0IGNvbWVzXHJcbiAgQElucHV0KCkgc2V0IGZyb2FsYVZpZXcoY29udGVudDogc3RyaW5nKXtcclxuICAgIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MID0gY29udGVudDtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudCwgXCJmci12aWV3XCIpO1xyXG4gIH1cclxufSJdfQ==