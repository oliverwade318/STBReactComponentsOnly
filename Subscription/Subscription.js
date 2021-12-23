import React, { useState } from "react";
import { useNavigate } from "@reach/router";
import './Subscription.css';

const Subscription = (props) => {
    const {userType} = props;
    const [type, setType] = useState("monthly");
    const navigate = useNavigate();
    const onTypeChange = (event) => {
        event.persist();
        setType((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'));
    }

    const onClickGetStart = () => {
        navigate(`/subscription/${userType}/purchase`, { state: {type, userType}});
    }

    const onClickGift = () => {
        navigate(`/subscription/${userType}/purchase`, { state: {type: 'gift', userType}});
    }

    return (
        <div className="subscription">
            <h1 className="subscription_heading text-center">It will pay off</h1>
            <div className="subscription_content">
                <div className="subscription_content--pricing">
                    <p>$12</p>
                    <span style={{paddingLeft: 10}}>{`/MO`}</span>
                </div>
                <div className="subscription_content--desc">
                    <ul>
                        <li>Lorem ipsum dolor </li>
                        <li>At vero eos et accusam</li>
                        <li>Duis autem vel </li>
                        <li>Ut wisi enim ad</li>
                        <li>Nam liber tempor cum</li>
                        <li>Lorem ipsum dolor </li>
                        <li>At vero eos et accusam</li>
                    </ul>
                    {
                        userType === 'user' &&
                            <div className="subscription_content--switch">
                                <span>MONTHLY</span>
                                <div className="tgl-group">
                                    <input className='tgl tgl-light' id='display-address' type='checkbox' onChange={onTypeChange} />
                                    <label className='tgl-btn' htmlFor='display-address'></label>
                                </div>
                                <span>YEARLY</span>
                            </div>
                    }
                </div>
                <div className="subscription_content--actions">
                    <button className="btn btn-primary link-button main-button-sm" onClick={onClickGift}>
                        <b className="link-button-text">Gift this Subscription</b>
                    </button>
                    {
                        userType === 'user' &&
                            <button className="btn btn-primary main-button main-button-sm" onClick={onClickGetStart}>
                                Get Started
                            </button>
                    }
                </div>
            </div>
        </div>
    );
}


export default Subscription;