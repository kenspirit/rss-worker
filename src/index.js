/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const htmlparser2 = require('htmlparser2');
const MAX_POSTS = 3;

async function handleRequest(request) {
	// Get the URL of the RSS feed from the request query parameters
	const url = new URL(request.url)
	const feedUrl = url.searchParams.get('url')
	let feed;
	if (!feedUrl) {
		feed = {
			"type": "atom",
			"items": []
		}
	} else {
		// Fetch the RSS feed
		const response = await fetch(feedUrl)
		const text = await response.text()
		let maxPost = url.searchParams.get('max')
		try {
			maxPost = Number(maxPost);
		} catch (e) {
			maxPost = MAX_POSTS;
		}
		if (!maxPost || isNaN(maxPost)) {
			maxPost = MAX_POSTS;
		}

		feed = htmlparser2.parseFeed(text);
		if (!feed) {
			feed = {
				"type": "atom",
				"items": []
			};
			console.warn(`Failed to parse feed content: ${text}`);
		} else {
			feed.items.splice(maxPost, Infinity);
		}
	}

	// Return the data as JSON
	return new Response(JSON.stringify(feed), {
		headers: { 'Content-Type': 'application/json' }
	})
};

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request);
	}
}
