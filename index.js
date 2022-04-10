const express = require("express");
const app = express();
const axios = require("axios");
const bs58 = require("bs58");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {origin: "*", credentials: true, methods: "*",
    allowedHeaders: "*"}
});

let port = 420;

function getInstructionDataV1(token_mint_address, buy_price) {
    const mint_address_hex = bs58.decode(token_mint_address).toString("hex");
    let hex_buy_price = (buy_price * 1000000000).toString(16).replace(/^(.(..)*)$/, "0$1")
      .match(/../g).reverse().join("").padEnd(16, "0");
    const result = "438e36d81f1d1b5c" + hex_buy_price + mint_address_hex;
    return result;
}

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on('instruction_data_send_v1', (instructionDataObject) => {
        const instructionData = getInstructionDataV1(instructionDataObject.tokenMintAddress, instructionDataObject.buyPrice);
        io.to(socket.id).emit('message_v1', {data: instructionData});
    })
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  

app.get("/", (req, res) => {
    res.send("Hello World");
});

http.listen(port, () => {
    console.log(`Listening to:${port}`);
})

