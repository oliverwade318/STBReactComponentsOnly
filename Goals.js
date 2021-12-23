import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import CONSTANTS from "../shared/Constants";
import { getIncomesResult, updateProfile } from "../api/rest";

import {
  Card,
  CardBody,
  CardTitle,
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Goals.css";

const goalType = {
  today: "Daily",
  currentMonth: "Monthly",
  currentYear: "Yearly",
};

const Goals = () => {
  const {
    user,
    asUser,
    propertyMaps,
    asUserPropertyMaps,
    setUser,
    setLoading,
  } = useContext(UserContext);
  const [thePropertyMaps] = useState(
    !!asUser ? asUserPropertyMaps : propertyMaps
  );
  const [statistics, setStatistics] = useState({
    today: null,
    currentMonth: null,
    currentYear: null,
  });
  const [goals, setGoals] = useState({
    today: !!asUser ? asUser.day_goal : user.day_goal,
    currentMonth: !!asUser ? asUser.month_goal : user.month_goal,
    currentYear: !!asUser ? asUser.year_goal : user.year_goal,
  });
  const [activeType, setActiveType] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [goalValue, setGoalValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let incomesResult = await getIncomesResult(
        new Date(`1/1/${new Date().getFullYear()}`).getTime(),
        new Date().getTime(),
        [],
        [],
        Object.keys(thePropertyMaps.sources)
      );
      setStatistics(incomesResult.statistics);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setGoals({
      today: user.day_goal,
      currentMonth: user.month_goal,
      currentYear: user.year_goal,
    });
  }, [user]);

  const getCurrencySymbol = () => {
    const currencyItem = CONSTANTS.currencies.find(
      (item) => item.key === user?.currency
    );
    return currencyItem?.symbol;
  };

  const onMouseEnter = (type) => {
    setActiveType(type);
  };

  const onClick = (type) => {
    setActiveType(type);
    setShowModal(true);
    setGoalValue(goals[type] / 100);
  };

  const toggle = () => {
    if (showModal) {
      setGoalValue(0);
    }
    setShowModal(!showModal);
  };

  const updateGoal = async () => {
    const gender = !!asUser ? asUser.gender : user.gender;
    const genders = ["M", "F", "NB"];
    const body = {
      email: !!asUser ? asUser.email : user.email,
      username: !!asUser ? asUser.username : user.username,
      gender: genders.includes(gender) ? gender : "M",
      currency: !!asUser ? asUser.currency : user.currency,
    };
    if (activeType === "today") {
      body.day_goal = goalValue * 100;
    } else if (activeType === "currentMonth") {
      body.month_goal = goalValue * 100;
    } else {
      body.year_goal = goalValue * 100;
    }
    setLoading(true);
    const updatedProfile = await updateProfile(body);
    setUser(updatedProfile);
    setLoading(false);
    toggle();
  };

  return (
    <div className="container py-3 py-md-4">
      <div className="row">
        <Card className="col-12">
          <CardBody>
            <CardTitle tag="h5">{user.username} Goals</CardTitle>
            <div className="row pt-3">
              <div
                className="col d-flex flex-column align-items-center cursor-pointer"
                onMouseEnter={() => onMouseEnter("today")}
                onClick={() => onClick("today")}
              >
                <CircularProgressbar
                  value={
                    goals.today && goals.today > 0 && statistics.today
                      ? (statistics.today.sum / goals.today) * 100
                      : 0
                  }
                  text={`${getCurrencySymbol()}${goals.today / 100}`}
                  styles={{ path: { stroke: "#f3828d" } }}
                />
                <p
                  className="pt-3"
                  style={{
                    color: activeType === "today" ? "#f3828d" : "inherit",
                    fontWeight: activeType === "today" ? "bold" : "inherit",
                  }}
                >
                  Daily
                </p>
              </div>
              <div
                className="col d-flex flex-column align-items-center cursor-pointer"
                onMouseEnter={() => onMouseEnter("currentMonth")}
                onClick={() => onClick("currentMonth")}
              >
                <CircularProgressbar
                  value={
                    goals.currentMonth &&
                    goals.currentMonth > 0 &&
                    statistics.currentMonth
                      ? (statistics.currentMonth.sum / goals.currentMonth) * 100
                      : 0
                  }
                  text={`${getCurrencySymbol()}${goals.currentMonth / 100}`}
                  styles={{ path: { stroke: "#42E695" } }}
                />
                <p
                  className="pt-3"
                  style={{
                    color:
                      activeType === "currentMonth" ? "#42E695" : "inherit",
                    fontWeight:
                      activeType === "currentMonth" ? "bold" : "inherit",
                  }}
                >
                  Monthly
                </p>
              </div>
              <div
                className="col d-flex flex-column align-items-center cursor-pointer"
                onMouseEnter={() => onMouseEnter("currentYear")}
                onClick={() => onClick("currentYear")}
              >
                <CircularProgressbar
                  value={
                    goals.currentYear &&
                    goals.currentYear > 0 &&
                    statistics.currentYear
                      ? (statistics.currentYear.sum / goals.currentYear) * 100
                      : 0
                  }
                  text={`${getCurrencySymbol()}${goals.currentYear / 100}`}
                  styles={{ path: { stroke: "#7ab4f3" } }}
                />
                <p
                  className="pt-3"
                  style={{
                    color: activeType === "currentYear" ? "#7ab4f3" : "inherit",
                    fontWeight:
                      activeType === "currentYear" ? "bold" : "inherit",
                  }}
                >
                  Yearly
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="row mt-3 mt-md-4">
        <Card className="col-12">
          <CardBody>
            <CardTitle tag="h5">{`${goalType[activeType]} Goal`}</CardTitle>
            <div className="row pt-3">
              <div className="col">
                <Progress
                  color="success"
                  value={
                    goals[activeType] &&
                    goals[activeType] > 0 &&
                    statistics[activeType]
                      ? (statistics[activeType].sum / goals[activeType]) * 100
                      : 0
                  }
                />
                <div className="d-flex w-100 display-wrapper mt-2">
                  <p>{getCurrencySymbol()}0</p>
                  <p>
                    {`${getCurrencySymbol()}${
                      statistics[activeType]?.sum
                        ? statistics[activeType].sum / 100
                        : "0"
                    }`}{" "}
                    / {`${getCurrencySymbol()}${goals[activeType] / 100}`}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="row mt-3 mt-md-4">
        <div className="col px-0 pr-2">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                {`${getCurrencySymbol()}${
                  goals[activeType] && statistics[activeType]
                    ? Math.round(
                        goals[activeType] - statistics[activeType].sum
                      ) / 100
                    : 0
                }`}{" "}
                <span style={{ fontWeight: 600 }}>
                  left until you reach your goal!
                </span>
              </CardTitle>
            </CardBody>
          </Card>
        </div>
        <div className="col px-0 pl-2">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                {`${
                  goals[activeType] &&
                  goals[activeType] > 0 &&
                  statistics[activeType]
                    ? Math.round(
                        (statistics[activeType].sum / goals[activeType]) * 10000
                      ) / 100
                    : 0
                }%`}
              </CardTitle>
            </CardBody>
          </Card>
        </div>
      </div>
      <Modal isOpen={showModal} className="goalModal">
        <ModalHeader>
          <b className="font-22 font-black">{`Update ${goalType[activeType]} Goal`}</b>
        </ModalHeader>
        <ModalBody>
          <div>
            <label htmlFor="goal" className="control-label font-16 font-gray">
              {`${goalType[activeType]} Goal`}
            </label>
            <Input
              min={0}
              type="number"
              step="1"
              id="amount"
              name="amount"
              onChange={(e) => setGoalValue(e.target.value)}
              value={goalValue}
            ></Input>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="float-right">
            <Button color="default btn-sm" className="mr-2" onClick={toggle}>
              Cancel
            </Button>
            <button
              className="btn btn-primary main-button main-button-sm"
              onClick={updateGoal}
            >
              Submit
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Goals;
