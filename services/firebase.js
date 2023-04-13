const admin = require("firebase-admin");
const serviceAccount = require("../ionic-push-poc-5cb14-firebase-adminsdk-ibwjm-b7b5dd9735.json");
const path = require("path");

class FirebaseService {
  app = null;

  static init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  static async sendNotification({ targetToken, targetTopic, title, message }) {
    console.log("SENDING TO", targetTopic || targetToken, title, message);

    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      android: {
        notification: {
          notificationCount: 999,
          sound: "notification.mp3",
        },
      },
      topic: undefined,
      token: undefined,
    };

    if (targetToken) messagePayload.token = targetToken;
    else if (targetTopic) messagePayload.topic = targetTopic;

    try {
      return await admin.messaging().send(messagePayload);
    } catch (err) {
      console.error(err);
      return err.message;
    }
  }
}

module.exports = { FirebaseService };
