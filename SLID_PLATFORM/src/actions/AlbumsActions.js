import firebase from 'firebase';
import { FETCH_ALBUMS_SUCCESS } from './types';

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