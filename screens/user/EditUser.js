import React, { useEffect, useState, useCallback, useReducer } from 'react'
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, Keyboard } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Input from '../../components/Inputs/LoginAndSignUp/Input'
import AutoCompleteInput from '../../components/Inputs/LoginAndSignUp/autoCompleteInput'
import MultipleInput from '../../components/Inputs/LoginAndSignUp/multipleInput'
import ImagePicker from '../../components/pickers/ImagePicker'
import LocationPicker from '../../components/pickers/LocationPicker'

import * as userDataActions from '../../store/actions/userData'
import InstitutesModal from '../../components/modals/institutesListModal'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

//Building the signing up at first, later we will add the login :)
const EditUser = props => {
    const user = useSelector(state => state.userData)
    console.log(user)

    const [selectedImage, setSelectedImage] = useState()
    const [selectedLocation, setSelectedLocation] = useState()
    const [isSignup, setIsSignup] = useState(false)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isModalShown, setIsModalShown] = useState(false)

    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
            role: '',
            fname: '',
            lname: '',
            institute: '',
            bio: '',
            courses: [],
            phone: '',
        },
        inputValidities: {
            email: false,
            password: false,
            role: false,
            fname: false,
            lname: false,
            institute: false,
            bio: false,
            phone: false,
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An Error occured!', error, [{ text: 'OK' }])
        }
    }, [error])


    const authHandler = async () => {
        let action;
        action = userDataActions.updateUser(
            formState.inputValues.email,
            formState.inputValues.password,
            formState.inputValues.role,
            formState.inputValues.fname,
            formState.inputValues.lname,
            formState.inputValues.institute,
            formState.inputValues.email,
            formState.inputValues.password
        )
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
        } catch (err) {
            console.log(err)
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier //id
            });
        },
        [dispatchFormState]
    );

    const imageTakenHandler = imagePath => {
        setSelectedImage(imagePath)
    }

    const locationPickedHandler = useCallback(location => {
        setSelectedLocation(location)
    }, [])

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
            style={styles.screen}
        >
            <View style={styles.inputForm}>
                <ScrollView>
                    <ImagePicker
                        onImageTaken={imageTakenHandler}
                        uri={user.imageUrl}
                        editPage
                    />
                    <Input
                        required
                        email
                        id="email"
                        placeholder="E-Mail"
                        keyboardType="email-address"
                        errorText="Please enter a valid email address."
                        onInputChange={inputChangeHandler}
                        initialValue={user.email}
                    />
                    <Input
                        required
                        id="fname"
                        placeholder="First Name"
                        keyboardType="default"
                        errorText="Please enter a valid name."
                        onInputChange={inputChangeHandler}
                        initialValue={user.firstName}
                    />
                    <Input
                        required
                        id="lname"
                        placeholder="Last Name"
                        keyboardType="default"
                        errorText="Please enter a valid name."
                        onInputChange={inputChangeHandler}
                        initialValue={user.lastName}
                    />
                    <View style={styles.autoCompleteInstituteContainer}>
                        <View style={styles.autoCompleteInput}>
                            <AutoCompleteInput
                                required
                                id="institute"
                                onInputChange={inputChangeHandler}
                                placeholder='Institute Name'
                                initialValue={user.institute}
                            />
                        </View>
                        <View style={styles.findButtonContainer}>
                            <Button title='Find' onPress={() => setIsModalShown(true)} />
                            <InstitutesModal
                                isShown={isModalShown}
                                setIsModalShown={setIsModalShown}
                            />
                        </View>
                    </View>
                    <Input
                        id="bio"
                        isTextArea={true}
                        numberOfLines={4}
                        multiline
                        placeholder='Type a short bio about yourself :)'
                        initialValue={user.bio}
                        onInputChange={inputChangeHandler}
                        maxLength={100}
                        style={styles.bio}
                    />
                    {user.role === 'tutor' && (
                        <MultipleInput
                            id="courses"
                            placeholder='Type course name'
                            initialValue={user.courses}
                            required
                            onInputChange={inputChangeHandler}
                            maxLength={100}
                            style={styles.bio}
                            errorText='Enter one course at least'
                        />
                    )}
                    <Input
                        id="phone"
                        placeholder="Enter your phone number - format: xxx-xxx-xxxx"
                        initialValue={user.phone}
                        phoneNumber
                        onInputChange={inputChangeHandler}
                        keyboardType='phone-pad'
                        errorText='Phone number is invalid'
                    />
                    <LocationPicker
                        navigation={props.navigation}
                        route={props.route}
                        onLocationPicked={locationPickedHandler}
                    />
                    <Input
                        required
                        password
                        id="password"
                        placeholder="Confirm by typing your password"
                        keyboardType="default"
                        errorText="Valid password must conatain one letter, one number and 6 charcates at least"
                        secureTextEntry={true}
                        onInputChange={inputChangeHandler}
                        initialValue={user.password}
                    />
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            {isLoading ?
                                (<ActivityIndicator size='small' color={'deepskyblue'} />) :
                                (<Button title={'Submit'} color='deepskyblue' onPress={authHandler} />)}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}


styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    label: {
        fontSize: 20
    },
    inputForm: {
        width: '100%',
        padding: 10,
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        display: 'flex',
        alignItems: "center"
    },
    button: {
        marginVertical: 3
    },
    autoCompleteInstituteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    autoCompleteInput: {
        flex: 1
    },
    findButtonContainer: {
        height: '40%',
        marginTop: 10,
        marginLeft: 2
    },
})

export default EditUser