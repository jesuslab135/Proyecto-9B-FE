import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange}) => {

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

        // El método push sirve poara agregar el valor del i al final del array, modificándolo y devolviendo una nueva longitud del mismo.
        pages.push(i);
    }

    return (
    <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        <button
        // Desabilitado si la página actual es 1 (primera página)
        disabled = {currentPage === 1}
        style={{
            cursor: currentPage === 1 ? "not-allowed" : "pointer"
        }}
        onClick={() => onPageChange(currentPage - 1)}
        >
            Anterior
        </button>

        {pages.map((num) => (
            <button
            key={num}
            style={{
            padding: "0.5rem",
            background: num === currentPage ? "#007bff" : "#eee",
            color: num === currentPage ? "white" : "black",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "fit-content",
            minWidth: "3rem",
            cursor: "pointer",
          }}
            onClick = {() => onPageChange(num)}
            >
                {num}
            </button>
        ))}

        <button
        disabled = {currentPage === totalPages}
        style={{
            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
        }}
        onClick = {() => onPageChange(currentPage + 1)}
        >
            Siguiente
        </button>
    </div>
)
}



export default Pagination;