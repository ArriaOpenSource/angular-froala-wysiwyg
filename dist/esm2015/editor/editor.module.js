import { NgModule } from '@angular/core';
import { FroalaEditorDirective } from './editor.directive';
export class FroalaEditorModule {
    static forRoot() {
        return { ngModule: FroalaEditorModule, providers: [] };
    }
}
FroalaEditorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [FroalaEditorDirective],
                exports: [FroalaEditorDirective],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFzQixNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQU16RCxNQUFNLE9BQU8sa0JBQWtCO0lBQ3RCLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU8sRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3ZELENBQUM7OztZQVBGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDckMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7YUFDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7RnJvYWxhRWRpdG9yRGlyZWN0aXZlfSBmcm9tICcuL2VkaXRvci5kaXJlY3RpdmUnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtGcm9hbGFFZGl0b3JEaXJlY3RpdmVdLFxyXG4gIGV4cG9ydHM6IFtGcm9hbGFFZGl0b3JEaXJlY3RpdmVdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRnJvYWxhRWRpdG9yTW9kdWxlIHtcclxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxGcm9hbGFFZGl0b3JNb2R1bGU+IHtcclxuICAgIHJldHVybiB7bmdNb2R1bGU6IEZyb2FsYUVkaXRvck1vZHVsZSwgcHJvdmlkZXJzOiBbXX07XHJcbiAgfVxyXG59XHJcbiJdfQ==