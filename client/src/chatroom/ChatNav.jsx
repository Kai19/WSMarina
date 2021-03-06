import React, { Component } from 'react';

// Class chatNav renders nav-bar of page which includes logo and count of online users
class ChatNav extends Component {
  componentWillReceiveProps(nextProps){
    if (this.props.clientCount !== nextProps.clientCount){
      this.forceUpdate();
    };
  }
  render() {
    if (this.props.chatname) {
      return (
        <nav className="chatNav">
          <span>TOPIC: <span id="chatname">{this.props.chatname}</span></span>
          <span className="online-users">{this.props.clientCount} 👤 online</span>
        </nav>
      )
    } else {
        return (
          <nav className="chatNav"></nav>
        )
    };
  }
}

export default ChatNav;