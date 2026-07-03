import requests

BASE_URL = "http://127.0.0.1:5004"


def view_inventory():
    try:
        r = requests.get(f'{BASE_URL}/inventory', timeout=5)
        for item in r.json():
            print(f"{item['id']}: {item['product_name']} | stock: {item['stock']} | price: {item['price']}")

    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')

def add_item():
    try:
        product_name = input('Product_name: ')
        brand = input('Brand: ')
        barcode = input('Barcode: ')
        price = input('Price: ')
        stock = input('Stock: ')
        ingredients_text = input('Ingredients: ')

        payload = {
            'product_name': product_name, 'brand': brand, 'barcode': barcode, 'price': price, 'stock': stock, 'ingredients_text': ingredients_text
        }  

        r = requests.post(f"{BASE_URL}/inventory", json=payload, timeout=5)
        print (r.json())
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')

def update_item():
    try:
        item_id = input('Item ID to update: ')
        field = input('Field to update (price/stock): ')
        value = input('New value: ')
        r = requests.patch(f"{BASE_URL}/inventory/{item_id}", json={field: value}, timeout=5)
        print(r.json())
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')


def delete_item():
    try:
        item_id = input('Item ID to delete: ')
        r = requests.delete(f'{BASE_URL}/inventory/{item_id}', timeout= 5)
        print(r.json())
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')


def search_api():
    try:
        choice = input('Search by 1 barcode or 2 name: ')
        if choice == '1':
            barcode = input('Barcode: ')
            r = requests.get(f'{BASE_URL}/inventory/lookup', params={'barcode': barcode}, timeout=5)
        else:
            name = input('Name: ')
            r = requests.get(f'{BASE_URL}/inventory/lookup', params={'name': name}, timeout=5)
        print(r.json())
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')


def main():
    while True:
        print('\n1. View Inventory\n2. Add Items\n3. Update Item\n4.Delete Item\n5.Search External API\n6.Quit')
        choice = input(">")
        if choice == '1': view_inventory()
        elif choice == "2": add_item()
        elif choice == "3": update_item()
        elif choice == "4": delete_item()
        elif choice == "5": search_api()
        elif choice == "6": break
        else: print("Invalid choice")              

if __name__ == "__main__":
    main()


