/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// addEventListener('fetch', event => {
// 	event.respondWith(handleRequest(event.request))
// })

const htmlparser2 = require('htmlparser2');

function getRssField(item, fieldName) {
	const field = item.querySelector(fieldName);
	if (field) {
		return field.textContent;
	}
}

async function handleRequest(request) {
	// Get the URL of the RSS feed from the request query parameters
	const url = new URL(request.url)
	const feedUrl = url.searchParams.get('url')

	// Fetch the RSS feed
	const response = await fetch(feedUrl)
	const text = await response.text()

	// Parse the RSS feed and extract the items
	// const parser = new DOMParser()
	// const doc = parser.parseFromString(text, 'text/xml')
	// const doc = htmlparser2.parseDocument(text);
	// const items = doc.querySelectorAll('item')

	// // Create an array of objects representing the items in the RSS feed
	// const data = []
	// items.forEach(item => {
	// 	data.push({
	// 		title: getRssField(item, 'title'),
	// 		link: getRssField(item, 'link'),
	// 		pubDate: getRssField(item, 'pubDate'),
	// 		author: getRssField(item, 'author'),
	// 		description: getRssField(item, 'description')
	// 	})
	// })
	const feed = htmlparser2.parseFeed(text);

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
