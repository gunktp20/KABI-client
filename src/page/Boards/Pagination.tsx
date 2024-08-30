import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface IProp {
    numOfPage: number
    setNumOfPage: (page: number) => void
    pageCount: number
}

function Pagination({ numOfPage, setNumOfPage, pageCount }: IProp) {

    const elements = [];

    for (let i = 1; i < pageCount + 1; i++) {
        elements.push(
            <button
                onClick={() => {
                    setNumOfPage(i);
                }}
                key={i}
                id={`page-${i}`}
                className={`${numOfPage === i
                    ? "text-white bg-primary-400"
                    : "bg-white text-[#7a7a7a]"
                    } cursor-pointer text-[13.5px] rounded-md w-[30px] h-[30px] flex items-center justify-center`}
            >
                {i}
            </button>
        );
    }

    if (pageCount === 0) {
        return null
    }

    return (
        <div className="flex justify-start items-center w-[100%] mt-4 sm:flex-col">
            {/* <div className="mr-3 sm:mb-3 text-[12.4px]">1-5 of items</div> */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        if (numOfPage > 1) {
                            setNumOfPage(numOfPage - 1);
                        }
                    }}
                    id="prev-page-btn"
                    className="cursor-pointer text-[#5e5e5e] bg-gray-50 rounded-md w-[30px] h-[30px] flex items-center justify-center hover:bg-gray-100 hover:border-[1px]"
                >
                    <MdKeyboardArrowLeft />
                </button>
                {elements}
                <button
                    onClick={() => {
                        if (numOfPage < pageCount) {
                            setNumOfPage(numOfPage + 1);
                        }
                    }}
                    id="next-page-btn"
                    className="cursor-pointer text-[#5e5e5e] bg-gray-50 rounded-md w-[30px] h-[30px] flex items-center justify-center hover:bg-gray-100 hover:border-[1px]"
                >
                    <MdKeyboardArrowRight />
                </button>
            </div>
        </div>
    )
}

export default Pagination
