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
    static { this.ɵfac = function FroalaEditorDirective_Factory(t) { return new (t || FroalaEditorDirective)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.NgZone)); }; }
    static { this.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: FroalaEditorDirective, selectors: [["", "froalaEditor", ""]], inputs: { froalaEditor: "froalaEditor", froalaModel: "froalaModel" }, outputs: { froalaModelChange: "froalaModelChange", froalaInit: "froalaInit" }, exportAs: ["froalaEditor"], features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(() => FroalaEditorDirective),
                    multi: true,
                },
            ])] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FroalaEditorDirective, [{
        type: Directive,
        args: [{
                selector: '[froalaEditor]',
                exportAs: 'froalaEditor',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => FroalaEditorDirective),
                        multi: true,
                    },
                ],
            }]
    }], () => [{ type: i0.ElementRef }, { type: i0.NgZone }], { froalaEditor: [{
            type: Input
        }], froalaModel: [{
            type: Input
        }], froalaModelChange: [{
            type: Output
        }], froalaInit: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lZGl0b3IvZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixVQUFVLEdBQ1gsTUFBTSxlQUFlLENBQUM7O0FBZXZCLE1BQU0sT0FBTyxxQkFBcUI7SUEwQmhDLFlBQVksRUFBYyxFQUFVLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBekJoRCxpQkFBaUI7UUFDVCxVQUFLLEdBQVE7WUFDbkIsMkJBQTJCLEVBQUUsS0FBSztZQUNsQyxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUM7UUFLTSxpQkFBWSxHQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsb0JBQWUsR0FBVyxXQUFXLENBQUM7UUFDdEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRaEMscUJBQWdCLEdBQWEsRUFBRSxDQUFDO1FBRWhDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUVwQyxjQUFTLEdBQVcsSUFBSSxDQUFDO1FBZ0JqQyxxQ0FBcUM7UUFDckMsYUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDckIsY0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQW9EckIseUVBQXlFO1FBQy9ELHNCQUFpQixHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXpFLG9FQUFvRTtRQUMxRCxlQUFVLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUF2RXRFLElBQUksT0FBTyxHQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUM7UUFFcEMsd0NBQXdDO1FBQ3hDLElBQUks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QXFCLENBQUM7b0JBQ3BELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7O2lGQUVVLHFCQUFxQjtjQVhqQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzt3QkFDcEQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7YUFDRjtnRUEyRGMsWUFBWTtrQkFBeEIsS0FBSztZQUtPLFdBQVc7a0JBQXZCLEtBQUs7WUFnQ0ksaUJBQWlCO2tCQUExQixNQUFNO1lBR0csVUFBVTtrQkFBbkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7XHJcbiAgRGlyZWN0aXZlLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE5nWm9uZSxcclxuICBPdXRwdXQsXHJcbiAgZm9yd2FyZFJlZixcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmRlY2xhcmUgdmFyICQ6IEpRdWVyeVN0YXRpYztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2Zyb2FsYUVkaXRvcl0nLFxyXG4gIGV4cG9ydEFzOiAnZnJvYWxhRWRpdG9yJyxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZyb2FsYUVkaXRvckRpcmVjdGl2ZSksXHJcbiAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgfSxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRnJvYWxhRWRpdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG4gIC8vIGVkaXRvciBvcHRpb25zXHJcbiAgcHJpdmF0ZSBfb3B0czogYW55ID0ge1xyXG4gICAgaW1tZWRpYXRlQW5ndWxhck1vZGVsVXBkYXRlOiBmYWxzZSxcclxuICAgIGFuZ3VsYXJJZ25vcmVBdHRyczogbnVsbCxcclxuICB9O1xyXG5cclxuICAvLyBqcXVlcnkgd3JhcHBlZCBlbGVtZW50XHJcbiAgcHJpdmF0ZSBfJGVsZW1lbnQ6IGFueTtcclxuXHJcbiAgcHJpdmF0ZSBTUEVDSUFMX1RBR1M6IHN0cmluZ1tdID0gWydpbWcnLCAnYnV0dG9uJywgJ2lucHV0JywgJ2EnXTtcclxuICBwcml2YXRlIElOTkVSX0hUTUxfQVRUUjogc3RyaW5nID0gJ2lubmVySFRNTCc7XHJcbiAgcHJpdmF0ZSBfaGFzU3BlY2lhbFRhZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBlZGl0b3IgZWxlbWVudFxyXG4gIHByaXZhdGUgX2VkaXRvcjogYW55O1xyXG5cclxuICAvLyBpbml0aWFsIGVkaXRvciBjb250ZW50XHJcbiAgcHJpdmF0ZSBfbW9kZWw6IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSBfbGlzdGVuaW5nRXZlbnRzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIF9lZGl0b3JJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIF9vbGRNb2RlbDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgem9uZTogTmdab25lKSB7XHJcbiAgICBsZXQgZWxlbWVudDogYW55ID0gZWwubmF0aXZlRWxlbWVudDtcclxuXHJcbiAgICAvLyBjaGVjayBpZiB0aGUgZWxlbWVudCBpcyBhIHNwZWNpYWwgdGFnXHJcbiAgICBpZiAodGhpcy5TUEVDSUFMX1RBR1MuaW5kZXhPZihlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgIT0gLTEpIHtcclxuICAgICAgdGhpcy5faGFzU3BlY2lhbFRhZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8ganF1ZXJ5IHdyYXAgYW5kIHN0b3JlIGVsZW1lbnRcclxuICAgIHRoaXMuXyRlbGVtZW50ID0gPGFueT4kKGVsZW1lbnQpO1xyXG5cclxuICAgIHRoaXMuem9uZSA9IHpvbmU7XHJcbiAgfVxyXG5cclxuICAvLyBCZWdpbiBDb250cm9sVmFsdWVBY2Nlc29yIG1ldGhvZHMuXHJcbiAgb25DaGFuZ2UgPSAoXykgPT4ge307XHJcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XHJcblxyXG4gIC8vIEZvcm0gbW9kZWwgY29udGVudCBjaGFuZ2VkLlxyXG4gIHdyaXRlVmFsdWUoY29udGVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUVkaXRvcihjb250ZW50KTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcclxuICB9XHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XHJcbiAgfVxyXG4gIC8vIEVuZCBDb250cm9sVmFsdWVBY2Nlc29yIG1ldGhvZHMuXHJcblxyXG4gIC8vIGZyb2FsYUVkaXRvciBkaXJlY3RpdmUgYXMgaW5wdXQ6IHN0b3JlIHRoZSBlZGl0b3Igb3B0aW9uc1xyXG4gIEBJbnB1dCgpIHNldCBmcm9hbGFFZGl0b3Iob3B0czogYW55KSB7XHJcbiAgICB0aGlzLl9vcHRzID0gb3B0cyB8fCB0aGlzLl9vcHRzO1xyXG4gIH1cclxuXHJcbiAgLy8gZnJvYWxhTW9kZWwgZGlyZWN0aXZlIGFzIGlucHV0OiBzdG9yZSBpbml0aWFsIGVkaXRvciBjb250ZW50XHJcbiAgQElucHV0KCkgc2V0IGZyb2FsYU1vZGVsKGNvbnRlbnQ6IGFueSkge1xyXG4gICAgdGhpcy51cGRhdGVFZGl0b3IoY29udGVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgZWRpdG9yIHdpdGggbW9kZWwgY29udGVudHMuXHJcbiAgcHJpdmF0ZSB1cGRhdGVFZGl0b3IoY29udGVudDogYW55KSB7XHJcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodGhpcy5fb2xkTW9kZWwpID09IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgdGhpcy5fb2xkTW9kZWwgPSBjb250ZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fbW9kZWwgPSBjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9lZGl0b3JJbml0aWFsaXplZCkge1xyXG4gICAgICBpZiAoIXRoaXMuX2hhc1NwZWNpYWxUYWcpIHtcclxuICAgICAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ2h0bWwuc2V0JywgY29udGVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghdGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG4gICAgICAgIHRoaXMuXyRlbGVtZW50Lmh0bWwoY29udGVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZyb2FsYU1vZGVsIGRpcmVjdGl2ZSBhcyBvdXRwdXQ6IHVwZGF0ZSBtb2RlbCBpZiBlZGl0b3IgY29udGVudENoYW5nZWRcclxuICBAT3V0cHV0KCkgZnJvYWxhTW9kZWxDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIC8vIGZyb2FsYUluaXQgZGlyZWN0aXZlIGFzIG91dHB1dDogc2VuZCBtYW51YWwgZWRpdG9yIGluaXRpYWxpemF0aW9uXHJcbiAgQE91dHB1dCgpIGZyb2FsYUluaXQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxPYmplY3Q+KCk7XHJcblxyXG4gIC8vIHVwZGF0ZSBtb2RlbCBpZiBlZGl0b3IgY29udGVudENoYW5nZWRcclxuICBwcml2YXRlIHVwZGF0ZU1vZGVsKCkge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIGxldCBtb2RlbENvbnRlbnQ6IGFueSA9IG51bGw7XHJcblxyXG4gICAgICBpZiAodGhpcy5faGFzU3BlY2lhbFRhZykge1xyXG4gICAgICAgIGxldCBhdHRyaWJ1dGVOb2RlcyA9IHRoaXMuXyRlbGVtZW50WzBdLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgbGV0IGF0dHJzID0ge307XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGxldCBhdHRyTmFtZSA9IGF0dHJpYnV0ZU5vZGVzW2ldLm5hbWU7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuX29wdHMuYW5ndWxhcklnbm9yZUF0dHJzICYmXHJcbiAgICAgICAgICAgIHRoaXMuX29wdHMuYW5ndWxhcklnbm9yZUF0dHJzLmluZGV4T2YoYXR0ck5hbWUpICE9IC0xXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYXR0cnNbYXR0ck5hbWVdID0gYXR0cmlidXRlTm9kZXNbaV0udmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fJGVsZW1lbnRbMF0uaW5uZXJIVE1MKSB7XHJcbiAgICAgICAgICBhdHRyc1t0aGlzLklOTkVSX0hUTUxfQVRUUl0gPSB0aGlzLl8kZWxlbWVudFswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtb2RlbENvbnRlbnQgPSBhdHRycztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmV0dXJuZWRIdG1sOiBhbnkgPSB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ2h0bWwuZ2V0Jyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZXR1cm5lZEh0bWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICBtb2RlbENvbnRlbnQgPSByZXR1cm5lZEh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLl9vbGRNb2RlbCAhPT0gbW9kZWxDb250ZW50KSB7XHJcbiAgICAgICAgdGhpcy5fb2xkTW9kZWwgPSBtb2RlbENvbnRlbnQ7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSBmcm9hbGFNb2RlbC5cclxuICAgICAgICB0aGlzLmZyb2FsYU1vZGVsQ2hhbmdlLmVtaXQobW9kZWxDb250ZW50KTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGZvcm0gbW9kZWwuXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZShtb2RlbENvbnRlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHJlZ2lzdGVyIGV2ZW50IG9uIGpxdWVyeSBlbGVtZW50XHJcbiAgcHJpdmF0ZSByZWdpc3RlckV2ZW50KGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcclxuICAgIGlmICghZWxlbWVudCB8fCAhZXZlbnROYW1lIHx8ICFjYWxsYmFjaykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbGlzdGVuaW5nRXZlbnRzLnB1c2goZXZlbnROYW1lKTtcclxuICAgIGVsZW1lbnQub24oZXZlbnROYW1lLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRMaXN0ZW5lcnMoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gYmluZCBjb250ZW50Q2hhbmdlIGFuZCBrZXl1cCBldmVudCB0byBmcm9hbGFNb2RlbFxyXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCAnZnJvYWxhRWRpdG9yLmNvbnRlbnRDaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnVwZGF0ZU1vZGVsKCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdmcm9hbGFFZGl0b3IubW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLm9uVG91Y2hlZCgpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLl9vcHRzLmltbWVkaWF0ZUFuZ3VsYXJNb2RlbFVwZGF0ZSkge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsICdrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNlbGYudXBkYXRlTW9kZWwoKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyByZWdpc3RlciBldmVudHMgZnJvbSBlZGl0b3Igb3B0aW9uc1xyXG4gIHByaXZhdGUgcmVnaXN0ZXJGcm9hbGFFdmVudHMoKSB7XHJcbiAgICBpZiAoIXRoaXMuX29wdHMuZXZlbnRzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5fb3B0cy5ldmVudHMpIHtcclxuICAgICAgaWYgKHRoaXMuX29wdHMuZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSkpIHtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5fJGVsZW1lbnQsIGV2ZW50TmFtZSwgdGhpcy5fb3B0cy5ldmVudHNbZXZlbnROYW1lXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRWRpdG9yKCkge1xyXG4gICAgaWYgKHRoaXMuX2VkaXRvckluaXRpYWxpemVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldENvbnRlbnQodHJ1ZSk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXJpbmcgZXZlbnRzIGJlZm9yZSBpbml0aWFsaXppbmcgdGhlIGVkaXRvciB3aWxsIGJpbmQgdGhlIGluaXRpYWxpemVkIGV2ZW50IGNvcnJlY3RseS5cclxuICAgIHRoaXMucmVnaXN0ZXJGcm9hbGFFdmVudHMoKTtcclxuXHJcbiAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICAvLyBpbml0IGVkaXRvclxyXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgdGhpcy5fJGVsZW1lbnQub24oJ2Zyb2FsYUVkaXRvci5pbml0aWFsaXplZCcsICgpID0+IHtcclxuICAgICAgICB0aGlzLl9lZGl0b3JJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5fZWRpdG9yID0gdGhpcy5fJGVsZW1lbnQuZnJvYWxhRWRpdG9yKHRoaXMuX29wdHMpLmRhdGEoJ2Zyb2FsYS5lZGl0b3InKS4kZWw7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0SHRtbCgpIHtcclxuICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcignaHRtbC5zZXQnLCB0aGlzLl9tb2RlbCB8fCAnJywgdHJ1ZSk7XHJcblxyXG4gICAgLy8gVGhpcyB3aWxsIHJlc2V0IHRoZSB1bmRvIHN0YWNrIGV2ZXJ5dGltZSB0aGUgbW9kZWwgY2hhbmdlcyBleHRlcm5hbGx5LiBDYW4gd2UgZml4IHRoaXM/XHJcbiAgICB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IoJ3VuZG8ucmVzZXQnKTtcclxuICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcigndW5kby5zYXZlU3RlcCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRDb250ZW50KGZpcnN0VGltZSA9IGZhbHNlKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gU2V0IGluaXRpYWwgY29udGVudFxyXG4gICAgaWYgKHRoaXMuX21vZGVsIHx8IHRoaXMuX21vZGVsID09ICcnKSB7XHJcbiAgICAgIHRoaXMuX29sZE1vZGVsID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgIGlmICh0aGlzLl9oYXNTcGVjaWFsVGFnKSB7XHJcbiAgICAgICAgbGV0IHRhZ3M6IE9iamVjdCA9IHRoaXMuX21vZGVsO1xyXG5cclxuICAgICAgICAvLyBhZGQgdGFncyBvbiBlbGVtZW50XHJcbiAgICAgICAgaWYgKHRhZ3MpIHtcclxuICAgICAgICAgIGZvciAobGV0IGF0dHIgaW4gdGFncykge1xyXG4gICAgICAgICAgICBpZiAodGFncy5oYXNPd25Qcm9wZXJ0eShhdHRyKSAmJiBhdHRyICE9IHRoaXMuSU5ORVJfSFRNTF9BVFRSKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fJGVsZW1lbnQuYXR0cihhdHRyLCB0YWdzW2F0dHJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0YWdzLmhhc093blByb3BlcnR5KHRoaXMuSU5ORVJfSFRNTF9BVFRSKSkge1xyXG4gICAgICAgICAgICB0aGlzLl8kZWxlbWVudFswXS5pbm5lckhUTUwgPSB0YWdzW3RoaXMuSU5ORVJfSFRNTF9BVFRSXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGZpcnN0VGltZSkge1xyXG4gICAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuXyRlbGVtZW50LCAnZnJvYWxhRWRpdG9yLmluaXRpYWxpemVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnNldEh0bWwoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLnNldEh0bWwoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVzdHJveUVkaXRvcigpIHtcclxuICAgIGlmICh0aGlzLl9lZGl0b3JJbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLl8kZWxlbWVudC5vZmYodGhpcy5fbGlzdGVuaW5nRXZlbnRzLmpvaW4oJyAnKSk7XHJcbiAgICAgIHRoaXMuX2VkaXRvci5vZmYoJ2tleXVwJyk7XHJcbiAgICAgIHRoaXMuXyRlbGVtZW50LmZyb2FsYUVkaXRvcignZGVzdHJveScpO1xyXG4gICAgICB0aGlzLl9saXN0ZW5pbmdFdmVudHMubGVuZ3RoID0gMDtcclxuICAgICAgdGhpcy5fZWRpdG9ySW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RWRpdG9yKCkge1xyXG4gICAgaWYgKHRoaXMuXyRlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl8kZWxlbWVudC5mcm9hbGFFZGl0b3IuYmluZCh0aGlzLl8kZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyBzZW5kIG1hbnVhbCBlZGl0b3IgaW5pdGlhbGl6YXRpb25cclxuICBwcml2YXRlIGdlbmVyYXRlTWFudWFsQ29udHJvbGxlcigpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIGxldCBjb250cm9scyA9IHtcclxuICAgICAgaW5pdGlhbGl6ZTogdGhpcy5jcmVhdGVFZGl0b3IuYmluZCh0aGlzKSxcclxuICAgICAgZGVzdHJveTogdGhpcy5kZXN0cm95RWRpdG9yLmJpbmQodGhpcyksXHJcbiAgICAgIGdldEVkaXRvcjogdGhpcy5nZXRFZGl0b3IuYmluZCh0aGlzKSxcclxuICAgIH07XHJcbiAgICB0aGlzLmZyb2FsYUluaXQuZW1pdChjb250cm9scyk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIG5vdCBzdXJlIGlmIG5nT25Jbml0IGlzIGV4ZWN1dGVkIGFmdGVyIEBpbnB1dHNcclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIGNoZWNrIGlmIG91dHB1dCBmcm9hbGFJbml0IGlzIHByZXNlbnQuIE1heWJlIG9ic2VydmVycyBpcyBwcml2YXRlIGFuZCBzaG91bGQgbm90IGJlIHVzZWQ/PyBUT0RPIGhvdyB0byBiZXR0ZXIgdGVzdCB0aGF0IGFuIG91dHB1dCBkaXJlY3RpdmUgaXMgcHJlc2VudC5cclxuICAgIGlmICghdGhpcy5mcm9hbGFJbml0Lm9ic2VydmVycy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5jcmVhdGVFZGl0b3IoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2VuZXJhdGVNYW51YWxDb250cm9sbGVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuZGVzdHJveUVkaXRvcigpO1xyXG4gIH1cclxufVxyXG4iXX0=