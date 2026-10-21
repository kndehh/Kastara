import { pathToFileURL, fileURLToPath } from 'node:url';

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];

export function checkContractMetadata(document) {
  const problems = [];
  if (document.info?.['x-status'] !== 'BLOCKED') problems.push('Draft info must state BLOCKED');
  if (!Array.isArray(document.servers) || document.servers.length !== 0) {
    problems.push('Draft servers must be empty; no deployed API is available');
  }
  for (const [path, item] of Object.entries(document.paths ?? {})) {
    for (const method of METHODS) {
      const operation = item[method];
      if (operation && operation['x-status'] !== 'BLOCKED') {
        problems.push(`${method.toUpperCase()} ${path} must state BLOCKED`);
      }
    }
  }
  return problems;
}

async function main() {
  const { default: SwaggerParser } = await import('@apidevtools/swagger-parser');
  const path = fileURLToPath(new URL('../public/api/openapi.yaml', import.meta.url));
  const document = await SwaggerParser.validate(path);
  const problems = checkContractMetadata(document);
  if (problems.length) throw new Error(problems.join('\n'));
  const operations = Object.values(document.paths).reduce(
    (count, item) => count + METHODS.filter((method) => item[method]).length, 0,
  );
  console.log(`OpenAPI 3.0.3 valid: ${operations} documented draft operations. API implementation: BLOCKED.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
