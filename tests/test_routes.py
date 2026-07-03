import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_inventory(client):
    res = client.get('/inventory')
    assert res.status_code == 200

def test_get_single_item_not_found(client):
    res = client.get('/inventory/9999')
    assert res.status_code == 404

def test_create_product(client):
    payload = {"product_name": "Test", "brand": "TestBrand", "barcode": "123",
               "price": 10, "stock": 5, "ingredients_text": "test"}
    res = client.post('/inventory', json=payload)
    assert res.status_code == 201

def test_create_product_missing_field(client):
    res = client.post('/inventory', json={"product_name": "Test"})
    assert res.status_code == 400

def test_update_product_not_found(client):
    res = client.patch('/inventory/9999', json={"stock": 5})
    assert res.status_code == 404

def test_delete_product_not_found(client):
    res = client.delete('/inventory/9999')
    assert res.status_code == 404