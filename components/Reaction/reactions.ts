const reactions = [
  {
    "type": "LIKE",
    "image": "/static/comment-images/reaction/reaction-like.png",
    "weight": 1
  },
  {
    "type": "WOW",
    "image": "/static/comment-images/reaction/reaction-wow.png",
    "weight": 2
  },
  {
    "type": "LAUGH",
    "image": "/static/comment-images/reaction/reaction-laugh.png",
    "weight": 3
  },
  {
    "type": "LOVE",
    "image": "/static/comment-images/reaction/reaction-love.png",
    "weight": 4
  },
  {
    "type": "SHY",
    "image": "/static/comment-images/reaction/reaction-shy.png",
    "weight": 5
  },
  {
    "type": "COOL",
    "image": "/static/comment-images/reaction/reaction-cool.png",
    "weight": 6
  },
  {
    "type": "SAD",
    "image": "/static/comment-images/reaction/reaction-sad.png",
    "weight": 7
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
