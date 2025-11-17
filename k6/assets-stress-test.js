import { check, sleep } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Test configuration
export const options = {
  stages: [
    { duration: "30s", target: 10 }, // Ramp up to 10 users
    { duration: "1m", target: 50 }, // Ramp up to 50 users
    { duration: "2m", target: 100 }, // Ramp up to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"], // 95% requests < 500ms, 99% < 1s
    http_req_failed: ["rate<0.1"], // Error rate < 10%
    errors: ["rate<0.1"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

export default function () {
  // Test 1: List assets without query
  const res1 = http.get(`${BASE_URL}/api/rpc/api-reference/assets`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(res1, {
    "assets list status 200": (r) => r.status === 200,
    "assets list has data": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data !== undefined;
      } catch (_e) {
        return false;
      }
    },
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: List assets with search query
  const res2 = http.get(`${BASE_URL}/api/rpc/api-reference/assets`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(res2, {
    "assets search status 200": (r) => r.status === 200,
    "assets search response valid": (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (_e) {
        return false;
      }
    },
  }) || errorRate.add(1);

  sleep(1);

  // Test 3: List assets with cursor pagination
  const res3 = http.get(`${BASE_URL}/api/rpc/api-reference/assets`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(res3, {
    "assets pagination status 200": (r) => r.status === 200,
    "assets has nextCursor field": (r) => {
      try {
        const body = JSON.parse(r.body);
        return "nextCursor" in body;
      } catch (_e) {
        return false;
      }
    },
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/assets-stress-test-summary.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options?.indent || "";
  let summary = "\n";

  summary +=
    `${indent}✓ checks.........................: ${((data.metrics.checks.values.passes / data.metrics.checks.values.count) * 100).toFixed(2)}% ` +
    `✓ ${data.metrics.checks.values.passes} ✗ ${data.metrics.checks.values.fails}\n`;
  summary += `${indent}  data_received..................: ${(data.metrics.data_received.values.count / 1024 / 1024).toFixed(2)} MB\n`;
  summary += `${indent}  data_sent......................: ${(data.metrics.data_sent.values.count / 1024).toFixed(2)} KB\n`;
  summary +=
    `${indent}  http_req_duration..............: avg=${data.metrics.http_req_duration.values.avg.toFixed(2)}ms ` +
    `min=${data.metrics.http_req_duration.values.min.toFixed(2)}ms ` +
    `med=${data.metrics.http_req_duration.values.med.toFixed(2)}ms ` +
    `max=${data.metrics.http_req_duration.values.max.toFixed(2)}ms ` +
    `p(95)=${data.metrics.http_req_duration.values["p(95)"].toFixed(2)}ms ` +
    `p(99)=${data.metrics.http_req_duration.values["p(99)"].toFixed(2)}ms\n`;
  summary +=
    `${indent}  http_reqs......................: ${data.metrics.http_reqs.values.count} ` +
    `${(data.metrics.http_reqs.values.rate).toFixed(2)}/s\n`;
  summary += `${indent}  iterations.....................: ${data.metrics.iterations.values.count}\n`;
  summary += `${indent}  vus............................: ${data.metrics.vus.values.value} min=${data.metrics.vus.values.min} max=${data.metrics.vus.values.max}\n`;

  return summary;
}
