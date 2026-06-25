const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3009;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Tách bỏ query parameters (ví dụ ?v=1.0.3) trước khi đọc file vật lý
    let urlPathname = req.url.split('?')[0];
    let decodedUrl = decodeURIComponent(urlPathname);
    let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
    const extname = String(path.extname(filePath)).toLowerCase();
    
    // Đảm bảo không truy cập ra ngoài thư mục dự án
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Access Denied');
        return;
    }

    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>Tệp tin không tồn tại.</p>');
            } else {
                res.writeHead(500);
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 KidCreative Hub Server đang chạy thành công!`);
    console.log(`👉 Sếp hãy mở trình duyệt và truy cập: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
