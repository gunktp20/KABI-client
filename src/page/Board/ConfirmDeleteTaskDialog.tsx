import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { setDeleteVisible, setIsLoading } from "../../features/board/board.slice";
import SnackBar from "../../components/SnackBar";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProp {
    fetchAllBoards: () => void
    hookSuccess: () => void
}

export default function ConfirmDeleteBoardDialog({ fetchAllBoards, hookSuccess }: IProp) {
    const dispatch = useAppDispatch()
    const axiosPrivate = useAxiosPrivate();
    const { alertText, alertType, showAlert, displayAlert } = useAlert()
    const { selectedBoard, deleteBoardVisible, isLoading } = useAppSelector((state) => state.board)

    const deleteDevice = async () => {
        dispatch(setIsLoading((true)));
        try {
            await axiosPrivate.delete(`/board/${selectedBoard}`);
            dispatch(setIsLoading((false)));
            dispatch(setDeleteVisible(false))
            fetchAllBoards()
            hookSuccess()
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            dispatch(setIsLoading((false)));
            displayAlert({ msg, type: "error" })
        }
    };

    const handleClose = () => {
        if (isLoading) {
            return;
        }
        dispatch(setDeleteVisible(false))
    };

    return (
        <React.Fragment>
            <Dialog
                open={deleteBoardVisible}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                id="confirm-delete-dashboard-dialog"
            >
                <DialogContentText
                    id="confirm-delete-dashboard-dialog-content"
                    className="py-7 px-11"
                    component={"div"}
                    variant={"body2"}
                >
                    <div className="text-[#dc3546] text-[15.5px] text-center">
                        Are you sure you want to delete?
                    </div>
                    <div className="mt-4 flex justify-center gap-3 w-[100%]">
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            id="cancel-delete-dashboard-btn"
                            className="text-black text-[12.5px] border-[1px] border-[#000] rounded-sm px-10 py-[0.4rem]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                deleteDevice();
                            }}
                            id="confirm-delete-dashboard-btn"
                            disabled={isLoading}
                            className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
                        >
                            Delete
                        </button>
                    </div>
                    {showAlert && (
                        <div className="block sm:hidden">
                            <SnackBar
                                id="confirm-delete-dashboard-snack-bar"
                                severity={alertType}
                                showSnackBar={showAlert}
                                snackBarText={alertText}
                            />
                        </div>
                    )}
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}