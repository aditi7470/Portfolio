const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving message");
    }
    res.redirect("/?sent=1");
  });
});


app.get("/messages", (req, res) => {
  const sql = "SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching messages");
    }
    res.render("messages", { messages: rows });
  });
});

app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
