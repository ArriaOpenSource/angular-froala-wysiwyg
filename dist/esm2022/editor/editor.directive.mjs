import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, forwardRef, } from '@angular/core';
import * as i0 from "@angular/core";
export class FroalaEditorDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFVBQVUsR0FDWCxNQUFNLGVBQWUsQ0FBQzs7QUFldkIsTUFBTSxPQUFPLHFCQUFxQjtJQTBCSTtJQXpCcEMsaUJBQWlCO0lBQ1QsS0FBSyxHQUFRO1FBQ25CLDJCQUEyQixFQUFFLEtBQUs7UUFDbEMsa0JBQWtCLEVBQUUsSUFBSTtLQUN6QixDQUFDO0lBRUYseUJBQXlCO0lBQ2pCLFNBQVMsQ0FBTTtJQUVmLFlBQVksR0FBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELGVBQWUsR0FBVyxXQUFXLENBQUM7SUFDdEMsY0FBYyxHQUFZLEtBQUssQ0FBQztJQUV4QyxpQkFBaUI7SUFDVCxPQUFPLENBQU07SUFFckIseUJBQXlCO0lBQ2pCLE1BQU0sQ0FBUztJQUVmLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztJQUVoQyxrQkFBa0IsR0FBWSxLQUFLLENBQUM7SUFFcEMsU0FBUyxHQUFXLElBQUksQ0FBQztJQUVqQyxZQUFZLEVBQWMsRUFBVSxJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUM5QyxJQUFJLE9BQU8sR0FBUSxFQUFFLENBQUMsYUFBYSxDQUFDO1FBRXBDLHdDQUF3QztRQUN4QyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNsRSxJQUFJLENBQUMsY0FB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LHFCQUFxQjs4R0FBckIscUJBQXFCLDhMQVJyQjtZQUNUO2dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLEVBQUM7Z0JBQ3BELEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRjs7MkZBRVUscUJBQXFCO2tCQVhqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxFQUFFLFVBQVUsRUFBQyxHQUFHLEVBQUUsc0JBQXNCLEVBQUM7NEJBQ3BELEtBQUssRUFBRSxJQUFJO3lCQUNaO3FCQUNGO2lCQUNGO29HQTJEYyxZQUFZO3NCQUF4QixLQUFLO2dCQUtPLFdBQVc7c0JBQXZCLEtBQUs7Z0JBZ0NJLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFHRyxVQUFVO3NCQUFuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5wdXQsXHJcbiAgTmdab25lLFxyXG4gIE91dHB1dCxcclxuICBmb3J3YXJkUmVmLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuZGVjbGFyZSB2YXIgJDogSlF1ZXJ5U3RhdGljO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbZnJvYWxhRWRpdG9yXScsXHJcbiAgZXhwb3J0QXM6ICdmcm9hbGFFZGl0b3InLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRnJvYWxhRWRpdG9yRGlyZWN0aXZlKSxcclxuICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGcm9hbGFFZGl0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgLy8gZWRpdG9yIG9wdGlvbnNcclxuICBwcml2YXRlIF9vcHRzOiBhbnkgPSB7XHJcbiAgICBpbW1lZGlhdGVBbmd1bGFyTW9kZWxVcGRhdGU6IGZhbHNlLFxyXG4gICAgYW5ndWxhcklnbm9yZUF0dHJzOiBudWxsLFxyXG4gIH07XHJcblxyXG4gIC8vIGpxdWVyeSB3cmFwcGVkIGVsZW1lbnRcclxuICBwcml2YXRlIF8kZWxlbWVudDogYW55O1xyXG5cclxuICBwcml2YXRlIFNQRUNJQUxfVEFHUzogc3RyaW5nW10gPSBbJ2ltZycsICdidXR0b24nLCAnaW5wdXQnLCAnYSddO1xyXG4gIHByaXZhdGUgSU5ORVJfSFRNTF9BVFRSOiBzdHJpbmcgPSAnaW5uZXJIVE1MJztcclxuICBwcml2YXRlIF9oYXNTcGVjaWFsVGFnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8vIGVkaXRvciBlbGVtZW50XHJcbiAgcHJpdmF0ZSBfZWRpdG9yOiBhbnk7XHJcblxyXG4gIC8vIGluaXRpYWwgZWRpdG9yIGNvbnRlbnRcclxuICBwcml2YXRlIF9tb2RlbDogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIF9saXN0ZW5pbmdFdmVudHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIHByaXZhdGUgX2VkaXRvckluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgX29sZE1vZGVsOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcclxuICAgIGxldCBlbGVtZW50OiBhbnkgPSBlbC5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGlzIGEgc3BlY2lhbCB0YWdcclxuICAgIGlmICh0aGlzLlNQRUNJQUxfVEFHUy5pbmRleE9mKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSAhPSAtMSkge1xyXG4gICAgICB0aGlzLl9oYXNTcGVjaWFsVGFnID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBqcXVlcnkgd3JhcCBhbmQgc3RvcmUgZWxlbWVudFxyXG4gICAgdGhpcy5fJGVsZW1lbnQgPSA8YW55PiQoZWxlbWVudCk7XHJcblxyXG4gICAgdGhpcy56b25lID0gem9uZTtcclxuICB9XHJcblxyXG4gIC8vIEJlZ2luIENvbnRyb2xWYWx1ZUFjY2Vzb3IgbWV0aG9kcy5cclxuICBvbkNoYW5nZSA9IChfKSA9PiB7fTtcclxuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcclxuXHJcbiAgLy8gRm9ybSBtb2RlbCBjb250ZW50IGNoYW5nZWQuXHJcbiAgd3JpdGVWYWx1ZShjb250ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlRWRpdG9yKGNvbnRlbnQpO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xyXG4gIH1cclxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcclxuICB9XHJcbiAgLy8gRW5kIENvbnRyb2xWYWx1ZUFjY2Vzb3IgbWV0aG9kcy5cclxuXHJcbiAgLy8gZnJvYWxhRWRpdG9yIGRpcmVjdGl2ZSBhcyBpbnB1dDogc3RvcmUgdGhlIGVkaXRvciBvcHRpb25zXHJcbiAgQElucHV0KCkgc2V0IGZyb2FsYUVkaXRvcihvcHRzOiBhbnkpIHtcclxuICAgIHRoaXMuX29wdHMgPSBvcHRzIHx8IHRoaXMuX29wdHM7XHJcbiAgfVxyXG5cclxuICAvLyBmcm9hbGFNb2RlbCBkaXJlY3RpdmUgYXMgaW5wdXQ6IHN0b3JlIGluaXRpYWwgZWRpdG9yIGNvbnRlbnRcclxuICBASW5wdXQoKSBzZXQgZnJvYWxhTW9kZWwoY29udGVudDogYW55KSB7XHJcbiAgICB0aGlzLnVwZGF0ZUVkaXRvcihjb250ZW50KTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBlZGl0b3Igd2l0aCBtb2RlbCBjb250ZW50cy5cclxuICBwcml2YXRlIHVwZGF0ZUVkaXRvcihjb250ZW50OiBhbnkpIHtcclxuICAgIGlmIChKU09OLnN0cmluZ2lmeSh0aGlzLl9vbGRNb2RlbCkgPT0gSlNPTi5zdHJpbmdpZnkoY29udGVudCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG4gICAgICB0aGlzLl9vbGRNb2RlbCA9IGNvbnRlbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9tb2RlbCA9IGNvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX2VkaXRvckluaXRpYWxpemVkKSB7XHJcbiAgICAgIGlmICghdGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG4gICAgICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcignaHRtbC5zZXQnLCBjb250ZW50KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldENvbnRlbnQoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCF0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgdGhpcy5fJGVsZW1lbnQuaHRtbChjb250ZW50KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldENvbnRlbnQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJvYWxhTW9kZWwgZGlyZWN0aXZlIGFzIG91dHB1dDogdXBkYXRlIG1vZGVsIGlmIGVkaXRvciBjb250ZW50Q2hhbmdlZFxyXG4gIEBPdXRwdXQoKSBmcm9hbGFNb2RlbENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgLy8gZnJvYWxhSW5pdCBkaXJlY3RpdmUgYXMgb3V0cHV0OiBzZW5kIG1hbnVhbCBlZGl0b3IgaW5pdGlhbGl6YXRpb25cclxuICBAT3V0cHV0KCkgZnJvYWxhSW5pdDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPE9iamVjdD4oKTtcclxuXHJcbiAgLy8gdXBkYXRlIG1vZGVsIGlmIGVkaXRvciBjb250ZW50Q2hhbmdlZFxyXG4gIHByaXZhdGUgdXBkYXRlTW9kZWwoKSB7XHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgbGV0IG1vZGVsQ29udGVudDogYW55ID0gbnVsbDtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgbGV0IGF0dHJpYnV0ZU5vZGVzID0gdGhpcy5fJGVsZW1lbnRbMF0uYXR0cmlidXRlcztcclxuICAgICAgICBsZXQgYXR0cnMgPSB7fTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVOb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgbGV0IGF0dHJOYW1lID0gYXR0cmlidXRlTm9kZXNbaV0ubmFtZTtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5fb3B0cy5hbmd1bGFySWdub3JlQXR0cnMgJiZcclxuICAgICAgICAgICAgdGhpcy5fb3B0cy5hbmd1bGFySWdub3JlQXR0cnMuaW5kZXhPZihhdHRyTmFtZSkgIT0gLTFcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBhdHRyc1thdHRyTmFtZV0gPSBhdHRyaWJ1dGVOb2Rlc1tpXS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl8kZWxlbWVudFswXS5pbm5lckhUTUwpIHtcclxuICAgICAgICAgIGF0dHJzW3RoaXMuSU5ORVJfSFRNTF9BVFRSXSA9IHRoaXMuXyRlbGVtZW50WzBdLmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1vZGVsQ29udGVudCA9IGF0dHJzO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXR1cm5lZEh0bWw6IGFueSA9IHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcignaHRtbC5nZXQnKTtcclxuICAgICAgICBpZiAodHlwZW9mIHJldHVybmVkSHRtbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIG1vZGVsQ29udGVudCA9IHJldHVybmVkSHRtbDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuX29sZE1vZGVsICE9PSBtb2RlbENvbnRlbnQpIHtcclxuICAgICAgICB0aGlzLl9vbGRNb2RlbCA9IG1vZGVsQ29udGVudDtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGZyb2FsYU1vZGVsLlxyXG4gICAgICAgIHRoaXMuZnJvYWxhTW9kZWxDaGFuZ2UuZW1pdChtb2RlbENvbnRlbnQpO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgZm9ybSBtb2RlbC5cclxuICAgICAgICB0aGlzLm9uQ2hhbmdlKG1vZGVsQ29udGVudCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVnaXN0ZXIgZXZlbnQgb24ganF1ZXJ5IGVsZW1lbnRcclxuICBwcml2YXRlIHJlZ2lzdGVyRXZlbnQoZWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaykge1xyXG4gICAgaWYgKCFlbGVtZW50IHx8ICFldmVudE5hbWUgfHwgIWNhbGxiYWNrKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9saXN0ZW5pbmdFdmVudHMucHVzaChldmVudE5hbWUpO1xyXG4gICAgZWxlbWVudC5vbihldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdExpc3RlbmVycygpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBiaW5kIGNvbnRlbnRDaGFuZ2UgYW5kIGtleXVwIGV2ZW50IHRvIGZyb2FsYU1vZGVsXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdmcm9hbGFFZGl0b3IuY29udGVudENoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYudXBkYXRlTW9kZWwoKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2Zyb2FsYUVkaXRvci5tb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYub25Ub3VjaGVkKCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX29wdHMuaW1tZWRpYXRlQW5ndWxhck1vZGVsVXBkYXRlKSB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2tleXVwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZi51cGRhdGVNb2RlbCgpO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGV2ZW50cyBmcm9tIGVkaXRvciBvcHRpb25zXHJcbiAgcHJpdmF0ZSByZWdpc3RlckZyb2FsYUV2ZW50cygpIHtcclxuICAgIGlmICghdGhpcy5fb3B0cy5ldmVudHMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiB0aGlzLl9vcHRzLmV2ZW50cykge1xyXG4gICAgICBpZiAodGhpcy5fb3B0cy5ldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgZXZlbnROYW1lLCB0aGlzLl9vcHRzLmV2ZW50c1tldmVudE5hbWVdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVFZGl0b3IoKSB7XHJcbiAgICBpZiAodGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Q29udGVudCh0cnVlKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlcmluZyBldmVudHMgYmVmb3JlIGluaXRpYWxpemluZyB0aGUgZWRpdG9yIHdpbGwgYmluZCB0aGUgaW5pdGlhbGl6ZWQgZXZlbnQgY29ycmVjdGx5LlxyXG4gICAgdGhpcy5yZWdpc3RlckZyb2FsYUV2ZW50cygpO1xyXG5cclxuICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xyXG5cclxuICAgIC8vIGluaXQgZWRpdG9yXHJcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICB0aGlzLl8kZWxlbWVudC5vbignZnJvYWxhRWRpdG9yLmluaXRpYWxpemVkJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2VkaXRvckluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLl9lZGl0b3IgPSB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IodGhpcy5fb3B0cykuZGF0YSgnZnJvYWxhLmVkaXRvcicpLiRlbDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRIdG1sKCkge1xyXG4gICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdodG1sLnNldCcsIHRoaXMuX21vZGVsIHx8ICcnLCB0cnVlKTtcclxuXHJcbiAgICAvLyBUaGlzIHdpbGwgcmVzZXQgdGhlIHVuZG8gc3RhY2sgZXZlcnl0aW1lIHRoZSBtb2RlbCBjaGFuZ2VzIGV4dGVybmFsbHkuIENhbiB3ZSBmaXggdGhpcz9cclxuICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcigndW5kby5yZXNldCcpO1xyXG4gICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCd1bmRvLnNhdmVTdGVwJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldENvbnRlbnQoZmlyc3RUaW1lID0gZmFsc2UpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBTZXQgaW5pdGlhbCBjb250ZW50XHJcbiAgICBpZiAodGhpcy5fbW9kZWwgfHwgdGhpcy5fbW9kZWwgPT0gJycpIHtcclxuICAgICAgdGhpcy5fb2xkTW9kZWwgPSB0aGlzLl9tb2RlbDtcclxuICAgICAgaWYgKHRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgICBsZXQgdGFnczogT2JqZWN0ID0gdGhpcy5fbW9kZWw7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0YWdzIG9uIGVsZW1lbnRcclxuICAgICAgICBpZiAodGFncykge1xyXG4gICAgICAgICAgZm9yIChsZXQgYXR0ciBpbiB0YWdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWdzLmhhc093blByb3BlcnR5KGF0dHIpICYmIGF0dHIgIT0gdGhpcy5JTk5FUl9IVE1MX0FUVFIpIHtcclxuICAgICAgICAgICAgICB0aGlzLl8kZWxlbWVudC5hdHRyKGF0dHIsIHRhZ3NbYXR0cl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhZ3MuaGFzT3duUHJvcGVydHkodGhpcy5JTk5FUl9IVE1MX0FUVFIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRlbGVtZW50WzBdLmlubmVySFRNTCA9IHRhZ3NbdGhpcy5JTk5FUl9IVE1MX0FUVFJdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdmcm9hbGFFZGl0b3IuaW5pdGlhbGl6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SHRtbCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYuc2V0SHRtbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZXN0cm95RWRpdG9yKCkge1xyXG4gICAgaWYgKHRoaXMuX2VkaXRvckluaXRpYWxpemVkKSB7XHJcbiAgICAgIHRoaXMuXyRlbGVtZW50Lm9mZih0aGlzLl9saXN0ZW5pbmdFdmVudHMuam9pbignICcpKTtcclxuICAgICAgdGhpcy5fZWRpdG9yLm9mZigna2V5dXAnKTtcclxuICAgICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdkZXN0cm95Jyk7XHJcbiAgICAgIHRoaXMuX2xpc3RlbmluZ0V2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICB0aGlzLl9lZGl0b3JJbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFZGl0b3IoKSB7XHJcbiAgICBpZiAodGhpcy5fJGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvci5iaW5kKHRoaXMuXyRlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIHNlbmQgbWFudWFsIGVkaXRvciBpbml0aWFsaXphdGlvblxyXG4gIHByaXZhdGUgZ2VuZXJhdGVNYW51YWxDb250cm9sbGVyKCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgbGV0IGNvbnRyb2xzID0ge1xyXG4gICAgICBpbml0aWFsaXplOiB0aGlzLmNyZWF0ZUVkaXRvci5iaW5kKHRoaXMpLFxyXG4gICAgICBkZXN0cm95OiB0aGlzLmRlc3Ryb3lFZGl0b3IuYmluZCh0aGlzKSxcclxuICAgICAgZ2V0RWRpdG9yOiB0aGlzLmdldEVkaXRvci5iaW5kKHRoaXMpLFxyXG4gICAgfTtcclxuICAgIHRoaXMuZnJvYWxhSW5pdC5lbWl0KGNvbnRyb2xzKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8gbm90IHN1cmUgaWYgbmdPbkluaXQgaXMgZXhlY3V0ZWQgYWZ0ZXIgQGlucHV0c1xyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gY2hlY2sgaWYgb3V0cHV0IGZyb2FsYUluaXQgaXMgcHJlc2VudC4gTWF5YmUgb2JzZXJ2ZXJzIGlzIHByaXZhdGUgYW5kIHNob3VsZCBub3QgYmUgdXNlZD8/IFRPRE8gaG93IHRvIGJldHRlciB0ZXN0IHRoYXQgYW4gb3V0cHV0IGRpcmVjdGl2ZSBpcyBwcmVzZW50LlxyXG4gICAgaWYgKCF0aGlzLmZyb2FsYUluaXQub2JzZXJ2ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmNyZWF0ZUVkaXRvcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nZW5lcmF0ZU1hbnVhbENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5kZXN0cm95RWRpdG9yKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==