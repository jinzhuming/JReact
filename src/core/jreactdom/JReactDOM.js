import { render } from '../render/render';

const JReactDOM = {
  render: (...parameter) => {
    const [vNode, container] = parameter;

    // 渲染之前清空子节点
    container.innerHTML = '';

    // 获取 dom插入节点
    const dom = render(vNode, container);
    return container.appendChild(dom);
  },
};

export default JReactDOM;
