/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { BeEvent } from "@bentley/bentleyjs-core";
import React, { useContext } from "react";

export interface SavedviewSnapperContextProps {
  projectId?: string | undefined;
  iModelId?: string;
  accessToken?: string | undefined;
  savedviewId?: string | undefined;
  selectSavedview?: (id: string) => void;
  onChange?: BeEvent<() => void>;
}

const SavedviewSnapperContext = React.createContext<
  SavedviewSnapperContextProps
>({});

export const SavedviewSnapperContextProvider = ({
  accessToken,
  iModelId,
  projectId,
  savedviewId,
  selectSavedview,
  children,
}: React.PropsWithChildren<Omit<SavedviewSnapperContextProps, "onChange">>) => {
  const [onChange] = React.useState(() => new BeEvent<() => void>());
  React.useEffect(() => () => onChange.clear(), [onChange]);
  return (
    <SavedviewSnapperContext.Provider
      value={{
        iModelId,
        accessToken,
        projectId,
        savedviewId,
        selectSavedview,
        onChange,
      }}
    >
      {children}
    </SavedviewSnapperContext.Provider>
  );
};

export const useSavedviewSnapperContext = () => {
  return useContext(SavedviewSnapperContext);
};
