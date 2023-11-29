import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db, storage, firebase_app } from "../Components/DB";
import { useNavigation } from "@react-navigation/native";
import Camera from "./CameraScreen";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native";
import { getStorage, uploadBytes, ref as refStorage } from "firebase/storage";
import {set, ref, getDatabase } from "firebase/database";

export default function BookAppointment() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageRef, setImageRef] = useState(null);

    function chooseImage(imgUri) {
        setImage(imgUri);
        console.log(imgUri);
    }

    const database = getDatabase(firebase_app);
    const store = getStorage(firebase_app);
    function handleSendData() {
        console.log(storage)
        if (user && description && image) {
            const imageStorageRef = refStorage(storage, `images/${user}/${image.uri}`);

            fetch(image.uri).then((response) => {
                return response.blob();
            }
            ).then((blob) => { 
                console.log(blob);
                uploadBytes(imageStorageRef, blob)
                .then((snapshot) => {
                    console.log("Uploaded a blob or file!");
                })
                .catch((error) => {
                    console.error("Error uploading a blob or file!", error);
                });
            }
            ).catch((error) => {
                console.error("Error getting blob!", error);
            }
            );


        

            set(ref(database, `/patients/${user}/`), {
                user: user,
                description: description,
                image: image.uri,
            })
                .then(() => {
                    console.log("Data sent successfully!");
                })
                .catch((error) => {
                    console.error("Error sending data: ", error);
                });
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(uid);
            } else {
                navigation.navigate("Login");
            }
        });
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Book Appointment</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            {image && <Image source={{ uri: image.uri }} style={styles.image} />}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("CameraScreen", { chooseImage })}
            >
                <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSendData}>
                <Text style={styles.buttonText}>Send Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    image: {
        width: "100%",
        height: 200,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "blue",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
