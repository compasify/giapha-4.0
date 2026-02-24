// Fake user cho local/desktop mode — single-user, no auth required
import type { AuthUser } from '@/app/actions/auth-actions'

export const LOCAL_FAKE_USER: AuthUser = {
    id: 1,
    email: 'local@desktop.app',
    name: 'Local User',
    username: 'local',
    role: 'admin',
    avatar: null,
}
