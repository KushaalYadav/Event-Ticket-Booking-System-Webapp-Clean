const admin = require("firebase-admin");
const serviceAccount = require("./movie-booking-app-16792-firebase-adminsdk-fbsvc-6311aa32f7.json"); // 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const showsCollection = db.collection("shows");

const movieIDs = ["Movie2", "Movie3", "Movie4", "Movie5"];
const movie1ID = "Movie1";

// 👇 Function to copy seat and theater data
async function seedMovies() {
  try {
    const movie1Doc = await showsCollection.doc(movie1ID).get();

    if (!movie1Doc.exists) {
      console.error("Movie1 does not exist.");
      return;
    }

    const movie1Data = movie1Doc.data();

    const seatData = movie1Data.seats;
    const theaterData = movie1Data.theaters;

    for (const movieID of movieIDs) {
      await showsCollection.doc(movieID).update({
        seats: seatData,
        theaters: theaterData
      });
      console.log(`✅ Seeded ${movieID} successfully.`);
    }

    console.log("🎉 All movies seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seedMovies();
