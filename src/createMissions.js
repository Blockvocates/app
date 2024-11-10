const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { firebaseConfig } = require('./constants/config');


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createMissions = async () => {
  try {
    // Create documents with IDs from 2 to 6
    let j = 4;
    for (let i = 114; i <= 116; i++) {
      await setDoc(doc(db, "missions", "mission" + i.toString()), {
        missionId: "mission" + i.toString(),
        missionName: "Mission 2",
        pathId: j,
        objective: 'Read, Write, Own'
      });
      j = j + 1;
      console.log(`Document with ID ${i} successfully written`);
    }
  } catch (error) {
    console.error(`Error creating documents: ${error}`);
  }
};

createMissions();