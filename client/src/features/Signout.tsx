import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignout } from "../stores/state-ctx";
import { signout } from "../api/auth";

interface SignoutProps {
  [key: string]: any;
}

const Signout = ({ close }: SignoutProps) => {
  const signoutCtx = useSignout();
  const navigate = useNavigate();

  useEffect(() => {
    const signinigOut = async () => {
      await signout();
      close();
      signoutCtx();
      navigate("/");
    };
    signinigOut();
  }, []);

  return <div>Signing you out ...</div>;
};

export default Signout;
