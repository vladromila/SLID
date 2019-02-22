import React from 'react';
import firebase from 'firebase';

class AlbumEdit extends React.Component {
    componentDidMount() {
        firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}`)
            .on("value", snapshot => {
                console.log(snapshot.val())
            })
    }
    render() {
        return (
            <div class="gcse-searchbox" data-resultsUrl="http://www.example.com"
                data-newWindow="true" data-queryParameterName="search" />
        )
    }
}
export default AlbumEdit;   