
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
// import { Colors } from '@/constants/Colors'
// import CustomButton from '@/components/customButton'
import { useNavigation } from '@react-navigation/native'
// import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { colors } from '../constants/colors'
import CustomBtn from '../components/customBtn'
import ViewTeam from './teams/viewTeam';
import Invites from './invites';
// import { useSelector } from 'react-redux'
const Home = () => {
    const profileSelector = "Sds"
    //   useSelector(state => state?.profile?.authData?.user)
    const navigation = useNavigation()
    const handleNavigation = (item) => {
        navigation.navigate(item)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, margin: 20 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <TouchableOpacity

                    >
                        {/* <Ionicons name="menu" size={24} color="black" /> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                        style={{ height: 40, width: 40, borderRadius: 100, backgroundColor: colors.Primary, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="user" size={24} color={colors.white} />
                    </TouchableOpacity>
                </View>
                <View style={{ top: 50 }}>
                    <Text style={{ color: colors.Primary, fontSize: 28, fontWeight: '900' }}>Hello, {profileSelector}!</Text>
                    <Text style={{ color: "#757575", fontWeight: '400' }}>Have a nice day!</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View>
                        <TouchableOpacity
                        onPress={()=>handleNavigation('Invites')}
                        style={{ height: 170, width: 150, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', marginBottom:10,justifyContent: 'center', elevation: 10 }}>
                            <Image source={require("../assets/invites.png")} style={{ height: 140, width: 140, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: colors.text, textAlign: 'center' }}>Invites</Text>
                    </View>
                    <View>
                        <View style={{  height: 170, width: 150,borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', marginBottom:10,justifyContent: 'center', elevation: 10 }}>
                            <Image source={require("../assets/teams.png")} style={{ height: 140, width: 140, resizeMode: 'contain' }} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: colors.text, textAlign: 'center' }}>My Teams</Text>
                    </View>

                </View>

                <View style={{ bottom: 40 }}>
                    <View style={{}}>
                        <CustomBtn
                            bg="#373A5B"
                            title="Registration"
                            onPress={() => handleNavigation('Registration')}
                            txtColor={colors.white}
                        />

                    </View>

                </View>
                
            </View>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({})