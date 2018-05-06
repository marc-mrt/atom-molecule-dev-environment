"use babel";
// @flow

import type { Point } from "../../../EventSystemEpic/EditorFeature/Types/editorEvents";
import { eventEmitter } from "./EventEmitter";
import type { CompletionParams } from "../Types/types";
import { Invoked, TriggerCharacter } from "../Types/types";
import Uri from "vscode-uri";

export default {
  selector: "*",
  disableForSelector: "",
  suggestionPriority: 2,
  filterSuggestions: true,

  getSuggestions(options: {
    editor: atom$TextEditor,
    bufferPosition: Point,
    scopeDescriptor: { scope: Array<string> },
    prefix: string,
    activedManually: boolean,
  }): Promise<boolean> | Array<string> {
    console.log("call completion", options);

    let uri = Uri.file(options.editor.getPath()).toString();

    if (uri == null) {
      console.log("Cannot provide completion for file", options.editor.getTitle(), uri);
      return [];
    }

    let params: CompletionParams = {
      context: {
        triggerKind:
          options.activedManually === true ? Invoked : TriggerCharacter,
      },
      position: {
        line: options.bufferPosition.row,
        character: options.bufferPosition.column,
      },
      textDocument: { uri: uri },
    };

    if (params.context.triggerKind === TriggerCharacter)
      Object.assign(params, {
        context: {
          triggerKind: TriggerCharacter,
          triggerCharacter: options.prefix,
        },
      });

    /*return new Promise((resolve): any => {
      resolve(eventEmitter.emit("textDocument/completion", params));
    });*/
    return [];
  },
};
