import { twMerge } from "tailwind-merge";

export default function Die(prop) {
  return (
    <>
      <button
        className={twMerge(
          "btn size-[3.5rem] border-none bg-[#6547eb] text-2xl shadow-2xl",
          prop.isHeld && "bg-[#00615A]",
        )}
        onClick={prop.onClick}
      >
        {prop.value}
      </button>
    </>
  );
}
