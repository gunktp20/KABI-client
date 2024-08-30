import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Register";
import { validate } from "email-validator";
import { FormRow, Logo, Footer } from "../../components";
import { FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import api from "../../services/api";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { Alert } from "@mui/material";
import { useAppSelector } from "../../app/hook";
import { MdOutlineEmail } from "react-icons/md";
import wallpaper from "../../assets/images/wallpaper-3.jpg"
import logo_transparent from "../../assets/images/logo-transparent.png"

function Register() {
    const { token } = useAppSelector((state) => state.auth);

    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] =
        useState<string>("");

    const [emailError, setEmailError] = useState<boolean>(false);
    const [confirmPasswordError, setConfirmPasswordError] =
        useState<boolean>(false);

    const { alertType, alertText, showAlert, displayAlert } = useAlert();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.post(`/auth/register/`, {
                email,
                password,
            });
            console.log(data)
            displayAlert({
                msg: data?.msg,
                type: "success",
            });
            return setIsLoading(false);
        } catch (err: unknown) {
            console.log(err)
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg: msg,
                type: "error",
            });
            return setIsLoading(false);
        }
    };

    // const signInWithGoogle = async () => {
    //     window.location.href = 'http://localhost:5000/auth/google';
    //   };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (e.target.value === "") {
            setEmailErrorMessage("* Please provide an email");
            setEmailError(true);
            return;
        }
        if (validate(e.target.value)) {
            setEmailErrorMessage("* Email is not valid");
            setEmailError(false);
        } else {
            setEmailErrorMessage("* Email is not valid");
            setEmailError(true);
        }
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (e.target.value === "") {
            setPasswordErrorMessage("* please provide a password");
            setPasswordError(true);
            return;
        }
        setPasswordError(false);
    };

    const handleChangeConfirmPassword = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
        if (e.target.value === "") {
            setConfirmPasswordErrorMsg("* please provide a repeat password");
            setConfirmPasswordError(true);
            return;
        }
        setConfirmPasswordError(false);
    };

    useEffect(() => {
        if (confirmPassword !== password && confirmPassword) {
            setConfirmPasswordErrorMsg(
                "Repeat password must be the same with password"
            );
            setConfirmPasswordError(true);
            return;
        } else {
            setConfirmPasswordErrorMsg(
                "Repeat password must be the same with password"
            );
            setConfirmPasswordError(false);
            return;
        }
    }, [confirmPassword, password]);

    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [navigate]);

    return (
        <Wrapper>
            <div className="w-[100%] h-[100%] flex absolute ">
                <div className="bg-[#00000092] w-[100%] h-[100%] absolute"></div>
                <img src={wallpaper} className="w-[100%] h-[100%] object-cover object-top"></img>
            </div>
            {/* Navbar */}
            <div className="absolute top-[0px] w-[100%] flex justify-center items-center">
                <div className="w-[70%] py-4 flex justify-between text-white">
                    {/* title */}
                    <div className="font-semibold flex justify-center items-center">
                        <img src={logo_transparent} className="w-[35px]"></img>
                    </div>
                    {/* setup user start*/}
                    <div className="flex items-center">
                        <button
                            id="toggle-big-register-landing-drawer-btn"
                            className="text-[#fff] text-[13.5px] cursor-pointer border-r-[#fff] border-solid border-r-[2px] h-[60%] rp-[0.5rem] pl-[2rem] hover:text-primary-300 pr-[1.8rem] transition-[0.1s]"
                            onClick={() => {
                                navigate("/register")
                            }}
                        >
                            Sign Up
                        </button>
                        <button
                            id="toggle-big-login-landing-drawer-btn"
                            className="text-[#fff] text-[13.5px] cursor-pointer border-[#fff] p-[0.4rem] pl-[1.8rem] pr-[1.8rem] rounded-[100px]  hover:text-primary-300 transition-[0.1s]"
                            onClick={() => {
                                navigate("/login")
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                    {/* setup user end */}
                </div>
            </div>
            {/* Form Login */}
            <div className="w-[418px] bg-white border-[1px] shadow-sm rounded-sm px-10 py-12 relative top-[100px] flex flex-col items-center">
                <div className="flex items-center gap-2 mb-8">
                    <Logo width="28px" />
                    <div className="font-semibold text-[22px] text-primary-500">
                        KABI
                    </div>
                </div>
                {showAlert && (
                    <Alert
                        severity={alertType}
                        className="w-[100%]"
                        sx={{
                            fontSize: "11.4px",
                            display: "flex",
                            justifyItems: "center",
                            alignItems: "center",
                        }}
                    >
                        {alertText}
                    </Alert>
                )}
                <div className="w-[100%]">
                    <FormRow
                        type="text"
                        name="email"
                        labelText="E-mail"
                        value={email}
                        handleChange={handleChangeEmail}
                        error={emailError}
                        errMsg={emailErrorMessage}
                        icon={<MdOutlineEmail />}
                        tailwindClass="mt-[1.5rem]"
                    />
                </div>
                <div className="w-[100%]">
                    <FormRow
                        type="password"
                        name="password"
                        labelText="Password"
                        value={password}
                        handleChange={handleChangePassword}
                        error={passwordError}
                        errMsg={passwordErrorMessage}
                        icon={<FiLock />}
                        tailwindClass="mt-[1.3rem]"
                    />
                </div>
                <div className="w-[100%]">
                    <FormRow
                        type="password"
                        name="confirm_password"
                        labelText="Repeat Password"
                        value={confirmPassword}
                        handleChange={handleChangeConfirmPassword}
                        error={confirmPasswordError}
                        errMsg={confirmPasswordErrorMsg}
                        icon={<FiLock />}
                        tailwindClass="mt-[1.3rem]"
                    />
                </div>

                <button
                    disabled={!email || !password || !confirmPassword || emailError || passwordError || confirmPasswordError}
                    className="bg-primary-500 text-white hover:bg-primary-600 transition-all w-[100%] h-[38px] disabled:cursor-not-allowed text-sm font-sm mt-6 rounded-sm"
                    onClick={register}
                >
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        "Sign Up"
                    )}
                </button>
                <div className="flex relative justify-center items-center mb-7 w-[100%] mt-7">
                    <div className="absolute z-[2] px-2 text-gray-400 text-[12.5px]">
                        Have an account already ?{" "}
                        <Link
                            to="/login"
                            className=" cursor-pointer text-primary-400 hover:text-primary-500 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </Wrapper>
    );
}

export default Register;