import { check, group, sleep } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const assetsErrorRate = new Rate("assets_errors");
const damageReportsErrorRate = new Rate("damage_reports_errors");

// Test configuration
export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up to 20 users
    { duration: "1m", target: 75 }, // Ramp up to 75 users
    { duration: "2m", target: 150 }, // Ramp up to 150 users
    { duration: "1m", target: 150 }, // Stay at 150 users
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<600", "p(99)<1200"],
    http_req_failed: ["rate<0.1"],
    errors: ["rate<0.1"],
    assets_errors: ["rate<0.1"],
    damage_reports_errors: ["rate<0.1"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

export default function () {
  // Simulate mixed workload - assets and damage reports
  const scenario = Math.random();

  if (scenario < 0.5) {
    // 50% chance - Test Assets endpoints
    group("Assets API", () => {
      const res = http.get(`${BASE_URL}/api/rpc/api-reference/assets`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const success = check(res, {
        "assets status 200": (r) => r.status === 200,
        "assets valid response": (r) => {
          try {
            const body = JSON.parse(r.body);
            return body.data !== undefined && body.nextCursor !== undefined;
          } catch (_e) {
            return false;
          }
        },
      });

      if (!success) {
        errorRate.add(1);
        assetsErrorRate.add(1);
      }
    });
  } else {
    // 50% chance - Test Damage Reports endpoints
    group("Damage Reports API", () => {
      const res = http.get(
        `${BASE_URL}/api/rpc/api-reference/damage-reports`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const success = check(res, {
        "damage reports status 200": (r) => r.status === 200,
        "damage reports valid response": (r) => {
          try {
            const body = JSON.parse(r.body);
            return Array.isArray(body);
          } catch (_e) {
            return false;
          }
        },
      });

      if (!success) {
        errorRate.add(1);
        damageReportsErrorRate.add(1);
      }
    });
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    "k6/results/combined-stress-test-summary.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options?.indent || "";
  let summary = "\n========= Combined Stress Test Results =========\n";

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

  if (data.metrics.assets_errors) {
    summary += `${indent}  assets_errors..................: ${(data.metrics.assets_errors.values.rate * 100).toFixed(2)}%\n`;
  }
  if (data.metrics.damage_reports_errors) {
    summary += `${indent}  damage_reports_errors..........: ${(data.metrics.damage_reports_errors.values.rate * 100).toFixed(2)}%\n`;
  }

  summary += "=================================================\n";

  return summary;
}
