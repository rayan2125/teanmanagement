
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import { Colors } from '@/constants/Colors'
// import CustomButton from '@/components/customButton'
import { useNavigation } from '@react-navigation/native'
// import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Image } from 'native-base'
import { colors } from '../constants/colors'
import CustomBtn from '../components/customBtn'
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    {/* <Image
          source={require("@/assets/images/task-1.png")} style={{ height: 350, width: 300, resizeMode: 'contain' }} /> */}
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