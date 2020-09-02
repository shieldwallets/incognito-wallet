import { Component } from 'react';
import { AppState } from 'react-native';

export const TAG = 'BaseComponent';

const callIfBackToThisRoute = (props, call) => {
  if (!props.navigation) {
    return undefined;
  }
  const thisRoute = props.navigation.state.routeName;
  const listener = props.navigation.addListener('willFocus', payload => {
    if (payload.state.routeName === thisRoute) call(props);
  });
  return listener;
};

class BaseComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.subs = [];
    this.appState = AppState.currentState;
  }

  componentDidMount() {
    this.subs = [callIfBackToThisRoute(this.props, props => this.onResume())];

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.subs?.forEach(sub => sub?.remove());
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  onResume = () => {};

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.onResume();
      // console.log('App has come to the foreground!');
    }
    this.appState = nextAppState;
  };
}

BaseComponent.propTypes = {};

BaseComponent.defaultProps = {};
export default BaseComponent;
