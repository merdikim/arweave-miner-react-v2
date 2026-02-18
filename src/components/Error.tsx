import arweave_logo from "@/assets/arweave.svg";
import Button from "@/components/ui/Button";

interface ErrorProps {
  msg: string;
  title?: string;
  onRetry?: () => void;
}

const Error = ({
  msg,
  title = "Something went wrong",
  onRetry
}: ErrorProps) => {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center px-2 md:px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-5 py-8 md:px-8 md:py-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50">
          <img src={arweave_logo} alt="arweave-logo" className="h-6 w-6" />
        </div>

        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm md:text-base text-gray-600">{msg}</p>

        {onRetry && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={onRetry}
              className="h-10 px-5 border-gray-900 bg-gray-900 text-white"
            >
              Retry 
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;
