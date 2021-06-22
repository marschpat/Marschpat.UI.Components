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
 - [TooltipStyled](./components/TooltipStyled.js)

## Initialization in project
### Add to the repository
 - `git submodule add git@github.com:marschpat/Marschpat.UI.Components.git`

### Update submodules
Checkout latest changes in submodules
  - `git submodule update --remote` or
  - `git pull --recurse-submodules`

## Install dependencies for all modules and components
Run `Marschpat.UI.Components/install.js` after your root projects dependency installation. E.g. add the following to your root projects `package.json`:

```
  scripts: {
    ...
    "postinstall": "node path/to/library/Marschpat.UI.Components/install.js"
    ...,
  }
```
Marschpat.UI.Components/install.js

## Usage of Modules
After initializing Marschpat.UI.Components within your project see the module specific `readme.md` within the module's directory.
