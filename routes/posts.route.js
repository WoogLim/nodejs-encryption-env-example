const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment")
const authMiddleware = require("../middlewares/auth-middleware")

// 게시글 작성 API
router.post('/posts', authMiddleware, async(req, res) => {
  // - 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
  // - 제목, 작성 내용을 입력하기
  const {title, content} = req.body;
  const user = res.locals.user;

  try {
    await Posts.create({
      title,
      content,
      nickname: user.nickname,
      createdAt: new Date() 
    })

    return (res.status(201).json({
      success: true,
      message: "게시글이 작성에 성공하였습니다."
    }))
  } catch(err) {
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "게시글 작성에 실패했습니다."
    }))
  }
})

// 게시글 조회 API
router.get("/posts", async(req, res) => {
  const posts = await Posts.find({},{_id:false}).sort("-createdAt");

  return (res.status(200).json({
    success: true,
    posts
  }))
})

// 게시글 상세 조회 API
router.get("/posts/:postId", async(req, res) => {
  const {postId} = req.params;
  const post = await Posts.findById({_id:postId},{_id:false});

  return (res.status(200).json({
    success: true,
    post
  }))
})

// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async(req, res) => {
  const {postId} = req.params;
  const {title, content} = req.body; 
  const user = res.locals.user;

  try {
    const updatedPost = await Posts.updateOne({
      nickname: user.nickname
      , _id: postId
    },
    {
      title
      , content
      , updatedAt: new Date()
    })

    if(updatedPost.modifiedCount){
      return (res.status(200).json({
        success: true,
        message: "게시글을 수정하였습니다."
      }))
    }else{
      return (res.status(401).json({
        success: true,
        message: "게시글이 정상적으로 수정되지 않았습니다."
      }))
    }
    
  } catch(err) {
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "게시글 수정에 실패했습니다."
    }))
  }
})

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async(req, res) => {
  const {postId} = req.params;
  const user = res.locals.user;

  try {

    const deletedPost = await Posts.deleteOne({
      nickname: user.nickname
      , _id: postId
    })

    if(deletedPost.deletedCount){
      return (res.status(200).json({
        success: true,
        message: "게시글을 삭제하였습니다."
      }))
    }else{
      return (res.status(401).json({
        success: true,
        message: "게시글이 정상적으로 삭제되지 않았습니다."
      }))
    }
    
  } catch(err) {
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "게시글 삭제에 실패했습니다."
    }))
  }
})

// 댓글 작성 API
router.post('/posts/:postId/comments', authMiddleware, async(req, res) => {
  const {postId} = req.params;
  const {content} = req.body;
  const user = res.locals.user;

  if((content ?? "") === ""){
    return (res.status(412).json({
      success:false,
      message: "댓글 내용을 입력해주세요"
    }));
  }

  try{
    await Comments.create({
      postId
      , nickname: user.nickname
      , content
      , createdAt: new Date()
    })

    return (res.status(201).json({
      success: true,
      message: "댓글을 작성하였습니다."
    }))
  } catch(err){
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "댓글 작성에 실패했습니다."
    }))
  }
})

// 댓글 목록 조회 API
router.get('/posts/:postId/comments', async(req, res) => {
  const {postId} = req.params;

  const comments = await Comments.find({
    postId
  },{_id:false}).sort('-createdAt')

  return (res.status(200).json({
    success: true,
    comments
  }))
})

// 댓글 수정 API
router.put('/posts/:postId/comments/:commentId', authMiddleware, async(req, res) => {
  const {postId, commentId} = req.params;
  const {content} = req.body;
  const user = res.locals.user;

  if((content ?? "") === ""){
    return (res.status(412).json({
      success:false,
      message: "댓글 내용을 입력해주세요"
    }));
  }

  try{
    const updatedComments = await Comments.updateOne({
      postId
      , _id: commentId
    },{
      nickname: user.nickname
      , content
      , updatedAt: new Date()
    })

    if(updatedComments.modifiedCount){
      return (res.status(200).json({
        success: true,
        message: "댓글을 수정하였습니다."
      }))
    }else{
      return (res.status(401).json({
        success: true,
        message: "댓글이 정상적으로 수정되지 않았습니다."
      }))
    }
  } catch(err) {
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "댓글 수정에 실패했습니다."
    }))
  }
})

// 댓글 삭제 API
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async(req, res) => {
  const {postId, commentId} = req.params;

  try{
    const deletedComments = await Comments.deleteOne({
      postId
      , _id: commentId
    })

    if(deletedComments.deletedCount){
      return (res.status(200).json({
        success: true,
        message: "댓글을 삭제하였습니다."
      }))
    }else{
      return (res.status(401).json({
        success: true,
        message: "댓글이 정상적으로 삭제되지 않았습니다."
      }))
    }
  } catch(err) {
    console.error(err);

    return (res.status(400).json({
      success: false,
      message: "댓글 삭제에 실패했습니다."
    }))
  }
})

module.exports = router;