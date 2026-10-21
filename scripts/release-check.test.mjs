import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseBlockers } from './release-check.mjs';

test('a local UI never implies production checkout is ready', () => {
  const blockers = releaseBlockers({
    contentApproved: false, commerceApproved: false,
    backendVerified: false, privacyApproved: false,
  });
  assert.equal(blockers.length, 4);
});

test('missing evidence fails closed', () => {
  assert.equal(releaseBlockers({}).length, 4);
});

test('complete evidence removes the readiness blockers', () => {
  assert.deepEqual(releaseBlockers({
    contentApproved: true, commerceApproved: true,
    backendVerified: true, privacyApproved: true,
  }), []);
});
