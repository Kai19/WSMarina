import React from 'react';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      bio: '',
      username: '',
      rep: '',
      email: '',
      flairs: ''
    }
    this.onSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    fetch("/profile", {
      method: "GET",
      credentials: "include"
    })
      .then((response) => {
        return response.json();
      }).then((userInfo) => {
        this.setState({
          image: userInfo.image,
          bio: userInfo.bio,
          username: userInfo.username,
          rep: userInfo.rep,
          email: userInfo.email,
        });
      }).catch((err) => {
        console.log("error ", err);
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const image = event.target.elements[0].value;
    const bio = event.target.elements[1].value;
    const body = JSON.stringify({ image: image, bio: bio });

    fetch("/profile", {
      method: "PUT",
      credentials: 'include',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": new Buffer(body).length
      },
      body: body
    })
      .then((response) => {
        return response.json();
      }).catch((err) => {
        console.log("error ", err);
      });
  }

  render() {
    return (
        <div className="profilePage">
          <h1>Profile</h1>
          <img className="user-avatar" src={this.state.image} />
          <tr>
            <td>Username:</td> 
            <td>{this.state.username}</td>
          </tr>
          <tr>
            <td>Bio:</td>
            <td>{this.state.bio}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{this.state.email}</td>
          </tr>
          <tr>
            <td>Reputation:</td>
            <td>{this.state.rep}</td>
          </tr>
        {/* edit profile should only be visible when user_id matches visiting user */}
        {/* no defaults set for img and both forms are forced to be entered */}
        <div className="edit-profile">
          <form onSubmit={this.onSubmit}>
            <input type="file" name="image" accept="image/*" />
            <input type="text" placeholder="Tell us about yourself" />
            <input type="submit"/>
          </form>
        </div>
      </div>
    );
  }
}

export default ProfilePage;

