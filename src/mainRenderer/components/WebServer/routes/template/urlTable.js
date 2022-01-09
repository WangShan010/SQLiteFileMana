let urlTable = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>资源列表</title>
    <style>
        * {
            font-family: 宋体;
        }

        table {
            border-collapse: collapse;
            width: 600px;
        }

        th, td {
            height: 25px;
            text-align: center;
            border: 1px solid #ccc;
        }

        th {
            background: #eee;
            font-weight: normal;
        }

        tr {
            background: #fff;
        }

        tr:hover {
            background: rgba(128, 128, 128, 0.46);
        }

        td a {
            color: #06f;
            text-decoration: none;
        }

        td a:hover {
            color: #06f;
            text-decoration: underline;
        }
    </style>
</head>
<body>
<table border="1" cellspacing="0">
    <thead>
    <tr>
        <th>#</th>
        <th>类型</th>
        <th>路径</th>
        <th>链接</th>
    </tr>
    </thead>
    <tbody></tbody>
</table>
<script>
    let baseUrl = 'http://localhost:3000/Microservice/connectService';
    let fileList = {'DBName': 'MapTile-google', 'basePath': '\\', 'paths': []};

    let tbody = document.querySelector('tbody');

    let str = '';

    fileList.paths.forEach(function (item, index) {
        let nextUrl = \`\${baseUrl}?DBName=\${fileList.DBName}&path=\${item.file_path}\`;
        str += \`<tr>
                    <td>\${index}</td>
                    <td>\${item['ext']}</td>
                    <td>\${item['file_path']}</td>
                    <td><a href="\${nextUrl}">链接</a></td>
                </tr>\`;
    });
    tbody.innerHTML = str;
</script>
</body>
</html>






`;

module.exports = urlTable;
