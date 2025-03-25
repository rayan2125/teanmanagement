import { ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/header';
import { colors } from '../../constants/colors';
import { DefaultTheme, PaperProvider, TextInput } from 'react-native-paper';
import CustomBtn from '../../components/customBtn';
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from '../../firebase/firebaseconfig';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useSelector } from 'react-redux';


const CreateTeam = () => {
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.adduser)
    // console.log(userImg, authData.name)
    const [captain, setCaptain] = useState(null);
    const [players, setPlayers] = useState([
        { id: 1, value: '', role: 'player' },
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


    const handleInputChange = (index, text) => {
        const updatedPlayers = [...players];
        updatedPlayers[index].value = text;
        setPlayers(updatedPlayers);
    };

    const addPlayerInput = () => {
        setPlayers([...players, { id: players.length + 1, value: '' }]);
    };

    const removePlayerInput = (index) => {
        if (players.length > 4) { // Allow removal only if there are more than 4 players
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

            await addDoc(collection(db, "teams"), {
                teamName,
                players

            })



        } catch (error) {
            console.error('Error adding team:', error);
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
                                    <View style={styles.logoBox}>
                                        <View style={styles.logoCircle}>
                                            <MaterialIcons name="camera-plus-outline" color={colors.white} size={25} />
                                        </View>
                                    </View>
                                    <Text style={styles.logoText}>Team Logo</Text>
                                </View>

                                <View>
                                    <Text style={styles.label}>Team Name</Text>
                                    <TextInput mode="outlined"
                                        onChangeText={(text) => setTeamName(text)}
                                        placeholder="Enter team name" />
                                </View>

                                {/* Dynamic Player Inputs */}
                                <Text>Player 1</Text>
                                <View style={{ borderColor: '#ccc', borderWidth: 1.5, marginTop: 15, marginBottom: 10, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 5 }}>
                                    <View style={{ flexDirection: 'row', position: 'relative' }}>

                                        <View>

                                            <Image source={{ uri: userImg }} style={{ height: 50, width: 50, borderRadius: 5, resizeMode: 'cover' }} />
                                            <View style={{ backgroundColor: colors.redbtn, height: 15, width: 15, borderRadius: 100, alignItems: 'center',justifyContent:'center', position: 'absolute', top: -5, right: -5 }}>
                                                <Text style={{ color: colors.white }}>C</Text>
                                            </View>
                                        </View>
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>Dhanajay Dubey (You)</Text>
                                            <Text>@dhanajayDubey</Text>

                                        </View>
                                    </View>

                                </View>
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
                                        <TextInput
                                            mode="outlined"
                                            placeholder="Enter @Username/Phone/Email"
                                            value={player.value}
                                            onChangeText={(text) => handleInputChange(index, text)}


                                        />

                                        {players.length > 4 && (
                                            <TouchableOpacity onPress={() => removePlayerInput(index)} style={styles.removeBtn}>
                                                <MaterialIcons name="delete" size={24} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}




                                <View style={{ marginTop: 50 }}>
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
