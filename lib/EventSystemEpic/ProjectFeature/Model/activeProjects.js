"use babel";
// @flow

import { List } from "immutable";
import type { State } from "../../../GlobalSystem/types.js";
import { removePackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RemovePackages";
import { refreshPackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RefreshPackages";
import type {
  Plugin,
  RefreshPackagesAction,
} from "../../../ProjectSystemEpic/PackageFeature/Types/types.js";
import type { RemovePackagesAction } from "../../../ProjectSystemEpic/PackageFeature/Actions/RemovePackages";
import { selectPlansReducer } from "../../../GlobalSystem/Selectors";
import { removePlanConfig } from "../../../ExecutionControlEpic/PlanConfigurationFeature/Actions/RemovePlanConfig";
import type { RemovePlanConfigAction } from "../../../ExecutionControlEpic/PlanConfigurationFeature/Actions/RemovePlanConfig";
import { selectAllPlans } from "../../../ExecutionControlEpic/PlanConfigurationFeature/Selectors/PlanConfigs";

export let activeProjects = List();

export const setActiveProjects = (projectsPath: Array<string>) =>
  (activeProjects = List(projectsPath));

export const handleProjectsChanges = (
  projectsPath: Array<string>,
  plugins: Array<Plugin>,
  state: State,
): List<
  RemovePackagesAction | RefreshPackagesAction | RemovePlanConfigAction,
> => {
  let actions = List();
  const plans = selectAllPlans(selectPlansReducer(state));
  // Look for deleted packages
  activeProjects.map(
    projectPath =>
      (actions = !projectsPath.find(path => path == projectPath)
        ? actions.push(removePackages(projectPath))
        : actions),
  );
  // Look for added packages
  projectsPath.map(
    projectPath =>
      (actions = !activeProjects.find(path => path == projectPath)
        ? actions.push(refreshPackages(projectPath, plugins))
        : actions),
  );
  setActiveProjects(projectsPath);
  // Reducing to add the removal of plans related to the packages
  return actions.reduce(
    (newActions, action) =>
      action.type === "REMOVE_PACKAGES"
        ? newActions.concat([
            action,
            ...plans
              .filter(
                plan => !(plan.packageInfo.path === action.payload.rootPath),
              )
              .map(plan => removePlanConfig(plan)),
          ])
        : newActions.push(action),
    List(),
  );
};
