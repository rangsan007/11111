import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, Image } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { firebase } from '../database/FirebaseDb';

class UserScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            userArr: []
        };
        this.firestoreRef = firebase.firestore().collection('react-native-crud');
    }

    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getCollection = (querySnapshot) => {
        const userArr = [];
        querySnapshot.forEach((doc) => {
            const { name, WeightLength, livewhen, breed, image } = doc.data();
            userArr.push({
                key: doc.id,
                name,
                WeightLength,
                livewhen,
                breed,
                image,
            });
        });
        this.setState({
            userArr,
            isLoading: false
        });
    };

    render() {
        const { isLoading, userArr } = this.state;

        if (isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            );
        }

        return (
            <ScrollView>
                {userArr.map((item, i) => (
                    <ListItem
                        key={i}
                        bottomDivider
                        onPress={() => {
                            this.props.navigation.navigate('UserDetailScreen', {
                                userKey: item.key
                            });
                        }}
                    >
                        <Badge value={i + 1} />
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 200, height: 200 }}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{"Dinosaur name : " + item.name}</ListItem.Title>
                            <ListItem.Title>{"WeightLength : " + item.WeightLength}</ListItem.Title>
                            <ListItem.Title>{"livewhen : " + item.livewhen}</ListItem.Title>
                            <ListItem.Title>{"breed : " + item.breed}</ListItem.Title>
                            <ListItem.Title>{"Image : " + item.image}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    preloader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default UserScreen;
