import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Directive, EventEmitter, Input, Output, forwardRef, } from '@angular/core';
import * as i0 from "@angular/core";
export class FroalaEditorDirective {
    constructor(el, zone) {
        this.zone = zone;
        // editor options
        this._opts = {
            immediateAngularModelUpdate: false,
            angularIgnoreAttrs: null,
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.5", ngImport: i0, type: FroalaEditorDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.5", type: FroalaEditorDirective, selector: "[froalaEditor]", inputs: { froalaEditor: "froalaEditor", froalaModel: "froalaModel" }, outputs: { froalaModelChange: "froalaModelChange", froalaInit: "froalaInit" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef((() => FroalaEditorDirective)),
                multi: true,
            },
        ], exportAs: ["froalaEditor"], ngImport: i0 }); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixVQUFVLEdBQ1gsTUFBTSxlQUFlLENBQUM7O0FBZXZCLE1BQU0sT0FBTyxxQkFBcUI7SUEwQmhDLFlBQVksRUFBYyxFQUFVLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBekJoRCxpQkFBaUI7UUFDVCxVQUFLLEdBQVE7WUFDbkIsMkJBQTJCLEVBQUUsS0FBSztZQUNsQyxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUM7UUFLTSxpQkFBWSxHQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsb0JBQWUsR0FBVyxXQUFXLENBQUM7UUFDdEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRaEMscUJBQWdCLEdBQWEsRUFBRSxDQUFDO1FBRWhDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUVwQyxjQUFTLEdBQVcsSUFBSSxDQUFDO1FBZ0JqQyxxQ0FBcUM7UUFDckMsYUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQW9EckIseUVBQXlFO1FBQy9ELHNCQUFpQixHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXpFLG9FQUFvRTtRQUMxRCxlQUFVLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUF2RXRFLElBQUksT0FBTyxHQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFFcEMsd0NBQXdDO1FBQ3hDLElBQUks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cUIsRUFBQztnQkFDcEQsS0FBSyxFQUFFLElBQUk7YUFDWjtTQUNGOzsyRkFFVSxxQkFBcUI7a0JBWGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxFQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7aUJBQ0Y7b0dBMkRjLFlBQVk7c0JBQXhCLEtBQUs7Z0JBS08sV0FBVztzQkFBdkIsS0FBSztnQkFnQ0ksaUJBQWlCO3NCQUExQixNQUFNO2dCQUdHLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQge1xyXG4gIERpcmVjdGl2ZSxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBOZ1pvbmUsXHJcbiAgT3V0cHV0LFxyXG4gIGZvcndhcmRSZWYsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5kZWNsYXJlIHZhciAkOiBKUXVlcnlTdGF0aWM7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tmcm9hbGFFZGl0b3JdJyxcclxuICBleHBvcnRBczogJ2Zyb2FsYUVkaXRvcicsXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBGcm9hbGFFZGl0b3JEaXJlY3RpdmUpLFxyXG4gICAgICBtdWx0aTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEZyb2FsYUVkaXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuICAvLyBlZGl0b3Igb3B0aW9uc1xyXG4gIHByaXZhdGUgX29wdHM6IGFueSA9IHtcclxuICAgIGltbWVkaWF0ZUFuZ3VsYXJNb2RlbFVwZGF0ZTogZmFsc2UsXHJcbiAgICBhbmd1bGFySWdub3JlQXR0cnM6IG51bGwsXHJcbiAgfTtcclxuXHJcbiAgLy8ganF1ZXJ5IHdyYXBwZWQgZWxlbWVudFxyXG4gIHByaXZhdGUgXyRlbGVtZW50OiBhbnk7XHJcblxyXG4gIHByaXZhdGUgU1BFQ0lBTF9UQUdTOiBzdHJpbmdbXSA9IFsnaW1nJywgJ2J1dHRvbicsICdpbnB1dCcsICdhJ107XHJcbiAgcHJpdmF0ZSBJTk5FUl9IVE1MX0FUVFI6IHN0cmluZyA9ICdpbm5lckhUTUwnO1xyXG4gIHByaXZhdGUgX2hhc1NwZWNpYWxUYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLy8gZWRpdG9yIGVsZW1lbnRcclxuICBwcml2YXRlIF9lZGl0b3I6IGFueTtcclxuXHJcbiAgLy8gaW5pdGlhbCBlZGl0b3IgY29udGVudFxyXG4gIHByaXZhdGUgX21vZGVsOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgX2xpc3RlbmluZ0V2ZW50czogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSBfZWRpdG9ySW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBfb2xkTW9kZWw6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xyXG4gICAgbGV0IGVsZW1lbnQ6IGFueSA9IGVsLm5hdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgLy8gY2hlY2sgaWYgdGhlIGVsZW1lbnQgaXMgYSBzcGVjaWFsIHRhZ1xyXG4gICAgaWYgKHRoaXMuU1BFQ0lBTF9UQUdTLmluZGV4T2YoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpICE9IC0xKSB7XHJcbiAgICAgIHRoaXMuX2hhc1NwZWNpYWxUYWcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGpxdWVyeSB3cmFwIGFuZCBzdG9yZSBlbGVtZW50XHJcbiAgICB0aGlzLl8kZWxlbWVudCA9IDxhbnk+JChlbGVtZW50KTtcclxuXHJcbiAgICB0aGlzLnpvbmUgPSB6b25lO1xyXG4gIH1cclxuXHJcbiAgLy8gQmVnaW4gQ29udHJvbFZhbHVlQWNjZXNvciBtZXRob2RzLlxyXG4gIG9uQ2hhbmdlID0gKF8pID0+IHt9O1xyXG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICAvLyBGb3JtIG1vZGVsIGNvbnRlbnQgY2hhbmdlZC5cclxuICB3cml0ZVZhbHVlKGNvbnRlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGVFZGl0b3IoY29udGVudCk7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XHJcbiAgfVxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xyXG4gIH1cclxuICAvLyBFbmQgQ29udHJvbFZhbHVlQWNjZXNvciBtZXRob2RzLlxyXG5cclxuICAvLyBmcm9hbGFFZGl0b3IgZGlyZWN0aXZlIGFzIGlucHV0OiBzdG9yZSB0aGUgZWRpdG9yIG9wdGlvbnNcclxuICBASW5wdXQoKSBzZXQgZnJvYWxhRWRpdG9yKG9wdHM6IGFueSkge1xyXG4gICAgdGhpcy5fb3B0cyA9IG9wdHMgfHwgdGhpcy5fb3B0cztcclxuICB9XHJcblxyXG4gIC8vIGZyb2FsYU1vZGVsIGRpcmVjdGl2ZSBhcyBpbnB1dDogc3RvcmUgaW5pdGlhbCBlZGl0b3IgY29udGVudFxyXG4gIEBJbnB1dCgpIHNldCBmcm9hbGFNb2RlbChjb250ZW50OiBhbnkpIHtcclxuICAgIHRoaXMudXBkYXRlRWRpdG9yKGNvbnRlbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGVkaXRvciB3aXRoIG1vZGVsIGNvbnRlbnRzLlxyXG4gIHByaXZhdGUgdXBkYXRlRWRpdG9yKGNvbnRlbnQ6IGFueSkge1xyXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KHRoaXMuX29sZE1vZGVsKSA9PSBKU09OLnN0cmluZ2lmeShjb250ZW50KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgIHRoaXMuX29sZE1vZGVsID0gY29udGVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX21vZGVsID0gY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQpIHtcclxuICAgICAgaWYgKCF0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdodG1sLnNldCcsIGNvbnRlbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgICB0aGlzLl8kZWxlbWVudC5odG1sKGNvbnRlbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBmcm9hbGFNb2RlbCBkaXJlY3RpdmUgYXMgb3V0cHV0OiB1cGRhdGUgbW9kZWwgaWYgZWRpdG9yIGNvbnRlbnRDaGFuZ2VkXHJcbiAgQE91dHB1dCgpIGZyb2FsYU1vZGVsQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAvLyBmcm9hbGFJbml0IGRpcmVjdGl2ZSBhcyBvdXRwdXQ6IHNlbmQgbWFudWFsIGVkaXRvciBpbml0aWFsaXphdGlvblxyXG4gIEBPdXRwdXQoKSBmcm9hbGFJbml0OiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8T2JqZWN0PigpO1xyXG5cclxuICAvLyB1cGRhdGUgbW9kZWwgaWYgZWRpdG9yIGNvbnRlbnRDaGFuZ2VkXHJcbiAgcHJpdmF0ZSB1cGRhdGVNb2RlbCgpIHtcclxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICBsZXQgbW9kZWxDb250ZW50OiBhbnkgPSBudWxsO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgICBsZXQgYXR0cmlidXRlTm9kZXMgPSB0aGlzLl8kZWxlbWVudFswXS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIGxldCBhdHRycyA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZU5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgYXR0ck5hbWUgPSBhdHRyaWJ1dGVOb2Rlc1tpXS5uYW1lO1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLl9vcHRzLmFuZ3VsYXJJZ25vcmVBdHRycyAmJlxyXG4gICAgICAgICAgICB0aGlzLl9vcHRzLmFuZ3VsYXJJZ25vcmVBdHRycy5pbmRleE9mKGF0dHJOYW1lKSAhPSAtMVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGF0dHJzW2F0dHJOYW1lXSA9IGF0dHJpYnV0ZU5vZGVzW2ldLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuXyRlbGVtZW50WzBdLmlubmVySFRNTCkge1xyXG4gICAgICAgICAgYXR0cnNbdGhpcy5JTk5FUl9IVE1MX0FUVFJdID0gdGhpcy5fJGVsZW1lbnRbMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9kZWxDb250ZW50ID0gYXR0cnM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJldHVybmVkSHRtbDogYW55ID0gdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCdodG1sLmdldCcpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmV0dXJuZWRIdG1sID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgbW9kZWxDb250ZW50ID0gcmV0dXJuZWRIdG1sO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5fb2xkTW9kZWwgIT09IG1vZGVsQ29udGVudCkge1xyXG4gICAgICAgIHRoaXMuX29sZE1vZGVsID0gbW9kZWxDb250ZW50O1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgZnJvYWxhTW9kZWwuXHJcbiAgICAgICAgdGhpcy5mcm9hbGFNb2RlbENoYW5nZS5lbWl0KG1vZGVsQ29udGVudCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBmb3JtIG1vZGVsLlxyXG4gICAgICAgIHRoaXMub25DaGFuZ2UobW9kZWxDb250ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyByZWdpc3RlciBldmVudCBvbiBqcXVlcnkgZWxlbWVudFxyXG4gIHByaXZhdGUgcmVnaXN0ZXJFdmVudChlbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWV2ZW50TmFtZSB8fCAhY2FsbGJhY2spIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2xpc3RlbmluZ0V2ZW50cy5wdXNoKGV2ZW50TmFtZSk7XHJcbiAgICBlbGVtZW50Lm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0TGlzdGVuZXJzKCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIGJpbmQgY29udGVudENoYW5nZSBhbmQga2V5dXAgZXZlbnQgdG8gZnJvYWxhTW9kZWxcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2Zyb2FsYUVkaXRvci5jb250ZW50Q2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi51cGRhdGVNb2RlbCgpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCAnZnJvYWxhRWRpdG9yLm1vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi5vblRvdWNoZWQoKTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodGhpcy5fb3B0cy5pbW1lZGlhdGVBbmd1bGFyTW9kZWxVcGRhdGUpIHtcclxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCAna2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZWxmLnVwZGF0ZU1vZGVsKCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcmVnaXN0ZXIgZXZlbnRzIGZyb20gZWRpdG9yIG9wdGlvbnNcclxuICBwcml2YXRlIHJlZ2lzdGVyRnJvYWxhRXZlbnRzKCkge1xyXG4gICAgaWYgKCF0aGlzLl9vcHRzLmV2ZW50cykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuX29wdHMuZXZlbnRzKSB7XHJcbiAgICAgIGlmICh0aGlzLl9vcHRzLmV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudE5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCBldmVudE5hbWUsIHRoaXMuX29wdHMuZXZlbnRzW2V2ZW50TmFtZV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUVkaXRvcigpIHtcclxuICAgIGlmICh0aGlzLl9lZGl0b3JJbml0aWFsaXplZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRDb250ZW50KHRydWUpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyaW5nIGV2ZW50cyBiZWZvcmUgaW5pdGlhbGl6aW5nIHRoZSBlZGl0b3Igd2lsbCBiaW5kIHRoZSBpbml0aWFsaXplZCBldmVudCBjb3JyZWN0bHkuXHJcbiAgICB0aGlzLnJlZ2lzdGVyRnJvYWxhRXZlbnRzKCk7XHJcblxyXG4gICAgdGhpcy5pbml0TGlzdGVuZXJzKCk7XHJcblxyXG4gICAgLy8gaW5pdCBlZGl0b3JcclxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgIHRoaXMuXyRlbGVtZW50Lm9uKCdmcm9hbGFFZGl0b3IuaW5pdGlhbGl6ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuX2VkaXRvciA9IHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcih0aGlzLl9vcHRzKS5kYXRhKCdmcm9hbGEuZWRpdG9yJykuJGVsO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEh0bWwoKSB7XHJcbiAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ2h0bWwuc2V0JywgdGhpcy5fbW9kZWwgfHwgJycsIHRydWUpO1xyXG5cclxuICAgIC8vIFRoaXMgd2lsbCByZXNldCB0aGUgdW5kbyBzdGFjayBldmVyeXRpbWUgdGhlIG1vZGVsIGNoYW5nZXMgZXh0ZXJuYWxseS4gQ2FuIHdlIGZpeCB0aGlzP1xyXG4gICAgdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKCd1bmRvLnJlc2V0Jyk7XHJcbiAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ3VuZG8uc2F2ZVN0ZXAnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Q29udGVudChmaXJzdFRpbWUgPSBmYWxzZSkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIFNldCBpbml0aWFsIGNvbnRlbnRcclxuICAgIGlmICh0aGlzLl9tb2RlbCB8fCB0aGlzLl9tb2RlbCA9PSAnJykge1xyXG4gICAgICB0aGlzLl9vbGRNb2RlbCA9IHRoaXMuX21vZGVsO1xyXG4gICAgICBpZiAodGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG4gICAgICAgIGxldCB0YWdzOiBPYmplY3QgPSB0aGlzLl9tb2RlbDtcclxuXHJcbiAgICAgICAgLy8gYWRkIHRhZ3Mgb24gZWxlbWVudFxyXG4gICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBhdHRyIGluIHRhZ3MpIHtcclxuICAgICAgICAgICAgaWYgKHRhZ3MuaGFzT3duUHJvcGVydHkoYXR0cikgJiYgYXR0ciAhPSB0aGlzLklOTkVSX0hUTUxfQVRUUikge1xyXG4gICAgICAgICAgICAgIHRoaXMuXyRlbGVtZW50LmF0dHIoYXR0ciwgdGFnc1thdHRyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGFncy5oYXNPd25Qcm9wZXJ0eSh0aGlzLklOTkVSX0hUTUxfQVRUUikpIHtcclxuICAgICAgICAgICAgdGhpcy5fJGVsZW1lbnRbMF0uaW5uZXJIVE1MID0gdGFnc1t0aGlzLklOTkVSX0hUTUxfQVRUUl07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChmaXJzdFRpbWUpIHtcclxuICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLl8kZWxlbWVudCwgJ2Zyb2FsYUVkaXRvci5pbml0aWFsaXplZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zZXRIdG1sKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZi5zZXRIdG1sKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlc3Ryb3lFZGl0b3IoKSB7XHJcbiAgICBpZiAodGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQpIHtcclxuICAgICAgdGhpcy5fJGVsZW1lbnQub2ZmKHRoaXMuX2xpc3RlbmluZ0V2ZW50cy5qb2luKCcgJykpO1xyXG4gICAgICB0aGlzLl9lZGl0b3Iub2ZmKCdrZXl1cCcpO1xyXG4gICAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ2Rlc3Ryb3knKTtcclxuICAgICAgdGhpcy5fbGlzdGVuaW5nRXZlbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgIHRoaXMuX2VkaXRvckluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEVkaXRvcigpIHtcclxuICAgIGlmICh0aGlzLl8kZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yLmJpbmQodGhpcy5fJGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gc2VuZCBtYW51YWwgZWRpdG9yIGluaXRpYWxpemF0aW9uXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZU1hbnVhbENvbnRyb2xsZXIoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICBsZXQgY29udHJvbHMgPSB7XHJcbiAgICAgIGluaXRpYWxpemU6IHRoaXMuY3JlYXRlRWRpdG9yLmJpbmQodGhpcyksXHJcbiAgICAgIGRlc3Ryb3k6IHRoaXMuZGVzdHJveUVkaXRvci5iaW5kKHRoaXMpLFxyXG4gICAgICBnZXRFZGl0b3I6IHRoaXMuZ2V0RWRpdG9yLmJpbmQodGhpcyksXHJcbiAgICB9O1xyXG4gICAgdGhpcy5mcm9hbGFJbml0LmVtaXQoY29udHJvbHMpO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETyBub3Qgc3VyZSBpZiBuZ09uSW5pdCBpcyBleGVjdXRlZCBhZnRlciBAaW5wdXRzXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyBjaGVjayBpZiBvdXRwdXQgZnJvYWxhSW5pdCBpcyBwcmVzZW50LiBNYXliZSBvYnNlcnZlcnMgaXMgcHJpdmF0ZSBhbmQgc2hvdWxkIG5vdCBiZSB1c2VkPz8gVE9ETyBob3cgdG8gYmV0dGVyIHRlc3QgdGhhdCBhbiBvdXRwdXQgZGlyZWN0aXZlIGlzIHByZXNlbnQuXHJcbiAgICBpZiAoIXRoaXMuZnJvYWxhSW5pdC5vYnNlcnZlcnMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlRWRpdG9yKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdlbmVyYXRlTWFudWFsQ29udHJvbGxlcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmRlc3Ryb3lFZGl0b3IoKTtcclxuICB9XHJcbn1cclxuIl19