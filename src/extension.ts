import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

/**
 * Parses code into a Babel AST safely, depending on file language.
 */
function parseCode(text: string, languageId: string) {
  const plugins: parser.ParserPlugin[] = [
    "jsx",
    "classProperties",
    "optionalChaining",
    "nullishCoalescingOperator",
    "objectRestSpread",
    "decorators-legacy",
  ];
  if (languageId.includes("typescript")) {
    plugins.push("typescript");
  }
  return parser.parse(text, { sourceType: "module", plugins });
}

/**
 * Checks if a given CallExpression node is a console.* call.
 */
function isConsoleCall(node: t.CallExpression): boolean {
  const callee = node.callee;
  return (
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.object, { name: "console" })
  );
}

/**
 * Removes all console.* statements safely from source code.
 */
function removeConsolesFromText(text: string, lang = "javascript"): string {
  const ast = parseCode(text, lang);
  traverse(ast as any, {
    enter(p) {
      // Remove top-level statements like console.log('...')
      if (p.isExpressionStatement()) {
        const expr = p.node.expression;
        if (t.isCallExpression(expr) && isConsoleCall(expr)) {
          p.remove();
          return;
        }
      }

      // Replace inline calls like: x = console.log('...');
      if (p.isCallExpression() && isConsoleCall(p.node)) {
        p.replaceWith(t.identifier("undefined"));
      }

      // Clean sequences like: (console.log('a'), doSomething());
      if (p.isSequenceExpression()) {
        p.node.expressions = p.node.expressions.filter(
          (expr) => !(t.isCallExpression(expr) && isConsoleCall(expr))
        );
      }
    },
  });

  return generate(ast as any, { comments: true }).code;
}

/**
 * Processes a single file, removing all console statements.
 */
async function processFile(filePath: string) {
  const ext = path.extname(filePath);
  const lang = ext === ".ts" || ext === ".tsx" ? "typescript" : "javascript";
  const text = await fs.readFile(filePath, "utf8");
  const cleaned = removeConsolesFromText(text, lang);
  if (cleaned !== text) {
    await fs.writeFile(filePath, cleaned, "utf8");
  }
}

/**
 * Command: Remove console statements from the current active file.
 */
async function removeFromCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor found.");
    return;
  }

  const doc = editor.document;
  const text = doc.getText();
  const newText = removeConsolesFromText(text, doc.languageId);

  if (newText === text) {
    vscode.window.showInformationMessage(
      "No console statements found in this file."
    );
    return;
  }

  const fullRange = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(text.length)
  );

  await editor.edit((editBuilder) => editBuilder.replace(fullRange, newText));
  await doc.save();

  vscode.window.showInformationMessage(
    "Console statements removed from current file!"
  );
}

/**
 * Command: Remove console statements from all project files.
 */
async function removeFromWorkspace() {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showWarningMessage("No workspace folder open.");
    return;
  }

  const patterns = ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"];
  const uris: vscode.Uri[] = [];

  for (const pattern of patterns) {
    const found = await vscode.workspace.findFiles(
      pattern,
      "**/node_modules/**"
    );
    uris.push(...found);
  }

  if (uris.length === 0) {
    vscode.window.showInformationMessage("No JS/TS files found in workspace.");
    return;
  }

  const confirm = await vscode.window.showWarningMessage(
    `This will modify ${uris.length} files and remove all console statements. Continue?`,
    { modal: true },
    "Yes"
  );
  if (confirm !== "Yes") {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Removing console statements from workspace…",
      cancellable: false,
    },
    async (progress) => {
      let done = 0;
      for (const uri of uris) {
        try {
          await processFile(uri.fsPath);
        } catch (err) {
          console.error("Error processing file:", uri.fsPath, err);
        }
        done++;
        progress.report({
          message: `${done}/${uris.length} files processed`,
          increment: 100 / uris.length,
        });
      }
    }
  );

  vscode.window.showInformationMessage(
    "All console statements removed from workspace!"
  );
}

/**
 * Called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
  const removeCurrentCmd = vscode.commands.registerCommand(
    "consoleRemover.removeCurrentFile",
    removeFromCurrentFile
  );

  const removeWorkspaceCmd = vscode.commands.registerCommand(
    "consoleRemover.removeWorkspaceConsoles",
    removeFromWorkspace
  );

  context.subscriptions.push(removeCurrentCmd, removeWorkspaceCmd);

  console.log("Console Remover extension is active!");
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() {}
