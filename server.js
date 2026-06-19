const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 1. HTMLの上書き保存リクエスト (/save)
    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const filePath = path.join(ROOT_DIR, 'index.html');
                fs.writeFileSync(filePath, body, 'utf8');
                console.log('[Server] Successfully saved index.html!');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Saved successfully!' }));
            } catch (err) {
                console.error('[Server] Save failed:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    // 2. 静的ファイルの配信
    let reqPath = req.url === '/' ? '/index.html' : req.url;
    reqPath = reqPath.split('?')[0].split('#')[0];
    
    if (reqPath.includes('..')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found: ' + reqPath);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  [SAI Editor Server] Running at: http://localhost:${PORT}`);
    console.log(`  Editing index.html will directly overwrite local file!`);
    console.log(`======================================================\n`);
});
