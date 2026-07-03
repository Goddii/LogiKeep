import Navbar from "./Navbar"
import Stats from "./Stats"
import InventoryToolbar from "./InventoryToolbar"
import { useEffect, useState } from "react"
import ProductGrid from "./ProductCard"

function Home() {

    const [items, setItems] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState('name')

    const handleUpdateStock = (id, newStock) => {
        if (newStock < 0) return

        fetch(`http://127.0.0.1.5004/inventory/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({stock: newStock})
        })
        .then(res = res.json())
        .then(updatedItem => {
            setItems(prevItems => prevItems.map(item => item.id === id ? updatedItem : item))
        })
        .catch(err => console.error('Error updating stock: ', err))
    }




    const totalCounts = {
        all: items.length,
        out: items.filter(i => i.stock === 0).length,
        low: items.filter(i => i.stock > 0 && i.stock < 15).length,
        ok: items.filter(i => i.stock >= 15).length,
    }
    return(
        <div>
            <Navbar />
            <br />
            <Stats items={items}/>
            <br />
            <InventoryToolbar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeFilter={activeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalCounts={totalCounts}
            />
            <br />
            <ProductGrid 
                items={items}
                searchTerm={searchTerm}
                activeFilter={activeFilter}
                sortBy={sortBy}
                // onUpdateStock={handleUpdateStock}
            
            />
        </div>
    )
}

export default Home