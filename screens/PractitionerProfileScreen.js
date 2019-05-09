
import React from 'react'

import { Image, FlatList, StyleSheet, View} from 'react-native';

  import { Text, ListItem, Divider, Rating, Button } from 'react-native-elements';

  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
import { addCurentPractitioner } from '../actions/practitionerActions';
import API from '../API';


class PractitionerProfile extends React.Component {


    refreshPractitioner = () => {
        const currentPractitioner = this.props.practitioner
        API.getPractitioner(currentPractitioner.id)
            .then(data => this.setState({practitioner: data}))
    }

    handleNewReview = () => {
        const {navigate} = this.props.navigation
        console.log("CURRENT USER", this.props.user)
        if (this.props.user) {
            navigate('CreateReview')
        } else {
            navigate('Login')
        }
    }

    renderReviewItem = ({item}) => {
        const {id, title, text, star, before_image, after_image} = item
        return (
            <View key={id} style={{flex: 1, marginTop: 24}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text h4 style={{flex: 3}}>{title}</Text>
                    <Rating
                        type="rocket"
                        ratingColor="#1bb57c"
                        imageSize={20}
                        readonly
                        startingValue={star}
                        style={{flex: 1}}
                    />
                </View>
                
                <View style={{flex: 1, flexDirection: 'row', height: 130}}>
                    <Image source={{ uri: before_image}} style={{ flex: 1, resizeMode: 'cover'}} />
                    <Image source={{ uri: after_image}} style={{ flex: 1, resizeMode: 'cover'}} />
                </View>

                <Text style={{fontSize: 16}}>{text}</Text>
            </View>
        )
    }

    getAverageReview = () => {
        const {practitioner} = this.props
        if (practitioner.reviews) {
            let total = 0
            practitioner.reviews.forEach(review => {total += review.star})
            if (total === 0) { return 0}
            return Math.round(total / practitioner.reviews.length)
        }
    }
    
    render() {
       
        const {name, address, profile_img, reviews} = this.props.practitioner

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: profile_img,
                          }}
                    />
                    <View style={styles.infoContainer}>
                        <Text numberOfLines={3} style={{flex: 1, fontSize: 24, fontWeight: 'bold'}} >{name}</Text>
                        <Text numberOfLines={3} style={{flex: 1, fontSize: 18}} >{address}</Text>
                        <Rating
                            imageSize={25}
                            type="rocket"
                            ratingColor="#1bb57c"
                            readonly
                            startingValue={this.getAverageReview()}
                            style={{flex: 1, alignSelf: 'flex-end'}}
                        />
                    </View> 
                </View>
                <Divider/>
               
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection: 'row', marginTop: 16}}>
                        <Text style={{flex: 1, fontSize: 32, fontWeight: 'bold'}}>Reviews</Text>
                        <Button style={{flex: 1}} title="Add review" onPress={this.handleNewReview}/>
                    </View>
                    <FlatList
                        data={reviews} 
                        keyExtractor={({id}) => `${id}`}
                        renderItem={this.renderReviewItem}/>
                </View>
            </View>
            
        )
    }
}

const profileImageHeight = 100
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
      margin: 16,
    }, 
    topContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    profileImage: {
        marginRight: 16,
        width: profileImageHeight,
        height: profileImageHeight,
        borderRadius: profileImageHeight / 2,
    },
    infoContainer: {
        flex: 3,
    },
    bottomContainer: {
        flex: 5
    }
  })

  const mapStateToProps = (state) => {
    const { user, practitioner } = state
    return { user, practitioner }
  };

  const mapDispatchToProps = dispatch => (
    bindActionCreators({
      addCurentPractitioner,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PractitionerProfile)