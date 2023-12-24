import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { firebase_app, db, auth } from "../Components/DB";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const ShowAppointments = () => {
    const navigation = useNavigation();

    const [ShowAppointments, setShowAppointments] = useState([]);
    const [shownImage, setShownImage] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const [keys, setKeys] = useState([]);
    const showRef = useRef(0);
    const [imageURLs, setImageUrls] = useState({});
    const storage = getStorage(firebase_app);
    const [refreshing, setRefreshing] = useState(false);


    const getAppointments = () => {
        const appointmentsRef = ref(db, `patients/${user}/`);
        get(appointmentsRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                const data = snapshot.val();
                setAppointments(data);
                setKeys(Object.keys(data));
            } else {
                console.log("No data available")
            }
        }).catch((error) => {
            console.log(error);
        });
    }


    function imageURL() {
        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
            const imageRef = storageRef(storage, `images/${user}/${keys[i]}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    console.log(url);
                    setImageUrls((prev) => {
                        return { ...prev, [keys[i]]: url };
                    });
                    console.log(imageURLs);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        showRef.current = 1;
        return 1;
    }

    async function storeData() {
        if (keys.length > 0) {
            console.log("STORING DATA");
            await AsyncStorage.setItem("user", user)
            await AsyncStorage.setItem("keys", JSON.stringify(keys));
            await AsyncStorage.setItem("appointments", JSON.stringify(appointments));
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in");
                console.log(user.uid);
                setUser(user.uid);

                // storeData();
            } else {
                console.log("User is signed out")
                navigation.navigate("Login");
            }
        });



        getAppointments();
        imageURL();
        setRefreshing(false);;

        return () => {
            console.log("CLEANUP");

        }

    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getAppointments();
        imageURL();
        setRefreshing(false);
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out successfully");
                navigation.reset({
                    index: 0,
                    routes: [{ name: "SignUp" }],
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Appointments</Text>
                <Ionicons
                    name="add-circle"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate("BookAppointment")}
                />
                <Ionicons
                    name="map"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate("MapScreen")}
                />
                <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="black"
                    onPress={() => navigation.navigate("Chat")}
                />
                <Button title="Logout" onPress={handleLogout} />
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {showRef.current == 1 ? (
                    keys.map((key, index) => {

                        return (
                            <TouchableOpacity key={index} style={styles.appointmentContainer} onPress={() => navigation.navigate("ShowDetails", { uri: `images/${user}/${key}`,description : appointments[key].description, status : appointments[key].status })}>
                                <View key={index} style={styles.appointmentContainer}>
                                    {/* <Image images/${user}/${keys[i]
                                    source={{ uri: url }}
                                    style={styles.image}
                                /> */}
                                    <Text style={styles.description}>
                                        {appointments[key].description}
                                    </Text>

                                    <Text style={styles.status}>
                                        {appointments[key].status}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={styles.loadingText}>Loading</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",

    },
    appointmentContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
});

export default ShowAppointments;