import { SessionModel, SessionApi } from '@/entities/Session'
import { useAuth } from './useAuth'

/**
 * Restore the signed-in session from the stored refresh token.
 *
 * Runs at most once per page load. Route guards await this before deciding
 * whether a protected route is allowed — without it, a hard refresh of
 * /personal-area/* checks `isAuth` before the async restore finishes and
 * bounces the user to the homepage.
 */

let bootstrapPromise: Promise<void> | null = null

export function bootstrapAuth(): Promise<void> {
  if (!bootstrapPromise) bootstrapPromise = run()
  return bootstrapPromise
}

async function run(): Promise<void> {
  const session = SessionModel.useSessionStore()
  if (!session.refreshToken) return

  const auth = useAuth()

  try {
    const { data } = await SessionApi.getToken(session.refreshToken)

    session.setTokens({
      idToken: data.id_token,
      refreshToken: data.refresh_token
    })

    await auth.loadSessionUser(data.user_id)
    await auth.loadStoresData()
  } catch {
    // Expired / invalid refresh token — drop the dead session silently.
    session.logout()
  }
}
