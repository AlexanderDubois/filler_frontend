

BASE_URL = 'https://intense-sierra-74172.herokuapp.com'
PRACTITIONERS_URL = BASE_URL + '/practitioners'
REVIEWS_URL = BASE_URL + '/reviews'
LOGIN_URL = BASE_URL + '/login'
USERS_URL = BASE_URL + '/users'

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3XXsxtdIdjk5szEpADSHgbZbVwD6h3p4",
    authDomain: "filler-60f06.firebaseapp.com",
    databaseURL: "https://filler-60f06.firebaseio.com",
    projectId: "filler-60f06",
    storageBucket: "filler-60f06.appspot.com",
    messagingSenderId: "673446796519"
};

firebase.initializeApp(firebaseConfig);


class API {

    static getPractitioners = () => {  
        return fetch(PRACTITIONERS_URL)
            .then(response => response.json())
    }

    static login = ({email, password}) => {
        return fetch(LOGIN_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        })
            .then(response => response.json())
    }

    static signUp = async (user) => {
        const {username, email, password, profile_img} = user 

        const profileImageUploadURL =  await this.uploadImageAsync(profile_img.uri)

        const body = {username, email, password, profile_img: profileImageUploadURL}

        return fetch(USERS_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(resp => resp.json())
    }
    
    static uploadReview = async (beforeImage, afterImage, additionalBody) => {

        //MAYBE DO PROMOISE.ALL INSTEAD

        console.log("before upload: ", beforeImage)
        console.log("after upload: ", afterImage)

        const beforeImageUploadURL =  await this.uploadImageAsync(beforeImage.uri)
        const afterImageUploadURL =  await this.uploadImageAsync(afterImage.uri)

        const body = {review: {
            before_image: beforeImageUploadURL,
            after_image: afterImageUploadURL,
            ...additionalBody}
        }

        console.log("before", beforeImageUploadURL)
        console.log("after", afterImageUploadURL)

        return fetch(REVIEWS_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(response => response.json())
    }

    static uploadImageAsync = async (uri) => {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function(e) {
              console.log(e);
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    
        const ref = firebase.storage().ref().child(this.guidGenerator())
      
        const snapshot = await ref.put(blob);

        blob.close();

        return snapshot.ref.getDownloadURL()
    }

    static guidGenerator = () => {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }


}

export default API