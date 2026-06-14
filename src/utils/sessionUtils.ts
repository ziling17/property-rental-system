// src/utils/sessionUtils.ts

import { UserSession } from '../types';

export const validateSession = (session: UserSession | null): boolean => {
    if (!session) return false;
    if (!session.email || !session.role || !session.name || !session.token) return false;

    try {
        const decoded = atob(session.token);
        const [tokenEmail, tokenRole] = decoded.split(':');
        return (
            tokenEmail.toLowerCase() === session.email.toLowerCase() &&
            tokenRole === session.role
        );
    } catch {
        return false;
    }
};