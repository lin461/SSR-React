import React from 'react';
import { connect } from 'react-redux';
import { fetchAdmins } from '../actions';
import requireAuth from '../components/hocs/requireAuth';

class AdminsList extends React.Component {
  componentDidMount() {
    this.props.fetchAdmins();
  }

  renderAdmins() {
    return this.props.admins.map(admin => {
      return <li key={admin.id}>{admin.name}</li>;
    });
  }

  render() {
    return (
      <div>
        <h3>Protected List of Admins:</h3>
        <ul>{this.renderAdmins()}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admins: state.admins };
}

// function loadData(store) {
//   return store.dispatch(fetchAdmins());
// }

export default {
  loadData : ({dispatch}) => dispatch(fetchAdmins()),
  component: connect(mapStateToProps, { fetchAdmins })(requireAuth(AdminsList))
};
