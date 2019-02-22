import React from 'react'
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { addAlbum, fetchAlbums } from '../../actions';
import { Link } from 'react-router-dom'
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
        console.log(this.props.albums)
        return (
            <div className="row">
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
                                        <input id="album_name" type="text" class="validate" ref={newAlbumName => this.newAlbumName = newAlbumName} />
                                        <label for="album_name">Album Name</label>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="input-field col s12">
                                        <button class="btn waves-effect waves-light" type="submit" name="action"
                                            onClick={() => {
                                                this.props.addAlbum({ name: this.newAlbumName.value, password: this.newAlbumName.value })
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

let mapStateToProps = (state) => {
    const { albums } = state.Albums;
    return { load: true };
}
export default connect(mapStateToProps, { addAlbum, fetchAlbums })(DashBoard);