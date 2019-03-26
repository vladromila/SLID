import firebase from 'firebase';
import { ADD_ALBUM_START, ADD_ALBUM_SUCCESS } from './types';

export const addAlbum = ({ name, password }) => {
    return (dispatch) => {
        dispatch({
            type: ADD_ALBUM_START
        })
        fetch("https://slidserver.herokuapp.com/addalbumsuser",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    username: name,
                    password: password
                })
            })
            .then(res => {
                if (res.status === 406) {
                    throw new Error("The album name will be used to create an email, so find a name that can be found in a valid email. Example: with the name 'vlad' the email created will be 'vlad@slid.com'");
                }
                else
                    return res.json()
            }
            )
            .then(res => {
                firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${res.uid}`)
                    .set({ name })
                    .then(() => {
                        dispatch({
                            type: ADD_ALBUM_SUCCESS
                        })
                    })
            })
            .catch(err => { alert(err) })
    }
}   