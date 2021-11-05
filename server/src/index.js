require("dotenv").config();

const port = process.env?.port || 8269;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: (origin, callback) => callback(null, "*") } });

app.use(express.json());

io.on("connection", socket => {
    console.log("hello socket")
    socket.emit("cow_shoes_update", CowShoesList.toJSON())
});

app.use(express.static("www"));

const { CowShoesLister } = require("./classes.js")
const CowShoesList = new CowShoesLister();

function blast() {
    io.emit("cow_shoes_update", CowShoesList.toJSON())
}
blast(); setInterval(blast, 2000);

app.post("/status", (req, res) => {
    if (!req.body) return res.status(400).send({ error: true, message: "no body" })
    let streams = req.body.streams.map(s => ({
        host: req.body.host,
        ...s
    }))
    CowShoesList.serverUpdate(req.body.meta, streams)


    /*
    * .map(s => new Stream({
        host: req.body.host,
        app: s.app,
        key: s.name
    }))
    * */
    // console.log(streams);
    res.send("ok")
});

app.get("/status", (req, res) => {
    return res.json(CowShoesList)
})

http.listen(port, () => console.log(`moo: live on :${port}`));
