import "./Search_bar.css";

const Search_bar = () => {
    return ( 
        <>
        <div className="container">
            <div className="search-bar-container">
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Buscar usuario por nombre, email o rol..." />

                </div>
                <div className="nvo-usuario-btn">
                    <p>Crear nuevo usuario</p>
                    <i className="fas fa-plus-circle"></i>
                </div>


            </div>
        </div>
            
        </>
    )
}

export default Search_bar;