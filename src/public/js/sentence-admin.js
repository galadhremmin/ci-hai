webpackJsonp([3,5],{

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_redux__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_redux_thunk__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__reducers_admin__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_sentence_form__ = __webpack_require__(200);









var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_6__reducers_admin__["a" /* default */], undefined /* <- preloaded state */
, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_5_redux_thunk___default.a));

window.addEventListener('load', function () {
    __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_3_react_redux__["Provider"],
        { store: store },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2_react_router_dom__["BrowserRouter"],
            null,
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], { path: '/', component: __WEBPACK_IMPORTED_MODULE_7__components_sentence_form__["a" /* default */] })
        )
    ), document.getElementById('ed-sentence-form'));
});

/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_html_to_react__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_html_to_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_html_to_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var MDMarkdownEditTab = 0;
var MDMarkdownPreviewTab = 1;

var EDMarkdownEditor = function (_React$Component) {
    _inherits(EDMarkdownEditor, _React$Component);

    function EDMarkdownEditor(props) {
        _classCallCheck(this, EDMarkdownEditor);

        var _this = _possibleConstructorReturn(this, (EDMarkdownEditor.__proto__ || Object.getPrototypeOf(EDMarkdownEditor)).call(this, props));

        _this.state = {
            value: _this.props.value || '',
            currentTab: MDMarkdownEditTab
        };
        return _this;
    }

    _createClass(EDMarkdownEditor, [{
        key: 'applyHtml',
        value: function applyHtml(resp) {
            this.setState({
                html: resp.data.html
            });
        }
    }, {
        key: 'onOpenTab',
        value: function onOpenTab(ev, tab) {
            ev.preventDefault();

            // Is the tab currently opened?
            if (this.state.currentTab === tab) {
                return;
            }

            this.setState({
                html: null,
                currentTab: tab
            });

            // Let the server render the Markdown code
            if (tab === MDMarkdownPreviewTab && !/^\s*$/.test(this.state.value)) {
                __WEBPACK_IMPORTED_MODULE_1_axios___default.a.post(window.EDConfig.api('/utility/markdown'), { markdown: this.state.value }).then(this.applyHtml.bind(this));
            }
        }
    }, {
        key: 'onValueChange',
        value: function onValueChange(ev) {
            this.setState({
                value: ev.target.value
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var html = null;

            if (this.state.currentTab === MDMarkdownPreviewTab && this.state.html) {
                var parser = new __WEBPACK_IMPORTED_MODULE_3_html_to_react__["Parser"]();
                html = parser.parse(this.state.html);
            }

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                null,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'ul',
                    { className: 'nav nav-tabs' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'li',
                        { role: 'presentation',
                            className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()({ 'active': this.state.currentTab === MDMarkdownEditTab }) },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'a',
                            { href: '#', onClick: function onClick(e) {
                                    return _this2.onOpenTab(e, MDMarkdownEditTab);
                                } },
                            'Edit'
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'li',
                        { role: 'presentation',
                            className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()({
                                'active': this.state.currentTab === MDMarkdownPreviewTab,
                                'disabled': !this.state.value
                            }) },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'a',
                            { href: '#', onClick: function onClick(e) {
                                    return _this2.onOpenTab(e, MDMarkdownPreviewTab);
                                } },
                            'Preview'
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()({ 'hidden': this.state.currentTab !== MDMarkdownEditTab }) },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('textarea', { className: 'form-control',
                        name: this.props.componentName,
                        id: this.props.componentId,
                        rows: this.props.rows,
                        value: this.state.value,
                        onChange: this.onValueChange.bind(this) }),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'small',
                        { className: 'pull-right' },
                        ' Supports Markdown. ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'a',
                            { href: 'https://en.wikipedia.org/wiki/Markdown', target: '_blank' },
                            'Read more (opens a new window)'
                        ),
                        '.'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()({ 'hidden': this.state.currentTab !== MDMarkdownPreviewTab }) },
                    html ? html : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'p',
                        null,
                        'Interpreting ...'
                    )
                )
            );
        }
    }]);

    return EDMarkdownEditor;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

EDMarkdownEditor.defaultProps = {
    rows: 15,
    componentName: 'markdownBody'
};

/* harmony default export */ __webpack_exports__["a"] = EDMarkdownEditor;

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_components_markdown_editor__ = __webpack_require__(192);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var EDSentenceForm = function (_React$Component) {
    _inherits(EDSentenceForm, _React$Component);

    function EDSentenceForm() {
        _classCallCheck(this, EDSentenceForm);

        return _possibleConstructorReturn(this, (EDSentenceForm.__proto__ || Object.getPrototypeOf(EDSentenceForm)).apply(this, arguments));
    }

    _createClass(EDSentenceForm, [{
        key: 'onSubmit',
        value: function onSubmit() {}
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'form',
                { onSubmit: this.onSubmit.bind(this) },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'label',
                        { htmlFor: 'ed-sentence-name', className: 'control-label' },
                        'Name'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'text', className: 'form-control', id: 'ed-sentence-name', name: 'name' })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'label',
                        { htmlFor: 'ed-sentence-source', className: 'control-label' },
                        'Source'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'text', className: 'form-control', id: 'ed-sentence-source', name: 'source' })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'label',
                        { htmlFor: 'ed-sentence-language', className: 'control-label' },
                        'Language'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'select',
                        { className: 'form-control', id: 'ed-sentence-language' },
                        this.props.languages.filter(function (l) {
                            return l.is_invented;
                        }).map(function (l) {
                            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                'option',
                                { value: l.id, key: l.id },
                                l.name
                            );
                        })
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'label',
                        { htmlFor: 'ed-sentence-description', className: 'control-label' },
                        'Summary'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('textarea', { id: 'ed-sentence-description', className: 'form-control', name: 'description' })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'form-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'label',
                        { htmlFor: 'ed-sentence-long-description', className: 'control-label' },
                        'Description'
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__shared_components_markdown_editor__["a" /* default */], { componentId: 'ed-sentence-long-description', componentName: 'long-description' })
                )
            );
        }
    }]);

    return EDSentenceForm;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

var mapStateToProps = function mapStateToProps(state) {
    return {
        languages: state.languages
    };
};

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(mapStateToProps)(EDSentenceForm);

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SET_FRAGMENTS */
/* unused harmony export SET_FRAGMENT_DATA */
var SET_FRAGMENTS = 'ED_SET_FRAGMENTS';
var SET_FRAGMENT_DATA = 'ED_SET_FRAGMENT_DATA';

var EDSentenceAdminReducer = function EDSentenceAdminReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        fragments: [],
        languages: window.EDConfig.languages()
    };
    var action = arguments[1];

    switch (action.type) {
        case SET_FRAGMENTS:

            break;
        case SET_FRAGMENT_DATA:

            break;
        default:
            return state;
    }
};

/* harmony default export */ __webpack_exports__["a"] = EDSentenceAdminReducer;

/***/ }),

/***/ 425:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(172);


/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;

/***/ })

},[425]);