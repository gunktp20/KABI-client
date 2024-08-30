import { useEffect, useRef } from "react";

interface IProp {
    addMode: boolean
    setAddMode: (add: boolean) => void
    addTaskContent: string;
    setAddTaskContent: (content: string) => void
    createTask: (column_id: string, taskContent: string) => void
    column_id: string
}

const AddTaskCard = ({ addMode, setAddMode, addTaskContent, setAddTaskContent, createTask, column_id }: IProp) => {

    const addTaskRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        
        if (event.key === "Enter") {
            event.preventDefault();
        }
        if (event.key === "Enter" && !event.shiftKey) {
            if (!addTaskContent) {
                return;
            }
            console.log("create")
            createTask(column_id, addTaskContent.trim())
            setAddTaskContent("")
            setAddMode(false)
        }
    };

    function handleClick(event: MouseEvent) {
        if (addTaskRef.current && addTaskRef.current.contains(event.target as Node)) {
            setAddMode(true)
        } else {
            setAddMode(false)
        }
    }

    useEffect(() => {

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [])

    useEffect(() => {
        if (addMode && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [addMode]);
    return (
        <div
            ref={addTaskRef}
            className={`bg-white border-blue-500 border-[2px] p-2.5 h-max items-center flex text-left rounded-sm cursor-grab ${addMode ? "" : "hidden"}`}
        >
            <div className="w-[100%]">
                <textarea
                    className="
        h-[36px]
        w-full text-[11.9px] resize-none rounded bg-transparent text-[#000] focus:outline-none
        "
                    ref={textareaRef}
                    value={addTaskContent}
                    placeholder="Task content here"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setAddTaskContent(e.target.value)
                    }}
                ></textarea>
                <div className="flex w-[100%] justify-end mt-1">
                    <button type="submit" onClick={() => {
                        if (!addTaskContent) {
                            return;
                        }
                        console.log("create")
                        createTask(column_id, addTaskContent.trim())
                        setAddTaskContent("")
                        setAddMode(false)
                    }} className="bg-blue-500 text-[12px] px-3 py-[2px] rounded-sm text-white disabled:text-[#0000003f] disabled:bg-gray-100 transition-all font-semibold" disabled={!addTaskContent}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default AddTaskCard;