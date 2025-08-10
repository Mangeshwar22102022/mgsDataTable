# mgsDataTable

A simple, lightweight JavaScript library to create tables with **pagination**, **sorting**, **searching**, and **rows-per-page limits** — all with minimal setup and no external dependencies.

---

## ✨ Features

- 🔍 **Search** — Filter rows instantly as you type.  
- ↕ **Sorting** — Click column headers to sort (ascending/descending).  
- 📄 **Pagination** — Navigate between pages easily.  
- 📏 **Rows Limit** — Set how many rows appear per page.  
- 🎨 **Customizable** — Fully styleable with your own CSS.  
- 📦 **No Dependencies** — Works in all modern browsers.

---

## 📦 Installation

```bash
npm install mgsdatatable

```
## after installation then use it-

```
<div id="tableContainer"></div>

<script type="module">
    import mgsDataTable from 'mgsdatatable';

    // Call the function to render table
	mgsDataTable({
      target:"#tableContainer",
      url:'http://localhost/mgs/users',
      data: {},
      methodType:'post',  // Optional, default is post
      pageLimits : [10,20,30,50,100], // Optional
      page : 1, // Optional, default is 1
      limit:10, // Optional, default is 10
      column : '', // Optional, default is ''
      sort : 'asc', // Optional, default is asc
      search: '', // Optional, default is ''
      prevPage: null, // Optional, default is null
      nextPage: null, // Optional, default is null
      isLimit:true, // Optional, default true
      isSearch:true, // Optional, default true
      isResult:true, // Optional, default true
      isPagination:true, // Optional, default true
      isSorting:true // Optional, default true
    });
</script>
```

## api 'http://localhost/mgs/users' responsed like this format -
```
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
                "image": "<img src='http://localhost/mgs/storage/user/1692380264.avif' style='height: 50px;width:100px; border-radius:50px;'>",
                "status": "<span data-id='1' class='status badge badge-sm badge-success' data-status='Inactive'>Active</span>",
                "action": "<span data-id='1' class='btn-danger  badge badge-sm badge-danger delete title='Delete'><i class='fa fa-trash'></i> </span> <a href='http://localhost/mgs/user-update/1' class='btn-success  badge badge-sm badge-success title='Update'><i class='fa fa-edit'></i> </a>"
            },
            {
                "id": 2,
                "name": "Ashwani",
                "role": "superadmin",
                "email": "ashwani@gmail.com",
                "mobile": "1234567891",
                "image": "<img src='http://localhost/mgs/storage/user/1692380264.avif' style='height: 50px;width:100px; border-radius:50px;'>",
                "status": "<span data-id='2' class='status badge badge-sm badge-success' data-status='Inactive'>Active</span>",
                "action": "<span data-id='2' class='btn-danger  badge badge-sm badge-danger delete title='Delete'><i class='fa fa-trash'></i> </span> <a href='http://localhost/mgs/user-update/2' class='btn-success  badge badge-sm badge-success title='Update'><i class='fa fa-edit'></i> </a>"
            },
        ],
        "current_page:1,
        "from": 1,
        "to": 5,
        "total": 27
    },
    "msg": "Data found"
}
```
