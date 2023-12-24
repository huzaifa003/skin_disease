import { View, Text, Button } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default DermatologistHome = () => {
    const navigation = useNavigation()

    const handleLogout = () => {
        navigation.reset({index: 0, routes: [{name: "SignUp"}]})
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text>
                Dermatologist Home
            </Text>
            <Button
                title="Logout"
                onPress={handleLogout}
            />
        </View>
    )
}