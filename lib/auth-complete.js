import cookie from 'cookie'
import { redirect, initLanguage } from './utils'
import getLoggedIn from './get-logged-in'
import { actions } from '../store'


export default async (client, token, next, asNext) => {

  document.cookie = cookie.serialize('token', token, {
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })

  const loggedInUser = await getLoggedIn(client)
  actions.setLoggedInUser(loggedInUser)
  initLanguage(loggedInUser)

  return client.cache.reset().then(() => {
    if (next !== '<self>') {
      redirect({}, next || `/`, asNext)
    }
  })

}