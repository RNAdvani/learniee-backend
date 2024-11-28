export interface IUser extends Document {
    name : string;
    email: string;
    username: string;
    password: string;
    isOnline: boolean;
    lastOnline : Date;
}