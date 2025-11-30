import http from "k6/http";

export default function () {
  const res = http.get("http://localhost:3001/...");

  console.log("STATUS:", res.status, "BODY:", res.body);
}
