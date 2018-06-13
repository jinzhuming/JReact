// 设置 props
export default function setComponentProps(...parameter) {
  const [component, props] = parameter;

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
