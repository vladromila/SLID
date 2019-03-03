import React from 'react';
import firebase from 'firebase';
import Modal from 'react-modal';
class AlbumEdit extends React.Component {
    constructor() {
        super()
        this.state = {
            modalVisible: false
        }
    }
    componentDidMount() {
        firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}`)
            .on("value", snapshot => {
                console.log(snapshot.val())
            })
    }
    render() {
        return (
            <div>
                <button class="btn waves-effect waves-light" type="submit" name="action"
                    onClick={() => {
                        this.setState({ modalVisible: true })
                    }}
                >Add a file</button>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalVisible}
                    contentLabel="Example Modal"
                >
                    <div class="container">
                        <h1>Create a new <strong>SLID Album </strong>!</h1>
                        <div class="row">
                            <div class="col s12">
                                <div class="row">
                                    <div class="input-field col s12">
                                        <input id="file" type="file" class="validate" ref={file => this.file = file} />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="input-field col s12">
                                        <button class="btn waves-effect waves-light" type="submit" name="action"
                                            onClick={() => {
                                                fetch("https://content.dropboxapi.com/2/files/upload", {
                                                    method: 'POST',
                                                    headers: {
                                                        "Content-Type": "application/octet-stream",
                                                        "User-Agent": "api-explorer-client",
                                                        "Authorization": "Bearer Tlu3cIv70YAAAAAAAAAACBTX9s7_CeW03Bpp0PatWDvgqp2cmXrWA6gJ3h3hTDIP",
                                                        "Dropbox-API-Arg": JSON.stringify({ "path": `/${this.props.param}/${this.file.files[0].name}` }),
                                                        'Content-Length': this.file.files[0].size
                                                    },
                                                    body: this.file.files[0]
                                                })
                                                    .then(res => res.json())
                                                    .then((res) => {
                                                        fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
                                                            method: 'POST',
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": "Bearer Tlu3cIv70YAAAAAAAAAACBTX9s7_CeW03Bpp0PatWDvgqp2cmXrWA6gJ3h3hTDIP"
                                                            },
                                                            body: JSON.stringify({ "path": `/${this.props.param}/${this.file.files[0].name}` })
                                                        })
                                                            .then((res1) => res1.json())
                                                            .then((res2) => {
                                                                firebase.database().ref(`/developers/${firebase.auth().currentUser.uid}/albums/${this.props.param}/${res.id.split(":")[1]}`)
                                                                    .set({
                                                                        type: this.file.files[0].type.split("/")[1],
                                                                        name: res.name,
                                                                        link: res2.link
                                                                    })
                                                                    .then(() => {
                                                                        firebase.database().ref(`/albums/${this.props.param}/${res.id.split(":")[1]}`)
                                                                            .set({
                                                                                type: this.file.files[0].type.split("/")[1],
                                                                                name: res.name,
                                                                                link: res2.link
                                                                            })
                                                                    })
                                                            })
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    })
                                            }}
                                        >Submit
                    <i class="material-icons right">send</i>
                                        </button>
                                        <button class="btn waves-effect waves-light"
                                            onClick={() => {
                                                this.setState({ modalVisible: false })
                                            }}
                                        >Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default AlbumEdit;   