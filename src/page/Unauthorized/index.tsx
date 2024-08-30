import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/Unauthorized';
import img from "../../assets/images/401 Error Unauthorized-rafiki.svg"
const Unauthorized = () => {
    return (
        <Wrapper>
            <div>
                <img src={img} className='w-[400px] h-[400px]' />
                <div className='text-[#303030] mb-3 text-[20px]' id="unauthorized-title">Unauthorized</div>
                <div className='text-[#838383]' id="unauthorized-detail">Sorry! you are not authorized to access this page</div>
                <div className='mt-8'>
                <Link to='/' id="back-to-home-btn" className="px-10 py-2 text-primary-500 rounded-md border-primary-500 border-[2px] hover:bg-primary-500 hover:text-white ">Ok , go to login</Link>
                </div>
            </div>
        </Wrapper>
    );

};
export default Unauthorized;