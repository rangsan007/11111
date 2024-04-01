import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Alert } from 'react-native';
import { firebase } from '../database/FirebaseDb';
import { ThemeProvider, Button, Input, Image, CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';


class UserDetailScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            WeightLength: "",
            livewhen: "",
            breed: "",
            image: "",
            features: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const dbRef = firebase.firestore().collection('react-native-crud').doc(this.props.route.params.userKey);

        dbRef.get().then((res) => {
            if (res.exists) {
                const user = res.data();
                this.setState({
                    key: res.id,
                    name: user.name,
                    WeightLength: user.WeightLength,
                    livewhen: user.livewhen,
                    breed: user.breed,
                    image: user.image,
                    features: user.features || [],
                    isLoading: false
                });
            } else {
                console.log('Document does not exist!');
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    inputValueUpdate = (val, prop) => {
        this.setState({ [prop]: val });
    };

    updateUser = () => {
        const { name, WeightLength, livewhen, breed, image, features, key } = this.state;

        if (!name.trim()) {
            Alert.alert('Please enter a name');
            return;
        }

        this.setState({ isLoading: true });

        const updateDBRef = firebase.firestore().collection('react-native-crud').doc(key);
        updateDBRef.set({
            name,
            WeightLength,
            livewhen,
            breed,
            image,
            features,
        }).then(() => {
            this.setState({
                name: '',
                WeightLength: '',
                livewhen: '',
                breed: '',
                image: '',
                features: [],
                isLoading: false
            });
            this.props.navigation.navigate('UserScreen');
        }).catch((error) => {
            console.error('Error:', error);
            this.setState({ isLoading: false });
        });
    };

    deleteUser = () => {
        const dbRef = firebase.firestore().collection('react-native-crud').doc(this.props.route.params.userKey);
        dbRef.delete().then(() => {
            console.log("Item removed from database");
            this.props.navigation.navigate('UserScreen');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    openTwoButtonAlert = () => {
        Alert.alert(
            'Delete User',
            'Are you sure?',
            [
                { text: 'Yes', onPress: () => this.deleteUser() },
                { text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel' }
            ],
            {
                cancelable: true
            }
        );
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            );
        }

        return (
            <ThemeProvider theme={theme}>
                <ScrollView style={styles.container}>
                    <Image
                        source={{ uri: this.state.image }}
                        style={{ width: 250, height: 250, alignSelf: 'center' }}
                    />
                    <Input
                        placeholder='Dinosaur name'
                        value={this.state.name}
                        onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                    />
                    <Input
                        placeholder='Weight Length'
                        value={this.state.WeightLength}
                        onChangeText={(val) => this.inputValueUpdate(val, 'WeightLength')}
                    />
                    <Input
                        placeholder='Livewhen'
                        value={this.state.livewhen}
                        onChangeText={(val) => this.inputValueUpdate(val, 'livewhen')}
                    />
                    <Input
                        placeholder=' Breed'
                        value={this.state.breed}
                        onChangeText={(val) => this.inputValueUpdate(val, 'breed')}
                    />
                    <Input
                        placeholder='Uri image'
                        value={this.state.image}
                        onChangeText={(val) => this.inputValueUpdate(val, 'image')}
                    />
                    <View style={styles.dropdownContainer}>
                    <Picker
                        selectedValue={this.state.breed}
                        style={styles.dropdownPicker}
                        onValueChange={(itemValue) => this.inputValueUpdate(itemValue, 'breed')}
                    >
                        <Picker.Item label="Choose a species of dinosaur" value="" />
                        <Picker.Item label="Ankylosaurus" value="Ankylosaurus Dinosaur" />
                        <Picker.Item label="Apatosaurus" value="Apatosaurus Dinosaur" />
                        <Picker.Item label="Baryonyx" value="Baryonyx Dinosaur" />
                        <Picker.Item label="Dimorphodon" value="Dimorphodon Dinosaur" />
                        <Picker.Item label="Edmontosaurus" value="Edmontosaurus Dinosaur" />
                        {/* Add more species as needed */}
                    </Picker>
                    <Input
                            placeholder='breed Name'
                            value={this.state.breed}
                            onChangeText={(val) => this.inputValueUpdate(val, 'breed')}
                        />

                    </View>
                    <View style={styles.checked}>
                        <CheckBox
                            title='Plain color'
                            checked={this.state.features.includes('Plain color')}
                            onPress={() => this.inputValueUpdate(
                                this.state.features.includes('Plain color') ?
                                    this.state.features.filter(item => item !== 'Plain color') :
                                    [...this.state.features, 'Plain color'],
                                'features'
                            )}
                        />
                        <CheckBox
                            title='Special color'
                            checked={this.state.features.includes('Special color')}
                            onPress={() => this.inputValueUpdate(
                                this.state.features.includes('Special color') ?
                                    this.state.features.filter(item => item !== 'Special color') :
                                    [...this.state.features, 'Special color'],
                                'features'
                            )}
                        />
                    </View>
                    <Button
                     icon={{
                        type: 'font-awesome',
                        name: 'check',
                        size: 15,
                        color: 'white'
                    }}
                        title='Update'
                        onPress={this.updateUser}
                        buttonStyle={{
                            backgroundColor: "blue"
                        }}
                    />
                    <Button 
                    icon={{
                            type: 'font-awesome',
                            name: '',
                            size: 15,
                            color: 'white'
                        }}
                        title='Delete'
                        onPress={() =>this.deleteUser()}
                        //onPress={this.openTwoButtonAlert}
                        buttonStyle={{
                            backgroundColor: "red"
                        }}
                        
                    />
                </ScrollView>
            </ThemeProvider>
        );
    }
}

const theme = {
    Button: {
        raised: true
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
    },
    dropdownContainer: {
        marginBottom: 15,
    },
    dropdownPicker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    preloader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "left",
        marginBottom: 15,
    }
});

export default UserDetailScreen;
