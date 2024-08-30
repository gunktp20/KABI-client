import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useAppSelector } from "../../../app/hook";
import { Autocomplete, Box, TextField } from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../../utils/getAxiosErrorMessage";
import useAlert from "../../../hooks/useAlert";
import { Loader } from "../../../components";
import SnackBar from "../../../components/SnackBar";

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
}

interface IUser {
    id: string;
    email: string;
    displayName: string;
}

export default function InvitePeopleDialog({ open, setOpen }: IProp) {
    const { selectedBoardInfo, selectedBoardMembers } = useAppSelector((state) => state.board);
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const [value, setValue] = useState<IUser | null>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const handleClose = () => {
        setOpen(false);
    };

    const fetchAllUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosPrivate.get(`/user`);
            setUsers(data);
            console.log(data)
            setIsLoading(false);
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false);
        }
    };

    const inviteMember = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosPrivate.post(`/board/${selectedBoardInfo?.id}/invite`, {
                recipient_id: value?.id,
                board_id: selectedBoardInfo?.id
            });
            displayAlert({
                msg: data?.msg,
                type: "success",
            });
            setIsLoading(false);
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false);
        }
    };

    const onSubmit = () => {
        if (!value?.email) {
            return displayAlert({ msg: "Please provide recipient user", type: "error" });
        }
        inviteMember();
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

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
                            Add people to {selectedBoardInfo?.board_name}
                        </div>
                        <div className="text-[12px] text-[#a4a4a4] mt-2">
                            Collaborate with your team by adding relevant members to this project
                        </div>
                    </div>
                    <Autocomplete
                        size="small"
                        options={users}
                        value={value}
                        onChange={(_: unknown, newValue: IUser | null) => {
                            setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(_, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        getOptionLabel={(option) => option.email}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            if (selectedBoardMembers.some((member) => member.email === option.email)) {
                                return <div key={key}></div>;
                            }
                            return (
                                <Box
                                    key={key}
                                    component="li"
                                    sx={{ "& > img": { mr: 2, flexShrink: 0 }, gap: "10px" }}
                                    {...optionProps}
                                >
                                    <div
                                        className={`bg-primary-500 w-[25px] text-white h-[25px] flex justify-center items-center rounded-full text-[12px]`}
                                    >
                                        {option.displayName[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col gap-[1px]">
                                        <div className="text-[11.5px] font-semibold">
                                            {option.displayName}
                                        </div>
                                        <div className="text-[10px]">{option.email}</div>
                                    </div>
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Members"
                                InputProps={{
                                    ...params.InputProps,
                                    style: {
                                        fontSize: 14,
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        width: "100%",
                                        fontSize: "12px",
                                        top: "4%",
                                    },
                                }}
                            />
                        )}
                    />
                    <div className="flex w-[100%] justify-end mt-5">
                        <div className="grid grid-cols-2 gap-2 w-[300px] sm:w-[100%] sm:grid-cols-1">
                            <button
                                disabled={isLoading}
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className="w-[100%] bg-[#f1f2f4] text-[#1a2d4f] hover:bg-[#e2e2e4] h-[32px] text-[12px] rounded-sm transition-all font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                disabled={isLoading}
                                className="w-[100%] bg-primary-500 text-white hover:bg-primary-600 h-[32px] text-[12px] rounded-sm transition-all font-semibold"
                            >
                                {isLoading ? <Loader width="25px" /> : "Add"}
                            </button>
                        </div>
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