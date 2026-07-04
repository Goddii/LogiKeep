# LogiKeep

LogiKeep is a small inventory management project with a Flask backend, a React + Vite frontend, and a simple Python CLI for inventory operations. It supports local product CRUD, barcode lookup via OpenFoodFacts, and manual or API-assisted item entry.

## Features

- REST API for inventory management
- In-memory inventory data store for quick prototyping
- Barcode lookup via `OpenFoodFacts` external API
- Frontend dashboard with search, filter, sort, and stock controls
- Interactive CLI to view, add, update, delete, and search inventory items
- Pytest coverage for backend routes and external API integration logic

## Tech Stack

- Python 3.12
- Flask
- Flask-CORS
- Requests
- Pytest
- React 19
- Vite
- Tailwind CSS
- Headless UI
- Heroicons

## Repository Structure

- `app/`
  - `__init__.py` — Flask app factory
  - `routes.py` — inventory API endpoints
  - `data.py` — in-memory inventory and ID helper
  - `external_api.py` — OpenFoodFacts integration
- `cli/`
  - `cli.py` — terminal-based inventory client
- `frontend/`
  - React + Vite frontend app
- `tests/`
  - `test_routes.py` — backend route tests
  - `test_external_api.py` — OpenFoodFacts helper tests
- `app.py` — Flask server launcher
- `Pipfile` — Python dependency config

## Getting Started

### Backend

1. Install Python dependencies:

```bash
pipenv install
```

2. Start the Flask backend:

```bash
pipenv run python app.py
```

The API runs on `http://127.0.0.1:5004`.

### Frontend

1. Change into the frontend folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend expects the backend API at `http://127.0.0.1:5004`.

### CLI

The CLI in `cli/cli.py` communicates with the Flask backend on `http://127.0.0.1:5004`.

Run it from the project root:

```bash
python cli/cli.py
```

Use the interactive menu to:

- view inventory
- add items manually
- update stock
- delete items
- search the external API by barcode or name

## API Endpoints

- `GET /inventory` — list all inventory items
- `GET /inventory/<id>` — get a single inventory item
- `POST /inventory` — add a new product
- `PATCH /inventory/<id>` — update an existing product
- `DELETE /inventory/<id>` — remove a product
- `GET /inventory/lookup?barcode=<barcode>` — fetch product info from OpenFoodFacts
- `GET /inventory/lookup?name=<name>` — search OpenFoodFacts by name
- `POST /inventory/from-api` — add a product using external barcode lookup

## Testing

Run tests from the project root:

```bash
pipenv run pytest
```

## Notes

- Inventory is stored in memory (`app/data.py`) and resets when the backend restarts.
- `external_api.py` uses OpenFoodFacts to fetch product details.
- The frontend and CLI expect the Flask backend to be running first.

## Development Tips

- If using the frontend, make sure CORS is enabled by `app.py`.
- For local backend debugging, run `python app.py` from the project root.
- Use the CLI for quick inventory operations without the browser.
