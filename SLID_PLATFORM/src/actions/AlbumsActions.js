import firebase from 'firebase';
import { FETCH_ALBUMS_SUCCESS, DELETE_ALBUM_START, DELETE_ALBUM_SUCCESS, DELETE_MODAL_POP } from './types';

export const fetchAlbums = () => {
    return (dispatch) => {
        firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums`)
            .on('value', snapshot => {
                let albums = [];
                if (snapshot.val()) {
                    Object.keys(snapshot.val()).forEach(key => {
                        albums.push(snapshot.val()[key])
                    })
                }
                dispatch({
                    type: FETCH_ALBUMS_SUCCESS,
                    payload: albums
                })
            })
    }
}

export const deleteAlbum = ({ name, password }) => {
    return (dispatch) => {
        dispatch({
            type: DELETE_ALBUM_START
        })
        fetch("https://slidserver.herokuapp.com/deletealbumuser",
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
                if (res.status === 406)
                    console.log("Name or password is invalid")
                return res.json()
            }
            )
            .then(res => {
                firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${res.uid}`)
                    .remove()
                    .then(() => {
                        dispatch({
                            type: DELETE_ALBUM_SUCCESS
                        })
                    })
            })
            .catch(err => { alert(err) })
    }
}
export const deleteModalPop = () => {
    return ({ type: DELETE_MODAL_POP })
}   