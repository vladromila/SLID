import firebase from 'firebase';
import { ADD_ALBUM_START, ADD_ALBUM_SUCCESS } from './types';

export const addAlbum = ({ name, password }) => {
    return (dispatch) => {
        dispatch({
            type: ADD_ALBUM_START
        })
        fetch("https://slidserver.herokuapp.com/adduserandreturnuid",
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
                    email: "romilavlad2003@gmail.com",
                    password: "123123"
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