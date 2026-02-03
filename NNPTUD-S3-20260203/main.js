const API_URL = "http://localhost:3000/posts";

async function getData() {
    try {
        let res = await fetch(API_URL);
        let posts = await res.json();

        let body = document.getElementById('table_body');
        body.innerHTML = '';

        for (const post of posts) {

            let rowClass = post.isDeleted ? "deleted" : "";

            body.innerHTML += `
                <tr class="${rowClass}">
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.views}</td>
                    <td>
                        ${!post.isDeleted 
                            ? `<button onclick="Delete(${post.id})">Delete</button>` 
                            : ""}
                    </td>
                </tr>
            `;
        }

    } catch (error) {
        console.log(error);
    }
}

async function Save() {
    let id = document.getElementById('txt_id').value.trim();
    let title = document.getElementById('txt_title').value.trim();
    let views = document.getElementById('txt_views').value.trim();

    if (!title || !views) {
        alert("Vui lòng nhập đầy đủ title và views");
        return;
    }

    if (id === "") {

        let res = await fetch(API_URL);
        let posts = await res.json();

        let maxId = 0;
        if (posts.length > 0) {
            maxId = Math.max(...posts.map(p => parseInt(p.id)));
        }

        let newId = maxId + 1;

        let createRes = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: parseInt(views),
                isDeleted: false
            })
        });

        if (createRes.ok) {
            alert("Tạo mới thành công");
            clearInput();
            getData();
        }
    }

    else {

        let updateRes = await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: parseInt(id),
                title: title,
                views: parseInt(views),
                isDeleted: false
            })
        });

        if (updateRes.ok) {
            alert("Cập nhật thành công");
            clearInput();
            getData();
        }
    }
}

async function Delete(id) {

    let res = await fetch(API_URL + "/" + id);
    let post = await res.json();

    let deleteRes = await fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...post,
            isDeleted: true
        })
    });

    if (deleteRes.ok) {
        alert("Xoá mềm thành công");
        getData();
    }
}

function clearInput() {
    document.getElementById('txt_id').value = "";
    document.getElementById('txt_title').value = "";
    document.getElementById('txt_views').value = "";
}

getData();
