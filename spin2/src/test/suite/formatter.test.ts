import * as assert from 'assert';
import { error } from 'console';
import * as fs from 'fs';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as formatter_1 from '../../formatter';

suite('Indent Test Suite', async function () {
  vscode.window.showInformationMessage('Start all tests.');

  //#region properties

  const testDocument = '{Object_Title_and_Purpose}' + '\n' +
    'CON' + '\n' +
    'CONSTANT_NAME = 0';

  const formatter = new formatter_1.Formatter();

  //#endregion

  //#region Indent tab stop test

  const tests = [
    {
      include: true,
      anchorLine: 0,
      anchorCharacter: 0,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(0) + 'CONSTANT_NAME = 0',
      expectedContent: '    {Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(0) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 0,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(0) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(2) + '    CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 1,
      anchorCharacter: 4,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON     CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 2,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(2) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(2) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 8,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(2) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(8) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 16,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(8) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(16) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 18,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(16) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(18) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 32,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(18) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(32) + 'CONSTANT_NAME = 0',
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 56,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(32) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(56) + 'CONSTANT_NAME = 0'
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 80,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(56) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(80) + 'CONSTANT_NAME = 0'
    },
    {
      include: true,
      anchorLine: 2,
      anchorCharacter: 104,
      activeLine: null,
      activeCharacter: null,
      originalContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(80) + 'CONSTANT_NAME = 0',
      expectedContent: '{Object_Title_and_Purpose}' + '\n' +
        'CON' + '\n' +
        tab(104) + 'CONSTANT_NAME = 0'
    },
  ];

  await Promise.all(tests.filter(test => test.include).map(async function ({ anchorLine, anchorCharacter, activeLine, activeCharacter, originalContent, expectedContent }) {
    test(`Indent tab stop, cursor: [${anchorLine}, ${anchorCharacter}] test`, async function () {
      this.timeout(6000);
      //console.log(`\n${'-'.repeat(80)}\nanchor: [${anchorLine}, ${anchorCharacter}], active: [${activeLine ?? anchorLine}, ${activeCharacter ?? anchorCharacter}]\noriginalContent: ${originalContent}, \nexpectedContent: ${expectedContent}\n`);
      // arrange
      const document = await vscode.workspace.openTextDocument({ content: originalContent });
      const selection = new vscode.Selection(anchorLine, anchorCharacter, activeLine ?? anchorLine, activeCharacter ?? anchorCharacter);
      const selections = new Array<vscode.Selection>();

      // act
      const edits = await formatter.indentTabStop(document, selection, selections);

      //console.log(edits);

      if (edits) {
        const workEdits = new vscode.WorkspaceEdit();
        workEdits.set(document.uri, edits); // give the edits
        await vscode.workspace.applyEdit(workEdits); // apply the edits
      };
      const updatedDocument = await vscode.workspace.openTextDocument(document.uri);
      const updatedContent = updatedDocument.getText();

      //console.log(`\n${'-'.repeat(80)}\nanchor: [${anchorLine}, ${anchorCharacter}], active: [${activeLine}, ${activeCharacter}]\noriginalContent: ${originalContent}, \nupdatedContent : ${updatedContent}\nexpectedContent: ${expectedContent}\n`);

      // assert
      assert.strictEqual(updatedContent, expectedContent);
    });
  }));

  //#endregion

  //#region Outdent tab stop test

  test('Outdent tab stop test', async function () {
    this.timeout(500);

    // arrange
    const document = await vscode.workspace.openTextDocument({ content: testDocument });
    const selection = new vscode.Selection(1, 2, 3, 4);
    const selections = new Array<vscode.Selection>();

    // act
    const edits = await formatter.outdentTabStop(document, selection, selections);

    // assert
    assert.strictEqual(edits?.length, 1);
  });

  //#endregion

});

function tab(character: number): string {
  return ' '.repeat(character);
}
