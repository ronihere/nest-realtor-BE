import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';
import { TokenUserInterface } from "src/GlobalInterceptor/Userinterceptor.Interceptor";

//get the metadata from roles
//if roles are provided, verify jwt and check if the the role of the loggedInUser is mentioned in the controller, if yes , return true , else false;
//if no roles is assigned , that means the controller can run without jwt as well, so it should return true
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(
        context: ExecutionContext,
    ) {
        //if roles metadata is present in the classLevel and functionlevel , it will override and the lowest level ,etadata will take precedence
        const roles = this.reflector.getAllAndMerge('roles', [
            context.getClass(), context.getHandler()
        ])
        //no jwt token is required for the controller.
        if (!roles?.length) {
            return true;
        }

        //this means roles is assigned to the particular class or handler
        const request = context.switchToHttp().getRequest();
        const authToken = request.headers?.['authorization']?.split('Bearer ')?.[1];
        if (!authToken) {
            throw new UnauthorizedException();
        }
        const {email, exp, iat,id, name, type} = this.decodeTokenAndVerify(authToken);
        if(roles.includes(type)){
            return true;
        }
        //if roles of the loggedInUser is not in the list of the metadata(roles), then throw exception
        console.log('returned false from authGuard')
        return false;
    }

    decodeTokenAndVerify(token: string): TokenUserInterface{
        try {
            const isVerifiedToken = jwt.verify(token, process.env.JWT_SECRET) as TokenUserInterface
            return isVerifiedToken;
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}