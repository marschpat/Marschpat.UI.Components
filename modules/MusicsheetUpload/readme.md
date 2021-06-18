# Marschpat.UI.Components - MusicsheetUpload Module

Marschpat Musicsheet Upload component

## Usage

### Install npm dependencies
 - cd into module root directory
 - install dependencies: `yarn`

### Update MARSCHPAT vendor dependencies
#### Custom OpenSheetMusicDisplay
 - copy `opensheetmusicdisplay` dependency to vendor directory (e.g: `/vendor/opensheetmusicdisplay/`)
 - update custom vendor dependency in `package.json`
   ```
    "dependencies": {
        ...
        "opensheetmusicdisplay-marschpat": "file:./vendor/opensheetmusicdisplay",
        ...
    },
   ```
 - install new dependencies
   `yarn`
