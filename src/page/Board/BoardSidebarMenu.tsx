import BoardAvatar from "../../assets/images/project-avatar.png"
import Divider from "@mui/material/Divider";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineViewBoards } from "react-icons/hi";
import { useState } from "react";

interface IBoard {
    id: string
    board_name: string
    description: string
    key: string
}

interface IProp {
    board: IBoard
}

function BoardSidebarMenu({ board }: IProp) {

    const [planingOpen, setPlaningOpen] = useState<boolean>(true)

    const togglePlaningMenu = () => {
        setPlaningOpen(!planingOpen)
    }

    return (
        <div
            className={`
        bg-[#fff] 
        h-[100vh]
        w-[300px]
        border-r-[2px] 
        w-sm 
        flex 
        flex-col 
        sm:hidden 
        md:hidden 
        transition-all 
        `}
        >
            <div className="flex flex-col items-left justify-center">
                <div className='flex h-[45px] w-[100%] my-6 justify-start pl-7 items-center'>
                    <img src={BoardAvatar} className="w-[38px] h-[38px] p-[2px] opacity-70 bg-primary-100 mr-3 rounded-md"></img>
                    <div className='flex flex-col'>
                        <div className='text-[13.5px] font-semibold'>{board.board_name}</div>
                        <div className='text-[11px] text-[#00000094]'>{board.description}</div>
                    </div>
                </div>

                {/* PLANING menu */}
                <div className="flex flex-col justify-center">
                    <button onClick={togglePlaningMenu} className="text-[#485772] pl-5 py-1 text-[11px] font-semibold flex items-center gap-1">
                        {planingOpen ? <MdOutlineKeyboardArrowDown className="text-[15px]" /> : <MdOutlineKeyboardArrowRight className="text-[15px]" />}
                        PLANING
                    </button>
                    {/* SUB PLANING menu */}
                    {planingOpen &&
                        <div className="w-[100%] flex flex-col justify-center items-center p-1">
                            <div
                                className={` cursor-pointer py-1.5 w-[100%] pl-8 border-l-4 bg-primary-50 text-primary-600 border-l-primary-500 rounded-sm flex text-[12px] items-center gap-2 transition-[0.1] `}

                            >
                                <HiOutlineViewBoards className="text-[16px]" />
                                Board
                            </div>
                        </div>
                    }
                </div>
                <Divider sx={{ my: 0.4, mx: 2, mb: 0.8, mt: 1.2 }} />
            </div>
        </div>
    )
}

export default BoardSidebarMenu
