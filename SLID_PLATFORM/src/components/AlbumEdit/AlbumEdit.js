import React from 'react';
import firebase from 'firebase';
import { Modal, Button, Icon, Card, CardTitle, Row, Col, Preloader, Breadcrumb } from 'react-materialize'
import "./AlbumEdit.css";
import { Link, Redirect } from 'react-router-dom'
import videoPng from "./video.png";
class AlbumEdit extends React.Component {
    constructor(props) {
        super(props)
        this.percentage = 0;
        this.state = {
            deleteModalVisible: false,
            album: props.albums[props.param] || 'loading',
            progress: 0,
            toDeleteFile: null,
            deleteAlbumModalVisible: false,
            addFileModalVisible: false
        }
        this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    }
    componentDidMount() {
        firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}`)
            .on("value", snapshot => {
                if (snapshot.val())
                    this.setState({ album: snapshot.val() })
                else
                    this.setState({ album: null })
            })
    }
    showTitle(name) {
        let str;
        let extra = "...";
        if (name.length > 10) {
            str = name.substring(0, 10);
            str = str.concat(extra);
        }
        else
            str = name;
        return str;
    }
    checkPercentage(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTimeout(() => { this.setState({ progress }) }, 1000)
    }
    addFile() {
        let endfile = () => {
            this.setState({ progress: 0, addFileModalVisible: false })
            this.dataFiles=null;
        }
        if (this.dataFiles.files[0]) {
            let ok = true;
            Object.keys(this.state.album).forEach(key => {
                if (key !== "name" && key !== "uid") {
                    if (this.state.album[key].name === this.dataFiles.files[0].name)
                        ok = false;
                }
            })
            if (ok === false && !this.inp.value) {
                alert("You already have a file with the same name!");
            }
            else {
                let param = this.props.param;
                let type = this.dataFiles.files[0].type.split("/")[0];
                let inp = this.inp.value;
                let name = this.dataFiles.files[0].name;
                let uploadTask = firebase.storage().ref(`/developers/${firebase.auth().currentUser.uid}/${this.props.param}/${this.inp.value ? this.inp.value : this.dataFiles.files[0].name}`).put(this.dataFiles.files[0]);
                uploadTask
                    .on(firebase.storage.TaskEvent.STATE_CHANGED,
                        snapshot => this.checkPercentage(snapshot),
                        function (error) {
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    break;
                                case 'storage/canceled':
                                    break;
                                case 'storage/unknown':
                                    break;
                            }
                        }, function () {
                            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${param}/`)
                                    .push({ link: downloadURL, type, name: inp !== "" ? inp : name })
                                    .then((data) => {
                                        console.log(data.key);
                                        firebase.database().ref(`/albums/${param}/${data.key}`)
                                            .set({ link: downloadURL, type, name: inp !== "" ? inp : name })
                                            .then(() => {
                                                endfile();
                                            })
                                    })
                            });
                        })
            }
        }
        else {
            alert("Please insert a file before pressing the upload button.");
        }
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
                    Object.keys(this.state.album).forEach(key => {
                        if (key != "name" && key !== "uid")
                            firebase.storage().ref(`/developers/${firebase.auth().currentUser.uid}/${res.uid}/`).child(this.state.album[key].name)
                                .delete()
                    })
                    firebase.database().ref(`/albums/${res.uid}`)
                        .remove()
                        .then(() => {
                            firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${res.uid}`)
                                .remove()
                                .then(() => {
                                    this.setState({ deleteAlbumModalVisible: false })
                                    this.props.history.push('/')
                                })
                        })
                })
                .catch(err => {
                    alert(err);
                    this.setState({ deleteAlbumModalVisible: false })
                })
        else
            alert("Please provide the required information!")
    }
    renderFiles() {
        return Object.keys(this.state.album).map((key, i) => {
            if (key !== "name")
                return <Modal
                    key={i}
                    actions={
                        [<Button modal="close" className="red darken-2"
                            onClick={() => {
                                this.setState({ deleteModalVisible: true, toDeleteFile: { ...this.state.album[key], uid: key } })
                            }}
                        ><Icon left>delete</Icon>Delete</Button>,
                        <Button modal="close" className="darken-2">Close</Button>]
                    }
                    trigger={
                        <Col key={i} s={12} m={4}
                        >
                            <Card header={<React.Fragment>
                                <CardTitle image={this.state.album[key].type !== "image" ? videoPng : this.state.album[key].link} /></React.Fragment>}
                                title={this.showTitle(this.state.album[key].name)}
                                subtitle="Image"
                            >
                                <span className="card-title grey-text text-darken-4" style={{ fontSize: 16 }}>{this.state.album[key].type}</span>
                            </Card>
                        </Col>
                    }
                >
                    {this.state.album[key].type === "image" ? <img src={this.state.album[key].link} /> : this.state.album[key].type === "video" ? <video src={this.state.album[key].link} controls /> : this.state.album[key].type === "audio" ? <audio src={this.state.album[key].link} controls /> : null}
                </Modal>
        })
    }
    render() {
        return (
            <React.Fragment>
                {this.state.album !== null && this.state.album !== 'loading' ?
                    <React.Fragment>
                        <Breadcrumb className="teal lighten-2">
                            <Link to="/">
                                Dashboard
</Link>
                            <Link to={`/album/${this.props.param}`}>
                                {this.state.album.name}
                            </Link>
                        </Breadcrumb>
                        <div>
                            <Row>
                                {this.renderFiles()}
                            </Row >
                            <Modal
                                modalOptions={{ dismissible: false }}
                                open={this.state.deleteModalVisible}
                                actions={[
                                    <Button modal="close" className="red darken-2" onClick={() => {
                                        firebase.storage().ref(`/developers/${firebase.auth().currentUser.uid}/${this.props.param}/`)
                                            .child(this.state.toDeleteFile.name)
                                            .delete()
                                            .then(() => {
                                                firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}/${this.state.toDeleteFile.uid}`)
                                                    .remove()
                                                    .then(() => {
                                                        firebase.database().ref(`/albums/${this.props.param}/${this.state.toDeleteFile.uid}`)
                                                            .remove()
                                                            .then(() => {
                                                                this.setState({ deleteModalVisible: false })
                                                            })
                                                    })
                                            })
                                    }}><Icon left>delete</Icon>Da</Button>, <Button modal="close" className="darken-2" onClick={() => {
                                        this.setState({ deleteModalVisible: false })
                                    }}>Nu</Button>]
                                }
                            >
                                <h3>Are you sure you want to delete this file?</h3>
                            </Modal>
                        </div >
                        <Button
                            floating
                            fab={{ direction: 'left' }}
                            icon="edit"
                            className="red"
                            large
                        >
                            <Button floating icon="delete" className="red" onClick={() => {
                                this.setState({ deleteAlbumModalVisible: true });
                            }} />
                            <Button floating icon="list" className="green"
                                onClick={() => {
                                    console.log("Da");
                                }}
                            />
                            <Button floating icon="add" className="green"
                                onClick={() => {
                                    this.setState({ addFileModalVisible: true })
                                }}
                            />
                        </Button>
                        <Modal
                            modalOptions={{ dismissible: false }}
                            open={this.state.deleteAlbumModalVisible}
                            actions={
                                <Button modal="close" className="red darken-2" onClick={() => {
                                    this.setState({ deleteAlbumModalVisible: false })
                                }}><Icon left>delete</Icon>Close</Button>
                            }
                        >
                            <div className="container">
                                <h4>Delete the <strong>{this.state.album.name}</strong> album!</h4>
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
                                                        this.deleteAlbumHandler({ name: this.state.album.name, password: this.toDeleteAlbumPassword.value })
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
                            header='Upload a file'
                            open={this.state.addFileModalVisible}
                            modalOptions={{ dismissible: false }}
                            actions={
                                <Button modal="close" className="red darken-2" onClick={() => {
                                    this.setState({ addFileModalVisible: false })
                                }}><Icon left>close</Icon>Close</Button>
                            }
                        >
                            <Row>
                                <div style={{ width: "100%", height: "20px" }}>
                                    <div
                                        style={{ width: `${this.state.progress}%`, backgroundColor: "#4db6ac", height: "100%" }}
                                    >
                                    </div>
                                </div>
                            </Row>
                            <input type="file" ref={files => this.dataFiles = files}></input>
                            <input ref={inp => this.inp = inp}></input>
                            <Button
                                onClick={() => {
                                    this.addFile();
                                }}
                            >Done</Button>
                        </Modal>

                    </React.Fragment>
                    :
                    <React.Fragment>
                        <h3>This album is not available anymore.</h3>
                        <Link to="/">Go back to the dashboard.</Link>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}
export default AlbumEdit;   