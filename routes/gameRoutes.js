const express = require("express");
const router = express.Router();
const data = require("../data");
const userdata = data.users;
const gamedata = data.games;
const rentgamedata = data.rentgames;
var bodyParser = require("body-parser");
const buy_sell = data.buysell;

router.get("/", async (req, res) => {
  const allgame = await gamedata.getAllGames();
  res.json(allgame);
});

// Gets all the available games for buy and sell.
router.get("/listings", async (req, res) => {
  // gameData.getAllListedGames();
});

// User lists the game for selling
router.get("/sell/:game_id$", async (req, res) => {
  const user = req.session.user;
  if (!user) res.redirect("/login");
  else {
    const game_id = req.params.game_id;
    try {
      gamedata.getGameById(game_id);
    } catch (e) {
      res.redirect("error/generalError", {
        error: { message: "Game Id not found." },
      });
    }
    res.render("pages/sellGame");
    // const username = user.username;
    // buy_sell.putUpForSale(username, game_id)
  }
});

router.post("/sell/:game_id$", async (req, res) => {
  const user = req.session.user;
  if (!user) res.redirect("/login");
  else {
    const game_id = req.params.game_id;
    try {
      gamedata.getGameById(game_id);
    } catch (e) {
      res.redirect("error/generalError", {
        error: { message: "Game Id not found." },
      });
    }
    try {
      const price = req.body.sellPrice;
      console.log(`\n\n\n ${price}`);

      buy_sell.putUpForSale(user._id, game_id, price);
      res.redirect("/private");
    } catch (e) {
      res.redirect("error/generalError", {
        error: { message: "Game Id not found." },
      });
    }
  }
});

// All games for buy page
router.get("/buy$", async (req, res) => {
  try {
    const available_for_buying = buy_sell.getAllBuyGames();
    res.render("pages/purchase", { games: available_for_buying });
  } catch (e) {}
});

// User buys the game listed for selling
router.get("/buy/:game_id", async (req, res) => {
  const user = req.seesion.user;
  const game_id = req.params.game_id;
  if (!user) res.redirect("/login");
  else {
    // const username = user.username;
    // buy_sell.buyGame(username, game_id)
  }
});

// User borrows the game listed for renting
router.get("borrow/:game_id", async (req, res) => {
  const user = req.session.user;
  const game_id = req.params.game_id;
});

router.get("/rent", async (req, res) => {
  const rentgames = await rentgamedata.getAllRentGames();
  const showgames = new Array();
  for (let i in rentgames) {
    if (rentgames[i].borrowerId == "") {
      showgames.push(rentgames[i]);
    }
  }
  res.render("pages/rent", { rentgames: showgames });
});

router.get("/rent/:gameId", async (req, res) => {
  if (req.session.user) {
    const rentgame = await rentgamedata.getRentGameById(req.params.gameId);
    await userdata.addBorrowedGameToUser(
      req.session.user._id,
      req.params.gameId
    );
    await userdata.addlendedGameToUser(rentgame.lenderId, req.params.gameId);
    rentgame.borrowerId = req.session.user._id;
    rentgamedata.updateRentGame(req.params.gameId, rentgame);
    // update rent game borrowerid
    res.redirect("/private");
  } else {
    res.status(500).redirect("/login");
  }
});

router.use("*", async (req, res) => {
  console.log("came in error");
  res.render("errors/404pageNotFound");
});
module.exports = router;
