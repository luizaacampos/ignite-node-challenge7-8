import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: 'teste',
      email: 'test@test.com',
      password: '123456'
    }

    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      email: 'test@test.com',
      password: '123456'
    });

    expect(authenticate).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with wrong password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'teste',
        email: 'test@test.com',
        password: '123456'
      }

      await createUserUseCase.execute(user);

      const authenticate = await authenticateUserUseCase.execute({
        email: 'test@test.com',
        password: '12345'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  });

  it("Should not be able to authenticate a user with wrong email", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'teste',
        email: 'test@test.com',
        password: '123456'
      }

      await createUserUseCase.execute(user);

      const authenticate = await authenticateUserUseCase.execute({
        email: 'teste@test.com',
        password: '123456'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  })
});
