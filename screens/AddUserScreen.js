import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemeProvider, Button, Input, Image, CheckBox } from 'react-native-elements';
import { firebase } from '../database/FirebaseDb';
import { Picker } from '@react-native-picker/picker';

class AddUserScreen extends Component {
    constructor() {
        super();

        this.dbRef = firebase.firestore().collection('react-native-crud');
        this.state = {
            name: "",
            WeightLength: "",
            livewhen: "",
            breed: "", // แก้ชื่อ state ให้เป็น breed
            image: "",
            isLoading: false,
            features: [] // เพิ่ม state สำหรับเก็บข้อมูล features
        }
    }

    inputValueUpdate = (val, prop) => {
        this.setState({ [prop]: val });
    }

    toggleFeature = (feature) => {
        const { features } = this.state;
        if (features.includes(feature)) {
            this.setState({ features: features.filter(item => item !== feature) });
        } else {
            this.setState({ features: [...features, feature] });
        }
    }

    storeUser = () => {
        if (this.state.name == '') {
            alert('กรุณากรอกข้อมูล !');
        } else {
            this.setState({
                isLoading: true
            })
            this.dbRef.add({
                name: this.state.name,
                WeightLength: this.state.WeightLength,
                livewhen: this.state.livewhen,
                breed: this.state.breed, // แก้ให้ใช้ state ชื่อ breed
                image: this.state.image,
                features: this.state.features // เพิ่ม features ไปยังข้อมูลที่จะเก็บ
            }).then((res) => {
                this.setState({
                    name: "",
                    WeightLength: "",
                    livewhen: "",
                    breed: "", // รีเซ็ต breed เป็นค่าว่าง
                    image: "",
                    isLoading: false,
                    features: [] // รีเซ็ต features ให้เป็น array ว่าง
                })
                this.props.navigation.navigate('UserScreen');
            })
            .catch((err) => {
                console.log('Error found: ', err);
                this.setState({
                    isLoading: false
                })
            })
        }
    }

    render() {
        if (this.state.isLoading){
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }

        return (
            <ThemeProvider theme={theme}>
                <ScrollView style={styles.container}>
                    <Image 
                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiC7aItz6i-WSAjNvZs9Ddu_oD3-xlS3hz7w&usqp=CAU' }}
                        style={{ width: 200, height: 200 }}
                        containerStyle={{ marginLeft: 'auto', marginRight:'auto' }}
                    />
                    <Input
                        leftIcon={{
                            name:'',
                            type: 'font-awesome',
                            size: 20    
                        }}
                        placeholder={'  Dinosaur name'}
                        value={this.state.name}
                        onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                    />
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            size: 20
                        }}
                        placeholder={' Weight Length'}
                        value={this.state.WeightLength}
                        onChangeText={(val) => this.inputValueUpdate(val, 'WeightLength')}
                    />
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            size: 20,
                        }}
                        placeholder={'  livewhen'}
                        value={this.state.livewhen}
                        onChangeText={(val) => this.inputValueUpdate(val, 'livewhen')}
                    />
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            size: 20,
                        }}
                        placeholder={'  Breed'}
                        value={this.state.breed}
                        onChangeText={(val) => this.inputValueUpdate(val, 'breed')}
                    />
                    <Input
                        leftIcon={{
                            type: 'font-awesome',
                            size: 20,
                        }}
                        placeholder={'  Uri image'}
                        value={this.state.image}
                        onChangeText={(val) => this.inputValueUpdate(val, 'image')}
                    />
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={this.state.breed}
                            style={styles.dropdownPicker}
                            onValueChange={(itemValue, itemIndex) => this.inputValueUpdate(itemValue, 'breed')}
                        >
                            <Picker.Item label="Choose a species of dinosaur" value="" />
                            <Picker.Item label="Ankylosaurus" value="Ankylosaurus Dinosaur" />
                            <Picker.Item label="Apatosaurus" value="Apatosaurus Dinosaur" />
                            <Picker.Item label="Baryonyx" value="Baryonyx Dinosaur" />
                            <Picker.Item label="Dimorphodon" value="Dimorphodon Dinosaur" />
                            <Picker.Item label="Edmontosaurus" value="Edmontosaurus Dinosaur" />
                            {/* Add more species as needed */}
                        </Picker>
                    </View>
                    <CheckBox
                        title='Plain color'
                        checked={this.state.features.includes('Plain color')}
                        onPress={() => this.toggleFeature('Plain color')}               
                    />
                    <CheckBox
                        title='Special color'
                        checked={this.state.features.includes('Special color')}
                        onPress={() => this.toggleFeature('Special color')}               
                    />
                    <Button
                        icon={{
                            type: 'font-awesome',
                            name: 'check',
                            size: 15,
                            color: 'white'
                        }}
                        title='  Add information'
                        buttonStyle={{
                            backgroundColor: "blue"
                        }}
                        onPress={() => this.storeUser()}
                    />
                    <Button
                        icon={{
                            type: 'font-awesome',
                            name: 'tv',
                            size: 15,
                            color: 'black'
                        }}
                        title='  View information'
                        buttonStyle={{
                            backgroundColor: "pink"
                        }}
                        onPress={() => this.props.navigation.navigate('UserScreen')}
                        containerStyle={{
                            marginTop: 10
                        }}
                    />
                </ScrollView>
            </ThemeProvider>
        )
    }
}

const theme = {
    Button: {
        raised: true
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35
    },
    dropdownContainer: {
        marginBottom: 20,
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
        buttom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        flexDirection :"row",
        flexWrap: "wrap",
        justifyContent:"left",
        marginBottom: 15
    }
})

export default AddUserScreen;
