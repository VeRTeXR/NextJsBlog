import gql from 'graphql-tag'
import cookie from 'cookie'
import authSignOut from './auth-sign-out'

export default async (client, token) => {

  const cookies = cookie.parse(document.cookie)
  token = token || cookies.token

  if (!token) {
    return null
  }

  return await client.query({
    fetchPolicy: 'no-cache',
    query: gql`
      query meQuery {
        me {
          id
          email
          hasEmail
          picture
          pictureThumbnail
          displayName
          firstName
          lastName
          telephone
          language
          isStaff
          totalActiveLeaderTeams
          inviteTeamCount
          country {
            id
            code
            logoThumbnail
          }
          participantPtr {
            id
          }
        }
      }
    `
  })
  .then(({ data }) => {
    const loggedInUser = data.me
    return loggedInUser
  })
  .catch((err) => {
    console.log(err)
    // authSignOut(client)
    return null
  })
}