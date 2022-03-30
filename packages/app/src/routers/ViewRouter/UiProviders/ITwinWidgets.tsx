/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { ViewDisplayWidget } from "@bentley/itwin-widgets";
import {
  CommonStatusBarItem,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import {
  StatusBarItemUtilities,
  withStatusFieldProps,
} from "@bentley/ui-framework";
import React from "react";

export class ITwinWidgetsProvider implements UiItemsProvider {
  public readonly id = "ITwinWidgetProvider";

  public provideStatusBarItems(
    stageId: string,
    stageUsage: string
  ): CommonStatusBarItem[] {
    const items: CommonStatusBarItem[] = [];
    if (stageUsage === StageUsage.General) {
      const DisplayWidgetWithProps = withStatusFieldProps(ViewDisplayWidget);
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "ViewDisplayWidget",
          StatusBarSection.Center,
          20,
          // eslint-disable-next-line react/react-in-jsx-scope
          <DisplayWidgetWithProps
            onFeatureTracking={() => {
              /* No-op */
            }}
          />
        )
      );
    }
    return items;
  }
}
