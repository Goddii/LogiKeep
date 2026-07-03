import Navbar from "./Navbar"
import Stats from "./Stats"
import InventoryToolbar from "./InventoryToolbar"
import { useEffect, useState } from "react"

function Home() {

    const [items, setItems] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState('name')




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
            <Stats />
            <br />
            <InventoryToolbar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeFilter={activeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalCounts={totalCounts}
            />
        </div>
    )
}

export default Home