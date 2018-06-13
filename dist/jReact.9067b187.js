// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({86:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setComponentProps;
// 设置 props
function setComponentProps() {
  for (var _len = arguments.length, parameter = Array(_len), _key = 0; _key < _len; _key++) {
    parameter[_key] = arguments[_key];
  }

  var component = parameter[0],
      props = parameter[1];

  // 生命周期，只执行一次（有 baseDom，则代表已经渲染过，不执行）

  if (!component.baseDom) {
    if (component.componentWillMount) {
      component.componentWillMount();
    }
    return component;
  }

  if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;
  return component;
}
},{}],87:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createComponent;
// 创建组件
function createComponent() {
  for (var _len = arguments.length, parameter = Array(_len), _key = 0; _key < _len; _key++) {
    parameter[_key] = arguments[_key];
  }

  var Component = parameter[0],
      props = parameter[1];

  // 如果是类组件（存在 render）

  var component = new Component(props);
  if (Component.prototype && Component.prototype.render) {
    return component;
  }

  // 如果是函数组件，添加上 constructor 和 render
  component.constructor = Component;
  component.render = function render() {
    return this.constructor(props);
  };

  return component;
}
},{}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setAttribute = setAttribute;
exports.renderDOM = renderDOM;
exports.renderComponent = renderComponent;
exports.render = render;

var _setComponentProps = require('../component/setComponentProps');

var _setComponentProps2 = _interopRequireDefault(_setComponentProps);

var _createComponent = require('../component/createComponent');

var _createComponent2 = _interopRequireDefault(_createComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setAttribute(parameterDom, parameterKey, value) {
  var key = parameterKey;
  var dom = parameterDom;

  // react class 写法为 className，需要替换
  if (key === 'className') {
    key = 'class';
    dom[key] = value || '';
    return;
  }

  // 如果是on开头的事件绑定
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
    return;
  }

  // 如果属性名是style
  if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
      return;
    }

    // 如果设置的 style 是个对象，便利补全 style
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      Object.keys(value).forEach(function (k) {
        // react 允许省略 px
        dom.style[k] = typeof value[k] === 'number' ? value[key] + 'px' : value[key];
      });
    }

    return;
  }

  if (value) {
    dom.setAttribute(key, value);
  } else {
    dom.removeAttribute(key, value);
  }
}

function renderDOM(vNode) {
  // vNode 类型为字符串或者数字，直接生成文本节点
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(vNode);
  }

  // 如果是组件(function)
  if (typeof vNode.tag === 'function') {
    // 创建 component
    var component = (0, _createComponent2.default)(vNode.tag, vNode.attrs);
    // 设置 props
    component = (0, _setComponentProps2.default)(component, vNode.attrs);
    // 交由组件渲染函数去执行渲染
    var _dom = renderComponent(component);
    return _dom;
  }

  var dom = document.createElement(vNode.tag);
  if (vNode.attrs) {
    // attr 处理
    Object.keys(vNode.attrs).forEach(function (key) {
      // 详细处理 attr(事件、style)
      setAttribute(dom, key, vNode.attrs[key]);
    });
  }

  vNode.children.forEach(function (child) {
    return render(child, dom);
  }); // 递归渲染子节点

  return dom; // 将渲染结果挂载到真正的DOM上
}

function renderComponent() {
  for (var _len = arguments.length, parameter = Array(_len), _key = 0; _key < _len; _key++) {
    parameter[_key] = arguments[_key];
  }

  var component = parameter[0];
  // 获取组件 render

  var renderer = component.render();

  // 把组件的 render 生成对应的 dom
  var baseDom = renderDOM(renderer);

  // 通过 basedom 判断是初始化还是更新
  if (component.baseDom) {
    // 一部分周期生命周期初始化时不会执行
    if (component.componentWillUpdate) {
      component.componentWillUpdate();
    }

    // 同上
    if (component.componentDidUpdate) {
      component.componentDidUpdate();
    }

    // 通过初始化时添加的标记判断有没有父节点，有就替换掉父节点里旧节点信息
    if (component.baseDom.parentNode) {
      component.baseDom.parentNode.replaceChild(baseDom, component.baseDom);
    }
  } else if (component.componentDidMount) {
    // 只有初始化时才执行
    component.componentDidMount();
  }

  // 组件加入 basedom 标记，这样下次更新才能找到这个节点
  component.baseDom = baseDom;

  // basedom 加入组件标记
  baseDom.component = component;

  return baseDom;
}

function render(vnode, container) {
  return container.appendChild(renderDOM(vnode));
}
},{"../component/setComponentProps":86,"../component/createComponent":87}],5:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _render = require('../render/render');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.state = {};
    this.props = props;
  }

  _createClass(Component, [{
    key: 'setState',
    value: function setState(stateChange) {
      Object.assign(this.state, stateChange);
      (0, _render.renderComponent)(this);
    }
  }]);

  return Component;
}();

exports.default = Component;
},{"../render/render":6}],3:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Component = require('./component/Component');

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JReact = {
  h: function h(tag, attrs) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return {
      tag: tag,
      attrs: attrs,
      children: children
    };
  },


  Component: _Component2.default
};

exports.default = JReact;
},{"./component/Component":5}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _render2 = require('../render/render');

var JReactDOM = {
  render: function render() {
    for (var _len = arguments.length, parameter = Array(_len), _key = 0; _key < _len; _key++) {
      parameter[_key] = arguments[_key];
    }

    var vNode = parameter[0],
        container = parameter[1];

    // 渲染之前清空子节点

    container.innerHTML = '';

    // 获取 dom插入节点
    var dom = (0, _render2.render)(vNode, container);
    return container.appendChild(dom);
  }
};

exports.default = JReactDOM;
},{"../render/render":6}],2:[function(require,module,exports) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JReact = require('./src/core/JReact');

var _JReact2 = _interopRequireDefault(_JReact);

var _JReactDOM = require('./src/core/jreactdom/JReactDOM');

var _JReactDOM2 = _interopRequireDefault(_JReactDOM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Welcome = function (_JReact$Component) {
  _inherits(Welcome, _JReact$Component);

  function Welcome() {
    _classCallCheck(this, Welcome);

    return _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).apply(this, arguments));
  }

  _createClass(Welcome, [{
    key: 'render',
    value: function render() {
      return _JReact2.default.h(
        'h1',
        null,
        ' Hello, ',
        this.props.name,
        ' '
      );
    }
  }]);

  return Welcome;
}(_JReact2.default.Component);

var Counter = function (_JReact$Component2) {
  _inherits(Counter, _JReact$Component2);

  function Counter(props) {
    _classCallCheck(this, Counter);

    var _this2 = _possibleConstructorReturn(this, (Counter.__proto__ || Object.getPrototypeOf(Counter)).call(this, props));

    _this2.state = {
      num: 0
    };
    return _this2;
  }

  _createClass(Counter, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      console.log('update');
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      console.log('mount');
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _JReact2.default.h(
        'div',
        null,
        _JReact2.default.h(
          'h1',
          null,
          'count: ',
          this.state.num
        ),
        _JReact2.default.h(
          'button',
          { onClick: function onClick() {
              return _this3.onClick();
            } },
          'add'
        )
      );
    }
  }]);

  return Counter;
}(_JReact2.default.Component);

var App = function (_JReact$Component3) {
  _inherits(App, _JReact$Component3);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return _JReact2.default.h(
        'div',
        null,
        _JReact2.default.h(Welcome, { name: 'Sara' }),
        _JReact2.default.h(Welcome, { name: 'Cahal' }),
        _JReact2.default.h(Welcome, { name: 'Edite' }),
        _JReact2.default.h(Counter, null)
      );
    }
  }]);

  return App;
}(_JReact2.default.Component);

_JReactDOM2.default.render(_JReact2.default.h(App, null), document.getElementById('root'));
},{"./src/core/JReact":3,"./src/core/jreactdom/JReactDOM":4}],118:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '57519' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[118,2], null)
//# sourceMappingURL=/jReact.9067b187.map