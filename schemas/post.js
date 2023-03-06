const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  // 게시글 작성자
  nickname: {
    type: String,
    required: true,
  },
  // 게시글 제목
  title: {
    type: String,
    required: true,
  },
  // 게시글 내용
  content: {
    type: String,
    required: true,
  },
  // 게시글 작성일
  createdAt: {
    type: Date,
  },
  // 게시글 수정일
  updatedAt: {
    type: Date,
  }
},{
  versionKey: false
})

// 가상의 컬럼 추가 
PostSchema.virtual("postId").get(function() {
  return this._id;
})

// post 정보를 JSON으로 바꿀 때 위의 virtual 값이 설정되도록 설정한다.
PostSchema.set("toJSON", {
  virtuals: true
})

module.exports = mongoose.model("Post", PostSchema);