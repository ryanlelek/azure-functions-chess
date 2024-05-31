// Modules
const { app } = require("@azure/functions");
const _ = require("lodash");
const storage = require("../lib/storage.js");
const chess = require("../lib/chess.js");

app.http("fn_result", {
  route: "knightpath",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req, context) => {
    context.log("FN_RESULT START");
    // Initialize Response
    const res = {
      status: 200,
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
      jsonBody: {},
    };

    // Input Query Parameters
    const operationId = req.query.get("operationId");
    if (
      !operationId ||
      !_.isString(operationId) ||
      !chess.valid_uuid(operationId)
    ) {
      res.status = 400;
      res.jsonBody.error = {
        message: "operationId is invalid uuid",
      };
      context.log("FN_REQUEST ERR PARAM OPERATIONID");
      return res;
    }

    try {
      // Read from Azure Storage
      const downloaded = await storage
        .file("processed", operationId + ".json")
        .download();
      const jsonString = await storage.streamToString(
        downloaded.readableStreamBody,
      );
      const jsonData = JSON.parse(jsonString);
      context.log(jsonData);
      res.jsonBody = jsonData.processed;

      // All Went Well
      context.log("FN_RESULT OK");
      context.log(res);
      return res;
    } catch (err) {
      if (err.code === "BlobNotFound") {
        context.log("FN_RESULT ERR NOT_FOUND:", operationId);
        res.status = 404;
        res.jsonBody = {
          error:
            "Operation not found. It may not yet exist or may have been deleted (after 24 hours). Try again in a minute or submit again.",
        };
        return res;
      } else {
        context.log("FN_RESULT ERR UNEXPECTED:", err);
        res.status = 500;
        res.jsonBody = {
          error: "Server Error",
        };
        return res;
      }
    }
  },
});
