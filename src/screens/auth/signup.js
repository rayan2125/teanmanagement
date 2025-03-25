import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
// import CustomButton from "../../components/customButton";
import { ActivityIndicator, DefaultTheme, TextInput, ThemeProvider, Icon } from 'react-native-paper';
// import { Icon, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import RBSheet from 'react-native-raw-bottom-sheet';
// import { callAxios } from "@/services/api";
// import { API_CONSTANTS } from '@/constants/ApiCollection';
// import { Success, Failed } from "@/services/utilities"
import { colors } from '../../constants/colors';
import CustomBtn from '../../components/customBtn';
import { db } from '../../firebase/firebaseconfig';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { setUser, setUserImg } from '../../redux/Reducers/auth.redux';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import DeleteDailog from '../../components/deleteDailog';
const signupSchema = Yup.object().shape({

    name: Yup.string().required('Name is required'),
    userName: Yup.string().required('User Name is required'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    phone: Yup.string()
        .min(6, 'phone must be at least 6 characters')
        .required('phone is required'),
});


const Signup = () => {
    let dispatch = useDispatch()
    const userImg = useSelector(state => state.auth.userImg);
    const authData = useSelector(state => state.auth.authData)
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
    const refRBSheet = useRef();
    const [name, setName] = useState('');
    const [userName, setUserNameName] = useState('');
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [openModal, setModal] = useState(false)
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.goBack();
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
    const handleDeleteImage = () => {
        dispatch(setUserImg(null));  // Clear image
        setModal(false); // Close modal
    };
    const handleSubmit = async () => {

        setErrors({});
        setLoading(false)
        const formValues = { name, userName, email, phone };

        try {

            await signupSchema.validate(formValues, { abortEarly: false });

            try {
                await addDoc(collection(db, "users"), {
                    name,
                    userName,
                    email,
                    phone,
                })
                let data = { name, email, phone }
                console.log('User added!');
                dispatch(setUser(data))
                navigation.navigate("Home")
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
        <SafeAreaView style={{ flex: 1 }}>

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
                        <Text style={{ fontSize: 30, marginHorizontal: 30, marginTop: 30, color: colors.text, marginBottom: 50 }}>
                            SignUp
                        </Text>
                        {
                            userImg ? (
                                <View style={{ alignSelf: 'center', marginBottom: 0, }}>
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
                                <TouchableOpacity
                                    onPress={handleOpen}
                                    style={{
                                        alignSelf: 'center',
                                        height: 100,
                                        width: 100,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'grey',
                                        borderRadius: 100,
                                    }}>
                                    <Text>img</Text>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 5,
                                            right: 5,
                                            backgroundColor: 'white',
                                            borderRadius: 100,
                                            height: 20,
                                            width: 20,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Icon source="pen" />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        <Modal
                            visible={openModal}
                            transparent={true}
                            onRequestClose={() => setModal(false)}
                        >
                            {openModal && (
                                <DeleteDailog
                                    onDelete={handleDeleteImage}  // Pass function to delete image
                                    onClose={() => setModal(false)} // Close modal when "X" clicked
                                />
                            )}
                        </Modal>
                        <View style={{ flex: 1, justifyContent: 'center', top: -50, margin: 10, gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                            <TextInput
                                placeholder="Enter Full name"
                                mode="outlined"
                                value={name}
                                onChangeText={setName}
                                error={!!errors.name}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            <TextInput
                                placeholder="Enter User name"
                                mode="outlined"
                                value={userName}
                                onChangeText={setUserNameName}
                                error={!!errors.userName}
                            />
                            {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}

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
            </ThemeProvider>
        </SafeAreaView>

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