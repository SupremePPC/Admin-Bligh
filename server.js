const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
 
app.use(bodyParser.json());

// Define an HTTP endpoint to receive notifications
app.post("/notify", (req, res) => {
  const { user } = req.body; // User information from the Cloud Function

  // Handle the notification (e.g., log or process it)
  console.log("Received notification for user:", user);

  // Send a response to the Cloud Function
  res.status(200).send("Notification received.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
