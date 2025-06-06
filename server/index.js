import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { config } from 'dotenv';

config();

const app = express();

app.use(cors());
app.use(express.json());

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
console.log(api_key);
const serverClient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    if (!firstName || !lastName || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const { users } = await serverClient.queryUsers({ name: username });

    if (users.length > 0) {
      return res.status(409).json({ message: "Username already exists. Please choose another one." });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);

    res.status(201).json({
      message: "User created successfully!",
      token,
      userId,
      firstName,
      lastName,
      username,
      hashedPassword,
    });
  } catch (error) {
    console.error("Signup Error:", error.message, error.response?.data);
    res.status(500).json({ message: "Error during signup. Please try again later." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login request received:", username);

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    console.log("Querying users for login...");
    const { users } = await serverClient.queryUsers({ name: username });
    console.log("Users found:", users);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(200).json({
      message: "Login successful!",
      token,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      username,
      userId: users[0].id,
    });
  } catch (error) {
    console.error("Login Error:", error.message, error.response?.data);
    res.status(500).json({ message: "Error during login. Please try again later." });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
