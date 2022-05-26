import React from "react";

import {
  ImageUpdateSavedviewsAPI,
  SavedViewCreateSavedviewsAPI,
  SavedViewSavedviewsAPI,
  SavedViewUpdateSavedviewsAPI,
} from "../../api/savedviews/generated";
import { SavedviewsClient } from "../../api/savedviews/savedviewsClient";
import { useApiPrefix } from "../../api/useApiPrefix";

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
export type CreateSavedViewPayload = Omit<
  SavedViewCreateSavedviewsAPI,
  "projectId" | "iModelId"
>;
export const useSavedviewsInfo = (
  projectId: string,
  iModelId: string | undefined,
  accessToken: string
) => {
  const urlPrefix = useApiPrefix();

  const [savedviews, setSavedviews] = React.useState<
    SavedViewSavedviewsAPI[]
  >();

  const [thumbnails, setThumbnails] = React.useState<Record<string, string>>(
    {}
  );
  const thumbnailRequestor = React.useRef<
    Record<string, Promise<void> | undefined>
  >({});

  const fetchThumbnail = React.useCallback(
    async (id: string) => {
      if (!accessToken || !id) {
        return;
      }
      const client = new SavedviewsClient(urlPrefix, accessToken);
      try {
        const { href } = await client.getThumbnail(id);
        return href;
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, urlPrefix]
  );

  const fetchImage = React.useCallback(
    async (id: string) => {
      if (!accessToken || !id) {
        return;
      }
      const client = new SavedviewsClient(urlPrefix, accessToken);
      try {
        const { href } = await client.getImage(id);
        return href;
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, urlPrefix]
  );

  const putImage = React.useCallback(
    async (id: string, payload: ImageUpdateSavedviewsAPI) => {
      if (!accessToken || !id || !payload) {
        return;
      }
      const client = new SavedviewsClient(urlPrefix, accessToken);
      try {
        await client.addImage(id, payload);
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, urlPrefix]
  );

  React.useEffect(() => {
    savedviews?.forEach((s) => {
      if (thumbnailRequestor.current[s.id]) {
        return;
      }
      thumbnailRequestor.current[s.id] = fetchThumbnail(s.id).then((image) => {
        if (!image) {
          return;
        }
        setThumbnails((thumbnails) => ({
          ...thumbnails,
          [s.id]: image,
        }));
      });
    });
  }, [fetchImage, fetchThumbnail, savedviews]);

  const fetchSavedview = React.useCallback(
    async (id: string) => {
      if (!accessToken || !id) {
        return;
      }
      const client = new SavedviewsClient(urlPrefix, accessToken);
      try {
        const { savedView } = await client.getSavedview(id);
        return savedView;
      } catch (error) {
        console.error(error);
      }
    },
    [accessToken, urlPrefix]
  );

  const fetchSavedviews = React.useCallback(async () => {
    if (!accessToken || !projectId) {
      return;
    }
    const client = new SavedviewsClient(urlPrefix, accessToken);
    try {
      const { savedViews: fetched } = await client.getAllSavedviews(
        projectId,
        iModelId
      );
      setSavedviews(fetched);
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, iModelId, projectId, urlPrefix]);

  const createSavedview = React.useCallback(
    async (
      savedview: CreateSavedViewPayload,
      image?: ImageUpdateSavedviewsAPI
    ) => {
      if (accessToken && projectId) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        const { savedView: created } = await client.createSavedview({
          projectId,
          iModelId,
          ...savedview,
        });
        if (image) {
          await client.addImage(created.id, image);
        }
        return await fetchSavedviews();
      }
    },
    [accessToken, fetchSavedviews, iModelId, projectId, urlPrefix]
  );

  const deleteSavedview = React.useCallback(
    async (id: string) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.deleteSavedview(id);
        return await fetchSavedviews();
      }
    },
    [accessToken, fetchSavedviews, urlPrefix]
  );

  const updateSavedview = React.useCallback(
    async (id: string, update: SavedViewUpdateSavedviewsAPI) => {
      if (accessToken && id) {
        const client = new SavedviewsClient(urlPrefix, accessToken);
        await client.updateSavedview(id, update);
        return await fetchSavedviews();
      }
    },
    [accessToken, fetchSavedviews, urlPrefix]
  );

  return {
    savedviews,
    thumbnails,
    fetchImage,
    putImage,
    createSavedview,
    deleteSavedview,
    updateSavedview,
    fetchSavedviews,
    fetchSavedview,
  };
};
