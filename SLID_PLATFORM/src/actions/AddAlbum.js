import firebase from 'firebase';
import { ADD_ALBUM_START, ADD_ALBUM_SUCCESS } from './types';

export const addAlbum = ({ name, password }) => {
    return (dispatch) => {
        dispatch({
            type: ADD_ALBUM_START
        })
        console.log(name, password)
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
            .then(res =>
                res.json()
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
    }
}