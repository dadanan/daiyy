let datas = "http://128.64.130.38:8000/bszhxx/onlyDocx/download?fileName=accountTemplate_cd2e1670-dbcc-4a64-a36f-78150039ed57_%E5%8C%BA%E5%9F%9F%E6%95%B0%E6%8D%AE%E9%87%8D%E5%A4%8D.doc&userAddress=C%3A%5CUsers%5Cdocuments%5C";
let data = new URLSearchParams(datas.substring(datas.lastIndexOf("?")));
console.log(data.get("fileName"));
