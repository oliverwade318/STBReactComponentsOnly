import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import SignUp from "./SignUp";
import GiftSignUp from "./GiftSignUp";
import SignIn from "./SignIn";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./Dashboard";
import Goals from "./Goals";
import Users from "./users/Users";
import UsersDev from "./users/UsersDev";
import Subscription from "./Subscription/Subscription";
import Homepage from "./home/Homepage";
import DocumentLayout from "./layout/DocumentLayout";
import PrivacyPolicy from "./documents/PrivacyPolicy";
import TermsOfService from "./documents/TermsOfService";
import PasswordReset from "./PasswordReset";
import SettingsLayout from "./layout/SettingsLayout";
import Profile from "./settings/Profile";
import TaxCalculator from "./settings/TaxCalculator";
import PasswordChange from "./settings/PasswordChange";
import Purchase from "./Subscription/Purchase";
import { UserContext } from "../providers/UserProvider";

function Application() {
  const { user } = useContext(UserContext);

  return user ? (
    !!user.isAdmin ? (
      <Router>
        <SettingsLayout path="/settings">
          <Profile path="profile" />
          <PasswordChange path="change" />
          <TaxCalculator path="tax-calculator" />
          <Redirect default noThrow from="/" to="profile" />
        </SettingsLayout>

        <MainLayout path="/dashboard">
          <Dashboard path="/" />
          {user.isDev ? <UsersDev path="users" /> : <Users path="users" />}

          <Redirect default noThrow from="/" to="users" />
        </MainLayout>

        <DocumentLayout path="/rules">
          <PrivacyPolicy path="privacy" />
          <TermsOfService path="terms" />
          <Redirect default noThrow from="/" to="privacy" />
        </DocumentLayout>
        <MainLayout path="/goals">
          <Goals path="/" />
        </MainLayout>

        <Redirect default noThrow from="/" to="/dashboard" />
      </Router>
    ) : (
      <Router>
        <SettingsLayout path="/settings">
          <Profile path="profile" />
          <PasswordChange path="change" />
          <TaxCalculator path="tax-calculator" />
          <Redirect default noThrow from="/" to="profile" />
        </SettingsLayout>

        <MainLayout path="/dashboard">
          <Dashboard path="/" />
        </MainLayout>
        <MainLayout path="/goals">
          <Goals path="/" />
        </MainLayout>

        <MainLayout path="/subscription/:userType">
          <Subscription path="/" />
          <Purchase path="purchase" />
        </MainLayout>

        <DocumentLayout path="/rules">
          <PrivacyPolicy path="privacy" />
          <TermsOfService path="terms" />
          <Redirect default noThrow from="/" to="privacy" />
        </DocumentLayout>

        {/* <Redirect default noThrow from="/" to="/settings" /> */}
        <Redirect default noThrow from="/" to="/dashboard" />
      </Router>
    )
  ) : (
    <Router>
      <SignUp path="register" />
      <GiftSignUp path="register/:giftId/:userEmail/:userType" />
      <SignIn path="/login" />
      <PasswordReset path="/reset" />

      <DocumentLayout path="/rules">
        <PrivacyPolicy path="privacy" />
        <TermsOfService path="terms" />
        <Redirect default noThrow from="/" to="privacy" />
      </DocumentLayout>

      <DocumentLayout path="/subscription/:userType">
        <Subscription path="/" />
        <Purchase path="purchase" />
      </DocumentLayout>

      <Homepage path="/home" />
      <Redirect default noThrow from="/" to="/home" />
    </Router>
  );
}

export default Application;
