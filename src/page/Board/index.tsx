import { useEffect, useMemo, useRef, useState } from "react"
import useAlert from "../../hooks/useAlert"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hook"
import { setIsLoading, setSelectedBoard, setSelectedBoardInfo, setSelectedBoardMembers } from "../../features/board/board.slice"
import { Backdrop, CircularProgress, Grid, Tooltip } from "@mui/material"
import ColumnContainer from "./Kanban/ColumnContainer";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { HiOutlinePlus } from "react-icons/hi";
import Wrapper from "../../assets/wrappers/Board"
import { Navbar } from "../../components"
import BoardSidebarMenu from "./BoardSidebarMenu"
import { FaUserPlus } from "react-icons/fa6";
import { IBoard, IColumn, IMember, ITask } from "./types"
import AddColumnCard from "./AddColumnCard"
import SnackBar from "../../components/SnackBar"
import InvitePeopleDialog from "./Kanban/InvitePeopleDialog"

const initialState: IBoard = {
    id: "",
    board_name: "",
    description: "",
    key: ""
}

function Board() {
    const dispatch = useAppDispatch()
    const axiosPrivate = useAxiosPrivate()
    const { showAlert, alertText, alertType, displayAlert } = useAlert();
    const [board, setBoard] = useState<IBoard>(initialState)
    const [members, setMembers] = useState<IMember[]>([])
    const { isLoading } = useAppSelector((state) => state.board)
    const { board_id } = useParams()
    const [columns, setColumns] = useState<IColumn[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [addColumnOpen, setAddColumnOpen] = useState<boolean>(false)
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [invitePeopleOpen, setInvitePeopleOpen] = useState<boolean>(false)

    const toggleInvitePeopleOpen = () => {
        setInvitePeopleOpen(!invitePeopleOpen)
    }

    const [addColumnContent, setAddColumnContent] = useState<string>("")

    const containerRef = useRef<HTMLDivElement | null>(null);


    const getBoard = async () => {
        dispatch(setIsLoading(true))
        try {
            const { data } = await axiosPrivate.get(`/board/${board_id}`)
            setBoard(data.board)
            setColumns(data.board.columns)
            setMembers(data.members)
            dispatch(setSelectedBoardInfo(data.board))
            dispatch(setSelectedBoardMembers(data.members))
            getTasksByBoardId()
            dispatch(setIsLoading(false))
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            dispatch(setIsLoading(false))
        }
    }

    const openAddColumn = () => {
        setAddColumnOpen(true)
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollLeft = containerRef.current.scrollWidth;
            }
        }, 0);

    }

    const getTasksByBoardId = async () => {
        dispatch(setIsLoading(true))
        try {
            const { data } = await axiosPrivate.get(`/task/${board_id}/board`)
            setTasks(data)
            dispatch(setIsLoading(false))
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            dispatch(setIsLoading(false))
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragEnd(event: DragEndEvent) {

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].column_id != tasks[overIndex].column_id) {
                    // Fix introduced after video recording
                    tasks[activeIndex].column_id = tasks[overIndex].column_id;
                    pushTasksPosition(arrayMove(tasks, activeIndex, overIndex - 1))
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }
                pushTasksPosition(arrayMove(tasks, activeIndex, overIndex))
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                tasks[activeIndex].column_id = overId;
                console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                pushTasksPosition(arrayMove(tasks, activeIndex, activeIndex))
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    async function createTask(column_id: string, taskContent: string) {
        const newTask = {
            column_id,
            board_id: board_id,
            description: taskContent,
        };
        try {
            const { data } = await axiosPrivate.post(`/task/`, newTask)
            setTasks([...tasks, {
                ...newTask, id: data.id, sequence: data.sequence, user: {
                    displayName: data.user.displayName,
                    email: data.user.email
                }
            }]);
            displayAlert({ msg: `Created your ${data.description} task `, type: "success" })
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false)
        }
    }

    async function deleteTask(task_id: string) {
        const newTasks = tasks.filter((task) => task.id !== task_id);
        setTasks(newTasks);
        setIsLoading(true)
        try {
            await axiosPrivate.delete(`/task/${task_id}`);
            displayAlert({ msg: `Tasks has been deleted `, type: "error" })
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            setIsLoading(false)
            displayAlert({ msg, type: "error" })
        }

    }


    async function updateAssigneeMember(task_id: string, recipientUser: { email: string, displayName: string }) {
        const newTasks = tasks.map((task) => {
            if (task.id !== task_id) return task;
            return { ...task, user: { ...recipientUser } };
        });
        setTasks(newTasks);
        try {
            await axiosPrivate.put(`/task/${task_id}/assign`, {
                recipient_email: recipientUser.email
            })
            displayAlert({
                msg: `Assigned ${recipientUser.displayName} to ${tasks.find((task) => task.id === task_id)?.description} task`,
                type: "success",
            })
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            })
        }
    }

    async function updateColumnName(column_id: string, column_name: string) {
        const newColumns = columns.map((col) => {
            if (col.id !== column_id) return col;
            return { ...col, column_name };
        });
        setColumns(newColumns)
        try {
            await axiosPrivate.put(`/column/${column_id}`, {
                column_id,
                column_name
            });
            displayAlert({ msg: `You column is updated `, type: "success" })
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            setIsLoading(false)
            displayAlert({ msg, type: "error" })
        }
    }

    const createNewColumn = async (column_name: string) => {
        const columnToAdd: IColumn = {
            column_name,
            board_id
        };
        try {
            const { data } = await axiosPrivate.post(`/column/`, columnToAdd)
            setColumns([...columns, { id: data.id, column_name: data.column_name }]);
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.scrollLeft = 0;
                }
            }, 0);
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false)
        }

    }

    const pushTasksPosition = async (newTasksOrder: unknown) => {
        try {
            await axiosPrivate.put(`/task/${board_id}/board`, { tasks_order: newTasksOrder })
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err);
            displayAlert({
                msg,
                type: "error",
            });
            setIsLoading(false)
        }
    }

    async function deleteColumn(column_id: string) {
        const filteredColumns = columns.filter((col) => col.id !== column_id);
        setColumns(filteredColumns);
        setIsLoading(true)
        try {
            await axiosPrivate.delete(`/column/${column_id}`);
            displayAlert({ msg: `Column has been deleted `, type: "error" })
            setIsLoading(false)
        } catch (err: unknown) {
            const msg = await getAxiosErrorMessage(err)
            setIsLoading(false)
            displayAlert({ msg, type: "error" })
        }

    }

    useEffect(() => {
        dispatch(setSelectedBoard(board_id))
        getBoard()
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = 0;
        }
    }, [])
    if (isLoading) {
        return (
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    const fetchAllBoards = (queryString: string) => {
        console.log(queryString)
    }

    return (
        <Wrapper>
            <Navbar fetchAllBoards={fetchAllBoards} />
            <InvitePeopleDialog open={invitePeopleOpen} setOpen={setInvitePeopleOpen} />

            {/* content container */}
            <div className="w-[100%] h-[100%] flex">
                <BoardSidebarMenu board={board} />
                {/* column container */}
                <div ref={containerRef} className="pt-32 relative h-fit flex flex-row gap-4 overflow-y-auto overflow-x-auto w-[100%] scroll-snap-x-mandatory m-5">
                    <div className="absolute top-3 px-5">
                        <div className='w-[100%] flex'>
                            <div className='text-[12.5px] text-gray-500'>Board / {board.board_name}</div>
                        </div>
                        <div className='w-[100%] flex mb-2'>
                            <div className='text-[26px] font-semibold text-primary-900'>{board.key}</div>
                        </div>
                        <div className="flex relative items-center">
                            <div className="flex relative items-center">
                                {members.map((user, index) => {

                                    return <Grid key={index} item>
                                        <Tooltip disableFocusListener disableTouchListener title={user.email}>
                                            <div className={`bg-primary-500 -ml-2 text-white w-[38px] h-[38px] text-[14px] flex justify-center items-center rounded-full z-[${index}] border-white border-[2px]`}>
                                                {user.displayName[0].toUpperCase()}
                                            </div>
                                        </Tooltip>
                                    </Grid>


                                })}
                            

                            </div>
                            <button onClick={toggleInvitePeopleOpen} className=" ml-6 flex  bg-[#e4e6ea] text-[#172b4d] hover:bg-[#dcdddf] rounded-sm text-[12px] h-[30px] transition-all font-semibold py-1 w-[120px] items-center justify-center"><FaUserPlus className="text-[18px] mr-2" /> Invite People</button>
                        </div>
                    </div>
                    <DndContext
                        sensors={sensors}
                        autoScroll={{ acceleration: 1 }}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-expect-error */}
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateColumnName={updateColumnName}
                                    updateAssigneeMember={updateAssigneeMember}
                                    tasks={tasks.filter((task) => task.column_id === col.id)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div>
                        <AddColumnCard open={addColumnOpen} setOpen={setAddColumnOpen} addColumnContent={addColumnContent} setAddColumnContent={setAddColumnContent} createNewColumn={createNewColumn} />
                        {!addColumnOpen && <div onClick={openAddColumn} className=" cursor-pointer w-[35px] h-[35px] bg-[#f1f2f4] flex justify-center items-center text-[#1c2f51]">
                            <HiOutlinePlus />
                        </div>}
                    </div>
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

export default Board
