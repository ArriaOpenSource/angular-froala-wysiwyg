import { NgModule } from "@angular/core";
import { FroalaViewDirective } from "./view.directive";
export class FroalaViewModule {
    static forRoot() {
        return { ngModule: FroalaViewModule, providers: [] };
    }
}
FroalaViewModule.decorators = [
    { type: NgModule, args: [{
                declarations: [FroalaViewDirective],
                exports: [FroalaViewDirective],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmlldy92aWV3Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQU12RCxNQUFNLE9BQU8sZ0JBQWdCO0lBQ3BCLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3ZELENBQUM7OztZQVBGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5pbXBvcnQgeyBGcm9hbGFWaWV3RGlyZWN0aXZlIH0gZnJvbSBcIi4vdmlldy5kaXJlY3RpdmVcIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbRnJvYWxhVmlld0RpcmVjdGl2ZV0sXHJcbiAgZXhwb3J0czogW0Zyb2FsYVZpZXdEaXJlY3RpdmVdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRnJvYWxhVmlld01vZHVsZSB7XHJcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RnJvYWxhVmlld01vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHsgbmdNb2R1bGU6IEZyb2FsYVZpZXdNb2R1bGUsIHByb3ZpZGVyczogW10gfTtcclxuICB9XHJcbn1cclxuIl19