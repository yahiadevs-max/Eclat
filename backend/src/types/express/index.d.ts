
// This file extends the Express Request object to include a user property.

// Use a specific interface for the decoded user from JWT
interface DecodedUser {
    id: number;
    username: string;
    role: 'superadmin' | 'admin';
}

// Extend the Express namespace
declare namespace Express {
    export interface User extends DecodedUser {}

    export interface Request {
        user?: User;
    }
}
