inventory = [
    {
        "id": 1,
        "product_name": "Organic Almond Milk",
        "brand": "Silk",
        "barcode": "0025293001839",
        "price": 350,
        "stock": 20,
        "ingredients_text": "Filtered water, almonds, cane sugar",
    },
    {
        "id": 2,
        "product_name": "Peanut Butter",
        "brand": "Sue's Kitchen",
        "barcode": "0012345000012",
        "price": 250,
        "stock": 15,
        "ingredients_text": "Roasted peanuts, salt",
    },
]


def get_next_id():
    return max((item["id"] for item in inventory), default=0) + 1