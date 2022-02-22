/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import React from "react";

import { useGroupsInfo } from "../useGroupsInfo";
import { useSavedviewsInfo } from "../useSavedviewsInfo";
import { SavedviewList } from "./SavedviewList";
import { useSavedviewSnapperContext } from "./SavedviewSnapperContext";

export const SavedviewsListWidget = () => {
  const {
    accessToken,
    projectId,
    iModelId,
    onChange,
    selectSavedview,
    savedviewId,
  } = useSavedviewSnapperContext();
  const {
    savedviews,
    fetchSavedviews,
    thumbnails,
    deleteSavedview,
  } = useSavedviewsInfo(projectId ?? "", iModelId, accessToken ?? "");
  const { groups, fetchGroups } = useGroupsInfo(
    projectId ?? "",
    iModelId,
    accessToken ?? ""
  );

  React.useEffect(() => {
    return onChange?.addListener(() => fetchSavedviews());
  }, [fetchSavedviews, onChange]);

  React.useEffect(() => void fetchSavedviews(), [fetchSavedviews]);
  React.useEffect(() => void fetchGroups(), [fetchGroups]);
  return (
    <SavedviewList
      selectedId={savedviewId}
      groups={groups}
      savedviews={savedviews}
      selectSavedview={selectSavedview}
      deleteSavedview={deleteSavedview}
      thumbnails={thumbnails}
    />
  );
};
