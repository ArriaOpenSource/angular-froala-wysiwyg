import { NgModule } from '@angular/core';
import { FroalaEditorModule } from './editor';
import { FroalaViewModule } from './view';
export { FroalaEditorDirective, FroalaEditorModule } from './editor';
export { FroalaViewDirective, FroalaViewModule } from './view';
const MODULES = [
    FroalaEditorModule,
    FroalaViewModule
];
export class FERootModule {
}
FERootModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    FroalaEditorModule.forRoot(),
                    FroalaViewModule.forRoot()
                ],
                exports: MODULES
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUV4QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNuQixNQUFNLFVBQVUsQ0FBQztBQUVsQixPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNqQixNQUFNLFFBQVEsQ0FBQztBQUVoQixNQUFNLE9BQU8sR0FBRztJQUNkLGtCQUFrQjtJQUNsQixnQkFBZ0I7Q0FDakIsQ0FBQTtBQVNELE1BQU0sT0FBTyxZQUFZOzs7WUFQeEIsUUFBUSxTQUFDO2dCQUNULE9BQU8sRUFBRTtvQkFDUCxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7b0JBQzVCLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtpQkFDM0I7Z0JBQ0QsT0FBTyxFQUFFLE9BQU87YUFDaEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtGcm9hbGFFZGl0b3JNb2R1bGV9IGZyb20gJy4vZWRpdG9yJztcclxuaW1wb3J0IHtGcm9hbGFWaWV3TW9kdWxlfSBmcm9tICcuL3ZpZXcnO1xyXG5cclxuZXhwb3J0IHtcclxuICBGcm9hbGFFZGl0b3JEaXJlY3RpdmUsXHJcbiAgRnJvYWxhRWRpdG9yTW9kdWxlXHJcbn0gZnJvbSAnLi9lZGl0b3InO1xyXG5cclxuZXhwb3J0IHtcclxuICBGcm9hbGFWaWV3RGlyZWN0aXZlLFxyXG4gIEZyb2FsYVZpZXdNb2R1bGVcclxufSBmcm9tICcuL3ZpZXcnO1xyXG5cclxuY29uc3QgTU9EVUxFUyA9IFtcclxuICBGcm9hbGFFZGl0b3JNb2R1bGUsXHJcbiAgRnJvYWxhVmlld01vZHVsZVxyXG5dXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gaW1wb3J0czogW1xyXG4gICBGcm9hbGFFZGl0b3JNb2R1bGUuZm9yUm9vdCgpLFxyXG4gICBGcm9hbGFWaWV3TW9kdWxlLmZvclJvb3QoKVxyXG4gXSxcclxuIGV4cG9ydHM6IE1PRFVMRVNcclxufSlcclxuZXhwb3J0IGNsYXNzIEZFUm9vdE1vZHVsZSB7XHJcblxyXG59Il19