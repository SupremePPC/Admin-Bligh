import { https } from 'firebase-functions';
import { initializeApp, firestore, auth } from 'firebase-admin';
const cors = require('cors')({ origin: true });

initializeApp();

export const deleteUserAccount = https.onCall((data, context) => {
  return cors(req, res, async () => {
    const userId = data.userId; // The ID of the user to delete

    // Delete the user from Firestore

    const db = firestore();
    const userRef = db.collection('users').doc(userId);
    await userRef.delete();

    // Delete the user from Firebase Authentication
    await auth().deleteUser(userId);

    // Return a success message
    res.setHeader("Access-Control-Allow-Origin", "*");
    return {
      result: `User with ID ${userId} has been deleted from both Firestore and Authentication.`,
    };
  });
});
