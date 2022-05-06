import React, { useState, userEffect, useMemo, useCallback } from "react";
import { injected } from "../components/wallet/connectors";
import { useWeb3React } from "@web3-react/core";

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const { activate, account, libraby, connector, active, deactive } =
    useWeb3React();

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Loading
  userEffect(() => {
    connect().then((val) => {
      setIsLoading(false);
    });
  }, []);

  const handleIsActive = useCallback(() => {
    console.log("App is connected with Metamask", active);
    setIsActive(active);
  }, [active]);

  userEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  const connect = async () => {
    console.log("Connecting to Metamask");
    try {
      await activate(injected).then(() => {
        console.log("Successfully connected to Metamask");
      });
    } catch (error) {
      console.log("Error on connecting", error);
    }
  };

  const values = useMemo(
    () => ({ isActive, account, isLoading, connect }),
    [isActive, isLoading, account]
  );

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }
  return context;
}
