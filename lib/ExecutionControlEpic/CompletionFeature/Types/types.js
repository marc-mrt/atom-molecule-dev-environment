"use babel";
// @flow

import type { TextDocumentPositionParams } from "../../LanguageServerProtocolFeature/Types/standard";

export interface CompletionParams extends TextDocumentPositionParams {
  /**
   * The completion context. This is only available it the client specifies
   * to send this using `ClientCapabilities.textDocument.completion.contextSupport === true`
   */
  context?: CompletionContext;
}

/**
 * Completion was triggered by typing an identifier (24x7 code
 * complete), manual invocation (e.g Ctrl+Space) or via API.
 */
export const Invoked = 1;

/**
 * Completion was triggered by a trigger character specified by
 * the `triggerCharacters` properties of the `CompletionRegistrationOptions`.
 */
export const TriggerCharacter = 2;

/**
 * Completion was re-triggered as the current completion list is incomplete.
 */
export const TriggerForIncompleteCompletions = 3;

export type CompletionTriggerKind =
  | typeof Invoked
  | typeof TriggerCharacter
  | typeof TriggerForIncompleteCompletions;

/**
 * Contains additional information about the context in which a completion request is triggered.
 */
export interface CompletionContext {
  /**
   * How the completion was triggered.
   */
  triggerKind: CompletionTriggerKind;

  /**
   * The trigger character (a single character) that has trigger code complete.
   * Is undefined if `triggerKind !== CompletionTriggerKind.TriggerCharacter`
   */
  triggerCharacter?: string;
}
