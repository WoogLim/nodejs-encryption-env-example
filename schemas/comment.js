const mongoose = require("mongoose");
const PostSchema = require("./post");

const CommentSchema = new mongoose.Schema({
  // 댓글 작성자
  nickname: {
    type: String,
    required: true,
  },
  // 게시글 ID
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PostSchema,
    required: true,
  },
  // 댓글 내용
  content: {
    type: String,
    required: true,
  },
  // 댓글 작성일
  createdAt: {
    type: Date,
  },
  // 댓글 수정일
  updatedAt: {
    type: Date,
  }
},{
  versionKey: false
})

// 가상의 컬럼 추가 
CommentSchema.virtual("commentId").get(function() {
  return this._id;
})

// post 정보를 JSON으로 바꿀 때 위의 virtual 값이 설정되도록 설정한다.
CommentSchema.set("toJSON", {
  virtuals: true
})

module.exports = mongoose.model("Comment", CommentSchema);