import Wrapper from "../../assets/wrappers/Unauthorized"
import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router-dom"

function SessionExpired() {
    return (
        <Wrapper >
            <div>
                <div className="flex w-[100%] justify-center p-5">
                    <div className="bg-primary-50 flex justify-center items-center w-[100px] h-[100px] rounded-[100%]">
                        <IoWarningOutline className="text-primary-500 text-[50px]" />
                    </div>
                </div>
                <div className='text-[#303030] mb-3 text-[20px]' id="unauthorized-title">Your session has expired</div>
                <div className='text-[#838383]' id="unauthorized-detail">Please log in again to continue using the app</div>
                <div className='mt-8'>
                    <Link to='/' id="back-to-home-btn" className="px-10 py-2 text-primary-500 rounded-sm border-primary-500 border-[2px] hover:bg-primary-500 hover:text-white ">Ok , go to login</Link>
                </div>
            </div>
        </Wrapper >
    )
}

export default SessionExpired
