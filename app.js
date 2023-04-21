const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

const items = ["banana", "apple", "watermelon",];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
    .then(() => console.log('Connected!'));

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItem = [item1, item2, item3];

// Item.insertMany(defaultItem)
//     .then(function () {
//         console.log("Data Inserted")
//     }).catch(function (err) {
//         console.log(err)
//     });


app.get("/", function (req, res) {
    // const day = date.getDate();
    Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
    })
    .catch(err => console.log(err));
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