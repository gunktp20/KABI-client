import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/NotFound';
import img from "../../assets/images/404 Error Page not Found with people connecting a plug-amico.svg"
const NotFound = () => {

    return (
        <Wrapper>
            <div>
                <img src={img} alt='not found' className='w-[400px] h-[400px]' />
                <div id="page-not-found-title" className='text-[#303030] mb-3 text-[20px]'>Ohh! page not found</div>
                <div id="page-not-found-detail" className='text-[#838383]'>we can't seem to find the page you are looking for</div>
                <div className='text-primary mt-8'>
                <Link to='/' id="back-to-home-btn" className="px-10 py-2 text-primary-500 rounded-sm border-primary-500 border-[2px] hover:bg-primary-500 hover:text-white ">Ok , go to login</Link>
                </div>
            </div>
        </Wrapper>
    );

};
export default NotFound;