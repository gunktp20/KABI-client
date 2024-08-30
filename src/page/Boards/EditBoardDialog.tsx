import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Loader } from "../../components";
import { TextField } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Alert } from "@mui/material";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import useAlert from "../../hooks/useAlert";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setEditVisible, setSelectedBoard } from "../../features/board/board.slice";
import SnackBar from "../../components/SnackBar";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IBoard {
    id?: string
    board_name: string
    description: string
    key: string
    user?: {
        displayName: string
    }
}

const initialState: IBoard = {
    id: "",
    board_name: "",
    description: "",
    key: "",
    user: {
        displayName: "",
    }
}

interface IProp {
    board_id: string
    fetchAllBoards: (queryParam: string) => void
    hookSuccess: () => void
}

export default function EditBoardDialog({ board_id, fetchAllBoards, hookSuccess }: IProp) {
    const dispatch = useAppDispatch()
    const axiosPrivate = useAxiosPrivate();
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const [values, setValues] = useState<IBoard>(initialState);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { token } = useAppSelector((state) => state.auth)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const { selectedBoard, editBoardVisible } = useAppSelector((state) => state.board)

    const handleClose = () => {
        if (isLoading) {
            return;
        }
        setValues(initialState);
        dispatch(setEditVisible(false))
        dispatch(setSelectedBoard(""))
    };

    const onSubmit = async () => {
        const { board_name, key, description } =
            values;
        if (
            !board_name ||
            !key ||
            !description
        ) {
            displayAlert({
                msg: "Please provide all value",
                type: "error",
            });
            return;
        }
        await updateBoard();
    };

    const getBoard = async () => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.get(`/board/${board_id}`)
            setValues(data?.board)
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false);
        }
    }

    const updateBoard = async () => {
        const { board_name, key, description } = values
        setIsLoading(true);
        try {
            await axiosPrivate.put(`/board/${selectedBoard}`, {
                board_name,
                key,
                description
            })
            setIsLoading(false);
            fetchAllBoards("")
            dispatch(setEditVisible(false))
            hookSuccess()
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getBoard()
        }
    }, [board_id])

    return (
        <Dialog
            open={editBoardVisible}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogContent>
                <DialogContentText
                    className="p-3"
                    component={"div"}
                    variant={"body2"}
                >
                    <div className="w-[100%] flex flex-col">
                        <div
                            className="text-[16px] font-bold text-primary-700"
                        >
                            Edit Board
                        </div>
                        <div className="text-[12px] text-[#a4a4a4] mt-2">
                            Edit the specifics of your board configuration
                        </div>
                    </div>
                    {showAlert && alertType && (
                        <div>
                            <Alert
                                severity={alertType}
                                sx={{
                                    fontSize: "10.8px",
                                    alignItems: "center",
                                    marginTop: "1rem",
                                }}
                            >
                                {alertText}
                            </Alert>
                        </div>
                    )}
                    {/* form */}
                    <div className=" grid grid-cols-2 sm:grid-cols-1 gap-4 mt-6">
                        <TextField
                            size="small"
                            sx={{
                                width: "100%"
                                , '& ::placeholder': {
                                    fontSize: '11.5px'
                                }
                            }}
                            name="board_name"
                            label="Board name"
                            variant="outlined"
                            value={values?.board_name}
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
                            onChange={handleChange}
                        />
                        <TextField
                            size="small"
                            sx={{
                                width: "100%"
                                , '& ::placeholder': {
                                    fontSize: '11.5px'
                                }
                            }}
                            name="description"
                            label="Description"
                            variant="outlined"
                            value={values?.description}
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
                            onChange={handleChange}
                        />
                        <TextField
                            size="small"
                            sx={{
                                width: "100%"
                                , '& ::placeholder': {
                                    fontSize: '11.5px'
                                }
                            }}
                            name="key"
                            label="Key"
                            placeholder="Abbreviated name of your project"
                            variant="outlined"
                            value={values?.key}
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
                            onChange={handleChange}
                        />
                    </div>


                    <div className="flex w-[100%] justify-end mt-5">
                        <div className="flex gap-2 w-[100%] sm:w-[100%] sm:flex-col">
                            <button disabled={isLoading} onClick={() => {
                                handleClose()
                            }} className="w-[100%] bg-[#f1f2f4] text-[#1a2d4f] hover:bg-[#e2e2e4] h-[32px] text-[13px] rounded-sm transition-all ">Cancel</button>
                            <button onClick={onSubmit} disabled={isLoading} className="w-[100%] bg-primary-500 text-white hover:bg-primary-600 h-[32px] text-[13px] rounded-sm transition-all ">{isLoading ? <Loader width="25px" /> : "Update"}</button>
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
            </DialogContent>
        </Dialog>
    );
}
