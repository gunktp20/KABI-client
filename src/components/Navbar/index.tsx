import Logo from "../Logo";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { IoNotifications } from "react-icons/io5";
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import { clearUnreadInvitations, clearUnreadAssignments, setAssignments, setInvitations, setUnreadAssignments, setUnreadInvitations, setUnreadNotifications } from "../../features/notification/notification.slice";
import useAlert from "../../hooks/useAlert";
import SnackBar from "../SnackBar";
import { FaCheck } from "react-icons/fa6";
import Loader from "../Loader";
import { Badge, BadgeProps } from "@mui/material";
import moment from "moment"
import { logout } from "../../features/auth/auth.slice";
import { useNavigate } from "react-router-dom";

function timeAgo(createdAt: string | Date) {
    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid Date format');
    }

    return moment(date).fromNow();
}
const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

interface IProp {
    fetchAllBoards: (queryString: string) => void
}

const Navbar = ({ fetchAllBoards }: IProp) => {
    const axiosPrivate = useAxiosPrivate()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const { unreadInvitations, unreadAssignments, unreadNotifications, invitations, assignments } = useAppSelector((state) => state.notification)
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchAllNotifications = async () => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.get(`/notification/`)
            setIsLoading(false)
            dispatch(setInvitations(data.invitations))
            dispatch(setAssignments(data.assignments))
            dispatch(setUnreadNotifications(data.unreadNotifications))
            dispatch(setUnreadInvitations(data.unreadInvitations))
            dispatch(setUnreadAssignments(data.unreadAssignments))
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error"
            })
            setIsLoading(false)
        }
    };

    const readInvitations = async () => {
        setIsLoading(true)
        try {
            await axiosPrivate.put(`/invitation/`)
            setIsLoading(false)
            dispatch(clearUnreadInvitations())
            dispatch(setUnreadInvitations(0))
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error"
            })
            setIsLoading(false)
        }
    }

    const readAssignments = async () => {
        setIsLoading(true)
        try {
            await axiosPrivate.put(`/assignment/`)
            setIsLoading(false)
            dispatch(clearUnreadAssignments())
            dispatch(setUnreadAssignments(0))
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error"
            })
            setIsLoading(false)
        }
    };

    const acceptInvitation = async (board_id: string, sender_id: string) => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.put(`/invitation/accept`, {
                sender_id,
                board_id,
            })
            displayAlert({
                msg: "Invitation has already been accepted",
                type: "success"
            })
            dispatch(setInvitations(data))
            fetchAllBoards("");
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error"
            })
            setIsLoading(false)
        }
    };

    const declineInvitation = async (board_id: string, sender_id: string) => {
        setIsLoading(true)
        try {
            const { data } = await axiosPrivate.put(`/invitation/decline`, {
                sender_id,
                board_id,
            })
            displayAlert({
                msg: "Invitation has already been declined",
                type: "error"
            })
            dispatch(setAssignments(data))
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error"
            })
            setIsLoading(false)
        }
    };
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openNotification = Boolean(notificationAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        fetchAllNotifications()
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseNotification = () => {
        setNotificationAnchorEl(null);
    };

    const onLogout = () => {
        dispatch(logout())
        navigate("/")
    }

    useEffect(() => {
        fetchAllNotifications()
    }, [])

    const [selectedNotiCategory, setSelectedNotiCategory] = useState<string>("invitation")


    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));

    return (
        <div className="w-[100%] py-2 border-b-[1px] px-9 bg-white">
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-center">
                    <Logo width="30px" />
                </div>
                <div className="flex justify-center items-center ">
                    <div className="flex justify-center items-center">
                        <button onClick={(e) => {
                            handleClickNotification(e)
                            readInvitations()
                        }}>
                            <StyledBadge key={1} badgeContent={unreadNotifications > 0 ? unreadNotifications : null} color="primary" sx={{ marginRight: 4 }}>
                                <IoNotifications className="text-[23px] text-gray-600" />
                            </StyledBadge>
                        </button>

                        <StyledMenu
                            key={1234}
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={notificationAnchorEl}
                            open={openNotification}
                            onClose={handleCloseNotification}
                            sx={{
                                maxHeight: '650px',
                                overflow: 'auto',
                            }}

                        >
                            <div className="pl-8 font-semibold py-2">Notifications</div>
                            <div className="flex w-[100%] mt-2 mb-3">
                                <div onClick={() => {
                                    setSelectedNotiCategory("invitation")
                                    readInvitations()
                                }} className={`ml-6 relative flex px-3 items-center justify-center text-[12px] transition-all h-[24px] mr-2 rounded-full cursor-pointer ${selectedNotiCategory == "invitation" ? "bg-primary-500 text-white " : "bg-primary-50 text-primary-600"}`}>
                                    Invitation
                                    <div className={`absolute right-[-8px] top-[-5px] bg-primary-500 border-[2px] border-white text-white w-[19px] h-[19px] rounded-full ${unreadInvitations <= 0 ? "hidden" : "flex"} justify-center items-center`}>{unreadInvitations > 0 ? unreadInvitations : null}</div>
                                </div>

                                <div onClick={() => {
                                    setSelectedNotiCategory("assignment")
                                    readAssignments()
                                }} className={`relative flex px-3 items-center justify-center text-[12px] transition-all h-[24px] rounded-full cursor-pointer ${selectedNotiCategory == "assignment" ? "bg-primary-500 text-white " : "bg-primary-50 text-primary-600"}`}>
                                    Assignment
                                    <div className={`absolute right-[-8px] top-[-5px] bg-primary-500 border-[2px] border-white text-white w-[19px] h-[19px] rounded-full ${unreadAssignments <= 0 ? "hidden" : "flex"} justify-center items-center`}>{unreadAssignments > 0 ? unreadAssignments : null}</div>
                                </div>

                            </div>
                            {isLoading && <div className="w-[100%] flex justify-center items-center py-5">
                                <Loader width="30px" /></div>}
                            {!isLoading && invitations.length === 0 && selectedNotiCategory === "invitation" && <div className="w-[300px] flex justify-center items-center py-5 px-7 text-[12px]">
                                There hasn't been any invitation yet.</div>}
                            {!isLoading && assignments.length === 0 && selectedNotiCategory === "assignment" && <div className="w-[300px] flex justify-center items-center py-5 px-7 text-[12px]">
                                There hasn't been any assignment yet.</div>}
                            {(invitations.length > 0 && !isLoading && selectedNotiCategory === "invitation") && invitations.map((invitation, index) => {
                                return <div key={index} className="w-max flex text-[11.5px] px-6 py-3 gap-5 items-center ">
                                    <div className="bg-primary-500 text-white text-[15px] flex rounded-full justify-center items-center w-[37px] h-[37px]">{invitation.sender.displayName[0].toUpperCase()}</div>
                                    <div className="flex justify-center items-start flex-col">
                                        {invitation.status === "pending" && <div className="flex text-[12.6px]">
                                            You was invited to <div className="font-semibold mx-[5px]">{invitation.board.board_name}</div>
                                            board from <div className="font-semibold mx-[5px]">{invitation.sender.displayName}</div>
                                        </div>}
                                        {invitation.status === "accepted" && <div className="flex items-center text-[12.6px]">
                                            You are now a member in <div className="font-semibold mx-[5px]">{invitation.board.board_name}</div>
                                            board <FaCheck className="text-[19px] ml-[10px]" />
                                        </div>}
                                        <div className="text-[11px] text-primary-600 font-semibold">{timeAgo(invitation.createdAt)}</div>

                                        {invitation.status === "pending" && <div className="mt-3 flex gap-3 justify-start">
                                            <button onClick={() => {
                                                acceptInvitation(invitation.board.board_id, invitation.sender.user_id)
                                            }} className="bg-primary-500 text-white w-[100px] h-[24px] rounded-sm hover:bg-primary-600 transition-all text-[13px]">Accept</button>
                                            <button onClick={() => {
                                                declineInvitation(invitation.board.board_id, invitation.sender.user_id)
                                            }} className="text-gray-800 hover:bg-[#dbdde2] transition-all w-[100px] h-[24px] rounded-sm bg-[#e4e6eb] text-[13px]">Decline</button>
                                        </div>}
                                    </div>

                                </div>
                            })}
                            {(assignments.length > 0 && !isLoading && selectedNotiCategory === "assignment") && assignments.map((assignment, index) => {
                                return <div key={index} className=" cursor-pointer w-max flex text-[11.5px] px-6 py-3 gap-5 items-center ">
                                    <div className="bg-primary-500 text-white text-[15px] flex rounded-full justify-center items-center w-[37px] h-[37px]">{assignment.sender.displayName[0].toUpperCase()}</div>
                                    <div className="flex justify-center items-start flex-col">
                                        <div className="flex text-[12.6px]">
                                            You have been assigned the task of {assignment.task.description} by {assignment.sender.displayName}
                                        </div>
                                        <div className="text-[11px] text-primary-600 font-semibold">{timeAgo(assignment.createdAt)}</div>
                                    </div>

                                </div>
                            })}

                        </StyledMenu>
                    </div>

                    <div>
                        <div onClick={handleClick} className="text-nowrap cursor-pointer flex justify-center items-center bg-primary-500 text-white text-[14px] w-[30px] h-[30px] rounded-[100%]">
                            {user?.displayName[0].toUpperCase()}
                        </div>
                        <StyledMenu
                            key={"stym" + 2}
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem key={2} onClick={onLogout} disableRipple sx={{ fontSize: "11px" }}>
                                <LogoutIcon />
                                Logout
                            </MenuItem>
                        </StyledMenu>
                    </div>
                </div>

            </div>

            {showAlert && (
                <div className="block sm:hidden">
                    <SnackBar
                        id="navbar-snackbar"
                        severity={alertType}
                        showSnackBar={showAlert}
                        snackBarText={alertText}
                    />
                </div>
            )}
        </div>
    );
};

export default Navbar;
