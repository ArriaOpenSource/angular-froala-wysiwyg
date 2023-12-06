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
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [i1.FroalaEditorModule, i2.FroalaViewModule], exports: [FroalaEditorModule, FroalaViewModule] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(), FroalaEditorModule, FroalaViewModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
                    exports: [FroalaEditorModule, FroalaViewModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV2QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUVwRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUUxRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQU1wRCxNQUFNLE9BQU8sWUFBWTswSEFBWixZQUFZOzJIQUFaLFlBQVksbUVBRmIsa0JBQWtCLEVBQUUsZ0JBQWdCOzJIQUVuQyxZQUFZLFlBSGIsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEVBQ3hELGtCQUFrQixFQUFFLGdCQUFnQjs7MkZBRW5DLFlBQVk7a0JBSnhCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25FLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDO2lCQUNoRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtGcm9hbGFFZGl0b3JNb2R1bGV9IGZyb20gJy4vZWRpdG9yL2VkaXRvci5tb2R1bGUnO1xyXG5pbXBvcnQge0Zyb2FsYVZpZXdNb2R1bGV9IGZyb20gJy4vdmlldy92aWV3Lm1vZHVsZSc7XHJcblxyXG5leHBvcnQge0Zyb2FsYUVkaXRvckRpcmVjdGl2ZX0gZnJvbSAnLi9lZGl0b3IvZWRpdG9yLmRpcmVjdGl2ZSc7XHJcbmV4cG9ydCB7RnJvYWxhRWRpdG9yTW9kdWxlfSBmcm9tICcuL2VkaXRvci9lZGl0b3IubW9kdWxlJztcclxuXHJcbmV4cG9ydCB7RnJvYWxhVmlld0RpcmVjdGl2ZX0gZnJvbSAnLi92aWV3L3ZpZXcuZGlyZWN0aXZlJztcclxuZXhwb3J0IHtGcm9hbGFWaWV3TW9kdWxlfSBmcm9tICcuL3ZpZXcvdmlldy5tb2R1bGUnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbRnJvYWxhRWRpdG9yTW9kdWxlLmZvclJvb3QoKSwgRnJvYWxhVmlld01vZHVsZS5mb3JSb290KCldLFxyXG4gIGV4cG9ydHM6IFtGcm9hbGFFZGl0b3JNb2R1bGUsIEZyb2FsYVZpZXdNb2R1bGVdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRkVSb290TW9kdWxlIHt9XHJcbiJdfQ==