webpackJsonp([2,5],{

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return REQUEST_FRAGMENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RECEIVE_FRAGMENT; });
var REQUEST_FRAGMENT = 'EDSR_REQUEST_FRAGMENT';
var RECEIVE_FRAGMENT = 'EDSR_RECEIVE_FRAGMENT';

var EDSentenceReducer = function EDSentenceReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        fragments: JSON.parse(document.getElementById('ed-preload-fragments').textContent),
        fragmentId: undefined,
        bookData: undefined,
        loading: false
    };
    var action = arguments[1];

    switch (action.type) {

        case REQUEST_FRAGMENT:
            return Object.assign({}, state, {
                fragmentId: action.fragmentId,
                loading: true
            });

        case RECEIVE_FRAGMENT:
            return Object.assign({}, state, {
                translationId: action.translationId,
                bookData: action.bookData,
                loading: false
            });

        default:
            return state;
    }
};

/* harmony default export */ __webpack_exports__["a"] = EDSentenceReducer;

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_redux_thunk__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reducers__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_fragment_explorer__ = __webpack_require__(198);








var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_5__reducers__["a" /* default */], undefined /* <- preloaded state */
, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_4_redux_thunk___default.a));

window.addEventListener('load', function () {
    __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2_react_redux__["Provider"],
        { store: store },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__components_fragment_explorer__["a" /* default */], null)
    ), document.getElementById('ed-fragment-navigator'));
});

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducers__ = __webpack_require__(107);
/* harmony export (immutable) */ __webpack_exports__["a"] = selectFragment;



function selectFragment(fragmentId, translationId) {
    return function (dispatch) {
        dispatch({
            type: __WEBPACK_IMPORTED_MODULE_1__reducers__["b" /* REQUEST_FRAGMENT */],
            fragmentId: fragmentId
        });

        var start = new Date().getTime();
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get(window.EDConfig.api('/book/translate/' + translationId)).then(function (resp) {
            // Enable the animation to play at least 800 milliseconds.
            var animationDelay = -Math.min(0, new Date().getTime() - start - 800);

            window.setTimeout(function () {
                dispatch({
                    type: __WEBPACK_IMPORTED_MODULE_1__reducers__["c" /* RECEIVE_FRAGMENT */],
                    bookData: resp.data,
                    translationId: translationId
                });
            }, animationDelay);
        });
    };
}

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fragment__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tengwar_fragment__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__search_components_book_gloss__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_html_to_react__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_html_to_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_html_to_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }










var EDFragmentExplorer = function (_React$Component) {
    _inherits(EDFragmentExplorer, _React$Component);

    function EDFragmentExplorer(props) {
        _classCallCheck(this, EDFragmentExplorer);

        var _this = _possibleConstructorReturn(this, (EDFragmentExplorer.__proto__ || Object.getPrototypeOf(EDFragmentExplorer)).call(this, props));

        _this.state = {
            fragmentIndex: 0
        };
        return _this;
    }

    /**
     * Component has mounted and initial state retrieved from the server should be applied.
     */


    _createClass(EDFragmentExplorer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var fragmentIndex = 0;
            // Does the shebang specify the fragment ID?
            if (/^#![0-9]+$/.test(window.location.hash)) {
                var fragmentId = parseInt(String(window.location.hash).substr(2), 10);
                if (fragmentId) {
                    fragmentIndex = Math.max(this.props.fragments.findIndex(function (f) {
                        return f.id === fragmentId;
                    }), 0);
                }
            }

            // A little hack for causing the first fragment to be highlighted
            this.onNavigate({}, fragmentIndex);
        }

        /**
         * Retrieves the fragment index for the next fragment, or returns the current fragment index
         * if none exists.
         */

    }, {
        key: 'nextFragmentIndex',
        value: function nextFragmentIndex() {
            for (var i = this.state.fragmentIndex + 1; i < this.props.fragments.length; i += 1) {
                var fragment = this.props.fragments[i];

                if (!fragment.interpunctuation) {
                    return i;
                }
            }

            return this.state.fragmentIndex;
        }

        /**
         * Retrieves the fragment index for the previous fragment, or returns the current fragment index
         * if none exists.
         */

    }, {
        key: 'previousFragmentIndex',
        value: function previousFragmentIndex() {
            for (var i = this.state.fragmentIndex - 1; i > -1; i -= 1) {
                var fragment = this.props.fragments[i];

                if (!fragment.interpunctuation) {
                    return i;
                }
            }

            return this.state.fragmentIndex;
        }

        /**
         * Event handler for the onFragmentClick event.
         * 
         * @param {*} ev 
         */

    }, {
        key: 'onFragmentClick',
        value: function onFragmentClick(ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }

            var fragmentIndex = this.props.fragments.findIndex(function (f) {
                return f.id === ev.id;
            });
            if (fragmentIndex === -1) {
                return;
            }

            this.setState({
                fragmentIndex: fragmentIndex
            });
            window.location.hash = '!' + ev.id;

            this.props.dispatch(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__actions__["a" /* selectFragment */])(ev.id, ev.translationId));
        }

        /**
         * Navigates to the specified fragment index by receiving it from the array of fragments, and
         * dispatching a select fragment signal.
         * 
         * @param {*} ev 
         * @param {*} fragmentIndex 
         */

    }, {
        key: 'onNavigate',
        value: function onNavigate(ev, fragmentIndex) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }

            var fragment = this.props.fragments[fragmentIndex];
            this.onFragmentClick({
                id: fragment.id,
                translationId: fragment.translationId
            });
        }

        /**
         * Dispatches a window message to the search result component, requesting a search.
         * @param {*} data 
         */

    }, {
        key: 'onReferenceLinkClick',
        value: function onReferenceLinkClick(data) {
            window.EDConfig.message(window.EDConfig.messageNavigateName, data);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var section = null;
            var fragment = null;
            var parser = null;

            if (!this.props.loading && this.props.bookData && this.props.bookData.sections.length > 0) {
                // Comments may contain HTML because it's parsed by the server as markdown. The HtmlToReact parser will
                // examine the HTML and turn it into React components.
                section = this.props.bookData.sections[0];
                fragment = this.props.fragments.find(function (f) {
                    return f.id === _this2.props.fragmentId;
                });
                parser = new __WEBPACK_IMPORTED_MODULE_7_html_to_react__["Parser"]();
            }

            var previousIndex = this.previousFragmentIndex();
            var nextIndex = this.nextFragmentIndex();

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'well ed-fragment-navigator' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'p',
                    { className: 'tengwar ed-tengwar-fragments' },
                    this.props.fragments.map(function (f) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__tengwar_fragment__["a" /* default */], { fragment: f,
                            key: 'tng' + f.id,
                            selected: f.id === _this2.props.fragmentId });
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'p',
                    { className: 'ed-elvish-fragments' },
                    this.props.fragments.map(function (f) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__fragment__["a" /* default */], { fragment: f,
                            key: 'frg' + f.id,
                            selected: f.id === _this2.props.fragmentId,
                            onClick: _this2.onFragmentClick.bind(_this2) });
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'nav',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'ul',
                        { className: 'pager' },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'li',
                            { className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()('previous', { 'hidden': previousIndex === this.state.fragmentIndex }) },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                'a',
                                { href: '#', onClick: function onClick(ev) {
                                        return _this2.onNavigate(ev, previousIndex);
                                    } },
                                '\u2190 ',
                                this.props.fragments[previousIndex].fragment
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'li',
                            { className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()('next', { 'hidden': nextIndex === this.state.fragmentIndex }) },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                'a',
                                { href: '#', onClick: function onClick(ev) {
                                        return _this2.onNavigate(ev, nextIndex);
                                    } },
                                this.props.fragments[nextIndex].fragment,
                                ' \u2192'
                            )
                        )
                    )
                ),
                this.props.loading ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'sk-spinner sk-spinner-pulse' }) : section ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    null,
                    fragment.grammarType ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'div',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'em',
                            null,
                            fragment.grammarType
                        )
                    ) : '',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'div',
                        null,
                        fragment.comments ? parser.parse(fragment.comments) : ''
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('hr', null),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'div',
                        null,
                        section.glosses.map(function (g) {
                            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__search_components_book_gloss__["a" /* default */], { gloss: g,
                                language: section.language,
                                key: g.TranslationID,
                                onReferenceLinkClick: _this2.onReferenceLinkClick.bind(_this2) });
                        })
                    )
                ) : ''
            );
        }
    }]);

    return EDFragmentExplorer;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

var mapStateToProps = function mapStateToProps(state) {
    return {
        fragments: state.fragments,
        fragmentId: state.fragmentId,
        bookData: state.bookData,
        loading: state.loading
    };
};

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(mapStateToProps)(EDFragmentExplorer);

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var EDFragment = function (_React$Component) {
    _inherits(EDFragment, _React$Component);

    function EDFragment() {
        _classCallCheck(this, EDFragment);

        return _possibleConstructorReturn(this, (EDFragment.__proto__ || Object.getPrototypeOf(EDFragment)).apply(this, arguments));
    }

    _createClass(EDFragment, [{
        key: 'onFragmentClick',
        value: function onFragmentClick(ev) {
            ev.preventDefault();

            if (this.props.onClick) {
                this.props.onClick({
                    id: this.props.fragment.id,
                    url: ev.target.href,
                    translationId: this.props.fragment.translationId
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var f = this.props.fragment;

            if (f.interpunctuation) {
                return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'span',
                    null,
                    f.fragment
                );
            }

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'span',
                null,
                ' ',
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'a',
                    { className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()({ 'active': this.props.selected }),
                        href: '/wt/' + f.translationId,
                        onClick: this.onFragmentClick.bind(this) },
                    f.fragment
                )
            );
        }
    }]);

    return EDFragment;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = EDFragment;

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var EDTengwarFragment = function (_React$Component) {
    _inherits(EDTengwarFragment, _React$Component);

    function EDTengwarFragment() {
        _classCallCheck(this, EDTengwarFragment);

        return _possibleConstructorReturn(this, (EDTengwarFragment.__proto__ || Object.getPrototypeOf(EDTengwarFragment)).apply(this, arguments));
    }

    _createClass(EDTengwarFragment, [{
        key: 'render',
        value: function render() {
            var f = this.props.fragment;

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'span',
                { className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()({ 'active': this.props.selected }) },
                (f.interpunctuation ? '' : ' ') + f.tengwar
            );
        }
    }]);

    return EDTengwarFragment;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = EDTengwarFragment;

/***/ }),

/***/ 426:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(173);


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

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_html_to_react__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_html_to_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_html_to_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





/**
 * Represents a single gloss. A gloss is also called a 'translation' and is reserved for invented languages.
 */

var EDBookGloss = function (_React$Component) {
    _inherits(EDBookGloss, _React$Component);

    function EDBookGloss() {
        _classCallCheck(this, EDBookGloss);

        return _possibleConstructorReturn(this, (EDBookGloss.__proto__ || Object.getPrototypeOf(EDBookGloss)).apply(this, arguments));
    }

    _createClass(EDBookGloss, [{
        key: 'processHtml',
        value: function processHtml(html) {
            var _this2 = this;

            var definitions = new __WEBPACK_IMPORTED_MODULE_2_html_to_react__["ProcessNodeDefinitions"](__WEBPACK_IMPORTED_MODULE_0_react___default.a);
            var instructions = [
            // Special behaviour for <a> as they are reference links.
            {
                shouldProcessNode: function shouldProcessNode(node) {
                    return node.name === 'a';
                },
                processNode: function processNode(node, children) {
                    var nodeElements = definitions.processDefaultNode(node, children);
                    if (node.attribs.class !== 'ed-word-reference') {
                        return nodeElements;
                    }

                    // Replace reference links with a link that is aware of
                    // the component, and can intercept click attempts.
                    var href = node.attribs.href;
                    var title = node.attribs.title;
                    var word = node.attribs['data-word'];
                    var childElements = nodeElements.props.children;

                    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: href,
                            onClick: function onClick(ev) {
                                return _this2.onReferenceLinkClick(ev, word);
                            },
                            title: title },
                        childElements
                    );
                }
            },
            // Default behaviour for all else.
            {
                shouldProcessNode: function shouldProcessNode(node) {
                    return true;
                },
                processNode: definitions.processDefaultNode
            }];

            var parser = new __WEBPACK_IMPORTED_MODULE_2_html_to_react__["Parser"]();
            return parser.parseWithInstructions(html, function (n) {
                return true;
            }, instructions);
        }
    }, {
        key: 'onReferenceLinkClick',
        value: function onReferenceLinkClick(ev, word) {
            ev.preventDefault();

            if (this.props.onReferenceLinkClick) {
                this.props.onReferenceLinkClick({
                    word: word
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var gloss = this.props.gloss;
            var id = 'translation-block-' + gloss.id;

            var comments = null;
            if (gloss.comments) {
                comments = this.processHtml(gloss.comments);
            }

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'blockquote',
                { itemScope: 'itemscope', itemType: 'http://schema.org/Article', id: id, className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()({ 'contribution': !gloss.is_canon }) },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'h3',
                    { rel: 'trans-word', className: 'trans-word' },
                    !gloss.is_canon || gloss.is_uncertain || !gloss.is_latest ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '/about', title: 'Unverified or debatable content.' },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'glyphicon glyphicon-question-sign' })
                    ) : '',
                    ' ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { itemProp: 'headline' },
                        gloss.word
                    ),
                    gloss.external_link_format && gloss.external_id ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: gloss.external_link_format.replace(/\{ExternalID\}/g, gloss.external_id),
                            className: 'ed-external-link-button',
                            title: 'Open on ' + gloss.translation_group_name + ' (new tab/window)',
                            target: '_blank' },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { className: 'glyphicon glyphicon-globe pull-right' })
                    ) : ''
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'p',
                    null,
                    gloss.tengwar ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { className: 'tengwar' },
                        gloss.tengwar
                    ) : '',
                    ' ',
                    gloss.type != 'unset' ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { className: 'word-type', rel: 'trans-type' },
                        gloss.type,
                        '.'
                    ) : '',
                    ' ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { rel: 'trans-translation', itemProp: 'keywords' },
                        gloss.translation
                    )
                ),
                comments,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'footer',
                    null,
                    gloss.source ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { className: 'word-source', rel: 'trans-source' },
                        '[',
                        gloss.source,
                        ']'
                    ) : '',
                    ' ',
                    gloss.Etymology ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { className: 'word-etymology', rel: 'trans-etymology' },
                        gloss.etymology,
                        '.'
                    ) : '',
                    ' ',
                    gloss.translation_group_id ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        null,
                        'Group: ',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'span',
                            { itemProp: 'sourceOrganization' },
                            gloss.translation_group_name,
                            '.'
                        )
                    ) : '',
                    ' Published: ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { itemProp: 'datePublished' },
                        gloss.created_at
                    ),
                    ' by ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: gloss.account_url, itemProp: 'author', rel: 'author', title: 'View profile for ' + gloss.account_name + '.' },
                        gloss.account_name
                    )
                )
            );
        }
    }]);

    return EDBookGloss;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = EDBookGloss;

/***/ })

},[426]);