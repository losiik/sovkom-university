export default async function GetDataFromApi(url) {
    const res = await fetch(url)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
 
  return res.json()
}