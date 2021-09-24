// https://typescript.hotexamples.com/examples/vscode/window/createTextEditorDecorationType/typescript-window-createtexteditordecorationtype-method-examples.html

import * as vscode from 'vscode';

/**
 * 
 */
export interface Block {
  tabStops: number[];
}

/**
 * 
 */
export interface Blocks {

  con: Block;
  var: Block;
  obj: Block;
  pub: Block;
  pri: Block;
  dat: Block;

  [block: string]: Block;

}

/**
 * 
 */
export class Formatter {

  readonly config = vscode.workspace.getConfiguration();
  readonly blocks = this.config.get<Blocks>('spin2ElasticTabstops.blocks')!;
  readonly blocksConfig = this.config.inspect<Blocks>('spin2ElasticTabstops.blocks');

  readonly tabSize = this.config.get<number>('editor.tabSize');
  readonly useTabStops = this.config.get<number>('editor.useTabStops');

  readonly enable = this.config.get<boolean>('spin2ElasticTabstops.enable');
  readonly timeout = this.config.get<number>('spin2ElasticTabstops.timeout');
  readonly maxLineCount = this.config.get<number>('spin2ElasticTabstops.maxLineCount');
  readonly maxLineLength = this.config.get<number>('spin2ElasticTabstops.maxLineLength');

  readonly blockIdentifier = /^(?<block>(con|var|obj|pub|pri|dat))\b/i;

  constructor() {

  }

  // Editor Tab Size - "editor.tabSize"
  // Editor Completion - "editor.tabCompletion": "on",
  // Editor Use Tab Stops - "editor.useTabStops": false
  // Editor Sticky Tab Stops - "editor.stickyTabStops": true
  // Editor Insert Spaces - "editor.insertSpaces": false,
  // Editor Detect Indentation "editor.detectIndentation": fals

  /**
   * get the tab stop range
   * @param blockName 
   * @param character 
   * @returns 
   */
  private getTabStopRange(blockName: string, character: number): [number, number] {
    if (!blockName) {
      blockName = 'con';
    }
    const block = this.blocks[blockName.toLowerCase()];

    const stops = block.tabStops ?? [this.tabSize];
    const tabStops = stops?.sort((a, b) => { return a - b; });

    let index: number;
    while ((index = tabStops?.findIndex((element) => element > character)) === -1) {
      const lastTabStop = tabStops[tabStops.length - 1];
      const lastTabStop2 = tabStops[tabStops.length - 2];
      const lenghtTabStop = lastTabStop - lastTabStop2;
      tabStops.push(lastTabStop + lenghtTabStop);
    }
    const startTabstop = tabStops[index - 1] ?? 0;
    const endTabstop = tabStops[index];
    return [startTabstop, endTabstop];
  }

  /**
   * get the name of the current block/section
   * 
   * @param document 
   * @param selection 
   * @returns 
   */
  private getBlockName(document: vscode.TextDocument, selection: vscode.Selection): string {
    for (let lineIndex = selection.active.line - 1; lineIndex >= 0; lineIndex--) {
      const line = document.lineAt(lineIndex);
      const match = line.text.match(this.blockIdentifier);
      if (match) {
        return match.groups?.block ?? '';
      }
    }
    return '';
  }

  /**
   * indent tab stop
   * 
   * @param document A text document.
   * @return A list of text edit objects.
   */
  indentTabStop(document: vscode.TextDocument, selections: vscode.Selection[]): vscode.ProviderResult<vscode.TextEdit[]> {
    return selections.map(selection => {
      const block = this.getBlockName(document, selection);
      const [startTabStopRange, endTabStopRange] = this.getTabStopRange(block, selection.active.character);

      const charactersToInsert = ' '.repeat(Math.abs(endTabStopRange - selection.active.character));

      if (selection.isEmpty) {
        return [
          vscode.TextEdit.insert(selection.active, charactersToInsert)
        ];
      } else {
        return [
          vscode.TextEdit.replace(selection, charactersToInsert)
        ];
      }
    }).reduce((selections, selection) => selections.concat(selection), []);

  };

  /**
   * outdent tab stop
   *
   * @param document A text document.
   * @return A list of text edit objects.
   */
  outdentTabStop(document: vscode.TextDocument, selections: vscode.Selection[]): vscode.ProviderResult<vscode.TextEdit[]> {
    return selections.map(selection => {
      const block = this.getBlockName(document, selection);
      const [startTabStopRange, endTabStopRange] = this.getTabStopRange(block, selection.active.character);

      const start = selection.start.with({ character: startTabStopRange });

      const range = selection.with({ start: start })
      console.log(`delete([${range.start.line}-${range.start.character}] [${range.end.line}-${range.end.character}] tabStopRange from: ${startTabStopRange} to: ${endTabStopRange}])`);
      return [
        vscode.TextEdit.delete(range)
      ];
    }).reduce((selections, selection) => selections.concat(selection), []);
  };

};
