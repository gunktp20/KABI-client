import Snackbar from "@mui/material/Snackbar";
import { RiMailSendLine } from "react-icons/ri";

interface IProp {
    showSnackBar: boolean;
    snackBarText: string;
}

export default function NewNotificationSnackBar({
    showSnackBar,
    snackBarText,
}: IProp) {
    const vertical = "bottom";
    const horizontal = "left";

    return (

        <Snackbar
            open={showSnackBar}
            autoHideDuration={6000}
            anchorOrigin={{ vertical, horizontal }}
            sx={{ backgroundColor: "#fff", width: "max" , }}
        >
            <div className="bg-white rounded-sm w-[100%] items-center shadow-md py-2 px-5 border-[1px] flex gap-3">
                <div className="flex items-center w-[35px] h-[35px] justify-center rounded-full bg-[#eeeeee]">
                    <RiMailSendLine className="text-[23px] text-primary-600"/>
                </div>
                <div className="flex flex-col">
                    <div className="text-sm">{snackBarText}</div>
                    <div className="font-semibold text-primary-600 text-[13px]">a few seconds ago</div>
                </div>
            </div>
        </Snackbar>

    );
}