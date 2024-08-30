function Footer() {
    return (
      <div className="bg-primary-900 mt-[8rem] z-[11] w-[100%] flex flex-col justify-center items-center pt-10 pb-10">
        <div className=" flex w-[70%] justify-between pb-10 sm:flex-col sm: sm:items-center">
          <div className="flex flex-col w-[200px] sm:w-[300px] sm:mb-5">
            <div className=" text-[19px] text-white mb-5 font-bold">WR</div>
            <div className="text-[12.5px] text-[#fff]">
              Nakhon Pathom Rajabhat University 85 Malaiman Road, Muang District,
              Nakhon Pathom 73000. 0 3426 1048 0 3410 9300. saraban@npru.ac.th
            </div>
          </div>
          <div className="flex flex-col w-[200px] sm:w-[300px] sm:mb-5">
            <div className=" text-[19px] text-white mb-5 font-bold">Services</div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              Website Designing
            </div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              Website Development
            </div>
          </div>
          <div className="flex flex-col w-[200px] sm:w-[300px]">
            <div className=" text-[19px] text-white mb-5 font-bold">
              Languages
            </div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              English
            </div>
          </div>
        </div>
  
        <div className="bg-white w-[90%] h-[1px]"></div>
        <div className="flex w-[70%] justify-center text-[#ccc] text-[12px] mt-3">
          Non Copyrighted © 2022 Design and upload by rich technologies
        </div>
      </div>
    );
  }
  
  export default Footer;
  