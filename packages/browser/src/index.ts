import { AuthService } from "./services/auth-service";
import { di } from "./utils/di";
import "./components/app-root/app-root.component";

debugger;

console.log("started");

di.registerClass(AuthService, []);
