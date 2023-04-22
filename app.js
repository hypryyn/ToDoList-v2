const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

const listShema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listShema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItem)
//     .then(function () {
//         console.log("Data Inserted")
//     }).catch(function (err) {
//         console.log(err)
//     });

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    const list = new List({
        name: customListName,
        items: defaultItems
    });

    List.findOne({ name: customListName })
        .then(foundList => {
            if (foundList) {
                // show an existing list
                // console.log("/n exist")
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            } else {
                // create new list
                // console.log("doesnt exist")
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }
        }).catch(err => console.log(err.body));
});


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

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then((err) => {
                if (!err) {
                    console.log("successfully deleted");
                }
            });
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.pull({ _id: checkedItemId });
                foundList.save();
                res.redirect("/" + listName);
            })
    }

});


app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err)
            });
    }
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