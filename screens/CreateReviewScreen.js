import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

import { Text, ListItem, Divider, Rating, Input, Button } from 'react-native-elements';

import API from '../API'

import { ImagePicker, Permissions } from 'expo';
import styles from '../assets/styles'

import { connect } from 'react-redux';

const defaultImage = {uri: 'http://chittagongit.com/download/260102'}


class CreateReviewScreen extends React.Component {

    state = {
        title: '',
        description: '',
        beforeImage: defaultImage,
        afterImage: defaultImage,
        cameraRollGranted: false
    }

    componentDidMount() {
        this.checkCameraRollPermisson()
    }

    renderImageViews = () => {

        console.log("IMAGE", this.state.beforeImage.uri)

        return (
        <View style={{flex: 1, flexDirection: 'row', height: 200, marginTop: 16}}>
            <TouchableOpacity style={{flex: 1}} onPress={this.addBeforeImage}>
                <Image source={{ uri: this.state.beforeImage.uri }} style={{flex: 1, resizeMode: 'cover'}} />
            </TouchableOpacity>
            <View style={{width: 8}}></View>
            <TouchableOpacity style={{flex: 1}} onPress={this.addAfterImage}>
                <Image source={{ uri: this.state.afterImage.uri }} style={{flex: 1, resizeMode: 'cover'}} />
            </TouchableOpacity> 
        </View>)
    }

    checkCameraRollPermisson = async () => {
        
        const { Permissions } = Expo
        const { status} = await Permissions.getAsync(Permissions.CAMERA_ROLL)
        if (status === 'granted') {
            this.setState({cameraRollGranted: true})
        }
        else {
            const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (newPermission.status === 'granted') {
                this.setState({cameraRollGranted: true})
            }
        }
      }

    addImage = async () => {

        if (!this.state.cameraRollGranted) {
            this.checkCameraRollPermisson()
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
          });
      
        if (!result.cancelled) {
            if (this.state.beforeImage.uri === defaultImage.uri) {
                this.setState({ beforeImage: result });
            } else {
                this.setState({ afterImage: result });
            }
        }  
    }

    addBeforeImage = async () => {

        if (!this.state.cameraRollGranted) {
            this.checkCameraRollPermisson()
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
          });
      
        if (!result.cancelled) {
            this.setState({beforeImage: result})    
        }  
    }

    addAfterImage = async () => {
        if (!this.state.cameraRollGranted) {
            this.checkCameraRollPermisson()
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 3],
          });
      
        if (!result.cancelled) {
            this.setState({afterImage: result})    
        }
    }

    uploadReview = () => {
        const {title, description, beforeImage, afterImage} = this.state

        if (title && description && beforeImage !== defaultImage && afterImage !== defaultImage) {
            //MAKE POST REQUEST TO BACKEND
            const body = {user_id: this.props.user.id, practitioner_id: this.props.practitioner.id, title, text: description, star: 4}
            
            API.uploadReview(beforeImage, afterImage, body)
                .then(data => console.log("DATA FROM UPLOAD", data))
            
        }
        else  {
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
                    {this.state.cameraRollGranted && this.renderImageViews()}
                    <View style={{flex: 1, flexDirection: 'row' ,height: 50}}>
                        <Text style={{flex: 1}}>Before</Text>
                        <Text style={{flex: 1}}>After</Text>
                    </View>
                </View>
                
                <Button style={{marginBottom: 8}} onPress={this.addImage} title="Add images"/>
                <Button onPress={this.uploadReview} title="Create review"/>
                
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user, practitioner } = state
    return { user, practitioner}
};

export default connect(mapStateToProps)(CreateReviewScreen)