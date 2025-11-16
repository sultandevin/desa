import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 200,
  duration: "25s",

  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const payload = JSON.stringify({
    title: "Item Stress Test",
    createdAt: new Date().toISOString(),
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post("http://localhost:3001/create", payload, params);

  check(res, {
    "status 200/201": (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.1);
}
