export class User {
    constructor(
        public _id: string,
        public name: String,
        public surname: String,
        public nickname: String,
        public email: String,
        public password: String,
        public role: String,
        public image: String
    ) { }
}