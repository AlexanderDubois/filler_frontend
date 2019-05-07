
import React from 'react'

import {
    Image,
    Platform,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
  } from 'react-native';

  import { Text, ListItem, Divider, Rating, Button } from 'react-native-elements';

  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
import { addCurentPractitioner } from '../actions/practitionerActions';


class PractitionerProfile extends React.Component {

    handleNewReview = () => {
        //If user logged in push to add review else login screen

        const currentPractitioner = this.props.navigation.state.params.practitioner
        this.props.addCurentPractitioner(currentPractitioner)

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
            <View key={id} style={{flex: 1, marginTop: 16}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text h4 style={{flex: 3}}>{title}</Text>
                    <Rating
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
                <Text h5>{text}</Text>
            </View>
        )
    }
    render() {
        const {name, address, profile_img, reviews, averageStar} = this.props.navigation.state.params.practitioner

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
                        <Text h2>{name}</Text>
                        <Text h4>{address}</Text>
                        <Rating
                            imageSize={20}
                            readonly
                            startingValue={averageStar}
                        />
                    </View>
                    
                </View>
                <Divider/>
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection: 'row', marginTop: 16}}>
                        <Text h3 style={{flex: 1}}>Reviews</Text>
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
    const { user } = state
    return { user }
  };

  const mapDispatchToProps = dispatch => (
    bindActionCreators({
      addCurentPractitioner,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(PractitionerProfile)