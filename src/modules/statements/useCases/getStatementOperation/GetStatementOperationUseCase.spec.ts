import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { Statement } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {

  let getStatementOperationUseCase: GetStatementOperationUseCase;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to return statement operation info", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com.br",
      name: 'teste',
      password: '123456',
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "test deposit"
    });

    const operationInfo = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string,
    });

    expect(operationInfo).toHaveProperty("amount");
    expect(operationInfo).toBeInstanceOf(Statement);
  });

  it("Should not be able to return statement operation info from a non-existent operation", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@test.com.br",
        name: 'teste',
        password: '123456',
      });

      const operationInfo = await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'non-existent id',
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("Should not be able to return statement operation info for a non-existent user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@test.com.br",
        name: 'teste',
        password: '123456',
      });

      const deposit = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "test deposit"
      });

      const operationInfo = await getStatementOperationUseCase.execute({
        user_id: 'non-existent user',
        statement_id: deposit.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
})
