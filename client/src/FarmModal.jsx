import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Farm from './Farm.jsx';
 
const customStyles = {
  content : {
    padding               : '50px',
    backgroundColor       : 'black',
    overflow              : 'visible',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
 
class FarmModal extends React.Component {
  constructor() {
    super();
 
    this.state = {
      modalIsOpen: false
    };
 
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
 
  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    // references are now sync'd and can be accessed. 
    // this.subtitle.style.color = '#f00';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }
 
  render() {
    return (
      <span>
        <button className="navbar-button" onClick={this.openModal}>FARM &ensp; &ensp; <span style={{color: "white"}} >/</span></button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Farm Modal"
        >
          <h1 className="modal-name">F A R M</h1>
          <button className="modal-button" onClick={this.closeModal}>❌</button>
          <Farm defaultValue={this.props.defaultValue} setFarm={this.props.setFarm} />
        </Modal>
      </span>
    );
  }
}
 
export default FarmModal;