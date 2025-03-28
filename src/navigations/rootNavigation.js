import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home";
import CreateTeam from "../screens/teams/createTeam";
import Signup from "../screens/auth/signup";
import Login from "../screens/auth/login";
import Registration from "../screens/auth/registration";
import Profile from "../screens/profile";
import Invites from "../screens/invites";
import TeamMembers from "../screens/teams/teamMembers";


const Stack = createStackNavigator();

const RootNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreateTeam" component={CreateTeam} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Invites" component={Invites} />
            <Stack.Screen name="TeamMembers" component={TeamMembers} />
        </Stack.Navigator>
    )
}
export default RootNavigation;