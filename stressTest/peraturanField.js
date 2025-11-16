import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 200,
  duration: "15s",

  thresholds: {
    http_req_duration: ["p(95)<10000"],
  },
};

export default function () {
  const res = http.get("http://localhost:3001/regulation");

  check(res, {
    "status 200": (r) => r.status === 200,
  });

  sleep(0.2);
}
