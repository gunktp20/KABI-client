import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import AddTaskCard from "./AddTaskCard";
import { CSS } from "@dnd-kit/utilities";
import ColumnOption from "./ColumnOption";
import EditColumnDescriptionDialog from "./EditColumnDescriptionDialog";
import ConfirmDeleteColumnDialog from "./ConfirmDeleteColumnDialog";
import { IColumn, ITask } from "../types";

interface Props {
  column: IColumn;
  deleteColumn: (column_id: string) => void;
  createTask: (column_id: string, taskContent: string) => void;
  deleteTask: (task_id: string) => void;
  tasks: ITask[];
  updateColumnName: (id: string, column_name: string) => void
  updateAssigneeMember: (task_id: string, recipientUser: { email: string, displayName: string }) => void

}

function ColumnContainer({
  column,
  deleteColumn,
  createTask,
  tasks,
  deleteTask,
  updateColumnName,
  updateAssigneeMember
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState<boolean>(false)
  const [optionActive, setOptionActive] = useState<boolean>(false)
  const [addTaskContent, setAddTaskContent] = useState<string>("")

  const tasksIds = useMemo(() => {
    return (tasks || []).map((task) => task.id);
  }, [tasks]);

  const toggleAddMode = () => {
    setAddMode(!addMode)
  }

  const [editColumnMode, setEditColumnMode] = useState<boolean>(false)
  const [deleteColumnMode, setDeleteColumnMode] = useState<boolean>(false)


  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id ? column.id : "",
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-white
      opacity-40
      border-2
      border-blue-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={style}
      onMouseOver={() => {
        setOptionActive(true)
      }}
      onMouseOut={() => {
        setOptionActive(false)
      }}
      className={'scroll-snap-start overflow-y-auto w-[300px] h-[500px] flex-shrink-0 p-4 px-0 pt-3 bg-[#f7f8f9] rounded-sm flex flex-col gap-y-4'
      }
    >
      {/* Column title */}
      <div
        {...attributes}
        // {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-[#f7f8f9]
      text-md
      rounded-b-none 
      font-bold
      flex
      items-center
      justify-between
      relative
      p-1
      pb-0
      "
      >
        <EditColumnDescriptionDialog open={editColumnMode} setOpen={setEditColumnMode} column_id={column.id ? column.id : ""} column_name={column.column_name} updateColumnName={updateColumnName} />
        <ConfirmDeleteColumnDialog open={deleteColumnMode} setOpen={setDeleteColumnMode} deleteColumn={deleteColumn} column_id={column.id ? column.id : ""} />
        <div className="flex w-[100%] flex-col">
          <div className="text-[#7e7a8f] text-[13px] font-semibold pl-1">{column.column_name} {tasks.length}</div>
        </div>
        <ColumnOption active={optionActive} setEditColumnNameOpen={setEditColumnMode} setDeleteColumnMode={setDeleteColumnMode} />
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-1 p-2 pt-2 px-1 overflow-x-hidden overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              updateAssigneeMember={updateAssigneeMember}
              key={task.id}
              task={task}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
        <AddTaskCard addMode={addMode} setAddMode={setAddMode} addTaskContent={addTaskContent} setAddTaskContent={setAddTaskContent} createTask={createTask} column_id={column.id ? column.id : ""} />
        {!addMode && <button onClick={toggleAddMode} className="text-gray-600 text-start text-[11.8px] mt-[1px] py-2 pl-2 font-semibold hover:bg-gray-200 transition-all ">+ Create Task</button>}
      </div>
    </div>
  );
}

export default ColumnContainer;
