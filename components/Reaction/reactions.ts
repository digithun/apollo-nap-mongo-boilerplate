const reactions = [
  {
    "type": "LIKE",
    "image": "/static/comment-images/reaction/reaction-like.png",
    "weight": 0.10
  },
  {
    "type": "WOW",
    "image": "/static/comment-images/reaction/reaction-wow.png",
    "weight": 0.09
  },
  {
    "type": "LAUGH",
    "image": "/static/comment-images/reaction/reaction-laugh.png",
    "weight": 0.08
  },
  {
    "type": "LOVE",
    "image": "/static/comment-images/reaction/reaction-love.png",
    "weight": 0.07
  },
  {
    "type": "SHY",
    "image": "/static/comment-images/reaction/reaction-shy.png",
    "weight": 0.06
  },
  {
    "type": "COOL",
    "image": "/static/comment-images/reaction/reaction-cool.png",
    "weight": 0.05
  },
  {
    "type": "SAD",
    "image": "/static/comment-images/reaction/reaction-sad.png",
    "weight": 0.04
  }
]

export const reactionMapping: {
  [key: string]: {
    type: string
    image: string
    weight: number
  }
} = {}

reactions.forEach(r => reactionMapping[r.type] = r)

export default reactions
