import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { requestVerifyEmail } from "../../features/auth/auth.slice";
import { Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SendVerifyEmail";
import verified_success from "../../assets/images/Verified-amico.svg";
import verify_error from "../../assets/images/401 Error Unauthorized-amico.svg";

function SendVerifyEmail() {

  const { token } = useParams();
  const { isLoading, alertText, alertType } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestVerifyEmail(token as string));
  }, []);

  if (isLoading) {
    return (
      <div className="h-[100vh] w-[100%] flex ">
        <div className="flex justify-center items-center gap-6 w-[100%] h-[100%] flex-col">
          <div className="loader"></div>
          <div className="text-[#303030] text-[20px]">
            Verifying your e-mail
          </div>
          <div className="text-[#838383]">Please waiting for a second...</div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <div>
        <img
          src={alertType === "success" ? verified_success : verify_error}
          className="w-[400px] h-[400px]"
        />
        <div className="text-[#303030] mb-3 text-[20px]">{alertText}</div>
        <div className="text-[#838383]" id="alert-execution">
          {alertType === "success"
            ? "Thank you for trusting and choosing to use our Platform"
            : "Have an error , Please try again"}
        </div>
        <div className="mt-8">
          <Link
            to="/"
            id="back-to-home-btn"
            className="px-9 py-2 text-primary-500 capitalize rounded-sm border-primary-500 border-[2px] hover:bg-primary-500 hover:text-white"
          >
            back home
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}

export default SendVerifyEmail;
