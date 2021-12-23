import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteIncome } from "../../api/rest";

const RemoveIncome = (props) => {
    const {
        income,
        refresh,
        className,
        forUser
    } = props;

    const { user } = useContext(UserContext);

    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    }

    const removeIncome = async (event) => {
        event.preventDefault();

        try {
            const success = await deleteIncome(income.id);
            if (success) {
                toggle();
                refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        !forUser ? null
        :
        <div className="ml-auto mr-3 float-right">
            <FontAwesomeIcon icon={['fas', 'trash-alt']}
                className={"action-icon " + (user.id !== forUser.id ? "action-icon-disabled" : "")}
                onClick={event => {
                    if (user.id !== forUser.id) {
                        return;
                    }
                    toggle(event);
                }}
                title="Remove record" />

            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>
                    <b className="font-22 font-black">Remove Income</b>
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        Are you sure you want to delete this record?
                    </div>

                    <div className="float-right">
                        <Button color="default btn-sm" className="mr-2" onClick={toggle}>Cancel</Button>
                        <button className="btn btn-primary main-button main-button-sm" onClick={removeIncome}>
                            Delete
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default RemoveIncome;
