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

import styles from '../assets/styles'

import { SearchBar, ListItem } from 'react-native-elements';
import API from '../API'

import { connect } from 'react-redux';

class HomeScreen extends React.Component {

  state = {
    practitioners: [],
    searchTerm: "", 
    token: ''
  }

  componentDidMount() {
      
    API.getPractitioners()
      .then(practitioners => {
        this.setState({
          practitioners
        })}) 
  }

  handleSearchChange = (searchTerm) => {
    this.setState({
      searchTerm
    })
  }

  getAverageReview = (practitioner) => {
    let total = 0
    practitioner.reviews.forEach(review => {total += review.star})
    if (total === 0) { return 0}
    return Math.round(total / practitioner.reviews.length)
  }

  moveToPractionersPage = (practitioner) => {
    const {navigate} = this.props.navigation
    navigate('PractitionerProfile', {practitioner: {...practitioner, averageStar: this.getAverageReview(practitioner)}})
  }

  filteredPractitioners = () => {
    const {practitioners, searchTerm} = this.state
    return practitioners.filter((practitioner) => practitioner.name.toLowerCase().includes(searchTerm.toLowerCase()) || practitioner.address.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  renderListItems = ({item}) => (
    <ListItem
      button
      onPress={() => this.moveToPractionersPage(item)}
      key={item.id}
      leftAvatar={{ source: { uri: item.profile_img } }}
      title={item.name}
      badge={{value: `Average star: ${this.getAverageReview(item)}`}}
    />
  )

  render() {
    const {searchTerm} = this.state

    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search..."
          lightTheme
          onChangeText={this.handleSearchChange}
          value={searchTerm}/>
        <FlatList
          data={this.filteredPractitioners()} 
          keyExtractor={({id}) => `${id}`}
          renderItem={this.renderListItems}/>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

export default connect(mapStateToProps)(HomeScreen)

