import React, { useEffect, useState } from 'react'
import { Button, View, StyleSheet, TextInput, Alert } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { useDispatch } from 'react-redux'

import { changePassword } from '../../store/actions/data/userData'

const ResetPassword = props => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmedPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const submitHandler = async () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9]).*$/
        if (passwords.newPassword !== passwords.confirmedPassword) {
            Alert.alert('Error!', 'Passwords does not match')
        }
        else if (!passwordRegex.test(passwords.newPassword)) {
            Alert.alert('Error!', 'Password must contain 6 characters that includes numbers and letters')
        }
        else {
            try {
                setIsLoading(true)
                dispatch(changePassword(passwords.newPassword))
                await setIsLoading(false)
                Alert.alert('Password changed succcessfully.')
            } catch (error) {
                Alert.alert('Error!', error)
            } 
            
            
        }

    }

    return (
        <View style={styles.screen}>
            <View style={styles.inputForm}>
                <TextInput
                    style={styles.input}
                    required
                    placeholder="New password"
                    keyboardType="default"
                    initialValue=''
                    secureTextEntry={true}
                    onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
                />

                <TextInput
                    style={styles.input}
                    required
                    placeholder="Confirm the new password"
                    keyboardType="default"
                    initialValue=''
                    secureTextEntry={true}
                    onChangeText={(text) => setPasswords({ ...passwords, confirmedPassword: text })}
                />
                <View style={{ marginTop: 10 }}>
                    {!isLoading ? (
                        <Button title='Reset Password' onPress={submitHandler} color="deepskyblue" />
                    ) : (
                        <ActivityIndicator size="small" color="grey" />
                    )}
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white'
    },
    inputForm: {
        width: '100%',
        padding: 10,
    },
    input: {
        // flex: 1,
        paddingHorizontal: 2,
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        marginBottom: 2
    },
})

export default ResetPassword
