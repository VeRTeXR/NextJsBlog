import cookie from 'cookie'
import { actions } from '../store'


export default async (client) => {
  document.cookie = cookie.serialize('token', '', {
    path: '/'
  })
  actions.setLoggedInUser(null)
  client.cache.reset()
}