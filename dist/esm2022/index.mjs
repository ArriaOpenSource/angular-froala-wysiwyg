import { NgModule } from '@angular/core';
import { FroalaEditorModule } from './editor/editor.module';
import { FroalaViewModule } from './view/view.module';
import * as i0 from "@angular/core";
import * as i1 from "./editor/editor.module";
import * as i2 from "./view/view.module";
export { FroalaEditorDirective } from './editor/editor.directive';
export { FroalaEditorModule } from './editor/editor.module';
export { FroalaViewDirective } from './view/view.directive';
export { FroalaViewModule } from './view/view.module';
export class FERootModule {
    static { this.ɵfac = function FERootModule_Factory(t) { return new (t || FERootModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: FERootModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(), FroalaEditorModule, FroalaViewModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FERootModule, [{
        type: NgModule,
        args: [{
                imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
                exports: [FroalaEditorModule, FroalaViewModule],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FERootModule, { imports: [i1.FroalaEditorModule, i2.FroalaViewModule], exports: [FroalaEditorModule, FroalaViewModule] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV2QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUVwRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUUxRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQU1wRCxNQUFNLE9BQU8sWUFBWTs2RUFBWixZQUFZO21FQUFaLFlBQVk7dUVBSGIsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEVBQ3hELGtCQUFrQixFQUFFLGdCQUFnQjs7aUZBRW5DLFlBQVk7Y0FKeEIsUUFBUTtlQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNuRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQzthQUNoRDs7d0ZBQ1ksWUFBWSxxRUFGYixrQkFBa0IsRUFBRSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7RnJvYWxhRWRpdG9yTW9kdWxlfSBmcm9tICcuL2VkaXRvci9lZGl0b3IubW9kdWxlJztcclxuaW1wb3J0IHtGcm9hbGFWaWV3TW9kdWxlfSBmcm9tICcuL3ZpZXcvdmlldy5tb2R1bGUnO1xyXG5cclxuZXhwb3J0IHtGcm9hbGFFZGl0b3JEaXJlY3RpdmV9IGZyb20gJy4vZWRpdG9yL2VkaXRvci5kaXJlY3RpdmUnO1xyXG5leHBvcnQge0Zyb2FsYUVkaXRvck1vZHVsZX0gZnJvbSAnLi9lZGl0b3IvZWRpdG9yLm1vZHVsZSc7XHJcblxyXG5leHBvcnQge0Zyb2FsYVZpZXdEaXJlY3RpdmV9IGZyb20gJy4vdmlldy92aWV3LmRpcmVjdGl2ZSc7XHJcbmV4cG9ydCB7RnJvYWxhVmlld01vZHVsZX0gZnJvbSAnLi92aWV3L3ZpZXcubW9kdWxlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0Zyb2FsYUVkaXRvck1vZHVsZS5mb3JSb290KCksIEZyb2FsYVZpZXdNb2R1bGUuZm9yUm9vdCgpXSxcclxuICBleHBvcnRzOiBbRnJvYWxhRWRpdG9yTW9kdWxlLCBGcm9hbGFWaWV3TW9kdWxlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEZFUm9vdE1vZHVsZSB7fVxyXG4iXX0=