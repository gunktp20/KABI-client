import { NavLink } from "react-router-dom";
import { HiOutlineViewBoards } from "react-icons/hi";

const NavLinkSidebar = () => {
    return (
        <div
            className={`
                bg-[#fff] 
                h-[100vh]
                w-[300px]
                border-r-[2px] 
                pt-5 
                w-sm 
                flex 
                flex-col 
                sm:hidden 
                md:hidden 
                transition-all 
                `}
        >
            <div className="flex flex-col items-left justify-center">
                <NavLink
                    to="/"
                    id="user-list-nav-link-sidebar"
                    key={1}
                    onClick={() => { }}
                    className={({ isActive }) =>
                        `flex pl-5 p-2 items-center text-[13px] mx-3 rounded-md hover:bg-primary-50 transition-all  hover:text-primary-500 ${isActive
                            ? "text-primary-500 bg-primary-50 font-semibold border-l-[5px] border-primary-500"
                            : "text-[#1d4469]"
                        }`
                    }
                    end
                >
                    <HiOutlineViewBoards className="mr-3 text-[18px]" />
                    Boards
                </NavLink>
            </div>
        </div>
    );
};

export default NavLinkSidebar;
