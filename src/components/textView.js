import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-paper';

const TextView = ({ member, index, createById,onRemove }) => {
    // console.log("my member coming::", member.status)
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.adduser);
    const userId = useSelector(state => state.auth.userId)
    // const showDeleteButton = (member.id !== createById && userId !== member.id) || userId === member.id;
    const showDeleteButton = (userId === createById && member.id !== userId) || (userId === member.id);
    // const showDeleteButton = (createById && userId !== member.id) 
    // const showDeleteButton = !(index === 0) || member.id===userId ;
    let dynaColor = member.status === "accepted" ? colors.orgbtn : member.status === "declined" ? colors.redbtn : '#B0BDCD';
    const boderColor = colors.greenbtn && member.status === "accepted" ? colors.greenbtn : member.status === "declined" ? colors.redbtn : '#B0BDCD'
    return (
        <>
            <View style={styles.playerHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.playerText}>Player {index + 1}</Text>

                    {member.id !== createById && <View style={{
                        marginHorizontal: 5,
                        backgroundColor: dynaColor,
                        borderRadius: 100,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        width: 150,
                        alignItems: 'center',
                    }}>
                        <Text style={styles.inviteText}>{
                            member.status === "accepted" ? "Accepted" :
                                member.status === "declined" ? 'Declined' : 'User Id: Invited'
                        } </Text>
                    </View>}
                </View>
                <TouchableOpacity
                // onPress={() => handleCaptain(index)}
                >
                    <Text style={[styles.captainText, member?.role === "captain" && styles.selectedCaptainText]}>
                        {member?.role === "captain" ? "Captain" : "Mark Captain"}
                    </Text>
                </TouchableOpacity>

            </View>
            <View style={{ borderColor: boderColor, borderWidth: 1.5, borderRadius: 10, height: 70, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
                <View style={{ flexDirection: 'row', position: 'relative' }}>

                    <View>

                        <Image source={{ uri: userImg }} style={{ height: 50, width: 50, borderRadius: 5, resizeMode: 'cover' }} />

                        {member?.role === "captain" && <View style={{ backgroundColor: colors.redbtn, height: 15, width: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -5, right: -5 }}>
                            <Text style={{ color: colors.white }}>C</Text>
                        </View>}
                    </View>
                    <View style={{ marginHorizontal: 10, justifyContent: 'center', flexDirection: 'row' }}>
                        <View>

                            <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>{member?.name}{member?.id === userId ? `(You)` : ''}</Text>

                            {
                                <Text>@{member?.userName}</Text>
                            }
                        </View>
                    </View>
                </View>

                {
                    // (member.id === userId && index !== 0) 
                    // member.id !==createById &&
                    // index !==0 && 
                    // member.id ===userId
                    // && 
                    showDeleteButton && index !== 0 &&
                    (

                        <TouchableOpacity style={{ marginRight: 10 }}
                        onPress={onRemove}
                        >
                            <Icon
                                source="delete-outline"
                                color={colors.text}
                                size={25}
                            />
                        </TouchableOpacity>
                    )}



            </View>
        </>
    )
}

export default TextView

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
        marginTop: 10,
    },
    playerText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '500',
    },

    inviteText: {
        fontSize: 14,
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