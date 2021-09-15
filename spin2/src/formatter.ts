// https://typescript.hotexamples.com/examples/vscode/window/createTextEditorDecorationType/typescript-window-createtexteditordecorationtype-method-examples.html

import * as vscode from 'vscode';

/**
 * A section of P2 code that has source code setting
 */
export interface Block {
  tabStops: number[];
}

/**
 * A list of Block config sections
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
 * Code used to provide custom formatting for spin2 code
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
  // Editor Completion"editor.tabCompletion": "on",
  // Editor Use Tab Stops "editor.useTabStops": false
  // Editor Sticky Tab Stops "editor.stickyTabStops": true
  // Editor Insert Spaces "editor.insertSpaces": false,
  // Editor Detect Indentation "editor.detectIndentation": fals

  private getTabStopRange(blockName: string, character: number): [number, number] {
    if (!blockName) {
      blockName = 'con';
    }
    const block = this.blocks[blockName.toLowerCase()];

    const stops = block.tabStops ?? [this.tabSize];
    const tabStops = stops?.sort((a, b) => { return a - b; });

    const index = tabStops?.findIndex((element) => element > character);
    if (index === -1) {
      return [0, this.tabSize!];
    }

    const startTabstop = tabStops[index - 1] ?? 0;
    const endTabstop = tabStops[index];
    return [startTabstop, endTabstop];
  }

  private getBlockName(document: vscode.TextDocument, selection: vscode.Selection): string {
    for (let lineIndex = selection.active.line; lineIndex >= 0; lineIndex--) {
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
   */
  indentTabStop(document: vscode.TextDocument, selection: vscode.Selection, selections: vscode.Selection[]): vscode.ProviderResult<vscode.TextEdit[]> {
    const block = this.getBlockName(document, selection);
    const tabStopRange = this.getTabStopRange(block, selection.active.character);
    console.log(`indentTabStop(tabStops: [${tabStopRange[0]}, ${tabStopRange[1]}] ${selection.active.character})`);

    const charactersToInsert = ' '.repeat(tabStopRange[1] - selection.active.character);

    //console.log(`\nanchor [${selection.anchor.line}, ${selection.anchor.character}], active: [${selection.active.line}, ${selection.active.character}], block: ${block}`);
    if (selection.isEmpty) {
      return [
        vscode.TextEdit.insert(selection.active, charactersToInsert)
      ];
    } else {
      return [
        vscode.TextEdit.replace(selection, charactersToInsert)
      ];
    }
  };

  /**
   * outdent tab stop
   */
  outdentTabStop(document: vscode.TextDocument, selection: vscode.Selection, selections: vscode.Selection[]): vscode.ProviderResult<vscode.TextEdit[]> {
    //console.log(`document: ${document}, selection: ${selection}, selection: ${selections}`);
    return [
      vscode.TextEdit.delete(selection)
    ];
  };

};