(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('angular-froala-wysiwyg', ['exports', '@angular/core', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['angular-froala-wysiwyg'] = {}, global.ng.core, global.ng.forms));
}(this, (function (exports, core, forms) { 'use strict';

    var FroalaEditorDirective = /** @class */ (function () {
        function FroalaEditorDirective(el, zone) {
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
            this.onChange = function (_) { };
            this.onTouched = function () { };
            // froalaModel directive as output: update model if editor contentChanged
            this.froalaModelChange = new core.EventEmitter();
            // froalaInit directive as output: send manual editor initialization
            this.froalaInit = new core.EventEmitter();
            var element = el.nativeElement;
            // check if the element is a special tag
            if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) != -1) {
                this._hasSpecialTag = true;
            }
            // jquery wrap and store element
            this._$element = $(element);
            this.zone = zone;
        }
        // Form model content changed.
        FroalaEditorDirective.prototype.writeValue = function (content) {
            this.updateEditor(content);
        };
        FroalaEditorDirective.prototype.registerOnChange = function (fn) { this.onChange = fn; };
        FroalaEditorDirective.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
        Object.defineProperty(FroalaEditorDirective.prototype, "froalaEditor", {
            // End ControlValueAccesor methods.
            // froalaEditor directive as input: store the editor options
            set: function (opts) {
                this._opts = opts || this._opts;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FroalaEditorDirective.prototype, "froalaModel", {
            // froalaModel directive as input: store initial editor content
            set: function (content) {
                this.updateEditor(content);
            },
            enumerable: false,
            configurable: true
        });
        // Update editor with model contents.
        FroalaEditorDirective.prototype.updateEditor = function (content) {
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
        };
        // update model if editor contentChanged
        FroalaEditorDirective.prototype.updateModel = function () {
            var _this = this;
            this.zone.run(function () {
                var modelContent = null;
                if (_this._hasSpecialTag) {
                    var attributeNodes = _this._$element[0].attributes;
                    var attrs = {};
                    for (var i = 0; i < attributeNodes.length; i++) {
                        var attrName = attributeNodes[i].name;
                        if (_this._opts.angularIgnoreAttrs && _this._opts.angularIgnoreAttrs.indexOf(attrName) != -1) {
                            continue;
                        }
                        attrs[attrName] = attributeNodes[i].value;
                    }
                    if (_this._$element[0].innerHTML) {
                        attrs[_this.INNER_HTML_ATTR] = _this._$element[0].innerHTML;
                    }
                    modelContent = attrs;
                }
                else {
                    var returnedHtml = _this._$element.froalaEditor('html.get');
                    if (typeof returnedHtml === 'string') {
                        modelContent = returnedHtml;
                    }
                }
                if (_this._oldModel !== modelContent) {
                    _this._oldModel = modelContent;
                    // Update froalaModel.
                    _this.froalaModelChange.emit(modelContent);
                    // Update form model.
                    _this.onChange(modelContent);
                }
            });
        };
        // register event on jquery element
        FroalaEditorDirective.prototype.registerEvent = function (element, eventName, callback) {
            if (!element || !eventName || !callback) {
                return;
            }
            this._listeningEvents.push(eventName);
            element.on(eventName, callback);
        };
        FroalaEditorDirective.prototype.initListeners = function () {
            var self = this;
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
        };
        // register events from editor options
        FroalaEditorDirective.prototype.registerFroalaEvents = function () {
            if (!this._opts.events) {
                return;
            }
            for (var eventName in this._opts.events) {
                if (this._opts.events.hasOwnProperty(eventName)) {
                    this.registerEvent(this._$element, eventName, this._opts.events[eventName]);
                }
            }
        };
        FroalaEditorDirective.prototype.createEditor = function () {
            var _this = this;
            if (this._editorInitialized) {
                return;
            }
            this.setContent(true);
            // Registering events before initializing the editor will bind the initialized event correctly.
            this.registerFroalaEvents();
            this.initListeners();
            // init editor
            this.zone.runOutsideAngular(function () {
                _this._$element.on('froalaEditor.initialized', function () {
                    _this._editorInitialized = true;
                });
                _this._editor = _this._$element.froalaEditor(_this._opts).data('froala.editor').$el;
            });
        };
        FroalaEditorDirective.prototype.setHtml = function () {
            this._$element.froalaEditor('html.set', this._model || '', true);
            // This will reset the undo stack everytime the model changes externally. Can we fix this?
            this._$element.froalaEditor('undo.reset');
            this._$element.froalaEditor('undo.saveStep');
        };
        FroalaEditorDirective.prototype.setContent = function (firstTime) {
            if (firstTime === void 0) { firstTime = false; }
            var self = this;
            // Set initial content
            if (this._model || this._model == '') {
                this._oldModel = this._model;
                if (this._hasSpecialTag) {
                    var tags = this._model;
                    // add tags on element
                    if (tags) {
                        for (var attr in tags) {
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
        };
        FroalaEditorDirective.prototype.destroyEditor = function () {
            if (this._editorInitialized) {
                this._$element.off(this._listeningEvents.join(" "));
                this._editor.off('keyup');
                this._$element.froalaEditor('destroy');
                this._listeningEvents.length = 0;
                this._editorInitialized = false;
            }
        };
        FroalaEditorDirective.prototype.getEditor = function () {
            if (this._$element) {
                return this._$element.froalaEditor.bind(this._$element);
            }
            return null;
        };
        // send manual editor initialization
        FroalaEditorDirective.prototype.generateManualController = function () {
            var self = this;
            var controls = {
                initialize: this.createEditor.bind(this),
                destroy: this.destroyEditor.bind(this),
                getEditor: this.getEditor.bind(this),
            };
            this.froalaInit.emit(controls);
        };
        // TODO not sure if ngOnInit is executed after @inputs
        FroalaEditorDirective.prototype.ngOnInit = function () {
            // check if output froalaInit is present. Maybe observers is private and should not be used?? TODO how to better test that an output directive is present.
            if (!this.froalaInit.observers.length) {
                this.createEditor();
            }
            else {
                this.generateManualController();
            }
        };
        FroalaEditorDirective.prototype.ngOnDestroy = function () {
            this.destroyEditor();
        };
        return FroalaEditorDirective;
    }());
    FroalaEditorDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[froalaEditor]',
                    exportAs: 'froalaEditor',
                    providers: [{
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return FroalaEditorDirective; }),
                            multi: true
                        }]
                },] }
    ];
    /** @nocollapse */
    FroalaEditorDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.NgZone }
    ]; };
    FroalaEditorDirective.propDecorators = {
        froalaEditor: [{ type: core.Input }],
        froalaModel: [{ type: core.Input }],
        froalaModelChange: [{ type: core.Output }],
        froalaInit: [{ type: core.Output }]
    };

    var FroalaEditorModule = /** @class */ (function () {
        function FroalaEditorModule() {
        }
        FroalaEditorModule.forRoot = function () {
            return { ngModule: FroalaEditorModule, providers: [] };
        };
        return FroalaEditorModule;
    }());
    FroalaEditorModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [FroalaEditorDirective],
                    exports: [FroalaEditorDirective],
                },] }
    ];

    var FroalaViewDirective = /** @class */ (function () {
        function FroalaViewDirective(renderer, element) {
            this.renderer = renderer;
            this._element = element.nativeElement;
        }
        Object.defineProperty(FroalaViewDirective.prototype, "froalaView", {
            // update content model as it comes
            set: function (content) {
                this._element.innerHTML = content;
            },
            enumerable: false,
            configurable: true
        });
        FroalaViewDirective.prototype.ngAfterViewInit = function () {
            this.renderer.addClass(this._element, "fr-view");
        };
        return FroalaViewDirective;
    }());
    FroalaViewDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[froalaView]'
                },] }
    ];
    /** @nocollapse */
    FroalaViewDirective.ctorParameters = function () { return [
        { type: core.Renderer2 },
        { type: core.ElementRef }
    ]; };
    FroalaViewDirective.propDecorators = {
        froalaView: [{ type: core.Input }]
    };

    var FroalaViewModule = /** @class */ (function () {
        function FroalaViewModule() {
        }
        FroalaViewModule.forRoot = function () {
            return { ngModule: FroalaViewModule, providers: [] };
        };
        return FroalaViewModule;
    }());
    FroalaViewModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [FroalaViewDirective],
                    exports: [FroalaViewDirective],
                },] }
    ];

    var MODULES = [
        FroalaEditorModule,
        FroalaViewModule
    ];
    var FERootModule = /** @class */ (function () {
        function FERootModule() {
        }
        return FERootModule;
    }());
    FERootModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        FroalaEditorModule.forRoot(),
                        FroalaViewModule.forRoot()
                    ],
                    exports: MODULES
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.FERootModule = FERootModule;
    exports.FroalaEditorDirective = FroalaEditorDirective;
    exports.FroalaEditorModule = FroalaEditorModule;
    exports.FroalaViewDirective = FroalaViewDirective;
    exports.FroalaViewModule = FroalaViewModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-froala-wysiwyg.umd.js.map