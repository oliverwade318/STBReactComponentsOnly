import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { UserContext } from "../../providers/UserProvider";
import CONSTANTS from "../../shared/Constants";
import { updateProfile } from "../../api/rest";
import { InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { toastError } from "../../shared/ToastifyService";
import { changeEmail, changeProfile } from "../../firebase";
import ImagePreviewer from "./ImagePreviewer";
import makeAnimated from "react-select/animated";
import "./Setting.css";

const animatedComponents = makeAnimated();

const Profile = () => {
  const { user, setUser, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentEmail, setCurrentEmail] = useState(user.email);
  const [usernameError, setUsernameError] = useState(null);
  const [gender, setGender] = useState(
    user.gender && CONSTANTS.genders.map((i) => i.key).includes(user.gender)
      ? user.gender
      : CONSTANTS.defaultGender.key
  );
  const [currency, setCurrency] = useState(
    user.currency || CONSTANTS.defaultCurrency.key
  );
  const [additionalCurrency, setAdditionalCurrency] = useState(
    user.additionalCurrency
  );

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "username") {
      setUsername(value);
    } else if (name === "gender") {
      console.log(value);
      setGender(value);
    } else if (name === "currency") {
      setCurrency(value);
    } else if (name === "userEmail") {
      setEmail(value);
    }
  };

  function defineIconClasses(theKey) {
    const theCurrency = CONSTANTS.currencies.find(
      (next) => next.key === theKey
    );
    return !!theCurrency
      ? theCurrency.iconClasses
      : CONSTANTS.defaultCurrency.iconClasses;
  }
  const [iconClasses, setIconClasses] = useState(
    CONSTANTS.defaultCurrency.iconClasses
  );

  // useEffect(() => {
  //     const subscriptionDiff = user.subscription ? user.subscription - Date.now() : -1;
  //     if (subscriptionDiff < 0) {
  //         navigate('/subscription');
  //     }
  // });
  useEffect(() => {
    setIconClasses(defineIconClasses(currency));
  }, [currency]);

  const updateUserInfo = () => {
    changeProfile(
      {
        displayName: username,
      },
      async () => {
        const updatedProfile = await updateProfile({
          email,
          username,
          gender,
          currency,
          additionalCurrency: additionalCurrency
            ? additionalCurrency.map((item) => item.key).join(",")
            : "",
        });
        setUser(updatedProfile);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
        const message = "Unexpected error occurred";
        toastError(message);
      }
    );
  };

  const doUpdateProfile = async (event) => {
    event.preventDefault();
    setUsernameError(null);
    if (!username || !username.trim()) {
      setUsernameError("Username is a required field");
      return;
    }

    try {
      setLoading(true);
      if (user.isEmail) {
        if (currentEmail !== email) {
          changeEmail(
            email,
            async () => {
              setCurrentEmail(email);
              updateUserInfo();
            },
            (error) => {
              console.log(error);
              setLoading(false);
              const message =
                error.code === "auth/requires-recent-login"
                  ? error.message
                  : "Unexpected error occurred";
              toastError(message);
            }
          );
        } else {
          updateUserInfo();
        }
      } else {
        const updatedProfile = await updateProfile({
          email,
          username,
          gender,
          currency,
          additionalCurrency: additionalCurrency
            ? additionalCurrency.map((item) => item.key).join(",")
            : "",
        });
        setUser(updatedProfile);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onChangeAdditionalCurrency = (selectedOptions) => {
    setAdditionalCurrency(selectedOptions);
  };

  const currencyArray = (strValue) => {
    if (strValue) {
      const strArr = strValue.split(",");
      return CONSTANTS.currencies.filter((item) => strArr.includes(item.key));
    } else {
      return [];
    }
  };

  return (
    <div className="row">
      <div className="col text-center mt-1 mb-3">
        <ImagePreviewer />
        <div className="text-left app-responsive-form">
          <form className="form-row mt-4">
            <div className="form-group col-12">
              <label
                htmlFor="username"
                className="control-label font-16 font-gray"
              >
                Username
              </label>
              <input
                type="text"
                className="form-control app-input"
                name="username"
                id="username"
                value={username}
                disabled={!user.isEmail}
                placeholder="E.g. Twitter handle"
                onChange={onChangeHandler}
              />
              {usernameError !== null && (
                <div className="font-14 font-red mt-1">
                  <span className="text-danger">{usernameError}</span>
                </div>
              )}
            </div>

            <div className="form-group col-12">
              <label
                htmlFor="gender"
                className="control-label font-16 font-gray"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                onChange={onChangeHandler}
                value={gender}
              >
                {CONSTANTS.genders.map((gender) => (
                  <option key={gender.key} value={gender.key}>
                    {gender.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group d-flex col-12">
              <div className="currency-wrapper">
                <label
                  htmlFor="currency"
                  className="control-label font-16 font-gray"
                >
                  Default Currency
                </label>
                <InputGroup>
                  <select
                    id="currency"
                    name="currency"
                    className="form-control"
                    onChange={onChangeHandler}
                    value={currency}
                  >
                    {CONSTANTS.currencies.map((currency) => (
                      <option key={currency.key} value={currency.key}>
                        {currency.value}
                      </option>
                    ))}
                  </select>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <FontAwesomeIcon
                        icon={iconClasses}
                        style={{ color: "black" }}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="currency-wrapper">
                <label
                  htmlFor="additionalCurrency"
                  className="control-label font-16 font-gray"
                >
                  Additional Currency
                </label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={CONSTANTS.currencies}
                  defaultValue={currencyArray(user.additionalCurrency)}
                  onChange={onChangeAdditionalCurrency}
                />
              </div>
            </div>

            <div className="form-group col-12">
              <label
                htmlFor="userEmail"
                className="control-label font-16 font-gray"
              >
                Email address
              </label>
              <input
                type="email"
                disabled={!user.isEmail}
                className="form-control"
                name="userEmail"
                id="userEmail"
                value={email}
                onChange={onChangeHandler}
              />
            </div>
          </form>

          <button
            className="btn btn-primary main-button mt-3"
            onClick={(event) => {
              doUpdateProfile(event);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
