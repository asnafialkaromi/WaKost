const formatToIDR = (amount) => {
    if (isNaN(amount)) {
        return 'Invalid number';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(amount);
};

export default formatToIDR;
