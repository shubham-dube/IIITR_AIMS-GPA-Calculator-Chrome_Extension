const Table = document.getElementById("coursesTable");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'takeReportData') {
        const allData = request.data;
        document.getElementById("name").innerHTML = allData[0].name;
        document.getElementById("roll").innerHTML = allData[0].roll;
        document.getElementById("branch").innerHTML = allData[0].branch;
        document.getElementById("type").innerHTML = allData[0].type;
        document.getElementById("GPA").innerHTML = allData[0].finalGPA;
        document.getElementById("credit").innerHTML = allData[0].finalcredits;
        for(let i=0;i<allData.length;i++){
            const codes = allData[i].codes;
            const courses = allData[i].courses;
            const credits = allData[i].creditsArray;
            const grades = allData[i].grades;

            
            const thead = document.createElement("thead");
            thead.className = "table-primary";

            let tr1 = document.createElement("tr");
            let th11 = document.createElement("th");
            th11.colSpan = 4;
            th11.innerHTML = allData[i].semester;
            tr1.appendChild(th11);

            let tr2 = document.createElement("tr");
            let th1 = document.createElement("th");
            th1.innerHTML = "Course Code";
            let th2 = document.createElement("th");
            th2.innerHTML = "Course Name";
            let th3 = document.createElement("th");
            th3.innerHTML = "Credit";
            let th4 = document.createElement("th");
            th4.innerHTML = "Grade";
            tr2.appendChild(th1);
            tr2.appendChild(th2);
            tr2.appendChild(th3);
            tr2.appendChild(th4);
            thead.appendChild(tr1);
            thead.appendChild(tr2);
            Table.appendChild(thead);

            for(let j=0;j<codes.length;j++){
              const tbody = document.createElement("tbody");
              let tr = document.createElement("tr");
              let td1 = document.createElement("td");
              td1.innerHTML = codes[j];
              let td2 = document.createElement("td");
              td2.innerHTML = courses[j];
              let td3 = document.createElement("td");
              td3.innerHTML = credits[j];
              let td4 = document.createElement("td");
              td4.innerHTML = grades[j];
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);
              tr.appendChild(td4);
              tbody.appendChild(tr);
              Table.appendChild(tbody);
              if(j==codes.length-1){
                const tr = document.createElement("tr");
                const td1 = document.createElement("td");
                const td2 = document.createElement("td");
                td1.colSpan = 3;
                td1.innerHTML = "<b>Credits Completed</b>"
                
                td2.innerHTML = allData[i].credits;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tbody.appendChild(tr);
                Table.appendChild(tbody);
              }
            }

        }

        
        saveData(Table);
        
        const printBtn = document.getElementById('printBtn');

        printBtn.addEventListener('click', () => {
          window.print()
        });

    }
});

function saveData(Table){
  localStorage.setItem("Table", Table.innerHTML);
}

function getData(){
  const data = localStorage.getItem("Table");
  Table.innerHTML = data;
}
