import React from 'react';

class ChatList extends React.Component {
  constructor() {
    super();
    this.state = {
      ChatList: []
    }
    this.onSubmit = this.handleSubmit.bind(this);
    this.joinChat = this.joinChat.bind(this);
  }
  getChatList() {
    //For Localhost use the below url
    const url = "/ChatList";

    fetch(url, {
      credentials: 'include',
      headers: {
        "Accept": "application/json"
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((ChatList) => {
        this.setState({
          ChatList: ChatList
        });
      });
  }
  componentDidMount() {
    this.getChatList();
  }
  
  handleSubmit(event) {
    // event.preventDefault();
    const chatname = event.target.elements[0].value;
    const body = JSON.stringify({ chatname: chatname, currentUserId: this.props.currentUserId });
    const url = "/chatList"
    fetch(url, {      
      method: "POST",
      credentials: 'include',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": new Buffer(body).length},
        body: body
      }).then((response) => {
        return response.json()
      }).then((newchatlist) => {
        console.log("new chat list:", newchatlist)
        this.setState({
          chatList: newchatlist
        })
        console.log(this.state)
      })
  }

  joinChat(event) {
    const chatroomId = event.target.elements[0].value;
    const url = "/joinChat"
    const body = JSON.stringify({ chatroomId: chatroomId, currentUserId: this.props.currentUserId });
    fetch(url, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": new Buffer(body).length
      },
      body: body
    }).then((response) => {
      return response.json()
    }).then((chatroomUsers) => {
      console.log(chatroomUsers)
    })
  }

  render() {
    let position = 0;
    const ChatList = this.state.ChatList.map((chatList) => {
      position++;
      return (
        <div key={chatList.name}>
          <span>{position}. {chatList.name}</span>
          <span>
            <form onSubmit={this.joinChat}>
              <input type="hidden" name="chatroomid" value={chatList.id}/>
              <button>Join Chat</button>
            </form>
          </span>
        </div>
      );
    });

    return (
      <div className="ChatList">
        <p>ChatList</p>
        <form onSubmit={this.onSubmit}>
          <input type="text" placeholder="Name your Chat topic!" />
          <button>Create</button>
        </form>
        {ChatList}
      </div>
    );
  }
}

export default ChatList;