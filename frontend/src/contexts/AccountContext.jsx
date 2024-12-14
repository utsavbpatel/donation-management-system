import { createContext, useContext, useState, useEffect } from "react";

export const AccountContext = createContext();

export const useAccount = () => {
    const context = useContext(AccountContext);
    return context;
}

export const AccountProvider = (props) => {
    const [data, setData] = useState({});

    return (<AccountContext.Provider value={{ data, setData }}>
        {props.children}
    </AccountContext.Provider>)
}