import { sourceURL } from './questions.js';
const cache = new Map();
const endpoint = 'https://en.wikipedia.org/w/api.php';
export async function wikiRequest(params, signal) {
  const timeout = AbortSignal.timeout(8000);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const url = new URL(endpoint);
  for (const [k,v] of Object.entries({action:'query',format:'json',formatversion:2,origin:'*',...params})) url.searchParams.set(k,String(v));
  const response = await fetch(url, {signal:combined,credentials:'omit'});
  if (!response.ok) throw new Error(`Wikipedia returned ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.info || 'Wikipedia is unavailable');
  return data;
}
export async function article(title, signal) {
  if (cache.has(title)) return cache.get(title);
  const data = await wikiRequest({prop:'extracts|info',inprop:'url',exintro:1,explaintext:1,exchars:4500,redirects:1,titles:title},signal);
  const page = data.query?.pages?.find(p=>!p.missing && p.extract);
  if (!page) throw new Error('No article extract found');
  const result = {title:page.title, text:page.extract, url:sourceURL(page.title), revision:page.lastrevid};
  cache.set(title,result);
  return result;
}
export async function searchArticles(query, signal) {
  const data=await wikiRequest({list:'search',srsearch:query,srlimit:8,srprop:''},signal);
  return data.query?.search?.map(p=>p.title) || [];
}
