import React from "react";
import { Link, useNavigate } from "@reach/router";
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../logo-horizontal.svg';
import handImage from './hand.png';
import trackImage from './track.png';
import securityImage from './security.png';
import bit256Image from './256bit.png';
import investImage from './invest.png';

const Homepage = () => {
    const navigate = useNavigate()

    return (
        <>
            <header className="home-header">
                <div>
                    <img src={logo} className="home-logo" alt={process.env.REACT_APP_READABLE_NAME} />

                    <div className="float-right" style={{
                        marginTop: "12px",
                        marginRight: "20px"
                    }}>
                        <Link to="/login" className="menu-text app-clickable font-14 mr-3" style={{
                            textDecoration: "none"
                        }}>
                            <b>Login</b>
                        </Link>

                        <Link to="/register" className="home-button-sm menu-text app-clickable font-14" style={{
                            textDecoration: "none"
                        }}>
                            <b>Register</b>
                        </Link>
                    </div>

                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 offset-md-1 col-md-5 home-title">
                            <b className="font-48 font-white home-section-left">
                                Secure the bag, track your income
                            </b>
                            <br />
                            <div style={{
                                marginTop: "30px"
                            }}>
                                <Link to="/register" className="home-button menu-text app-clickable font-14 home-section-left" style={{
                                    textDecoration: "none"
                                }}>
                                    <b>Get Started</b>
                                </Link>
                            </div>
                        </div>
                        <div className="d-none d-md-block col-md-6">
                            <img src={handImage} className="float-right" style={{
                                height: "620px",
                                marginRight: "100px"
                            }} />
                        </div>
                    </div>
                </div>
                {/* <div class="bg-circle-1 bg-circle"></div>
                <div class="bg-circle-2 bg-circle"></div>
                <div class="bg-circle-3 bg-circle"></div>
                <div class="bg-circle-4 bg-circle"></div> */}
            </header>

            <div className="col text-center mt-1">
                <div className="home-section">
                    <div className="row text-center text-lg-left">
                        <div className="col-12 col-lg-6 home-image">
                            <img src={trackImage} style={{
                                height: "350px",
                            }} />
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="text-left home-float-right home-text" style={{
                                maxWidth: "335px"
                            }}>
                                <span className="font-36 section-font-header">
                                    Track your income,
                                    effortlessly
                                </span>
                                <br />

                                <span className="section-font-text" style={{
                                    marginTop: "20px",
                                    display: "inline-block"
                                }}>
                                    Visualize your 💰 grow using our
                                    interactive chart and view trends over
                                    time.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col text-center mt-1 d-none d-lg-inline-block">
                <div className="home-section">
                    <div className="row text-center text-lg-left">
                        <div className="col-12 col-lg-6">
                            <div className="text-left home-text" style={{
                                maxWidth: "335px"
                            }}>
                                <span className="font-36 section-font-header">
                                    Data protection
                                </span>
                                <br />

                                <span className="section-font-text" style={{
                                    marginTop: "20px",
                                    display: "inline-block"
                                }}>
                                    We take your privacy very seriously.
                                    Enjoy account anonymity, 256-bit
                                    encryption, and more.
                                </span>
                                <span className="section-font-text" style={{
                                    marginTop: "10px",
                                    display: "inline-block"
                                }}>
                                    Your data is your data and there is no
                                    geo-location tracking, period.
                                </span>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 home-image text-lg-right">
                            <img src={securityImage} style={{
                                height: "350px",
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col text-center mt-1 d-lg-none d-inline-block">
                <div className="home-section">
                    <div className="row text-center text-lg-left">
                        <div className="col-12 col-lg-6 home-image">
                            <img src={securityImage} style={{
                                height: "350px",
                            }} />
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="text-left home-float-right home-text" style={{
                                maxWidth: "335px"
                            }}>
                                <span className="font-36 section-font-header">
                                    Data protection
                                </span>
                                <br />

                                <span className="section-font-text" style={{
                                    marginTop: "20px",
                                    display: "inline-block"
                                }}>
                                    We take your privacy very seriously.
                                    Enjoy account anonymity, 256-bit
                                    encryption, and more.
                                </span>
                                <span className="section-font-text" style={{
                                    marginTop: "10px",
                                    display: "inline-block"
                                }}>
                                    Your data is your data and there is no
                                    geo-location tracking, period.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col text-center mt-1">
                <div className="home-section">
                    <div className="row text-center text-lg-left">
                        <div className="col-12 col-lg-6 home-image">
                            <img src={investImage} style={{
                                height: "350px",
                            }} />
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="text-left home-float-right home-text" style={{
                                maxWidth: "335px"
                            }}>
                                <span className="font-36 section-font-header">
                                    Invest in your future
                                </span>
                                <br />

                                <span className="section-font-text mb-4" style={{
                                    marginTop: "20px",
                                    display: "inline-block"
                                }}>
                                    Financial independence starts with a
                                    simple decision, and this includes
                                    monitoring your income. Watch your
                                    business grow using STB. <a className="app-link section-font-text" onClick={(event) => navigate("/register")}>Create an
                                    account</a> or <a className="app-link section-font-text" onClick={(event) => navigate("/register")}>log-in</a> today!
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-footer mt-5 d-block">
                <div className="text-center">
                    <br/>
                    <span className="section-font-header front-18" style={{
                        lineHeight: "29px!important"
                    }}>
                        Made with <FontAwesomeIcon icon={['fas', 'heart']} color={"red"} /> in New York
                    </span>
                    <br/>
                    <a href="/rules/privacy" target="_blank" className="home-link">
                        Privacy policy
                    </a> &nbsp; &nbsp;
                    <a href="/rules/terms" target="_blank" className="home-link">
                        Terms of use
                    </a>
                </div>
            </div>
        </>
    );
};

export default Homepage;
