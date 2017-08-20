import React, { Component }from 'react';

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
    this.getTickers - this.getTickers.bind(this);
  }

  componentDidMount() {
    this.getTickers();
    setInterval(this.tickerFeed, 60000);
  }

  componentWillReceiveProps() {
    this.getTickers();
    this.tickerFeed();
  }

  getTickers() {
    fetch("/farms", {
      credentials: 'include',
      headers: {
        "Accept": "application/json"
      }
    })
    .then((response) => {
      return response.json();
    }).then((slots) => {
      this.setState({
        tickers: [
          { name: slots.slot_01 },
          { name: slots.slot_02 },
          { name: slots.slot_03 },
          { name: slots.slot_04 },
          { name: slots.slot_05 },
        ]
      });
    }).catch((error) => { 
      console.log("error: ", error); 
    });
  }

  tickerFeed() {
    const alphaVantageKey = 'Your api key here';
    const data = this.state || this.props;
    Promise.all(
      data.tickers.map((item, index) => {
        return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item.name}&outputsize=full&apikey=${alphaVantageKey}`)
        .then((resp) => resp.json());
      })
    ).then(all => {
      const tickers = all.map(data => {
        const realTimeStockPrices = data['Time Series (Daily)'];
        for (let time in realTimeStockPrices) {
          const price = round(realTimeStockPrices[time]['4. close'], 2);
          const open = round(realTimeStockPrices[time]['1. open'], 2);
          const percentChange = round(calculatePercentChange(price, open), 2);

          return {
            name: data['Meta Data']['2. Symbol'],
            open,
            price,
            percentChange
          };
        }
      });
      this.setState({
        tickers
      }); 
    }).catch(function(error) {
        console.log(error);
    })
  }

  render() {
    const data = this.state || this.props; // Is this necessary? For now it will only pass state if tickerFeed is broken
    const stocks = data.tickers.map((stock, index) => {
      return (
        <div key={ stock.name }>
          <form action="/farms" method="POST" >
            <input name="index" type="hidden" value={index} />
            <input name="ticker" type="hidden" value={stock.name} />
            <input name="currentUserRep" type="hidden" value={this.props.currentUserRep} />
            <input name="currentUserId" type="hidden" value={this.props.currentUserId} />
            <input name="open" type="hidden" value={stock.open} />
            <input name="currentPrice" type="hidden" value={stock.price} />
            <div>{ stock.name } | ${ stock.price } | { stock.percentChange }%</div>
            <input type="submit" />
          </form>
        </div>
      )
    });

    return (
      <section id="tickers">
        { stocks }
      </section>
    );
  }
}

export default Ticker;