import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLogin } from '../scripts/utils/validateLogin.js';

const mockUsers = [
  { id: 'u1', name: 'John Doe',   email: 'john@example.com', password: 'password123' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', password: 'ecommerce2024'  },
];

test('returns user when credentials are correct', () => {
  const result = validateLogin(mockUsers, 'john@example.com', 'password123');
  assert.equal(result.id, 'u1');
  assert.equal(result.name, 'John Doe');
});

test('returns second user with correct credentials', () => {
  const result = validateLogin(mockUsers, 'jane@example.com', 'ecommerce2024');
  assert.equal(result.id, 'u2');
});

test('returns null when password is wrong', () => {
  const result = validateLogin(mockUsers, 'john@example.com', 'wrongpassword');
  assert.equal(result, null);
});

test('returns null when email does not exist', () => {
  const result = validateLogin(mockUsers, 'unknown@example.com', 'password123');
  assert.equal(result, null);
});

test('returns null for empty credentials', () => {
  assert.equal(validateLogin(mockUsers, '', ''), null);
  assert.equal(validateLogin(mockUsers, '', 'password123'), null);
  assert.equal(validateLogin(mockUsers, 'john@example.com', ''), null);
});

test('is case-sensitive for email', () => {
  const result = validateLogin(mockUsers, 'JOHN@EXAMPLE.COM', 'password123');
  assert.equal(result, null);
});

test('returns null for empty users list', () => {
  const result = validateLogin([], 'john@example.com', 'password123');
  assert.equal(result, null);
});
