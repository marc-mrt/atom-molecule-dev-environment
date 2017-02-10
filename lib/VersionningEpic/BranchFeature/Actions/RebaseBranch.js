'use babel'
// @flow

import type {PackageInfos} from '../../../ProjectSystemEpic/PackageFeature/Types/types.js.flow';
import path from 'path';
import {exec} from 'child_process';

export type RebaseBranchAction = (dispatch: (action: any) => void) => void;

export function rebaseBranch(branch: string, packageInfos: PackageInfos): RebaseBranchAction {
  return dispatch => {
    let child = exec(
      `git rebase ${branch}`,
      {cwd: path.dirname(packageInfos.path)},
      (err, stdout, stderr) => {
        if (err) {
          atom.notifications.addError(`Impossible to rebase on ${branch}`, {
            detail: stderr + '\n' + err.toString()
          });
        } else {
          atom.notifications.addSuccess(`Rebased on ${branch}`, {
            detail: stdout
          });
        }
      }
    );
  };
};