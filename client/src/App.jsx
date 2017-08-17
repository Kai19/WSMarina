import React from 'react';
import Navbar from './Navbar.jsx';
import Ticker from './Ticker.jsx';
import Leaders from './Leaders.jsx';
import News from './News.jsx';
import ChatRooms from './ChatRooms.jsx';
import SiteFooter from './SiteFooter.jsx';
import ProfilePage from './ProfilePage.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      tickers: [
        {
          name: 'AAPL',
          open: null,
          price: null,
          percentChange: null
        },
        {
          name: 'GOOG',
          open: null,
          price: null,
          percentChange: null
        },
        {
          name: 'AMZN',
          open: null,
          price: null,
          percentChange: null
        },
        {
          name: 'MSFT',
          open: null,
          price: null,
          percentChange: null
        },
        {
          name: 'FB',
          open: null,
          price: null,
          percentChange: null
        },
      ],
      chatRooms: [],
      newsItems: [],
      leaders: []
    };
  }

  findCurrentUser() {
    //For Localhost use the below url
    const url = "/currentUser";

    fetch(url, {
      credentials: 'include',
      headers: {
        "Accept": "application/json"
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        console.log(user)
        this.setState({
          currentUser: user.username
        });
      });
  }
  componentDidMount(){
    this.findCurrentUser();
  }

  render() {
    return (
      <div className="app">
        <p>Welcome!!!{this.state.currentUser}</p>
        <Navbar currentUser={this.state.currentUser} />
        <Ticker tickers={this.state.tickers} />
        <Leaders leaders={this.state.leaders} />
        <News newsItems={this.state.newsItems} />
        <ChatRooms chatRooms={this.state.chatRooms} />  
        <form action="/logout" method="POST">
          <input type='submit' value='Logout' />
        </form>
        <ProfilePage currentUser={this.state.currentUser} />
      </div>
    );
  }
}

export default App;
