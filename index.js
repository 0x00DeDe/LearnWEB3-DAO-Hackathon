const express = require("express");
var path = require("path");
const app = express();
const router = express.Router();
const config = require("./config");
let cron = require("node-cron");
const PushAPI = require("@pushprotocol/restapi");
const axios = require("axios");
const ethers = require("ethers");
let port = config.port;

app.use(express.json());

app.listen(port, () => {
  console.log("App running at port:" + port);
});

cron.schedule("* * * * *", async () => {
  try {
    const PK = config.CH_KEY;
    const Pkey = `0x${PK}`;

    const signer = new ethers.Wallet(Pkey);
    let url =
      "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd";
    let response = await axios.get(url);

    price = response.data.weth.usd;

    // apiResponse?.status === 204, if sent successfully!
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `Today's ETH price`,
        body: `The price of eth is ${price} USD`,
      },
      payload: {
        title: `Today's ETH price`,
        body: `The price of eth is ${price} USD`,
        cta: "",
        img: "",
      },
      channel: `eip155:5:${config.CH_PKEY}`, // your channel address
      env: "staging",
    });
  } catch (error) {}
});
