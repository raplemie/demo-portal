/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  AbstractWidgetProps,
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import React from "react";

import { ViewOptionsPanel } from "../components/ViewOptionsComponents";

export class ViewOptionsProvider implements UiItemsProvider {
  public readonly id = "ViewOptionsProvider";

  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection | undefined
  ): AbstractWidgetProps[] {
    const widgets: AbstractWidgetProps[] = [];
    if (
      // stageUsage === StageUsage.General &&
      location === StagePanelLocation.Right &&
      section === StagePanelSection.Start
    ) {
      widgets.push({
        id: "viewOptionsWidget",
        getWidgetContent: () => <ViewOptionsPanel />,
        icon: "icon-view",
        label: "View Options",
      });
    }

    return widgets;
  }
}