import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderID : {
        type : String, 
        // ref: "User",
        required : true, 
    }, 
    receiverID : {
        type : String, 
        // ref: "User",
        required : true, 
    }, 
    cipherText: { type: String, required: true },
    iv: { type: String, required: true },

}, {timestamps : true});

const Message = mongoose.model('Message', messageSchema);

export default Message;