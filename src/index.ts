import {NgModule} from '@angular/core';

import {FroalaEditorModule} from './editor/editor.module';
import {FroalaViewModule} from './view/view.module';

export {FroalaEditorDirective} from './editor/editor.directive';
export {FroalaEditorModule} from './editor/editor.module';

export {FroalaViewDirective} from './view/view.directive';
export {FroalaViewModule} from './view/view.module';

@NgModule({
  imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
  exports: [FroalaEditorModule, FroalaViewModule],
})
export class FERootModule {}
