import UnderlineLink from "@/components/links/UnderlineLink";
import { NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl font-bold">- 404 - </h1>
      <h2 className="py-4">Page Not Found</h2>
      <p>The page you are looking for could not be found.</p>
      <div className="py-4">
        <UnderlineLink href={"/"}>Return a Home</UnderlineLink>
      </div>
    </div>
  );
};

export default NotFound;
