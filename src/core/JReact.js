import Component from './component/Component';

const JReact = {
  h(tag, attrs, ...children) {
    return {
      tag,
      attrs,
      children,
    };
  },

  Component,
};

export default JReact;
