## IGNITE NODE - CHALLENGE 7

### Unit tests

### POST `/api/v1/users`
  - Should be able to create a new user
  - Should not be able to create a user that already exists

### POST `/api/v1/sessions`
  - Should be able to authenticate a user
  - Should not be able to authenticate a user with wrong password
  - Should not be able to authenticate a user with wrong email

### GET `/api/v1/profile`
  - Should be able to show a user profile
  - Should not be able to show profile of a non-existent user

### GET `/api/v1/statements/balance`
  - Should be able to return user's balance
  - Should not be able to return balance for a non-existent user

### POST `/api/v1/statements/deposit`
  - Should be able to create a deposit
  - Should not be able to create a deposit for a non-existent user

### POST `/api/v1/statements/withdraw`
  - Should be able to create a withdraw
  - Should not be able to create a withdraw for a non-existent user
  - Should not be able to create a withdraw when user has insufficient funds

### GET `/api/v1/statements/:statement_id`
  - Should be able to return statement operation info
  - Should not be able to return statement operation info for a non-existent user
  - Should not be able to return statement operation info from a non-existent operation

### Integration tests

### POST `/api/v1/users`
  - Should be able to create a new user
  - Should not be able to create a user with a existent email

### POST `/api/v1/sessions`
  - Should be able to authenticate a user
  - Should not be able to authenticate a user with wrong password
  - Should not be able to authenticate a user with wrong email

### GET `/api/v1/profile`
  - Should be able to show a user profile

### GET `/api/v1/statements/balance`
  - Should be able to return user's balance

### POST `/api/v1/statements/deposit`
  - Should be able to create a deposit

### POST `/api/v1/statements/withdraw`
  - Should be able to create a withdraw
  - Should not be able to create a withdraw when user has insufficient funds

### GET `/api/v1/statements/:statement_id`
  - Should be able to return statement operation info

