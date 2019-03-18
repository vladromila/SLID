import React from 'react'
import { connect } from 'react-redux';
import { addAlbum, fetchAlbums } from '../../actions';
import { Link } from 'react-router-dom'
import { Modal } from 'react-materialize'
class DashBoard extends React.Component {

    constructor() {
        super();
        this.state = {
            modalVisible: false
        }
    }

    componentDidMount() {
        this.props.fetchAlbums();
    }
    render() {
        return (
            <div className="row">
                <Modal
                    trigger={
                        <div className="col s12 m4">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title center large">+</span>
                                </div>
                                <div className="card-action center">
                                    <a style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            this.setState({ modalVisible: !this.state.modalVisible })
                                        }}
                                    >Add album</a>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div class="container">
                        <h1>Create a new <strong>SLID Album </strong>!</h1>
                        <div class="row">
                            <div class="col s12">
                                <div class="row">
                                    <div class="input-field col s12">
                                        <input id="album_name" type="text" class="validate" ref={newAlbumName => this.newAlbumName = newAlbumName} />
                                        <label for="album_name">Album Name</label>
                                    </div>
                                    <div class="input-field col s12">
                                        <input id="album_password" type="password" class="validate" ref={newAlbumPassword => this.newAlbumPassword = newAlbumPassword} />
                                        <label for="album_password">Album Password</label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="input-field col s12">
                                        <button class="btn waves-effect waves-light" type="submit" name="action"
                                            onClick={() => {
                                                let ok = true;
                                                this.props.albums.forEach(album => {
                                                    if (album.name.toLowerCase() === this.newAlbumName.value.toLowerCase())
                                                        ok = false
                                                })
                                                if (ok === true)
                                                    this.props.addAlbum({ name: this.newAlbumName.value, password: this.newAlbumPassword.value })
                                                else
                                                    alert("You already have an album with this name.")
                                            }}
                                        >Submit
                    <i class="material-icons right">send</i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                {
                    this.props.albums.map((album, i) => {
                        return <div key={i} className="col s12 m4">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">{album.name}</span>
                                </div>
                                <div className="card-action">
                                    <Link to={`/album/${album.uid}`}>Edit</Link>
                                    <a href="#">Delete</a>
                                </div>
                            </div>
                        </div>
                    })}
            </div>
        )
    }
}

export default connect(null, { addAlbum, fetchAlbums })(DashBoard);