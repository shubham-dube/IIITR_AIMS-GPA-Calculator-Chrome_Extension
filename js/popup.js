const port3 = chrome.runtime.connect({ name: 'semestersData' });
const calculateSelBtn = document.getElementById("calculateSelBtn");
const calculateBtn = document.getElementById("calculateBtn");
const gpaDiv = document.getElementById("gpaDiv");
const partialData = [];

calculateSelBtn.addEventListener("click", ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

        let tab = tabs[0];
        url = tab.url;

        if (!url.startsWith("https://aims.iiitr.ac.in")) {
            
            let alerHTML = `<div class="alert alert-info alert-dismissible> 
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <strong>Info!</strong> You are Not on AIMS Portal </div>`

            document.getElementById("alert").innerHTML = alerHTML;

        }
        else {
                let data = localStorage.getItem("semestersData");
                data = JSON.parse(data);
                if(data == undefined || data == null){

                    let alerHTML = `<div class="alert text-center alert-primary alert-dismissible\> 
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button> Please Refresh 
                    <strong><i class="fa fa-refresh fa-spin mx-2" style="font-size:18px"></i></strong> the Page</div>`
                    
                    document.getElementById("alert").innerHTML = alerHTML;
                    
                }
                else{
                    const backlogSubjects = [];
                    const backlogCredits = [];
                    for(let i=0;i<data.length;i++){
                        const regTypes = data[i].regTypes;
                        const courses = data[i].courses;
                        const credits = data[i].creditsArray;
                        for(let j=0;j<regTypes.length;j++){
                            if(regTypes[j] === "Backlog"){
                                backlogSubjects.push(courses[j]);
                                backlogCredits.push(credits[j]);
                            }
                        }
                    }
                    
                    const checkboxes = document.querySelectorAll('.form-check-input:checked');
                    let selectedOptions = [];

                    for (let i = 0,j=checkboxes.length-1; i < checkboxes.length; i++,j--) {
                        const checkbox = checkboxes[i];
                        const label = checkbox.nextElementSibling;
                        temp = label.innerHTML;
                        selectedOptions.push(temp);
                    }
                    if (selectedOptions.length === 0) {
                        let alerHTML = `<div class="alert text-center alert-danger alert-dismissible\>
                         <i class="material-icons" size="24px" >&#xe001;</i> 
                         Please Select atleast one Semester</div>`
                
                        document.getElementById("alert").innerHTML = alerHTML;
                    }
                    else {
                        const semesterIndices = [];
                        for (let i = 0; i < data.length; i++) {
                            for (let j = 0; j < selectedOptions.length; j++) {
                              if (selectedOptions[j].includes(data[i].semester)) {
                                semesterIndices.push(i);
                              }
                            }
                        }
                        let gradePoints = 0;
                        let totalCredits = 0;
                        partialData.splice(0);
                        for(let i=0;i<semesterIndices.length;i++){
                            if(semesterIndices.length == data.length){
                                let courses = data[semesterIndices[i]].courses;
                                let grades = data[semesterIndices[i]].grades;
                                for(let j=0;j<backlogSubjects.length;j++){
                                    for(let k=0;k<courses.length;k++){
                                        if(backlogSubjects[j]==courses[k]){
                                            if(grades[k] == "FR" || grades[k] == "FS" || grades[k]=="F" || grades[k] =="I"){
                                                data[semesterIndices[i]].credits -= backlogCredits[j];
                                            }
                                        }
                                    }
                                }
                            }
                            partialData[i] = data[semesterIndices[i]];
                            gradePoints = gradePoints + data[semesterIndices[i]].gradePoints;
                            totalCredits = totalCredits + data[semesterIndices[i]].credits;
                        }
                        let GPA = gradePoints/totalCredits;
                        GPA = GPA.toFixed(2);
                        partialData[0].finalGPA = GPA; 
                        partialData[0].finalcredits = totalCredits;
                        addGpaInList(GPA);

                        const div = document.createElement("div");
                        div.className = "dropdown";
                        div.classList.add("mb-2");
                        div.classList.add("pr-2");
                        const btn = document.createElement("button");
                        btn.innerHTML = "See SemesterWise";
                        btn.type = "button";
                        btn.classList.add("btn");
                        btn.classList.add("btn-primary");
                        btn.classList.add("btn-sm");
                        btn.classList.add("btn-block");
                        btn.classList.add("dropdown-toggle");
                        btn.classList.add("mr-2");
                        btn.setAttribute("data-bs-toggle", "dropdown");
                        btn.setAttribute("aria-expanded", "false");
                        const ul = document.createElement("ul");
                        ul.classList.add("tableClass");
                        ul.classList.add("dropdown-menu");
                        ul.classList.add("dropdown-menu-table");
                        ul.classList.add("p-3");
                        const table = document.createElement("table");
                        const li2 = document.createElement("li");
                        table.className = "table";
                        table.classList.add("table-hover");
                        table.classList.add("table-bordered");
                        const thead = document.createElement("thead");
                        const tbody = document.createElement("tbody");
                        thead.innerHTML = `<tr><th scope="col">Semesters</th><th scope="col">SGPA</th></tr>`
                        for(let j=0,i=partialData.length;j<partialData.length;j++,i--){
                          let tr = document.createElement("tr");
                          let td1 = document.createElement("td");
                          td1.innerHTML = partialData[j].semester;
                          let td2 = document.createElement("td");
                          td2.innerHTML = partialData[j].gpa;
                          tr.appendChild(td1);
                          tr.appendChild(td2);
                          tbody.appendChild(tr);
                        }
                        table.appendChild(thead);
                        table.appendChild(tbody);
                        ul.appendChild(table);
                        div.appendChild(btn);
                        div.appendChild(ul);
                        li2.appendChild(div);
                        const ols = gpaDiv.querySelectorAll("ol");
                        ols[ols.length-1].appendChild(li2);
                        saveData();
                        const partialData1 = JSON.stringify(partialData);
                        localStorage.setItem("partialData",partialData1);
                    }
                }
        }

    });
    
});

calculateBtn.addEventListener("click", ()=>{
        var checkboxes = document.querySelectorAll(".form-check-input");
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
        document.getElementById("calculateSelBtn").click();
});

port3.onMessage.addListener((data) => {
    data = JSON.stringify(data);
    localStorage.setItem("semestersData", data);
});

gpaDiv.addEventListener("click", editGpaList)

function editGpaList(element) {
    if (element.target.tagName === "BUTTON" && element.target.id === "delete"){
        element.target.parentElement.parentElement.remove();
        saveData();
    }

    else if (element.target.tagName === "BUTTON" && element.target.id === "Report"){
        let partialData1 = localStorage.getItem("partialData");
        partialData1 = JSON.parse(partialData1);
        chrome.runtime.sendMessage({ action: "showReport", key: "partialData", value: partialData1 });
    }
}

function addGpaInList(GPA) {
    let classListLi = ["align-items-center", "m-1", "p-2", "card-body"];
    let classListBtnDel = ["btn", "btn-danger", "btn-sm"];
    let classListBtnReport = ["btn", "btn-primary", "btn-sm"];

    let ol = document.createElement("ol");
    ol.id = "gpaList";
    ol.className = "card";

    let li1 = document.createElement("li");
    li1.className = "innerline";
    li1.innerHTML = "CGPA: " + GPA + " | " + date();
    let li2 = document.createElement("li");
    for (let i = 0; i < classListLi.length; i++) {
        li1.classList.add(classListLi[i]);
        li2.classList.add(classListLi[i]);
    }

    let delBtn = document.createElement("button");
    let Report = document.createElement("button");
    delBtn.innerHTML = "Delete";
    Report.innerHTML = "Report";

    for (let i = 0; i < classListBtnDel.length; i++) {
        delBtn.classList.add(classListBtnDel[i]);
        Report.classList.add(classListBtnReport[i]);
    }
    delBtn.id = "delete";
    Report.id = "Report";
    delBtn.type = "button";
    Report.type = "button";

    li1.appendChild(delBtn);
    li1.appendChild(Report);

    ol.appendChild(li1);

    gpaDiv.appendChild(ol);

    saveData();
}

function saveData() {
    localStorage.setItem('div3', gpaDiv.innerHTML);
}

function getData() {
    let data = localStorage.getItem('div3');
    gpaDiv.innerHTML = data;
}
function date() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let halfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    day = day < 10 ? '0' + day : day;
    let formattedDate = day + ' ' + halfMonths[month] + ',' + year;
    return formattedDate;
}

function displaySemester(){
    let data = localStorage.getItem("semestersData");
    data = JSON.parse(data);

    const semesterList = document.getElementById("semesterList");
    const semesterHeading = document.getElementById("semesterHeading");
    semesterHeading.innerHTML = "Select the Semesters to Calculate CGPA";

    let backlogDataIndices = [];
    for(let i=0;i<data.length;i++){
        const regTypes = data[i].regTypes;
        let flag=0;
        for(let k=0;k<regTypes.length;k++){
            if(regTypes[k]=="Regular"){
                flag=0;
                break;
            }
            else if (regTypes[k]=="Backlog"){
                flag=1;
            }
        }
        if(flag==1){
            backlogDataIndices.push(i);
        }
    }

    for(let i=0, j = data.length-backlogDataIndices.length;i<data.length;i++,j--){

        const div = document.createElement("div");
        div.className = "form-check";
        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox"
        input.id = "option" + i;
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.for = "option" + i;
        if(backlogDataIndices.includes(i)){
            label.innerHTML = data[i].semester + " : Holidays";
            j++;
        }
        else{
            label.innerHTML = data[i].semester + " : Semester " + j;
        }
        
        div.appendChild(input);
        div.appendChild(label);
        semesterList.appendChild(div);
    }
    const div = document.createElement("div");
    div.className = "form-check";
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox"
    input.id = "allOption";
    const label = document.createElement("label");
    label.className = "form-check-label";
    label.for = "allOption";
    label.innerHTML = "Select All";
    div.appendChild(input);
    div.appendChild(label);
    semesterList.appendChild(div);

    const selectAllCheckbox = document.getElementById("allOption");
    const childCheckboxes = document.querySelectorAll(".form-check-input");

    selectAllCheckbox.addEventListener("change", function() {
        for (let i = 0; i < childCheckboxes.length; i++) {
            childCheckboxes[i].checked = this.checked;
        }
    });
}

getData();
displaySemester();