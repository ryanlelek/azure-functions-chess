# Before First Run
# terraform init
#
# After Upgrades or Additions
# terraform init -upgrade

terraform {
  required_providers {
    azurerm = {
      # https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
      source  = "hashicorp/azurerm"
      version = "3.106.0"
    }
  }
}

provider "azurerm" {
  skip_provider_registration = true # This is only required when the User, Service Principal, or Identity running Terraform lacks the permissions to register Azure Resource Providers.
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

resource "azurerm_resource_group" "chess" {
  name     = "chess"
  location = "Central US"
}
