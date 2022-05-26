/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { useActiveViewport } from "@bentley/ui-framework";
import { FooterIndicator } from "@bentley/ui-ninezone";
import { SvgImageFrame } from "@itwin/itwinui-icons-react";
import { Tooltip } from "@itwin/itwinui-react";
import React from "react";

import { ViewSavedviewsAPI } from "../../../api/savedviews/generated";
import { apply3dView, build3dView, buildImage } from "../itwinjsViewConverter";
import { useSavedviewsInfo } from "../useSavedviewsInfo";
import { toastErrorWithCode } from "../util";
import { SavedViewsModal } from "./SavedviewsModal";
import { useSavedviewSnapperContext } from "./SavedviewSnapperContext";

export const SavedviewStatusBarItem = () => {
  const {
    projectId,
    iModelId,
    accessToken,
    savedviewId,
    onChange,
  } = useSavedviewSnapperContext();
  const target = React.useRef<HTMLDivElement>(null);
  const activeViewport = useActiveViewport();
  const [view, setViewInfo] = React.useState<{
    view?: ViewSavedviewsAPI;
    image?: string;
  }>({});

  const snap = React.useCallback(() => {
    if (activeViewport) {
      const view = build3dView(activeViewport);
      const image = buildImage(activeViewport);
      setViewInfo({
        view: { itwin3dView: view },
        image,
      });
    }
  }, [activeViewport]);

  const { fetchSavedview } = useSavedviewsInfo(
    projectId ?? "",
    iModelId,
    accessToken ?? ""
  );

  React.useEffect(() => {
    if (savedviewId && activeViewport && activeViewport.view.is3d()) {
      fetchSavedview(savedviewId)
        .then((savedview) => {
          const view = savedview?.savedViewData.itwin3dView;
          if (!view) {
            return;
          }
          setTimeout(() => {
            apply3dView(activeViewport, view);
          }, 100);
        })
        .catch((e) => {
          toastErrorWithCode(e, "Fetch savedview for display failed");
        });
    }
  }, [activeViewport, fetchSavedview, savedviewId]);

  return (
    <>
      <Tooltip placement="top" content={"Create saved view"}>
        <div ref={target} onClick={snap}>
          <FooterIndicator isInFooterMode={true}>
            <SvgImageFrame
              style={{
                cursor: "pointer",
                fill: "currentColor",
              }}
              className="iui-icons-default"
            />
          </FooterIndicator>
        </div>
      </Tooltip>
      {accessToken && projectId ? (
        <SavedViewsModal
          complete={() => {
            setViewInfo({});
            onChange?.raiseEvent();
          }}
          accessToken={accessToken}
          projectId={projectId}
          iModelId={iModelId}
          view={view.view}
          image={view.image}
        />
      ) : null}
    </>
  );
};
