/*import AsyncStorage from '@react-native-community/async-storage';

const tokenName = 'token'

export const saveToken = async token => {
    try {
        await AsyncStorage.setItem(tokenName, token);
      } catch (error) {
        console.log(error.message);
      }
}

export const getToken = async () => {
    let token = '';
    try {
        token = await AsyncStorage.getItem(tokenName) || 'none';
    } catch (error) {
        console.log(error.message);
    }
    return token;
}

export const deleteToken = async () => {
    try {
        await AsyncStorage.removeItem(tokenName);
      } catch (error) {
        console.log(error.message);
      }
}*/