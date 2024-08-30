import { useState } from "react";
import useTimeout from "./useTimeout";

function useAlert() {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const { clearAllTimeouts, setTimeoutIds } = useTimeout();

  const displayAlert = ({
    msg,
    type,
  }: {
    msg: string;
    type: "error" | "success" | "info" | "warning";
  }) => {
    setShowAlert(true);
    setAlertText(msg);
    setAlertType(type);
    return clearAlert();
  };

  const clearAlert = () => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    setTimeoutIds([newTimeoutId]);
  };

  return {
    showAlert,
    setShowAlert,
    alertText,
    setAlertText,
    alertType,
    setAlertType,
    displayAlert,
  };
}

export default useAlert;
