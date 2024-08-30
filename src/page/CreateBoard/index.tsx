import { Alert, Backdrop, CircularProgress, TextField } from "@mui/material";
import Wrapper from "../../assets/wrappers/CreateBoard"
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import SnackBar from "../../components/SnackBar";
import useAlert from "../../hooks/useAlert";
import { Loader } from "../../components";
import { useNavigate } from "react-router-dom";
import InviteMembers from "./InviteMembers";

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
    board_name: "",
    key: "",
    description: "",
};

interface IUser {
    id: string
    email: string
    displayName: string
    color: string
}


function CreateBoard() {

    const axiosPrivate = useAxiosPrivate()
    const [values, setValues] = useState<IBoard>(initialState);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

    const handleAutocompleteChange = (_: React.SyntheticEvent, newValue: IUser[]) => {
        setSelectedUsers(newValue);
    };

    const navigate = useNavigate()

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
        const board = { board_name, key, description, invitedMembers: selectedUsers }
        await createBoard(board);
    };

    const createBoard = async (board: IBoard) => {
        setIsLoading(true)
        try {
            await axiosPrivate.post(`/board/`, board)
            setIsLoading(false)
            setValues(initialState)
            navigate("/")
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false)
        }
    };




    if (isLoading) {
        return (
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Wrapper>
            <button onClick={() => {
                navigate("/")
            }} className=" text-[#192e51] absolute left-[5%] top-[2rem] flex justify-center items-center gap-2 text-[13px] font-semibold"><FiArrowLeft className="text-[19px]" />Back to Your Boards</button>
            <div className=" w-[600px] h-[500px] top-[9.5rem] relative sm:w-[90%]">
                <div className="text-[21.5px] font-semibold text-primary-800">Add board details</div>
                <div className="text-[12px] text-[#525252] mt-2">
                    Create board for project management to you and for team members
                </div>
                {showAlert && alertType && (
                    <div className="hidden sm:block">
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
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 mt-7">
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
                        value={values.board_name}
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
                        value={values.description}
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
                        value={values.key}
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
                <div className="mt-5 mb-5 w-[100%] flex flex-col">
                    <div className="text-[16px] font-semibold text-primary-800">
                        Participation
                    </div>
                    <div className="text-[12px] text-[#525252] mt-2">
                        Inviting people to become members of your board
                    </div>
                </div>

                <InviteMembers handleAutocompleteChange={handleAutocompleteChange} selectedUsers={selectedUsers} />
                <div className="flex w-[100%] justify-end mt-5">
                    <div className="flex gap-2 w-[300px] sm:w-[100%]">
                        <button disabled={isLoading} onClick={() => {
                            navigate("/")
                        }} className="w-[100%] bg-[#f1f2f4] text-[#1a2d4f] hover:bg-[#e2e2e4] h-[32px] text-sm rounded-sm transition-all font-semibold">Cancel</button>
                        <button onClick={onSubmit} disabled={isLoading} className="w-[100%] bg-primary-500 text-white hover:bg-primary-600 h-[32px] text-sm rounded-sm transition-all font-semibold">{isLoading ? <Loader width="25px" /> : "Create"}</button>
                    </div>
                </div>
            </div>
            {showAlert && (
                <div className="block sm:hidden">
                    <SnackBar
                        id="create-board-snack-bar"
                        severity={alertType}
                        showSnackBar={showAlert}
                        snackBarText={alertText}
                        horizontal="right"
                    />
                </div>
            )}
        </Wrapper>
    )
}

export default CreateBoard
