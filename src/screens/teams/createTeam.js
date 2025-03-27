import { ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import Header from '../../components/header';
import { colors } from '../../constants/colors';
import { DefaultTheme, Icon, PaperProvider, } from 'react-native-paper';
import CustomBtn from '../../components/customBtn';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from '../../firebase/firebaseconfig';
import { doc, updateDoc, getDoc, collection, query, where, getDocs, addDoc, writeBatch } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import Linearbtn from '../../components/linearbtn';
import { addTeam } from '../../redux/Reducers/teamsRedux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { setUserImg } from '../../redux/Reducers/auth.redux';
import RBSheet from 'react-native-raw-bottom-sheet';

const CreateTeam = () => {
    const dispatch = useDispatch()
    const refRBSheet = useRef();
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.adduser);
    const userId = useSelector(state => state.auth.userId)
    const teams = useSelector(state => state.member.teams)


    const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

    const isPhoneNumber = (input) => /^\d{10}$/.test(input); // Assuming 10-digit phone number

    const isUsername = (input) => /^[a-zA-Z0-9_.-]+$/.test(input) && !isEmail(input) && !isPhoneNumber(input);

    const [captain, setCaptain] = useState(null);
    const [players, setPlayers] = useState([
        { id: 1, value: authData.name, role: 'captain', isUser: true, userName: authData.userName, status: 'accepted' }, // Always user
        { id: 2, value: '', role: 'player' },
        { id: 3, value: '', role: 'player' },
        { id: 4, value: '', role: 'player' },
    ]);
    const [teamName, setTeamName] = useState('')
    const [screen, setScreen] = useState(1)
    const [sentInvites, setSentInvite] = useState(false)
    const [editable, setEditable] = useState(true)
    const [disable, setDisable] = useState(false)

    const handleCaptain = (index) => {
        const updatedPlayers = players.map((player, i) => ({
            ...player,
            role: i === index ? "captain" : "player",
        }));
        setPlayers(updatedPlayers);
        setCaptain(index);
    };

    const identifyInputType = (input) => {
        const trimmedInput = input.trim(); // Trim spaces before validation

        if (isEmail(trimmedInput)) {
            return "email";
        } else if (isPhoneNumber(trimmedInput)) {
            return "phone";
        } else if (isUsername(trimmedInput)) {
            return "userName";
        } else {
            return "unknown";
        }
    };


    // "unknown"

    const handleInputChange = (index, text) => {
        const updatedPlayers = [...players];
        const trimmedText = text.trim();
        const inputType = identifyInputType(trimmedText);
        if (inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedText)) {
            alert('Invalid email format');
            return;
        }

        if (inputType === 'phone' && !/^\d{10}$/.test(trimmedText)) {
            alert('Phone number must be 10 digits');
            return;
        }

        updatedPlayers[index].value = trimmedText;
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
    const handleClickImage = () => {
        const options = {
            mediaType: 'photo',
            maxHeight: 1000,
            maxWidth: 1000,
            quality: 0.5,
        };
        launchCamera(options, (response) => {
            if (response.assets) {
                const imageUri = response.assets[0].uri;
                dispatch(setUserImg(imageUri));
                handleClose();
            }
        });
    };

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            maxHeight: 1000,
            maxWidth: 1000,
            quality: 0.5,
        };
        launchImageLibrary(options, (response) => {
            if (response.assets) {
                const imageUri = response.assets[0].uri;
                dispatch(setUserImg(imageUri));
                handleClose();
            }
        });
    };

    const handleClose = () => {
        refRBSheet.current.close()
    }
    const handleOpen = () => {
        refRBSheet.current.open()
    }
    const handleSubmit = async (teamName, players) => {
        try {
            const usersRef = collection(db, 'users');
            const teamRef = collection(db, 'teams');
            const batch = writeBatch(db);
            const processedPlayers = [];

            // Query all players in a single batch where applicable
            const queries = players
                .filter(player => player.id !== 1) // Exclude creator
                .map(player => {
                    if (player.inputType) {
                        return {
                            player,
                            query: query(usersRef, where(player.inputType, '==', player.value))
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            // Fetch all players in one go
            for (const { player, query } of queries) {
                const querySnapshot = await getDocs(query);
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    processedPlayers.push({
                        id: doc.id,
                        role: player.role || 'member',
                        name: data?.name || 'Unknown',
                        userName: data?.userName || '',
                        // status: 'pending',
                    });
                });
            }

            // Add the creator directly
            processedPlayers.unshift({
                id: userId,
                userName: authData.userName,
                role: 'leader',
                name: authData.name,
                status: 'accepted',
            });

            // Add team to Firestore
            const teamDoc = await addDoc(teamRef, {
                teamName,
                players: processedPlayers,
                createdBy: userId,
            });

            // Add invitations in batch
            const inviteRef = collection(db, 'teamInvites');
            processedPlayers.forEach(player => {
                if (player.id !== userId) {
                    const playerInviteDoc = doc(inviteRef, player.id); // Fix: Reference a document, not a collection
                    batch.set(playerInviteDoc, {
                        teamId: teamDoc.id,
                        invitedBy: userId,
                        playerId: player.id,
                        playerInfo: player,
                        status: 'pending',
                    });
                }
            });

            await batch.commit(); // Perform batch write

            dispatch(addTeam({ id: teamDoc.id, members: processedPlayers, teamName }));
            setDisable(true);
            setEditable(false);
            setSentInvite(true);
            setScreen(2);
            alert('Team created and invitations sent!');

        } catch (error) {
            console.error('Error adding team:', error);
            alert('Error creating team. Please try again.');
        }
    };
    // removeMember
    // const handleSubmit = async (teamName, players) => {

    //     try {
    //         const processedPlayers = [];
    //         const usersRef = collection(db, 'users');
    //         const teamRef = collection(db, 'teams');

    //         for (const player of players) {
    //             if (player.id === 1) {

    //                 processedPlayers.push({ id: userId, userName: player.userName, role: player.role, name: authData.name, status: 'accepted' });
    //                 continue;
    //             }

    //             let q;
    //             if (player.inputType === 'userName') {
    //                 q = query(usersRef, where('userName', '==', player.value));
    //             } else if (player.inputType === 'email') {
    //                 q = query(usersRef, where('email', '==', player.value));
    //             } else if (player.inputType === 'phone') {
    //                 q = query(usersRef, where('phone', '==', player.value));
    //             }

    //             if (q) {
    //                 const querySnapshot = await getDocs(q);
    //                 if (!querySnapshot.empty) {
    //                     querySnapshot.forEach(doc => {
    //                         processedPlayers.push({
    //                             id: doc.id,
    //                             [player.inputType]: player.value,
    //                             role: player.role,
    //                             name: doc?.data()?.name,
    //                             userName: doc?.data()?.userName,
    //                             status: 'pending',

    //                         });
    //                     });
    //                 } else {
    //                     alert(`Player with ${player.inputType}: ${player.value} not found.`);
    //                     return;
    //                 }
    //             }
    //         }


    //         const teamDoc = await addDoc(teamRef, {
    //             teamName,
    //             players: processedPlayers,
    //             createdBy: userId,

    //         });

    //         // Send invitations
    //         for (const player of processedPlayers) {

    //             if (player.userName !== authData.userName) {
    //                 await addDoc(collection(db, 'teamInvites'), {
    //                     teamId: teamDoc.id,
    //                     invitedBy: userId,
    //                     playerId: player.id,  // Save player ID in the invite
    //                     playerInfo: player,
    //                     status: 'pending',
    //                 });
    //             }
    //         }

    //         let data = {
    //             id: teamDoc.id,
    //             memmber: processedPlayers,
    //             teamName
    //         }
    //         dispatch(addTeam(data))
    //         setDisable(true)
    //         setEditable(false)
    //         setSentInvite(true)
    //         setScreen(2)
    //         alert('Team created and invitations sent!');

    //     } catch (error) {
    //         console.error('Error adding team:', error);
    //     }
    // };
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
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member. Please try again.');
        }
    };
    const addPlayerToTeam = async (teamId, playerInput) => {
        try {
            const usersRef = collection(db, 'users');
            let playerQuery;

            if (playerInput.type === 'userName') {
                playerQuery = query(usersRef, where('userName', '==', playerInput.value));
            } else if (playerInput.type === 'email') {
                playerQuery = query(usersRef, where('email', '==', playerInput.value));
            } else if (playerInput.type === 'phone') {
                playerQuery = query(usersRef, where('phone', '==', playerInput.value));
            }

            if (!playerQuery) {
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
    return (
        <>
            <Header />
            <PaperProvider theme={customTheme}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.scrollContainer}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.logoContainer}>
                                    {
                                        userImg ? (
                                            <View style={{ alignSelf: 'center', }}>
                                                <View style={{ height: 110, width: 110, borderColor: colors.Primary, borderWidth: 3, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={{ uri: userImg }} style={{ height: 100, width: 100, resizeMode: 'cover', borderRadius: 100 }} />
                                                    <TouchableOpacity
                                                        onPress={() => setModal(!openModal)}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 5,
                                                            right: 5,
                                                            backgroundColor: 'red',
                                                            borderRadius: 100,
                                                            height: 20,
                                                            width: 20,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}>
                                                        <Icon source="delete" color='white' />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.logoBox}>

                                                <TouchableOpacity
                                                    onPress={handleOpen}
                                                    style={styles.logoCircle}>
                                                    <MaterialIcons name="camera-plus-outline" color={colors.white} size={25} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }

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




                                {players.map((player, index) => (

                                    <View key={player.id} style={styles.playerContainer}>
                                        <View style={styles.playerHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={styles.playerText}>Player {index + 1}</Text>

                                                {player.id !== 1 && sentInvites && <View style={styles.inviteStatus}>
                                                    <Text style={styles.inviteText}>{identifyInputType(player.value)}: Invited</Text>
                                                </View>}
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

                                                        <Image source={require("../../assets/user-5.png")} style={{ height: 45, width: 50, borderRadius: 5, resizeMode: 'cover' }} />
                                                        <View style={{ backgroundColor: colors.redbtn, height: 12, width: 12, borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, right: -5 }}>
                                                            <Text style={{ color: colors.white, fontSize: 10 }}>C</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 10 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>{player.value}(You)</Text>
                                                        <Text>@{player.userName}</Text>

                                                    </View>
                                                </View>

                                            </View> :
                                            <View style={{ borderColor: '#ccc', borderWidth: 1.5, borderRadius: 10, justifyContent: 'center', height: 60, paddingHorizontal: 5, paddingVertical: 5 }}>
                                                {
                                                    screen === 2 ?
                                                        <>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                                                <View>

                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        {
                                                                            player.inputType == "phone" &&
                                                                            <>
                                                                                <Image source={require("../../assets/flag.png")} style={{ height: 20, width: 40, top: 5, resizeMode: 'contain' }} />
                                                                                <Text style={{ fontSize: 16, color: '#ccc', top: 5, fontWeight: '600', marginBottom: 10, }}>+91</Text>
                                                                            </>
                                                                        }
                                                                        <Text style={{ fontSize: 16, color: '#ccc', top: 5, fontWeight: '600', marginBottom: 10, marginHorizontal: 10 }}>{player.value}</Text>
                                                                    </View>
                                                                    {
                                                                        player.inputType == "userName" && <Text>@{player.userName}</Text>
                                                                    }
                                                                </View>
                                                                <TouchableOpacity style={{ marginRight: 10 }}
                                                                    onPress={() => removeMember()}
                                                                >

                                                                    <Icon
                                                                        source="delete-outline"
                                                                        color={colors.text}
                                                                        size={25}
                                                                    />

                                                                </TouchableOpacity>
                                                            </View>
                                                        </> :
                                                        <TextInput
                                                            mode="outlined"
                                                            placeholder="Enter @Username/Phone/Email"
                                                            placeholderTextColor='#ccc'
                                                            value={player.value}
                                                            onChangeText={(text) => handleInputChange(index, text)}
                                                            style={{ fontSize: 18, fontWeight: '400', height: 60, marginHorizontal: 5 }}
                                                            editable={editable}
                                                            maxLength={player.inputType === "phone" ? 10 : 120}  // Correct condition
                                                        />

                                                }
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
                                    <CustomBtn bg={sentInvites === true ? "#E6EAEF" : colors.orgbtn}
                                        onPress={() => handleSubmit(teamName, players)}
                                        disabled={disable}
                                        txtColor={colors.white} title={sentInvites === true ? "Invited" : "Invite & Create Team"} />

                                </View>
                            </ScrollView>

                        </View>
                        <RBSheet
                            height={130}
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={false}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: "transparent"
                                },
                                draggableIcon: {
                                    backgroundColor: "#000"
                                }
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleClose}
                                style={{ position: 'absolute', right: 10, top: 10 }}>
                                <Icon source='delete' size={20} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", alignItems: 'center', margin: 5 }}>
                                <TouchableOpacity
                                    onPress={handleClickImage}
                                    style={{ paddingVertical: 10, paddingHorizontal: 20, borderStyle: "dashed", borderRadius: 100, alignItems: "center" }}>

                                    <Icon source='camera' size={30} color={colors.Primary} />
                                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleImagePicker}
                                    style={{ paddingVertical: 20, paddingHorizontal: 20, borderStyle: "dashed", borderRadius: 100, alignItems: "center" }}>

                                    <Icon source='image' size={30} color={colors.Primary} />
                                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>Image</Text>
                                </TouchableOpacity>

                            </View>
                        </RBSheet>
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
