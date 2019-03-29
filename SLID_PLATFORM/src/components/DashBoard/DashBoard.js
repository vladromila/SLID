import React from 'react'
import { connect } from 'react-redux';
import { addAlbum, fetchAlbums, deleteAlbum, deleteModalPop } from '../../actions';
import { Link } from 'react-router-dom'
import { Modal, Button, Icon } from 'react-materialize'
import firebase from 'firebase';
import Breadcrumb from 'react-materialize/lib/Breadcrumb';
import Highlight from 'react-highlight'
class DashBoard extends React.Component {

    constructor() {
        super();
        this.state = {
            modalVisible: false,
            deleteModalVisible: false,
            toDeleteAlbum: {},
            toShowInfoAlbumModal: false,
            toShowInfoAlbum: {}
        }
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    }

    componentDidMount() {
        this.props.fetchAlbums();
    }
    addAlbumHandler = ({ name, password }) => {
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
                        this.setState({ modalVisible: false })
                    })
            })
            .catch(err => {
                alert(err)
                this.setState({ modalVisible: false })
            })
    }
    deleteAlbumHandler({ name, password }) {
        if (name && password)
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
                        password: password,
                        developerUid: firebase.auth().currentUser.uid
                    })
                })
                .then(res => {
                    if (res.status === 406) {
                        throw new Error("The password you have entered is invalid!");
                    }
                    else
                        return res.json()
                }
                )
                .then(res => {
                    console.log(this.state.toDeleteAlbum);
                    Object.keys(this.state.toDeleteAlbum).forEach(key => {
                        if (key != "name" && key !== "uid")
                            firebase.storage().ref(`/developers/${firebase.auth().currentUser.uid}/${res.uid}/`).child(this.state.toDeleteAlbum[key].name)
                                .delete()
                    })
                    firebase.database().ref(`/albums/${res.uid}`)
                        .remove()
                        .then(() => {
                            firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${res.uid}`)
                                .remove()
                                .then(() => {
                                    this.setState({ deleteModalVisible: false })
                                })
                        })
                })
                .catch(err => { alert(err) })
        else
            alert("Please provide the required information!")
    }
    render() {
        return (
            <React.Fragment>
                <Breadcrumb className="teal lighten-2">
                    <Link to="/">
                        Dashboard
</Link>
                </Breadcrumb>
                <div className="row">
                    <div className="col s12 m4" onClick={() => {
                        this.setState({ modalVisible: !this.state.modalVisible })
                    }}>
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title center large"><strong>+</strong></span>
                            </div>
                            <div className="card-action center">
                                <a style={{ cursor: "pointer" }}>Add album</a>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.albums.map((album, i) => {
                            return <div key={i} className="col s12 m4"
                                onClick={() => {
                                    this.setState({ toShowInfoAlbumModal: true, toShowInfoAlbum: album })
                                }}
                            >
                                <div className="card">
                                    <div className="card-content">
                                        <span className="card-title">{album.name}</span>
                                    </div>
                                    <div className="card-action">
                                        <Link to={`/album/${album.uid}`}>Edit</Link>
                                        <a style={{ cursor: "pointer" }} onClick={() => {
                                            this.setState({ toDeleteAlbum: album, deleteModalVisible: true })
                                        }}>Delete</a>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                    <Modal
                        modalOptions={{ dismissible: false }}
                        open={this.state.deleteModalVisible}
                        actions={
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ deleteModalVisible: false })
                            }}><Icon left>delete</Icon>Close</Button>
                        }
                    >
                        <div className="container">
                            <h4>Delete the <strong>{this.state.toDeleteAlbum.name}</strong> album!</h4>
                            <h6>In order to delete it, please provide the password of the album!</h6>
                            <div className="row">
                                <div className="col s12">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="delete_album_password" type="password" className="validate" ref={toDeleteAlbumPassword => this.toDeleteAlbumPassword = toDeleteAlbumPassword} />
                                            <label htmlFor="delete_album_password">Album Password</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <button className="btn" type="submit" name="action"
                                                onClick={() => {
                                                    this.deleteAlbumHandler({ name: this.state.toDeleteAlbum.name, password: this.toDeleteAlbumPassword.value })
                                                }}
                                            >Submit
                    <i className="material-icons right">send</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        modalOptions={{ dismissible: false }}
                        open={this.state.modalVisible}
                        actions={
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ modalVisible: false })
                            }}><Icon left>delete</Icon>Close</Button>
                        }
                    >
                        <div className="container">
                            <h1>Create a new <strong>SLID Album </strong>!</h1>
                            <div className="row">
                                <div className="col s12">
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <input id="album_name" type="text" className="validate" ref={newAlbumName => this.newAlbumName = newAlbumName} />
                                            <label htmlFor="album_name">Album Name</label>
                                        </div>
                                        <div className="input-field col s12">
                                            <input id="album_password" type="password" className="validate" ref={newAlbumPassword => this.newAlbumPassword = newAlbumPassword} />
                                            <label htmlFor="album_password">Album Password</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <button className="btn waves-light" type="submit" name="action"
                                                onClick={() => {
                                                    let ok = true;
                                                    this.props.albums.forEach(album => {
                                                        if (album.name.toLowerCase() === this.newAlbumName.value.toLowerCase())
                                                            ok = false
                                                    })
                                                    if (ok === true)
                                                        this.addAlbumHandler({ name: this.newAlbumName.value, password: this.newAlbumPassword.value })
                                                    else
                                                        alert("You already have an album with this name.")
                                                }}
                                            >Add
                    <i className="material-icons right">send</i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.toShowInfoAlbumModal}
                        modalOptions={{ dismissible: false }}
                        actions={
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ toShowInfoAlbumModal: false })
                            }}><Icon left>close</Icon>Close</Button>
                        }
                    >
                        <h2>Album Information</h2>
                        <h5>ID: <strong>{this.state.toShowInfoAlbum.uid}</strong></h5>
                        <h6>setupData.json settings in order to connect:</h6>
                        <Highlight className='json'>
                            {`[{"id":${this.state.toShowInfoAlbum.uid}... }]`}
                        </Highlight>
                    </Modal>
                </div>
            </React.Fragment>
        )
    }
}
export default connect(null, { addAlbum, deleteAlbum, fetchAlbums, deleteModalPop })(DashBoard);