// models/Comment.js

const mongoose =  require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    
    // Polymorphic reference
    parentType: {
        type: String,
        required: true,
        enum: ["Review", "Chapter", "Comment"], // which kind of thing it belongs to
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "parentType", // dynamic ref — beautiful Mongo feature
    },

    // Replies
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);

/*
Chapter (id: 1)
 ├── Comment (id: 100, parentType: "Chapter", parentId: 1)
 │     ├── Comment (id: 101, parentType: "Comment", parentId: 100)
 │     ├── Comment (id: 102, parentType: "Comment", parentId: 100)
 └── Comment (id: 103, parentType: "Chapter", parentId: 1)

 Review (id: 55)
 └── Comment (id: 200, parentType: "Review", parentId: 55)
       └── Comment (id: 201, parentType: "Comment", parentId: 200)

*/