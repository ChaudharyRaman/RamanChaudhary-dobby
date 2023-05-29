import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const Context = createContext<any | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

const ContextProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const userToken = localStorage.getItem("userToken");
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (!userToken) {
      console.log(window.location.href);

      return;
    }

    const user = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_SERVER_BASE_ADDR}/users/me`,
        config
      );
      setUser(data);
    };
    user();
  }, [navigate, fetchAgain]);

  return (
    <Context.Provider
      value={{ user, setUser, userToken, fetchAgain, setFetchAgain }}
    >
      {children}
    </Context.Provider>
  );
};
export const ContextState = () => {
  return useContext(Context);
};

export default ContextProvider;
