import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from "../../providers/UserProvider";
import { changePassword } from "../../firebase";
import { toastError, toastSuccess } from '../../shared/ToastifyService';

const PasswordChange = () => {
    const { user } = useContext(UserContext);

    const [valid, setValid] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    useEffect(() => {
        const valid = !!PasswordChange && !!password && !!confirmPassword;
        setValid(valid);
    }, [currentPassword, password, confirmPassword])

    const doChangePassword = async (event) => {
        event.preventDefault();
        setPasswordError(null);
        setConfirmPasswordError(null);
        let error = false;
        if (!password || password.length < 6) {
            setPasswordError('Your password must be 6 or more characters in length');
            error = true;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('New Password and Confirm New Password are not equal');
            error = true;
        }
        if (error) {
            return;
        }

        changePassword(currentPassword, password,
            function () {
                toastSuccess("Password changed successfully");
                setCurrentPassword("");
                setPassword("");
                setConfirmPassword("");
            }, function (error) {
                console.log(error);
                const message = error?.code === "auth/wrong-password"
                    ? "The Current Password is not correct"
                    : "Unexpected error occurred";
                toastError(message);
            })
    };

    return (
        <div className="row">
            <div className="col text-center mt-1 mb-3">
                <div className="text-left app-responsive-form">
                    <form className="form-row mt-4">
                        {
                            !user.isEmail
                                ? <div className="form-group col-12">
                                    <label className="control-label font-16 font-gray">
                                        <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} />&nbsp;
                                        You are signed in using Twitter or Google. To change the password please use the corresponding service.
                                    </label>
                                </div>
                                : ""
                        }
                        <div className="form-group col-12">
                            <label htmlFor="oldPassword" className="control-label font-16 font-gray">
                                Old Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="oldPassword"
                                id="oldPassword"
                                disabled={!user.isEmail}
                                value={currentPassword}
                                onChange={(event) => { setCurrentPassword(event.currentTarget.value) }} />
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="newPassword" className="control-label font-16 font-gray">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                id="newPassword"
                                disabled={!user.isEmail}
                                value={password}
                                onChange={(event) => { setPassword(event.currentTarget.value) }} />
                            {!!passwordError && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{passwordError}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="confirmNewPassword" className="control-label font-16 font-gray">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmNewPassword"
                                id="confirmNewPassword"
                                disabled={!user.isEmail}
                                value={confirmPassword}
                                onChange={(event) => { setConfirmPassword(event.currentTarget.value) }} />
                            {!!confirmPasswordError && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{confirmPasswordError}</span>
                                </div>
                            )}
                        </div>
                    </form>

                    <button className="btn btn-primary main-button mt-3" disabled={!user.isEmail || !valid}
                        onClick={(event) => { doChangePassword(event) }}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
};

export default PasswordChange;
