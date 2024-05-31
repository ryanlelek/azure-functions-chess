
resource "azurerm_service_plan" "chess" {
  name                = "chess-service-plan"
  resource_group_name = azurerm_resource_group.chess.name
  location            = azurerm_resource_group.chess.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_application_insights" "chess" {
  name                = "chess-appinsights"
  location            = azurerm_resource_group.chess.location
  resource_group_name = azurerm_resource_group.chess.name
  application_type    = "web"
}

# https://azure.microsoft.com/en-us/pricing/details/app-service/linux/
# https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app
resource "azurerm_linux_function_app" "chess" {
  name                = "tf-chess"
  resource_group_name = azurerm_resource_group.chess.name
  location            = azurerm_resource_group.chess.location

  storage_account_name       = azurerm_storage_account.chess.name
  storage_account_access_key = azurerm_storage_account.chess.primary_access_key
  #primary_connection_string
  service_plan_id = azurerm_service_plan.chess.id
  zip_deploy_file = "../deploy.zip"

  site_config {
    # Not available on free plan
    always_on = false
    application_stack {
      node_version = "20"
    }
    minimum_tls_version                    = "1.2"
    application_insights_connection_string = azurerm_application_insights.chess.connection_string
    application_insights_key               = azurerm_application_insights.chess.instrumentation_key
  }
  app_settings = {
    WEBSITE_RUN_FROM_PACKAGE = 1
    AzureWebJobsFeatureFlags = "EnableWorkerIndexing"
  }
}
