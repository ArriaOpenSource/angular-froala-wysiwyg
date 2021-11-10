import { NgModule } from "@angular/core";
import { FroalaEditorDirective } from "./editor.directive";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQU0zRCxNQUFNLE9BQU8sa0JBQWtCO0lBQ3RCLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU8sRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3pELENBQUM7OztZQVBGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDckMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7YUFDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5pbXBvcnQgeyBGcm9hbGFFZGl0b3JEaXJlY3RpdmUgfSBmcm9tIFwiLi9lZGl0b3IuZGlyZWN0aXZlXCI7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0Zyb2FsYUVkaXRvckRpcmVjdGl2ZV0sXHJcbiAgZXhwb3J0czogW0Zyb2FsYUVkaXRvckRpcmVjdGl2ZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGcm9hbGFFZGl0b3JNb2R1bGUge1xyXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZyb2FsYUVkaXRvck1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHsgbmdNb2R1bGU6IEZyb2FsYUVkaXRvck1vZHVsZSwgcHJvdmlkZXJzOiBbXSB9O1xyXG4gIH1cclxufVxyXG4iXX0=