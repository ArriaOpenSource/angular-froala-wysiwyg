import { NgModule } from '@angular/core';
import { FroalaEditorDirective } from './editor.directive';
import * as i0 from "@angular/core";
export class FroalaEditorModule {
    static forRoot() {
        return { ngModule: FroalaEditorModule, providers: [] };
    }
    static { this.ɵfac = function FroalaEditorModule_Factory(t) { return new (t || FroalaEditorModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: FroalaEditorModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({}); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FroalaEditorModule, [{
        type: NgModule,
        args: [{
                declarations: [FroalaEditorDirective],
                exports: [FroalaEditorDirective],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FroalaEditorModule, { declarations: [FroalaEditorDirective], exports: [FroalaEditorDirective] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFzQixNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7QUFNekQsTUFBTSxPQUFPLGtCQUFrQjtJQUN0QixNQUFNLENBQUMsT0FBTztRQUNuQixPQUFPLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUN2RCxDQUFDO21GQUhVLGtCQUFrQjttRUFBbEIsa0JBQWtCOzs7aUZBQWxCLGtCQUFrQjtjQUo5QixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ3JDLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDO2FBQ2pDOzt3RkFDWSxrQkFBa0IsbUJBSGQscUJBQXFCLGFBQzFCLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtGcm9hbGFFZGl0b3JEaXJlY3RpdmV9IGZyb20gJy4vZWRpdG9yLmRpcmVjdGl2ZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0Zyb2FsYUVkaXRvckRpcmVjdGl2ZV0sXHJcbiAgZXhwb3J0czogW0Zyb2FsYUVkaXRvckRpcmVjdGl2ZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGcm9hbGFFZGl0b3JNb2R1bGUge1xyXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZyb2FsYUVkaXRvck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtuZ01vZHVsZTogRnJvYWxhRWRpdG9yTW9kdWxlLCBwcm92aWRlcnM6IFtdfTtcclxuICB9XHJcbn1cclxuIl19