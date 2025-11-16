import http from "k6/http";

//tes kalo misal user pake 200 bersamaan
export const options = {
  stages: [
    { duration: "5s", target: 200 }, // naik ke 200 user
    { duration: "25s", target: 200 }, // tahan di 200 user
    { duration: "5s", target: 0 }, // turun
  ],
};

export default function () {
  http.get("http://localhost:3001/dashboard");
}
