// Modules
const { app, output } = require("@azure/functions");
const _ = require("lodash");
const storage = require("../lib/storage.js");
const chess = require("../lib/chess.js");

// Documentation
// https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
// https://learn.microsoft.com/en-us/javascript/api/overview/azure/storage-blob-readme
app.http("fn_request", {
  route: "knightpath",
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (req, context) => {
    context.log("FN_REQUEST START");

    // Initialize our response
    const res = {
      status: 201,
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
      // Note: This data will be saved in the request file
      jsonBody: {
        operationId: context.invocationId,
      },
    };

    // Input Query Parameters
    const source = req.query.get("source");
    const target = req.query.get("target");

    // Validate Input
    // We are not going to attempt sanitization
    // and instead will simply fail the request
    if (!source || !_.isString(source) || !chess.valid_notation(source)) {
      res.status = 400;
      res.jsonBody.error = {
        message: "source is invalid notation. Examples: A1, D8",
      };
      context.log("FN_REQUEST ERR PARAM SOURCE");
      return res;
    }
    if (!target || !_.isString(target) || !chess.valid_notation(target)) {
      res.status = 400;
      res.jsonBody.error = {
        message: "target is invalid notation. Examples: C2, B4",
      };
      context.log("FN_REQUEST ERR PARAM TARGET");
      return res;
    }
    // Update Response
    res.jsonBody.source = source;
    res.jsonBody.target = target;
    const content = JSON.stringify(res.jsonBody);

    // Save data to Azure Storage
    const uploadBlobResponse = await storage
      .file("processing", context.invocationId + ".json")
      .upload(content, content.length);
    context.log("FN_REQUEST OK UPLOADED", uploadBlobResponse.operationId);

    // Doing this to meet the spec. Probably should return JSON
    // consistently or use the Accept headers to make this choice
    delete res.jsonBody;
    res.body = `Operation Id ${context.invocationId} was created. Please query it to find your results.`;

    return res;
  },
});
