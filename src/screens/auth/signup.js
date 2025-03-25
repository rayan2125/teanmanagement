import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
// import CustomButton from "../../components/customButton";
import { ActivityIndicator, DefaultTheme, TextInput, ThemeProvider } from 'react-native-paper';
// import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
// import { callAxios } from "@/services/api";
// import { API_CONSTANTS } from '@/constants/ApiCollection';
// import { Success, Failed } from "@/services/utilities"
import { colors } from '../../constants/colors';
import CustomBtn from '../../components/customBtn';
import { db } from '../../firebase/firebaseconfig';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const signupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    phone: Yup.string()
        .min(6, 'phone must be at least 6 characters')
        .required('phone is required'),
});

const Signup = () => {
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
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('')
    const [textSecure, setTextSecure] = useState(true)
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.goBack();
    };

    const handleSubmit = async () => {

        setErrors({});
        setLoading(false)
        const formValues = { name, email, phone };

        try {

            await signupSchema.validate(formValues, { abortEarly: false });
            // If validation passes, proceed with API call
            try {
               await addDoc(collection(db,"users"),{
                name,
                email,
                phone
               })
                console.log('User added!');

            } catch (error) {
                console.error('Error adding user:', error);
            }
        } catch (validationError) {
            // Build an error object from Yup's validation errors
            const formErrors = {};
            if (validationError.inner && validationError.inner.length > 0) {
                validationError.inner.forEach((err) => {
                    // Only add the error message for the first error of each field
                    if (!formErrors[err.path]) {
                        formErrors[err.path] = err.message;
                    }
                });
            } else {
                formErrors[validationError.path] = validationError.message;
            }
            setErrors(formErrors);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>

            <View style={{ flex: 1 }}>
                {
                    loading &&
                    <View style={{ position: "absolute", top: '50%', right: "46%", backgroundColor: 'white', zIndex: 9, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 10 }}>
                        <ActivityIndicator animating={true} />
                    </View>
                }
                {status && (

                    <View style={{ margin: 20 }}>

                        {/* {status === 1 ? <Success
              message={message}
            /> :
              status === 2 ? <Failed
                message={message.error}
              /> :
                <></>
            } */}

                    </View>
                )
                }
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 30, marginHorizontal: 30, marginTop: 30, color: colors.text }}>
                        SignUp
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'center', margin: 10, gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                        <TextInput
                            placeholder="Enter User ame"
                            mode="outlined"
                            value={name}
                            onChangeText={setName}
                            error={!!errors.name}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <TextInput
                            placeholder="Enter Your Email"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            error={!!errors.email}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <TextInput
                            placeholder="Enter Your Phone"
                            mode="outlined"
                            // secureTextEntry={textSecure}
                            value={phone}
                            keyboardType='number-pad'
                            maxLength={10}
                            onChangeText={setPhone}
                            error={!!errors.phone}

                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        <View style={{ marginTop: 50 }}>

                            <CustomBtn
                                title="SignUp"
                                txtColor={colors.white}
                                bg={colors.Primary}
                                onPress={handleSubmit}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <Text style={{ fontSize: 16, color: colors.text }}>Already have an account?</Text><TouchableOpacity onPress={() => handleNavigation()}><Text style={{ fontSize: 16, color: colors.Primary, fontWeight: '400' }}> Login</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ThemeProvider>

    );
};

export default Signup;

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginLeft: 10,
        marginTop: -5,
    },
});