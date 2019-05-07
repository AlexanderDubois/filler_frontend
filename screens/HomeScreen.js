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

  getAverageReview = (practitioner) => {
    const {reviews} = practitioner
    if (reviews.length === 0) return 0

    let totalNumberOfStars = 0
    reviews.forEach((review) => totalNumberOfStars += review.star)
    return Math.round(totalNumberOfStars / reviews.length)
  }

  render() {
    const {searchTerm} = this.state

    return (
      <View style={styles.container}>
        <Text h1>{this.props.user && this.props.user.email}</Text>
        <Text h1>{this.state.token}</Text>
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

