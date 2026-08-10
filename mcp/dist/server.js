"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
// Setup server details
const server = new index_js_1.Server({
    name: 'stream-automator-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Get Next.js server base URL from environment (default localhost)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SESSION_KEY = process.env.STREAM_AUTOMATOR_SESSION || '';
/**
 * Helper to execute authorized API calls back to the local Next.js server.
 */
async function callNextApi(endpoint, options = {}) {
    if (!SESSION_KEY) {
        throw new Error('Unauthorized. STREAM_AUTOMATOR_SESSION is not set in environment variables.\n' +
            'Please open http://localhost:3000/dashboard, copy your MCP Session Key from the interface, and paste it into your MCP config file.');
    }
    const url = `${APP_URL}${endpoint}`;
    const headers = {
        ...options.headers,
        'Cookie': `youtube_stream_session=${SESSION_KEY}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed (Status ${response.status}): ${errorText}`);
    }
    return response;
}
// 1. Declare tools schema
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'get_template_formats',
                description: 'Retrieve stream configuration templates (JSON, Markdown, YAML) for configuring YouTube and Kick livestreams.',
                inputSchema: { type: 'object', properties: {} },
            },
            {
                name: 'get_sync_logs',
                description: 'Read the broadcast scheduling logs and server-side analytics history.',
                inputSchema: { type: 'object', properties: {} },
            },
            {
                name: 'schedule_stream',
                description: 'Create a live broadcast event on YouTube and optionally update category/title on Kick.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Stream title (e.g., Coding session)' },
                        description: { type: 'string', description: 'Detailed stream description text' },
                        scheduledTime: { type: 'string', description: 'ISO date string in local time (e.g., 2026-08-11T15:00:00)' },
                        categoryId: { type: 'string', description: 'YouTube category ID (default: "28" for Science & Technology)' },
                        privacyStatus: { type: 'string', description: 'Privacy level: public, unlisted, or private (default: public)' },
                        kickSync: { type: 'boolean', description: 'Whether to synchronize metadata to Kick.com channel' },
                        gameName: { type: 'string', description: 'Kick gaming category or title (default: Just Chatting)' },
                        tags: { type: 'array', items: { type: 'string' }, description: 'List of SEO tags or keywords' },
                    },
                    required: ['title', 'scheduledTime'],
                },
            },
        ],
    };
});
// 2. Handle tool invocation calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'get_template_formats': {
                const res = await fetch(`${APP_URL}/api/previous-stream`); // check connection
                const templates = {
                    markdown: `---
title: "Your Stream Title 🚀 #coding"
type: "28"
privacy: "public"
game: "Software Development"
tags: ["programming", "webdev"]
---
Welcome to my stream!`,
                    json: JSON.stringify({
                        title: "Your Stream Title 🚀 #coding",
                        categoryId: "28",
                        privacyStatus: "public",
                        gameName: "Software Development",
                        tags: ["programming", "webdev"],
                        description: "Welcome to my stream!"
                    }, null, 2),
                };
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Here are copyable configuration formats:\n\n**Markdown Template**:\n\`\`\`markdown\n${templates.markdown}\n\`\`\`\n\n**JSON Template**:\n\`\`\`json\n${templates.json}\n\`\`\``,
                        },
                    ],
                };
            }
            case 'get_sync_logs': {
                const res = await callNextApi('/api/analytics');
                const logs = await res.json();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(logs, null, 2),
                        },
                    ],
                };
            }
            case 'schedule_stream': {
                const payload = args;
                const formData = new URLSearchParams();
                formData.append('title', payload.title);
                formData.append('description', payload.description || '');
                formData.append('categoryId', payload.categoryId || '28');
                formData.append('privacyStatus', payload.privacyStatus || 'public');
                formData.append('scheduledTime', payload.scheduledTime);
                formData.append('kickSync', String(!!payload.kickSync));
                formData.append('gameName', payload.gameName || 'Just Chatting');
                if (payload.tags) {
                    formData.append('tags', JSON.stringify(payload.tags));
                }
                const res = await callNextApi('/api/create-stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });
                const result = await res.json();
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Stream scheduled successfully!\n\nDetails:\n- YouTube Video ID: ${result.videoId}\n- Ingest bound status: ${result.boundStream}\n- Kick synced: ${result.kickSynced}\n- Response message: ${result.message}`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: error.message || String(error),
                },
            ],
        };
    }
});
// Run the stdio transport server loop
async function run() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('Stream Automator MCP Server running on stdio.');
}
run().catch(console.error);
