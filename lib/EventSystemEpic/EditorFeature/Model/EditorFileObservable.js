"use babel";
// @flow

import Rx from "rxjs";
import type {
  AtomEditorOpenEvent,
  AtomEditorSaveEvent,
  AtomEditorChangeEvent,
} from "../Types/editorEvents";
import Uri from "vscode-uri";

export const EditorFileObservable = Rx.Observable.create(observer => {
  function getEditorObservable(editor) {
    return Rx.Observable.create(observer => {
      const disposables = [
        editor.onDidSave((event: AtomEditorSaveEvent) =>
          observer.next({
            type: "didSave",
            path: Uri.file(editor.getPath()).toString(),
            event,
          }),
        ),
        editor.onDidStopChanging((event: AtomEditorChangeEvent) =>
          observer.next({
            type: "didChange",
            path: Uri.file(editor.getPath()).toString(),
            event,
          }),
        ),
        editor.onDidDestroy(() =>
          observer.next({
            type: "didClose",
            path: Uri.file(editor.getPath()).toString(),
            event: {},
          }),
        ),
      ];
      return function unsubscribe() {
        disposables.forEach(disp => disp.dispose());
      };
    });
  }
  global.atom.workspace.onDidAddTextEditor((event: AtomEditorOpenEvent) => {
    observer.next(getEditorObservable(event.textEditor));
    observer.next(
      Rx.Observable.of({
        type: "didOpen",
        path: event.textUri.file(editor.getPath()).toString(),
        event,
      }),
    );
  });
  global.atom.workspace.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      observer.next(getEditorObservable(editor));
      observer.next(
        Rx.Observable.of({
          type: "didOpen",
          path: Uri.file(editor.getPath()).toString(),
          event: {
            textEditor: editor,
          },
        }),
      );
    }
  });
  global.atom.workspace.getTextEditors().forEach(editor => {
    if (editor) {
      observer.next(getEditorObservable(editor));
      observer.next(
        Rx.Observable.of({
          type: "didOpen",
          path: Uri.file(editor.getPath()).toString(),
          event: {
            textEditor: editor,
          },
        }),
      );
    }
  });
}).mergeAll();
