        //AUTOFILL  ON SELECTED ITEM
        function populatePeriodList() {
            let classRoomId = $("#classRoomFilter option:selected").val();
            let academicYear = $("#AneAcaFilter option:selected").val();
            //alert(academicYear);
            let select = $("#PeriodFilter");
            select.empty();
            $.post("/getPeriod-list", {classRoomId,academicYear:academicYear }, function (data) {
                console.log(data);
                let pos = 0;
                for (i = 0; i < data.length; i++) {
                    select.append('<option value="' + data[i].periode + '">' + data[i].periode + '</option>');
                    $("#modEvaluationFilter").val(data[0].mode_evaluation_code);
                }
                select.append('<option value="All">Toutes les periode</option>');
            });
        }
        