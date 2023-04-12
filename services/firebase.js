const admin = require("firebase-admin");
const serviceAccount = require("../ionic-push-poc-5cb14-firebase-adminsdk-ibwjm-e41e1ff207.json");

class FirebaseService {
  app = null;

  static init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  static async sendNotification({ target, title, message }) {
    console.log("SENDING TO", target, title, message);

    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      android: {
        notification: {
          icon: "stock_ticker_update",
          color: "#7e55c3",
        },
      },
      token: target,
    };

    return admin.messaging().send(messagePayload);
  }
}

module.exports = { FirebaseService };
