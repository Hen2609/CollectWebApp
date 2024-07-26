const currency = new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format


module.exports = {
    currency
}