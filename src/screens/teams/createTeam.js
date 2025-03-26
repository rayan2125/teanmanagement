import { ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/header';
import { colors } from '../../constants/colors';
import { DefaultTheme, PaperProvider, } from 'react-native-paper';
import CustomBtn from '../../components/customBtn';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from '../../firebase/firebaseconfig';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import Linearbtn from '../../components/linearbtn';


const CreateTeam = () => {
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.adduser);
    const userId = useSelector(state => state.auth.userId)
    const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

    const isPhoneNumber = (input) => /^\d{10}$/.test(input); // Assuming 10-digit phone number

    const isUsername = (input) => /^[a-zA-Z0-9_.-]+$/.test(input) && !isEmail(input) && !isPhoneNumber(input);

    const [captain, setCaptain] = useState(null);
    const [players, setPlayers] = useState([
        { id: 1, value: authData.name, role: 'captain', isUser: true, userName: authData.userName }, // Always user
        { id: 2, value: '', role: 'player' },
        { id: 3, value: '', role: 'player' },
        { id: 4, value: '', role: 'player' },
    ]);

    const [teamName, setTeamName] = useState('')

    const handleCaptain = (index) => {
        const updatedPlayers = players.map((player, i) => ({
            ...player,
            role: i === index ? "captain" : "player",
        }));
        setPlayers(updatedPlayers);
        setCaptain(index);
    };

    const identifyInputType = (input) => {
        if (isEmail(input)) {
            return "email";
        } else if (isPhoneNumber(input)) {
            return "phone";
        } else if (isUsername(input)) {
            return "userName";
        } else {
            return "unknown";
        }
    };

    // "unknown"

    const handleInputChange = (index, text) => {
        const updatedPlayers = [...players];
        const inputType = identifyInputType(text);
        updatedPlayers[index].value = text;
        updatedPlayers[index].inputType = inputType;
        setPlayers(updatedPlayers);
    };



    const removePlayerInput = (index) => {
        if (players.length > 4) {
            const updatedPlayers = players.filter((_, i) => i !== index);
            setPlayers(updatedPlayers);
        }
    };

    const customTheme = {
        ...DefaultTheme,
        roundness: 10,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.Primary,
            background: '#f0f0f0',
            text: '#333',
        },
    };
    const handleSubmit = async (teamName, players) => {
        try {
            const processedPlayers = [];
            const usersRef = collection(db, 'users');
            const teamRef = collection(db, 'teams');

            for (const player of players) {
                if (player.id === 1) {

                    processedPlayers.push({ id: userId, userName: player.userName, role: player.role, name: authData.name });
                    continue;
                }

                let q;
                if (player.inputType === 'userName') {
                    q = query(usersRef, where('userName', '==', player.value));
                } else if (player.inputType === 'email') {
                    q = query(usersRef, where('email', '==', player.value));
                } else if (player.inputType === 'phone') {
                    q = query(usersRef, where('phone', '==', player.value));
                }

                if (q) {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(doc => {
                            console.log(doc.data().name)
                            processedPlayers.push({

                                id: doc.id,
                                [player.inputType]: player.value,
                                role: player.role,
                                name: doc?.data()?.name,
                                userName: doc?.data()?.userName

                            });
                        });
                    } else {
                        alert(`Player with ${player.inputType}: ${player.value} not found.`);
                        return;
                    }
                }
            }


            const teamDoc = await addDoc(teamRef, {
                teamName,
                players: processedPlayers,
                createdBy: userId,
            });

            // Send invitations
            for (const player of processedPlayers) {
                if (player.userName !== authData.userName) {
                    await addDoc(collection(db, 'teamInvites'), {
                        teamId: teamDoc.id,
                        invitedBy: userId,
                        playerId: player.id,  // Save player ID in the invite
                        playerInfo: player,
                        status: 'pending',
                    });
                }
            }

            alert('Team created and invitations sent!');

        } catch (error) {
            console.error('Error adding team:', error);
        }
    };



    // const handleSubmit = async (teamName, players) => {
    //     try {
    //         const processedPlayers = [];
    //         const usersRef = collection(db, 'users');

    //         for (const player of players) {
    //             if (player.id === 1) {
    //                 // Skip the current user (captain)
    //                 processedPlayers.push({ username: player.userName,role: player.role  });
    //                 continue;
    //             }

    //             if (player.inputType) {
    //                 let q;
    //                 if (player.inputType === 'userName') {
    //                     q = query(usersRef, where('userName', '==', player.value));
    //                 } else if (player.inputType === 'email') {
    //                     q = query(usersRef, where('email', '==', player.value));
    //                 } else if (player.inputType === 'phone') {
    //                     q = query(usersRef, where('phone', '==', player.value));
    //                 }

    //                 if (q) {
    //                     const querySnapshot = await getDocs(q);
    //                     if (!querySnapshot.empty) {
    //                         processedPlayers.push({ [player.inputType]: player.value, role: player.role });
    //                     } else {
    //                         // Player not found in Firestore
    //                         alert(`Player with ${player.inputType}: ${player.value} not found.`);
    //                         return; 
    //                     }
    //                 }
    //             } else {

    //             }
    //         }



    //         await addDoc(collection(db, 'teams'), {

    //             teamName,
    //             players: processedPlayers,
    //             createdBy: userId,

    //         });


    //     } catch (error) {
    //         console.error('Error adding team:', error);
    //     }
    // };
    return (
        <>
            <Header />
            <PaperProvider theme={customTheme}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.scrollContainer}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.logoContainer}>
                                    <View style={styles.logoBox}>
                                        <View style={styles.logoCircle}>
                                            <MaterialIcons name="camera-plus-outline" color={colors.white} size={25} />
                                        </View>
                                    </View>
                                    <Text style={styles.logoText}>Team Logo</Text>
                                </View>

                                <View>
                                    <Text style={styles.label}>Team Name</Text>
                                    <View style={{ borderColor: '#ccc', borderWidth: 1.5, borderRadius: 10, justifyContent: 'center', height: 60, paddingHorizontal: 5, paddingVertical: 5 }}>

                                        <TextInput
                                            mode="outlined"
                                            placeholder="Enter team name"
                                            placeholderTextColor='#ccc'
                                            value={teamName}
                                            onChangeText={(text) => setTeamName(text)}
                                            style={{ fontSize: 18, fontWeight: '500', height: 60, marginHorizontal: 5 }}

                                        />
                                    </View>

                                </View>

                                {/* Dynamic Player Inputs */}


                                {players.map((player, index) => (
                                    <View key={player.id} style={styles.playerContainer}>
                                        <View style={styles.playerHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.playerText}>Player {index + 1}</Text>
                                                {/* <View style={styles.inviteStatus}>
                                                    <Text style={styles.inviteText}>Phone/Email: Invited</Text>
                                                </View> */}
                                            </View>
                                            <TouchableOpacity onPress={() => handleCaptain(index)}>
                                                <Text style={[styles.captainText, player.role === "captain" && styles.selectedCaptainText]}>
                                                    {player.role === "captain" ? "Captain" : "Mark Captain"}
                                                </Text>
                                            </TouchableOpacity>

                                        </View>

                                        {player.id === 1 ?
                                            <View style={{ borderColor: '#ccc', borderWidth: 1.5, borderRadius: 10, height: 70, paddingHorizontal: 5, paddingVertical: 5 }}>
                                                <View style={{ flexDirection: 'row', position: 'relative' }}>

                                                    <View>

                                                        <Image source={{ uri: userImg }} style={{ height: 50, width: 50, borderRadius: 5, resizeMode: 'cover' }} />
                                                        <View style={{ backgroundColor: colors.redbtn, height: 15, width: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -5, right: -5 }}>
                                                            <Text style={{ color: colors.white }}>C</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 10 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>{player.value}(You)</Text>
                                                        <Text>@{player.userName}</Text>

                                                    </View>
                                                </View>

                                            </View> :
                                            <View style={{ borderColor: '#ccc', borderWidth: 1.5, borderRadius: 10, justifyContent: 'center', height: 60, paddingHorizontal: 5, paddingVertical: 5 }}>

                                                <TextInput
                                                    mode="outlined"
                                                    placeholder="Enter @Username/Phone/Email"
                                                    placeholderTextColor='#ccc'
                                                    value={player.value}
                                                    onChangeText={(text) => handleInputChange(index, text)}
                                                    style={{ fontSize: 18, fontWeight: '500', height: 60, marginHorizontal: 5 }}

                                                />
                                            </View>
                                        }

                                        {players.length > 4 && (
                                            <TouchableOpacity onPress={() => removePlayerInput(index)} style={styles.removeBtn}>
                                                <MaterialIcons name="delete" size={24} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}




                                <View style={{ marginTop: 50 }}>
                                    {/* <Linearbtn/> */}
                                    <CustomBtn bg={colors.orgbtn}
                                        onPress={() => handleSubmit(teamName, players)}
                                        txtColor={colors.white} title="Invite & Create Team" />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </PaperProvider>
        </>
    );
};

export default CreateTeam;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logoBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        paddingHorizontal: 30,
        paddingVertical: 30,
        borderRadius: 20,
    },
    logoCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: colors.orgbtn,
    },
    logoText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    label: {
        fontSize: 20,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 15,
    },
    playerContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    playerHeader: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playerText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '500',
    },
    inviteStatus: {
        marginHorizontal: 5,
        backgroundColor: '#B0BDCD',
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    inviteText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#F3F4F5',
    },
    captainText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    selectedCaptainText: {
        color: colors.orgbtn,
        fontWeight: 'bold',
    },
    addPlayerBtn: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.Primary,
        alignItems: 'center',
        borderRadius: 5,
    },
    addPlayerText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    removeBtn: {
        marginTop: 5,
        alignItems: 'center',
    },
});
