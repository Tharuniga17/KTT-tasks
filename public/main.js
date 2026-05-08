$(function () {

    // ===================== FORMAT DATE FOR INPUT =====================
    function formatDateForInput(dateString) {
        let date = new Date(dateString);

        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // ===================== DISPLAY FORMAT =====================
    function formatDate(dateString) {
        if (!dateString || dateString === "-" || dateString === "undefined") {
            return "-";
        }

        let date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();

        let hours = date.getHours();
        let minutes = String(date.getMinutes()).padStart(2, "0");

        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    }

    // ===================== PARSE DISPLAYED DATE (DD/MM/YYYY) =====================
    function parseTableDate(dateString) {
        if (!dateString || dateString === "-") return null;

        // Example: "05/07/2026 10:31 PM"
        let [datePart, timePart, ampm] = dateString.split(" ");

        if (!datePart || !timePart || !ampm) return null;

        let [day, month, year] = datePart.split("/").map(Number);
        let [hour, minute] = timePart.split(":").map(Number);

        if (ampm === "PM" && hour < 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;

        return new Date(year, month - 1, day, hour, minute);
    }


    let table = $('#fuelTable').DataTable({
        pageLength: 10,
        order: [[0, 'desc']],
        lengthMenu: [5, 10, 25, 50, 100],
        dom: '<"top d-flex justify-content-center align-items-center gap-3"B>lfrtip',
        buttons: [
            { extend: 'copy' },
            { extend: 'excel', title: 'fuel data', filename: 'fuel-data' }
        ],

        columnDefs: [
            {
                targets: 0,
                render: function (data) {
                    return formatDate(data);
                }
            }
        ]
    });

    // ================= DATE FILTER =================
    $('#startDate, #endDate').on('change', function () {
        table.draw();
    });

    $.fn.dataTable.ext.search.push(function (settings, data) {

        let start = $('#startDate').val();
        let end = $('#endDate').val();

        let rowDate = parseTableDate(data[0]);

        if (!rowDate) return false;

        let startDate = start ? new Date(start + "T00:00:00") : null;
        let endDate = end ? new Date(end + "T23:59:59") : null;

        if (startDate && rowDate < startDate) return false;
        if (endDate && rowDate > endDate) return false;

        return true;
    });

    // ================= FOOTER CALC =================
    function calculateFooter() {

        let data = table.rows({ search: 'applied' }).data();

        let totalLiters = 0;
        let totalAmount = 0;
        let priceSum = 0;
        let mileageSum = 0;
        let count = 0;

        data.each(function (row) {

            let liters = parseFloat(row[2]) || 0;
            let amount = parseFloat(row[3]) || 0;
            let price = parseFloat(row[4]) || 0;
            let mileage = parseFloat(row[6]) || 0;

            totalLiters += liters;
            totalAmount += amount;

            if (price > 0) {
                priceSum += price;
                count++;
            }

            if (mileage > 0) {
                mileageSum += mileage;
            }
        });

        $('#totalLiters').text(totalLiters.toFixed(2));
        $('#totalAmount').text(totalAmount.toFixed(2));
        $('#avgPrice').text(count ? (priceSum / count).toFixed(2) : 0);
        $('#avgMileage').text(count ? (mileageSum / count).toFixed(2) : 0);
    }

    table.on('draw', calculateFooter);
    calculateFooter();

    // ================= FLATPICKR =================
    flatpickr("#addFuelDate", {
        enableTime: true,
        dateFormat: "d/m/Y h:i K",
        defaultDate: new Date()
    });

});

$(function () {

    $('#addForm').submit(function (e) {
        e.preventDefault();

        let formData = $(this).serialize();

        $.ajax({
            url: "/",
            type: "POST",
            data: formData,
            success: function () {
                alert("Inserted successfully");
                location.reload();
            },
            error: function () {
                alert("Insert failed");
            }
        });
    });

    $('.editForm').submit(function (e) {
        e.preventDefault();

        let id = $(this).data('id');
        let formData = $(this).serialize();

        $.ajax({
            url: "/update/" + id,
            type: "POST",
            data: formData,
            success: function () {
                alert("Updated successfully");
                location.reload();
            },
            error: function () {
                alert("Update failed");
            }
        });
    });

    $(document).on('click', '.deleteBtn', function () {

        let id = $(this).data('id');

        if (!confirm("Are you sure to delete?")) return;

        $.ajax({
            url: "/delete/" + id,
            type: "POST",
            success: function () {
                alert("Deleted successfully");
                location.reload();
            },
            error: function () {
                alert("Delete failed");
            }
        });

    });

});