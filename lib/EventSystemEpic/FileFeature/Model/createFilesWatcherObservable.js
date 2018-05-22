"use babel";
// @flow

import Rx from "rxjs";
import { makeSubscription } from "./watchmanSubscriptions.js";
import type { WatchExpression, WatchMan } from "../Types/types";

export const createFilesWatcherObservable = (
  watchman: WatchMan,
  path: string,
  expression: WatchExpression,
  ignoreInitialEvents?: boolean = false,
) =>
  Rx.Observable.create(observer => {
    const client = new watchman.Client();
    client.on("error", error => {
      observer.error(error);
    });
    client.capabilityCheck(
      { optional: [], required: ["relative_root"] },
      error => {
        if (error) {
          client.end();
          observer.error(error);
          return;
        }
        client.command(["watch-project", path], (error, resp) => {
          if (error) {
            observer.error(error);
            return;
          }
          const data = { watch: resp.watch, path: resp.relative_path };
          makeSubscription(
            client,
            data,
            observer,
            expression,
            ignoreInitialEvents,
          );
        });
      },
    );
    return () => {
      client.end();
    };
  });
