import React from 'react';
import firebase from 'firebase';
import { Modal, Button, Icon, Card, CardTitle, Row, Col, Preloader } from 'react-materialize'
import "./AlbumEdit.css";
import { Progress } from 'react-sweet-progress';
import videoPng from "./video.png";
class AlbumEdit extends React.Component {
    constructor(props) {
        super(props)
        this.percentage = 0;
        this.state = {
            deleteModalVisible: false,
            album: props.albums[props.param] || {},
            progress: 0,
            toDeleteFile: null
        }
    }
    componentDidMount() {
        firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}`)
            .on("value", snapshot => {
                if (snapshot.val())
                    this.setState({ album: snapshot.val() })
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
                                    })
                            });
                        })
            }
        }
        else {
            alert("Please insert a file before pressing the upload button.");
        }
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
                    {this.state.album[key].type === "image" ? <img src={this.state.album[key].link} /> : this.state.album[key].type === "video" ? <video src={this.state.album[key].link} controls /> : null}
                </Modal>
        })
    }
    render() {
        console.log(this.state.progress);
        return (
            <div>
                <Row>
                    {this.renderFiles()}
                </Row >
                <Modal
                    header='Upload a file'
                    trigger={<Button>Add a file<Icon right>insert_chart</Icon></Button>}>
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
                    <button
                        onClick={() => {
                            this.addFile();
                        }}
                    >Done</button>
                </Modal>
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
                            console.log(this.state.toDeleteFile)
                            this.setState({ deleteModalVisible: false })
                        }}>Nu</Button>]
                    }
                >
                    <h3>Are you sure you want to delete this file?</h3>
                </Modal>
            </div >
        )
    }
}
export default AlbumEdit;   