import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
    public url: string;

    constructor() {
        this.url = GLOBAL.url;
    }

    makeFileRequest(
        url: string,
        params: Array<string>,
        files: Array<File>,
        token: string,
        fileName: string) {
        // tslint:disable-next-line: only-arrow-functions
        return new Promise(function (resolve, reject) {
            // tslint:disable-next-line: prefer-const
            var formData: any = new FormData();
            // tslint:disable-next-line: prefer-const
            var xhr = new XMLHttpRequest();

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < files.length; i++) {
                formData.append(fileName, files[i], files[i].name);
            }
            // tslint:disable-next-line: only-arrow-functions
            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
