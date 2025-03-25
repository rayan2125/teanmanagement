import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'


const DeleteDailog = ({ onClose, onDelete,onedit }) => {
    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '(rgba(10,10,10,0.4)' }}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 25 }}>

                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                    Do You want Delete or Upadate your File?
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 }}>

                    <TouchableOpacity
                    onPress={onedit}
                    style={{ backgroundColor: colors.greenbtn, paddingHorizontal: 10, borderRadius: 20, paddingVertical: 5, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: colors.white, fontSize: 14, fontWeight: '500' }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onDelete}
                        style={{ backgroundColor:colors.redbtn, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color:colors.white, fontSize: 14, fontWeight: '500' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ position: 'absolute', right: -10, backgroundColor: 'white', height: 30, width: 30, borderRadius: 100, top: -10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={onClose}
                >
                    <Text>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DeleteDailog

const styles = StyleSheet.create({})