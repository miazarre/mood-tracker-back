const express = require("express");
const app = express();
const db = require("./db");

const port = 3000;

app.use(express.json());

app.post("/signup", (req, res) => {
  const { username, firstname, email, password } = req.body;

  db.run(
    "INSERT INTO users (username, firstname, email, password) VALUES (?, ?, ?, ?)",
    [username, firstname, email, password],
    (err) => {
      if (err) {
        console.error("Error signing up:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "User signed up successfully" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid username or password" });
    } else {
      res.json({ message: "Login successful", user });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
