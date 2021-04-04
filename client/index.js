document.addEventListener("DOMContentLoaded", function () {
	fetch("http://localhost:5000/getAll")
		.then((res) => res.json())
		.then((data) => loadHTMLTable(data["data"]));
});

document
	.querySelector("table tbody")
	.addEventListener("click", function (event) {
		if (event.target.className === "delete-row-btn") {
			deleteRowById(event.target.dataset.id);
		}
		if (event.target.className === "edit-row-btn") {
			handleEditRow(event.target.dataset.id);
		}
	});

const updateBtn = document.querySelector("#update-row-btn");
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
  const searchValue = document.querySelector('#search-input').value;

  fetch("http://localhost:5000/search/" + searchValue)
		.then((res) => res.json())
		.then((data) => loadHTMLTable(data["data"]));
}

function deleteRowById(id) {
	fetch("http://localhost:5000/delete/" + id, {
		method: "DELETE",
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				location.reload();
			}
		});
}

function handleEditRow(id) {
  // const updateSection = document.querySelector('#update-row');
  // updateSection.hidden = false;
  // document.querySelector("#update-name-input").dataset.id = id;

	const updateSection = document.getElementById("update-row");
	if (updateSection.style.display === "none") {
		updateSection.style.display = "block";
	} else {
		updateSection.style.display = "none";
	}
}

handleEditRow();

updateBtn.onclick = function () {
	const updatedNameInput = document.querySelector("#update-name-input");

	fetch("http://localhost:5000/update", {
		method: "PATCH",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			id: updatedNameInput.dataset.id,
			name: updatedNameInput.value,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				location.reload();
			}
		});
};

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
	const nameInput = document.querySelector("#name-input");
	const name = nameInput.value;
	nameInput.value = "";

	fetch("http://localhost:5000/insert", {
		headers: {
			"Content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ name: name }),
	})
		.then((res) => res.json())
		.then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
	const table = document.querySelector("table tbody");
	const isTableData = table.querySelector(".no-data");

	let tableHtml = "<tr>";

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (key === "dateAdded") {
				data[key] = new Date(data[key]).toLocaleString();
			}
			tableHtml += `<td>${data[key]}</td>`;
		}
	}

	tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
	tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

	tableHtml += "</tr>";

	if (isTableData) {
		table.innerHTML = tableHtml;
	} else {
		const newRow = table.insertRow();
		newRow.innerHTML = tableHtml;
	}
}

function loadHTMLTable(data) {
	const table = document.querySelector("table tbody");

	if (data.length === 0) {
		table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
		return;
	}
	let tableHtml = "";

	data.forEach(function ({ id, name, date_added }) {
		tableHtml += "<tr>";
		tableHtml += `<td>${id}</td>`;
		tableHtml += `<td>${name}</td>`;
		tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
		tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
		tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
		tableHtml += "</tr>";
	});

	table.innerHTML = tableHtml;
}
