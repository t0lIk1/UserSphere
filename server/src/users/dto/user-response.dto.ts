export class UserResponseDto {
    id: number;
    email: string;
    isBlocked: boolean;

    constructor(user: { id: number; email: string; isBlocked: boolean }) {
        this.id = user.id;
        this.email = user.email;
        this.isBlocked = user.isBlocked;
    }
}