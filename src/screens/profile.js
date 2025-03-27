import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from '@react-navigation/native';
import CustomBtn from '../components/customBtn';
import { colors } from '../constants/colors';
import { logout } from '../redux/Reducers/auth.redux';
import { useDispatch } from 'react-redux';
// import { Image } from 'native-base';
// import CustomButton from '@/components/customButton';
// import { Colors } from '@/constants/Colors';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '@/redux/Reducers/profileReducers';

const Profile = () => {
    const dispatch = useDispatch()
    // const profileSelector = useSelector(state=>state?.profile?.authData?.user)

    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
    };

    const handleLogout = () => {
        dispatch(logout(null))
        navigation.navigate("Login")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, margin: 10 }}>
                <TouchableOpacity onPress={handleBack}>

                    <MaterialIcons name="arrow-left" size={30} color="black" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ height: 140, width: 140, borderRadius: 100, borderWidth: 2, borderColor: colors.text, alignItems: 'center', justifyContent: 'center' }}>

                        {/* <Image source={require("../../assets/images/profile-1.jpeg")} style={{ height: 130, width: 130, borderRadius: 100, resizeMode: '' }} /> */}
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', bottom: 50 }}>
                    <View style={{ borderRadius: 30, paddingHorizontal: 25, paddingVertical: 25, gap: 20, elevation: 5, backgroundColor: colors.Primary }}>


                        <View>
                            <Text style={{ color: 'white', fontSize: 16 }}>Name:</Text>
                            {/* <Text style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 10, color: 'white', fontSize: 16, }}>{profileSelector?.name}</Text> */}
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 16 }}>Email:</Text>
                            {/* <Text style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 10, color: 'white', fontSize: 16, }}>{profileSelector?.email}</Text> */}
                        </View>
                        <View>
                            <Text style={{ color: 'white', fontSize: 16 }}>Password:</Text>
                            {/* <Text 
                        style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginTop: 10, color: 'white', fontSize: 16, }}>{profileSelector?.password}</Text> */}
                        </View>
                    </View>
                </View>
                <CustomBtn
                    bg="#F75851"
                    title="Logout"
                    onPress={() => handleLogout()}
                />
            </View>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({})