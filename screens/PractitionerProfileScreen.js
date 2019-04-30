
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

  import { Text, ListItem, Divider, Rating } from 'react-native-elements';


class PractitionerProfile extends React.Component {

    renderReviewItem = ({item}) => {
        const {id, title, text, star} = item
        return (<ListItem
            button
            onPress={() => console.log("PRSEED REVIEW")}
            key={id}
            title={title}
            subtitle={text}
            rightElement={
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={star}
                />
            }
        />)
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
                <Text h3 style={{margin: 16}}>Reviews</Text>
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
      backgroundColor: '#fff',
    }, 
    topContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    profileImage: {
        margin: 16, 
        width: profileImageHeight,
        height: profileImageHeight,
        borderRadius: profileImageHeight / 2,
    },
    infoContainer: {
        flex: 3,
        margin: 16,
    },
    bottomContainer: {
        flex: 5
    }
  })

export default PractitionerProfile