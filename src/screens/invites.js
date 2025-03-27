import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { useSelector } from "react-redux";


const Invites = () => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useSelector(state => state.auth.userId)

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


    // Accept Invitation
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
        <View style={styles.container}>
            <Text style={styles.header}>Team Invitations</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
            ) : invites.length === 0 ? (
                <Text style={styles.noInvites}>No Invitations Found</Text>
            ) : (
                <FlatList
                    data={invites}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.playerName}>
                                {item.playerInfo.username || item.playerInfo.email || item.playerInfo.phone}
                            </Text>
                            <Text style={styles.invitedBy}>Invited by: {item.invitedBy}</Text>
                            <Text style={styles.status}>Status: {item.status}</Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.accept]} onPress={() => handleAccept(item.id)}>
                                    <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => handleReject(item.id)}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default Invites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    noInvites: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playerName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    invitedBy: {
        fontSize: 14,
        color: "#555",
    },
    status: {
        fontSize: 14,
        color: "#777",
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    accept: {
        backgroundColor: "#28a745",
    },
    reject: {
        backgroundColor: "#dc3545",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
