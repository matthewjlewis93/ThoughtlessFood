import { userInfo } from "../config/userInfoMiddleware";
import { getSettings, updateSettings } from "../controllers/settings.controller";

const settingsRouter = express.Router();
settingsRouter.use(userInfo);

settingsRouter.get("/", getSettings);

settingsRouter.patch("/:id", updateSettings);

export default settingsRouter;