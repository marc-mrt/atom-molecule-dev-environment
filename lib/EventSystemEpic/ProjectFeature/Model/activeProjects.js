"use babel";
// @flow

import { List, Map } from "immutable";
import watchman from "fb-watchman";
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
import { apiPresets } from "../../FileFeature/Model/apiPresets";
import { createFilesWatcherObservable } from "../../FileFeature/Model/createFilesWatcherObservable";
import { DevToolsControllerInstance } from "../../../ExecutionControlEpic/DevtoolLoadingFeature/Model/DevToolsController";

let dispatchAction: (action: any) => void;

export const initProjectFeature = (
  dispatch: Function,
  projectsPath: Array<string>,
) => {
  dispatchAction = dispatch;
  setActiveProjects(projectsPath);
};

export let activeProjects = List();
export let projectsFilesObservables: Map<string, any> = Map();

export const setActiveProjects = (projectsPath: Array<string>) => {
  activeProjects = List(projectsPath);
  handleProjectsFilesObs(projectsPath);
};

export const handleProjectsFilesObs = (projectPaths: Array<string>) => {
  // delete observables that are no longer in Atom
  projectsFilesObservables = projectsFilesObservables.reduce(
    (acc, obs, rootPath) => {
      projectPaths.find(test => test === rootPath)
        ? (acc = acc.set(rootPath, obs))
        : obs.unsubscribe();
      return acc;
    },
    Map(),
  );
  // adding the missing projects observables
  projectPaths.map(
    path =>
      (projectsFilesObservables = projectsFilesObservables.has(path)
        ? projectsFilesObservables
        : projectsFilesObservables.set(path, generateProjectsFilesObs(path))),
  );
};

export const generateProjectsFilesObs = (path: string) =>
  createFilesWatcherObservable(watchman, path, apiPresets.any, true)
    .map(events => events.filter(event => event.action === "created"))
    .subscribe(events =>
      events.map(event =>
        dispatchAction(
          refreshPackages(
            path.concat("/", event.path),
            DevToolsControllerInstance.getPackagesPlugins(),
          ),
        ),
      ),
    );

export const killProjectsFilesObservables = () =>
  projectsFilesObservables.map(obs => obs.unsubscribe());

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
