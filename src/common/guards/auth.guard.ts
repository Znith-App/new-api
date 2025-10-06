import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorators';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        if (!authHeader) throw new UnauthorizedException('Missing token');

        const token = authHeader.split(' ')[1];
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables.');
            }

            const decoded = jwt.verify(token, secret) as any;
            request.user = decoded;

            if (!requiredRoles || requiredRoles.length === 0) return true;

            const { isAdmin, isPremium, isPsychologist } = decoded;

            const userHasRole =
                (requiredRoles.includes('admin') && isAdmin) ||
                (requiredRoles.includes('premium') && isPremium) ||
                (requiredRoles.includes('psychologist') && isPsychologist);

            if (!userHasRole) throw new ForbiddenException('Access denied');

            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}