import { filter } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { ProxyService } from "../proxy/proxy.service";
export interface Environment {
  url: string;
  username: string;
  password: string;
}

export class EnvironmentsService {
  constructor(private proxyService: ProxyService, private authService: AuthService) {
    this.authService.authTokenSubject.pipe(filter((token) => token !== null && token.length > 0)).subscribe(async (token) => {
      debugger;
      const environmentsOData = await this.proxyService.get(".netlify/functions/get-environments", token!);

      console.dir(environmentsOData);
    });
  }
}
