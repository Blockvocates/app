import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig';
import { getDocs, collection, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Button,
  Spinner,
  Text,
  Center,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useWallet } from './hooks/useWallet';
import './styles/MissionCompletion.css';
// import { ConnectKitButton } from "connectkit";
import MetaMaskConnector from './components/MetamaskConnector';

const MissionCompletion = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missionStatusMap, setMissionStatusMap] = useState({});
  const [userPathId, setUserPathId] = useState(null);
  const [completingMission, setCompletingMission] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Add wallet integration
  const {
    account,
    connectWallet,
    claimReward,
    checkMissionStatus
  } = useWallet();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            console.log("Current user email:", user.email);

            const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              const pathId = userData.pathId;
              setUserPathId(pathId);
              console.log("User pathId:", pathId);

              // Fetch missions for the user's selected path
              const missionsQuery = query(
                collection(db, 'missions'),
                where('pathId', '==', pathId)
              );

              const missionsSnapshot = await getDocs(missionsQuery);
              console.log("Number of missions found:", missionsSnapshot.size);

              const missionsData = missionsSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Mission data:", data);
                return {
                  id: doc.id,
                  ...data
                };
              });

              // Fetch mission completion status
              const userMissionsQuery = query(
                collection(db, 'userMissions'),
                where('userId', '==', user.uid)
              );
              const userMissionsSnapshot = await getDocs(userMissionsQuery);
              const completedMissions = {};
              userMissionsSnapshot.docs.forEach(doc => {
                completedMissions[doc.data().missionId] = true;
              });

              setMissionStatusMap(completedMissions);
              setMissions(missionsData);
              setLoading(false);
            } else {
              console.error('No user found with this email.');
              setLoading(false);
            }
          } else {
            console.log("No user logged in");
            navigate('/login');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchMissions();
  }, [navigate]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const completeMission = async (missionId) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to claim rewards",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setCompletingMission(missionId);
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Check if mission is already completed on blockchain
      const isBlockchainCompleted = await checkMissionStatus(missionId);
      if (isBlockchainCompleted) {
        throw new Error("Rewards already claimed for this mission!");
      }

      // Check if mission is already completed in Firebase
      const missionRef = doc(db, "userMissions", `${user.uid}_${missionId}`);
      const missionDoc = await getDoc(missionRef);

      if (missionDoc.exists()) {
        throw new Error("Mission already completed!");
      }

      // Claim blockchain rewards first
      await claimReward(missionId);

      // Then update Firebase
      await updateDoc(doc(db, "userMissions", `${user.uid}_${missionId}`), {
        userId: user.uid,
        missionId: missionId,
        completedAt: new Date().toISOString(),
      });

      // Update local state
      setMissionStatusMap(prev => ({
        ...prev,
        [missionId]: true
      }));

      toast({
        title: "Mission Completed!",
        description: "Mission completed and rewards claimed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error completing mission:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCompletingMission(null);
    }
  };

  const debugMissions = () => {
    console.log("Current missions state:", missions);
    console.log("Current user pathId:", userPathId);
    console.log("Loading state:", loading);
    console.log("Wallet connected:", !!account);
    console.log("Completed missions:", missionStatusMap);
  };

  if (loading) {
    return (
      <Center mt={6}>
        <Spinner size="lg" color="teal" />
        <Button ml={4} onClick={debugMissions}>Debug Info</Button>
      </Center>
    );
  }

  return (
    <Box padding="30px" textAlign="center">
      <Heading as="h1" size="lg" color="#FFF" mb={6}>
        Mission Completion
      </Heading>

      {/* Wallet Connection */}
      <Center as="h1" size="lg" color="#FFF" mb={6}>
        To claim rewards :
        <MetaMaskConnector/>
      </Center>

      <Box mb={4}>
        {/* {!account ? (
          <Button
            colorScheme="blue"
            onClick={handleConnectWallet}
            mb={4}
          >
            <ConnectButton />
          </Button>
        ) : (
          <Text color="white" mb={4}>
            Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </Text>
        )} */}
      </Box>

      <Button onClick={debugMissions} mb={4}>Show Debug Info</Button>
      <Text color="white" mb={4}>Path ID: {userPathId}</Text>

      <HStack spacing={4} overflowX="auto" className="mission-container">
        {missions.length > 0 ? (
          missions.map((mission) => (
            <VStack key={mission.id} spacing={4} className="mission-card">
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                p={3}
                borderRadius="lg"
                boxShadow="lg"
                className="glassmorphism-container"
                height="120px"
                width="150px"
                textAlign="left"
              >
                <Heading size="sm" color="#FFF" mb={2}>{mission.missionName}</Heading>
                <Text color="#FFF" fontSize="sm" noOfLines={2}>{mission.objective}</Text>
              </Box>
              <VStack spacing={2}>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate(`/${mission.missionName.replace(/ /g, '')}`)}
                >
                  Open Mission
                </Button>
                {missionStatusMap[mission.id] ? (
                  <Text color="green.300" fontSize="sm">Completed ✓</Text>
                ) : (
                  <Button
                    colorScheme="green"
                    size="sm"
                    isLoading={completingMission === mission.id}
                    isDisabled={!account || missionStatusMap[mission.id]}
                    onClick={() => completeMission(mission.id)}
                  >
                    Claim Rewards
                  </Button>
                )}
              </VStack>
            </VStack>
          ))
        ) : (
          <Text color="white">No missions found. (PathId: {userPathId})</Text>
        )}
      </HStack>
    </Box>
  );
};

export default MissionCompletion;