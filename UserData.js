import React from "react";
import "./TabularData.css";
import { formatDate } from "../shared/DateUtils";

const UserData = ({ user }) => {
  return (
    <div className="table-block">
      <div>
        <span>Username</span>
        <span>Email</span>
        <span>Registered</span>
        <span>ADD TRIAL</span>
      </div>
      <div>
        <span>{user.username}</span>
        <span>{user.email}</span>
        <span> {formatDate(user.registered)}</span>
        <span>
          <select
            className="form-control-sm"
            name="trial"
            value={user.addedTrial}
            disabled={user.addedTrial}
            // onChange={(event) => onChangeTrial(user, event.currentTarget.value)}
          >
            <option value={0}></option>
            <option value={14}>14</option>
            <option value={30}>30</option>
          </select>
        </span>
      </div>
      <div className="table-block-actions-eye">
        
      </div>
    </div>
  );
};

export default UserData;
