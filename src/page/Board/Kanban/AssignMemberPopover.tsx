import { alpha, Menu, MenuProps, styled, Tooltip } from "@mui/material"
import { useState } from "react";
import { useAppSelector } from "../../../app/hook";

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
  assignee_user?: {
    displayName: string;
    email: string
  }
  task_id: string
  updateAssigneeMember: (task_id: string, recipientUser: { email: string, displayName: string }) => void
}


const AssignMemberPopover = ({ assignee_user, task_id, updateAssigneeMember }: IProp) => {
  const handleClickMembers = (event: React.MouseEvent<HTMLElement>) => {
    setMembersPopover(event.currentTarget);
  };
  const { selectedBoardMembers } = useAppSelector((state) => state.board)
  const [membersPopover, setMembersPopover] = useState<null | HTMLElement>(null);
  const openNotification = Boolean(membersPopover);
  const handleClose = () => {
    setMembersPopover(null);
  };

  return (
    <div className="flex justify-center items-center">
      <Tooltip title={assignee_user?.email}>
        <div onClick={handleClickMembers} className="flex text-white bg-primary-500 w-[25px] h-[25px] text-[11px] items-center justify-center rounded-full">
          {assignee_user?.displayName[0].toUpperCase()}
        </div>
      </Tooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={membersPopover}
        open={openNotification}
        onClose={handleClose}
      >
        <div className="flex max-h-[300px] overflow-y-auto flex-col w-[100%] ">
          {selectedBoardMembers.map((member, index) => {
            return (<div onClick={() => {
              updateAssigneeMember(task_id, { email: member.email, displayName: member.displayName })
              handleClose()
            }} key={index} className="w-[100%] flex text-[11.5px] px-6 py-1 gap-5 items-center hover:bg-[#f1f1f1] transition-all cursor-pointer">
              <div
                className={`bg-primary-500 w-[25px] text-white h-[25px] flex justify-center items-center rounded-full text-[12px]`}
              >
                {member.displayName[0].toUpperCase()}
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="text-[11.5px] font-semibold">
                  {member.displayName}
                </div>
                <div className="text-[10px]">{member.email}</div>
              </div>
            </div>)
          })}
        </div>
      </StyledMenu>
    </div>
  )
}

export default AssignMemberPopover