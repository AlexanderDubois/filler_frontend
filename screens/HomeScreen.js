import React from 'react';
import { FlatList, View} from 'react-native';

import styles from '../assets/styles'

import { SearchBar, ListItem } from 'react-native-elements';
import API from '../API'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCurentPractitioner } from '../actions/practitionerActions';

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

  navigateToPractitioner = (practitioner) => {
    this.props.addCurentPractitioner(practitioner)
    const {navigate} = this.props.navigation
    navigate('PractitionerProfile')
  }

  filteredPractitioners = () => {
    const {practitioners, searchTerm} = this.state
    return practitioners.filter((practitioner) => practitioner.name.toLowerCase().includes(searchTerm.toLowerCase()) || practitioner.address.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  renderListItems = ({item}) => (
    <ListItem
      button
      onPress={() => this.navigateToPractitioner(item)}
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

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addCurentPractitioner,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

