import { User } from '../../entities/User';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Create user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: 'teste',
      password: '123456',
    });

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a user thet already exists", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@test.com.br",
        name: 'teste',
        password: '123456',
      });

      const user2 = await createUserUseCase.execute({
        email: "test@test.com.br",
        name: 'teste',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
