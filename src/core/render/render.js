import setComponentProps from '../component/setComponentProps';
import createComponent from '../component/createComponent';

export function setAttribute(parameterDom, parameterKey, value) {
  let key = parameterKey;
  const dom = parameterDom;

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
    if (typeof value === 'object') {
      Object.keys(value).forEach((k) => {
        // react 允许省略 px
        dom.style[k] = typeof value[k] === 'number' ? `${value[key]}px` : value[key];
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

export function renderDOM(vNode) {
  // vNode 类型为字符串或者数字，直接生成文本节点
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(vNode);
  }

  // 如果是组件(function)
  if (typeof vNode.tag === 'function') {
    // 创建 component
    let component = createComponent(vNode.tag, vNode.attrs);
    // 设置 props
    component = setComponentProps(component, vNode.attrs);
    // 交由组件渲染函数去执行渲染
    const dom = renderComponent(component);
    return dom;
  }

  const dom = document.createElement(vNode.tag);
  if (vNode.attrs) {
    // attr 处理
    Object.keys(vNode.attrs).forEach((key) => {
      // 详细处理 attr(事件、style)
      setAttribute(dom, key, vNode.attrs[key]);
    });
  }

  vNode.children.forEach(child => render(child, dom)); // 递归渲染子节点

  return dom; // 将渲染结果挂载到真正的DOM上
}

export function renderComponent(...parameter) {
  const [component] = parameter;
  // 获取组件 render
  const renderer = component.render();

  // 把组件的 render 生成对应的 dom
  const baseDom = renderDOM(renderer);

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

export function render(vnode, container) {
  return container.appendChild(renderDOM(vnode));
}
