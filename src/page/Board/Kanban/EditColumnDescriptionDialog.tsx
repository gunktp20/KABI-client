import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { TextField } from "@mui/material";

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
    setOpen: (open: boolean) => void;
    column_id: string
    column_name: string
    updateColumnName: (column_id: string, column_name: string) => void
}

export default function EditColumnDescriptionDialog({ open, setOpen, column_id, column_name, updateColumnName }: IProp) {
    const [newColumnName, setNewColumnName] = useState<string>(column_name)

    const handleClose = () => {
        setNewColumnName(column_name)
        setOpen(false);
    };

    const onSubmit = () => {
        updateColumnName(column_id, newColumnName)
        setOpen(false);
    }

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
                    className="py-7 px-5"
                    component={"div"}
                    variant={"body2"}
                >
                    <div className="w-[100%] flex flex-col mb-6">
                        <div className="text-[16px] font-semibold text-primary-800">
                            Edit your column
                        </div>
                    </div>
                    <TextField
                        size="small"
                        sx={{
                            width: "100%"
                            , '& ::placeholder': {
                                fontSize: '11.5px'
                            }
                        }}
                        name="column_name"
                        label="Column name"
                        variant="outlined"
                        value={newColumnName}
                        InputProps={{
                            style: {
                                fontSize: 13,
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                width: "100%",
                                fontSize: '12px',
                                top: "4%",
                            },
                        }}
                        onChange={(e) => {
                            setNewColumnName(e.target.value)
                        }}
                    />
                    <div className="flex w-[100%] justify-end mt-5">
                        <div className="grid grid-cols-2 gap-2 w-[300px] sm:w-[100%] sm:grid-cols-1">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className="w-[100%] bg-[#f1f2f4] text-[#1a2d4f] hover:bg-[#e2e2e4] h-[32px] text-[12px] rounded-sm transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                className="w-[100%] bg-primary-500 text-white hover:bg-primary-600 h-[32px] text-[12px] rounded-sm transition-all font-semibold"
                            >
                               Update
                            </button>
                        </div>
                    </div>
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}