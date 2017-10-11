const { composeWithConnection } = require('graphql-compose-connection')
import { TypeComposer } from 'graphql-compose'

export default function enhance(typeComposer: TypeComposer) {
  typeComposer.removeResolver('connection')
  composeWithConnection(typeComposer, {
    findResolverName: 'findMany',
    countResolverName: 'count',
    sort: {
      CREATEDAT_DESC: {
        value: { createdAt: -1, _id: -1 },
        cursorFields: ['createdAt', '_id'],
        beforeCursorQuery: (rawQuery, cursorData) => {
          if (rawQuery.$or) {
            throw new Error('not support')
          }
          rawQuery.$or = [
            {
              createdAt: { $gt: cursorData.createdAt }
            },
            {
              createdAt: { $eq: cursorData.createdAt },
              _id: { $gt: cursorData._id }
            }
          ]
        },
        afterCursorQuery: (rawQuery, cursorData) => {
          if (rawQuery.$or) {
            throw new Error('not support')
          }
          rawQuery.$or = [
            {
              createdAt: { $lt: cursorData.createdAt }
            },
            {
              createdAt: { $eq: cursorData.createdAt },
              _id: { $lt: cursorData._id }
            }
          ]
        }
      },
      CREATEDAT_ASC: {
        value: { createdAt: 1, _id: 1 },
        cursorFields: ['createdAt', '_id'],
        beforeCursorQuery: (rawQuery, cursorData) => {
          if (rawQuery.$or) {
            throw new Error('not support')
          }
          rawQuery.$or = [
            {
              createdAt: { $lt: cursorData.createdAt }
            },
            {
              createdAt: { $eq: cursorData.createdAt },
              _id: { $lt: cursorData._id }
            }
          ]
        },
        afterCursorQuery: (rawQuery, cursorData) => {
          if (rawQuery.$or) {
            throw new Error('not support')
          }
          rawQuery.$or = [
            {
              createdAt: { $gt: cursorData.createdAt }
            },
            {
              createdAt: { $eq: cursorData.createdAt },
              _id: { $gt: cursorData._id }
            }
          ]
        }
      }
    }
  })
}
