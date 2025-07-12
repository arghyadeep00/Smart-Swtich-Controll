import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const Login = () => {
  const { backendUrl } = useContext(StoreContext);
  const [switchPage, setSwitchPage] = useState(true);
  // for login
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const loginHandleOnChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setloginData((prevItem) => ({ ...prevItem, [name]: value }));
  };
  const handleOnSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, loginData);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);
        window.location.reload();
      }
      console.log(response)
    } catch (error) {
      console.log(error)
      toast.error("Invalid user id or password");
    }
  };
  // for sign up
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const signUpHandleOnChange = async (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };
  const handleOnSubmitSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/sign_up`,
        signupData
      );
      if (response) {
        toast.success(response.data.message);
        toast.success("Go to login page and login");
      }
    } catch (error) {}
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {switchPage ? (
        <StyledWrapper>
          <div className="form-container">
            <p className="title">Login</p>
            <form className="form" onSubmit={handleOnSubmitLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  id="email"
                  value={loginData.email}
                  placeholder="Email"
                  onChange={loginHandleOnChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={loginData.password}
                  onChange={loginHandleOnChange}
                  required
                  placeholder="Password"
                />
                <div className="switch">
                  <button
                    className="cursor-pointer"
                    onClick={(e) => setSwitchPage((prev) => !prev)}
                  >
                    Create new account ?
                  </button>
                </div>
              </div>
              <button className="sign">Sign in</button>
            </form>
          </div>
        </StyledWrapper>
      ) : (
        <StyledWrapper>
          <div className="form-container">
            <p className="title">Sign Up</p>
            <form className="form" onSubmit={handleOnSubmitSignUp}>
              <div className="input-group">
                <label htmlFor="name">User Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  id="name"
                  value={signupData.name}
                  placeholder="Enter user name"
                  onChange={signUpHandleOnChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  id="email"
                  value={signupData.email}
                  placeholder="Enter email address"
                  onChange={signUpHandleOnChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  id="phone"
                  value={signupData.phone}
                  placeholder="Enter phone number"
                  onChange={signUpHandleOnChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={signupData.password}
                  onChange={signUpHandleOnChange}
                  required
                  placeholder="Password"
                />
                <div className="switch">
                  <button
                    className="cursor-pointer"
                    onClick={(e) => setSwitchPage((prev) => !prev)}
                  >
                    Login your account ?
                  </button>
                </div>
              </div>
              <button className="sign">Sign Up</button>
            </form>
          </div>
        </StyledWrapper>
      )}
    </div>
  );
};

const StyledWrapper = styled.div`
  .form-container {
    width: 420px;
    border-radius: 0.75rem;
    background-color: #17181c;
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: #17181c;
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  .switch {
    display: flex;
    justify-content: flex-end;
    font-size: 1rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
    margin: 20px 10px 20px 0px;
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
  }
`;

export default Login;
