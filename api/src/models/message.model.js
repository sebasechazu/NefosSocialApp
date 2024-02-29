'use strict'
class Message {
    constructor (text, emitter, receiver) {
        this.text = text;
        this.emitter = emitter;
        this.receiver = receiver;
        this.viewed = 'false';
        this.created_at = new Date();
    }
}
export default Message;