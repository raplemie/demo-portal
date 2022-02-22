/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  AbstractWidgetProps,
  AbstractZoneLocation,
  CommonStatusBarItem,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import { StatusBarItemUtilities } from "@bentley/ui-framework";
import "@itwin/itwinui-css/css/icon.css";
import React from "react";

import { SavedviewsListWidget } from "../components/SavedviewsListWidget";
import { SavedviewStatusBarItem } from "../components/SavedviewStatusBarItem";

export class SavedviewSnapper implements UiItemsProvider {
  public readonly id = "SavedviewSnapperProvider";

  public provideStatusBarItems(
    _stageId: string,
    stageUsage: string
  ): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];
    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SavedviewsSnapper.StatusBarItem",
          StatusBarSection.Right,
          15,
          <SavedviewStatusBarItem />
        )
      );
    }

    return statusBarItems;
  }

  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection | undefined,
    zoneLocation?: AbstractZoneLocation | undefined
  ): readonly AbstractWidgetProps[] {
    const widgets: AbstractWidgetProps[] = [];
    widgets.push({
      id: "SavedviewsSnapper.MainListWidget",
      providerId: this.id,
      label: "Savedviews",
      getWidgetContent: () => <SavedviewsListWidget />,
    });
    return widgets;
  }
}
