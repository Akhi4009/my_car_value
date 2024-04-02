import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {

  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  
  beforeEach( async () => {
     fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email:string, password:string) => Promise.resolve({id:1,email,password} as User)
    }
    
    const module = await Test.createTestingModule({
      providers:[
        AuthService,
        {
          provide: UsersService,
          useValue:fakeUserService
        }
      
      ] 
    }).compile();
  
   service = module.get(AuthService);
  })
  
  it('can craete an instance of auth service', async () => {
    // Create a fake copy of the users service
    expect(service).toBeDefined();
  })

  it('creates a new user with a salted and hashed password', async () => {
    const  user = await service.signup('akhilesh@gmail.com','akhilesh');

    expect(user.password).not.toEqual('akhilesh');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with email that is in use', async () => {
    
    fakeUserService.find = () => Promise.resolve([{id:1,email:'a',password:'1'} as User]);

    await expect(service.signup('akhilesh@gmail.com','akhilesh')).rejects.toThrow(
      BadRequestException,
    );
  })

  it('throwa if signin is called with an unused email', async() => {
    await expect(service.signin('akhilesh@gmail.com','akhilesh')).rejects.toThrow(
      NotFoundException,
    )
  })
})


