import Logo from "@/components/logo";
import SingUpFrom from "@/components/auth/singUpFrom";
import { Separator } from "@/components/ui/separator";

const SingUp = () => {
  return (
    <div className="w-full sm:w-[500px] mx-4">
      <div className="text-white flex justify-center">
        <Logo />
      </div>
      <div>
        <h2 className="mx-auto pt-4 pb-4 text-center text-2xl text-amber-300">
          Welcome to <br /> Task Management App
        </h2>
        <Separator />
        <div className="my-4">
          <SingUpFrom />
        </div>
      </div>
    </div>
  );
};

export default SingUp;
