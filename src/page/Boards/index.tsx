import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import Pagination from './Pagination';
import { InputAdornment, TextField } from '@mui/material';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getAxiosErrorMessage from '../../utils/getAxiosErrorMessage';
import useAlert from '../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import BoardOption from './BoardOption';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { setBoards, setIsLoading } from '../../features/board/board.slice';
import ConfirmDeleteBoardDialog from './ConfirmDeleteBoardDialog';
import SnackBar from '../../components/SnackBar';
import { setSelectedBoard } from '../../features/board/board.slice';
import { Navbar } from '../../components';
import Wrapper from '../../assets/wrappers/Boards';
import { MdSearchOff } from "react-icons/md";
import EditBoardDialog from './EditBoardDialog';
import { debounce } from 'lodash';

interface IBoard {
    board: {
        board_id: string;
        board_name: string;
        description: string;
        key: string;
        user: {
            displayName: string;
        };
    }
}

function Boards() {
    const dispatch = useAppDispatch()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const { boards, selectedBoard, deleteBoardVisible } = useAppSelector((state) => state.board)
    const limitQuery: number = 5;
    const [numOfPage, setNumOfPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);

    const [query, setQuery] = useState("");

    const hookCreateSuccess = () => {
        displayAlert({
            msg: "Created your board successfully",
            type: "success",
        });
    }

    const hookDeleteSuccess = () => {
        displayAlert({
            msg: "Deleted your board successfully",
            type: "error",
        });
    }

    const fetchAllBoards = async (queryParam: string) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await axiosPrivate.get(
                `/board?limit=${limitQuery}&numOfPage=${numOfPage}&query=${queryParam}`
            );
            setPageCount(data.totalPages)
            dispatch(setBoards(data.boards))
            dispatch(setIsLoading(false));

            if ((data.totalPages === 1 && numOfPage !== 1) || (data.totalPages < numOfPage)) {
                setNumOfPage(1);
            }
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            dispatch(setIsLoading(false));
        }
    };

    const debouncedFetch = useCallback(
        debounce((value: string) => {
            fetchAllBoards(value);
        }, 1000),
        [numOfPage]
    );

    const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        setQuery(value);
        debouncedFetch(value);
    };

    useEffect(() => {
        fetchAllBoards(query);
        return () => {
            debouncedFetch.cancel();
        };
    }, [numOfPage]);

    return (
        <Wrapper>
            <Navbar fetchAllBoards={fetchAllBoards} />
            {selectedBoard && <EditBoardDialog board_id={selectedBoard} fetchAllBoards={fetchAllBoards} hookSuccess={hookCreateSuccess} />}
            {(selectedBoard && deleteBoardVisible) && <ConfirmDeleteBoardDialog fetchAllBoards={fetchAllBoards} hookSuccess={hookDeleteSuccess} />}
            <div className='flex w-[100%] justify-center items-center'>
                <div className='flex w-[95%] flex-col pt-12'>
                    <div className='w-[100%] flex justify-between items-center'>
                        <div className='text-[19px] mb-3 font-semibold'>Your Boards</div>
                        {/* project option*/}
                        <div className='flex'>
                            <button onClick={() => {
                                // dispatch(setCreateVisible(!createBoardVisible))
                                navigate("/create-board")
                            }} className='text-white bg-primary-500 px-5 outline-none text-[11.2px] font-semibold h-[32px] rounded-sm hover:bg-primary-600 transition-all'>
                                Create Board
                            </button>
                        </div>
                    </div>
                    {/* container line 1 */}
                    <div className='w-[400px] sm:w-[100%] mt-3'>
                        <TextField
                            size="small"
                            sx={{
                                width: "100%"
                                , '& ::placeholder': {
                                    fontSize: '12px'
                                },
                            }}
                            value={query}
                            type="search"
                            name="board_name"
                            placeholder='Search your board'
                            variant="outlined"
                            InputProps={{
                                style: {
                                    fontSize: 13,
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IoSearchSharp />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: {
                                    width: "100%",
                                    fontSize: '12px',
                                    top: "7.5%",
                                },
                            }}
                            onChange={handleSearch}
                        />
                    </div>
                    {boards.length <= 0 && <div className='mt-7 flex bg-[#fafafa] shadow-sm rounded-sm justify-center items-center h-[250px]'>
                        <div className='flex flex-col justify-center items-center'>
                            <MdSearchOff className='text-[70px] text-[#00000030]' />
                            <div className='text-[#00000030] text-[12px] font-semibold'>You don't have any boards.</div>
                            <button onClick={() => {
                                // dispatch(setCreateVisible(!createBoardVisible))
                                navigate("/create-board")
                            }} className='text-primary-500 border-primary-500 border-[1px] px-5 outline-none text-[11.2px] font-semibold mt-4 h-[32px] rounded-sm transition-all hover:border-primary-600 hover:text-primary-600 hover:shadow-sm'>
                                Create Board
                            </button>
                        </div>
                    </div>}
                    {/* table */}
                    <div
                        className={`overflow-auto block sm:shadow-none ${boards.length === 0 && "hidden"
                            }`}
                    >

                        <table className="w-full" id="dashboards-list-table">
                            <thead className="border-b-2 border-gray-200 sm:hidden">
                                <tr>
                                    <th className=" w-[25%] text-[11.5px] tracking-wide pl-5">
                                        Name
                                    </th>
                                    <th className="w-[15%] text-[11.5px] tracking-wide ">
                                        Key
                                    </th>
                                    <th className=" w-[25%] text-[11.5px] tracking-wide ">
                                        Description
                                    </th>
                                    <th className=" w-[25%] text-[11.5px] tracking-wide ">
                                        Lead
                                    </th>
                                    <th className=" w-[10%] text-[11.5px] tracking-wide ">
                                        More options
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {boards.length > 0 && boards.map((element: IBoard, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="sm:flex h-[30px] sm:h-max sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden transition ease-in delay-10"
                                        >
                                            <td
                                                onClick={() => {
                                                    dispatch(setSelectedBoard(element.board.board_id))
                                                    navigate(`/board/${element.board?.board_id}`)
                                                }}
                                                className="text-[11.2px] sm:flex pl-5 text-primary-500 font-bold cursor-pointer"
                                            >
                                                <div className='font-semibold text-gray-500 hidden sm:flex mr-3'>
                                                    Board Name
                                                </div>
                                                {element?.board.board_name}
                                            </td>
                                            <td onClick={() => {
                                                // navigate("/dashboard/" + dashboard.id);
                                            }} className="text-[11.2px] sm:flex sm:pl-5">
                                                <div className='font-semibold hidden sm:flex mr-3'>
                                                    Key
                                                </div>
                                                <div>{element?.board.key}</div>
                                            </td>
                                            <td onClick={() => {
                                                // navigate("/dashboard-test/" + dashboard.id);
                                            }} className="text-[11.2px] sm:flex sm:pl-5">
                                                <div className='font-semibold hidden sm:flex mr-3'>
                                                    Description
                                                </div>
                                                <div>{element?.board.description}</div>
                                            </td>
                                            <td className="text-[11.2px] sm:flex sm:pl-5 flex items-center gap-3 text-primary-500">
                                                <div className='font-semibold hidden sm:flex mr-3 text-gray-500'>
                                                    Lead
                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <div className={`bg-primary-500 w-[20px] text-white h-[20px] flex justify-center items-center rounded-full text-[11.2px]`}>{element.board?.user.displayName[0].toUpperCase()}</div>
                                                    {element?.board.user.displayName}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-[#878787] whitespace-nowrap">
                                                <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                                                    Action
                                                </div>
                                                <div>
                                                    {/* option2 */}
                                                    <BoardOption board_id={element.board.board_id} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* end table */}
                    <Pagination numOfPage={numOfPage} setNumOfPage={setNumOfPage} pageCount={pageCount} />
                </div>
            </div>

            {showAlert && (
                <div className="block sm:hidden">
                    <SnackBar
                        id="confirm-delete-dashboard-snack-bar"
                        severity={alertType}
                        showSnackBar={showAlert}
                        snackBarText={alertText}
                    />
                </div>
            )}
        </Wrapper>
    )
}

export default Boards
