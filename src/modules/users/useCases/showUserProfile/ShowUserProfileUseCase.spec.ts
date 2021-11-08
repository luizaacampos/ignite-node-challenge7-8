import { User } from '../../entities/User';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

describe("Show user profile", () => {

  let createUserUseCase: CreateUserUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)

  })

  it("Should be able to show a user profile", async() => {
    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: 'teste',
      password: '123456',
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toBeInstanceOf(User);
    expect(profile).toHaveProperty("name");
  });

  it("Should not be able to show profile of a non-existent user", () => {
    expect(async () => {
     await showUserProfileUseCase.execute('non-existent user');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
