import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import IntroPanel from "../shared/IntroPanel";
import './Auth.css';

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
    const [error, setError] = useState(null);

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "userEmail") {
            setEmail(value);
        }
    };

    const sendResetEmail = event => {
        event.preventDefault();
        auth
            .sendPasswordResetEmail(email)
            .then(() => {
                setEmailHasBeenSent(true);
                setTimeout(() => { setEmailHasBeenSent(false) }, 5000);
            })
            .catch((err) => {
                if (err.code = 'auth/user-not-found') setError({message: "No matching email address found", field: "email"});
                else setError({message: "Error resetting password", field: null});
            });
    };

    return (
        <div className="container-fluid">
            <div className="row auth-row">
                <IntroPanel />
                <div className="col text-center mt-5 auth-content">
                    <div className="offset-md-3 col-md-6 text-left">
                        <h1 className="font-28 font-black"><b>Forgot your password?</b></h1>
                        <span className="font-16 font-black">We'll help you reset it and get back on track</span>
                        {emailHasBeenSent && (
                            <div className="text-center mt-4">
                                <span className="text-success">
                                    An email was sent to the address provided. Click the link in the email to reset your password.
                                </span>
                            </div>
                        )}
                        {error !== null && !error.field && (
                            <div className="text-center mt-4">
                                <span className="text-danger">{error.message}</span>
                            </div>
                        )}

                        <form className="form-row mt-4">
                            <div className="form-group col-12">
                                <label htmlFor="userEmail" className="control-label font-16 font-gray">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="userEmail"
                                    id="userEmail"
                                    value={email}
                                    onChange={onChangeHandler}
                                />
                            </div>
                            {error !== null && error.field === 'email' && (
                                <div className="text-center mt-4">
                                    <span className="text-danger">{error.message}</span>
                                </div>
                            )}
                        </form>

                        <button className="btn btn-primary main-button mt-3 mb-3" onClick={(event) => { sendResetEmail(event) }}>
                            Reset password
                        </button>

                        <p className="text-center mt-5">
                            <Link to="/login" className="btn btn-primary link-button">
                                <b className="link-button-text">Back to Login</b>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
