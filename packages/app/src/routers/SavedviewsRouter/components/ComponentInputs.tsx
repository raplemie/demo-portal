/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/

import { ColorByName, ColorDef } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { ColorPickerButton } from "@bentley/ui-components";
import { LabeledInput, Slider } from "@itwin/itwinui-react";
import React, { useState } from "react";

import { generateJSONInStyles } from "../GenerateJSONStyles";
import { reloadDisplayStyle } from "../ReloadDisplayStyle";
import "./ComponentInputs.scss";

export interface ComponentsColorPickerProps {
  label: string;
  path: any[];
  pathLength: number;
  dataType?: string;
  colorType?: string;
}
export function checkVariable(path: any[], colorType: any) {
  if (colorType === undefined) {
    return ColorDef.fromString("grey");
  }
  const newBackground = IModelApp.viewManager.selectedView?.displayStyle
    .clone()
    .toJSON();
  let destination: any;
  if (newBackground !== undefined) {
    destination = newBackground.jsonProperties.styles;
  }
  for (let i = 0; i < path.length; i++) {
    if (destination[path[i]] === undefined) {
      if (colorType === "skyColor") {
        return ColorDef.from(143, 205, 255);
      }
      if (colorType === "groundColor") {
        return ColorDef.from(120, 143, 125);
      }
      if (colorType === "zenithColor") {
        return ColorDef.from(54, 117, 255);
      }
      if (colorType === "nadirColor") {
        return ColorDef.from(40, 15, 0);
      }
      if (colorType === "aboveColor") {
        return ColorDef.fromTbgr(ColorByName.darkGreen);
      }
      if (colorType === "belowColor") {
        return ColorDef.fromTbgr(ColorByName.darkBrown);
      }
      if (colorType === "solarShadow") {
        return ColorDef.fromString("grey");
      }
      if (colorType === "ambientLight") {
        return ColorDef.from(0, 0, 0);
      }
      if (colorType === "upperColor") {
        return ColorDef.from(143, 205, 255);
      }
      if (colorType === "lowerColor") {
        return ColorDef.from(120, 143, 125);
      }
    }
    destination = destination[path[i]];
  }
  return destination;
}
export function ComponentsColorPicker({
  label,
  path,
  pathLength,
  dataType,
  colorType,
}: ComponentsColorPickerProps) {
  return (
    <div className="idp-label-with-color-picker">
      <div className="idp-label">{label}</div>
      <ColorPickerButton
        initialColor={checkVariable(path, colorType)}
        onColorPick={(color: ColorDef) => {
          const newBackground = IModelApp.viewManager.selectedView?.displayStyle
            .clone()
            .toJSON();

          if (pathLength !== path.length) {
            path.pop();
          }
          if (dataType === "JSON") {
            path.push(color.toJSON());
          }
          if (dataType === "RGB") {
            path.push(color.getRgb());
          }

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          // Load display style again
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined && newBackground !== undefined) {
            reloadDisplayStyle(vp, newBackground);
          }
        }}
      />
    </div>
  );
}

export interface ComponentsSliderProps {
  label: string;
  path: any[];
  pathLength: number;
  min: number;
  max: number;
  step: number;
}
export function ComponentsSlider({
  label,
  path,
  pathLength,
  min,
  max,
  step,
}: ComponentsSliderProps) {
  const [value, setValue] = useState(0.2);
  return (
    <div className="idp-label-with-slider">
      <div className="idp-label">
        {label} : {value.toFixed(1)}
      </div>
      <Slider
        style={{ width: "100%" }}
        thumbMode="inhibit-crossing"
        trackDisplayMode="auto"
        values={[value]}
        max={max}
        min={min}
        step={step}
        onChange={(values: ReadonlyArray<number>) => {
          const newBackground = IModelApp.viewManager.selectedView?.displayStyle
            .clone()
            .toJSON();
          setValue(values[0]);

          if (pathLength !== path.length) {
            path.pop();
          }

          path.push(values[0]);

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          // Load display style again
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined && newBackground !== undefined) {
            reloadDisplayStyle(vp, newBackground);
          }
        }}
      />
    </div>
  );
}

export interface ComponentsTextboxProps {
  label: string;
  path: any[];
  pathLength: number;
}
export function ComponentsTextbox({
  label,
  path,
  pathLength,
}: ComponentsTextboxProps) {
  const [inputValue, setInputValue] = useState(0);

  return (
    <LabeledInput
      placeholder="Enter value here"
      label={label}
      size="small"
      onChange={(_event) => {
        // switch to textarea
        const newValue: number = parseInt(_event.target.value);

        const newBackground = IModelApp.viewManager.selectedView?.displayStyle
          .clone()
          .toJSON();
        if (!newValue) {
          setInputValue(0);
        } else {
          setInputValue(newValue);
        }

        if (pathLength !== path.length) {
          path.pop();
        }

        path.push(newValue);

        if (newBackground !== undefined) {
          generateJSONInStyles(newBackground, path);
        }

        // Load display style again
        const vp = IModelApp.viewManager.selectedView;
        if (vp !== undefined && newBackground !== undefined) {
          reloadDisplayStyle(vp, newBackground);
        }
      }}
    />
  );
}
