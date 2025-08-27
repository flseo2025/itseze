// Classic TDD Template
// Focus on state verification and minimal mocking

describe('Classic TDD Template', () => {
  describe('Calculator', () => {
    let calculator;
    
    beforeEach(() => {
      calculator = new Calculator();
    });
    
    describe('Addition', () => {
      it('should add two positive numbers', () => {
        // Red: Write failing test first
        const result = calculator.add(2, 3);
        expect(result).toBe(5);
      });
      
      it('should add negative numbers', () => {
        const result = calculator.add(-2, -3);
        expect(result).toBe(-5);
      });
      
      it('should add zero', () => {
        const result = calculator.add(5, 0);
        expect(result).toBe(5);
      });
    });
    
    describe('Division', () => {
      it('should divide positive numbers', () => {
        const result = calculator.divide(10, 2);
        expect(result).toBe(5);
      });
      
      it('should throw error when dividing by zero', () => {
        expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
      });
      
      it('should handle decimal results', () => {
        const result = calculator.divide(7, 2);
        expect(result).toBe(3.5);
      });
    });
    
    describe('Memory Operations', () => {
      it('should store and recall values', () => {
        calculator.store(42);
        expect(calculator.recall()).toBe(42);
      });
      
      it('should clear memory', () => {
        calculator.store(42);
        calculator.clear();
        expect(calculator.recall()).toBe(0);
      });
      
      it('should add to memory', () => {
        calculator.store(10);
        calculator.addToMemory(5);
        expect(calculator.recall()).toBe(15);
      });
    });
  });
  
  describe('BankAccount (State-based testing)', () => {
    let account;
    
    beforeEach(() => {
      account = new BankAccount('12345', 100);
    });
    
    it('should initialize with correct balance', () => {
      expect(account.getBalance()).toBe(100);
      expect(account.getAccountNumber()).toBe('12345');
    });
    
    it('should deposit money correctly', () => {
      account.deposit(50);
      expect(account.getBalance()).toBe(150);
    });
    
    it('should withdraw money if sufficient funds', () => {
      const result = account.withdraw(30);
      expect(result).toBe(true);
      expect(account.getBalance()).toBe(70);
    });
    
    it('should reject withdrawal if insufficient funds', () => {
      const result = account.withdraw(200);
      expect(result).toBe(false);
      expect(account.getBalance()).toBe(100);
    });
    
    it('should maintain transaction history', () => {
      account.deposit(25);
      account.withdraw(15);
      
      const history = account.getTransactionHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toMatchObject({
        type: 'deposit',
        amount: 25
      });
      expect(history[1]).toMatchObject({
        type: 'withdrawal',
        amount: 15
      });
    });
  });
});

// Example classes for demonstration
class Calculator {
  constructor() {
    this.memory = 0;
  }
  
  add(a, b) {
    return a + b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
  
  store(value) {
    this.memory = value;
  }
  
  recall() {
    return this.memory;
  }
  
  clear() {
    this.memory = 0;
  }
  
  addToMemory(value) {
    this.memory += value;
  }
}

class BankAccount {
  constructor(accountNumber, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.transactions = [];
  }
  
  getBalance() {
    return this.balance;
  }
  
  getAccountNumber() {
    return this.accountNumber;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.transactions.push({
        type: 'deposit',
        amount,
        timestamp: new Date(),
        balance: this.balance
      });
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      this.transactions.push({
        type: 'withdrawal',
        amount,
        timestamp: new Date(),
        balance: this.balance
      });
      return true;
    }
    return false;
  }
  
  getTransactionHistory() {
    return [...this.transactions];
  }
}