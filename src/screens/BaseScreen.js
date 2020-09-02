import BaseComponent from '@src/components/BaseComponent';
import { AppState } from 'react-native';

class BaseScreen extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading:false
    };
    this.subs = [];
    this.appState = AppState.currentState;
  }

  set Loading(isLoading){
    this.setState({
      loading:isLoading
    });
  }
  get isLoading(){
    return this.state.loading||false;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  onResume = () => {};
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
