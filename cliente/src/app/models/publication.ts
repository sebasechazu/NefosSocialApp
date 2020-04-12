export class Publication {
    constructor(
        public id: string,
        public user: string,
        public text: string,
        public file: string,
        public createdAt: string
    ) { }
}
