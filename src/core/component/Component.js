import { renderComponent } from '../render/render';

export default class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    Object.assign(this.state, stateChange);
    renderComponent(this);
  }
}
