// Modules
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

// Initialize Client
const client = BlobServiceClient.fromConnectionString(
  // You can also use
  // process.env.ConnectionString
  // but we tag along with the credentials
  // set on AzureWebJobsStorage (function logs)
  process.env.AzureWebJobsStorage,
);

// WARNING! This method is only useful for small files
// We control the file contents so can use this method
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", (error) => reject(error));
  });
}

// Azure Storage File Handle
function file(container, file) {
  // .getBlobClient() is also available
  return client.getContainerClient(container).getBlockBlobClient(file);
}

module.exports = exports = {
  client,
  streamToString,
  file,
};
