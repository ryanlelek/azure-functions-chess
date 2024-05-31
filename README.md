# Azure Functions Chess

## Design Choices

The problem/map space of a chess board is "known" and limited (8x8 grid).  
So, the pathfinding algorithm is simple and tailored to this case.  
Some caching could be used to store all possible moves.  
However, due to network latency, it's likely faster to compute all moves than load from storage.  
I have left the full map generation in the worker to make it easier to cache.

If the problem/data set grows, we can instead compute only the two points and cache by that as a key to prevent spending too much time/resources.

For deployment, Azure Serverless Functions were used as requested.  
Terraform/OpenTofu was used to ensure a repeatable deployment instead of CLI, IDE, or Console setup.  
These are included for completeness but are not required.

## Live Deployment

- POST [https://tf-chess.azurewebsites.net/api/knightpath?source=B2&target=H6](https://tf-chess.azurewebsites.net/api/knightpath?source=B2&target=H6)
- GET [https://tf-chess.azurewebsites.net/api/knightpath?operationId=PUTIDHERE](https://tf-chess.azurewebsites.net/api/knightpath?operationId=PUTIDHERE)

## Installation

- Node.js is required (v20.x LTS) [download installer](https://nodejs.org/en/download/package-manager) or run `choco install nodejs-lts`
- Optionally, Terraform/OpenTofu are required for automating deployment (see below)

```bash
npm install;
```

## Running Tests (Unit/E2E)

This will run an E2E test on the live deployment and local code.  
Tests will take about a minute to execute due to waiting for E2E to process.

```bash
npm install;
npm test;
```

## Running Locally

### Azurite Storage

Starting local Azure Storage emulator (Azurite) [Documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite)

If you're having issues, you may already be running Azurite in the background. It should still be ok to proceed.

```bash
mkdir storage;
.\node_modules\.bin\azurite -s -l storage;
```

### Storage Explorer (Optional, Recommended)

You'll probably want to use the Storage Explorer to view files stored in Azurite

- [Download Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/)
- [Azurite GitHub Details](https://github.com/Azure/Azurite?tab=readme-ov-file#storage-explorer)

### Code Itself

```bash
npm install;
npm start -- --verbose;
```

The code should now be running locally on endpoint `http://localhost:7071/api/knightpath`

## Want to Deploy Your Own?

This will deploy into Microsoft Azure.  
You're expected to know how to sign up, sign in, and authenticate with your Azure account.

### Creating Local ZIP for Deploy

We need to create a .zip file with all the code to use in deployment.

#### Windows

```powershell
rm ./deploy.zip; Compress-Archive -Path src,package.json,host.json,node_modules,package-lock.json -DestinationPath deploy.zip
```

#### Linux/Unix/macOS

```bash
rm deploy.zip; zip --recurse-paths --include "src/*" "package.json" "host.json" "node_modules/*" "package-lock.json" @ deploy.zip .
```

### Terraform/OpenTofu

OpenTofu is a Terraform replacement. Install at [OpenTofu.org](https://opentofu.org/docs/intro/install/) or `choco install opentofu`

```bash
cd devops
tofu init
tofu apply
```

### Integrating with GitHub Actions (CI/CD Pipeline)

1. Download "Publish Profile" from the Azure Function Dashboard (click your deployed function name)
1. Go to GitHub repository => Settings => Secrets and Variables => Actions
1. Link is [https://github.com/YOURNAME/YOURREPO/settings/secrets/actions](https://github.com/YOURNAME/YOURREPO/settings/secrets/actions)
1. Add full contents of Publish Profile to Variable "AZURE_FUNCTIONAPP_PUBLISH_PROFILE"
