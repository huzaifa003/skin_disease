import { createUserWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import React, { useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Switch } from 'react-native'
import { Text, Input, Button } from 'react-native-elements';
import { auth } from '../Components/DB';
import { TouchableOpacity } from 'react-native';
import { Context } from '../Global/Context';
import { useContext } from 'react';


const SignUp = ({ navigation }) => {
    const { background, setBackground } = useContext(Context);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        setBackground(isDarkMode ? "lightgrey" : "lightblue");
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
            padding: 20,
        },
        input: {
            width: '100%',
            marginBottom: 10,
            backgroundColor: '#fff',
            borderRadius: 5,
            paddingHorizontal: 10,
        },
        label: {
            color: '#333',
            fontWeight: 'bold',
            marginBottom: 5,
        },
        button: {
            width: '100%',
            marginBottom: 20,
            backgroundColor: '#007bff',
            borderRadius: 5,
        },
        buttonTitle: {
            fontWeight: 'bold',
        },
        text: {
            marginBottom: 10,
            color: 'blue',
        },
        errorText: {
            backgroundColor: 'red',
            color: 'white',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        switchLabel: {
            marginLeft: 10,
            color: '#333',
            fontWeight: 'bold',
        },
    });

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.reset({ index: 0, routes: [{ name: "Home" }] })
                // console.log(user);
            }
        })
    }, [])

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [error, setError] = React.useState('');
    const [displayError, setDisplayError] = React.useState(false)
    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            navigation.navigate('SignIn');
        } catch (error) {
            setError('Sign up failed: ' + error.message);
            setDisplayError(true);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.switchContainer}>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                />
                <Text style={styles.switchLabel}>Toggle Theme</Text>
            </View>
            {displayError ? <Text style={styles.errorText}>{error}</Text> : null}
            <Input
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                inputStyle={styles.input}
                labelStyle={styles.label}
            />

            <Input
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                inputStyle={styles.input}
                labelStyle={styles.label}
                secureTextEntry
            />

            <Button
                title="Sign Up"
                onPress={handleSignUp}
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
            />

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.text}> Already have an account? Sign In</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default SignUp;
