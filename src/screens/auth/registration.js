import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import Header from '../../components/header'
import { colors } from '../../constants/colors'
import Teams from '../../components/teams'
import CustomBtn from '../../components/customBtn'
import { useNavigation } from '@react-navigation/native'


const Registration = () => {
    const navigation = useNavigation();

    const handleNavigation = (item) => {
        navigation.navigate(item)
    }

    return (
        <>
            <Header />
            <View style={{ flex: 1 }}>
                <View style={{ margin: 15, flex: 1 }}>
                    <View >
                        <Text style={{ fontSize: 24, marginTop: 20, fontWeight: '500', color: colors.text }}>Select your team</Text>
                        <View style={{ marginTop: 20, gap: 10 }}>
                            <Teams
                            onPress={()=>handleNavigation("TeamMembers")}
                            />
                            {/* <Teams /> */}
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 30,
                            width: '100%',
                        }}>
                            <View style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: '#ccc',
                            }}>

                            </View>
                            <Text style={{
                                marginHorizontal: 10,
                                fontWeight: '500',
                                color: colors.text,
                            }}>Or</Text>
                            <View style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: '#ccc',
                            }}>

                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <TouchableOpacity
                                onPress={() => handleNavigation("CreateTeam")}
                                style={{ borderColor: colors.orgbtn, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30 }}>
                                <Text style={{ fontSize: 18, color: colors.orgbtn, fontWeight: '500' }}>+   Create New Team</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <CustomBtn
                            bg="#E6EAEF"
                            txtColor="#B0BDCD"
                        />
                    </View>
                </View>
            </View>

        </>
    )
}

export default Registration

const styles = StyleSheet.create({})