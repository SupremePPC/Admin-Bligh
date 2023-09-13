// import { https } from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

// Initialize the Firebase Admin SDK
initializeApp();
const cors = require("cors");

// Initialize CORS middleware
const corsHandler = cors({
  origin: true,
});
exports.searchUser = functions.https.onRequest(async (req, res) => {
  // Existing CORS and method check code...
  corsHandler(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
      res.status(400).send("Search term is required");
      return;
    }

    const db = admin.firestore();
    const usersRef = db.collection("users");

    try {
      let usersData = [];

      const snapshotEmail = await usersRef
        .where("email", "==", searchTerm)
        .get();
      snapshotEmail.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });

      const snapshotName = await usersRef
        .where("fullName", "==", searchTerm)
        .get();
      snapshotName.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        if (!usersData.some((user) => user.id === userData.id)) {
          usersData.push(userData);
        }
      });

      if (usersData.length === 0) {
        res.status(404).send("No user found");
        return;
      }

      res.status(200).send(usersData);
    } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
