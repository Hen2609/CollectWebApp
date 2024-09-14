const currency = new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", minimumFractionDigits: 0}).format


module.exports = {
    currency
}