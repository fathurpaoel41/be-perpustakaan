class DateFormatter {
  generateTimeNow() {
    // Mendapatkan tanggal saat ini dalam format YYYY-MM-DD
    const currentDate = new Date().toISOString().slice(0, 10);

    // Atau, jika Anda ingin menghasilkan tanggal tertentu
    const specifiedDate = new Date(2024, 3, 8).toISOString().slice(0, 10); // 2024-04-08

    // Menggunakan fungsi formatDate
    const formattedDate = this.formatDate(new Date());
    console.log(formattedDate); // Output: 2024-04-08

    return formattedDate;
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

module.exports = DateFormatter;