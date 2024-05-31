
resource "azurerm_storage_account" "chess" {
  name                     = "chessfiles"
  resource_group_name      = azurerm_resource_group.chess.name
  location                 = azurerm_resource_group.chess.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Stores request information for processing
resource "azurerm_storage_container" "chess_processing" {
  name                  = "processing"
  storage_account_name  = azurerm_storage_account.chess.name
  container_access_type = "private"
}

# Stores final results
resource "azurerm_storage_container" "chess_processed" {
  name                  = "processed"
  storage_account_name  = azurerm_storage_account.chess.name
  container_access_type = "private"
}

resource "azurerm_storage_management_policy" "chess_storage_management_policy" {
  storage_account_id = azurerm_storage_account.chess.id
  rule {
    name    = "temporary"
    enabled = true
    filters {
      prefix_match = ["processing", "processed"]
      blob_types   = ["blockBlob"]
    }
    actions {
      snapshot {
        delete_after_days_since_creation_greater_than = 1
      }
      version {
        delete_after_days_since_creation = 1
      }
    }
  }
}
