import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 150,
  duration: "20s",

  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<3000"],
  },
};

export default function () {
  const res = http.get("http://localhost:3001/search?keyword=fulltext");

  check(res, {
    "status 200": (r) => r.status === 200,
  });

  sleep(0.2);
}
