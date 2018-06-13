// 创建组件
export default function createComponent(...parameter) {
  const [Component, props] = parameter;

  // 如果是类组件（存在 render）
  const component = new Component(props);
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
