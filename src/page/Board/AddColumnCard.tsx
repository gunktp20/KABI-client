import { useEffect, useRef } from "react";

interface IProp {
    open: boolean
    setOpen: (open: boolean) => void
    addColumnContent: string
    setAddColumnContent: (content: string) => void
    createNewColumn: (column_name: string) => void
}

const AddColumnCard = ({ open, setOpen, addColumnContent, setAddColumnContent, createNewColumn }: IProp) => {

    const addColumnRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (event.key === "Enter") {
            event.preventDefault();
        }
        if (event.key === "Enter" && !event.shiftKey) {
            if (!addColumnContent) {
                return;
            }
            createNewColumn(addColumnContent.trim())
            setAddColumnContent("")
            setOpen(false)
        }
    };

    function handleClick(event: MouseEvent) {
        if (addColumnRef.current && addColumnRef.current.contains(event.target as Node)) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }

    useEffect(() => {

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [])

    useEffect(() => {
        if (open && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [open]);
    return (
        <div
            ref={addColumnRef}
            className={`bg-white border-blue-500 border-[2px] p-2.5 w-[200px] h-max items-center flex text-left rounded-sm cursor-grab ${open ? "" : "hidden"}`}
        >
            <div className="w-[100%]">
                <textarea
                    className="
        h-[36px]
        w-full text-[11.9px] resize-none rounded bg-transparent text-[#000] focus:outline-none
        "
                    ref={textareaRef}
                    value={addColumnContent}
                    placeholder="Column title"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setAddColumnContent(e.target.value)
                    }}
                ></textarea>
                <div className="flex w-[100%] justify-end mt-1">
                    <button type="submit" onClick={() => {
                        if (!addColumnContent) {
                            return;
                        }
                        createNewColumn(addColumnContent.trim())
                        setAddColumnContent("")
                        setOpen(false)
                    }} className="bg-blue-500 text-[12px] px-3 py-[2px] rounded-sm text-white disabled:text-[#0000003f] disabled:bg-gray-100 transition-all font-semibold" disabled={!addColumnContent}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default AddColumnCard;