import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import { Text, ListItem, Divider, Rating, Input, Button } from 'react-native-elements';

import API from '../API'

import { ImagePicker, Permissions } from 'expo';

const defaultImage = 'https://5.imimg.com/data5/YY/EN/MY-8155364/fresh-apple-500x500.jpg'


class CreateReviewScreen extends React.Component {

    state = {
        title: '',
        description: '',
        beforeImage: defaultImage,
        afterImage: defaultImage
    }

    checkCameraRollPermisson = async () => {
        const { Permissions } = Expo
        const { status} = await Permissions.getAsync(Permissions.CAMERA_ROLL)
        if (status === 'granted') {
            this.addImage()
        }
        else {
            const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (newPermission.status === 'granted') {
                this.addImage()
            }
        }
      }

    addImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
          });
      
        if (!result.cancelled) {
            if (this.state.beforeImage === defaultImage) {
                this.setState({ beforeImage: result });
            } else {
                this.setState({ afterImage: result });
            }
        }  
    }

    uploadReview = () => {
        const {title, description, beforeImage, afterImage} = this.state

        if (title && description && beforeImage !== defaultImage && afterImage !== defaultImage) {
            //MAKE POST REQUEST TO BACKEND
            const body = {user_id: 1, practitioner_id: 1, title, text: description, star: 4}
            
            API.uploadReview(beforeImage, afterImage, body)
                .then(data => console.log("DATA FROM UPLOAD", data))
            

        } else  {
            alert("Please fill in all fields! 😕")
        }
    }

    

    render() {
        return (
            <View style={styles.container}>
                <Text h3>Add a review</Text>
                <Text style={styles.formTitle}>Title</Text>
                <TextInput value={this.state.title} onChangeText={(text) => this.setState({title: text})} multiline={true} style={[{height: 60}, styles.textInputBorder]}></TextInput>
                <Text style={styles.formTitle}>Description</Text>
                <TextInput value={this.state.description} onChangeText={(text) => this.setState({description: text})} multiline={true} style={[{height: 100}, styles.textInputBorder]}></TextInput>

                <View style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection: 'row' ,height: 200}}>
                        <Image source={{ uri: this.state.beforeImage.uri }} style={{ flex: 1, resizeMode: 'cover'}} />
                        <Image source={{ uri: this.state.afterImage.uri }} style={{ flex: 1, resizeMode: 'cover'}} />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row' ,height: 50}}>
                        <Text style={{flex: 1}}>Before</Text>
                        <Text style={{flex: 1}}>After</Text>
                    </View>
                </View>
                
                <Button onPress={this.checkCameraRollPermisson} title="Add images"/>
                <Button onPress={this.uploadReview} title="Create review"/>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
    }, 
    formTitle: {
        fontSize: 24,  
    },
    textInputBorder: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
    }
})
export default CreateReviewScreen