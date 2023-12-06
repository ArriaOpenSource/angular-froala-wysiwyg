import { NgModule } from '@angular/core';
import { FroalaEditorModule } from './editor';
import { FroalaViewModule } from './view';
import * as i0 from "@angular/core";
import * as i1 from "./editor/editor.module";
import * as i2 from "./view/view.module";
export { FroalaEditorDirective, FroalaEditorModule } from './editor';
export { FroalaViewDirective, FroalaViewModule } from './view';
const MODULES = [FroalaEditorModule, FroalaViewModule];
export class FERootModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [i1.FroalaEditorModule, i2.FroalaViewModule], exports: [FroalaEditorModule, FroalaViewModule] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(), FroalaEditorModule, FroalaViewModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
                    exports: MODULES,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV2QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDNUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sUUFBUSxDQUFDOzs7O0FBRXhDLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVuRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFN0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBTXZELE1BQU0sT0FBTyxZQUFZO2lJQUFaLFlBQVk7a0lBQVosWUFBWSxtRUFOUixrQkFBa0IsRUFBRSxnQkFBZ0I7a0lBTXhDLFlBQVksWUFIYixrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsRUFIbkQsa0JBQWtCLEVBQUUsZ0JBQWdCOzsyRkFNeEMsWUFBWTtrQkFKeEIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDbkUsT0FBTyxFQUFFLE9BQU87aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge0Zyb2FsYUVkaXRvck1vZHVsZX0gZnJvbSAnLi9lZGl0b3InO1xyXG5pbXBvcnQge0Zyb2FsYVZpZXdNb2R1bGV9IGZyb20gJy4vdmlldyc7XHJcblxyXG5leHBvcnQge0Zyb2FsYUVkaXRvckRpcmVjdGl2ZSwgRnJvYWxhRWRpdG9yTW9kdWxlfSBmcm9tICcuL2VkaXRvcic7XHJcblxyXG5leHBvcnQge0Zyb2FsYVZpZXdEaXJlY3RpdmUsIEZyb2FsYVZpZXdNb2R1bGV9IGZyb20gJy4vdmlldyc7XHJcblxyXG5jb25zdCBNT0RVTEVTID0gW0Zyb2FsYUVkaXRvck1vZHVsZSwgRnJvYWxhVmlld01vZHVsZV07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtGcm9hbGFFZGl0b3JNb2R1bGUuZm9yUm9vdCgpLCBGcm9hbGFWaWV3TW9kdWxlLmZvclJvb3QoKV0sXHJcbiAgZXhwb3J0czogTU9EVUxFUyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEZFUm9vdE1vZHVsZSB7fVxyXG4iXX0=