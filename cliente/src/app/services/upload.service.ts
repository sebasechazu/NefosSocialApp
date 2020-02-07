import { Injectable } from "@angular/core";
import { GLOBAL } from "./global";

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
        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append(fileName, files[i], files[i].name);
            }
            xhr.onreadystatechange = function () {
                console.log(xhr.readyState);
                console.log(xhr.status);
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response))
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true)
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}