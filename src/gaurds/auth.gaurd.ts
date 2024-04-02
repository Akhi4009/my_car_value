import {
CanActivate,
ExecutionContext
} from "@nestjs/common";
import { Observable } from "rxjs";

export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext): boolean  {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
  
}