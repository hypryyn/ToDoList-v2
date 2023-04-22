const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
 
let Item;
 
async function setup() {
  console.log("Trying to connect to MongoDB.");
 
  await mongoose.connect('mongodb://127.0.0.1:27017/todolist');
 
  console.log("Connected to MongoDB.");
 
  Item = mongoose.model("Item", mongoose.Schema({
    name: {
      type: String,
      required: true
    },
 
    list: {
      type: String, 
      required: true
    }
  }));
}
 
async function getItems(list) {
  console.log("Getting all Items.")
  const items = await Item.find({list: list});
  return items;
}
 
async function saveItem(newItemTitle, list) {
  const newItem = new Item({name: newItemTitle, list: list});
  await newItem.save();
}
async function deleteItem(id) {
  await Item.findByIdAndDelete(id);
}
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
 
// HOME List
app.get("/", function(req, res) {
 
  res.redirect("/home");
 
});
 
// Custom Lists
 
app.get("/:list", (req, res) => {
 
  getItems(req.params.list).then(items => {
    console.log("All items: " + items);
    res.render("list", {list: req.params.list, items: items});
  });
 
});
 
// ADD
 
app.post("/add/:list", function(req, res){
  saveItem(req.body.newItem, req.params.list).catch(err => console.log(err)).then(res.redirect(req.params.list === "home" ? "/" : "/" + req.params.list))
});
 
 
// DELETE
app.post("/delete/:list", (req, res) => {
  console.log(req.body);
  deleteItem(req.body.id).then(res.redirect(req.params.list === "home" ? "/" : "/" + req.params.list));
});
 
// ABOUT
app.get("/about", function(req, res){
  res.render("about");
});
 
setup().then(() => {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
})});
 