import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { getBraintreeToken, executePayment } from "../../api/rest";
// import 'braintree-web';
import DropIn from 'braintree-web-drop-in-react';
import ReactLoading from "react-loading";
import { toastSuccess } from '../../shared/ToastifyService';
import './Purchase.css';
const Purchase = (props) => {
    const { user, setUser } = useContext(UserContext);
    const [clientToken, setClientToken] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [instance, setInstance] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [senderEmail, setSenderEmail] = useState((user && user.email) ? user.email : '');
    const { type, userType } = props.location.state;

    useEffect(() => {
        async function fetchClientToken() {
            const resData = await getBraintreeToken();
            if (resData && resData.clientToken) setClientToken(resData.clientToken);

        }
        fetchClientToken();
    }, []);

    const buy = async (event) => {
        try {
          // Send the nonce to your server
            const { nonce } = await instance.requestPaymentMethod();
            const body = {
                paymentMethodNonce: nonce,
                amount: type === 'monthly' ? 12 : 129.6,
                type,
                userType,
                userId: user ? user.id : '',
                userEmail,
                senderEmail
            }
            const response = await executePayment(body);
            if (response && userType === 'user') {
                setUser(response);
                toastSuccess("Profile successfully updated");
            } else if (response && userType === 'non-user') {
                toastSuccess("Successfully paid");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const onChangeEmail = (event) => {
        event.persist();
        if (event.target.name === 'userEmail') setUserEmail(event.target.value);
        if (event.target.name === 'senderEmail') setSenderEmail(event.target.value);
    }

    return (
        clientToken
            ?
            <div className="row">
                <div className="col text-center mt-1">
                    <div className="text-left purchase-wrapper">
                    {
                        type === 'gift' &&
                            <div className="gift-email">
                                {   
                                    userType === 'non-user' &&
                                        <div className="form-group col-12 gift-email">
                                            <label htmlFor="senderEmail" className="control-label font-16 font-gray">
                                                Enter your email.
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="senderEmail"
                                                id="senderEmail"
                                                value={senderEmail}
                                                onChange={onChangeEmail}
                                            />
                                        </div>
                                }
                                <div className="form-group col-12 gift-email">
                                    <label htmlFor="userEmail" className="control-label font-16 font-gray">
                                        Enter the user's email you are trying to gift.
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="userEmail"
                                        id="userEmail"
                                        value={userEmail}
                                        onChange={onChangeEmail}
                                    />
                                </div>
                            </div>
                    }
                        <DropIn
                            options={{
                                authorization: clientToken,
                                translations: {
                                    payWithCard: 'card',
                                    payingWith: ''
                                },
                                paypal: {
                                    flow: 'checkout'
                                },
                                googlePay: {
                                    merchantId: 'merchantId'
                                },
                                applePay: {
                                    displayName: 'Secure the Bag'
                                },
                                venmo: true
                            }}
                            onInstance={(instanceObj) => {
                                setInstance(instanceObj);
                            }}
                            onPaymentOptionSelected={(method) => setPaymentMethod(method.paymentOption)}
                        />
                        {
                            paymentMethod &&
                                <button className="btn btn-primary main-button purchase-button mt-3"
                                    onClick={(event) => { buy(event) }}>
                                    Purchase
                                </button>
                        }
                    </div>
                </div>
            </div>
            : <div className="loadingWrapper">
                <ReactLoading type="spokes"  color="#357edd"/>
            </div>
    )
};

export default Purchase;
