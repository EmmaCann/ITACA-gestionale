import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');

const CustomModal = ({isOpen, onRequestClose, title, children, className}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={title}
            className={`Modal ${className}`}
            overlayClassName="Overlay"
        >
            {
                children && children
            }
        </Modal>
    );
};

export default CustomModal;
