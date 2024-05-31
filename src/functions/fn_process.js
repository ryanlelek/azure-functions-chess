// Modules
const { app } = require("@azure/functions");
const storage = require("../lib/storage.js");
const chess = require("../lib/chess.js");

// https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-trigger
// https://github.com/Azure/azure-functions-nodejs-samples/blob/main/js/src/functions/storageBlobTrigger1.js
// https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage
// https://portal.azure.com/#browse/Microsoft.Storage%2FStorageAccounts
app.storageBlob("storageBlobTrigger", {
  path: "processing/{name}",
  connection: "AzureWebJobsStorage",
  // blob parameter is a buffer
  handler: async (blob, context) => {
    context.log(
      `FN_PROCESS START ${context.triggerMetadata.name} size ${blob.length} bytes`,
    );
    // Parse the JSON file
    const jsonBody = JSON.parse(blob.toString());

    // Note: We could cache this map somewhere, like a JSON file in storage
    // It is only because of the small map space (8x8) of a
    // chess board are we able to calculate this on the fly
    // as well as with a simple algorithm.
    // However: Network latency is probably more than recalculating
    // and best to not over-engineer solutions until necessary
    //
    // If the problem/map space is large, we could cache individual
    // requests SOURCE=>TARGET and leverage that. It depends!
    const move_map = chess.generate_move_map();

    // Let's use the map to find our paths
    const paths = chess.find_valid_paths(
      move_map,
      jsonBody.source,
      jsonBody.target,
    );
    const move_count = paths[0].length - 1;
    const returnable = paths.map((path) => {
      return path.join(":");
    });

    // Add in processed data
    jsonBody.processed = {
      operationId: jsonBody.operationId,
      // These are renamed, for some reason...?
      starting: jsonBody.source,
      ending: jsonBody.target,
      shortestPath: returnable[0],
      // Added this, seems to make more sense.
      // The "string only" version is above if preferred
      // Depends on situation and context
      shortestPaths: returnable,
      numberOfMoves: move_count,
    };
    const content = JSON.stringify(jsonBody);

    // Save updated data to Azure Storage
    const uploadBlobResponse = await storage
      .file("processed", context.triggerMetadata.name)
      .upload(content, content.length);

    context.log("FN_PROCESS OK");
    return;
  },
});
