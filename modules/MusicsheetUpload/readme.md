# Marschpat.UI.Components - MusicsheetUpload Module

Marschpat Musicsheet Upload component

## Usage

### Update THIRD PARTY npm dependencies
 - update `package.json` in main projects
   ```
    "dependencies": {
        ...
        "pdf-lib": "^1.16.0",
        "pdfjs-dist": "^2.6.347",
        "react-cropper": "^1.3.0",
        "react-dropzone": "^11.0.3",
        ...
    },
   ```
 - install new dependencies  
   `yarn install`

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
