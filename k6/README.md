# k6 Stress Tests

Quick reference for running stress tests. See `/TESTING.md` for full documentation.

## Quick Start

```bash
# Ensure API is running first
cd ..
bun dev

# In new terminal, run tests
cd k6
./run-tests.sh smoke
```

## Available Tests

```bash
./run-tests.sh smoke           # Quick validation (30s, 1 user)
./run-tests.sh assets          # Assets endpoint stress test
./run-tests.sh damage-reports  # Damage reports stress test
./run-tests.sh combined        # Both endpoints, mixed load
./run-tests.sh all             # All tests sequentially
```

## Custom Base URL

```bash
BASE_URL=http://example.com:8080 ./run-tests.sh assets
```

## Test Files

- `smoke-test.js` - Minimal load, quick validation
- `assets-stress-test.js` - Assets endpoint, 0→100 users
- `damage-reports-stress-test.js` - Damage reports, 0→100 users
- `combined-stress-test.js` - Mixed load, 0→150 users

## Results

Results saved to `results/*.json` (git-ignored)

## Endpoints Tested

- `GET /api/rpc/assets?pageSize=N&query=X`
- `GET /api/rpc/damage-reports?limit=N&offset=X`

## Troubleshooting

**API not responding?**
```bash
curl http://localhost:3001/api/rpc/healthcheck
```

**Docker not running?**
```bash
docker info
```

**Permission errors?**
```bash
chmod +x run-tests.sh
```

Full docs: `/TESTING.md`
