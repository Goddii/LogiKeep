from unittest.mock import patch
from app.external_api import get_product_by_barcode

@patch('app.external_api.requests.get')
def test_get_product_by_barcode_found(mock_get):
    mock_get.return_value.json.return_value = {
        "status": 1,
        "product": {"product_name": "Test Product", "brands": "TestBrand", "ingredients_text": "water"}
    }
    result = get_product_by_barcode("123")
    assert result["product_name"] == "Test Product"

@patch('app.external_api.requests.get')
def test_get_product_by_barcode_not_found(mock_get):
    mock_get.return_value.json.return_value = {"status": 0}
    result = get_product_by_barcode("000")
    assert result is None