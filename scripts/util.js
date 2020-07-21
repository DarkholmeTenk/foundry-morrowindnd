import { getLoggerFactory } from "../../dc-base/scripts/util.js"

export const getLogger = getLoggerFactory("MorrowinDnD")

export async function nAsync(n, fun) {
	let array = Array(n).fill(" ")
	return await Promise.all(array.map(async ()=>await fun()))
}