import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./navigations/rootNavigation";
import { StatusBar } from "react-native";
import { colors } from "./constants/colors";
import store from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
const App = () => {
    let persistor = persistStore(store);
    return (
        <>
            {/* <StatusBar backgroundColor={colors.text} /> */}
            <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
                <RootNavigation />
            </NavigationContainer>
            </PersistGate>
            </Provider>
        </>
    )
}
export default App;