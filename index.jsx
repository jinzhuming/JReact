import JReact from './src/core/JReact'
import JReactDOM from './src/core/jreactdom/JReactDOM'

class Welcome extends JReact.Component {
  render() {
    return (<h1> Hello, {
      this.props.name
    } </h1>);
  }
}

class Counter extends JReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  componentWillUpdate() {
    console.log('update');
  }

  componentWillMount() {
    console.log('mount');
  }

  onClick() {
    this.setState({
      num: this.state.num + 1
    });
  }

  render() {
    return (
      <div>
        <h1>count: {this.state.num}</h1>
        <button onClick={() => this.onClick()}>add</button>
      </div>
    );
  }
}

class App extends JReact.Component {
  render() {
    return (
      <div>
      <Welcome name = "Sara"/>
      <Welcome name = "Cahal" />
      <Welcome name = "Edite" />
      <Counter />
      </div>
    );
  }
}

JReactDOM.render( <App/> ,
  document.getElementById('root')
);
