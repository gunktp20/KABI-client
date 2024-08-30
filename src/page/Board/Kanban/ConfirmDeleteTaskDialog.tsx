import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProp {
    open: boolean;
    setOpen: (open: boolean) => void
    task_id: string
    deleteTask: (task_id: string) => void
}

export default function ConfirmDeleteTaskDialog({ open, task_id, setOpen, deleteTask }: IProp) {

    const handleClose = () => {
        setOpen(false)
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
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
                            id="cancel-delete-dashboard-btn"
                            className="text-[#505050] bg-[#f1f2f4] hover:bg-[#eaebee] transition-all text-[12.5px] border-[1px] border-[#fff] rounded-sm px-10 py-[0.4rem]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                deleteTask(task_id);
                            }}
                            id="confirm-delete-dashboard-btn"
                            className="bg-[#dc3546] hover:bg-[#ce3241] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
                        >
                            Delete
                        </button>
                    </div>
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}