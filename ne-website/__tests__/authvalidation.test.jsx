import { SignupFormSchema } from '@/lib/definitions';

describe('SignupFormSchema Validation', () => {
  it('should validate successfully with correct data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
    };

    const result = SignupFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const invalidData = {
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
    };

    const result = SignupFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain('Required'); // Adjust the message based on your schema
    }
  });

  it('should fail if email is invalid', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'SecurePassword123!',
    };

    const result = SignupFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Please enter a valid email.'); // Adjust message based on schema error message
    }
  });

  it('should fail if password is missing', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const result = SignupFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain('Required');
    }
  });

  it('should fail if password is too weak', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123', // Assuming this doesn't meet the strength criteria
    };

    const result = SignupFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain("Be at least 8 characters long", "Contain at least one letter.", "Contain at least one special character.");
    }
  });
});
