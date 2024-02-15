export class User {
    id: string;
    email: string;
    password?: string;
    name: string;
    isAdmin: boolean;
    [key: string]: any[] | any | null;
}
