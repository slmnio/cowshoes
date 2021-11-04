require("dotenv").config();

const port = process.env?.port || 8269;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.json());

io.on("connection", socket => {
    console.log("hello socket")
});

app.use(express.static("www"));

const { Stream } = require("./classes.js")

app.post("/status", (req, res) => {
    if (!req.body) return res.status(400).send({ error: true, message: "no body" })
    let streams = req.body.streams.map(s => new Stream({
        host: req.body.host,
        ...s
    }))
    /*
    * .map(s => new Stream({
        host: req.body.host,
        app: s.app,
        key: s.name
    }))
    * */
    console.log(streams);
    res.send("ok")
});

http.listen(port, () => console.log(`moo: live on :${port}`));
