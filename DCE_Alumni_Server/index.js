const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.od4uhuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("dceDb");
    const registrationData = db.collection("registration");

    // POST route to add a user
    app.post("/api/users", async (req, res) => {
      const userData = req.body;
      console.log("Received data:", userData);

      if (!userData.name || !userData.id || !userData.place || !userData.photoURL) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const result = await registrationData.insertOne(userData);
        res.status(201).json({ message: "User added successfully", result });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // PUT route to update a user's information
    app.put("/api/users/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;

      try {
        // Check if user exists
        const user = await registrationData.findOne({ id: id });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Perform the update
        const result = await registrationData.findOneAndUpdate(
          { id: id }, // Use { _id: new ObjectId(id) } if using MongoDB _id
          { $set: update },
          { returnDocument: "after" }
        );

        if (!result.value) {
          return res.status(404).json({ message: "Update failed" });
        }

        res.status(200).json(result.value); // Return the updated user data
      } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // GET route to check if the server is running
    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
