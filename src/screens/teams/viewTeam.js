import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseconfig';
import { useSelector } from 'react-redux';
import { collection, getDocs, query, where,addDoc } from "firebase/firestore";
const ViewTeam = () => {
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.adduser);
    const userId = useSelector(state => state.auth.userId)
    // console.log("user id:::",userId)
    const [invites, setInvitations] = useState([]);
// console.log(invites)
    useEffect(() => {
        fetchInvitations();
    }, []);

    // const handleData = async () => {
    //     try {
    //         const teamsRef = collection(db, 'teams');
    //         const querySnapshot = await getDocs(teamsRef);
    //         const teamsList = querySnapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }));
    //         setTeams(teamsList);
    //     } catch (error) {
    //         console.error("Error fetching teams:", error);
    //     }
    // };
    const fetchInvitations = async () => {
        try {
            const invitesRef = collection(db, 'teamInvites');
            // console.log("comingggg",invitesRef)
            const q = query(invitesRef, where('playerId', '==', userId));
            // console.log("testing::::",q)
            const querySnapshot = await getDocs(q);
    console.log("minnnnne::::",querySnapshot.docs)
            const invites = querySnapshot.docs.map(doc => ({

                id: doc.id,
                ...doc.data(),
            }));
            console.log("invite comingg:", invites)
            setInvitations(invites);
        } catch (error) {
            console.error('Error fetching invites:', error);
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>View Team</Text>
            {/* {teams.map((team) => (
                <View key={team.id} style={styles.teamCard}>
                    <Text style={styles.teamName}>{team.name}</Text>
                </View>
            ))} */}
        </View>
    );
};

export default ViewTeam;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    teamCard: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    teamName: {
        fontSize: 16,
        fontWeight: '500',
    },
});
