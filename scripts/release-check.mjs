import { pathToFileURL } from 'node:url';

export function releaseBlockers(evidence) {
  const requirements = {
    contentApproved: 'Approved card export, artwork and translations are missing.',
    commerceApproved: 'Approved prices, shipping, payee and fulfillment terms are missing.',
    backendVerified: 'Transactional Supabase order flow has not been implemented and verified.',
    privacyApproved: 'Privacy, consent, retention and support details require approval.',
  };
  return Object.entries(requirements)
    .filter(([key]) => evidence[key] !== true)
    .map(([, description]) => description);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // This checkpoint has no approved production evidence. Never infer readiness
  // from a successful build, local preview, or the presence of environment keys.
  const blockers = releaseBlockers({});
  console.error('Production release: BLOCKED');
  blockers.forEach((reason) => console.error(`- ${reason}`));
  process.exitCode = 1;
}
