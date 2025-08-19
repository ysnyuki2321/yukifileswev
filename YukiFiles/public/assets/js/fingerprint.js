export async function getFingerprint(){
	const data = {
		nav: navigator.userAgent,
		lang: navigator.language,
		platform: navigator.platform,
		cores: navigator.hardwareConcurrency || 0,
		screen: [screen.width, screen.height, screen.colorDepth].join('x')
	};
	const raw = JSON.stringify(data);
	return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(buf=>{
		return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
	});
}
