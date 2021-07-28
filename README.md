# Marschpat.UI.Components - Marschpat Component Library

Collection of
 - Components (currently React components)
 - Modules (group of components, ment to be used together)
 - Helper functions and classes
 - Custom hooks
 - Other utilities

for the MARSCHPAT ecosytem

## Overview
### Modules
 - [MusicsheetUpload](./modules/MusicsheetUpload/)

### Components
 - [ChooseOrCreateSelector](./components/ChooseOrCreateSelector.js)
 - [LinearProgressWithLabel](./components/LinearProgressWithLabel.js)
 - [LoadingBusyIndicator](./components/LoadingBusyIndicator.js)
 - [LoadingModal](./components/LoadingModal.js)
 - [TextInput](./components/TextInput.js)
 - [TooltipStyled](./components/TooltipStyled.js)

### Utilities, Hooks, etc
 - [useInDebugMode](./utils/useInDebugMode)
## Initialization in project
### Add to the repository
 - `git submodule add git@github.com:marschpat/Marschpat.UI.Components.git`

### Update submodules
Checkout latest changes in submodules
  - `git submodule update --remote` or
  - `git pull --recurse-submodules`

## Usage / Install dependencies for all modules and components
 - Register the `Marschpat.UI.Components` library as new workspace within your root project
   - Within the projects `package.json`, eg.:
     ```
     "workspaces": [
       "src/@marschpat/Marschpat.UI.Components/**/*"
     ],
     ```
   - Use a glob pattern that matches all paths within the components library

## Usage of Modules
After registering Marschpat.UI.Components within your project see the module specific `readme.md` within the module's directory.
