import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TbDots } from 'react-icons/tb';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../app/hook';
import { setDeleteVisible, setEditVisible, setSelectedBoard } from '../../features/board/board.slice';
import EditIcon from '@mui/icons-material/Edit';

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

interface IBoardOption {
    board_id: string
}

export default function BoardOption({ board_id }: IBoardOption) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch()
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <button onClick={handleClick}>
                <TbDots className='text-md text-[14px]' />
            </button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    key={1}
                    onClick={() => {
                        dispatch(setSelectedBoard(board_id))
                        dispatch(setEditVisible(true))
                        handleClose()
                    }}
                    disableRipple
                    sx={{
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <EditIcon
                        sx={{ width: "16px" }}
                    />
                    Edit
                </MenuItem>
                <MenuItem
                    key={2}
                    onClick={() => {
                        dispatch(setSelectedBoard(board_id))
                        dispatch(setDeleteVisible(true))
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