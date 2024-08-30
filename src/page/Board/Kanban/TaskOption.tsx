import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { TbDots } from 'react-icons/tb';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDeleteTaskDialog from './ConfirmDeleteTaskDialog';
// import ConfirmDeleteTaskDialog from './ConfirmDeleteTaskDialog';

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

interface ITaskOption {
    active: boolean;
    task_id?: string
    toggleEditMode: () => void
    deleteTask: (task_id: string) => void
}

export default function TaskOption({ task_id, active, toggleEditMode, deleteTask }: ITaskOption) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false)
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div className='absolute top-2 right-2 flex items-center justify-center'>
            <ConfirmDeleteTaskDialog open={deleteOpen} setOpen={setDeleteOpen} task_id={task_id || ""} deleteTask={deleteTask} />
            {active && <button className='bg-white' onClick={handleClick}>
                <TbDots className='text-md text-[#4e5d77] w-[21px] h-[21px] text-[18px] hover:bg-gray-100 transition-all' />
            </button>}
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    toggleEditMode()
                    handleClose()
                }}
                    disableRipple
                    sx={{
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <EditIcon
                        sx={{
                            width: "16px"
                        }}
                    />
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDeleteOpen(true)
                        handleClose()
                    }}
                    disableRipple
                    sx={{
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <DeleteIcon
                        sx={{ width: "16px" }}
                    />
                    Delete
                </MenuItem>
            </StyledMenu>
        </div>
    );
}