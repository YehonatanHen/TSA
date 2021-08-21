import React, { useState } from 'react'
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'

import Input from '../components/UI/Input'

const formReducer = (state, action) => {

}


//Building the signing up at first, later we will add the login :)
const AuthScreen = props => {
    const [isSignup, setIsSignup] = useState(false)

    return (
        <KeyboardAvoidingView>
            <View>
                <Text style={styles.label}>{isSignup ? 'Sign Up' : 'Login'}</Text>
            </View>
            <View style={styles.inputForm}>
                <ScrollView>
                    <Input
                        required
                        email
                        keyboardType="email-address"
                        errorText="Please enter a valid email address."
                        initialValue=''
                    />
                    <Input
                        required
                        password
                        keyboardType="default"
                        errorText="Please enter a valid password."
                        secureTextEntry={true}
                        initialValue=''
                    />
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                <Button title={'Submit'} />
                <Button
                    title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                    onPress={() => {
                        setIsSignup(prevState => !prevState);
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

styles = StyleSheet.create({
    label: {
        fontSize: 20
    },
    inputForm: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {

    }
})

export default AuthScreen
