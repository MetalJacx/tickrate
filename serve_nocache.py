#!/usr/bin/env python3
"""
Simple HTTP server with aggressive no-cache headers to force browser reloads
Run this instead of python -m http.server to avoid caching issues during development
"""

import http.server
import socketserver

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add aggressive no-cache headers
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

PORT = 8000
Handler = NoCacheHTTPRequestHandler

print(f"Starting server on http://localhost:{PORT}")
print("This server sends no-cache headers to prevent browser caching")
print("Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
