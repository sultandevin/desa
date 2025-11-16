import http from "k6/http";
import { check, group, sleep } from "k6";

// Smoke test - minimal load to verify endpoints work
export const options = {
  vus: 1, // 1 virtual user
  duration: "30s", // Run for 30 seconds
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% requests < 1.5s
    http_req_failed: ["rate<0.01"], // Error rate < 1%
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

export default function () {
  group("Health Check", () => {
    const res = http.get(`${BASE_URL}/api/rpc/api-reference/healthcheck`);
    check(res, {
      "healthcheck status 200": (r) => r.status === 200,
      "healthcheck returns OK": (r) => r.body === "OK",
    });
  });

  sleep(1);

  group("Assets Endpoint", () => {
    const res = http.get(
      `${BASE_URL}/api/rpc/api-reference/assets?pageSize=10`,
    );
    check(res, {
      "assets status 200": (r) => r.status === 200,
      "assets returns data": (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.data !== undefined;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);

  group("Damage Reports Endpoint", () => {
    const res = http.get(
      `${BASE_URL}/api/rpc/api-reference/damage-reports?limit=10&offset=0`,
    );
    check(res, {
      "damage reports status 200": (r) => r.status === 200,
      "damage reports returns array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch  {
          return false;
        }
      },
    });
  });

  sleep(1);
}
