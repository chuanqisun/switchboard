import { AuthService } from "./services/auth/auth.service";
import { di } from "./utils/di";
import { AppRootComponent } from "./components/app-root/app-root.component";
import { AccountInfoComponent } from "./components/account-info/account-info.component";
import { EnvironmentListComponent } from "./components/environment-list/environment-list.component";
import { EnvironmentsService } from "./services/environments/environments.service";
import { GraphService } from "./services/graph/graph.service";

di.registerClass(AuthService, []);
di.registerClass(GraphService, []);
di.registerClass(EnvironmentsService, [GraphService, AuthService]);

customElements.define("app-root", AppRootComponent);
customElements.define("account-info", AccountInfoComponent);
customElements.define("environment-list", EnvironmentListComponent);

// start application
di.getSingleton(AuthService).handleRedirect();
