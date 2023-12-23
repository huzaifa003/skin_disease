import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebase_app, db, auth} from "../Components/DB";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { onAuthStateChanged } from "firebase/auth";

const ShowAppointments = () => {
    const navigation = useNavigation();
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in");
                console.log(user.uid);
                setUser(user.uid);
                getAppointments();
            } else {
                console.log("User is signed out");
                navigation.navigate("Login");

            }
        });
        const getAppointments = async () => {
            const appointmentsRef = ref(db, `patients/${user}/`);
            onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data);
                const prods = Object.values(data);
                setAppointments(prods);
            });
        };

    }, []);

    return (
        <View>
            <Text>Appointments</Text>
            {/* {appointments?.map((appointment) => (
                <Text key={appointment.id}>{appointment.description}</Text>
            ))} */}
        </View>
    );
}
export default ShowAppointments;