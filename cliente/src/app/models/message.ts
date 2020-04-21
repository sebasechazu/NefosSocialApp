export class Message {
    constructor(
        public _id: string,
        public emitter: string,
        public receiver: string,
        public text: String,
        public viewed: String,
        public created_at: String

    ) { }
}