import {model , models ,Schema ,Types} from "mongoose";

export interface IVote{
    author:Types.ObjectId;
    id:Types.ObjectId;
    type: "question" | "answer";
    voteType: "upvote" | "downvote";
}


const Vote = models?.Vote || model<IVote>("Vote",new Schema<IVote>({
    author:{type:Schema.Types.ObjectId ,ref:"User" ,required:true},
    id:{type:Schema.Types.ObjectId ,required:true},
    type:{type:String ,enum:['question' , 'answer'] ,required:true},
    voteType:{type:String ,enum:['upvote' , 'downvote'] ,required:true},

} ,{timestamps:true}));


export default Vote;
