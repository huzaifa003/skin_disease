import { onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Input, Button, Switch } from 'react-native-elements';
import { auth } from '../Components/DB';
import { Context } from '../Global/Context';
import { useContext } from 'react';

const SignIn = ({ navigation }) => {
  const { background, setBackground } = useContext(Context);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: background,
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: '#333',
    },
    errorText: {
      backgroundColor: 'red',
      padding: 10,
      marginBottom: 20,
      color: '#fff',
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    toggleLabel: {
      fontSize: 14,
      marginLeft: 10,
    },
    button: {
      width: '100%',
      backgroundColor: '#007bff',
      borderRadius: 4,
    },
    buttonTitle: {
      fontSize: 16,
    },
  });
  
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({ index: 0, routes: [{ name: 'ShowAppointments' }] });
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      if (email === "derm" && password === "derm") {
        navigation.reset({ index: 0, routes: [{ name: 'DermatologistHome' }] });
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
    } catch (error) {
      setError('Sign In failed: ' + error.message);
      setDisplayError(true);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setBackground(isDarkMode ? 'lightgrey' : 'lightblue');
    console.log(background);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.toggleContainer}>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
        <Text style={styles.toggleLabel}>Toggle Theme</Text>
      </View>

      {displayError && <Text style={styles.errorText}>{error}</Text>}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        labelStyle={styles.label}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={handleSignIn}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
      />
      
    </KeyboardAvoidingView>
  );
};

export default SignIn;
