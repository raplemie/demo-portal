/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
/**
 * Returns the main part of a JWT as an object.
 * @param token OAuth JWT
 * @returns Object, or undefined if cant be parsed.
 */
export const getClaimsFromToken = (token: string) => {
  const [, body] = token.split(".");
  try {
    return JSON.parse(atob(body));
  } catch {
    return undefined;
  }
};
