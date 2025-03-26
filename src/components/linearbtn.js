import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../constants/colors';
const Linearbtn = () => {
    return (
        <>
            <LinearGradient colors={[colors.orgbtn, colors.Primary]}
                start={{ x: 0.1, y: 0.0 }} end={{ x: 0.5, y: 1.0 }}
                style={styles.linearGradient}>
                <Text style={styles.buttonText}>
                    Invite & Create Team
                </Text>
            </LinearGradient>
        </>
    )
}

export default Linearbtn

const styles = StyleSheet.create({
    linearGradient: {


        borderRadius: 30,
        height: 45,
        // paddingVertical:10,
        //   paddingHorizontal:20,
        //   paddingVertical: 20, paddingHorizontal: 20,
        //   bottom:20,
        alignItems: 'center',
        top: 20,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        //   fontFamily: 'serif',
        textAlign: 'center',

        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});