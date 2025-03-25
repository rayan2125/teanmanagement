import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigations/rootNavigation";
import { StatusBar } from "react-native";
import { colors } from "./constants/colors";


const App = () => {
    return (
        <>
            {/* <StatusBar backgroundColor={colors.text} /> */}
            <NavigationContainer>
                <RootNavigation />
            </NavigationContainer>
        </>
    )
}
export default App;