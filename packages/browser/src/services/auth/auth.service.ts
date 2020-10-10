import { AuthenticationResult, InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { BehaviorSubject } from "rxjs";
import { loginRequest, msalClient, tokenRequest } from "./msal-client";

export type AuthState = "signed-in" | "signed-out" | "unknown";

export class AuthService {
  authTokenSubject = new BehaviorSubject<string | null>(null);
  authStateSubject = new BehaviorSubject<AuthState>("unknown");

  signIn() {
    msalClient.acquireTokenRedirect(loginRequest);
  }

  signOut() {
    msalClient.logout();
  }

  async handleRedirect() {
    try {
      const redirectResult = await msalClient.handleRedirectPromise();

      if (redirectResult !== null) {
        redirectResult.accessToken;
        const username = redirectResult.account.username;
        const tokenResult = await this.getToken(username);
        this.updateAuthState(tokenResult);
      } else {
        /**
         * See here for more info on account retrieval:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
        const currentAccounts = msalClient.getAllAccounts();
        if (currentAccounts === null || !currentAccounts.length) {
          this.authStateSubject.next("signed-out");
          return;
        } else if (currentAccounts.length > 1) {
          // Add choose account code here
          console.warn("Multiple accounts detected.");
          this.updateAuthState(null); // hack, when there are multiple, require sign-in
        } else if (currentAccounts.length === 1) {
          const username = currentAccounts[0].username;
          const tokenResult = await this.getToken(username);
          this.updateAuthState(tokenResult);
        }
      }
    } catch (error) {
      console.error(error);
      // TODO notify user;
    }
  }

  private updateAuthState(tokenResult: AuthenticationResult | null): void {
    if (tokenResult) {
      this.authStateSubject.next("signed-in");
      this.authTokenSubject.next(tokenResult.accessToken);
    } else {
      this.authStateSubject.next("signed-out");
    }
  }

  private async getToken(username: string) {
    // HACK: cast to any because request from official demo cannot satisfy typing requirement
    const request: SilentRequest = tokenRequest as any;
    request.account = msalClient.getAccountByUsername(username)!;

    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const authResult = await msalClient.acquireTokenSilent(request).catch((error) => {
      console.warn("silent token acquisition fails. acquiring token using redirect");
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        msalClient.acquireTokenRedirect(request);
        return null;
      } else {
        console.warn(error);
        return null;
      }
    });

    return authResult;
  }
}
