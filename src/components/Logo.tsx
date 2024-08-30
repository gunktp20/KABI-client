import logo from "../assets/images/logo.png";

interface IProps {
    width?: string;
}
const Logo = ({ width }: IProps) => {
    return <img src={logo} alt="carental" className="object-cover" width={width}></img>;
};

export default Logo;