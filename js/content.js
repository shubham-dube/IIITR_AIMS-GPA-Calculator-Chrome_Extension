// after fully loading of webpage, then my operations will start in background on the webpage
window.onload = () => {
   
    // to get rid of any unloaded data 
    setTimeout(() => {
        const semesterElements = [];
        const semesterNames = [];
        const semestersData = [];

        const faltuWithKaamKa = document.querySelectorAll("ul li .col");
        for(let i=0;i<faltuWithKaamKa.length;i++){
            let temp = faltuWithKaamKa[i].innerHTML;
            if(temp.includes("25") || temp.includes("26") || temp.includes("27") || temp.includes("24") || temp.includes("23") || temp.includes("22") || temp.includes("21") || temp.includes("20") || temp.includes("19"))
            {
                if(temp.includes("-")){
                    semesterElements.push(faltuWithKaamKa[i]);
                    semesterNames.push(faltuWithKaamKa[i].innerHTML.replace("&nbsp;", ""));
                }
            }
        }

        let semestersListElements = [];
        for(let i=0;i<semesterElements.length;i++){
            semestersListElements[i] = semesterElements[i].parentElement.parentElement;
            semestersData[i] = calculateDetails(semestersListElements[i],semesterNames[i],i);
        }

        chrome.runtime.sendMessage({ action: "sendSemestersData", key: "SemestersData", value: semestersData });
        
    }, 1200);
  };

function calculateDetails(ul,semesterName,flag){
    let gradePoints = 0;
    let totalCredits = 0;
    const courseCodes = [];
    const courseNames = [];
    const credits = [];
    const grades = [];
    const regtypes = []
    const divsPersonal = document.querySelectorAll(".flexDiv");
    const gradeElement = ul.getElementsByClassName("col8 col");    // These are elements containing non-Necessary Texts
    const creditsElement = ul.getElementsByClassName("col3 col"); //
    const courseNameElements = ul.getElementsByClassName("col2 col");
    const courseCodeElements = ul.getElementsByClassName("col1 col");
    const regTypeElements = ul.getElementsByClassName("col4 col");
    
    for(let i=0;i<courseCodeElements.length;i++){
        let temp1 = courseCodeElements[i].innerHTML;
        let temp2 = courseNameElements[i].innerHTML;
        const tempGrade = gradeElement[i].innerHTML;
        const tempCredit = creditsElement[i].innerHTML;
        grades[i] = tempGrade.replace(/&nbsp;/g, '');
        credits[i] = tempCredit.replace(/&nbsp;/g, '');
        courseCodes[i] = temp1.replace("&nbsp;", "");
        courseNames[i] = temp2.replace("&nbsp;", "");
        regtypes[i]=regTypeElements[i].innerHTML.replace("&nbsp;", "");

        if(grades[i] != ""){
            const temp = parseFloat(credits[i]);
            gradePoints += gradesToPoints(grades[i])*temp;
            totalCredits += temp;
        }
    }
    let GPA = gradePoints/totalCredits;
    GPA = GPA.toFixed(2);

    const studentName = document.querySelector(".stuName").innerHTML.replace(/\s+/g, ' ').trim();
    const rollNumber = divsPersonal[0].querySelector("span").innerHTML;
    const branchName = divsPersonal[1].querySelectorAll("span")[0].innerHTML.replace("&amp;", "&");
    const studentType = divsPersonal[1].querySelectorAll("span")[1].innerHTML;

    const allData = {
        semester : semesterName,
        gpa : GPA,
        name : studentName,
        roll : rollNumber,
        branch : branchName,
        type : studentType,
        codes : courseCodes,
        courses : courseNames,
        creditsArray : credits,
        grades : grades,
        credits : totalCredits,
        gradePoints : gradePoints,
        regTypes : regtypes
    }
    return allData;
}
  // Just a function to convert grades into points
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
