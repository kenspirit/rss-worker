/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
let Parser = require('rss-parser');
let parser = new Parser();

export default {
	async fetch(request, env, ctx) {
		const url = request.headers.get("x-rss");
		const feed = await parser.parseURL(url);
		const data = {
			title: feed.title
		}

		data.items = feed.items.map(item => {
			return {
				title: item.title,
				creator: item.creator,
				pubDate: item.pubDate,
				link: item.link
			};
		});

		const json = JSON.stringify(data, null, 2);

		return new Response(json, {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		});
	},
};
