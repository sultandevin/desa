# DESA API Stress Testing Guide

Comprehensive stress testing documentation for DESA API endpoints using Grafana k6.

## Overview

This directory contains stress tests for DESA API endpoints using Grafana k6. Tests run via Docker, no local k6 installation required.

**Tested Endpoints:**
- `/api/rpc/assets` - Asset inventory listing with cursor pagination
- `/api/rpc/damage-reports` - Damage reports with offset pagination

## Prerequisites

1. **Docker** - Running and accessible
2. **DESA API** - Running on `http://localhost:3001` (or custom URL)
3. **Database** - Populated with test data for meaningful results

## Quick Start

### 1. Ensure API is Running

```bash
# From project root
bun dev
```

API should be available at `http://localhost:3001`

### 2. Run Smoke Test (Quick Validation)

```bash
cd k6
./run-tests.sh smoke
```

This runs a minimal load test (1 user, 30s) to verify endpoints work.

### 3. Run Full Stress Tests

```bash
# Assets endpoint only
./run-tests.sh assets

# Damage reports endpoint only
./run-tests.sh damage-reports

# Combined test (both endpoints)
./run-tests.sh combined

# All tests sequentially
./run-tests.sh all
```

## Test Files

### `smoke-test.js`
- **Load:** 1 VU (Virtual User) for 30s
- **Purpose:** Quick validation that endpoints respond correctly
- **Tests:**
  - Health check endpoint
  - Assets listing (10 items)
  - Damage reports listing (10 items)
- **Thresholds:**
  - p99 response time < 1500ms
  - Error rate < 1%

### `assets-stress-test.js`
- **Load:** Ramps 0→10→50→100 users over 5 minutes
- **Tests:**
  - Assets listing without query
  - Assets search with query parameter
  - Cursor-based pagination
- **Thresholds:**
  - p95 response time < 500ms
  - p99 response time < 1000ms
  - Error rate < 10%

### `damage-reports-stress-test.js`
- **Load:** Ramps 0→10→50→100 users over 5 minutes
- **Tests:**
  - Damage reports with default pagination
  - Variable page sizes (10, 25, 50)
  - Offset-based pagination
- **Thresholds:**
  - p95 response time < 500ms
  - p99 response time < 1000ms
  - Error rate < 10%

### `combined-stress-test.js`
- **Load:** Ramps 0→20→75→150 users over 5 minutes
- **Tests:**
  - Mixed workload (50% assets, 50% damage reports)
  - Simulates realistic usage patterns
- **Metrics:**
  - Separate error rates for each endpoint
  - Combined performance metrics
- **Thresholds:**
  - p95 response time < 600ms
  - p99 response time < 1200ms
  - Error rate < 10% per endpoint

## Manual Docker Commands

### Run Specific Test

```bash
docker run --rm \
  --network host \
  -v "$(pwd):/k6" \
  -e BASE_URL=http://localhost:3001 \
  grafana/k6:latest \
  run /k6/smoke-test.js
```

### Run with Custom Base URL

```bash
BASE_URL=http://example.com:8080 ./run-tests.sh assets
```

Or with Docker directly:

```bash
docker run --rm \
  --network host \
  -v "$(pwd):/k6" \
  -e BASE_URL=http://example.com:8080 \
  grafana/k6:latest \
  run /k6/assets-stress-test.js
```

### Save Results to File

```bash
docker run --rm \
  --network host \
  -v "$(pwd):/k6" \
  -e BASE_URL=http://localhost:3001 \
  grafana/k6:latest \
  run /k6/combined-stress-test.js \
  --out json=results/output.json
```

## Understanding Results

### Key Metrics

- **http_req_duration** - Response time (avg, min, max, p95, p99)
- **http_reqs** - Total requests and requests/second
- **http_req_failed** - Failed request percentage
- **checks** - Assertion pass/fail rate
- **vus** - Virtual users (concurrent load)

### Sample Output

```
✓ checks.........................: 98.50% ✓ 394 ✗ 6
  data_received..................: 2.45 MB
  data_sent......................: 45.23 KB
  http_req_duration..............: avg=125.45ms min=45.23ms med=98.67ms max=450.12ms p(95)=245.67ms p(99)=389.45ms
  http_reqs......................: 400 8.52/s
  iterations.....................: 200
  vus............................: 100 min=1 max=100
```

### Threshold Failures

If thresholds fail, output shows:

```
✗ http_req_duration............: p(95)=650.23ms (threshold: p(95)<500ms)
```

This indicates performance degradation - investigate:
1. Database query performance
2. Server resource constraints
3. Network latency
4. Data volume issues

## Interpreting Test Results

### ✅ Good Results
- Checks > 95% passing
- p95 response times < threshold
- Error rate < 5%
- Consistent performance across load stages

### ⚠️ Warning Signs
- Checks 90-95% passing
- p95 approaching thresholds
- Error rate 5-10%
- Response times increasing with load

### ❌ Performance Issues
- Checks < 90% passing
- p95/p99 exceeding thresholds
- Error rate > 10%
- Exponential response time growth

## Customizing Tests

### Modify Load Profile

Edit `options.stages` in test files:

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp to 50 users
    { duration: '3m', target: 200 },  // Ramp to 200 users
    { duration: '2m', target: 200 },  // Hold at 200 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
};
```

### Adjust Thresholds

```javascript
thresholds: {
  http_req_duration: ['p(95)<300', 'p(99)<800'],
  http_req_failed: ['rate<0.05'],  // 5% max error rate
}
```

### Add Custom Checks

```javascript
check(res, {
  'custom check name': (r) => {
    const body = JSON.parse(r.body);
    return body.someField === expectedValue;
  },
});
```

## Troubleshooting

### Docker Network Issues (Linux/WSL)

If `host.docker.internal` doesn't work:

```bash
# Use host network mode (Linux)
docker run --rm \
  --network host \
  -v "$(pwd):/k6" \
  -e BASE_URL=http://localhost:3001 \
  grafana/k6:latest \
  run /k6/smoke-test.js
```

### API Not Responding

```bash
# Check if API is running
curl http://localhost:3001/api/rpc/healthcheck

# Should return: OK
```

### Empty Data Responses

Ensure database has test data:

```bash
# From project root
bun db:studio

# Check tables: asset, damage_report
```

### Permission Errors

```bash
# Make script executable
chmod +x k6/run-tests.sh
```

## Advanced Usage

### CI/CD Integration

```yaml
# .github/workflows/stress-test.yml
name: Stress Tests
on: [push]
jobs:
  stress-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: docker-compose up -d
      - name: Run k6 tests
        run: |
          cd k6
          ./run-tests.sh smoke
```

### Load Test Scenarios

**Spike Test** - Sudden load increase:
```javascript
stages: [
  { duration: '10s', target: 0 },
  { duration: '10s', target: 200 },  // Spike
  { duration: '3m', target: 200 },
  { duration: '10s', target: 0 },
]
```

**Soak Test** - Sustained load:
```javascript
stages: [
  { duration: '5m', target: 50 },
  { duration: '4h', target: 50 },   // Long duration
  { duration: '5m', target: 0 },
]
```

**Stress Test** - Find breaking point:
```javascript
stages: [
  { duration: '2m', target: 100 },
  { duration: '5m', target: 200 },
  { duration: '5m', target: 400 },  // Push limits
  { duration: '5m', target: 800 },
  { duration: '10m', target: 1600 },
]
```

## Results Storage

Test results are saved to `k6/results/`:
- `*.json` - Detailed metrics in JSON format
- Git-ignored to avoid bloating repository

To persist results:
```bash
docker run --rm \
  --network host \
  -v "$(pwd):/k6" \
  grafana/k6:latest \
  run /k6/combined-stress-test.js \
  --out json=/k6/results/test-$(date +%Y%m%d-%H%M%S).json
```

## Best Practices

1. **Start Small** - Run smoke test before stress tests
2. **Baseline First** - Establish performance baseline with known data
3. **Realistic Data** - Populate database with production-like volumes
4. **Monitor Resources** - Watch CPU/memory during tests
5. **Incremental Load** - Don't jump straight to max load
6. **Isolate Tests** - Don't run on production
7. **Document Findings** - Record baseline metrics and regressions

## Performance Targets

Based on current thresholds:

| Metric | Target | Critical |
|--------|--------|----------|
| p95 response time | < 500ms | < 1000ms |
| p99 response time | < 1000ms | < 2000ms |
| Error rate | < 5% | < 10% |
| Throughput | > 10 req/s | > 5 req/s |

## Next Steps

1. **Run baseline tests** with current implementation
2. **Record results** for comparison
3. **Optimize bottlenecks** identified by tests
4. **Re-test** to validate improvements
5. **Set up monitoring** for production

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 Load Testing Guide](https://k6.io/docs/testing-guides/)
- [Docker Hub - k6](https://hub.docker.com/r/grafana/k6)
- [Grafana Cloud k6](https://grafana.com/products/cloud/k6/) - For advanced metrics/dashboards
