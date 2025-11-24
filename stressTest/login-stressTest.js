import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 50 }, // 50
    { duration: "5s", target: 150 }, // naik ke 150
    { duration: "10s", target: 300 }, // naik 300
    { duration: "5s", target: 0 }, // turun balik
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // error harus < 5%
    http_req_duration: ["p(95)<2000"], // 95% response < 2 detik
  },
};

export default function () {
  const url = "http://localhost:3001/login";

  const payload = JSON.stringify({
    email: "ilham@gmail.com",
    password: "muhammadilham99",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
    "response time < 2s": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
