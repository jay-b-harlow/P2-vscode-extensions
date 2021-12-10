# Manual installation

>This is a [Visual Studio Code](https://code.visualstudio.com/download) extension. It is best installed from the [on-line extensions marketplace](https://marketplace.visualstudio.com/items?itemName=ironsheep.spin2), or from inside VS Code `Preferences/Extensions` and search for `spin2`.

_Alternatively_, you might have downloaded a .vsix file from our forums. This can be installed from the command line as shown in the next section. 

_Lastly_, the extension can be built and installed manually by following the steps in section entitled "Build the extension". This should only be required for developers.

## Install the extension (.vsix file)

You can manually install the extension in VS Code (replace the '?' wildcards in the version number)

```bash
code --install-extension spin2-?.?.?.vsix
```

## Build the extension

**NOTE**: building this extension requires the use of [Docker](https://www.docker.com/) and more specifically the latest [node devepment image for docker](https://hub.docker.com/_/node)

1. Clone the repository and enter into the folder

    ```bash
    git clone git@github.com:ironsheep/P2-vscode-support.git
    cd spin-p2-support/spin2
    ```
    
2. Install the docker image if you don't already have it

    ```bash
    docker pull node
    ```    
    
3. Open VSCode to the ./spin2 directory within the repo clone just installed

4. Install the required packages with `npm`

    ```bash
    npm install           #  should happen when you ask VSCode to [reopen in container]
    npm install -g vsce   # if this is not yet installed
    ```
    
    **NOTE**: if the `npm install` advises that a newer `npm` is available then also install the new as it advises.

3. Compile with `npm`

    ```bash
    npm run compile
    ```

At this point the extension may be debugged in the Extension Development Host:

```bash
code .
```

followed by the `Debug/Start Debugging` dropdown (or the `F5` key). To observe the extension in action, view the file `demo.in`.

To complete the manual installation, follow the remaining steps to manually create and install the package:

### Package and install the extension

4. Create a package using `vsce`

    ```bash
    vsce package
    ```
    
    **NOTE**: the package version number is specified in package.json. Modify the version number before packaging!

    This should generate a `spin2-?.?.?.vsix` file in the current directory.
    
5. Manually install the extension in VS Code (you may want to replace the wildcards in the version number)

    ```bash
    code --install-extension spin2-?.?.?.vsix
    ```

To test the installation, open one of your P2 project folders in VS Code and then open any of your .spin2 files.
