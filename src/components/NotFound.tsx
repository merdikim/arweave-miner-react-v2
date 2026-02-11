import arweave_logo from "@/assets/arweave.svg";

const NotFound = ({ msg }: { msg: string }) => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <img
        src={arweave_logo}
        alt="arweave-logo"
        className="mr-5 h-8 w-8 sm:h-10 sm:w-10"
      />
      <i className="text-xl font-medium text-gray-600">{msg}</i>
    </div>
  );
};

export default NotFound;
