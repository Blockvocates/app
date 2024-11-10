const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { firebaseConfig } = require('./constants/config');

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createDocuments = async () => {
  try {
    // Create documents with IDs from 2 to 6
    for (let i = 2; i <= 6; i++) {
      await setDoc(doc(db, "paths", i.toString()), {
        description: 'Trader Description',
        missions: ['mission101', 'mission102', 'mission103', 'mission104', 'mission105', 'mission106', 'mission107', 'mission108'],
        pathId: i,
        pathName: 'Crypto Trader'
      });
      console.log(`Document with ID ${i} successfully written`);
    }
  } catch (error) {
    console.error(`Error creating documents: ${error}`);
  }
};

createDocuments();