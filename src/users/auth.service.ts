import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes,scrypt as _script } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
    constructor(private userService:UsersService){}

    async signup(email: string, password: string){
    // See if email is in use
    const users = await this.userService.find(email);

    if(users.length) {
        throw new BadRequestException('Email in used');
    }

    // Hash the users password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it

    const user = await this.userService.create(email, result);
    // return the user
    return user;

   } 

    async signin(email: string, password: string){

    const [user] = await this.userService.find(email);
    if(!user){
        throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if( storedHash !== hash.toString('hex') ){
        throw new BadRequestException('bad password');
    }
    
    return user;
   }
}