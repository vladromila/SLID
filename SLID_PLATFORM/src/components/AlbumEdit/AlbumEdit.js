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
            modalVisible: false,
            album: props.albums[props.param] || {}
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
        console.log('Upload is ' + progress + '% done');
        this.percentage = progress;
    }
    addFile() {
        let param = this.props.param;
        let type = this.dataFiles.files[0].type.split("/")[0];
        let inp = this.inp.value;
        let name = this.dataFiles.files[0].name;
        let uploadTask = firebase.storage().ref(`/developers/${firebase.auth().currentUser.uid}/${this.props.param}/${this.inp.value !== "" ? this.inp.value : this.dataFiles.files[0].name}`).put(this.dataFiles.files[0]);
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
                            .then(() => {
                                firebase.database().ref(`/albums/${param}/`)
                                    .push({ link: downloadURL, type, name: inp !== "" ? inp : name })
                            })
                    });
                })
    }
    render() {
        return (
            <div>
                <Row>
                    {Object.keys(this.state.album).map((key, i) => {
                        if (key !== "name")
                            return <Modal
                                trigger={
                                    <Col key={i} s={12} m={4}>
                                        <Card header={<React.Fragment>
                                            <CardTitle image={this.state.album[key].type !== "image" ? videoPng : this.state.album[key].link} /></React.Fragment>}
                                            title={this.showTitle(this.state.album[key].name)}
                                            subtitle="Image"
                                        >
                                            <span class="card-title grey-text text-darken-4" style={{ fontSize: 16 }}>{this.state.album[key].type}</span>
                                        </Card>
                                    </Col>
                                }
                            >
                                {this.state.album[key].type === "image" ? <img src={this.state.album[key].link} /> : this.state.album[key].type === "video" ? <video src={this.state.album[key].link} controls /> : null}
                            </Modal>
                    })}
                </Row>
                <Modal
                    header='Modal Header'
                    trigger={<Button>Add a file<Icon right>insert_chart</Icon></Button>}>
                    <Row>
                        <Progress
                            type="circle"
                            percent={this.percentage}
                        />
                        <br />
                        <br />
                    </Row>
                    <input type="file" ref={files => this.dataFiles = files}></input>
                    <input ref={inp => this.inp = inp}></input>
                    <button
                        onClick={() => {
                            this.addFile();
                        }}
                    >Done</button>
                </Modal>
            </div>
        )
    }
}
export default AlbumEdit;   