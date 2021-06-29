/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export interface OIDCSelectors {
  v2: {
    usernameInput: string;
    nextInput: string;
    passwordInput: string;
    signInButton: string;
  };
  v1: {
    usernameInput: string;
    passwordInput: string;
    signInButton: string;
  };
}

export const OIDC: OIDCSelectors = {
  v2: {
    usernameInput: "id=identifierInput",
    nextInput: "id=postButton",
    passwordInput: "id=password",
    signInButton:
      "//a[contains(@class,'ping-button') and contains(@title,'Sign In')]",
  },
  v1: {
    usernameInput: "css=[name='EmailAddress']",
    passwordInput: "css=[name='Password']",
    signInButton: "id=submitLogon",
  },
};

export interface BaseSelectors {
  signInButton: string;
}

export const Base: BaseSelectors = {
  signInButton: "text='Sign In'",
};

export interface HomeSelectors {
  icon: string;
  Portal: string;
  Card: {
    grid: string;
    thumbnail: string;
    title: string;
  };
}

export const Home: HomeSelectors = {
  icon: "css=.iui-header-logo",
  Portal: "text='iTwin Demo'",
  Card: {
    grid: "css=[class*=iac-grid-structure]",
    thumbnail: "css=.iui-thumbnail",
    title: "css=.iui-name-label",
  },
};

export interface ViewerSelectors {
  container: string;
}

export const Viewer: ViewerSelectors = {
  container: "css=.itwin-viewer-container",
};