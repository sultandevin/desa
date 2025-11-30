import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "10s", target: 100 },
    { duration: "10s", target: 150 },
    { duration: "10s", target: 200 },
    { duration: "10s", target: 300 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  const res = http.get("http://localhost:3001/dashboard");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(0.1);
}
