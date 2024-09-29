import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import express from "express";
import session from "express-session";
import { createClient } from "redis";
import users from "./db.js";

const PORT = 3000;
const app = express();

// Initialize client.
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: "keyboard cat",
  })
);

// Route for login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    req.session.username = username;
    return res.send(`Welcome, ${username}! You are logged in.`);
  } else {
    return res.status(401).send("Invalid credentials");
  }
});

// Route for protected content
app.get("/dashboard", (req, res) => {
  if (req?.session?.username) {
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

app.get("/session", async (req, res) => {
  try {
    // Retrieve all session keys from Redis store
    const keys = await redisClient.keys("myapp:*"); // Adjust prefix if needed

    // Fetch all session data
    const sessionData = await Promise.all(
      keys.map(async (key) => {
        const session = await redisClient.get(key);
        return { key, session: JSON.parse(session) }; // Parse session data to JSON
      })
    );

    res.json(sessionData);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).send("Error retrieving sessions.");
  }
});

app.get("/session/me", (req, res) => {
  res.json(req.session);
});

app.use("*", () => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
