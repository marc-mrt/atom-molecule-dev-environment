"use babel";
// @flow

import Rx from "rxjs";
import { List, Map } from "immutable";
import { removePackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RemovePackages";
import { refreshPackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RefreshPackages";
import { selectPlansReducer } from "../../../GlobalSystem/Selectors";
import { removePlanConfig } from "../../../ExecutionControlEpic/PlanConfigurationFeature/Actions/RemovePlanConfig";
import { selectAllPlans } from "../../../ExecutionControlEpic/PlanConfigurationFeature/Selectors/PlanConfigs";
import { selectProjectsReducer } from "../../../GlobalSystem/Selectors";
import { setActiveProjects } from "../Actions/SetActiveProjects";
import { DevToolsControllerInstance } from "../../../ExecutionControlEpic/DevtoolLoadingFeature/Model/DevToolsController";
import { apiPresets } from "../../FileFeature/Model/apiPresets";
import { createFilesWatcherObservable } from "../../FileFeature/Model/createFilesWatcherObservable";
import type { WatchMan } from "../../FileFeature/Types/types.js";

export const generateProjectsFilesObs = (
  watchman: WatchMan,
  path: string,
  dispatchAction: (action?: any) => void,
) =>
  createFilesWatcherObservable(watchman, path, apiPresets.any, true)
    .map(events => events.filter(event => event.action === "created"))
    // .map(event =>
    //   refreshPackages(
    //     path.concat("/", event.path),
    //     DevToolsControllerInstance.getPackagesPlugins(),
    //   ),
    // );
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

const removePackagesFromDeletedProjects = (
  newProjects: Array<string>,
  activeProjects: Map<string, any>,
) =>
  activeProjects.reduce(
    (acc, obs, projectPath) =>
      newProjects.find(path => path === projectPath)
        ? acc
        : acc.push(removePackages(projectPath)),
    List(),
  );

const refreshPackagesFromAddedProjects = (
  newProjects: Array<string>,
  activeProjects: Map<string, any>,
) =>
  newProjects.reduce(
    (acc, projectPath) =>
      activeProjects.find(path => path == projectPath)
        ? acc
        : acc.push(
            refreshPackages(
              projectPath,
              DevToolsControllerInstance.getPackagesPlugins(),
            ),
          ),
    List(),
  );

const unsubscribeFromDeletedProjects = (
  newProjects: Array<string>,
  activeProjects: Map<string, any>,
) =>
  activeProjects.reduce((acc, cur, rootPath) => {
    newProjects.find(test => test === rootPath)
      ? (acc = acc.set(rootPath, cur))
      : cur.unsubscribe();
    return acc;
  }, Map());

const changeProjectsEpic = (watchman: WatchMan) => (action$: any, store: any) =>
  action$
    .ofType("CHANGE_ACTIVE_PROJECTS")
    .map(action => {
      const activeProjects = selectProjectsReducer(store.getState());
      const plans = selectAllPlans(selectPlansReducer(store.getState()));
      let newActiveProjects = Map();
      let actions = List();

      if (!action.payload.isInit) {
        // Look for deleted packages
        actions = List([
          ...removePackagesFromDeletedProjects(
            action.payload.projects,
            activeProjects,
          ),
          ...refreshPackagesFromAddedProjects(
            action.payload.projects,
            activeProjects,
          ),
        ]);
        // Unsubscribe to the deleted projects
        newActiveProjects = unsubscribeFromDeletedProjects(
          action.payload.projects,
          activeProjects,
        );
      }
      // Look for added packages
      action.payload.projects.map(projectPath => {
        // Generate observable for new projects
        newActiveProjects = newActiveProjects.has(projectPath)
          ? newActiveProjects
          : newActiveProjects.set(
              projectPath,
              generateProjectsFilesObs(watchman, projectPath, store.dispatch),
            );
      });
      actions = actions.push(setActiveProjects(newActiveProjects));
      // Reducing to add the removal of plans related to the packages
      return Rx.Observable.merge(
        Rx.Observable.from(
          actions.reduce(
            (newActions: List<any>, cur: any) =>
              cur.type === "REMOVE_PACKAGES"
                ? newActions.concat([
                    cur,
                    ...plans
                      .filter(
                        plan => plan.packageInfo.path === cur.payload.rootPath,
                      )
                      .map(plan => removePlanConfig(plan)),
                  ])
                : newActions.push(cur),
            List(),
          ),
        ),
        // Rx.Observable.from(newActiveProjects.toList()).mergeAll(),
      );
    })
    .mergeAll();

export default changeProjectsEpic;
