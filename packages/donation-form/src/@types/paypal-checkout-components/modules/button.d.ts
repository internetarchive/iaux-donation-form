import { Environment, ButtonStyle } from './configuration';

import { AuthorizationData, AuthorizationTokenizePayload, CancellationData } from './callback-data';

export enum FUNDING {
  CREDIT,
  CARD,
  VENMO,
  ELV,
}

export interface ButtonRenderOptions {
  env?: Environment;
  style?: ButtonStyle;
  locale?: string;

  payment?: () => Promise<string>;
  onAuthorize: (data: AuthorizationData, actions: object) => Promise<AuthorizationTokenizePayload>;
  onCancel?: (data: CancellationData, actions: object) => void;
  onError?: (error: string) => void;
  onShippingChange?: () => void;
  onAuth?: (data: string | object) => object;
  accessToken?: () => void;
  onClose?: () => void;

  funding?: {
    allowed?: FUNDING[];
    disallowed?: FUNDING[];
  };

  sessionID?: string;
  buttonSessionID?: string;
  meta?: object;
  stage?: string;
  stageUrl?: string;
  authCode?: string;
  localhostUrl?: string;
  checkoutUri?: string;
  client?: object;
  commit?: boolean;
  experience?: object;
  fundingSource?: string;
  fundingOffered?: object;
  logLevel?: string;
  test?: object;
}

export interface ButtonRenderer {
  render(options: ButtonRenderOptions, selector: string): void;
}
