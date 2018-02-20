"use babel";
// @flow

import { List } from "immutable";
import { removePackages } from "../Actions/RemovePackages";
import { refreshPackages } from "../Actions/RefreshPackages";
import { apiPresets } from "../../../EventSystemEpic/FileFeature/Model/apiPresets";
import { createFilesWatcherObservable } from "../../../EventSystemEpic/FileFeature/Model/createFilesWatcherObservable";
import { selectPackagesOfTool } from "../Selectors/Packages";
import { selectPackagesReducer } from "../../../GlobalSystem/Selectors";
import type { WatchMan } from "../../../EventSystemEpic/FileFeature/Types/types.js";

const watchPackagesEpic = (watchman: WatchMan) => (action$: any, store: any) =>
  action$
    .ofType("PACKAGES_REFRESHED")
    .filter(action => action.payload.packages.length > 0)
    .map(action =>
      createFilesWatcherObservable(
        watchman,
        action.payload.packages[0].isFile
          ? action.payload.rootPath.slice(
              0,
              action.payload.rootPath.lastIndexOf(
                action.payload.packages[0].uriPlatform === "windows"
                  ? "\\"
                  : "/",
              ),
            )
          : action.payload.rootPath,
        apiPresets.any,
        true,
      )
        .map(events =>
          events
            .map(event => {
              const fullPackagePath = action.payload.packages[0].isFile
                ? action.payload.rootPath.endsWith(event.path)
                  ? action.payload.rootPath
                  : "NONE"
                : action.payload.rootPath.concat(
                    action.payload.packages[0].uriPlatform === "windows"
                      ? "\\"
                      : "/",
                    event.path,
                  );
              const foundPackage = action.payload.packages.find(
                pkg => pkg.path === fullPackagePath,
              );
              if (foundPackage) {
                if (event.action === "modified" || event.action === "created")
                  return refreshPackages(
                    action.payload.rootPath,
                    foundPackage.plugin ? [foundPackage.plugin] : [],
                  );
                else if (event.action === "deleted")
                  return removePackages(foundPackage.path);
              } else return "none";
            })
            .filter(test => test !== "none"),
        )
        .takeWhile(
          () =>
            action.payload.packages.reduce(
              (acc, cur) =>
                selectPackagesOfTool(
                  selectPackagesReducer(store.getState()),
                  cur.plugin.tool.id,
                ).size > 0
                  ? acc.push(cur)
                  : acc,
              List(),
            ).size > 0,
        ),
    )
    .mergeAll()
    .mergeAll();

export default watchPackagesEpic;
