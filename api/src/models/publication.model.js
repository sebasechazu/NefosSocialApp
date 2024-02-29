'use strict'
class Publication {
    constructor(user, text, file, createdAt) {
        this.user = user;
        this.text = text;
        this.file = file;
        this.createdAt = createdAt;
    }
}
export default Publication;