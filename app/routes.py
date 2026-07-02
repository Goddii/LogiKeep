from flask import Blueprint, jsonify
from app.data import inventory



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
        

