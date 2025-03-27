import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { arrayUnion, collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where } from "firebase/firestore";
import { db } from '../../firebase/firebaseconfig';
import { useSelector } from 'react-redux';
import TextView from '../../components/textView';
import CustomBtn from '../../components/customBtn';
import { colors } from '../../constants/colors';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';

const TeamMembers = ({ route }) => {
    const userId = useSelector(state => state.auth.userId);
    const [teams, setTeams] = useState([]);
    const [newMember, setNewMember] = useState("");
    const data = route?.params?.team
    let teamId = data.id
    let { createdBy } = data ?? "null"
    const [loading, setLoading] = useState(true);
    const [userStatus, setUserStatus] = useState(null);
    const [invites, setInvites] = useState([]);
    console.log(teams.length)

    useEffect(() => {
        if (!userId || !teamId) return;

        const fetchInvites = async () => {
            try {
                const invitesRef = collection(db, "teamInvites");
                const q = query(
                    invitesRef,
                    where("playerId", "==", userId),
                    where("teamId", "==", teamId)
                );
                const querySnapshot = await getDocs(q);

                const invitesData = [];
                querySnapshot.forEach((doc) => {

                    invitesData.push({ id: doc.id, ...doc.data() });
                });

                setInvites(invitesData);
            } catch (error) {
                console.error("Error fetching invites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvites();
    }, [userId, teamId]);

    useEffect(() => {
        handleMember();
    }, []);

    useFocusEffect(
        useCallback(() => {
            handleMember();
        }, [])
    );

    const handleMember = async () => {
        try {
            const teamRef = doc(db, 'teams', teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                console.log("No such team found!");
                return;
            }

            const teamData = teamSnap.data()?.players;
            // let players = teamData || [];
            // const invitationsRef = collection(db, 'teamInvites');
            // const invitationsQuery = query(invitationsRef, where("teamId", "==", teamId));
            // const invitationsSnapshot = await getDocs(invitationsQuery);

            // const invitationsData = invitationsSnapshot.docs.map(doc => ({
            //     id: doc.id,
            //     ...doc.data()
            // }));

            // const updatedPlayers = players.map(player => {
            //     const invitation = invitationsData.find(invite => invite.playerId === player.id);

            //     return {
            //         ...player,
            //         status: invitation.status
            //     };
            // },


            // );
            setTeams(teamData)
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };
    const handleAccept = async (inviteId, teamId, userId) => {
        try {
            const inviteRef = doc(db, "teamInvites", inviteId);
            await updateDoc(inviteRef, { status: "accepted" });

            // Fetch the invite details
            const inviteSnap = await getDoc(inviteRef);
            if (!inviteSnap.exists()) {
                console.error("Invite not found!");
                return;
            }

            const inviteData = inviteSnap.data();

            // Fetch the current team data
            const teamRef = doc(db, "teams", teamId);
            const teamSnap = await getDoc(teamRef);
            if (!teamSnap.exists()) {
                console.error("Team not found!");
                return;
            }

            let teamData = teamSnap.data();

            // Update the player's status in the team
            const updatedPlayers = teamData.players.map(player =>
                player.id === userId ? { ...player, status: "accepted" } : player
            );

            // Update the teams collection
            await updateDoc(teamRef, {
                players: updatedPlayers
            });

            // Update local state
            setInvites((prevInvites) =>
                prevInvites.map(invite =>
                    invite.id === inviteId ? { ...invite, status: "accepted" } : invite
                )
            );

            // Refresh team list
            await handleMember();

            console.log("Invite accepted and team updated:", inviteId);
        } catch (error) {
            console.error("Error updating invite and team:", error);
        }
    };





    // Reject Invitation
    const handleReject = async (inviteId, teamId, userId) => {
        try {
            const inviteRef = doc(db, "teamInvites", inviteId);
            await updateDoc(inviteRef, { status: "declined" });

            // Fetch the invite details
            const inviteSnap = await getDoc(inviteRef);
            if (!inviteSnap.exists()) {
                console.error("Invite not found!");
                return;
            }

            // Fetch the team details
            const teamRef = doc(db, "teams", teamId);
            const teamSnap = await getDoc(teamRef);
            if (!teamSnap.exists()) {
                console.error("Team not found!");
                return;
            }

            let teamData = teamSnap.data();

            // Remove the declined user from the team or update their status to "declined"
            const updatedPlayers = teamData.players.map(player =>
                player.id === userId ? { ...player, status: "declined" } : player
            );

            // Update the teams collection
            await updateDoc(teamRef, {
                players: updatedPlayers
            });

            // Update local state
            setInvites((prevInvites) =>
                prevInvites.map(invite =>
                    invite.id === inviteId ? { ...invite, status: "declined" } : invite
                )
            );

            // Refresh team list
            await handleMember();

            console.log("Invite declined and team updated:", inviteId);
        } catch (error) {
            console.error("Error updating invite and team:", error);
        }
    };
    const removeMember = async (teamId, playerId) => {
        try {
            const teamRef = doc(db, 'teams', teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                alert('Team not found.');
                return;
            }

            const teamData = teamSnap.data();
            const updatedPlayers = teamData.players.filter(player => player.id !== playerId);

            // Update the team document in Firestore
            await updateDoc(teamRef, { players: updatedPlayers });

            // Find and delete the invitation
            const inviteQuery = query(collection(db, 'teamInvites'),
                where('teamId', '==', teamId),
                where('playerId', '==', playerId)
            );

            const inviteSnap = await getDocs(inviteQuery);
            inviteSnap.forEach(async invite => {
                await deleteDoc(doc(db, 'teamInvites', invite.id));
            });

            alert('Member removed successfully!');
            handleMember()
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member. Please try again.');
        }
    };

    const addPlayerToTeam = async (teamId,) => {
        let playerInput = {
            id: 2, userName: 'Vbd@gmail.com', role: 'player'
        }
        try {
            const usersRef = collection(db, 'users');
            let playerQuery;

            // if (!playerInput || !playerInput.type || !playerInput.value) {
            //     alert('Invalid input type');
            //     return;
            // }

            if (playerInput.type === 'userName') {
                playerQuery = query(usersRef, where('userName', '==', playerInput.value));
            } else if (playerInput.type === 'email') {
                playerQuery = query(usersRef, where('email', '==', playerInput.value));
            } else if (playerInput.type === 'phone') {
                playerQuery = query(usersRef, where('phone', '==', playerInput.value));
            } else {
                alert('Invalid input type');
                return;
            }

            const playerSnap = await getDocs(playerQuery);
            if (playerSnap.empty) {
                alert(`Player with ${playerInput.type}: ${playerInput.value} not found.`);
                return;
            }

            let playerData;
            playerSnap.forEach(doc => {
                playerData = { id: doc.id, name: doc.data().name, userName: doc.data().userName, status: 'pending', role: playerInput.role };
            });

            // Fetch the team document
            const teamRef = doc(db, 'teams', teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                alert('Team not found.');
                return;
            }

            const teamData = teamSnap.data();
            const updatedPlayers = [...teamData.players, playerData];

            // Update the team document with the new player
            await updateDoc(teamRef, { players: updatedPlayers });

            // Send an invitation
            await addDoc(collection(db, 'teamInvites'), {
                teamId,
                invitedBy: authData.userId,
                playerId: playerData.id,
                playerInfo: playerData,
                status: 'pending',
            });

            alert('Player added and invitation sent!');
        } catch (error) {
            console.error('Error adding player:', error);
            alert('Failed to add player. Please try again.');
        }
    };

    // const handleAddMember = async (teamId) => {
    //     if (!newMember.trim()) {
    //         alert("Please enter a valid member ID.");
    //         return;
    //     }

    //     try {
    //         const teamRef = doc(db, "teams", teamId);
    //         await updateDoc(teamRef, {
    //             players: arrayUnion({ id: newMember, status: "pending" }),
    //         });

    //         alert("Member added successfully!");
    //         setNewMember(""); // Clear input
    //         handleMember(); // Refresh team list
    //     } catch (error) {
    //         console.error("Error adding member:", error);
    //         alert("Failed to add member.");
    //     }
    // };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.content}>
                    {/* Team Logo Section */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBox}>
                            <View style={styles.logoCircle}>
                                <MaterialIcons name="camera-plus-outline" color={colors.white} size={25} />
                            </View>
                        </View>
                        <Text style={styles.logoText}>Team Logo</Text>
                    </View>

                    {/* Team Name Section */}
                    <View>
                        <Text style={styles.label}>Team Name</Text>
                        <View style={{ borderColor: '#ccc', borderWidth: 1.5, borderRadius: 10, justifyContent: 'center', height: 60, paddingHorizontal: 5, paddingVertical: 5 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', marginHorizontal: 5 }}>{data?.teamName}</Text>
                        </View>
                    </View>

                    {/* Team Members List */}
                    <FlatList
                        data={teams}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => (
                            <TextView member={item} index={index} createById={createdBy}
                                onRemove={() => removeMember(teamId, userId)}
                            />
                        )}
                    />
                    {teams.length < 4 && (
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 18,
                                    color: colors.text,
                                    fontWeight: '500',
                                }}>Player {teams.length + 1}</Text>

                                {/* {player.id !== 1 && sentInvites && <View style={styles.inviteStatus}>
                                                    <Text style={styles.inviteText}>{identifyInputType(player.value)}: Invited</Text>
                                                </View>} */}
                            </View>
                            <TouchableOpacity >
                                <Text style={[styles.selectedCaptainText]}>
                                    {teams.role === "captain" ? "Captain" : "Mark Captain"}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ borderColor: 'grey', marginBottom: 50, borderWidth: 1.5, borderRadius: 10, height: 70, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>

                                <TextInput
                                    placeholder="Enter @Username/Phone/Email"
                                    style={{ fontSize: 18, fontWeight: '400', height: 60, marginHorizontal: 5 }}

                                    value={newMember}
                                    onChangeText={setNewMember}
                                />
                            </View>
                            <CustomBtn
                                bg={colors.greenbtn}
                                title="Add Member"
                                txtColor={colors.white}
                                onPress={() => addPlayerToTeam(teamId, { id: 2, value: 'Vbd@gmail.com', role: 'player' },)}
                            />

                        </View>
                    )}

                    {/* {data.length > 0 ? (
                        <FlatList
                            data={data.players}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => (
                                <TextView member={item} index={index} createById={createdBy} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noTeams}>No teams found.</Text>
                    )} */}
                    {userId !== createdBy && invites.length > 0 && (
                        <View style={{ marginTop: 60, gap: 30 }}>
                            {invites[0].status === "pending" ? (
                                <>
                                    <CustomBtn bg={colors.greenbtn} title="Accept Invitation" txtColor={colors.white}
                                        onPress={() => handleAccept(invites[0].id, teamId, userId)}
                                    />
                                    <CustomBtn bg={colors.redbtn} title="Decline Invitation" txtColor={colors.white}
                                        onPress={() => handleReject(invites[0].id, teamId, userId)}
                                    />
                                </>
                            ) : invites[0].status === "accepted" ? (
                                <CustomBtn
                                    title="Accepted"
                                    bg="#ccc"
                                    txtColor={colors.text} />
                                // <Text style={styles.statusText}>✅ You have accepted the invitation</Text>
                            ) : (
                                <CustomBtn
                                    title="You Declined"
                                    bg="#ccc"
                                    txtColor={colors.text} />
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>

            {/* Buttons at the Bottom */}
        </SafeAreaView>
    );
};

export default TeamMembers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        margin: 20,
        marginBottom: 50
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    teamNameBox: {
        borderColor: '#ccc',
        borderWidth: 1.5,
        borderRadius: 10,
        justifyContent: 'center',
        height: 60,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    noTeams: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});

