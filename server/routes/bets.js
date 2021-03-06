const express = require("express");

function createRouter(knex) {
  const router = express.Router();
  router.get("/", (req, res) => {

    const user_id = req.session.user_id;

    knex("bets")
      .where({ user_id })
      .select("ticker", "wager", "direction", "created_at", "start_price", "collected_at", "payout")
      .then((bets) => {
        res.send(bets);
      })
      .catch((err) => {
        console.log(err);
        res.json({"error": "Error has occured."});
      });
  });

  router.put("/", (req, res) => {

    const { created_at, start_price, ticker } = req.body;
    const user_id = req.session.user_id;

    // Intialize bet by updating created_at and start_price columns
    knex("bets")
      .where({
        user_id,
        ticker
      })
      .update("created_at", created_at)
      .update("start_price", start_price)
      .then(() => {
        console.log("Updated");
        res.json({result: "Record updated."});
      })
      .catch((err) => {
        console.log("error occured", err);
        res.json({result: err});
      });
  });


  router.post("/", (req, res) => {

    const { ticker, wager, currentUserRep, direction } = req.body;
    const user_id = req.session.user_id;

    // Check if a bet is already placed on selected ticker
    knex("bets")
      .select(1)
      .where({ ticker })
      .limit(1)
      .then((bets) => {

        if (bets.length) {
          if (bets[0].ticker === ticker) {
            return Promise.reject({
              message: "A bet for this stock has already been placed"
            });
          }
        }
        
      })
      .then(() => {

        return knex.insert({
          ticker,
          wager,
          direction,
          user_id
        }).into("bets")
          .catch((err) => {
            console.log("error in the insert", err);
          });

      })
      .then(() => {
        const rep = Number(currentUserRep) - Number(wager);
        return knex("users")
          .where({ id: user_id })
          .update({ rep })
          .catch((err) => {
            console.log(err);
          });
      })
      .then(() => {
        res.send();
      })
      .catch((err) => {
        req.flash("errors", err.message);
        res.redirect("/");
        console.log("error", err.message);
      });

  });
  return router;
}

module.exports = createRouter;