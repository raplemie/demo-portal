/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { UserInfo } from "@bentley/itwin-client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useConfig } from "../../config/ConfigProvider";
import AuthClient from "../../services/auth/AuthClient";
import { getClaimsFromToken } from "../../services/auth/authUtils";
import { ai } from "../../services/telemetry";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  accessToken?: string;
  userInfo?: UserInfo;
  signOut: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextValue>({
  isAuthenticated: false,
  isAuthorized: false,
  signOut: async () => {
    await AuthClient.signOut();
  },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const { auth } = useConfig();

  useEffect(() => {
    const initAuth = async () => {
      if (!auth) {
        return;
      }
      if (!AuthClient.client) {
        if (!auth.clientId) {
          throw new Error(
            "Please add a valid client ID in the .env.local file and restart the application"
          );
        }
        const client = AuthClient.initialize(auth.clientId, auth.authority);
        client.onUserStateChanged.addListener((token) => {
          const tokenString = token?.toTokenString();
          setAccessToken(tokenString);
          const userInfo = UserInfo.fromTokenResponseJson(
            getClaimsFromToken(tokenString ?? "")
          );
          setUserInfo(userInfo);
          ai.updateUserInfo(userInfo);
        });
      }

      try {
        // attempt silent signin
        await AuthClient.signInSilent();
      } catch (error) {
        // if silent sign in fails, have user manually sign in
        await AuthClient.signIn();
      }
    };

    initAuth().catch(console.error);

    return () => {
      AuthClient.dispose();
    };
  }, [auth]);

  const isAuthorized = useMemo(() => {
    if (auth?.whitelistedIds) {
      const tokenObject = getClaimsFromToken(accessToken ?? "");
      if (tokenObject?.org) {
        const whitelist = auth.whitelistedIds.split(" ");
        return whitelist.includes(tokenObject?.org);
      }
      return false;
    }
    return true;
  }, [accessToken, auth]);

  const signOut = useCallback(async () => {
    await AuthClient.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        isAuthorized,
        accessToken,
        userInfo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext");
  }
  return context;
};
