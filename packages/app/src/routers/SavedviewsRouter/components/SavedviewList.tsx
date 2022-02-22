/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SvgImageFrame } from "@itwin/itwinui-icons-react";
import { Badge, MenuItem, Tag, TagContainer, Tile } from "@itwin/itwinui-react";
import React from "react";

import {
  GroupSavedviewsAPI,
  SavedViewSavedviewsAPI,
} from "../../../api/savedviews/generated";
import { GroupIdHrefMatcher } from "../../../api/savedviews/savedviewsClient";
import "./SavedviewList.scss";

export interface SavedviewListProps {
  selectedId: string | undefined;
  savedviews: SavedViewSavedviewsAPI[] | undefined;
  groups: GroupSavedviewsAPI[] | undefined;
  selectSavedview: ((id: string) => void) | undefined;
  deleteSavedview?: (id: string) => void;
  thumbnails: Record<string, string> | undefined;
}

export const SavedviewList = ({
  selectedId,
  savedviews,
  groups,
  selectSavedview,
  deleteSavedview,
  thumbnails,
}: SavedviewListProps) => {
  return (
    <div className={"idp-savedview-list"}>
      {savedviews?.map((s) => (
        <div key={s.id} onClick={() => selectSavedview?.(s.id)}>
          <Tile
            isSelected={s.id === selectedId}
            badge={
              s.category ? (
                <Badge backgroundColor={"negative"}>{s.category}</Badge>
              ) : (
                undefined
              )
            }
            thumbnail={
              thumbnails?.[s.id] ? (
                <img
                  alt={s.displayName}
                  src={thumbnails[s.id]}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <SvgImageFrame />
              )
            }
            description={
              groups?.find(
                (g) =>
                  s._links.group?.href.match(GroupIdHrefMatcher)?.[0] === g.id
              )?.displayName ?? ""
            }
            name={s.displayName}
            variant={"folder"}
            metadata={
              <TagContainer overflow="truncate">
                {s.tags?.map((t) => (
                  <Tag key={t.id} variant="basic">
                    {t.displayName}
                  </Tag>
                ))}
              </TagContainer>
            }
            moreOptions={
              deleteSavedview
                ? [
                    <MenuItem
                      key="delete"
                      onClick={() => deleteSavedview(s.id)}
                    >
                      Delete
                    </MenuItem>,
                  ]
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
};
