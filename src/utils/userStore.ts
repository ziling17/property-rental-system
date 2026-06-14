// src/utils/userStore.ts

export interface RegisteredUser {
    email: string;
    password: string;
    name: string;
    role: 'tenant' | 'landlord';
}

const USERS_KEY = 'mysewa_registered_users';

export const getUsers = (): RegisteredUser[] => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
};

export const registerUser = (user: RegisteredUser): { success: boolean; message: string } => {
    const users = getUsers();
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) return { success: false, message: 'Email already registered.' };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Registered successfully.' };
};

const generateToken = (email: string, role: string): string => {
    const raw = `${email}:${role}:${Date.now()}:mysewa_secret`;
    return btoa(raw);
};

export const loginUser = (
    email: string,
    password: string,
    role: 'tenant' | 'landlord'
): { success: boolean; message: string; user?: RegisteredUser; token?: string } => {
    const users = getUsers();
    const user = users.find(
        u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password &&
            u.role === role
    );
    if (!user) return { success: false, message: 'Invalid email, password, or role.' };
    return { success: true, message: 'Login successful.', user, token: generateToken(email, role) };
};