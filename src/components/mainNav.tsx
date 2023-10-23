import React from "react";
import UnderlineLink from "./links/UnderlineLink";
import { Separator } from "./ui/separator";

const MainNav = () => {
  return (
    <nav className="flex">
      <UnderlineLink href="/dashboard">Dasboard</UnderlineLink>
      <Separator orientation="vertical" className="mx-2" />
      <UnderlineLink href="/dashboard/tasks">Tasks</UnderlineLink>
      <Separator orientation="vertical" className="mx-2" />
      <UnderlineLink href="/dashboard/perfil">Perfil</UnderlineLink>
    </nav>
  );
};

export default MainNav;
