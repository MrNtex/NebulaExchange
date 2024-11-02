
import { testService } from '@/services/firebaseService';
import { expect, test } from '@jest/globals';


const sum = (a: number, b: number) => a + b;

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('adds 5 + 5 to equal 10', () => {
    expect(sum(5, 5)).toBe(10);
});

test('adds -1 + 1 to equal 0', () => {
    expect(sum(-1, 1)).toBe(0);
});

test('adds 0 + 0 to equal 0', () => {
    expect(sum(0, 0)).toBe(0);
});

test('export', () => {
    expect(testService()).toBe('test');
})