import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "@reach/router";
import { auth } from "../firebase";
import CONSTANTS from "../shared/Constants";
import { UserContext } from "../providers/UserProvider";
import IntroPanel from "../shared/IntroPanel";
import { getUser } from "../api/rest";
import { YEAR_MILLIS } from '../shared/DateUtils';
import './Auth.css';

const GiftSignUp = (props) => {
    const userContext = useContext(UserContext);
    const {giftId, userEmail, userType} = props;
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState(CONSTANTS.defaultGender.key);
    const [email, setEmail] = useState(giftId === 'free' ? '' : userEmail);
    const [emailValid, setEmailValid] = useState(true);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPasswordPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        var emailField = document.getElementById('userEmail')
        emailField.addEventListener('nb:result', function (e) {
            const valid = e.detail.result.is(_nb.settings.getAcceptedStatusCodes());
            setEmailValid(valid);
        });
        _nb.fields.registerListener(emailField, true);
        async function fetchUsers() {
            getUser(giftId, userType).then(user => {
                if(!user.giftUsers || !user.giftUsers.includes(userEmail)) {
                    navigate('/home');
                }
            }).catch(error => {
                navigate('/home');
            });
        }
        if (giftId !== 'free') fetchUsers();

        return () => {
            _nb.fields.unregisterListener(emailField);
        }
    }, [])

    const createUserWithEmailAndPasswordHandler = async (event) => {
        event.preventDefault();
        if (!password || password.length < 6) {
            setError({message: 'Password must be at least 6 characters', field: 'password'});
            return;
        }
        if (password !== confirmPassword) {
            setError({message: 'Password and Confirm Password are not equal', field: 'password'});
            return;
        }

        try {
            const subscription = giftId === 'free' ? null : Date.now() + YEAR_MILLIS;
            userContext.setAdditionalData({ gender, username, subscription, giftId, userType });
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await user.updateProfile({
                displayName: username
            });
        } catch (error) {
            console.log(error);
            setError({message: 'Error Signing up with email and password', filed: null});
        }
    };

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "username") {
            setUsername(value);
        } else if (name === "gender") {
            setGender(value);
        } else if (name === "userEmail") {
            setEmail(value);
            setEmailValid(false);
        } else if (name === "userPassword") {
            setPassword(value);
        } else if (name === "userConfirmPassword") {
            setConfirmPasswordPassword(value);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row auth-row">
                <IntroPanel />
                <div className="col text-center mt-5 auth-content">
                    <div className="offset-md-3 col-md-6 text-left">
                        {error !== null && !error.field && (
                            <div className="text-center mt-4">
                                <span className="text-danger">{error.message}</span>
                            </div>
                        )}

                        <form className="form-row mt-4">
                            <div className="form-group col-12">
                                <label htmlFor="username" className="control-label font-16 font-gray">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control app-input"
                                    name="username"
                                    id="username"
                                    value={username}
                                    placeholder="E.g. Twitter handle"
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="form-group col-12">
                                <label htmlFor="gender" className="control-label font-16 font-gray">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="form-control"
                                    onChange={onChangeHandler}
                                    value={gender}>
                                    {CONSTANTS.genders.map((gender) => <option key={gender.key} value={gender.key}>{gender.value}</option>)}
                                </select>
                            </div>

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
                                    disabled={giftId !== 'free'}
                                    onChange={onChangeHandler}
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
                                    id="userPassword"
                                    value={password}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            {error !== null && error.field === 'password' && (
                                <div className="text-center mt-4">
                                    <span className="text-danger">{error.message}</span>
                                </div>
                            )}

                            <div className="form-group col-12">
                                <label htmlFor="userConfirmPassword" className="control-label font-16 font-gray">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="userConfirmPassword"
                                    id="userConfirmPassword"
                                    value={confirmPassword}
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </form>

                        <button className="btn btn-primary main-button mt-3" disabled={!emailValid}
                            onClick={(event) => { createUserWithEmailAndPasswordHandler(event) }}>
                            Sign up
                        </button>

                        <span className="font-16 font-black mt-3 d-block">
                            By clicking "Sign up", you agree to the following <a href="/rules/privacy" target="_blank" className="app-link">
                                Privacy Policy
                            </a> and <a href="/rules/terms" target="_blank" className="app-link">
                                Terms of Service
                            </a>.
                        </span>

                        <p className="text-center mt-4 bottom-text">
                            <b className="font-16 font-gray mr-2">Already have an account?</b>{" "}
                            <Link to="/login" className="btn btn-primary link-button">
                                <b className="link-button-text">Login</b>
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GiftSignUp;
