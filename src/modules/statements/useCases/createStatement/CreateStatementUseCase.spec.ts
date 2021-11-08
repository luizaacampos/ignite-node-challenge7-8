import { User } from '../../../users/entities/User';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { Statement } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {

  let createStatementUseCase: CreateStatementUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create a deposit", async () => {
    const userDeposit = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: 'test',
      password: '123456',
    });

      const deposit = await createStatementUseCase.execute({
        user_id: userDeposit.id as string,
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "test deposit"
      });

    expect(deposit).toHaveProperty("amount");
    expect(deposit).toBeInstanceOf(Statement);
  });

  it("Should be able to create a withdraw", async () => {
    const user = await createUserUseCase.execute({
      email: "testwithdraw@test.com",
      name: "teste withdraw",
      password: "654321"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test deposit before withdraw"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 1,
      description: "test withdraw"
    });

    expect(withdraw).toHaveProperty("amount");
    expect(withdraw).toBeInstanceOf(Statement);
  });

  it("Should not be able to create a deposit for a non-existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'non-existent user',
        type: OperationType.DEPOSIT,
        amount: 500,
        description: "test deposit"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a withdraw for a non-existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'non-existent user',
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "test withdraw"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a withdraw when user has insufficient funds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "testee@test.com.br",
        name: 'test insufficient funds',
        password: '12345',
      });

      const deposit = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "test deposit"
      });

      const withdraw = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "test withdraw"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
