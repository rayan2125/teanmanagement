import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'
import { useNavigation } from '@react-navigation/native'


const Header = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView>

            <View style={{ backgroundColor: colors.white, height: 80, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', top: 10, margin: 15 }}>
                    <Text style={{ marginHorizontal: 0 }} onPress={() => navigation.goBack()}>Arrow</Text>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', left: 15 }}>Registeration For Tournaments</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({})