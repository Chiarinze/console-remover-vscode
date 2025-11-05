# 🧹 Console Remover for VS Code

**Console Remover** is a lightweight VS Code extension that automatically removes every `console.*` statement from your JavaScript, TypeScript, and React files — either from the **current file** or from your **entire workspace** in one click.

---

## ✨ Features

- 🧹 **Remove console statements**  
  Deletes `console.log`, `console.warn`, `console.error`, `console.info`, and `console.debug` calls.

- ⚙️ **Two cleanup modes**

  - Current file only
  - Entire workspace (all `.js`, `.jsx`, `.ts`, `.tsx` files)

- 🧠 **AST-based removal**  
  Uses Babel's parser — not regex — so your code structure, comments, and formatting stay safe.

- 🪶 **Multi-language support**  
  Works with JavaScript, TypeScript, JSX, and TSX.

- 💬 **Comments preserved**

- 🚫 **No default keybindings**  
  Avoids system shortcut conflicts. Users can set their own keyboard shortcuts.

---

## 🪄 Commands

| Command                                                    | Description                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Console Remover: Remove consoles from current file**     | Scans and removes all console statements in the active editor file.                       |
| **Console Remover: Remove consoles from entire workspace** | Finds and cleans all console statements across your workspace (excluding `node_modules`). |

Run them from the **Command Palette** (`Ctrl + Shift + P`) and type **Console Remover**.

---

## 🎹 Keyboard Shortcuts (User Configurable)

By default, Console Remover does **not** include any pre-set shortcuts.

To add your own:

1. Open **Keyboard Shortcuts** (`Ctrl + K Ctrl + S`)
2. Search for _Console Remover_
3. Assign keys for the commands, for example:

```json
{
  "key": "ctrl+shift+c",
  "command": "consoleRemover.removeCurrentFile",
  "when": "editorTextFocus"
},
{
  "key": "ctrl+shift+alt+c",
  "command": "consoleRemover.removeWorkspaceConsoles",
  "when": "editorTextFocus"
}
```

---

## 🧪 Usage

### Clean the current file

1. Open any `.js`, `.ts`, `.jsx`, or `.tsx` file.
2. Run **Console Remover: Remove consoles from current file** from the Command Palette (or your configured shortcut).
3. Console statements are removed and the file is saved automatically.

### Clean the whole workspace

1. Open your project folder in VS Code.
2. Run **Console Remover: Remove consoles from entire workspace**.
3. Confirm the modal prompt (the command shows the number of files to be changed).
4. A progress notification appears while files are processed. All modified files are saved.

> **Important:** Workspace cleanup modifies files in place. Commit or back up your work before running a workspace cleanup.

---

## ⚙️ Installation

### From a `.vsix` file

1. Build and package your extension (see [Packaging](#-packaging)).
2. In VS Code, open the **Extensions** view (`Ctrl+Shift+X`).
3. Click the **⋮** menu → **Install from VSIX...** and select the `.vsix` file.

### From Open VSX / Marketplace

Once published, search for **Console Remover** in the Extensions view and install it normally.

---

## 🧱 Development

### Prerequisites

- Node.js 16 or newer
- npm

### Steps

```bash
git clone https://github.com/Chiarinze/console-remover-vscode.git
cd console-remover-vscode
npm install
npm run compile
```

- Press `F5` in VS Code to open an Extension Development Host for testing.
- Make code changes in `src/` and re-run `npm run compile` or enable webpack `--watch`.

---

## 📦 Packaging

To create a distributable `.vsix` file:

```bash
npm run compile
npx @vscode/vsce package
# or, if vsce is installed globally:
# vsce package
```

This produces a file like:

```
console-remover-vscode-1.0.0.vsix
```

You can share or install this file manually.

---

## 🌍 Publishing

### Open VSX (Free & Recommended)

1. Create an account or namespace at [open-vsx.org](https://open-vsx.org) (sign in with GitHub).
2. Install the **ovsx** CLI:
   ```bash
   npm install -g ovsx
   ```
3. Publish your extension:
   ```bash
   npx ovsx publish ./console-remover-vscode-1.0.0.vsix --pat <YOUR_OPENVSX_TOKEN>
   ```

### Visual Studio Marketplace

1. Create a publisher at [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage).
2. Generate a Personal Access Token (PAT) in your Microsoft / Azure DevOps account.
3. Publish via:
   ```bash
   vsce publish
   ```

---

## 🧩 Supported File Types

| File Type             | Extensions    | Supported  |
| --------------------- | ------------- | ---------- |
| JavaScript            | `.js`, `.jsx` | ✅         |
| TypeScript            | `.ts`, `.tsx` | ✅         |
| JSON, HTML, CSS, etc. | —             | 🚫 Ignored |

---

## ⚠️ Limitations & Notes

- Only removes direct `console.*()` calls (e.g., `console.log()`, `console.error()`, etc.).

- Dynamic or aliased calls such as:

  ```js
  const log = console.log;
  log("test");
  ```

  are not removed intentionally.

- Always commit or back up your workspace before running workspace-wide removal.

---

## 📚 Contributing

Contributions and pull requests are welcome!  
If you'd like to suggest features or report bugs, please open an issue on [GitHub](https://github.com/Chiarinze/console-remover-vscode.git).

---

## 🪪 License

MIT © 2025 [Chiarinze](https://github.com/Chiarinze)
