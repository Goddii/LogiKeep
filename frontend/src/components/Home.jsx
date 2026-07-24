import Navbar from "./Navbar"
import Stats from "./Stats"
import InventoryToolbar from "./InventoryToolbar"
import { useEffect, useState } from "react"
import ProductGrid from "./ProductGrid"
import AddItemForm from "./AddItemForm"
import ProductDetailsModal from "./ProductDetailsModal"

function Home() {

    const [items, setItems] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState('name')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:5000/inventory')
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error('Error fetching inventory:',err))
    }, [])

    const handleUpdateStock = (id, newStock) => {
        if (newStock < 0) return

        fetch(`http://127.0.0.1:5000/inventory/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({stock: newStock})
        })
        .then((res) => res.json())
        .then(data => {
            setItems(prevItems => prevItems.map(item => item.id === id ? data.product : item))
        })
        .catch(err => console.error('Error updating stock: ', err))
    }

    const handleAddProduct = (newProduct) => {
        setItems((prevItems) => [...prevItems, newProduct])
    }




    const totalCounts = {
        all: items.length,
        out: items.filter(i => i.stock === 0).length,
        low: items.filter(i => i.stock > 0 && i.stock < 15).length,
        ok: items.filter(i => i.stock >= 15).length,
    }
    return(
        <div className="bg-[#0b0f19] min-h-screen">
            
            <Navbar onCreateClick={() => setIsModalOpen(true)}/>
            <div className="mx-auto max-w-7xl px-6 py-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Stock Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage and track your retail inventory in real time.
                </p>
            
                <div className="mt-6">
                     <Stats items={items}/>
                </div>
                        
           
                <div className="mt-6">
                    <InventoryToolbar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeFilter={activeFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        totalCounts={totalCounts}
                    />

                </div>

                <div className="mt-6">
                    <ProductGrid 
                        items={items}
                        searchTerm={searchTerm}
                        activeFilter={activeFilter}
                        sortBy={sortBy}
                        onUpdateStock={handleUpdateStock}
                        onViewDetails={setSelectedItem}
                    />
                
                </div>
            </div>

            <AddItemForm 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddProduct={handleAddProduct}

            />
            <ProductDetailsModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    )
}

export default Home