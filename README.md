# mgsdatatable

A simple, lightweight JavaScript library to create tables with **pagination**, **sorting**, **searching**, and **rows-per-page limits** — all with minimal setup and no external dependencies.

All functions are globally accessible via window.

---

## ✨ Features

- 🔍 **Search** — Filter rows you type then enter keyword.  
- ↕ **Sorting** — Click column headers to sort (ascending/descending).  
- 📄 **Pagination** — Navigate between pages easily.  
- 📏 **Rows Limit** — Set how many rows appear per page.  
- 🎨 **Customizable** — Fully styleable with your own CSS.  
- 📦 **No Dependencies** — Works in all modern browsers.

---

## 📄 Usage via CDN

```
    <!DOCTYPE html>
    <html>
    <head>
        <title>mgsDataTable</title>
        <script src="https://cdn.jsdelivr.net/npm/mgsdatatable@1.1.1/dist/mgsdatatable.min.js"></script>
    </head>
    <body>
        <table id="myTable"></table>
        <script>
            mgsDataTable({
                target: "#myTable", // Required
                url: "http://localhost/mgs/users", // Required
                data: {}, // Optional
                methodType: "post", // Optional, default is 'post'
                pageLimits: [10, 20, 30, 50, 100], // Optional
                page: 1, // Optional, default is 1
                limit: 10, // Optional, default is 10
                search: "", // Optional, default is ''
                isLimit: true, // Optional, default is true
                isSearch: true, // Optional, default is true
                isResult: true, // Optional, default is true
                isPagination: true, // Optional, default is true
                isSorting: true // Optional, default is true
            });
        </script>
    </body>
    </html>
```

## 📦 Installation via NPM

```bash
npm install mgsdatatable

```
## after installation then use it-

## Example Usage (ES Module) -
```
    <!DOCTYPE html>
    <html>
    <head>
        <title>mgsDataTable</title>
    </head>
    <body>
        <div id="tableContainer">
            <table id="myTable"></table>
        </div>

        <script type="module">
            import mgsDataTable from 'mgsdatatable';

            mgsDataTable({
                target: "#myTable", // Required
                url: "http://localhost/mgs/users", // Required
                data: {}, // Optional
                methodType: "post", // Optional, default is 'post'
                pageLimits: [10, 20, 30, 50, 100], // Optional
                page: 1, // Optional, default is 1
                limit: 10, // Optional, default is 10
                search: "", // Optional, default is ''
                isLimit: true, // Optional, default is true
                isSearch: true, // Optional, default is true
                isResult: true, // Optional, default is true
                isPagination: true, // Optional, default is true
                isSorting: true // Optional, default is true
            });
        </script>
    </body>
    </html>
```

## 📡 API Response Format

## The API endpoint (http://localhost/mgs/users) should return a JSON response in the following format:
```
    Payload - 
        {
            "page": 1,
            "limit": 10,
            "column": "2",  //Optional
            "sort": "desc", //Optional
            "search": ""    //Optional
        }

    Response - 
        {
            "status": true,
            "data": {
                "column": [
                    "name",
                    "role",
                    "email",
                    "mobile",
                    "image",
                    "status",
                    "action"
                ],
                "data": [
                    {
                        "id": 1,
                        "name": "Mangesh",
                        "role": "superadmin",
                        "email": "mangesh@gmail.com",
                        "mobile": "1234567890",
                        "image": "<img src='http://localhost/mgs/storage/user/1692380264.avif' style='height: 50px; width: 100px; border-radius: 50px;'>",
                        "status": "<span data-id='1' class='status badge badge-sm badge-success' data-status='Inactive'>Active</span>",
                        "action": "<span data-id='1' class='btn-danger badge badge-sm badge-danger delete' title='Delete'><i class='fa fa-trash'></i></span> <a href='http://localhost/mgs/user-update/1' class='btn-success badge badge-sm badge-success' title='Update'><i class='fa fa-edit'></i></a>"
                    },
                    {
                        "id": 2,
                        "name": "Ashwani",
                        "role": "superadmin",
                        "email": "ashwani@gmail.com",
                        "mobile": "1234567891",
                        "image": "<img src='http://localhost/mgs/storage/user/1692380264.avif' style='height: 50px; width: 100px; border-radius: 50px;'>",
                        "status": "<span data-id='2' class='status badge badge-sm badge-success' data-status='Inactive'>Active</span>",
                        "action": "<span data-id='2' class='btn-danger badge badge-sm badge-danger delete' title='Delete'><i class='fa fa-trash'></i></span> <a href='http://localhost/mgs/user-update/2' class='btn-success badge badge-sm badge-success' title='Update'><i class='fa fa-edit'></i></a>"
                    }
                ],
                "from": 1,
                "to": 10,
                "total": 30
            },
            "message": "Data found"
        }

```
