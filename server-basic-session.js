import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import users from "./db.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Route for login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    // User authenticated, create session
    req.session.username = username;
    return res.send(`Welcome, ${username}! You are logged in.`);
  } else {
    return res.status(401).send("Invalid credentials");
  }
});

// Route for protected content
app.get("/dashboard", (req, res) => {
  if (req.session.username) {
    return res.send(
      `Hello, ${req.session.username}. Welcome to your dashboard.`
    );
  } else {
    return res.status(401).send("Unauthorized. Please log in.");
  }
});

// Route for logging out
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out.");
    }
    res.clearCookie("connect.sid");
    return res.send("Logged out successfully");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
