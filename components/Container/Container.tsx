import { PropsWithChildren } from "react";
import { tw } from "@/helpers/twMerge";

export const Container = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={tw("m-auto max-w-7xl w-full", className)}>{children}</div>
  );
};
