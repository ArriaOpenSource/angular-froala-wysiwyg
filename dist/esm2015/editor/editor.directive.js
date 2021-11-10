import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, forwardRef } from '@angular/core';
export class FroalaEditorDirective {
    constructor(el, zone) {
        this.zone = zone;
        // editor options
        this._opts = {
            immediateAngularModelUpdate: false,
            angularIgnoreAttrs: null
        };
        this.SPECIAL_TAGS = ['img', 'button', 'input', 'a'];
        this.INNER_HTML_ATTR = 'innerHTML';
        this._hasSpecialTag = false;
        this._listeningEvents = [];
        this._editorInitialized = false;
        this._oldModel = null;
        // Begin ControlValueAccesor methods.
        this.onChange = (_) => { };
        this.onTouched = () => { };
        // froalaModel directive as output: update model if editor contentChanged
        this.froalaModelChange = new EventEmitter();
        // froalaInit directive as output: send manual editor initialization
        this.froalaInit = new EventEmitter();
        let element = el.nativeElement;
        // check if the element is a special tag
        if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) != -1) {
            this._hasSpecialTag = true;
        }
        // jquery wrap and store element
        this._$element = $(element);
        this.zone = zone;
    }
    // Form model content changed.
    writeValue(content) {
        this.updateEditor(content);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
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
    // update model if editor contentChanged
    updateModel() {
        this.zone.run(() => {
            let modelContent = null;
            if (this._hasSpecialTag) {
                let attributeNodes = this._$element[0].attributes;
                let attrs = {};
                for (let i = 0; i < attributeNodes.length; i++) {
                    let attrName = attributeNodes[i].name;
                    if (this._opts.angularIgnoreAttrs && this._opts.angularIgnoreAttrs.indexOf(attrName) != -1) {
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
            this._$element.off(this._listeningEvents.join(" "));
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
}
FroalaEditorDirective.decorators = [
    { type: Directive, args: [{
                selector: '[froalaEditor]',
                exportAs: 'froalaEditor',
                providers: [{
                        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FroalaEditorDirective),
                        multi: true
                    }]
            },] }
];
/** @nocollapse */
FroalaEditorDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
FroalaEditorDirective.propDecorators = {
    froalaEditor: [{ type: Input }],
    froalaModel: [{ type: Input }],
    froalaModelChange: [{ type: Output }],
    froalaInit: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVksTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWNqSCxNQUFNLE9BQU8scUJBQXFCO0lBMkJoQyxZQUFZLEVBQWMsRUFBVSxJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQXpCaEQsaUJBQWlCO1FBQ1QsVUFBSyxHQUFRO1lBQ25CLDJCQUEyQixFQUFFLEtBQUs7WUFDbEMsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDO1FBS00saUJBQVksR0FBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELG9CQUFlLEdBQVcsV0FBVyxDQUFDO1FBQ3RDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBUWhDLHFCQUFnQixHQUFhLEVBQUUsQ0FBQztRQUVoQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFFcEMsY0FBUyxHQUFXLElBQUksQ0FBQztRQWlCakMscUNBQXFDO1FBQ3JDLGFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFvRHRCLHlFQUF5RTtRQUMvRCxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV6RSxvRUFBb0U7UUFDMUQsZUFBVSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBdkV0RSxJQUFJLE9BQU8sR0FBUSxFQUFFLENBQUMsYUFBYSxDQUFDO1FBRXBD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TyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFDckMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDO3dCQUN6QyxLQUFLLEVBQUUsSUFBSTtxQkFDWixDQUFDO2FBQ0g7Ozs7WUFibUIsVUFBVTtZQUF1QixNQUFNOzs7MkJBc0V4RCxLQUFLOzBCQUtMLEtBQUs7Z0NBb0NMLE1BQU07eUJBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT3B0aW9uYWwsIE91dHB1dCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuZGVjbGFyZSB2YXIgJDogSlF1ZXJ5U3RhdGljO1xyXG5cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2Zyb2FsYUVkaXRvcl0nLFxyXG4gIGV4cG9ydEFzOiAnZnJvYWxhRWRpdG9yJyxcclxuICBwcm92aWRlcnM6IFt7XHJcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6XHJcbiAgICAgIGZvcndhcmRSZWYoKCkgPT4gRnJvYWxhRWRpdG9yRGlyZWN0aXZlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbiAgfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZyb2FsYUVkaXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuXHJcbiAgLy8gZWRpdG9yIG9wdGlvbnNcclxuICBwcml2YXRlIF9vcHRzOiBhbnkgPSB7XHJcbiAgICBpbW1lZGlhdGVBbmd1bGFyTW9kZWxVcGRhdGU6IGZhbHNlLFxyXG4gICAgYW5ndWxhcklnbm9yZUF0dHJzOiBudWxsXHJcbiAgfTtcclxuXHJcbiAgLy8ganF1ZXJ5IHdyYXBwZWQgZWxlbWVudFxyXG4gIHByaXZhdGUgXyRlbGVtZW50OiBhbnk7XHJcblxyXG4gIHByaXZhdGUgU1BFQ0lBTF9UQUdTOiBzdHJpbmdbXSA9IFsnaW1nJywgJ2J1dHRvbicsICdpbnB1dCcsICdhJ107XHJcbiAgcHJpdmF0ZSBJTk5FUl9IVE1MX0FUVFI6IHN0cmluZyA9ICdpbm5lckhUTUwnO1xyXG4gIHByaXZhdGUgX2hhc1NwZWNpYWxUYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLy8gZWRpdG9yIGVsZW1lbnRcclxuICBwcml2YXRlIF9lZGl0b3I6IGFueTtcclxuXHJcbiAgLy8gaW5pdGlhbCBlZGl0b3IgY29udGVudFxyXG4gIHByaXZhdGUgX21vZGVsOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgX2xpc3RlbmluZ0V2ZW50czogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSBfZWRpdG9ySW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBfb2xkTW9kZWw6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xyXG5cclxuICAgIGxldCBlbGVtZW50OiBhbnkgPSBlbC5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIC8vIGNoZWNrIGlmIHRoZSBlbGVtZW50IGlzIGEgc3BlY2lhbCB0YWdcclxuICAgIGlmICh0aGlzLlNQRUNJQUxfVEFHUy5pbmRleE9mKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSAhPSAtMSkge1xyXG4gICAgICB0aGlzLl9oYXNTcGVjaWFsVGFnID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBqcXVlcnkgd3JhcCBhbmQgc3RvcmUgZWxlbWVudFxyXG4gICAgdGhpcy5fJGVsZW1lbnQgPSAoPGFueT4kKGVsZW1lbnQpKTtcclxuXHJcbiAgICB0aGlzLnpvbmUgPSB6b25lO1xyXG4gIH1cclxuXHJcbiAgLy8gQmVnaW4gQ29udHJvbFZhbHVlQWNjZXNvciBtZXRob2RzLlxyXG4gIG9uQ2hhbmdlID0gKF8pID0+IHsgfTtcclxuICBvblRvdWNoZWQgPSAoKSA9PiB7IH07XHJcblxyXG4gIC8vIEZvcm0gbW9kZWwgY29udGVudCBjaGFuZ2VkLlxyXG4gIHdyaXRlVmFsdWUoY29udGVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUVkaXRvcihjb250ZW50KTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxyXG4gIC8vIEVuZCBDb250cm9sVmFsdWVBY2Nlc29yIG1ldGhvZHMuXHJcblxyXG4gIC8vIGZyb2FsYUVkaXRvciBkaXJlY3RpdmUgYXMgaW5wdXQ6IHN0b3JlIHRoZSBlZGl0b3Igb3B0aW9uc1xyXG4gIEBJbnB1dCgpIHNldCBmcm9hbGFFZGl0b3Iob3B0czogYW55KSB7XHJcbiAgICB0aGlzLl9vcHRzID0gb3B0cyB8fCB0aGlzLl9vcHRzO1xyXG4gIH1cclxuXHJcbiAgLy8gZnJvYWxhTW9kZWwgZGlyZWN0aXZlIGFzIGlucHV0OiBzdG9yZSBpbml0aWFsIGVkaXRvciBjb250ZW50XHJcbiAgQElucHV0KCkgc2V0IGZyb2FsYU1vZGVsKGNvbnRlbnQ6IGFueSkge1xyXG4gICAgdGhpcy51cGRhdGVFZGl0b3IoY29udGVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgZWRpdG9yIHdpdGggbW9kZWwgY29udGVudHMuXHJcbiAgcHJpdmF0ZSB1cGRhdGVFZGl0b3IoY29udGVudDogYW55KSB7XHJcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5fb2xkTW9kZWwpID09IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgdGhpcy5fb2xkTW9kZWwgPSBjb250ZW50O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuX21vZGVsID0gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQpIHtcclxuICAgICAgaWYgKCF0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdodG1sLnNldCcsIGNvbnRlbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYgKCF0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgdGhpcy5fJGVsZW1lbnQuaHRtbChjb250ZW50KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldENvbnRlbnQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gZnJvYWxhTW9kZWwgZGlyZWN0aXZlIGFzIG91dHB1dDogdXBkYXRlIG1vZGVsIGlmIGVkaXRvciBjb250ZW50Q2hhbmdlZFxyXG4gIEBPdXRwdXQoKSBmcm9hbGFNb2RlbENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgLy8gZnJvYWxhSW5pdCBkaXJlY3RpdmUgYXMgb3V0cHV0OiBzZW5kIG1hbnVhbCBlZGl0b3IgaW5pdGlhbGl6YXRpb25cclxuICBAT3V0cHV0KCkgZnJvYWxhSW5pdDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPE9iamVjdD4oKTtcclxuXHJcbiAgLy8gdXBkYXRlIG1vZGVsIGlmIGVkaXRvciBjb250ZW50Q2hhbmdlZFxyXG4gIHByaXZhdGUgdXBkYXRlTW9kZWwoKSB7XHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuXHJcbiAgICAgIGxldCBtb2RlbENvbnRlbnQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICBpZiAodGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG5cclxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZXMgPSB0aGlzLl8kZWxlbWVudFswXS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIGxldCBhdHRycyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZU5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgbGV0IGF0dHJOYW1lID0gYXR0cmlidXRlTm9kZXNbaV0ubmFtZTtcclxuICAgICAgICAgIGlmICh0aGlzLl9vcHRzLmFuZ3VsYXJJZ25vcmVBdHRycyAmJiB0aGlzLl9vcHRzLmFuZ3VsYXJJZ25vcmVBdHRycy5pbmRleE9mKGF0dHJOYW1lKSAhPSAtMSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBhdHRyc1thdHRyTmFtZV0gPSBhdHRyaWJ1dGVOb2Rlc1tpXS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl8kZWxlbWVudFswXS5pbm5lckhUTUwpIHtcclxuICAgICAgICAgIGF0dHJzW3RoaXMuSU5ORVJfSFRNTF9BVFRSXSA9IHRoaXMuXyRlbGVtZW50WzBdLmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1vZGVsQ29udGVudCA9IGF0dHJzO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgcmV0dXJuZWRIdG1sOiBhbnkgPSB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ2h0bWwuZ2V0Jyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZXR1cm5lZEh0bWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBtb2RlbENvbnRlbnQgPSByZXR1cm5lZEh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLl9vbGRNb2RlbCAhPT0gbW9kZWxDb250ZW50KSB7XHJcbiAgICAgICAgdGhpcy5fb2xkTW9kZWwgPSBtb2RlbENvbnRlbnQ7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBmcm9hbGFNb2RlbC5cclxuICAgICAgICB0aGlzLmZyb2FsYU1vZGVsQ2hhbmdlLmVtaXQobW9kZWxDb250ZW50KTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGZvcm0gbW9kZWwuXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZShtb2RlbENvbnRlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGV2ZW50IG9uIGpxdWVyeSBlbGVtZW50XHJcbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcclxuXHJcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWV2ZW50TmFtZSB8fCAhY2FsbGJhY2spIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2xpc3RlbmluZ0V2ZW50cy5wdXNoKGV2ZW50TmFtZSk7XHJcbiAgICBlbGVtZW50Lm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0TGlzdGVuZXJzKCkge1xyXG5cclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBiaW5kIGNvbnRlbnRDaGFuZ2UgYW5kIGtleXVwIGV2ZW50IHRvIGZyb2FsYU1vZGVsXHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdmcm9hbGFFZGl0b3IuY29udGVudENoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYudXBkYXRlTW9kZWwoKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2Zyb2FsYUVkaXRvci5tb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYub25Ub3VjaGVkKCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX29wdHMuaW1tZWRpYXRlQW5ndWxhck1vZGVsVXBkYXRlKSB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2tleXVwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZi51cGRhdGVNb2RlbCgpO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGV2ZW50cyBmcm9tIGVkaXRvciBvcHRpb25zXHJcbiAgcHJpdmF0ZSByZWdpc3RlckZyb2FsYUV2ZW50cygpIHtcclxuXHJcbiAgICBpZiAoIXRoaXMuX29wdHMuZXZlbnRzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5fb3B0cy5ldmVudHMpIHtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9vcHRzLmV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudE5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCBldmVudE5hbWUsIHRoaXMuX29wdHMuZXZlbnRzW2V2ZW50TmFtZV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUVkaXRvcigpIHtcclxuXHJcbiAgICBpZiAodGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Q29udGVudCh0cnVlKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlcmluZyBldmVudHMgYmVmb3JlIGluaXRpYWxpemluZyB0aGUgZWRpdG9yIHdpbGwgYmluZCB0aGUgaW5pdGlhbGl6ZWQgZXZlbnQgY29ycmVjdGx5LlxyXG4gICAgdGhpcy5yZWdpc3RlckZyb2FsYUV2ZW50cygpO1xyXG5cclxuICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xyXG5cclxuICAgIC8vIGluaXQgZWRpdG9yXHJcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICB0aGlzLl8kZWxlbWVudC5vbignZnJvYWxhRWRpdG9yLmluaXRpYWxpemVkJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2VkaXRvckluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMuX2VkaXRvciA9IHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcih0aGlzLl9vcHRzKS5kYXRhKCdmcm9hbGEuZWRpdG9yJykuJGVsO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0SHRtbCgpIHtcclxuICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcignaHRtbC5zZXQnLCB0aGlzLl9tb2RlbCB8fCAnJywgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhpcyB3aWxsIHJlc2V0IHRoZSB1bmRvIHN0YWNrIGV2ZXJ5dGltZSB0aGUgbW9kZWwgY2hhbmdlcyBleHRlcm5hbGx5LiBDYW4gd2UgZml4IHRoaXM/XHJcbiAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ3VuZG8ucmVzZXQnKTtcclxuICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcigndW5kby5zYXZlU3RlcCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRDb250ZW50KGZpcnN0VGltZSA9IGZhbHNlKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gU2V0IGluaXRpYWwgY29udGVudFxyXG4gICAgaWYgKHRoaXMuX21vZGVsIHx8IHRoaXMuX21vZGVsID09ICcnKSB7XHJcbiAgICAgIHRoaXMuX29sZE1vZGVsID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgIGlmICh0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcblxyXG4gICAgICAgIGxldCB0YWdzOiBPYmplY3QgPSB0aGlzLl9tb2RlbDtcclxuXHJcbiAgICAgICAgLy8gYWRkIHRhZ3Mgb24gZWxlbWVudFxyXG4gICAgICAgIGlmICh0YWdzKSB7XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgYXR0ciBpbiB0YWdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0YWdzLmhhc093blByb3BlcnR5KGF0dHIpICYmIGF0dHIgIT0gdGhpcy5JTk5FUl9IVE1MX0FUVFIpIHtcclxuICAgICAgICAgICAgICB0aGlzLl8kZWxlbWVudC5hdHRyKGF0dHIsIHRhZ3NbYXR0cl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhZ3MuaGFzT3duUHJvcGVydHkodGhpcy5JTk5FUl9IVE1MX0FUVFIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRlbGVtZW50WzBdLmlubmVySFRNTCA9IHRhZ3NbdGhpcy5JTk5FUl9IVE1MX0FUVFJdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdmcm9hbGFFZGl0b3IuaW5pdGlhbGl6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0SHRtbCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYuc2V0SHRtbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVzdHJveUVkaXRvcigpIHtcclxuICAgIGlmICh0aGlzLl9lZGl0b3JJbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLl8kZWxlbWVudC5vZmYodGhpcy5fbGlzdGVuaW5nRXZlbnRzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgdGhpcy5fZWRpdG9yLm9mZigna2V5dXAnKTtcclxuICAgICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdkZXN0cm95Jyk7XHJcbiAgICAgIHRoaXMuX2xpc3RlbmluZ0V2ZW50cy5sZW5ndGggPSAwO1xyXG4gICAgICB0aGlzLl9lZGl0b3JJbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFZGl0b3IoKSB7XHJcbiAgICBpZiAodGhpcy5fJGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvci5iaW5kKHRoaXMuXyRlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIHNlbmQgbWFudWFsIGVkaXRvciBpbml0aWFsaXphdGlvblxyXG4gIHByaXZhdGUgZ2VuZXJhdGVNYW51YWxDb250cm9sbGVyKCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgbGV0IGNvbnRyb2xzID0ge1xyXG4gICAgICBpbml0aWFsaXplOiB0aGlzLmNyZWF0ZUVkaXRvci5iaW5kKHRoaXMpLFxyXG4gICAgICBkZXN0cm95OiB0aGlzLmRlc3Ryb3lFZGl0b3IuYmluZCh0aGlzKSxcclxuICAgICAgZ2V0RWRpdG9yOiB0aGlzLmdldEVkaXRvci5iaW5kKHRoaXMpLFxyXG4gICAgfTtcclxuICAgIHRoaXMuZnJvYWxhSW5pdC5lbWl0KGNvbnRyb2xzKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE8gbm90IHN1cmUgaWYgbmdPbkluaXQgaXMgZXhlY3V0ZWQgYWZ0ZXIgQGlucHV0c1xyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gY2hlY2sgaWYgb3V0cHV0IGZyb2FsYUluaXQgaXMgcHJlc2VudC4gTWF5YmUgb2JzZXJ2ZXJzIGlzIHByaXZhdGUgYW5kIHNob3VsZCBub3QgYmUgdXNlZD8/IFRPRE8gaG93IHRvIGJldHRlciB0ZXN0IHRoYXQgYW4gb3V0cHV0IGRpcmVjdGl2ZSBpcyBwcmVzZW50LlxyXG4gICAgaWYgKCF0aGlzLmZyb2FsYUluaXQub2JzZXJ2ZXJzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmNyZWF0ZUVkaXRvcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nZW5lcmF0ZU1hbnVhbENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5kZXN0cm95RWRpdG9yKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==