import assert from 'node:assert/strict';
import test from 'node:test';
import { checkContractMetadata } from './openapi-check.mjs';

test('accepts explicitly blocked documentation with no live server', () => {
  assert.deepEqual(checkContractMetadata({
    openapi: '3.0.3', info: { title: 'Test contract', version: '0.1.0', 'x-status': 'BLOCKED' },
    servers: [], paths: { '/create-po': { post: { 'x-status': 'BLOCKED', operationId: 'createPo' } } },
  }), []);
});

test('rejects documentation accidentally advertising a server', () => {
  const problems = checkContractMetadata({
    openapi: '3.0.3', info: { 'x-status': 'BLOCKED' },
    servers: [{ url: 'https://example.com' }], paths: {},
  });
  assert.ok(problems.some((problem) => problem.includes('servers')));
});

test('requires every proposed operation to carry blocked status', () => {
  const problems = checkContractMetadata({
    openapi: '3.0.3', info: { 'x-status': 'BLOCKED' }, servers: [],
    paths: { '/create-po': { post: { operationId: 'createPo' } } },
  });
  assert.ok(problems.some((problem) => problem.includes('/create-po')));
});
