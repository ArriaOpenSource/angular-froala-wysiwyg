import { NgModule } from '@angular/core';
import { FroalaEditorModule } from './editor';
import { FroalaViewModule } from './view';
import * as i0 from "@angular/core";
import * as i1 from "./editor/editor.module";
import * as i2 from "./view/view.module";
export { FroalaEditorDirective, FroalaEditorModule } from './editor';
export { FroalaViewDirective, FroalaViewModule } from './view';
const MODULES = [
    FroalaEditorModule,
    FroalaViewModule
];
export class FERootModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [i1.FroalaEditorModule, i2.FroalaViewModule], exports: [FroalaEditorModule,
            FroalaViewModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [FroalaEditorModule.forRoot(),
            FroalaViewModule.forRoot(), FroalaEditorModule,
            FroalaViewModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        FroalaEditorModule.forRoot(),
                        FroalaViewModule.forRoot()
                    ],
                    exports: MODULES
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFFBQVEsQ0FBQzs7OztBQUV4QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNuQixNQUFNLFVBQVUsQ0FBQztBQUVsQixPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNqQixNQUFNLFFBQVEsQ0FBQztBQUVoQixNQUFNLE9BQU8sR0FBRztJQUNkLGtCQUFrQjtJQUNsQixnQkFBZ0I7Q0FDakIsQ0FBQTtBQVNELE1BQU0sT0FBTyxZQUFZO2lJQUFaLFlBQVk7a0lBQVosWUFBWSxtRUFYdkIsa0JBQWtCO1lBQ2xCLGdCQUFnQjtrSUFVTCxZQUFZLFlBTHRCLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUM1QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsRUFQM0Isa0JBQWtCO1lBQ2xCLGdCQUFnQjs7MkZBVUwsWUFBWTtrQkFQeEIsUUFBUTttQkFBQztvQkFDVCxPQUFPLEVBQUU7d0JBQ1Asa0JBQWtCLENBQUMsT0FBTyxFQUFFO3dCQUM1QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUU7cUJBQzNCO29CQUNELE9BQU8sRUFBRSxPQUFPO2lCQUNoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0Zyb2FsYUVkaXRvck1vZHVsZX0gZnJvbSAnLi9lZGl0b3InO1xyXG5pbXBvcnQge0Zyb2FsYVZpZXdNb2R1bGV9IGZyb20gJy4vdmlldyc7XHJcblxyXG5leHBvcnQge1xyXG4gIEZyb2FsYUVkaXRvckRpcmVjdGl2ZSxcclxuICBGcm9hbGFFZGl0b3JNb2R1bGVcclxufSBmcm9tICcuL2VkaXRvcic7XHJcblxyXG5leHBvcnQge1xyXG4gIEZyb2FsYVZpZXdEaXJlY3RpdmUsXHJcbiAgRnJvYWxhVmlld01vZHVsZVxyXG59IGZyb20gJy4vdmlldyc7XHJcblxyXG5jb25zdCBNT0RVTEVTID0gW1xyXG4gIEZyb2FsYUVkaXRvck1vZHVsZSxcclxuICBGcm9hbGFWaWV3TW9kdWxlXHJcbl1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiBpbXBvcnRzOiBbXHJcbiAgIEZyb2FsYUVkaXRvck1vZHVsZS5mb3JSb290KCksXHJcbiAgIEZyb2FsYVZpZXdNb2R1bGUuZm9yUm9vdCgpXHJcbiBdLFxyXG4gZXhwb3J0czogTU9EVUxFU1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRkVSb290TW9kdWxlIHtcclxuXHJcbn0iXX0=