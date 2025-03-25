import React from "react";
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";



const Teams = () => {
    return (
        <View style={{
            flexDirection: "column",
            height: 200,
            // shadowColor: "#000",
            // shadowOpacity: 0.1,
            // shadowOffset: { width: 0, height: 2 },
            // shadowRadius: 4,
            // elevation: 3, // For Android shadow
            backgroundColor: "#fff",
            borderRadius: 20,
            borderColor: '#ccc',
            borderWidth: 1,
        }}>
            <View style={styles.panel}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../assets/logo-2.jpg")} style={{ height: 60, borderRadius: 20, width: 60, resizeMode: 'cover', }} />
                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '500', left: 10 }}>Team Members</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Image source={require("../assets/logo-1.png")} style={{ height: 30, width: 30, resizeMode: 'contain', }} /> */}
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500', left: 10 }}>Delete</Text>
                        <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 100, borderWidth: 1, borderColor: "#ccc" }}>
                            {/* <Text>btn</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.panel}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>

                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>Team Members:</Text>
                    {/* <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>Team Members</Text> */}
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require("../assets/logo-2.jpg")} style={{ height: 60, borderRadius: 20, width: 60, resizeMode: 'cover',left:50,zIndex:100 }} />
                            <Image source={require("../assets/logo-1.png")} style={{ height: 60, borderRadius: 20, width: 60, resizeMode: 'cover',left:30,zIndex:50 }} />
                            <Image source={require("../assets/logo-2.jpg")} style={{ height: 60, borderRadius: 20, width: 60, resizeMode: 'cover', }} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    panel: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
    },


    divider: {
        height: 1,
        backgroundColor: "#ccc",
        width: "100%",
    },
});

export default Teams;
