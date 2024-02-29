'use strict'

class User {
    constructor(name, surname, nickname, email, password, role, image) {
        this.name = name;
        this.surname = surname;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.image = image;
        this.Publications = [];
        this.messagesSent = []; 
        this.messagesReceived = []
    }
}
export default User;