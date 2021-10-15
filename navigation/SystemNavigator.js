import React from 'react'
import { View, SafeAreaView, Button } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import AuthScreen from '../screens/AuthScreen'
import MainPage, { ScreenOptions as MainScreenOptions } from '../screens/MainPageScreen'
import AdminMainScreen, { screenOptions as AdminScreenOptions } from '../screens/AdminMainScreen'
import SignUpLandingPage from '../screens/SignUpLandingPage'
import MapScreen, { ScreenOptions as MapScreenOptions } from '../screens/MapScreen'
import { useDispatch, useSelector } from 'react-redux'




import * as authActions from '../store/actions/auth'

const AuthStackNavigator = createStackNavigator()

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen name="Auth" component={AuthScreen} options={{ headerTitle: 'Welcome to the Students Scheduler App!' }} />
        </AuthStackNavigator.Navigator>
    )
}

const Tab = createMaterialBottomTabNavigator();

export const TabsNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Main Menu" component={OptionsNavigator} /> 
    </Tab.Navigator>
  );
}

const OptionsDrawerNavigator = createDrawerNavigator()

export const OptionsNavigator = props => {
    const user = useSelector(state => state.auth)
    console.log(user)
    const dispatch = useDispatch() //with the dispatch we can dispatch functions from redux store 

    return <OptionsDrawerNavigator.Navigator drawerContent={props => {
        return (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <DrawerItemList {...props} />
                </SafeAreaView>
                <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <Button
                        title="Logout"
                        onPress={() => {
                            dispatch(authActions.logout())
                        }}
                    />
                </View>
            </View>
        )
    }}
    >
        {/* name={`${props.user.firstName} ${props.user.lastName}`}  */}
        <OptionsDrawerNavigator.Screen name={ user.firstName + ' ' + user.lastName} component={MainPage} options={{
            drawerIcon: props => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                    size={23}
                />
            )
        }} />
    </OptionsDrawerNavigator.Navigator>
}



const MainDrawerNavigator = createStackNavigator()

export const MainNavigator = () => {

    return (
        <MainDrawerNavigator.Navigator>
            {/* <MainDrawerNavigator.Screen name="TabsNav" component={MyTabs} options={{ headerShown: false }}/> */}
            <MainDrawerNavigator.Screen name="Update User" component={SignUpLandingPage} options={{}} />
            <MainDrawerNavigator.Screen name="Main" component={TabsNavigator} options={{ }} />
            <MainDrawerNavigator.Screen name="Map" component={MapScreen} options={MapScreenOptions} />
        </MainDrawerNavigator.Navigator>
    )
}

const AdminDrawerNavigator = createStackNavigator()

export const AdminNavigator = () => {
    return (
        <AdminDrawerNavigator.Navigator>
            <AdminDrawerNavigator.Screen name="Admin Main" component={AdminMainScreen} options={AdminScreenOptions} />
        </AdminDrawerNavigator.Navigator>
    )
}


