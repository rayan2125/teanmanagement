import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import { colors } from '../../constants/colors'
import Teams from '../../components/teams'
import CustomBtn from '../../components/customBtn'
import { useNavigation } from '@react-navigation/native'
import { db } from '../../firebase/firebaseconfig'
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from 'react-redux'

const Registration = () => {
    const userId = useSelector(state => state.auth.userId)
    const navigation = useNavigation();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        handleTeam();
    }, []);

    const handleTeam = async () => {
        try {
            const teamRef = collection(db, 'teams');
            const teamsSnapshot = await getDocs(teamRef);
            const teamList = teamsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTeams(teamList);
        } catch (error) {
            console.log("Error fetching teams:", error);
        }
    };

    const handleNavigation = (screen, team) => {
        navigation.navigate(screen, { team });
    };

    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={{ margin: 15, flex: 1 }}>
                    <Text style={styles.title}>Select your team</Text>

                    {/* Teams List */}
                    <FlatList
                        data={teams}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Teams team={item} onPress={() => handleNavigation("TeamMembers", item)} />
                        )}
                        contentContainerStyle={{ marginTop: 20, gap: 10 }}
                        keyboardShouldPersistTaps="handled"
                    />

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Create New Team Button */}
                    <View style={styles.center}>
                        <TouchableOpacity
                            onPress={() => handleNavigation("CreateTeam")}
                            style={styles.createTeamBtn}>
                            <Text style={styles.createTeamText}>+ Create New Team</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Button */}
                    <View style={styles.buttonContainer}>
                        <CustomBtn bg="#E6EAEF" txtColor="#B0BDCD"
                            title="Start Registration"
                        />
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

export default Registration;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    title: {
        fontSize: 24,
        marginTop: 20,
        fontWeight: '500',
        color: colors.text
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        fontWeight: '500',
        color: colors.text,
    },
    center: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    createTeamBtn: {
        borderColor: colors.orgbtn,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30
    },
    createTeamText: {
        fontSize: 18,
        color: colors.orgbtn,
        fontWeight: '500'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 40,

    },
});
