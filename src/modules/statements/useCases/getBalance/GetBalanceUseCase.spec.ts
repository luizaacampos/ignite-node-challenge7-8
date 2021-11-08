import { User } from '../../../users/entities/User';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';


describe("Get balance", () => {

  let getBalanceUseCase: GetBalanceUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to return user's balance", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: 'teste',
      password: '123456',
    });

      const balance = await getBalanceUseCase.execute({
        user_id: user.id as string
      });

    expect(balance).toHaveProperty("statement");
  });

  it("Should not be able to return balance for a non-existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existent user"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
