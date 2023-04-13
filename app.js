const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items = ["banana", "apple", "watermelon",];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {

    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items, route: "/" });
});

app.post("/", function (req, res) {

    const item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems, route: "/work" });
})

app.post("/work", function (req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000, function () {
    console.log("server started on port 3000");
});