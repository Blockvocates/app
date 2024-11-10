const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { firebaseConfig } = require('./constants/config');

// Firebase configuration
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createMission3 = async () => {
  try {
    // Create multiple Mission 3 documents for different paths
    for (let pathId = 4; pathId <= 6; pathId++) {
      const missionId = `mission${117 + (pathId - 4)}`; // This will create mission117, mission118, mission119
      await setDoc(doc(db, "missions", missionId), {
        missionId: missionId,
        missionName: "Mission 3",
        pathId: pathId,
        objective: 'Mission 3 Objective - Read, Write, Own'
      });
      console.log(`Mission 3 successfully created for path ${pathId} with ID ${missionId}`);
    }
  } catch (error) {
    console.error(`Error creating Mission 3: ${error}`);
  }
};

createMission3().then(() => {
  console.log("Script completed");
  process.exit(0);
}).catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});