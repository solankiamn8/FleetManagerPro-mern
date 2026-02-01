import toast from "react-hot-toast";

export const showDemoToast = (otp) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <div className="font-bold text-xs text-gray-500 uppercase tracking-wider">
          🚧 Demo Mode (No Email)
        </div>
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
          <span className="font-mono text-xl font-bold tracking-[0.2em] text-gray-800">
            {otp}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(otp);
            toast.dismiss(t.id);
            toast.success("Copied to clipboard!");
          }}
          className="text-xs bg-blue-600 text-white py-1.5 px-2 rounded hover:bg-blue-700 font-medium transition-colors"
        >
          Copy OTP & Close
        </button>
      </div>
    ),
    { duration: 15000, position: "top-right" },
  );
};