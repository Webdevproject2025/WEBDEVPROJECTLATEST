function printStudentCards() {
    const printContents = document.querySelector('.student-cards-container').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Student Cards</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} .student-card{border:1px solid #ccc;padding:10px;margin:10px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function exportData() {
    const students = document.querySelectorAll('.student-card');
    const data = [];

    students.forEach((card, index) => {
        const lrn = card.querySelector('.lrn-value').textContent;
        const lastName = card.querySelector('.last-name-value').textContent;
        const firstName = card.querySelector('.first-name-value').textContent;
        const middleName = card.querySelector('.middle-name-value').textContent;
        const section = card.querySelector('.section-tag').textContent;
        const adviser = card.querySelector('.card-footer').textContent.split('\n')[0];

        data.push([index + 1, lrn, lastName, firstName, middleName, section, adviser]);
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,LRN,Last Name,First Name,Middle Name,Section,Adviser\n";
    data.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function addStudent() {
    const container = document.querySelector('.student-cards-container');
    const newId = document.querySelectorAll('.student-card').length + 1;

    const studentCardHTML = `
        <div class="student-card" data-student-id="${newId}">
            <div class="card-header">
                <span class="lrn-display">#N/A</span>
                <span class="edit-button" onclick="editStudentCard(this.closest('.student-card'), '', '', '', '#N/A', '', '')">✏️</span>
                <span class="close-button" onclick="removeStudentCard(this.closest('.student-card'))">X</span>
            </div>
            <div class="card-content">
                <div class="full-name"></div>
                <div class="section-tag"></div>
                <div class="info"><div class="label">LRN</div><div class="value lrn-value"></div></div>
                <div class="info"><div class="label">Last Name</div><div class="value last-name-value"></div></div>
                <div class="info"><div class="label">First Name</div><div class="value first-name-value"></div></div>
                <div class="info"><div class="label">Middle Name</div><div class="value middle-name-value"></div></div>
            </div>
            <div class="card-footer"><br>ADVISER</div>
            <div class="edit-actions">
                <button class="save-btn" onclick="saveStudentData(this.closest('.student-card'))">Save</button>
                <button class="cancel-btn" onclick="cancelEdit(this.closest('.student-card'))">Cancel</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', studentCardHTML);
}

function editStudentCard(card, lastName, firstName, middleName, lrn, section, adviser) {
    // Save original data in attributes
    card.dataset.originalLrn = lrn;
    card.dataset.originalLastName = lastName;
    card.dataset.originalFirstName = firstName;
    card.dataset.originalMiddleName = middleName;

    // Replace text with input fields
    card.querySelector('.lrn-value').innerHTML = `<input type="text" name="lrn" value="${lrn}">`;
    card.querySelector('.last-name-value').innerHTML = `<input type="text" name="lastName" value="${lastName}">`;
    card.querySelector('.first-name-value').innerHTML = `<input type="text" name="firstName" value="${firstName}">`;
    card.querySelector('.middle-name-value').innerHTML = `<input type="text" name="middleName" value="${middleName}">`;
}



function saveStudentData(card) {
    card.querySelectorAll('.value input').forEach(input => {
        const value = input.value;
        const container = input.parentElement;
        container.textContent = value;
    });
}

function cancelEdit(card) {
    // Get original data from attributes
    const originalLrn = card.dataset.originalLrn || '#N/A';
    const originalLast = card.dataset.originalLastName || '';
    const originalFirst = card.dataset.originalFirstName || '';
    const originalMiddle = card.dataset.originalMiddleName || '';

    // Revert the input fields to plain text
    card.querySelector('.lrn-value').textContent = originalLrn;
    card.querySelector('.last-name-value').textContent = originalLast;
    card.querySelector('.first-name-value').textContent = originalFirst;
    card.querySelector('.middle-name-value').textContent = originalMiddle;
}


function removeStudentCard(card) {
    card.remove();
}

document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.student-card');
      card.classList.add('editing');
    });
  });
  
  document.querySelectorAll('.save-button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.student-card');
      // TODO: collect values & save to backend or data structure
      card.classList.remove('editing');
    });
  });
  
  document.querySelectorAll('.cancel-button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.student-card');
      // TODO: optionally reset inputs to original values
      card.classList.remove('editing');
    });
  });
  
  function cancelEdit(card) {
    // Hanapin ang mga input fields sa card
    const lrnInput = card.querySelector('input[name="lrn"]');
    const lastNameInput = card.querySelector('input[name="lastName"]');
    const firstNameInput = card.querySelector('input[name="firstName"]');
    const middleNameInput = card.querySelector('input[name="middleName"]');

    // Hanapin ang mga original value fields (nakasave sa data-* attributes)
    const originalLRN = card.getAttribute('data-original-lrn') || '#N/A';
    const originalLast = card.getAttribute('data-original-lastname') || '';
    const originalFirst = card.getAttribute('data-original-firstname') || '';
    const originalMiddle = card.getAttribute('data-original-middlename') || '';

    // Ibalik ang mga values
    if (lrnInput) lrnInput.value = originalLRN;
    if (lastNameInput) lastNameInput.value = originalLast;
    if (firstNameInput) firstNameInput.value = originalFirst;
    if (middleNameInput) middleNameInput.value = originalMiddle;

    // Optional: gawin ulit readonly o balikin sa display mode
    // Dito mo pwedeng tanggalin yung mga input fields at ibalik sa text lang
}
