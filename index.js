let _mgsCommonData = {
    target : '',
    url : '',
    methodType : 'post',
    data : {},
    pageLimits : [10,20,30,50,100],
    page : 1,
    limit : 10,
    column : '',
    sort : 'asc',
    search: '',
    prevPage: null,
    nextPage: null,
    isSearch: true,
    isLimit: true,
    isResult: true,
    isPagination: true,
    isSorting: true,
}
let _mgsCountsCheck = 0;
const mgsDataTable = async (data) => {
    _mgsCommonData = {..._mgsCommonData, ...data};
    if(!_mgsCommonData?.target){
        alert('Target is requied.');
        return;
    }
    if(!_mgsCommonData?.url){
        alert('URL is requied.');
        return;
    }
    let _mgsTarget = _mgsCommonData?.target;
    let _mgsFullUrl = _mgsCommonData?.url ?? '/';
    let { token, ...allData} = {..._mgsCommonData?.data};
    let methodType = _mgsCommonData?.methodType;
    let page = _mgsCommonData?.page ?? 1;
    let limit = _mgsCommonData?.limit ?? 10;
    let pageLimits = _mgsCommonData?.pageLimits ?? [10,20,30,50,100];
    let search = _mgsCommonData?.search;
    let column = _mgsCommonData?.column;
    let sort = _mgsCommonData?.sort;
    let nextPage = _mgsCommonData?.nextPage ?? null;
    let prevPage = _mgsCommonData?.prevPage ?? null;
    let isSearch = _mgsCommonData?.isSearch ?? true;
    let isLimit = _mgsCommonData?.isLimit ?? true;
    let isResult = _mgsCommonData?.isResult ?? true;
    let isPagination = _mgsCommonData?.isPagination ?? true;
    let isSorting = _mgsCommonData?.isSorting ?? true;

    allData = { ...allData, page, limit }
    if (search != null && search != undefined && search.trim() != '') {
        allData = { ...allData, search }
    }
    if (column != null && column != undefined && column.trim() != '') {
        allData = { ...allData, column, sort }
    }

    const _mgsIsPost = methodType.toLowerCase() === 'post';
    // Prepare headers and body
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (_mgsIsPost) headers.append("X-CSRF-Token", token);

    const _mgsOptions = {
        method: _mgsCommonData?.methodType,
        headers: headers,
        body: JSON.stringify(allData)
    };

    // Clean up previous results
    const _mgsContainer = document.querySelector(_mgsTarget);
    const nextPaginate = _mgsContainer.nextElementSibling;
    if (nextPaginate && nextPaginate.classList.contains('_mgsPaginateResult')) {
        nextPaginate.remove();
    }
    const tbody = _mgsContainer.querySelector('tbody');
    if (tbody) tbody.remove();

    // Initial setup for first time
    const spinner = document.createElement('div');
    spinner.className = '_mgsSpinner';
    spinner.innerHTML = `<i class="fa fa-spinner fa-spin"></i> &nbsp; Loading...`;
    spinner.style.cssText = `
        position: fixed;
        z-index: 1031;
        width: 70%;
        height: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
    `;
    
    try {
        const _mgsResponse = await fetch(_mgsFullUrl, _mgsOptions);
        const _mgsResp = await _mgsResponse.json();
        const _mgsResult = _mgsResp?.data ?? [];
        const _mgsOutput = _mgsResp?.data?.data ?? [];
        const _mgsColumn = _mgsResp?.column ?? [];
        const _from = (_mgsResult?.from != undefined && _mgsResult?.from  != null && _mgsResult?.from  != '')?_mgsResult?.from :0;
        const _to = (_mgsResult?.to != undefined && _mgsResult?.to  != null && _mgsResult?.to  != '')?_mgsResult?.to :0;
        const _total = (_mgsResult?.total != undefined && _mgsResult?.total  != null && _mgsResult?.total  != '')?_mgsResult?.total :0;
        const _mgsTotalPage = Math.ceil(_total/limit);
        const _mgsPagination = (_mgsTotalPage+2);
        nextPage = (_mgsTotalPage > 0 && nextPage == null && prevPage == null)? 2 : nextPage;

        //create limit and search
        _mgsContainer.insertAdjacentElement('beforebegin', spinner);
        if (_mgsCountsCheck == 0 && (isSearch || isLimit)) {
            let pageLimitData = '';
            if(isLimit){
                pageLimits.forEach(element => {
                    pageLimitData += `<option value="${element}">${element}</option>`;
                });
            }

            const _mgsPerPageSearch = `
                <div class="row _mgsPerPageSearch"> 
                    ${isLimit ? `<div class="_mgsPerPageStyle"> 
                        <span>Show</span>
                        <select class="_mgsPerPageLimit form-control" name="_mgsPerPageLimit" style="width:100px !important">${pageLimitData}</select>
                    </div>`:``}
                    ${isSearch ? `<div class="_mgsSearchStyle"> 
                        <span>Search</span> 
                        <input type="text" class="form-control _mgsSearchAnyField" name="_mgsSearchAnyField" value="${search}" placeholder="Search any field...">
                    </div> `:``}
                </div>
            `;
            _mgsContainer.insertAdjacentHTML('beforebegin', _mgsPerPageSearch);
            const target = document.querySelector('._mgsPerPageSearch');
            if (target) {
                target.style.display = 'flex';
                target.style.justifyContent = 'space-between';
                target.style.alignItems = 'center';
                target.style.gap = '10px';
                target.style.paddingLeft = '14px';
                target.style.paddingRight = '14px';
                target.style.marginBottom = '10px';

                // Optional: style search input
                const searchInput = target.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.style.flex = '1';
                    searchInput.style.padding = '6px 10px';
                    searchInput.style.border = '1px solid #ccc';
                    searchInput.style.borderRadius = '4px';
                }

                // Optional: style select dropdown
                const select = target.querySelector('select');
                if (select) {
                    select.style.padding = '6px 10px';
                    select.style.border = '1px solid #ccc';
                    select.style.borderRadius = '4px';
                }
            }
        }

        //create table
        const _mgsCreateTable = document.createElement('table');
        _mgsCreateTable.style.cssText = `
            width: 100%;
            min-width: 100%;
            max-width: 100%;
            padding: 10px 5px;
            vertical-align: top;
            border: 1px solid rgb(222, 226, 230);
            background-color: #fff;
            color: #212529;
            border-collapse: collapse;
        `;

        // Create thead
        const _mgsThead = document.createElement('thead');
        const _mgsHeadRow = document.createElement('tr');
        _mgsColumn.forEach((text, key) => {
            text = capitalizeFirstLetter(text);
            const th = document.createElement('th');
            if(_mgsOutput?.length > 0 && isSorting){
                th.classList.add('_mgsSort');
            }
            if(isSorting){
                th.setAttribute('data-column', key); // or actual key if mapping to backend
                if (column && key == column && sort == 'desc') {
                    th.setAttribute('data-sort', 'desc');
                    th.innerHTML = `${text} <i class="fa fa-arrow-down" style="font-size:10px !important"></i>`;
                }else{
                    th.setAttribute('data-sort', 'asc');
                    th.innerHTML = `${text} <i class="fa fa-arrow-up" style="font-size:10px !important"></i>`;
                }
            }else{
                th.innerHTML = text;
            }
            th.style.cssText = `
                background-color: #f8f9fa;
                font-weight: bold;
                cursor: ${(_mgsOutput?.length > 0)?'pointer':'not-allowed'};
                width: 150px;
                min-width: 150px;
                max-width: 150px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 2px;
                border-top: 1px solid rgb(222, 226, 230);
            `;
            _mgsHeadRow.appendChild(th);
        });
        _mgsThead.appendChild(_mgsHeadRow);
        _mgsCreateTable.appendChild(_mgsThead);        

        // Create tbody
        const _mgsTbody = document.createElement('tbody');
        if(_mgsOutput?.length > 0){
            _mgsOutput.forEach((text, key) => {
                let _createRow = document.createElement('tr');
                _mgsColumn.forEach(col => {
                    let td = document.createElement('td');
                    td.style.cssText = `
                        width: 150px;
                        min-width: 150px;
                        max-width: 150px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding: 2px;
                        border-top: 1px solid rgb(222, 226, 230);
                    `;
                    td.innerHTML = text[col];
                    td.title = text[col];
                    _createRow.appendChild(td);
                });
                _mgsTbody.appendChild(_createRow);
            });
        }else{
            let _createRow = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = 'Data not Found';
            td.setAttribute('colspan', _mgsColumn?.length)
            td.style.cssText = `
                width: 100%;
                padding: 2px;
                border-top: 1px solid rgb(222, 226, 230);
                text-align: center;
                color:red;
            `;
            _createRow.appendChild(td);
            _mgsTbody.appendChild(_createRow);  
        }
        
        _mgsCreateTable.appendChild(_mgsTbody);

        // Append the table to the container
        _mgsContainer.innerHTML = ''; // clear previous content
        _mgsContainer.appendChild(_mgsCreateTable);

        setTimeout(() => {
            spinner.remove();
        }, 500);

        _mgsCountsCheck++;
        let _mgsPaginationHtml = ``;
        if (_mgsPagination > 0) {
            let style = document.createElement('style');
            style.textContent = `
                ._mgsPagination {
                    display: flex;
                    list-style: none;
                    padding: 0;
                    gap: 6px;
                }
                ._mgsPageItem {
                    display: inline-block;
                }
                ._mgsPageLink {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    padding: 0 10px;
                    border: 1px solid #0ec6d5;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #0ec6d5;
                    text-decoration: none;
                    transition: all 0.2s ease-in-out;
                }
                ._mgsPageLink:hover {
                    background-color: #0ec6d5;
                    color: #fff;
                }
                ._mgsPageItem.active ._mgsPageLink {
                    background-color: #0ec6d5;
                    color: #fff;
                    border-color: #0ec6d5;
                }
                ._mgsPageItem.disabled ._mgsPageLink {
                    border-color: #ccc;
                    color: #ccc;
                    pointer-events: none;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(style);
            let _mgsCheckCreate = true;
            for (let _mgsIndex = 0; _mgsIndex < _mgsPagination; _mgsIndex++) {
                let _mgsPrevNextPage = {0:'« Previous', [_mgsPagination-1]:'Next »'};
                let _mgsLabel = (_mgsPrevNextPage[_mgsIndex])?_mgsPrevNextPage[_mgsIndex]:_mgsIndex;
                let _mgsPage = (_mgsPrevNextPage[_mgsIndex] == '« Previous')?prevPage:((_mgsPrevNextPage[_mgsIndex] == 'Next »')? nextPage :_mgsIndex);
                let _mgsCursorStye = (_mgsPage == null)?`cursor: not-allowed !important;`:`cursor: pointer !important;`;
                let _mgsActiveDisablePage = (_mgsPage == null)?'disabled':((_mgsPage == page)?'active':'');
                let _mgsMoreThenFive = _mgsLabel;
                if(_mgsPagination == 2){
                    _mgsPage = null;
                    _mgsActiveDisablePage = 'disabled';
                }
                if(_mgsTotalPage > 5 && ['« Previous',1,2,3,'Next »'].includes(_mgsLabel) && page < 3){
                    _mgsMoreThenFive = _mgsLabel;
                    _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                    <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage}">${_mgsMoreThenFive}</a>
                    </li>`;
                }else if(_mgsTotalPage > 5 && page > 2){
                    _mgsActiveDisablePage = (_mgsPage == null)?'disabled':((_mgsPage+1 == page)?'active':'');
                    _mgsMoreThenFive = (page >= 3 && !['« Previous','Next »'].includes(_mgsLabel))?_mgsLabel+1:_mgsLabel;
                    if(_mgsIndex == 1){
                        _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                            <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="1">1</a>
                        </li>`;
                    }else if((page-1) <= _mgsIndex && page >= _mgsIndex && _mgsIndex <= (page+1)  && _mgsIndex < (_mgsTotalPage-2) && !['« Previous','Next »'].includes(_mgsLabel)){
                        _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                            <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage+1}">${_mgsMoreThenFive}</a>
                        </li>`;
                    }else if(_mgsTotalPage > 5 && _mgsIndex > 3 && _mgsIndex < _mgsTotalPage-1 && !['« Previous','Next »'].includes(_mgsLabel)){
                        if(_mgsCheckCreate){
                            _mgsCheckCreate = false;
                            _mgsMoreThenFive = '...';
                            _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                                <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage+1}">${_mgsMoreThenFive}</a>
                            </li>`;
                        }
                    }else {
                        _mgsActiveDisablePage = (_mgsPage == null)?'disabled':((_mgsPage == page)?'active':'');
                        _mgsMoreThenFive = _mgsLabel;
                        _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                            <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage}">${_mgsMoreThenFive}</a>
                        </li>`;
                    }
                    
                }else if(_mgsTotalPage > 5 && _mgsIndex > 3 && _mgsIndex < _mgsTotalPage-1 && !['« Previous','Next »'].includes(_mgsLabel)){
                    if(_mgsCheckCreate){
                        _mgsCheckCreate = false;
                        _mgsMoreThenFive = '...';
                        _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                            <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage}">${_mgsMoreThenFive}</a>
                        </li>`;
                    }
                }else{
                    _mgsMoreThenFive = _mgsLabel;
                    _mgsPaginationHtml += `<li class="_mgsPageItem ${_mgsActiveDisablePage}" style="${_mgsCursorStye}">
                        <a class="_mgsPageLink" data-mxpage="${_mgsTotalPage}" href="${_mgsPage}">${_mgsMoreThenFive}</a>
                    </li>`;
                }
            }
        }
        const paginationResult = `
            <div class="row _mgsPaginateResult">
                ${isResult ? `<div>Showing ${_from} to ${_to} of ${_total} results</div>`:``}
                ${isPagination? `<div style="margin-top:10px;"> 
                    <ul class="mgsPagination" style="margin-left: auto !important"> 
                        ${_mgsPaginationHtml}
                    </ul> 
                </div> `:``}
            </div>`;
        _mgsContainer.insertAdjacentHTML('afterend', paginationResult);
        const target = document.querySelector('._mgsPaginateResult');
        if (target) {
            target.style.display = 'flex';
            target.style.justifyContent = 'space-between';
            target.style.alignItems = 'center';
            target.style.gap = '10px';
            target.style.paddingLeft = '14px';
            target.style.paddingRight = '14px';
        }
    } catch (error) {
        const _mgsErrorMessage = `
            <div class="row" style="text-align: center; display: block; margin: 10px auto; font-weight: bold; margin-top:50px;"> 
                <p>Error Message : <span style='color: red; margin-left:10px;'>${error.message}</span></p>
            </div>
        `;
        _mgsContainer.innerHTML = ''; 
        _mgsContainer.insertAdjacentHTML('beforebegin', _mgsErrorMessage);
        spinner.remove();
    }
};

//for per page
document.addEventListener('click', function (e) {
  const target = e.target.closest('._mgsPageItem');
  if (!target) return;
  e.preventDefault();
  let page = target.textContent.trim();
  const pageLink = target.querySelector('._mgsPageLink');
  const href = pageLink?.getAttribute('href');
  const totalPage = pageLink?.getAttribute('data-mxpage');
  if (href && href !== 'null') {
    page = parseInt(href);
    let nextPage = (page >= totalPage)?null:page+1;
    let prevPage = (page <= 1)?null:page-1;
    pageLink?.setAttribute('href', nextPage);
    if(nextPage == null || prevPage == null){
        pageLink.style.cssText = `cursor: not-allowed !important;`;
    }else{
        pageLink.style.cssText = `cursor: pointer !important;`;
    }
    mgsDataTable({page, prevPage, nextPage});
  }else{
    pageLink.setAttribute('disabled', true);
    pageLink.style.cssText = `cursor: not-allowed !important;`;
    return;
  }
});

//for limit
document.addEventListener('change', function (e) {
  const target = e.target;
  if (target.classList.contains('_mgsPerPageLimit')) {
    e.preventDefault();
    limit = parseInt(target.value, 10);
    page = 1;
    prevPage = null;
    nextPage = null;
    mgsDataTable({page,limit, prevPage, nextPage});
  }
});

//for searching
document.addEventListener('keyup', function (e) {
  const target = e.target;
  if (target.classList.contains('_mgsSearchAnyField')) {
    e.preventDefault();
    if(e.key === "Enter"){
        search = target.value;
        page = 1;
        column = '';
        sort = '';
        document.querySelectorAll('._mgsSort').forEach((el) => {
          const text = capitalizeFirstLetter(el.textContent.trim());
          el.innerHTML = `${text} <i class="fa fa-arrow-up" style="font-size:10px !important"></i>`;
          el.setAttribute('data-sort', 'asc');
        });
        mgsDataTable({page,column, sort, search});
    }
  }
});

//for sorting
document.addEventListener('click', function (e) {
  const target = e.target.closest('._mgsSort');
  if (!target) return;
  e.preventDefault();
  const page = 1;
  const column = target.getAttribute('data-column');
  const columnSortType = target.getAttribute('data-sort');
    sort = columnSortType === 'asc'?'desc':'asc';
    mgsDataTable({page, column, sort});
});