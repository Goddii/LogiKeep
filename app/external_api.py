import requests

HEADERS = {"User-Agent": "LogiKeepInventoryApp/1.0"}

def get_product_by_barcode(barcode):
    url = f'https://world.openfoodfacts.org/api/v2/product/{barcode}.json'
    response = requests.get(url, headers=HEADERS)
    data = response.json()

    if data.get('status') != 1:
        return None

    product = data['product']
    return {
        'product_name' : product['product_name'],
        'brand' : product['brands'],
        'ingredients_text' : product['ingredients_text']
    }

def search_products_by_name(name, limit=5):
    url = f'https://world.openfoodfacts.org/cgi/search.pl'
    params = {'search_terms': name, 'json': 1, 'page_size':limit}
    

    try:
        response = requests.get(url, headers=HEADERS, params = params)
        response.raise_for_status()
        data = response.json()

        results = []

        for item in data.get('products', []):
            product_details = {
                'id': item.get('id'),
                'product_name' : item.get('product_name'),
                'ingredients_text' : item.get('ingredients_text'),
                'brand' : item.get('brands')
            }
            results.append(product_details)
    except requests.exceptions.RequestException as e:
        return [], f"Error occurred while searching for product: {str(e)}"

    return results
      
    




    

    




