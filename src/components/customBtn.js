import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

const CustomBtn = ({ bg, txtColor, title, onPress,disabled }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{ backgroundColor: bg, width: '100%', borderRadius: 100, paddingVertical: 20, paddingHorizontal: 20, bottom: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: txtColor }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomBtn

const styles = StyleSheet.create({})