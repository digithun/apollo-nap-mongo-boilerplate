const reactions = [
  {
    "type": "LIKE",
    "image": "/static/comment-images/reaction/reaction-like.png"
  },
  {
    "type": "WOW",
    "image": "/static/comment-images/reaction/reaction-wow.png"
  },
  {
    "type": "LAUGH",
    "image": "/static/comment-images/reaction/reaction-laugh.png"
  },
  {
    "type": "LOVE",
    "image": "/static/comment-images/reaction/reaction-love.png"
  },
  {
    "type": "SHY",
    "image": "/static/comment-images/reaction/reaction-shy.png"
  },
  {
    "type": "COOL",
    "image": "/static/comment-images/reaction/reaction-cool.png"
  },
  {
    "type": "SAD",
    "image": "/static/comment-images/reaction/reaction-sad.png"
  }
]

export const reactionMapping: {
  [key: string]: {
    type: string,
    image: string
  }
} = {}

reactions.forEach(r => reactionMapping[r.type] = r)

export default reactions
