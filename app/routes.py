from flask import Blueprint, jsonify, request
from app.data import inventory, get_next_id
from app.external_api import get_product_by_barcode, search_products_by_name




bp = Blueprint('get_inventory', __name__)

@bp.route('/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory)


@bp.route('/inventory/<int:item_id>', methods=['GET'])
def get_inventory_item(item_id):

    product = next((item for item in inventory if item['id'] == item_id), None)

    if product:
        return jsonify(product), 200
    return jsonify({'error':'item not found'}), 404   

@bp.route('/inventory', methods=['POST'])
def create_product():
    data = request.get_json()
    new_id = get_next_id()
    required = ['product_name','brand','barcode','price','stock','ingredients_text']
    

    if not data:
            return jsonify({'error':'No data provided'}), 400  

    for field in required:
        if not data.get(field):
            return jsonify({'error':f'{field} is required'}), 400

          

    product = {
        'id': new_id,
        'product_name': data['product_name'].strip(),
        'brand': data['brand'].strip(),
        'barcode': data['barcode'].strip(),
        'price': float(data['price']),
        'stock': int(data['stock']),
        'ingredients_text': data['ingredients_text'].strip()
    }

    inventory.append(product)        

    return jsonify ({
        'message': 'product added successfully',
        'product': product
    }), 201   


@bp.route('/inventory/<int:item_id>', methods=['PATCH'])
def update_product(item_id):
    data = request.get_json()

    if not data:
        return jsonify({'error':'No data provided'}), 400

    product = next((item for item in inventory if item['id'] == item_id), None)

    if not product:
        return jsonify({'error':'No product available'}), 404

    product['product_name'] = data.get('product_name', product['product_name'])
    product['brand'] = data.get('brand', product['brand'])
    product['barcode'] = data.get('barcode', product['barcode'])
    product['price'] = float(data.get('price', product['price']))
    product['stock'] = int(data.get('stock', product['stock']))
    product['ingredients_text'] = data.get('ingredients_text', product['ingredients_text'])

    

    return jsonify({ 
        'message': 'product updated successfully',
        'product': product
    }), 200 

@bp.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_product(item_id):
    product = next((item for item in inventory if item['id'] == item_id), None)

    if not product:
        return jsonify({'error':'No product available'}), 404

    inventory.remove(product)

    return jsonify({
        'message': 'product deleted successfully',
        'product': product
    }), 200

@bp.route('/inventory/lookup', methods=['GET'])
def lookup_product():
    barcode = request.args.get('barcode')
    name = request.args.get('name')


    if barcode:
        result = get_product_by_barcode(barcode)
        if not result:
            return jsonify({'error':'Product not found'}), 404
        return jsonify(result), 200

    elif name:
        results = search_products_by_name(name)
        return jsonify(results), 200

    else:
        return jsonify({'error': 'Provide a barcode or name query'}), 400                           

@bp.route('/inventory/from-api', methods=['POST'])
def add_from_api():
    data = request.get_json()
    if not data or not data.get('barcode'):
        return jsonify({'error': 'barcode is required'}), 400

    api_data = get_product_by_barcode(data['barcode'])
    if not api_data:
        return jsonify({'error': 'Product not found in external API'}), 404 

    new_product = {
        'id': get_next_id(),
        'product_name': api_data['product_name'],
        'brand': api_data['brand'],
        'barcode': data['barcode'],
        'price': float(data.get('price', 0)),
        'stock': int(data.get('stock', 0)),
        'ingredients_text': api_data['ingredients_text']
    }

    inventory.append(new_product)
    return jsonify({'message': 'Product added from API', 'product':new_product}), 201       