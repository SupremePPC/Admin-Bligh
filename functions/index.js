/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const {Storage} = require("@google-cloud/storage");
const storage = new Storage();

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const userId = data.userId;
  if (!userId) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide a user ID.",
    );
  }

  try {
    // Delete user document from Firestore
    const userDoc = admin.firestore().doc(`users/${userId}`);
    await userDoc.delete();

    // Delete user data from Firebase Storage
    const bucket = storage.bucket("gs://account-db-3a21d.appspot.com");
    const userFolder = `users/${userId}`;
    console.log(userFolder);

    await bucket.deleteFiles({
      prefix: userFolder,
    });

    // Finally, delete user from Firebase Auth
    await admin.auth().deleteUser(userId);

    return {success: true, message: "User deleted successfully."};
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError("unknown", "Failed to delete user.");
  }
});

