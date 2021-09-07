import { v4 as uuidv4 } from 'uuid';

class FileHelper {
    /**
     * Validates if given file is any of the accepted file types
     */
    static validateFileExtension(file, acceptedFileExtensions) {
        if (!file.name) return false;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = acceptedFileExtensions.map(el =>
            el.substring(1)
        );

        if (allowedExtensions.includes(fileExtension)) {
            return true;
        }

        // implement file.type validtion. but it seems .mxl and .musicxml
        // files most of the time have not a proper file type setup.
        console.error(
            'FileHelper: Invalid file extension provided: ' + fileExtension
        );
        return false;
    }

    /**
     * Set the Musicsheet Uploader file/upload type.
     * return custom FileObject
     */
    static populateFileObject(file) {
        const typeMap = {
            mxl: ['mxl', 'musicxml'],
            image: ['png', 'jpg', 'jpeg'],
            pdf: ['pdf'],
        };
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let extensionType = null;
        for (const type in typeMap) {
            if (typeMap[type].includes(fileExtension)) {
                extensionType = type;
            }
        }

        return {
            uuid: uuidv4(),
            file,
            extensionType,
        };
    }

    /**
     * Monkeypatch to set the required mime type for backend.
     * If it's a .mxl file replace whatsoever is there with: application/mxl
     */
    static updateMxlMimeTypeInDataString(fileObject) {
        const mxlFileTypes = ['mxl'];
        const musicXmlFileTypes = ['musicxml'];
        const fileExtension = fileObject.file.name
            .split('.')
            .pop()
            .toLowerCase();

        if (mxlFileTypes.includes(fileExtension)) {
            fileObject.dataUrlString = fileObject.dataUrlString.replace(
                /data:(.*);/,
                'data:application/mxl;'
            );
        }

        if (musicXmlFileTypes.includes(fileExtension)) {
            fileObject.dataUrlString = fileObject.dataUrlString.replace(
                /data:(.*);/,
                'data:application/musicxml;'
            );
        }

        return fileObject;
    }

    /**
     * Read the file as base64 dataUri string (dataUrl)
     * @param {object} fileObject
     * @returns
     */
    static readFileAsDataUrl(fileObject) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileObject.file);
            reader.onload = () => {
                resolve({
                    ...fileObject,
                    dataUrlString: reader.result,
                });
            };
            reader.onabort = () =>
                reject(
                    'Error FileHelper.readFileAsDataUrl(): file reading was aborted'
                );
            reader.onerror = () =>
                reject(
                    'Error FileHelper.readFileAsDataUrl(): file reading was aborted'
                );
        });
    }

    /**
     * Read the file as binary string (blob)
     * @param {object} fileObject
     * @returns
     */
    static readAsBinaryString(fileObject) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(fileObject.file);
            reader.onload = () => {
                resolve({
                    ...fileObject,
                    dataUrlString: null,
                    blob: reader.result,
                });
            };
            reader.onabort = () =>
                reject('Error FileHelper.readAsBinaryString()');
            reader.onerror = e =>
                reject('Error FileHelper.readAsBinaryString()');
        });
    }

    /**
     * Populate a fake file object, from raw data url (base64 data uri)
     */
    static createFakeFileObject(data, name, extensionType = 'pdf') {
        return {
            file: { name },
            extensionType,
            dataUrlString: extensionType === 'mxl' ? null : data,
            blob: extensionType === 'mxl' ? data : null,
            uuid: uuidv4(),
        };
    }

    /**
     * Convert a file from DataUri to binary string
     * @param {*} fileAsDataUri
     * @returns string - binary string
     */
    static async convertFileToBinary(fileAsDataUri) {
        const pr = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(fileAsDataUri);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => {
                reject(error);
            };
        });

        return pr;

        // return new Promise((resolve, reject) => {
        //     const reader = new FileReader();
        //     reader.readAsBinaryString(fileAsDataUri);
        //     reader.onload = () => resolve(reader.result);
        //     reader.onerror = (error) => reject(error);
        // });
    }
}

export default FileHelper;
