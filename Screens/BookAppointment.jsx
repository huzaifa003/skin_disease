import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, Platform } from "react-native";
import { auth, db, storage, firebase_app } from "../Components/DB";
import { useNavigation } from "@react-navigation/native";
import Camera from "./CameraScreen";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native";
import { getStorage, uploadBytes, ref as refStorage } from "firebase/storage";
import { set, ref, getDatabase } from "firebase/database";
import { useRef } from "react";

export default function BookAppointment() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageRef, setImageRef] = useState(null);
    const [uploading, setUploading] = useState(false); // Added state for uploading status

    const descriptionRef = useRef(0);

    function chooseImage(imgUri) {
        setImage(imgUri);
        console.log(imgUri);
    }

    const database = getDatabase(firebase_app);
    const store = getStorage(firebase_app);
    function handleSendData() {
        console.log(storage);
        if (user && description && image) {
            let path = Date.now() + Math.random();
            path = path.toString();
            path = path.replace(".", "")
            path = path.replace("#", "")
            path = path.replace("$", "")
            path = path.replace("[", "")
            path = path.replace("]", "")
            path = path.replace("/", "")
            
            
            path.replace(" ", "")
            path.replace(" ", "")
            const imageStorageRef = refStorage(storage, `images/${user}/${path}`);
            console.log(path)
            fetch(image.uri)
                .then((response) => {
                    return response.blob();
                })
                .then((blob) => {
                    setUploading(true); // Set uploading status to true
                    console.log(blob);
                    // setUploading(true); // Set uploading status to true
                    uploadBytes(imageStorageRef, blob)
                        .then((snapshot) => {
                            set(ref(database, `/patients/${user}/${path}`), {
                                user: user,
                                description: description,
                                image: image.uri,
                                status: "pending",
                                path: path,
                            })
                                .then(() => {
                                    console.log("Data sent successfully!");
                                    setDescription("");
                                    setImage(null);
                                    setImageRef(null);
                                    setUploading(false); // Set uploading status to false after successful upload

                                })
                                .catch((error) => {
                                    console.error("Error sending data: ", error);
                                });

                            console.log("Uploaded a blob or file!" + snapshot.ref.fullPath + " " + snapshot.ref.name);
                            // setUploading(false); // Set uploading status to false after successful upload
                        })
                        .catch((error) => {
                            console.error("Error uploading a blob or file!", error);
                            // setUploading(false); // Set uploading status to false after error
                        });
                })
                .catch((error) => {
                    console.error("Error getting blob!", error);
                    setUploading(false); // Set uploading status to false after error
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
        descriptionRef.current.focus();
    }, []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Book Appointment</Text>
                <TextInput
                    ref={descriptionRef}
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

                
                {uploading && <ActivityIndicator size="large" color="blue" />} 

                {/* <TouchableOpacity style={styles.button} onPress={()=>{navigation.reset({"index": 0, routes : [{"name": "ShowAppointments"}]})}}>
                    <Text style={styles.buttonText}>Show Appointments</Text>
                </TouchableOpacity> */}


            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContainer: {
        flexGrow: 1,
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
