import { History, Location } from 'history';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Router as ReactRouter } from 'react-router';
import { LOCATION_CHANGE } from '../store/modules/router';

interface IProps {
  history: History;

  children: any;
}

interface IDispatchProps {
  handleLocationChange: (location: Location) => void;
}

class Router extends React.Component<IProps & IDispatchProps> {
  private unsubscribeFromHistory: () => void;

  public componentWillMount() {
    this.props.handleLocationChange(this.props.history.location);
  }

  public componentDidMount() {
    this.unsubscribeFromHistory = this.props.history.listen(this.props.handleLocationChange);
  }

  public componentWillUnmount() {
    if (this.unsubscribeFromHistory) {
      this.unsubscribeFromHistory();
    }
  }
  public render() {
    return (
      <ReactRouter {...this.props} />
    );
  }

}

const mapDispatchToState = (dispatch: Dispatch<any>) => ({
  handleLocationChange: (location: Location) => dispatch({
    payload: location,
    type: LOCATION_CHANGE,
  }),
});

const connector = connect<void, IDispatchProps, IProps>(undefined, mapDispatchToState);

export default connector(Router);
