/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { Angle, Vector3d, YawPitchRollAngles } from "@bentley/geometry-core";
import {
  imageBufferToPngDataUrl,
  ScreenViewport,
  ViewState3d,
} from "@bentley/imodeljs-frontend";

import {
  ViewCameraSavedviewsAPI,
  ViewItwin3dSavedviewsAPI,
  ViewVisibilityListSavedviewsAPI,
  ViewYawPitchRollSavedviewsAPI,
} from "../../api/savedviews/generated";

/**
 * This function apply provided configuration to the provided viewport.
 * @param vp viewport to apply the view to
 * @param view itwin3dView from the savedviews API
 */
export const apply3dView = (
  vp: ScreenViewport,
  view: ViewItwin3dSavedviewsAPI
) => {
  const clone = vp.view.clone() as ViewState3d;
  clone.setOrigin({ x: view.origin[0], y: view.origin[1], z: view.origin[2] });
  clone.setExtents(new Vector3d(...view.extents));
  if (view.angles) {
    clone.setRotation(
      new YawPitchRollAngles(
        Angle.createDegrees(view.angles?.yaw ?? 0),
        Angle.createDegrees(view.angles?.pitch ?? 0),
        Angle.createDegrees(view.angles?.roll ?? 0)
      ).toMatrix3d()
    );
  }
  if (view.camera) {
    clone.camera.setEyePoint({
      x: view.camera.eye[0],
      y: view.camera.eye[1],
      z: view.camera.eye[2],
    });
    clone.camera.setFocusDistance(view.camera.focusDist);
    clone.camera.setLensAngle(Angle.createDegrees(view.camera.lens));
  }
  if (view.categories?.enabled && view.categories.enabled.length > 0) {
    clone.categorySelector.dropCategories(
      clone.categorySelector.toJSON().categories
    );
    clone.categorySelector.addCategories(view.categories.enabled);
  }
  vp.changeView(clone, { animationTime: 100 });
  if (view.models?.enabled && view.models.enabled.length > 0) {
    vp.changeViewedModels(view.models.enabled);
  }
};

/**
 * This function extracts information from the viewport to create an iTwin3dView.
 * @param vp viewport to read from
 * @returns itwin3dView to send to the savedviews API
 */
export const build3dView = (vp: ScreenViewport | undefined) => {
  if (!vp || !vp.view.is3d) {
    return;
  }

  let angles: ViewYawPitchRollSavedviewsAPI | undefined;
  const yprAngles = YawPitchRollAngles.createFromMatrix3d(
    vp.view.getRotation()
  );
  if (yprAngles) {
    angles = {
      yaw: yprAngles?.yaw?.degrees,
      pitch: yprAngles?.pitch?.degrees,
      roll: yprAngles?.roll?.degrees,
    };
  }

  let camera: ViewCameraSavedviewsAPI | undefined;
  if (vp.view.isCameraEnabled()) {
    camera = {
      eye: vp.view.camera.eye.toArray(),
      focusDist: vp.view.camera.focusDist,
      lens: vp.view.camera.lens.degrees,
    };
  }

  const models: ViewVisibilityListSavedviewsAPI = { enabled: [] };
  vp.view.forEachModel((model) => {
    models.enabled?.push(model.id);
  });

  const view: ViewItwin3dSavedviewsAPI = {
    origin: vp.view.getOrigin().toArray(),
    extents: vp.view.getExtents().toArray(),
    angles,
    categories: {
      enabled: vp.view.categorySelector.toJSON().categories,
    },
    models,
    camera,
  };
  return view;
};

/**
 * This function extracts the current view image in a format suitable for Savedviews API
 * @param vp viewport to read from
 * @returns base64 png data url
 */
export const buildImage = (vp: ScreenViewport | undefined) => {
  const targetSize = undefined; //new Point2d(300, 300);
  const t = vp?.readImage(undefined, targetSize, true);
  if (t) {
    return imageBufferToPngDataUrl(t);
  }
  return undefined;
};
