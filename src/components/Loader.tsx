
interface ILoader {
    width: string
}
function Loader({ width }: ILoader) {
    return (
        <div className={`loader w-[${width}] h-[${width}]`}></div>
    )
}

export default Loader
