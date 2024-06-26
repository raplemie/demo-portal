/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgCopy } from "@itwin/itwinui-icons-react";
import {
  Code,
  IconButton,
  Small,
  TableProps,
  toaster,
} from "@itwin/itwinui-react";
import React from "react";

export const toastErrorWithCode = (e: Response, message: string) => {
  if (typeof e.json === "function") {
    const activityId = e?.headers?.get?.("x-correlation-id");
    void e.json().then((body: string) => {
      toaster.negative(
        <>
          {message}
          <br />
          <Code style={{ whiteSpace: "pre" }}>
            {JSON.stringify(body, undefined, 2)}
          </Code>
          {activityId ? (
            <Small>
              ActivityId: {activityId}{" "}
              <IconButton
                title={"Copy ActivityId"}
                styleType="borderless"
                onClick={() => {
                  void navigator.clipboard.writeText(activityId);
                }}
              >
                <SvgCopy />
              </IconButton>
            </Small>
          ) : null}
        </>,
        {
          hasCloseButton: true,
          type: "persisting",
        }
      );
    });
  } else {
    toaster.negative(
      <>
        {message}
        <br />
        <Code style={{ whiteSpace: "pre" }}>
          {JSON.stringify(e, undefined, 2)}
        </Code>
      </>
    );
  }
};

export type UseStateControllerFn<
  T extends { id?: string } = { id?: string }
> = Exclude<TableProps<T>["useControlledState"], undefined>;

export const createSelectionStateController: <T extends {
  id?: string;
}>(
  selected: string | undefined
) => UseStateControllerFn<T> = (selected: string | undefined) => (state) => {
  if (selected) {
    state.selectedRowIds = { [selected]: true } as any;
  } else {
    state.selectedRowIds = {} as any;
  }
  return state;
};
