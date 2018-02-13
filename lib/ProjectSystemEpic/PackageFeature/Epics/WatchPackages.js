"use babel";
// @flow

import { removePackages } from "../Actions/RemovePackages";
import { refreshPackages } from "../Actions/RefreshPackages";
import { apiPresets } from "../../../EventSystemEpic/FileFeature/Model/apiPresets";
import { createFilesWatcherObservable } from "../../../EventSystemEpic/FileFeature/Model/createFilesWatcherObservable";
import type { WatchMan } from "../../../EventSystemEpic/FileFeature/Types/types.js";

const watchPackagesEpic = (watchman: WatchMan) => (action$: any) =>
  action$
    .ofType("PACKAGES_REFRESHED")
    .map(action =>
      action.payload.packages.map(pkg =>
        createFilesWatcherObservable(
          watchman,
          action.payload.rootPath,
          apiPresets.any,
          true,
        ).map(events =>
          events
            .map(event => {
              const fullPackagePath = action.payload.rootPath.concat(
                "/",
                event.path,
              );
              if (
                fullPackagePath === pkg.path &&
                (event.action === "modified" || event.action === "created")
              )
                return refreshPackages(
                  action.payload.rootPath,
                  pkg.plugin ? [pkg.plugin] : [],
                );
              else if (
                fullPackagePath === pkg.path &&
                event.action === "deleted"
              )
                return removePackages(pkg.path);
              return "none";
            })
            .filter(test => test !== "none"),
        ),
      ),
    )
    .mergeAll()
    .mergeAll()
    .mergeAll();

export default watchPackagesEpic;
