export class Publication {
    constructor(
        public _id: string,
        public user: string,
        public text: String,
        public file: String,
        public created_at: String
      
    ) { }
}