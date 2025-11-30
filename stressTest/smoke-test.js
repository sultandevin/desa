import { check, group, sleep } from "k6";
import http from "k6/http";

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

  group("Peraturan Endpoint", () => {
    const res = http.get(
      `${BASE_URL}/api/rpc/api-reference/peraturan?pageSize=10`,
    );
    check(res, {
      "peraturan status 200": (r) => r.status === 200,
      "peraturan returns data": (r) => {
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
}
