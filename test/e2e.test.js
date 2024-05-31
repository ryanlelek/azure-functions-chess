// Modules
const request = require("supertest");

// You can change this to your deployment
// Normally this would be a separate test suite
const api_prefix = "https://tf-chess.azurewebsites.net";

// These have 45-second timeouts to allow cold-start "wakeup" time
const timeout = 45 * 1000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let operationId = "";
describe("Deployed API", () => {
  describe("POST /api/knightpath", () => {
    it(
      "should provide operationId on success",
      async () => {
        const res = await request(api_prefix).post(
          "/api/knightpath?source=A1&target=D5",
        );
        expect(res.statusCode).toEqual(201);
        // Split on space due to spec response
        // This would be easier if JSON
        // "Operation Id IDHERE was created..."
        const message = res.text.split(" ");
        operationId = message[2];
      },
      timeout,
    );
  });
  describe("GET /api/knightpath", () => {
    it(
      "should provide moves on success",
      async () => {
        // Wait a bit for processing
        await wait(20 * 1000);
        const res = await request(api_prefix).get(
          "/api/knightpath?operationId=" + operationId,
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          operationId,
          starting: "A1",
          ending: "D5",
          shortestPath: "A1:C2:B4:D5",
          shortestPaths: ["A1:C2:B4:D5", "A1:C2:E3:D5"],
          numberOfMoves: 3,
        });
      },
      timeout,
    );
  });
});
