"use babel";
// @flow

import { List } from "immutable";
import { removePackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RemovePackages";
import { refreshPackages } from "../../../ProjectSystemEpic/PackageFeature/Actions/RefreshPackages";
import type {
  Plugin,
  RefreshPackagesAction,
} from "../../../ProjectSystemEpic/PackageFeature/Types/types.js";
import type { RemovePackagesAction } from "../../../ProjectSystemEpic/PackageFeature/Actions/RemovePackages";

export let activeProjects = List();

export const setActiveProjects = (projectsPath: Array<string>) =>
  (activeProjects = List(projectsPath));

export const handleProjectsChanges = (
  projectsPath: Array<string>,
  plugins: Array<Plugin>,
): List<RemovePackagesAction | RefreshPackagesAction> => {
  let actions = List();
  activeProjects.map(
    projectPath =>
      (actions = !projectsPath.find(path => path == projectPath)
        ? actions.push(removePackages(projectPath))
        : actions),
  );
  projectsPath.map(
    projectPath =>
      (actions = !activeProjects.find(path => path == projectPath)
        ? actions.push(refreshPackages(projectPath, plugins))
        : actions),
  );
  setActiveProjects(projectsPath);
  return actions;
};
