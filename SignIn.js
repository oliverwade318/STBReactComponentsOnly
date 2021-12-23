import React, { useState } from "react";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth, signInWithGoogle, signInWithTwitter } from "../firebase";
import IntroPanel from "../shared/IntroPanel";
import './Auth.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            setError("Error signing in with password and email!");
            console.error("Error signing in with password and email", error);
        });
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.currentTarget;

        if (name === 'userEmail') {
            setEmail(value);
        } else if (name === 'userPassword') {
            setPassword(value);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row auth-row">
                <IntroPanel />
                <div className="col text-center mt-5 auth-content">
                    <div className="offset-md-3 col-md-6 text-left">
                        <h1 className="font-28 font-black"><b>Sign in below</b></h1>
                        <form className="form-row mt-4">
                            <div className="form-group col-12">
                                <label htmlFor="userEmail" className="control-label font-16 font-gray">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="userEmail"
                                    value={email}
                                    id="userEmail"
                                    onChange={(event) => onChangeHandler(event)}
                                />
                            </div>
                            <div className="form-group col-12">
                                <label htmlFor="userPassword" className="control-label font-16 font-gray">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="userPassword"
                                    value={password}
                                    id="userPassword"
                                    onChange={(event) => onChangeHandler(event)}
                                />
                            </div>

                            <div className="auth-actions">
                                <div className="form-check d-inline">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label font-16 font-gray" htmlFor="rememberMe">Remember me</label>
                                </div>

                                <div className="d-inline float-right pr-0">
                                    <Link to="/reset" className="float-right app-link">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                        </form>

                        <button className="btn btn-primary main-button mt-3 mb-3" onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password) }}>
                            Sign in
                        </button>
                        {error !== null && (
                            <div className="text-center mt-4">
                                <span className="text-danger">{error}</span>
                            </div>
                        )}
                        <hr />
                        <button className="btn btn-primary google-button mt-3" onClick={(event) => { signInWithGoogle() }}>
                            <FontAwesomeIcon icon={['fab', 'google']} size="2x" style={{ color: 'white' }} className="float-left" />
                            <span className="align-middle">Sign in with Google</span>
                        </button>

                        <span className="font-16 font-black mt-3 d-block">
                            By signing in using Twitter or Google, you agree to the following <a href="/rules/privacy" target="_blank" className="app-link">
                                Privacy Policy
                            </a> and <a href="/rules/terms" target="_blank" className="app-link">
                                Terms of Service
                            </a>.
                        </span>

                        <p className="text-center mt-4 bottom-text">
                            <b className="font-16 font-gray mr-2">Don't have an account yet?</b>{" "}
                            <Link to="/register" className="btn btn-primary link-button">
                                <b className="link-button-text">Get Started</b>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignIn;
