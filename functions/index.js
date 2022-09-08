const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addCustomClaims = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    if (change.after) {
      // Add custom claims
      return await admin.auth().setCustomUserClaims(change.after.id, {
        isAdmin: change.after.data().isAdmin || false,
        isAuthor: change.after.data().isAuthor || false,
      });
    }
  });
