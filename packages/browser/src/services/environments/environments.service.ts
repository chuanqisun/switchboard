import { BehaviorSubject } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { GraphService } from "../graph/graph.service";
export interface Environment {
  url: string;
  username: string;
  password: string;
}

export class EnvironmentsService {
  constructor(private graphService: GraphService, private authService: AuthService) {
    this.authService.authTokenSubject.pipe(filter((token) => token !== null && token.length > 0)).subscribe(async (token) => {
      const environmentsOData = await this.graphService.get(
        "https://graph.microsoft.com/v1.0/groups/da3b2d71-1ea2-48e2-af0e-cc54e80c1a85/drive/root:/General/Environments/environments-v2.txt",
        token!
      );

      console.dir(environmentsOData);
    });
  }
}
