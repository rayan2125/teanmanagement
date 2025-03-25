import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
// import CustomButton from "../../components/customButton"
import { ActivityIndicator, DefaultTheme, PaperProvider, TextInput } from 'react-native-paper';
// import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';
import CustomBtn from '../../components/customBtn';
// import { callAxios } from "@/services/api"
// import { API_CONSTANTS } from '@/constants/ApiCollection';
// import { Success, Failed } from "@/services/utilities"
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useDispatch } from 'react-redux';

import { db } from '../../firebase/firebaseconfig';
import { collection, getDocs, query, where } from "firebase/firestore";
const Login = () => {
    const navigation = useNavigation();
    //   const dispatch = useDispatch()
    const customTheme = {
        ...DefaultTheme,
        roundness: 25,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.Primary,
            background: '#f0f0f0',
            text: '#333',
        },
    };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [textSecure, setTextSecure] = useState(true)
    const handleNavigation = () => {
        navigation.navigate("Signup");
    };

    //   const handlePasswordNavigation = () => {

    //     navigation.navigate("ForgetPassword");
    //   };

    const handleSubmit = async () => {
        setLoading(true);
        try {

            const usersRef = collection(db, 'users');
            console.log("userr:::", useState)
            // Query Firestore to check if user exists
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('User not found');
                alert('User does not exist. Please sign up.');
            } else {
                console.log('User exists:', querySnapshot.docs[0].data());
                alert('Login successful!');
                // Navigate to Home screen or save user session
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error('Error checking user:', error);
            alert('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <PaperProvider theme={customTheme}>
            <View style={{ flex: 1 }}>
                {
                    loading &&
                    <View style={{ position: "absolute", top: '50%', right: "46%", backgroundColor: 'white', zIndex: 9, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 10 }}>
                        <ActivityIndicator animating={true} />
                    </View>
                }
                <View style={{ flex: 1 }}>
                    {/* {status && (

            <View style={{ margin: 20 }}>

              {status === 1 ? <Success
                message={message}
              /> :
                status === 2 ? <Failed
                  message={message.error}
                /> :
                  <></>
              }

            </View>
          )
          } */}
                    <Text style={{ fontSize: 30, marginHorizontal: 30, marginTop: 30, color: colors.text }}>Login</Text>
                    <View style={{ flex: 1, justifyContent: 'center', margin: 10, gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>

                        <TextInput
                            placeholder='Enter Your Email'
                            mode='outlined'

                            value={email}
                            onChangeText={setEmail}
                        />

                        <View style={{ marginTop: 50 }}>
                            <CustomBtn
                                title="Login"
                                bg={colors.Primary}
                                onPress={() => handleSubmit()}
                                txtColor={colors.white}
                            />

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <Text style={{ fontSize: 14, color: colors.text }}>Don't have an account?</Text><TouchableOpacity onPress={() => handleNavigation()}><Text style={{ fontSize: 14, color: colors.Primary, fontWeight: '400' }}> Sign up</Text></TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </PaperProvider>
    )
}

export default Login

const styles = StyleSheet.create({})