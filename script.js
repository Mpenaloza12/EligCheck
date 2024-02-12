function search() {
    var searchInput = document.getElementById("searchInput").value.toLowerCase();
    var searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = '';

    // Load Excel files
    var excelFiles = ['ORIGINAL_RECIP_IDs.xlsx', 'ORIGINAL_RECIP_IDs2.xlsx']; // Add your Excel file names here
    excelFiles.forEach(function(file) {
        var url = 'bin/' + file;
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";

        req.onload = function(e) {
            var data = new Uint8Array(req.response);
            var workbook = XLSX.read(data, {type:'array'});

            // Loop through each sheet
            workbook.SheetNames.forEach(function(sheetName) {
                var worksheet = workbook.Sheets[sheetName];
                var range = XLSX.utils.decode_range(worksheet['!ref']);

                // Loop through each cell
                for (var R = range.s.r; R <= range.e.r; ++R) {
                    for (var C = range.s.c; C <= range.e.c; ++C) {
                        var cellAddress = {c:C, r:R};
                        var cellRef = XLSX.utils.encode_cell(cellAddress);
                        var cell = worksheet[cellRef];

                        // Check if cell contains the search keyword
                        if (cell && cell.v.toString().toLowerCase().indexOf(searchInput) !== -1) {
                            var result = document.createElement('p');
                            result.textContent = 'Found in ' + file + ', Sheet: ' + sheetName + ', Cell: ' + cellRef + ', Value: ' + cell.v;
                            searchResults.appendChild(result);
                        }
                    }
                }
            });
        };

        req.send();
    });
}
