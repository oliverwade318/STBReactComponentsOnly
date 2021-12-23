import React, { useState, useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import { UserContext } from "../../providers/UserProvider";
import { createProperty, updatePropertyName } from "../../api/rest";

const AddProperty = (props) => {
    const userContext = useContext(UserContext);

    const {
        property,
        propertyData,
        collection,
        updateProperty
    } = props;

    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const toggle = () => {
        setModal(!modal);

        if (!modal) {
            setName("");
            setNameError(null);
        }
    }

    const editToggle = () => {
        setEditModal(!editModal);

        if (!editModal) {
            setName(propertyData.name);
            setNameError(null);
        }
    }

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(null);

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "name") {
            setName(value);
        }
    };

    const onEditChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "name") {
            setName(value);
        }
    };

    const createNewProperty = async (event) => {
        event.preventDefault();
        setNameError(null);
        if (!name || name.length == 0) {
            setNameError('Name is required');
            return;
        }
        if (userContext.user[collection].find(item => item.name === name)) {
            setNameError(`This ${property} already exists`);
            return;
        }

        try {
            setLoading(true);
            const result = await createProperty(collection, name);
            const propertyItem = result[collection].find(item => item.name === name);
            userContext.setUser(result);
            setLoading(false);
            toggle();
            updateProperty(collection, propertyItem);
        } catch (error) {
            console.log(error);
        }
    };

    const editProperty = async (event) => {
        event.preventDefault();
        setNameError(null);
        if (!name || name.length == 0) {
            setNameError('Name is required');
            return;
        }
        if (userContext.user[collection].find(item => item.name === name)) {
            setNameError(`This ${property} already exists`);
            return;
        }

        try {
            setLoading(true);
            const result = await updatePropertyName(collection, propertyData.id, name);
            const propertyItem = result[collection].find(item => item.name === name);
            userContext.setUser(result);
            setLoading(false);
            editToggle();
            updateProperty(collection, propertyItem);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="ml-auto">
            <a className="app-link" onClick={toggle}>
                + Add New {property}
            </a>
            {
                propertyData &&
                    <a className="app-link ml-3" onClick={editToggle}>
                        Edit {property}
                    </a>
            }
            <Modal isOpen={modal} toggle={toggle} className="modal-350">
                <ModalHeader toggle={toggle}>
                    <b className="font-22 font-black">Add New {property}</b>
                </ModalHeader>
                <ModalBody>
                    <form className="form-row mt-1">
                        <div className="form-group col-12">
                            <label htmlFor="name" className="control-label font-16 font-gray">
                                Name
                            </label>
                            <Input id="name"
                                name="name"
                                className="form-control"
                                onChange={onChangeHandler}
                                value={name}>
                            </Input>
                            {nameError !== null && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{nameError}</span>
                                </div>
                            )}
                        </div>

                    </form>
                    <br />

                    <div className="float-right">
                        <Button color="default btn-sm" className="mr-2" onClick={toggle}>Cancel</Button>
                        <button className="btn btn-primary main-button main-button-sm" disabled={loading} onClick={createNewProperty}>
                            Submit
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={editModal} toggle={editToggle} className="modal-350">
                <ModalHeader toggle={editToggle}>
                    <b className="font-22 font-black">Edit {property}</b>
                </ModalHeader>
                <ModalBody>
                    <form className="form-row mt-1">
                        <div className="form-group col-12">
                            <label htmlFor="name" className="control-label font-16 font-gray">
                                Name
                            </label>
                            <Input id="name"
                                name="name"
                                className="form-control"
                                onChange={onEditChangeHandler}
                                value={name}>
                            </Input>
                            {nameError !== null && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{nameError}</span>
                                </div>
                            )}
                        </div>

                    </form>
                    <br />

                    <div className="float-right">
                        <Button color="default btn-sm" className="mr-2" onClick={editToggle}>Cancel</Button>
                        <button className="btn btn-primary main-button main-button-sm" disabled={loading} onClick={editProperty}>
                            Submit
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default AddProperty;
