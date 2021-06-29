/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Alert } from "@itwin/itwinui-react";
import React, { ComponentPropsWithoutRef } from "react";

import { StorageClient } from "../../api/storage/storageClient";
import { SynchronizationClient } from "../../api/synchronization/synchronizationClient";
import { useApiPrefix } from "../../api/useApiPrefix";

interface ConnectionFileUploaderOptions {
  projectId: string;
  iModelId: string;
  accessToken: string;
  email: string;
}

export const getAlertType = (state: string) =>
  (({
    Success: "positive",
    Error: "negative",
  } as { [state: string]: ComponentPropsWithoutRef<typeof Alert>["type"] })[
    state
  ] ?? "informational");

export const useSynchronizeFileUploader = ({
  projectId,
  iModelId,
  accessToken = "",
  email = "",
}: ConnectionFileUploaderOptions) => {
  const urlPrefix = useApiPrefix();
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<string | undefined>();
  const [progress, setProgress] = React.useState(0);
  const [state, setState] = React.useState<"Success" | "Error" | "Working">();

  const uploadFiles = React.useCallback(
    async (fileList: FileList, onSuccess?: () => void) => {
      if (!fileList || fileList.length === 0) {
        return;
      }
      setProgress(0);
      setStep(1);
      setState("Working");
      try {
        if (accessToken === "") {
          throw new Error("A valid access token is required, none provided");
        }
        if (email === "") {
          throw new Error("User email required, none provided");
        }

        if (fileList.length > 1) {
          throw new Error("Only single file upload are supported (for now)");
        }
        const target = fileList[0];
        const fileName = target?.name;
        const bridgeType = SynchronizationClient.getBridgeType(fileName);
        if (!bridgeType) {
          throw new Error(
            "This file type is not supported, current file support are .dgn, .rvt, .nwd and .ifc"
          );
        }

        setStatus("Validating new connection");
        const synchronization = new SynchronizationClient(
          urlPrefix,
          accessToken
        );
        const {
          connection,
          sourceFiles,
        } = await synchronization.getDemoConnectionAndSourceFiles(iModelId);
        const demoPortalConnection = connection;
        if (sourceFiles?.length > 0) {
          const sourceFile = sourceFiles.find(
            (file) =>
              file.lastKnownFileName?.toLocaleLowerCase() ===
              fileName.toLocaleLowerCase()
          );
          if (sourceFile) {
            throw new Error(
              `Connection for ${fileName} already exists, update is not supported, yet ;)`
            );
          }
        }

        setStep(2);
        setStatus("Validating demo portal file share");
        const storage = new StorageClient(urlPrefix, accessToken);
        const demoFolderId = await storage.getDemoFolderId(projectId, true);
        setStatus("Validating iModel file share");
        const iModelFolderId = await storage.getIModelFolderId(
          demoFolderId,
          iModelId,
          true
        );

        setStatus("Creating file target");
        const fileUpload = await storage.createFile(iModelFolderId, {
          description: "Demo-portal connection file",
          displayName: fileName,
        });

        setStep(3);
        setStatus("Uploading file");
        const uploadTarget = fileUpload._links?.uploadUrl?.href;
        if (!uploadTarget) {
          throw new Error("No upload target");
        }
        await storage.uploadFileWithProgress(uploadTarget, target, setProgress);

        setStatus("Completing file creation");
        const file = await storage.completeFileCreation(
          fileUpload._links?.completeUrl?.href
        );
        if (!file.file?.id) {
          throw new Error("Uploaded file have no Id!");
        }

        setStep(4);
        setStatus("Connecting file to iModel");
        const connectionId = await synchronization.addFileToDemoConnection(
          projectId,
          iModelId,
          demoPortalConnection?.id,
          file.file.id,
          bridgeType,
          email.toLocaleLowerCase()
        );

        //Disabled at the moment, the connection is not "Working" at this point, owner need to be updated.
        setStatus("Running the connection");
        const runStatus = await synchronization.runConnection(
          iModelId,
          connectionId
        );
        if (runStatus.status === 303) {
          setStatus(
            "Complete, synchronization must be started after current run"
          );
        } else {
          setStatus("Synchronization started");
        }
        onSuccess?.();
        setStep(5);
        setState("Success");
      } catch (error) {
        console.error(error);
        if (typeof error?.text === "function") {
          const unpackedError = (await error.text()) as string;
          if (unpackedError.includes("FolderNotFound")) {
            setStatus(
              "Upload failed, structure folder was deleted outside the portal, please refresh the page to continue"
            );
          } else {
            setStatus(unpackedError);
          }
        } else {
          setStatus(error.message);
        }
        setState("Error");
      }
    },
    [accessToken, email, iModelId, projectId, urlPrefix]
  );
  const resetUploader = () => {
    setStep(0);
    setStatus(undefined);
    setProgress(0);
    setState(undefined);
  };
  return { uploadFiles, status, progress, state, step, resetUploader };
};