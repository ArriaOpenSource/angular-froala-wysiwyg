import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Directive, Input, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

class FroalaEditorDirective {
    zone;
    // editor options
    _opts = {
        immediateAngularModelUpdate: false,
        angularIgnoreAttrs: null,
    };
    // jquery wrapped element
    _$element;
    SPECIAL_TAGS = ['img', 'button', 'input', 'a'];
    INNER_HTML_ATTR = 'innerHTML';
    _hasSpecialTag = false;
    // editor element
    _editor;
    // initial editor content
    _model;
    _listeningEvents = [];
    _editorInitialized = false;
    _oldModel = null;
    constructor(el, zone) {
        this.zone = zone;
        let element = el.nativeElement;
        // check if the element is a special tag
        if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) != -1) {
            this._hasSpecialTag = true;
        }
        // jquery wrap and store element
        this._$element = $(element);
        this.zone = zone;
    }
    // Begin ControlValueAccesor methods.
    onChange = (_) => { };
    onTouched = () => { };
    // Form model content changed.
    writeValue(content) {
        this.updateEditor(content);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    // End ControlValueAccesor methods.
    // froalaEditor directive as input: store the editor options
    set froalaEditor(opts) {
        this._opts = opts || this._opts;
    }
    // froalaModel directive as input: store initial editor content
    set froalaModel(content) {
        this.updateEditor(content);
    }
    // Update editor with model contents.
    updateEditor(content) {
        if (JSON.stringify(this._oldModel) == JSON.stringify(content)) {
            return;
        }
        if (!this._hasSpecialTag) {
            this._oldModel = content;
        }
        else {
            this._model = content;
        }
        if (this._editorInitialized) {
            if (!this._hasSpecialTag) {
                this._$element.froalaEditor('html.set', content);
            }
            else {
                this.setContent();
            }
        }
        else {
            if (!this._hasSpecialTag) {
                this._$element.html(content);
            }
            else {
                this.setContent();
            }
        }
    }
    // froalaModel directive as output: update model if editor contentChanged
    froalaModelChange = new EventEmitter();
    // froalaInit directive as output: send manual editor initialization
    froalaInit = new EventEmitter();
    // update model if editor contentChanged
    updateModel() {
        this.zone.run(() => {
            let modelContent = null;
            if (this._hasSpecialTag) {
                let attributeNodes = this._$element[0].attributes;
                let attrs = {};
                for (let i = 0; i < attributeNodes.length; i++) {
                    let attrName = attributeNodes[i].name;
                    if (this._opts.angularIgnoreAttrs &&
                        this._opts.angularIgnoreAttrs.indexOf(attrName) != -1) {
                        continue;
                    }
                    attrs[attrName] = attributeNodes[i].value;
                }
                if (this._$element[0].innerHTML) {
                    attrs[this.INNER_HTML_ATTR] = this._$element[0].innerHTML;
                }
                modelContent = attrs;
            }
            else {
                let returnedHtml = this._$element.froalaEditor('html.get');
                if (typeof returnedHtml === 'string') {
                    modelContent = returnedHtml;
                }
            }
            if (this._oldModel !== modelContent) {
                this._oldModel = modelContent;
                // Update froalaModel.
                this.froalaModelChange.emit(modelContent);
                // Update form model.
                this.onChange(modelContent);
            }
        });
    }
    // register event on jquery element
    registerEvent(element, eventName, callback) {
        if (!element || !eventName || !callback) {
            return;
        }
        this._listeningEvents.push(eventName);
        element.on(eventName, callback);
    }
    initListeners() {
        let self = this;
        // bind contentChange and keyup event to froalaModel
        this.registerEvent(this._$element, 'froalaEditor.contentChanged', function () {
            setTimeout(function () {
                self.updateModel();
            }, 0);
        });
        this.registerEvent(this._$element, 'froalaEditor.mousedown', function () {
            setTimeout(function () {
                self.onTouched();
            }, 0);
        });
        if (this._opts.immediateAngularModelUpdate) {
            this.registerEvent(this._$element, 'keyup', function () {
                setTimeout(function () {
                    self.updateModel();
                }, 0);
            });
        }
    }
    // register events from editor options
    registerFroalaEvents() {
        if (!this._opts.events) {
            return;
        }
        for (let eventName in this._opts.events) {
            if (this._opts.events.hasOwnProperty(eventName)) {
                this.registerEvent(this._$element, eventName, this._opts.events[eventName]);
            }
        }
    }
    createEditor() {
        if (this._editorInitialized) {
            return;
        }
        this.setContent(true);
        // Registering events before initializing the editor will bind the initialized event correctly.
        this.registerFroalaEvents();
        this.initListeners();
        // init editor
        this.zone.runOutsideAngular(() => {
            this._$element.on('froalaEditor.initialized', () => {
                this._editorInitialized = true;
            });
            this._editor = this._$element.froalaEditor(this._opts).data('froala.editor').$el;
        });
    }
    setHtml() {
        this._$element.froalaEditor('html.set', this._model || '', true);
        // This will reset the undo stack everytime the model changes externally. Can we fix this?
        this._$element.froalaEditor('undo.reset');
        this._$element.froalaEditor('undo.saveStep');
    }
    setContent(firstTime = false) {
        let self = this;
        // Set initial content
        if (this._model || this._model == '') {
            this._oldModel = this._model;
            if (this._hasSpecialTag) {
                let tags = this._model;
                // add tags on element
                if (tags) {
                    for (let attr in tags) {
                        if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
                            this._$element.attr(attr, tags[attr]);
                        }
                    }
                    if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
                        this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
                    }
                }
            }
            else {
                if (firstTime) {
                    this.registerEvent(this._$element, 'froalaEditor.initialized', function () {
                        self.setHtml();
                    });
                }
                else {
                    self.setHtml();
                }
            }
        }
    }
    destroyEditor() {
        if (this._editorInitialized) {
            this._$element.off(this._listeningEvents.join(' '));
            this._editor.off('keyup');
            this._$element.froalaEditor('destroy');
            this._listeningEvents.length = 0;
            this._editorInitialized = false;
        }
    }
    getEditor() {
        if (this._$element) {
            return this._$element.froalaEditor.bind(this._$element);
        }
        return null;
    }
    // send manual editor initialization
    generateManualController() {
        let self = this;
        let controls = {
            initialize: this.createEditor.bind(this),
            destroy: this.destroyEditor.bind(this),
            getEditor: this.getEditor.bind(this),
        };
        this.froalaInit.emit(controls);
    }
    // TODO not sure if ngOnInit is executed after @inputs
    ngOnInit() {
        // check if output froalaInit is present. Maybe observers is private and should not be used?? TODO how to better test that an output directive is present.
        if (!this.froalaInit.observers.length) {
            this.createEditor();
        }
        else {
            this.generateManualController();
        }
    }
    ngOnDestroy() {
        this.destroyEditor();
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.5", type: FroalaEditorDirective, selector: "[froalaEditor]", inputs: { froalaEditor: "froalaEditor", froalaModel: "froalaModel" }, outputs: { froalaModelChange: "froalaModelChange", froalaInit: "froalaInit" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef((() => FroalaEditorDirective)),
                multi: true,
            },
        ], exportAs: ["froalaEditor"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[froalaEditor]',
                    exportAs: 'froalaEditor',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => FroalaEditorDirective)),
                            multi: true,
                        },
                    ],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { froalaEditor: [{
                type: Input
            }], froalaModel: [{
                type: Input
            }], froalaModelChange: [{
                type: Output
            }], froalaInit: [{
                type: Output
            }] } });

class FroalaEditorModule {
    static forRoot() {
        return { ngModule: FroalaEditorModule, providers: [] };
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorModule, declarations: [FroalaEditorDirective], exports: [FroalaEditorDirective] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FroalaEditorDirective],
                    exports: [FroalaEditorDirective],
                }]
        }] });

class FroalaViewDirective {
    renderer;
    _element;
    _content;
    constructor(renderer, element) {
        this.renderer = renderer;
        this._element = element.nativeElement;
    }
    // update content model as it comes
    set froalaView(content) {
        this._element.innerHTML = content;
    }
    ngAfterViewInit() {
        this.renderer.addClass(this._element, "fr-view");
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.5", type: FroalaViewDirective, selector: "[froalaView]", inputs: { froalaView: "froalaView" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[froalaView]'
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { froalaView: [{
                type: Input
            }] } });

class FroalaViewModule {
    static forRoot() {
        return { ngModule: FroalaViewModule, providers: [] };
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewModule, declarations: [FroalaViewDirective], exports: [FroalaViewDirective] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaViewModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FroalaViewDirective],
                    exports: [FroalaViewDirective],
                }]
        }] });

class FERootModule {
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [FroalaEditorModule, FroalaViewModule], exports: [FroalaEditorModule, FroalaViewModule] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(), FroalaEditorModule, FroalaViewModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FERootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()],
                    exports: [FroalaEditorModule, FroalaViewModule],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { FERootModule, FroalaEditorDirective, FroalaEditorModule, FroalaViewDirective, FroalaViewModule };
//# sourceMappingURL=angular-froala-wysiwyg.mjs.map
