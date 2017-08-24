import React, { Component } from 'react';

function calculatePercentChange(currentPrice, openingPrice) {
  return currentPrice > openingPrice ? ((currentPrice / openingPrice) - 1) * 100 : ((openingPrice / currentPrice) - 1) * -100;
}

function round(number, decimals) {
  return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals).toFixed(2);
}

class Ticker extends Component {

  constructor(props) {
    super(props);
    this.tickerFeed = this.tickerFeed.bind(this);
    this.getTickers = this.getTickers.bind(this);
    this.collect = this.collect.bind(this);
    this.hideButton = this.hideButton.bind(this);
  }

  componentWillMount() {
    this.getTickers();
    setInterval(this.tickerFeed, 60000);
  }

  uuid() {
    return Math.random().toString(36).substr(2, 6);
  }

  collect(event) {
    event.preventDefault();
    const index = event.target.elements[0].value;
    const ticker = event.target.elements[1].value;
    const currentUserRep = event.target.elements[2].value;
    const currentUserId = event.target.elements[3].value;
    const percentChange = event.target.elements[4].value;
    const created_at = event.target.elements[5].value;
    const body = JSON.stringify({
      index,
      ticker,
      currentUserRep,
      currentUserId,
      percentChange,
      created_at
    });

    fetch("/farms", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": new Buffer(body).length
      },
      body,
    }).then((response) => {
      return response.json();
    }).then((farm) => {
      const tickers = {
        tickers: [
          { name: farm.slot_01.name, created_at: farm.slot_01.created_at, collected_at: farm.slot_01.collected_at },
          { name: farm.slot_02.name, created_at: farm.slot_02.created_at, collected_at: farm.slot_02.collected_at },
          { name: farm.slot_03.name, created_at: farm.slot_03.created_at, collected_at: farm.slot_03.collected_at },
          { name: farm.slot_04.name, created_at: farm.slot_04.created_at, collected_at: farm.slot_04.collected_at },
          { name: farm.slot_05.name, created_at: farm.slot_05.created_at, collected_at: farm.slot_05.collected_at },
        ]
      };
      this.tickerFeed(tickers);
      this.props.findUser();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  hideButton(event) {
    const index = event.target.id;
    const button = "button" + index;
    this.setState({ [button]: true });
  }

  getTickers() {
    fetch("/farms", {
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    })
    .then((response) => {
      return response.json();
    }).then((slots) => {
      const tickers = {
        tickers: [
          { name: slots.slot_01.name, created_at: slots.slot_01.created_at, collected_at: slots.slot_01.collected_at },
          { name: slots.slot_02.name, created_at: slots.slot_02.created_at, collected_at: slots.slot_02.collected_at },
          { name: slots.slot_03.name, created_at: slots.slot_03.created_at, collected_at: slots.slot_03.collected_at },
          { name: slots.slot_04.name, created_at: slots.slot_04.created_at, collected_at: slots.slot_04.collected_at },
          { name: slots.slot_05.name, created_at: slots.slot_05.created_at, collected_at: slots.slot_05.collected_at },
        ]
      };
      return tickers;
    })
    .then((tickers) => {
      this.tickerFeed(tickers);
    })
    .catch((error) => { 
      console.log("error: ", error); 
    });
  }

  tickerFeed(data) {
    const list = data || this.state;
    Promise.all(
      list.tickers.map((item) => {
        const ticker = item.name;
        return fetch(`/api/alphavantage?symbol=${ticker}`)
        .then((resp) => resp.json());
      })
    ).then(all => {
      const tickers = all.map((data, index) => {
        const realTimeStockPrices = data['Time Series (Daily)'];
        for (let time in realTimeStockPrices) {
          const price = round(realTimeStockPrices[time]['4. close'], 2);
          const open = round(realTimeStockPrices[time]['1. open'], 2);
          const percentChange = round(calculatePercentChange(price, open), 2);
          const collected_at = list.tickers[index].collected_at;
          const created_at = list.tickers[index].created_at;
          const button = collected_at ? true : null;

          return {
            collected_at,
            name: data['Meta Data']['2. Symbol'],
            open,
            price,
            percentChange,
            created_at
          };
        }
      });
      const buttons = all.map((data, index) => {
        const show = list.tickers[index].collected_at ? true : false;
        return show;
      });

      this.setState({
        tickers,
        button0: buttons[0],
        button1: buttons[1],
        button2: buttons[2],
        button3: buttons[3],
        button4: buttons[4],     
      }); 
    }).catch(function(error) {
        console.log(error);
    })
  }

  render() {
    const data = this.state || this.props; // Is this necessary? For now it will only pass state if tickerFeed is broken
    const stocks = data.tickers.map((stock, index) => {
      const isActive = stock.collected_at || undefined;
      const button = "button" + index;
      if (stock.collected_at === null) {
        return (
            <div className="ticker-info" key={this.uuid()}>
              <form onSubmit={this.collect} >
                <input name="index" type="hidden" value={index} />
                <input name="ticker" type="hidden" value={stock.name} />
                <input name="currentUserRep" type="hidden" value={this.props.currentUserRep || ""} />
                <input name="currentUserId" type="hidden" value={this.props.currentUserId || ""} />
                <input name="percentChange" type="hidden" value={stock.percentChange} />
                <input name="created_at" type="hidden" value={stock.created_at} />
                <span>{ stock.name } | ${ stock.price } | { stock.percentChange }%</span>
                <span><input id={index} onClick={this.hideButton} className="ticker-button" style={{ display: this.state[button] ? "none" : "block" }} type="submit" value="Collect" /></span>
              </form>
            </div>
          )
      } else {
        return (
          <span className="ticker-collected" key={ index }>
            { stock.name } | ${ stock.price } | { stock.percentChange }% <br />
          </span>
        )
      }

    });

    return (
      <section className="tickers">
        { stocks }
      </section>
    );
  }
}

export default Ticker;