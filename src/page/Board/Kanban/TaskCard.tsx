import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppSelector } from "../../../app/hook";
import TaskOption from "./TaskOption";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import getAxiosErrorMessage from "../../../utils/getAxiosErrorMessage";
import { ITask } from "../types";
import AssignMemberPopover from "./AssignMemberPopover";

interface Props {
  task: ITask;
  deleteTask: (id: string) => void;
  updateAssigneeMember: (task_id: string, recipientUser: { email: string, displayName: string }) => void
}

function TaskCard({ task, deleteTask, updateAssigneeMember }: Props) {
  const [editMode, setEditMode] = useState(false);
  const { selectedBoardInfo } = useAppSelector((state) => state.board)
  const textareaEditTaskRef = useRef<HTMLTextAreaElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task?.id ? task?.id : "",
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };
  const axiosPrivate = useAxiosPrivate()
  const [optionActive, setOptionActive] = useState<boolean>(false)
  const [newTaskDescription, setNewTaskDescription] = useState<string>(task.description || "")
  const editTaskRef = useRef<HTMLDivElement>(null);

  const updateTaskDescription = async () => {
    try {
      await axiosPrivate.put(`/task/${task.id}`, {
        description: newTaskDescription.trim()
      })
      task.description = newTaskDescription
      toggleEditMode()
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg)
    }
  }

  useEffect(() => {
    setNewTaskDescription(task.description)
  }, [task.description])

  function handleClick(event: MouseEvent) {
    if (editTaskRef.current && editTaskRef.current.contains(event.target as Node)) {
      setEditMode(true)
    } else {
      setNewTaskDescription(task.description)
      setEditMode(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (event.key === "Enter") {
      event.preventDefault();
    }
    if (event.key === "Enter" && !event.shiftKey) {
      if (!newTaskDescription) {
        return;
      }
      updateTaskDescription()
    }
  };

  useEffect(() => {

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [])

  useEffect(() => {
    if (editMode && textareaEditTaskRef.current) {
      textareaEditTaskRef.current.focus();
    }
  }, [editMode]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        flex-col
        opacity-30
        shadow-xsm
        w-[100%]
      bg-white p-2.5 h-max items-center flex text-left rounded-sm border-2 border-primary-500  cursor-grab relative
      "
      >
        <p className="my-auto h-max w-full whitespace-pre-wrap text-gray-900 text-[11.9px]">
          {task.description}
        </p>
        {/* assignee user */}
        <div className="flex w-[100%] justify-between mt-3 items-center">
          <div className="flex text-primary-700 text-[11px] font-semibold items-center justify-center rounded-full">
            {selectedBoardInfo?.key}-{task.sequence}
          </div>
          <div className="flex text-white bg-primary-500 w-[25px] h-[25px] text-[11px] items-center justify-center rounded-full">
            {task.user?.displayName[0].toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={editTaskRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white
          shadow-xsm
          w-[100%]
        border-primary-500 border-[2px] p-2.5 h-max items-center flex text-left rounded-sm cursor-grab"
      >
        <textarea
          className="
        h-[36px]
        w-full text-[11.9px] resize-none rounded bg-transparent text-[#000] focus:outline-none
        "
          ref={textareaEditTaskRef}
          value={newTaskDescription}
          placeholder="Task content here"
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setNewTaskDescription(e.target.value)
          }}
        ></textarea>
        <div className="flex w-[100%] justify-end mt-1">
          <button type="submit" onClick={() => {
            if (!newTaskDescription) {
              return;
            }
            updateTaskDescription()
          }} className="bg-blue-500 text-[12px] px-3 py-[2px] rounded-sm text-white disabled:text-[#0000003f] disabled:bg-gray-100 transition-all font-semibold" disabled={!newTaskDescription}>Update</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // onClick={toggleEditMode}
      className="bg-white 
      shadow-xsm
      flex-col
        w-[100%]
       border-[#edeff2] p-2.5 h-max items-center flex text-left rounded-sm hover:ring-2 hover:ring-inset hover:ring-primary-500 cursor-grab relative task"
      onMouseOver={() => {
        setOptionActive(true)
      }}
      onMouseOut={() => {
        setOptionActive(false)
      }}
    >
      <TaskOption task_id={task?.id} active={optionActive} toggleEditMode={toggleEditMode} deleteTask={deleteTask} />
      <p className="my-auto h-max w-full whitespace-pre-wrap text-gray-900 text-[11.9px]">
        {task.description}
      </p>
      {/* assignee user */}
      <div className="flex w-[100%] justify-between mt-3 items-center">
        <div className="flex text-primary-700 text-[11px] font-semibold items-center justify-center rounded-full">
          {selectedBoardInfo?.key}-{task.sequence}
        </div>

        <AssignMemberPopover assignee_user={task?.user} task_id={task.id ? task.id : ""} updateAssigneeMember={updateAssigneeMember} />
      </div>
    </div>
  );
}

export default TaskCard;
