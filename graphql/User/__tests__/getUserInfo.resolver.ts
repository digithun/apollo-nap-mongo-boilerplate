import { Connection, Types } from 'mongoose'
import { initConnection } from '../../../lib/db.connection'
import config from '../../../config'
import { getUserInfoResolve } from '../getUserInfo.resolver'
import composeSchema from '../../compose.schema'

describe('getUserInfo.resolver', () => {
  it('getUserInfoResolve should call connector and return result from connector', async () => {
    const resolveUserInfo = jest.fn((a) => Promise.resolve({ _id: a, name: 'mock' }))
    const context: any = {
      connectors: {
        User: {
          resolveUserInfo
        }
      }
    }
    const result = await getUserInfoResolve({
      args: {
        _id: 'xxx'
      },
      context
    })
    expect(resolveUserInfo.mock.calls[0][0]).toEqual('xxx')
    expect(result).toEqual({ _id: 'xxx', name: 'mock' })
  })
})
