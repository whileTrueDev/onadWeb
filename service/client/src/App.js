import React from 'react';

class App extends React.Component{
  state = {users: []};

  componentDidMount = () => {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({users}));
  }
  render() {
    return (
      <div>
        <h1>Users</h1>
        {this.state.users.map( user => (
          <li key={user.id}>{user.user_name}</li>
        ))}
      </div>
    )
  }
}

export default App;
