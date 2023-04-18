const admin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk.json");

class FirebaseService {
  app = null;

  static init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  static async bulkSendNotifications({ number = 1, delay = 1, payload }) {
    let count = 0;

    const intervalId = setInterval(() => {
      if (count++ >= Number(number)) return clearInterval(intervalId);
      this.sendNotification(payload);
    }, delay * 1000);
  }

  static async sendNotification({ targetToken, targetTopic, title, message }) {
    console.log("SENDING TO", targetTopic || targetToken, title, message);

    try {
      return await admin.messaging().send({
        notification: {
          title,
          body: message,
        },
        android: {
          notification: {
            notificationCount: 999,
            sound: "coin.wav",
            channelId: "fcm_default_channel",
            defaultSound: false,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "coin.wav",
            },
          },
        },
        token: targetToken || undefined,
        topic: targetToken ? undefined : targetTopic,
      });
    } catch (err) {
      console.error(err);
      return err.message;
    }
  }
}

module.exports = { FirebaseService };
