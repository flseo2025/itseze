// London School TDD Template
// Focus on interactions and behavior verification

describe('London School TDD Template', () => {
  let mockRepository;
  let mockNotificationService;
  let userService;
  
  beforeEach(() => {
    // Create mocks for collaborators (London School approach)
    mockRepository = global.testUtils.createMock('UserRepository', {
      save: jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com' }),
      findByEmail: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(true)
    });
    
    mockNotificationService = global.testUtils.createMock('NotificationService', {
      sendWelcome: jest.fn().mockResolvedValue(true),
      sendConfirmation: jest.fn().mockResolvedValue(true)
    });
    
    // Inject mocks into system under test
    userService = new UserService(mockRepository, mockNotificationService);
  });
  
  describe('User Registration (Outside-In)', () => {
    it('should coordinate user creation workflow', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123'
      };
      
      // Act
      const result = await userService.register(userData);
      
      // Assert - Focus on interactions between objects
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name
        })
      );
      expect(mockNotificationService.sendWelcome).toHaveBeenCalledWith('123');
      
      // Verify the coordination sequence
      expect(mockRepository.findByEmail).toHaveBeenCalledBefore(mockRepository.save);
      expect(mockRepository.save).toHaveBeenCalledBefore(mockNotificationService.sendWelcome);
      
      expect(result).toEqual({
        success: true,
        userId: '123'
      });
    });
    
    it('should handle duplicate email registration', async () => {
      // Arrange
      const existingUser = { id: '456', email: 'existing@example.com' };
      mockRepository.findByEmail.mockResolvedValue(existingUser);
      
      // Act & Assert
      await expect(userService.register({
        email: 'existing@example.com',
        name: 'Duplicate User'
      })).rejects.toThrow('User already exists');
      
      // Verify no unwanted interactions
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockNotificationService.sendWelcome).not.toHaveBeenCalled();
    });
  });
  
  describe('Contract Evolution Example', () => {
    it('should adapt to new collaboration requirements', () => {
      // Extend mock with new capability
      const enhancedMock = {
        ...mockRepository,
        archiveUser: jest.fn().mockResolvedValue(true)
      };
      
      // Test new contract
      expect(enhancedMock.archiveUser).toBeDefined();
      expect(typeof enhancedMock.archiveUser).toBe('function');
    });
  });
});

// Example UserService class for demonstration
class UserService {
  constructor(repository, notificationService) {
    this.repository = repository;
    this.notificationService = notificationService;
  }
  
  async register(userData) {
    // Check if user exists
    const existingUser = await this.repository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Save new user
    const savedUser = await this.repository.save(userData);
    
    // Send welcome notification
    await this.notificationService.sendWelcome(savedUser.id);
    
    return {
      success: true,
      userId: savedUser.id
    };
  }
}