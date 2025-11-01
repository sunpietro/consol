import { PropsWithChildren } from "react";

export const PageHeader = ({ children }: PropsWithChildren<{}>) => {
  return (
    <header className="bg-foreground h-40 flex items-center">{children}</header>
  );
};
