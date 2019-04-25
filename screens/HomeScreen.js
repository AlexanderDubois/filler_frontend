import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

BASE_URL = 'http://localhost:3000'
PRACTITIONERS_URL = BASE_URL + '/practitioners'


export default class HomeScreen extends React.Component {

  state = {
    practitioners: []
  }

  componentDidMount() {

    fetch(PRACTITIONERS_URL)
      .then(response => response.json())
      .then(data => {
        this.setState({
          practitioners: data
        })}) 
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.practitioners} 
          keyExtractor={({id}) => `${id}`}
          renderItem={({item}) => (
            <View style={{backgroundColor: blue}}>
              <Text>{item.name}</Text> 
            </View>
          )}/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})
