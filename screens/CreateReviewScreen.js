import React from 'react';
import {
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

import { Text, ListItem, Divider, Rating, AirbnbRating, Input, Button, Image } from 'react-native-elements';

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
        star: 3,
        cameraRollGranted: false,
        isLoading: false
    }

    componentDidMount() {
        this.checkCameraRollPermisson()
    }

    renderImageViews = () => {

        console.log("IMAGE", this.state.beforeImage.uri)

        return (
        <View style={{flex: 1, flexDirection: 'row', height: 200, marginTop: 16}}>
            <TouchableOpacity style={{flex: 1}} onPress={this.addBeforeImage}>
                <Image PlaceholderContent={<ActivityIndicator />} source={{ uri: this.state.beforeImage.uri }} style={{flex: 1, resizeMode: 'cover', borderRadius: 5}} />
            </TouchableOpacity>
            <View style={{width: 8}}></View>
            <TouchableOpacity style={{flex: 1}} onPress={this.addAfterImage}>
                <Image PlaceholderContent={<View style={{backgroundColor: 'blue'}} />}  source={{ uri: this.state.afterImage.uri }} style={{flex: 1, resizeMode: 'cover', borderRadius: 5}} />
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

    changeActivityIndicator = () => {
        this.setState({isLoading: !this.state.isLoading})
    }

    uploadReview = () => {
        this.changeActivityIndicator()
        const {title, description, beforeImage, afterImage, star} = this.state

        if (title && description && beforeImage !== defaultImage && afterImage !== defaultImage) {
            //MAKE POST REQUEST TO BACKEND
            const body = {user_id: this.props.user.id, practitioner_id: this.props.practitioner.id, title, text: description, star}
            
            API.uploadReview(beforeImage, afterImage, body)
                .then(data => {

                    if (data.status && data.status !== 200) {
                        return alert("An error occured while uploading your review. Please try again 😕")
                    }

                    this.changeActivityIndicator()
                    console.log("REVIEW DATA", data)

                    this.navigateToPractioner(data)
                })     
        }
        else  {
            alert("Please fill in all fields! 😕")
        }
    } 

    navigateToPractioner = (practitioner) => {
        const {navigate} = this.props.navigation
        navigate('PractitionerProfile', {practitioner: {...practitioner}})
    }

    renderLoadingScreen = () => (
        <View style={styles.container}>
            <Text style={{marginTop: 300, alignContent: "center", textAlign: 'center', fontSize: 28}}>Uploading review 🚀</Text>
            <ActivityIndicator style={{alignContent: "center"}} size="large" color="#298bd9"/>
        </View>
    )

    renderCreate = () => (
        <View style={styles.container}>
                <Text style={styles.formTitle}>Title</Text>
                <TextInput value={this.state.title} onChangeText={(text) => this.setState({title: text})} multiline={true} style={[{height: 60}, styles.textInputBorder]}></TextInput>
                <Text style={styles.formTitle}>Description</Text>
                <TextInput value={this.state.description} onChangeText={(text) => this.setState({description: text})} multiline={true} style={[{height: 100}, styles.textInputBorder]}></TextInput>

                <View style={{flex: 2}}>
                    {this.state.cameraRollGranted && this.renderImageViews()}
                    <View style={{flex: 1, flexDirection: 'row' ,height: 50}}>
                        <Text style={{flex: 1, fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>Before</Text>
                        <Text style={{flex: 1, fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>After</Text>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={[styles.formTitle]}>Stars: </Text>
                        <Rating
                            type="rocket"
                            ratingColor="#1bb57c"
                            startingValue={this.state.star}
                            onFinishRating={(value) => this.setState({star: value})}
                            style={{ flex: 1 }}
                        />
                    </View>

                    
                </View>
                
                <Button style={{marginBottom: 8}} onPress={this.addImage} title="Add before and after images"/>
                <Button onPress={this.uploadReview} title="Create review"/>
                
            </View>
    )

    render() {
        console.log("STAR", this.state.star)
        return (
            <View style={{flex: 1}}>
                {this.state.isLoading ? this.renderLoadingScreen() : this.renderCreate()}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user, practitioner } = state
    return { user, practitioner}
};

/*

<AirbnbRating
                        count={5}
                        reviews={[`🤬`, `😒`, `😐`, `😄`, `🤩`]}
                        defaultRating={this.state.star}
                        onFinishRating={(value) => this.setState({star: value})}
                        size={40}
                        style={{ flex: 1 }}
                    />

                    <Rating
                        startingValue={this.state.star}
                        onFinishRating={(value) => this.setState({star: value})}
                        style={{ flex: 1 }}
                    />
                    */

export default connect(mapStateToProps)(CreateReviewScreen)