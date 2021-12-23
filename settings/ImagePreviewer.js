import React, { useState, useContext, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { UserContext } from "../../providers/UserProvider";
import { updateProfile } from "../../api/rest";
import { changeProfile, storageRef } from "../../firebase";
import { toastError } from '../../shared/ToastifyService';

const ImagePreviewer = (props) => {
    const { user, setUser } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const [file, setFile] = useState(null);
    const [src, setSrc] = useState(user.photoURL ?? '/noAvatar.jpg');
    const [profileURL, setProfileURL] = useState(user.photoURL ?? '/noAvatar.jpg');
    const fileRef = useRef(null);

    const toggle = () => {
        setModal(!modal);
    }

    const uploadPhoto = async () => {
        if (!file) {
            setModal(false);
            return;
        }
        const metadata = {
            contentType: 'image/jpeg'
        };
        const uploadTask = storageRef.child('images/' + user.id).put(file, metadata);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((photoURL) => {
                    const { email, username, gender, currency } = user;
                    changeProfile({photoURL},
                        async () => {
                            const updatedProfile = await updateProfile({
                                email,
                                username,
                                gender,
                                currency,
                                photoURL
                            });
                            console.log(updatedProfile, photoURL)
                            setUser(updatedProfile);
                            setProfileURL(photoURL);
                            setModal(false);
                        },
                        (error) => {
                            console.log(error);
                            const message = "Unexpected error occurred";
                            toastError(message);
                        }
                    );
                });
            }
        );
    }

    const openFileChooser = () => {
        fileRef.current.click();
    }

    const onFileChange = (event) => {
        event.persist();
        setFile(event.target.files[0]);
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                setSrc(e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]); // convert to base64 string
        }
    }
    
    return (
        <div className="ml-auto">
            <img className="profileImg" src={profileURL} alt="/noAvatar.jpg" onError={() => setProfileURL("/noAvatar.jpg")} onClick={toggle} />
            <Modal isOpen={modal} toggle={toggle} className="modal-350">
                <ModalHeader toggle={toggle}>
                    <b className="font-22 font-black">Upload Photo</b>
                </ModalHeader>
                <ModalBody>
                    <div className="preview-wrapper">
                        <img className="profileImg image-preview" src={src} alt="pic" onError={() => setSrc("/noAvatar.jpg")} onClick={openFileChooser} />
                        <input ref={fileRef} type="file" className="image-file" name="photo" accept="image/*" onChange={onFileChange} />
                    </div>
                    <div className="float-right">
                        <Button color="default btn-sm" className="mr-2" onClick={toggle}>Cancel</Button>
                        <button className="btn btn-primary main-button main-button-sm" onClick={uploadPhoto}>
                            Submit
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default ImagePreviewer;
