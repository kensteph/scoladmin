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
                select.append('<option value="All">Toutes les periodes</option>');
            });
        }


        //SEARCH FOR STUDENTS
        function searchStudents() {
            $("#search-result").attr("display", 'block')
            let wordToSearch = $("#search-input").val();
            if (wordToSearch.length >= 2) {
                $.post("/student-live-search", { key: wordToSearch }, function (data) {
                    console.log(data);
                    if (data) {
                        $("#ResultList").html("");
                        for (i = 0; i < data.length; i++) {
                            let item = data[i];
                            let student = item.fullname;
                            let line = '<li> <a href="#" onclick="displayDetails(' + item.id + ')" >' + student + '</a></li>';
                            $("#ResultList").append(line);
                        }
                    } else {
                        //alert(data.msg);
                        $("#ResultList").html("Aucun résultat...");
                    }
                });
            } else {
                $("#ResultList").html("");
            }
        }

        function displayDetails(id) {
            $("#StudentID").val(id);
            $("#search-form").submit();
        }
            