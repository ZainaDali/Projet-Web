import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.model';
export declare class UserResolver {
    private prisma;
    constructor(prisma: PrismaService);
    users(): Promise<User[]>;
    createUser(username: string, password: string): Promise<User>;
}
