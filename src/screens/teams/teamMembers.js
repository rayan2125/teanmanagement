import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebaseconfig';
import { useSelector } from 'react-redux';
import TextView from '../../components/textView';
import CustomBtn from '../../components/customBtn';
import { colors } from '../../constants/colors';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TeamMembers = () => {
    const userId = useSelector(state => state.auth.userId);
    const [teams, setTeams] = useState([]);
    const [createById, setCreateById] = useState(null);
    const [teamName, setTeamName] = useState(null);
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
   console.log("mine invite:::",invites)

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const invitesRef = collection(db, "teamInvites");
                const q = query(invitesRef, where("playerId", "==", userId), where("status", "==", "pending"));
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
    }, [userId]);
    useEffect(() => {
        handleMember();
    }, []);

    const teamId = "i4m9MWbYHIf06ec6j4Vk";

    const handleMember = async () => {
        try {
            const teamRef = doc(db, 'teams', teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                console.log("No such team found!");
                return;
            }

            const teamData = teamSnap.data()?.players;
            setCreateById(teamSnap.data()?.createdBy);
            setTeamName(teamSnap.data()?.teamName);

            let players = teamData || [];

            const invitationsRef = collection(db, 'teamInvites');
            const invitationsSnapshot = await getDocs(invitationsRef);

            const invitationsData = invitationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const updatedPlayers = players.map(player => {
                const invitation = invitationsData.find(invite => invite.playerId === player.id);
                return {
                    ...player,
                    status: invitation ? invitation.status : "pending"
                };
            });

            setTeams(updatedPlayers);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };
    const handleAccept = async (inviteId) => {
        try {
            const inviteRef = doc(db, "teamInvites", inviteId);
            await updateDoc(inviteRef, { status: "accepted" });

            // Update state to reflect changes
            setInvites((prevInvites) =>
                prevInvites.map(invite =>
                    invite.id === inviteId ? { ...invite, status: "accepted" } : invite
                )
            );

            console.log("Invite accepted:", inviteId);
        } catch (error) {
            console.error("Error updating invite:", error);
        }
    };


    // Reject Invitation
    const handleReject = async (inviteId) => {
        try {
            const inviteRef = doc(db, "teamInvites", inviteId);
            await updateDoc(inviteRef, { status: "rejected" });

            // Update state to reflect changes
            setInvites((prevInvites) =>
                prevInvites.map(invite =>
                    invite.id === inviteId ? { ...invite, status: "rejected" } : invite
                )
            );

            console.log("Invite rejected:", inviteId);
        } catch (error) {
            console.error("Error updating invite:", error);
        }
    };
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
                        <View style={styles.teamNameBox}>
                            <Text>{teamName}</Text>
                        </View>
                    </View>

                    {/* Team Members List */}
                    {teams.length > 0 ? (
                        <FlatList
                            data={teams}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => (
                                <TextView member={item} index={index} createById={createById} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noTeams}>No teams found.</Text>
                    )}
                    <View style={{ marginTop: 60, gap: 30 }} >
                        <CustomBtn bg={colors.greenbtn} title="Accept Invitation" txtColor={colors.white} />
                        <CustomBtn bg={colors.redbtn} title="Decline Invitation" txtColor={colors.white} />
                    </View>
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
