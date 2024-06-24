/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { RenderMode } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import {
  ExpandableBlock,
  InputGroup,
  LabeledSelect,
  ToggleSwitch,
} from "@itwin/itwinui-react";
import React, { useState } from "react";

import "./ComponentInputs.scss";
import "./ViewOptionsComponents.scss";

const toggleFlag = (name: string) => {
  const viewport = IModelApp.viewManager.selectedView;
  if (viewport) {
    const flags = viewport.view.viewFlags.clone();
    (flags as any)[name] =
      (flags as any)[name] !== undefined
        ? !((flags as any)[name] as boolean)
        : true;
    viewport.view.viewFlags = flags;
  }
};

const getFlagValue = (name: string): boolean => {
  const viewport = IModelApp.viewManager.selectedView;
  if (viewport) {
    return (viewport.view.viewFlags as any)[name];
  }
  return false;
};

export interface ViewFlagToggleProps {
  flag: string;
  label: string;
}

export function ViewFlagToggle({ flag, label }: ViewFlagToggleProps) {
  const [flagValue, setFlagValue] = useState<boolean>(getFlagValue(flag));

  return (
    <ToggleSwitch
      label={label}
      checked={flagValue}
      onChange={() => {
        toggleFlag(flag);
        setFlagValue(getFlagValue(flag));
      }}
    />
  );
}

const setRenderModeInView = (mode: RenderMode) => {
  const viewport = IModelApp.viewManager.selectedView;
  if (viewport) {
    const flags = viewport.view.viewFlags.clone();
    flags.renderMode = mode;
    viewport.view.viewFlags = flags;
  }
};

export function RenderModeSelector() {
  const [value, setValue] = useState<RenderMode | undefined>(undefined);
  return (
    <LabeledSelect
      label="Render Mode:"
      options={[
        { value: RenderMode.Wireframe, label: "Wireframe" },
        { value: RenderMode.SmoothShade, label: "Smooth Shade" },
        { value: RenderMode.HiddenLine, label: "Hidden Line" },
        { value: RenderMode.SolidFill, label: "Solid Fill" },
      ]}
      value={value}
      onChange={(value) => {
        setRenderModeInView(value);
        setValue(value);
      }}
    />
  );
}

export function ViewFlagToggles() {
  return (
    <InputGroup label="View Flags" style={{ gridRow: 1 }}>
      <RenderModeSelector />
      <ExpandableBlock title="View Flags Options">
        <ViewFlagToggle flag="dimensions" label="Dimensions" />
        <ViewFlagToggle flag="patterns" label="Patterns" />
        <ViewFlagToggle flag="weights" label="Weights" />
        <ViewFlagToggle flag="styles" label="Styles" />
        <ViewFlagToggle flag="transparency" label="Transparency" />
        <ViewFlagToggle flag="fill" label="Fill" />
        <ViewFlagToggle flag="textures" label="Textures" />
        <ViewFlagToggle flag="materials" label="Materials" />
        <ViewFlagToggle flag="acsTriad" label="ACS Triad" />
        <ViewFlagToggle flag="grid" label="Grid" />
        <ViewFlagToggle flag="visibleEdges" label="Visible Edges" />
        <ViewFlagToggle flag="hiddenEdges" label="Hidden Edges" />
        <ViewFlagToggle flag="sourceLights" label="Source Lights" />
        <ViewFlagToggle flag="cameraLights" label="Camera Lights" />
        <ViewFlagToggle flag="solarLight" label="Solar Light" />
        <ViewFlagToggle flag="shadows" label="Shadows" />
        <ViewFlagToggle flag="clipVolume" label="Clip Volume" />
        <ViewFlagToggle flag="constructions" label="Constructions" />
        <ViewFlagToggle flag="monochrome" label="Monochrome" />
        <ViewFlagToggle flag="backgroundMap" label="Background Map" />
        <ViewFlagToggle
          flag="hLineMaterialColors"
          label="Hidden Line Material Color"
        />
        <ViewFlagToggle flag="ambientOcclusion" label="Ambient Occlusion" />
        <ViewFlagToggle flag="thematicDisplay" label="Thematic Display" />
        <ViewFlagToggle
          flag="forceSurfaceDiscard"
          label="Force Surface Discard"
        />
        <ViewFlagToggle
          flag="whiteOnWhiteReversal"
          label="White On White Reversal"
        />
      </ExpandableBlock>
    </InputGroup>
  );
}

export function ViewOptionsPanel() {
  return (
    <div className="idp-view-options">
      <ViewFlagToggles />
    </div>
  );
}
