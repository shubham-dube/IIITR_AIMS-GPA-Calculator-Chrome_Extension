const calculateSelBtn = document.getElementById("calculateSelBtn");
const calculateBtn = document.getElementById("calculateBtn");
const gpaDiv = document.getElementById("gpaDiv");
const partialData = [];

// Fetched Data Listener and triggerer to display semesters and save the data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.dataArray) {
        dataArray = request.dataArray;
        const formattedData = formatData(dataArray[1], dataArray[0]);
        const formatDataString = JSON.stringify(formattedData);

        localStorage.setItem("semesterDetails", formatDataString);

        const loadingDiv = document.getElementById("loadingDiv");
        loadingDiv.style.display = "none";

        displaySemester(formattedData);
    }
});

// Trigger to fetch execute script and fetch data
function dataProvider(){
    const loadingDiv = document.getElementById("loadingDiv");
    loadingDiv.style.display = "block";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fetchAllData
        });
    })
}

// Function to fetch all the data from the website
async function fetchAllData() {
    const response = await fetch(
        'https://aims.iiitr.ac.in/iiitraichur/courseReg/loadMyCoursesHistroy?studentId' + 
        '=&courseCd=&courseName=&orderBy=1&degreeIds=&acadPeriodIds=&regTypeIds=&gradeIds=&resultIds=&isGradeIds=');
    const data = await response.json();

    const studentName = document.getElementsByClassName("stuName")[0].innerText;
    const spans = document.getElementsByClassName("studentInfoDiv")[0].getElementsByTagName("span");
    const studentId = spans[0].innerText;
    const branch = spans[1].innerText;
    const studentType = spans[2].innerText;
    const studentPhoto = document.getElementsByClassName("studentPhoto")[0].getAttribute("src");

    const personalData = {
        name: studentName,
        id: studentId,
        branch: branch,
        type: studentType,
        photo: studentPhoto
    }
    
    const dataArray = [personalData, data]
    chrome.runtime.sendMessage({ dataArray: dataArray });
}

//-----------------------------------Core Functions----------------------------------//

// Function to add and save GPA Card in  the extension
function addGpaInList(GPA, name) {
    let classListLi = ["align-items-center", "p-2", "card-body"];
    let classListBtnDel = ["btn", "btn-danger", "btn-sm"];
    let classListBtnReport = ["btn", "btn-primary", "btn-sm"];

    let ol = document.createElement("ol");
    ol.id = "gpaList";
    ol.className = "card";

    let li1 = document.createElement("li");
    let li3 = document.createElement("li");
    li1.className = "innerline";
    li1.innerHTML = `<i class="fa fa-bookmark" aria-hidden="true"></i> CGPA: ${GPA}  |   <i class="fa fa-calendar" aria-hidden="true"></i> ${date()}`;
    for (let i = 0; i < classListLi.length; i++) {
        li1.classList.add(classListLi[i]);
        li3.classList.add(classListLi[i]);
    }

    let delBtn = document.createElement("button");
    let Report = document.createElement("button");
    let spanRoll = document.createElement("span");
    spanRoll.classList.add("text-secondary");
    spanRoll.setAttribute("style", "font-size: medium");
    spanRoll.innerHTML = `${name}`;
    delBtn.innerHTML = `<i class="fa fa-trash"></i></i>  Delete`;
    Report.innerHTML = `<i class="fa fa-info"></i>  Get Detailed Report`;

    for (let i = 0; i < classListBtnDel.length; i++) {
        delBtn.classList.add(classListBtnDel[i]);
        Report.classList.add(classListBtnReport[i]);
    }
    delBtn.id = "delete";
    Report.id = "Report";
    delBtn.type = "button";
    Report.type = "button";

    li3.appendChild(spanRoll);
    li1.appendChild(delBtn);
    li3.appendChild(Report);

    ol.appendChild(li1);
    ol.appendChild(li3);

    gpaDiv.appendChild(ol);

    saveData();
}

// Function to show semester list in the extension
function displaySemester(semesterDetails){
    data = semesterDetails;

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

//-----------------------------------------Event Listeners--------------------------------------//

// Listener to Calculate Selected Semester CGPA Button
calculateSelBtn.addEventListener("click", ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let tab = tabs[0];
        url = tab.url;

        if (!url.startsWith("https://aims.iiitr.ac.in")) {
            document.getElementById("alert").innerHTML = notOnAIMSAlert;
        }
        else {
                let data = localStorage.getItem("semesterDetails");
                data = JSON.parse(data);
                if(data == undefined || data == null){
                    document.getElementById("alert").innerHTML = refreshAlert;
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
                        document.getElementById("alert").innerHTML = selectSemesterAlert;
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
                        GPA = GPA.toFixed(3);
                        partialData[0].finalGPA = GPA; 
                        partialData[0].finalcredits = totalCredits;
                        addGpaInList(GPA, truncateString(partialData[0].name, 13));  

                        const partialDataJsonString = JSON.stringify(partialData);
                        localStorage.setItem("partialData",partialDataJsonString);
                    }
                }
        }

    });
    
});

// Listener to Overall Calculate CGPA Button
calculateBtn.addEventListener("click", () => {
    var checkboxes = document.querySelectorAll(".form-check-input");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
    document.getElementById("calculateSelBtn").click();
});

// Listener to Delete and Detailed Report Buttons
gpaDiv.addEventListener("click", buttonActions)

//----------------------------------------- Helper Functions--------------------------------------//

// Function to truncate string to a particular length
function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str; 
    }
    let output = str.slice(0, maxLength) + '...';
    console.log(output);
    return output;
}

// Function to format data same as the format on which it is previously worked on
function formatData(allDataObject, personalData) {
    let formattedData = {};

    if (!Array.isArray(allDataObject)) {
        console.error("Expected an array as input");
        return;
    }

    for (let i = 0; i < allDataObject.length; i++) {
        let course = allDataObject[i];

        if (course && course.periodName) {
            if (!formattedData[course.periodName]) {
                formattedData[course.periodName] = {
                    branch: personalData.branch,
                    name: personalData.name,
                    roll: personalData.id,
                    type: personalData.type,
                    semester: course.periodName,
                    regTypes: [],
                    grades: [],
                    creditsArray: [],
                    courses: [],
                    codes: [],
                    gradePoints: 0.0,
                    credits: 0.0
                };
            }

            formattedData[course.periodName].courses.push(course.courseName);
            formattedData[course.periodName].codes.push(course.courseCd);
            formattedData[course.periodName].creditsArray.push(course.credits);
            formattedData[course.periodName].grades.push(course.gradeDesc);
            formattedData[course.periodName].regTypes.push(course.courseRegTypeDesc);
            if(course.gradeDesc != ""){
                formattedData[course.periodName].gradePoints += gradesToPoints(course.gradeDesc)*parseFloat(course.credits);
                formattedData[course.periodName].credits += parseFloat(course.credits);
            }
        }
    }

    const periods = Object.keys(formattedData);
    const semesterDetailsArray = [];

    for(let i=0;i<periods.length;i++){
        const gradePoints = formattedData[periods[i]].gradePoints;
        const credits = formattedData[periods[i]].credits;
        formattedData[periods[i]].gpa = (gradePoints/credits ).toFixed(3);
        semesterDetailsArray.push(formattedData[periods[i]]);
    }
    return semesterDetailsArray;
}

// Function to convert grades to points
function gradesToPoints(grade){
    switch (grade) {
        case "A+": return 10; 
        case "A": return 10;
        case "A-": return 9;
        case "B": return 8;
        case "B-": return 7;
        case "C": return 6;
        case "C-": return 5;
        case "D": return 4;
        case "F": return 0;
        case "FR": return 0;
        case "FS": return 0;
        default : return undefined;
    }
  }

// delete and detailed report button action sequences
function buttonActions(element) {
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

// Helper function to save gpa cards data in the local storage
function saveData() {
    localStorage.setItem('div3', gpaDiv.innerHTML);
}

// Alert Messages
const refreshAlert = `<div class="alert text-center alert-primary alert-dismissible\> 
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button> Please Refresh 
                    <strong><i class="fa fa-refresh fa-spin mx-2" style="font-size:18px"></i></strong> the Page</div>`;

const notOnAIMSAlert = `<div class="alert alert-info alert-dismissible> 
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <strong>Info!</strong> You are Not on AIMS Portal </div>`;

const selectSemesterAlert = `<div class="alert text-center alert-danger alert-dismissible\>
                         <i class="material-icons" size="24px" >&#xe001;</i> 
                         Please Select atleast one Semester</div>`;

// Helper function to fetch saved gpa cards data from the local storage
function getData() {
    let data = localStorage.getItem('div3');
    gpaDiv.innerHTML = data;
}

// Helper Function to get the current date in the desired format
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

// globally Calling function to fetch gpa cards data from the local storage
getData(); 

// Function to correctly call the funtion to fetch all the data from the desired webpage
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    let tab = tabs[0];
        url = tab.url;

    if (url.startsWith("https://aims.iiitr.ac.in/iiitraichur/courseReg/myCrsHistoryPage")) {
        dataProvider();
    }
});