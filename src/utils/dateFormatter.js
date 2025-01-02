const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export default formatDate;