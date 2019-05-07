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

import styles from '../assets/styles'

import { Text, ListItem, Divider, Rating, Button } from 'react-native-elements';
import API from '../API';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login } from '../actions/userActions';


class LoginScreen extends React.Component {

    state = {
        email: "",
        password: ""
    }
    login = () => {
       API.login(this.state)
        .then(data => {
            console.log("DATA LOGIN USER: ", data.user, "WITH TOKEN:", data.token)

            this.props.login(data) 
            this.navigateToCreate()
        }) 
    }

    navigateToCreate = () => {
        const {navigate} = this.props.navigation
        navigate('CreateReview')
    }

    signUp = () => {
        const {navigate} = this.props.navigation
        navigate('SignUp')
    }

    render() {

        const {email, password} = this.state
        
        return (
            <View style={styles.container}>
                <Text h1>Login</Text>
                <Text style={styles.formTextInput}>Email:</Text>
                <TextInput autoCapitalize="none" value={email} onChangeText={(text) => this.setState({email: text})} style={[{height: 60} ,styles.textInputBorder]}></TextInput>
                <Text style={styles.formTextInput}>Password:</Text>
                <TextInput autoCapitalize="none"value={password} onChangeText={(text) => this.setState({password: text})} secureTextEntry={true} style={[{height: 60}, styles.textInputBorder]}></TextInput>
                <Button onPress={this.login} title="Login"></Button>
                <Button onPress={this.signUp} title="Don't have an account? Signup" type="clear"></Button>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user } = state
    return { user }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
      login,
    }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)